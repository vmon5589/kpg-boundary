(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, attrs = {}, html) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") n.className = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    }
    if (html != null) n.innerHTML = html;
    return n;
  };
  const SVGNS = "http://www.w3.org/2000/svg";

  const sites = KT.sites;
  const byId = Object.fromEntries(sites.map(s => [s.id, s]));
  const chicx = byId.chicxulub;

  const KIND_LABEL = {
    cretaceous: "Cretaceous",
    paleogene: "Paleogene",
    boundary: "K-Pg boundary",
    impact: "Impact product"
  };
  const KIND_COLOR = { cretaceous: "#7aa8d6", paleogene: "#93c47d", boundary: "#e9c64b", impact: "#e8743f" };
  const TYPE_COLOR = { impact: "#e8743f", marine: "#7aa8d6", land: "#93c47d" };

  const state = {
    view: "overview",
    mode: "explore",
    siteId: null,
    pinned: null,
    hover: null,
    zoom: "fit",
    trailIndex: 0,
    sheet: "peek" // phone bottom sheet: peek | half | full
  };
  const phoneMQ = window.matchMedia("(max-width: 860px)");
  const isPhone = () => phoneMQ.matches;
  const canHover = window.matchMedia("(hover: hover)").matches;
  const SHEET_ORDER = ["peek", "half", "full"];
  function setSheet(s) {
    state.sheet = s;
    document.body.dataset.sheet = s;
    const label = $("#sheetLabel"), grab = $("#sheetGrab");
    if (label) label.textContent = s === "full" ? "Close" : "More";
    if (grab) grab.setAttribute("aria-label", s === "full" ? "Collapse details" : "Show more details");
  }

  // ---------- geometry helpers ----------
  const toRad = d => d * Math.PI / 180;
  function distanceKm(a, b) {
    const R = 6371;
    const dLat = toRad(b[0] - a[0]), dLng = toRad(b[1] - a[1]);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function greatCircle(a, b, n = 64) {
    const [la1, lo1, la2, lo2] = [a[0], a[1], b[0], b[1]].map(toRad);
    const d = 2 * Math.asin(Math.sqrt(Math.sin((la2 - la1) / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin((lo2 - lo1) / 2) ** 2));
    const pts = [];
    let prev = null;
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      const A = Math.sin((1 - f) * d) / Math.sin(d), B = Math.sin(f * d) / Math.sin(d);
      const x = A * Math.cos(la1) * Math.cos(lo1) + B * Math.cos(la2) * Math.cos(lo2);
      const y = A * Math.cos(la1) * Math.sin(lo1) + B * Math.cos(la2) * Math.sin(lo2);
      const z = A * Math.sin(la1) + B * Math.sin(la2);
      let lat = Math.atan2(z, Math.hypot(x, y)) * 180 / Math.PI;
      let lng = Math.atan2(y, x) * 180 / Math.PI;
      if (prev != null) { while (lng - prev > 180) lng -= 360; while (prev - lng > 180) lng += 360; }
      prev = lng;
      pts.push([lat, lng]);
    }
    return pts;
  }
  // Show far-east sites (New Zealand) west of the Americas so all sites fit one view.
  const mapLatLng = s => [s.latlng[0], s.latlng[1] > 100 ? s.latlng[1] - 360 : s.latlng[1]];

  function layerSpan(layer) {
    const ys = layer.poly.map(p => p[1]);
    return [Math.min(...ys), Math.max(...ys)];
  }

  // ---------- Map ----------
  let map = null, distLayer = null;
  const markers = {};

  function initMap() {
    if (typeof L === "undefined") {
      const fb = $("#mapFallback");
      fb.hidden = false;
      fb.innerHTML = "<p style='color:var(--muted)'>The map could not load (offline?). Choose a site from the list.</p>";
      return;
    }
    map = L.map("map", { zoomControl: true, worldCopyJump: false, minZoom: 1, attributionControl: true });
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 12,
      attribution: "Imagery © Esri, Maxar, Earthstar Geographics"
    }).addTo(map);

    // Crater ring (~180 km across)
    L.circle(chicx.latlng, { radius: 90000, color: "#e8743f", weight: 2, fillColor: "#e8743f", fillOpacity: .15 }).addTo(map);
    L.circleMarker(chicx.latlng, { radius: 14, color: "#e8743f", weight: 2, fill: false, className: "pulse", interactive: false }).addTo(map);

    sites.forEach(s => {
      const m = L.circleMarker(mapLatLng(s), {
        radius: s.type === "impact" ? 9 : 7,
        color: "#13110f", weight: 2,
        fillColor: TYPE_COLOR[s.type], fillOpacity: 1
      }).addTo(map);
      m.bindTooltip(`<b>${s.name}</b><br>${s.typeLabel}`, { className: "site-tip", direction: "top", offset: [0, -8] });
      m.on("click", () => selectSite(s.id));
      markers[s.id] = m;
    });

    const legend = L.control({ position: "bottomleft" });
    legend.onAdd = () => {
      const d = L.DomUtil.create("div", "map-legend");
      d.innerHTML = `<div><i style="background:${TYPE_COLOR.impact}"></i>Impact crater</div>
        <div><i style="background:${TYPE_COLOR.marine}"></i>Ocean sediments</div>
        <div><i style="background:${TYPE_COLOR.land}"></i>Land sediments</div>`;
      return d;
    };
    legend.addTo(map);
    fitWorld(false);
  }

  function fitWorld(animate = true) {
    if (!map) return;
    const b = L.latLngBounds(sites.map(mapLatLng));
    map.fitBounds(b, { padding: [40, 40], animate });
  }

  function focusSiteOnMap(site) {
    if (!map) return;
    if (distLayer) { map.removeLayer(distLayer); distLayer = null; }
    const pane = $(".map-pane");
    const strip = 120; // visible strip above the card
    const opts = { paddingTopLeft: [30, 30], paddingBottomRight: [30, Math.max(40, pane.clientHeight - strip)], animate: true, maxZoom: 6 };
    if (window.innerWidth <= 860) { opts.paddingBottomRight = [30, 30]; }
    if (site.id === "chicxulub") {
      map.fitBounds(L.latLng(chicx.latlng).toBounds(700000), opts);
      return;
    }
    const pts = greatCircle(chicx.latlng, mapLatLng(site));
    const line = L.polyline(pts, { color: "#e9c64b", weight: 2, dashArray: "6 6", opacity: .95 });
    const km = Math.round(distanceKm(chicx.latlng, site.latlng) / 10) * 10;
    line.bindTooltip(`${km.toLocaleString()} km from Chicxulub`, { permanent: true, className: "dist-tip", direction: "center" });
    distLayer = L.layerGroup([line]).addTo(map);
    map.fitBounds(L.latLngBounds(pts), opts);
  }

  // ---------- Overview ----------
  function renderOverview() {
    const ov = $("#overview");
    const groups = [
      ["The impact site", s => s.type === "impact"],
      ["Ancient seafloor", s => s.type === "marine"],
      ["Ancient land", s => s.type === "land"]
    ];
    ov.innerHTML = `
      <h2>A thin layer of rock records the day the Mesozoic ended.</h2>
      <p class="lede">Around the world, a layer of clay marks a moment 66 million years ago. Below it are dinosaurs, giant forams, and
      Cretaceous forests. Above it, most of those species are gone. Pick a site and climb up through its layers, from the Cretaceous into the age of mammals.</p>
      <p class="name-note">Geologists call this layer the <b>K-Pg boundary</b> (Cretaceous–Paleogene). Older books and worksheets use its former name, the K-T (Cretaceous–Tertiary) boundary.</p>
      <div class="how">
        <div><b>1 · Choose a site</b>Click a dot on the map or a card below.</div>
        <div><b>2 · Explore the layers</b>Hover (or tap) a layer of the core or cliff. Use <kbd>↑</kbd><kbd>↓</kbd> to move through time.</div>
        <div><b>3 · Build the case</b>The Trail of Evidence follows the clues in the order scientists found them.</div>
      </div>
      <p class="name-note">New to rock cores? Start with the background: ${learnLink("core", "How to read a core")}</p>
      <div id="groups"></div>
      <div class="cta">
        <p><b>How did scientists figure it out?</b> Follow 14 clues, from big forams vanishing in Italy to a crater buried in Mexico, and watch the evidence add up across seven fields of science.</p>
        <button class="btn" id="ctaTrail" type="button">Start the Trail of Evidence →</button>
      </div>`;
    const g = $("#groups", ov);
    groups.forEach(([title, fn]) => {
      g.appendChild(el("div", { class: "group-title" }, title));
      const list = el("div", { class: "site-list" });
      sites.filter(fn).forEach(s => {
        const b = el("button", { class: "site-btn", type: "button" },
          `<span class="dot ${s.type}"></span><strong>${s.name}${s.image ? '<span class="photo">● photo</span>' : ""}</strong><span class="sub">${s.place}</span>`);
        b.addEventListener("click", () => selectSite(s.id));
        b.addEventListener("mouseenter", () => markers[s.id] && markers[s.id].openTooltip());
        b.addEventListener("mouseleave", () => markers[s.id] && markers[s.id].closeTooltip());
        list.appendChild(b);
      });
      g.appendChild(list);
    });
    $("#ctaTrail", ov).addEventListener("click", () => setMode("trail"));
  }

  // ---------- Site selection ----------
  function selectSite(id, opts = {}) {
    const site = byId[id];
    const changed = state.siteId !== id;
    state.siteId = id;
    state.view = "site";
    state.hover = null;
    state.pinned = opts.layer || null;
    document.body.dataset.view = "site";
    if (changed) setSheet(state.mode === "trail" ? "half" : "peek");
    $("#overview").hidden = true;
    $("#viewer").hidden = false;
    if (changed || opts.force) renderViewer(site);
    else { updateActive(); renderCard(); }
    if (changed) setTimeout(() => focusSiteOnMap(site), 80);
    if (map) setTimeout(() => map.invalidateSize(), 650);
    if (state.pinned) requestAnimationFrame(() => scrollToLayer(state.pinned));
  }

  function backToMap() {
    state.view = "overview";
    state.siteId = null; state.pinned = null; state.hover = null;
    document.body.dataset.view = "overview";
    $("#overview").hidden = false;
    $("#viewer").hidden = true;
    if (distLayer && map) { map.removeLayer(distLayer); distLayer = null; }
    if (map) setTimeout(() => { map.invalidateSize(); fitWorld(); }, 620);
  }

  // ---------- Viewer ----------
  let layoutInfo = null;
  // Width of the diagram column, as a fraction of its height, when it sits beside a photo.
  const DIAG_RATIO = 0.2;
  const LEADER = 30;

  function renderViewer(site) {
    const km = site.id === "chicxulub" ? null : Math.round(distanceKm(chicx.latlng, site.latlng) / 10) * 10;
    const hasPhoto = !!site.image;
    const hasDiagram = site.layers.some(l => l.h);
    const dual = hasPhoto && hasDiagram;
    const credit = site.imageCredit
      ? `<span>Photo: ${site.imageCreditUrl ? `<a href="${site.imageCreditUrl}" target="_blank" rel="noopener">${site.imageCredit}</a>` : site.imageCredit}</span>` : "";
    const diagramNote = hasDiagram ? `<span>Diagram: ${site.schematicTitle || "simplified section"}</span>` : "";
    $("#viewerHead").innerHTML = `
      <div>
        <div class="eyebrow"><span class="dot ${site.type}" style="width:8px;height:8px;border-radius:50%;display:inline-block"></span>${site.typeLabel}</div>
        <h2>${site.name}</h2>
        <div class="meta">
          <span>${site.place}</span>
          ${km ? `<span><b>${km.toLocaleString()} km</b> from Chicxulub</span>` : ""}
          <span class="thick">${site.boundaryThickness}</span>
        </div>
        ${credit || diagramNote ? `<div class="meta credits" style="margin-top:2px">${credit}${diagramNote}</div>` : ""}
      </div>
      <button type="button" class="back-inline" id="backInline">← Map</button>
      <div class="zoom-toggle" role="group" aria-label="Column size">
        <button type="button" data-z="fit" aria-pressed="${state.zoom === "fit"}">Fit</button>
        <button type="button" data-z="zoom" aria-pressed="${state.zoom === "zoom"}">Zoom</button>
      </div>`;
    $("#backInline").addEventListener("click", () => $("#backBtn").click());
    $("#viewerHead").querySelectorAll(".zoom-toggle button").forEach(b =>
      b.addEventListener("click", () => {
        state.zoom = b.dataset.z;
        $("#viewerHead").querySelectorAll(".zoom-toggle button").forEach(x => x.setAttribute("aria-pressed", x === b));
        layoutStrata();
      }));

    const strata = $("#strata");
    strata.innerHTML = "";
    strata.style.gridTemplateColumns = dual ? "auto auto auto" : "";
    const labels = el("div", { class: `labels${dual ? " dual" : ""}` });
    layoutInfo = { site, labels, dual, pendingScroll: true, photoCol: null, diagCol: null, aspect: null, natural: 9999, photoSpans: null, diagSpans: null };

    if (hasDiagram) {
      const diagCol = el("div", { class: "column diagram" });
      const total = site.layers.reduce((a, l) => a + (l.h || 0), 0);
      let acc = 0;
      layoutInfo.diagSpans = site.layers.map(layer => {
        const top = acc / total * 100, h = (layer.h || 0) / total * 100;
        acc += layer.h || 0;
        const b = el("div", {
          class: `layer-block pat-${layer.pattern || "mud"}`,
          style: `top:${top}%;height:${h}%;--hl:${KIND_COLOR[layer.kind]}`,
          tabindex: "0", role: "button", "aria-label": layer.name
        });
        b.dataset.layer = layer.id;
        bindLayerEvents(b, layer.id);
        diagCol.appendChild(b);
        return [top, top + h];
      });
      if (dual) diagCol.appendChild(el("span", { class: "col-tag" }, "Diagram"));
      layoutInfo.diagCol = diagCol;
    }

    if (hasPhoto) {
      const photoCol = el("div", { class: "column" });
      const img = el("img", { src: site.image, alt: site.imageAlt || site.name, draggable: "false" });
      const svg = document.createElementNS(SVGNS, "svg");
      svg.setAttribute("class", "hot");
      svg.setAttribute("viewBox", "0 0 100 100");
      svg.setAttribute("preserveAspectRatio", "none");
      site.layers.filter(l => l.poly).forEach(layer => {
        const p = document.createElementNS(SVGNS, "polygon");
        p.setAttribute("points", layer.poly.map(pt => pt.join(",")).join(" "));
        p.setAttribute("class", layer.kind);
        p.setAttribute("tabindex", "0");
        p.setAttribute("role", "button");
        p.setAttribute("aria-label", layer.name);
        p.dataset.layer = layer.id;
        bindLayerEvents(p, layer.id);
        svg.appendChild(p);
      });
      photoCol.append(img, svg);
      if (dual) photoCol.appendChild(el("span", { class: "col-tag" }, site.photoTag || "Photo"));
      layoutInfo.photoCol = photoCol;
      layoutInfo.photoSpans = site.layers.map(l => l.poly ? layerSpan(l) : null);
      strata.append(photoCol, labels);
      if (dual) strata.append(layoutInfo.diagCol);
      const done = () => { layoutInfo.aspect = img.naturalWidth / img.naturalHeight; layoutInfo.natural = img.naturalWidth; layoutStrata(); };
      if (img.complete && img.naturalWidth) done(); else img.addEventListener("load", done);
    } else {
      strata.append(layoutInfo.diagCol, labels);
      layoutInfo.aspect = 0.42;
      layoutStrata();
    }

    renderStepper(site);
    renderCard();
    updateActive();
  }

  const sheetPx = v => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(v)) || 0;
  const trailPx = () => state.mode === "trail" && isPhone() ? $("#trailbar").offsetHeight : 0;

  function layoutStrata() {
    if (!layoutInfo || !layoutInfo.aspect) return;
    const { photoCol, diagCol, labels, aspect, photoSpans, diagSpans, dual, site } = layoutInfo;
    const main = photoCol || diagCol;
    const mainSpans = photoSpans || diagSpans;
    const scroller = $("#strataScroll");
    if (!scroller.clientWidth) return; // viewer hidden
    const availH = scroller.clientHeight - (isPhone() ? 30 + sheetPx("--peek") + trailPx() : 42);
    const labelW = (window.innerWidth <= 420 ? 128 : window.innerWidth <= 860 ? 140 : 175) + (dual ? LEADER + 4 : 0);
    const availW = scroller.clientWidth - 20 - labelW;
    const ratio = aspect + (dual ? DIAG_RATIO : 0); // total column width per unit height
    const maxH = Math.max(160, availW / ratio);
    let h;
    if (state.zoom === "fit") {
      h = Math.min(Math.max(260, availH), maxH);
    } else {
      h = Math.min(maxH, Math.min(Math.max(layoutInfo.natural, 380), 640) / aspect);
      h = Math.max(h, Math.min(availH * 1.6, maxH));
    }
    const w = h * aspect, dw = dual ? h * DIAG_RATIO : 0;
    main.style.width = w + "px";
    main.style.height = h + "px";
    if (dual) { diagCol.style.width = dw + "px"; diagCol.style.height = h + "px"; }
    labels.style.height = h + "px";
    labels.style.width = labelW + "px";
    $("#strata").style.width = (w + labelW + dw) + "px";

    // Labels: anchor each at its layer's middle (averaged across photo and diagram when both show it),
    // then push apart (using measured heights) so they don't overlap.
    const mid = s => s ? (s[0] + s[1]) / 200 * h : null;
    labels.innerHTML = "";
    const items = site.layers.map((layer, i) => {
      const left = mid(mainSpans[i]);
      const right = dual ? mid(diagSpans[i]) : null;
      const both = [left, right].filter(v => v != null);
      return { layer, left, right, y: both.reduce((a, v) => a + v, 0) / both.length };
    });
    layoutInfo.anchors = items.map(it => it.y / h);
    const nodes = items.map(it => {
      const lab = el("div", { class: "lbl-item", style: `padding-left:${LEADER + 4}px;visibility:hidden` },
        `<span class="sw ${it.layer.kind}"></span><span>${it.layer.name}</span>`);
      lab.dataset.layer = it.layer.id;
      bindLayerEvents(lab, it.layer.id);
      labels.appendChild(lab);
      return lab;
    });
    const hs = nodes.map(n => n.offsetHeight + 6);
    const ys = items.map(it => it.y);
    for (let i = 1; i < ys.length; i++) ys[i] = Math.max(ys[i], ys[i - 1] + (hs[i - 1] + hs[i]) / 2);
    const last = ys.length - 1;
    if (last >= 0) ys[last] = Math.min(ys[last], h - hs[last] / 2);
    for (let i = last - 1; i >= 0; i--) ys[i] = Math.min(ys[i], ys[i + 1] - (hs[i] + hs[i + 1]) / 2);
    for (let i = 0; i <= last; i++) ys[i] = Math.max(ys[i], hs[i] / 2, i ? ys[i - 1] + (hs[i - 1] + hs[i]) / 2 : 0);

    const svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("width", labelW); svg.setAttribute("height", h);
    svg.style.cssText = "position:absolute;left:0;top:0;overflow:visible;pointer-events:none";
    labels.prepend(svg);
    const leader = (d, id) => {
      const path = document.createElementNS(SVGNS, "path");
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "rgba(241,233,222,.3)");
      path.dataset.layer = id;
      svg.appendChild(path);
    };
    items.forEach((it, i) => {
      if (it.left != null) leader(`M0 ${it.left} H10 L24 ${ys[i]} H30`, it.layer.id);
      if (it.right != null) {
        const x = labelW;
        leader(`M${x} ${it.right} H${x - 10} L${x - 24} ${ys[i]} H${x - 30}`, it.layer.id);
      }
      nodes[i].style.top = ys[i] + "px";
      nodes[i].style.visibility = "";
    });
    updateActive();
    // first layout of a site (e.g. arriving from a trail clue): bring the chosen layer into view
    if (layoutInfo.pendingScroll) {
      layoutInfo.pendingScroll = false;
      if (state.pinned) requestAnimationFrame(() => scrollToLayer(state.pinned));
    }
  }

  let leaveTimer = null;
  function bindLayerEvents(node, id) {
    node.addEventListener("mouseenter", () => { clearTimeout(leaveTimer); if (state.hover !== id) { state.hover = id; updateActive(); renderCard(); } });
    node.addEventListener("mouseleave", () => {
      clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => { state.hover = null; updateActive(); renderCard(); }, 90);
    });
    node.addEventListener("click", e => { e.stopPropagation(); pin(id); });
    node.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pin(id); } });
  }

  function pin(id, scroll = false) {
    state.pinned = id;
    state.hover = null;
    updateActive();
    renderCard();
    if (isPhone()) {
      if (state.sheet === "peek") setSheet("half");
      requestAnimationFrame(() => scrollToLayer(id));
    } else if (scroll) scrollToLayer(id);
  }

  function scrollToLayer(id) {
    if (!layoutInfo || !layoutInfo.anchors) return;
    const i = layoutInfo.site.layers.findIndex(l => l.id === id);
    if (i < 0) return;
    const scroller = $("#strataScroll");
    const h = layoutInfo.labels.offsetHeight;
    const mid = layoutInfo.anchors[i] * h;
    let visible = scroller.clientHeight;
    if (isPhone()) {
      const sr = scroller.getBoundingClientRect(), cr = $("#card").getBoundingClientRect();
      // the sheet animates its height, so use the target height for the current state
      const target = { peek: sheetPx("--peek"), half: window.innerHeight * 0.46, full: cr.height }[state.sheet] || cr.height;
      visible = Math.max(120, Math.min(sr.height, window.innerHeight - target - trailPx() - sr.top));
    }
    scroller.scrollTop = Math.max(0, mid - visible / 2 + 18);
  }

  function renderStepper(site) {
    const st = $("#stepper");
    st.innerHTML = `
      <div class="st-title">Move through time</div>
      <div class="nav">
        <button type="button" id="stepUp" title="Younger layer (↑)">▲ Younger</button>
        <button type="button" id="stepDown" title="Older layer (↓)">▼ Older</button>
      </div>
      <div class="st-title" style="margin-top:8px">Layers, youngest first</div>
      <ol>${site.layers.map(l => `<li><button type="button" data-layer="${l.id}"><span class="sw ${l.kind}" style="width:7px;height:7px;border-radius:50%;flex:none;display:inline-block"></span>${l.name}</button></li>`).join("")}</ol>
      <div class="kbd"><kbd>↑</kbd> <kbd>↓</kbd> step · <kbd>Esc</kbd> map<br>Tip: start at the bottom and climb up through time.</div>`;
    st.querySelectorAll("li button").forEach(b => {
      b.addEventListener("click", () => pin(b.dataset.layer, true));
      b.addEventListener("mouseenter", () => { state.hover = b.dataset.layer; updateActive(); renderCard(); });
      b.addEventListener("mouseleave", () => { state.hover = null; updateActive(); renderCard(); });
    });
    $("#stepUp").addEventListener("click", () => step(-1));
    $("#stepDown").addEventListener("click", () => step(1));
  }

  // dir -1 = younger (up), +1 = older (down)
  function step(dir) {
    const site = byId[state.siteId];
    if (!site) return;
    const n = site.layers.length;
    let i = site.layers.findIndex(l => l.id === state.pinned);
    if (i < 0) i = dir < 0 ? n - 1 : 0;
    else i = Math.min(n - 1, Math.max(0, i + dir));
    pin(site.layers[i].id, true);
  }

  function updateActive() {
    const active = state.hover || state.pinned;
    document.querySelectorAll("#strata [data-layer], #stepper [data-layer]").forEach(n => {
      const on = n.dataset.layer === active;
      n.classList.toggle("on", on);
      if (n.tagName === "path") n.setAttribute("stroke", on ? "rgba(241,233,222,.95)" : "rgba(241,233,222,.3)");
    });
  }

  // ---------- Card ----------
  let lastCardKey = "";
  function renderCard() {
    const card = $("#card");
    const site = byId[state.siteId];
    if (!site) return;
    const trailStep = state.mode === "trail" ? KT.trail[state.trailIndex] : null;
    const conclusion = state.mode === "trail" && state.trailIndex >= KT.trail.length;
    const layerId = state.hover || state.pinned;
    const layer = site.layers.find(l => l.id === layerId);
    const key = `${site.id}|${layerId}|${state.mode}|${state.trailIndex}`;
    if (key === lastCardKey) return;
    lastCardKey = key;

    let html = "";
    if (conclusion) {
      html += cardFigure(chicx);
      html += `<div class="clue-banner"><div class="eyebrow">Conclusion</div><h3>${KT.conclusion.title}</h3><p>${KT.conclusion.text}</p></div>
        <div class="ask"><strong>Think about it</strong><p>${KT.conclusion.question}</p>
        <details><summary>Show answer</summary><p>${KT.conclusion.answer}</p></details></div>`;
    } else if (trailStep && trailStep.site === site.id && (!layer || layer.id === trailStep.layer)) {
      html += `<div class="clue-banner"><div class="eyebrow">Clue ${state.trailIndex + 1} of ${KT.trail.length} · ${trailStep.year}</div>
        <h3>${trailStep.title}</h3><p>${trailStep.text}</p>
        <div class="chips" style="margin-top:8px">${chips(trailStep.disciplines)}</div>
        ${trailStep.learn ? learnLink(trailStep.learn.topic, trailStep.learn.label) : ""}</div>`;
    }

    if (layer) {
      html += `
        <div class="eyebrow"><span class="tag ${layer.kind}">${KIND_LABEL[layer.kind]}</span><span>${layer.age}</span>${layer.depth ? `<span>· ${layer.depth}</span>` : ""}</div>
        <h2>${layer.name}</h2>
        <p class="place">${site.name}, ${site.place}</p>
        ${site.cardImage && !layer.figures ? cardFigure(site, true) : ""}
        <h3>What you’re seeing</h3><p>${layer.what}</p>
        ${layer.figures ? coreFigures(layer.figures, site) : ""}
        ${layer.showDiscovery && site.discovery ? discoveryBlock(site.discovery, true) : ""}
        <h3>Why it matters</h3><p>${layer.why}</p>
        ${layer.evidence ? `<div class="evidence"><div><span class="lbl">Evidence</span><p>${layer.evidence}</p></div><div><span class="lbl">What it suggests</span><p>${layer.suggests}</p></div></div>` : ""}
        ${layer.forams ? foramGallery(layer.forams) : ""}
        ${layer.chart ? miniChart(KT.charts[layer.chart], !layer.forams) : ""}
        ${(layer.asks || (layer.ask ? [layer.ask] : [])).map(a => `<div class="ask"><strong>Think about it</strong><p>${a.q}</p><details><summary>Show answer</summary><p>${a.a}</p></details></div>`).join("")}
        <h3>Fields of science</h3><div class="chips">${chips(layer.disciplines)}</div>`;
    } else if (!conclusion) {
      html += `
        <div class="eyebrow"><span class="dot ${site.type}" style="width:8px;height:8px;border-radius:50%;display:inline-block"></span>${site.typeLabel}</div>
        <h2>${site.name}</h2>
        <p class="place">${site.place}</p>
        ${cardFigure(site)}
        <p>${site.summary}</p>
        ${site.imageCredit ? `<p class="phone-credit">Photo: ${site.imageCreditUrl ? `<a href="${site.imageCreditUrl}" target="_blank" rel="noopener">${site.imageCredit}</a>` : site.imageCredit}</p>` : ""}
        <p class="phone-credit">${site.boundaryThickness}</p>
        <h3>Why this site matters</h3><p>${site.why}</p>
        ${site.discovery ? discoveryBlock(site.discovery) : ""}
        ${site.core ? coreStory(site) : ""}
        ${site.quickLinks ? `<h3>See the fossil forams</h3><div class="quick-links">${site.quickLinks.map(q => `<button type="button" class="btn ghost" data-pin="${q.layer}">${q.label} →</button>`).join("")}</div>` : ""}
        <p class="hint">${canHover ? "Hover" : "Tap"} a layer in the ${site.image ? (site.layers.some(l => l.h) ? "photo or diagram" : "photo") : "diagram"} to see what it is. Start at the bottom, in the Cretaceous, and climb up through time with ${canHover ? "<kbd>↑</kbd>" : "▲"}.
          ${learnLink("core", "New to this? How to read a core")}</p>`;
    }
    $("#cardBody").innerHTML = html;
    card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap");
    card.scrollTop = 0;
  }

  function cardFigure(site, small = false) {
    if (!site.cardImage) return "";
    return `<figure class="card-figure${small ? " small" : ""}"><img src="${site.cardImage}" alt="${site.cardImageAlt || site.name}">
      ${site.cardImageCredit ? `<figcaption>${site.cardImageCredit}</figcaption>` : ""}</figure>`;
  }

  // Drill-core photos attached to a layer, shown full width with their depth.
  function coreFigures(figs, site) {
    return `<h3>From the drill core</h3>` + figs.map(f => `
      <figure class="core-fig">
        <a href="${f.src}" target="_blank" rel="noopener" title="Open full size"><img src="${f.src}" alt="${f.label}" loading="lazy"></a>
        <figcaption><b>${f.label}</b> <span class="depth">${f.depth} below the seafloor</span><br>${f.caption}</figcaption>
      </figure>`).join("") + (site.core ? `<p class="core-credit">${site.core.credit}</p>` : "");
  }

  // The 1991 shocked-quartz image that confirmed the crater. `compact` = shown under a layer, for comparison.
  function discoveryBlock(d, compact = false) {
    return `<h3>${compact ? "Compare: the 1991 discovery" : d.title}</h3>
      <figure class="core-fig">
        <a href="${d.src}" target="_blank" rel="noopener" title="Open full size"><img src="${d.src}" alt="${d.alt}" loading="lazy"></a>
        <figcaption><b>${d.label}</b>${compact ? `<br>${d.text[1]}` : ""}</figcaption>
      </figure>
      ${compact ? "" : d.text.map(t => `<p>${t}</p>`).join("")}
      <p class="core-credit"><a href="${d.creditUrl}" target="_blank" rel="noopener">${d.credit}</a></p>`;
  }

  // Site-level summary of a drill core, with thumbnails that jump to the layer each photo came from.
  function coreStory(site) {
    const c = site.core;
    const thumbs = site.layers.flatMap(l => (l.figures || []).map(f => ({ f, l })));
    return `<h3>${c.title}</h3>${c.text.map(t => `<p>${t}</p>`).join("")}
      <div class="core-thumbs">${thumbs.map(({ f, l }) => `
        <button type="button" data-pin="${l.id}" title="${l.name}">
          <img src="${f.src}" alt="${f.label}" loading="lazy"><span>${f.label}<i>${f.depth}</i></span>
        </button>`).join("")}</div>
      <h3>Why this core matters</h3><p>${c.why}</p>
      <p class="core-credit">${c.credit}</p>`;
  }

  // Foram tiles share one pixel scale, so equal tile widths keep sizes comparable.
  function foramGallery(which) {
    const F = KT.forams;
    const row = (age, title) => {
      const cards = F.cards.filter(c => c.age === age);
      return `<div class="foram-row"><div class="foram-row-title"><span class="sw ${age === "tertiary" ? "paleogene" : "cretaceous"}"></span>${title} · ${cards.length} specimens</div>
        <div class="foram-grid">${cards.map(c => `<figure class="foram" title="Card ${c.n}: ${c.name}">
          <img src="image/forams/card${String(c.n).padStart(2, "0")}.jpg" alt="${c.name}" loading="lazy">
          <figcaption><b>${c.n}</b> <i>${c.name}</i></figcaption></figure>`).join("")}</div></div>`;
    };
    const rows = which === "both"
      ? row("tertiary", "Above the boundary: Paleogene") + row("cretaceous", "Below the boundary: Cretaceous")
      : which === "tertiary" ? row("tertiary", "Forams found in this layer: Paleogene") : row("cretaceous", "Forams found in this layer: Cretaceous");
    return `<div class="foram-gallery"><h3>${which === "both" ? "Compare the forams across the boundary" : "Forams from this layer"}</h3>
      ${rows}
      <div class="foram-scale"><span style="width:calc(var(--tile) * ${F.scaleBarFraction})"></span>0.1 mm · every specimen is shown at the same scale</div>
      <div class="src">${F.source}</div>
      ${learnLink("abundance", "Learn more: how forams change through a core")}</div>`;
  }

  const learnLink = (topic, label) =>
    `<a class="learn-link" href="#learn=${topic}" data-learn="${topic}">${label} →</a>`;

  function chips(list = []) {
    return list.map(k => {
      const d = KT.disciplines[k];
      return `<span class="chip"><i style="background:${d.color}"></i>${d.label}</span>`;
    }).join("");
  }

  function miniChart(c, withLearn = true) {
    if (!c) return "";
    const max = Math.max(...c.bars.map(b => b.value));
    const fmt = v => (c.unit === "mm" ? v.toFixed(3) : v) + (c.unit === "%" ? "%" : "");
    return `<div class="mini-chart" role="img" aria-label="${c.title}">
      <div class="ttl">${c.title}</div>
      ${c.bars.map(b => `<div class="bar-row" title="${b.label}: ${fmt(b.value)} ${c.unit === "%" ? "" : c.unit}">
          <span class="lb">${b.label}</span>
          <span class="track"><span class="fill ${b.tone}" style="display:block;width:${(b.value / max * 100).toFixed(1)}%"></span></span>
          <span class="val">${fmt(b.value)}</span></div>`).join("")}
      ${c.note ? `<div class="src" style="color:var(--ink-2)">${c.note}</div>` : ""}
      <div class="src">Source: ${c.source}</div>
      ${withLearn ? learnLink("abundance", "Learn more: how species abundance changes through a core") : ""}</div>`;
  }

  // ---------- Trail of Evidence ----------
  function setMode(mode, topic) {
    const wasLearn = state.mode === "learn";
    state.mode = mode;
    document.body.dataset.mode = mode;
    $("#modeExplore").setAttribute("aria-selected", mode === "explore");
    $("#modeTrail").setAttribute("aria-selected", mode === "trail");
    $("#modeLearn").setAttribute("aria-selected", mode === "learn");
    const bar = $("#trailbar");
    lastCardKey = "";
    $(".stage").hidden = mode === "learn";
    $("#learn").hidden = mode !== "learn";
    if (mode === "learn") {
      bar.hidden = true;
      document.documentElement.style.setProperty("--trail-h", "0px");
      state.learnTopic = KTLearn.render(topic || state.learnTopic || "extinction", learnBack());
      history.replaceState(null, "", "#learn=" + state.learnTopic);
      return;
    }
    if (wasLearn) { learnReturn = null; history.replaceState(null, "", location.pathname + location.search); }
    if (mode === "trail") {
      bar.hidden = false;
      goTrail(0);
    } else {
      bar.hidden = true;
      document.documentElement.style.setProperty("--trail-h", "0px");
      if (state.view === "site") renderCard();
    }
    if (map) setTimeout(() => map.invalidateSize(), 50);
    setTimeout(layoutStrata, 60);
  }

  // ---------- Background info ----------
  // learnReturn remembers where a "learn more" link was clicked, so the page can offer a way back.
  let learnReturn = null;
  function learnBack() {
    if (!learnReturn) return null;
    const r = learnReturn;
    const label = r.mode === "trail" ? (r.trailIndex < KT.trail.length ? `Back to clue ${r.trailIndex + 1}` : "Back to the verdict")
      : r.view === "site" ? `Back to ${byId[r.siteId].name}` : "Back to the map";
    return { label, go: () => {
      learnReturn = null;
      if (r.mode === "trail") { setMode("trail"); goTrail(r.trailIndex); }
      else {
        setMode("explore");
        if (r.view === "site") selectSite(r.siteId, { layer: r.pinned });
        else backToMap();
      }
    } };
  }
  function openLearn(topic, opts = {}) {
    if (!opts.keepBack) {
      learnReturn = state.mode === "learn" ? null
        : { mode: state.mode, view: state.view, siteId: state.siteId, pinned: state.pinned, trailIndex: state.trailIndex };
    }
    setMode("learn", topic);
  }
  function openSite(id, layer) {
    learnReturn = null;
    setMode("explore");
    selectSite(id, { layer: layer || null });
  }
  function openTrail() {
    learnReturn = null;
    setMode("trail");
  }
  window.KTApp = { openLearn, openSite, openTrail };

  function goTrail(i) {
    const n = KT.trail.length;
    state.trailIndex = Math.max(0, Math.min(n, i));
    lastCardKey = "";
    if (state.trailIndex < n) {
      const s = KT.trail[state.trailIndex];
      selectSite(s.site, { layer: s.layer });
      renderCard();
    } else {
      selectSite("chicxulub", { layer: null });
      state.pinned = null;
      updateActive();
      renderCard();
    }
    renderTrailBar();
  }

  function renderTrailBar() {
    const n = KT.trail.length, i = state.trailIndex;
    const seen = KT.trail.slice(0, Math.min(i + 1, n));
    const counts = {};
    seen.forEach(s => s.disciplines.forEach(d => counts[d] = (counts[d] || 0) + 1));
    const bar = $("#trailbar");
    bar.innerHTML = `
      <div class="trail-nav">
        <button class="btn ghost" id="trPrev" type="button" ${i === 0 ? "disabled" : ""}>← Prev</button>
        <span class="count">${i < n ? `Clue ${i + 1} / ${n}` : "Verdict"}</span>
        <button class="btn" id="trNext" type="button" ${i >= n ? "disabled" : ""}>${i === n - 1 ? "Verdict →" : "Next clue →"}</button>
      </div>
      <div class="trail-progress">
        <div class="meter" aria-label="Evidence collected"><div style="width:${Math.min(100, seen.length / n * 100)}%"></div></div>
        <div class="tally">${Object.entries(KT.disciplines).map(([k, d]) =>
          `<span class="chip ${counts[k] ? "lit" : ""}"><i style="background:${d.color}"></i>${d.label}${counts[k] ? ` <b>${counts[k]}</b>` : ""}</span>`).join("")}</div>
      </div>
      <div style="font-size:12.5px;color:var(--muted);max-width:22ch">Clues collected in the order they were discovered</div>`;
    document.documentElement.style.setProperty("--trail-h", bar.offsetHeight + "px");
    $("#trPrev").addEventListener("click", () => goTrail(i - 1));
    $("#trNext").addEventListener("click", () => goTrail(i + 1));
  }

  // ---------- Wiring ----------
  function init() {
    initMap();
    renderOverview();
    $("#card").addEventListener("click", e => {
      const b = e.target.closest("[data-pin]");
      if (b) pin(b.dataset.pin, true);
    });
    $("#sheetGrab").addEventListener("click", () => {
      const i = SHEET_ORDER.indexOf(state.sheet);
      setSheet(state.sheet === "full" ? "peek" : SHEET_ORDER[i + 1]);
    });
    $("#sheetBar").querySelectorAll("[data-step]").forEach(b =>
      b.addEventListener("click", () => step(+b.dataset.step)));
    // Swipe the sheet bar up/down to resize the sheet
    let y0 = null;
    $("#sheetBar").addEventListener("touchstart", e => { y0 = e.touches[0].clientY; }, { passive: true });
    $("#sheetBar").addEventListener("touchend", e => {
      if (y0 == null) return;
      const dy = e.changedTouches[0].clientY - y0; y0 = null;
      if (Math.abs(dy) < 30) return;
      const i = SHEET_ORDER.indexOf(state.sheet) + (dy < 0 ? 1 : -1);
      setSheet(SHEET_ORDER[Math.max(0, Math.min(2, i))]);
    });
    // Tapping the peeking card opens it
    $("#cardBody").addEventListener("click", e => { if (isPhone() && state.sheet === "peek" && !e.target.closest("a, button")) setSheet("half"); });
    phoneMQ.addEventListener("change", () => setTimeout(layoutStrata, 50));
    setSheet("peek");
    $("#backBtn").addEventListener("click", () => { if (state.mode === "trail") setMode("explore"); backToMap(); });
    $("#modeExplore").addEventListener("click", () => setMode("explore"));
    $("#modeTrail").addEventListener("click", () => setMode("trail"));
    $("#modeLearn").addEventListener("click", () => { if (state.mode !== "learn") { learnReturn = null; setMode("learn"); } });
    document.addEventListener("click", e => {
      const a = e.target.closest("[data-learn]");
      if (a) { e.preventDefault(); openLearn(a.dataset.learn); }
    });
    // Clicking the empty part of the column area clears the pinned layer
    $("#strataScroll").addEventListener("click", e => {
      if (e.target === e.currentTarget || e.target.id === "strata") { state.pinned = null; updateActive(); renderCard(); }
    });

    document.addEventListener("keydown", e => {
      if (e.target.closest && e.target.closest("input, textarea")) return;
      if (state.mode === "learn") return;
      if (state.view === "site" && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault(); step(e.key === "ArrowUp" ? -1 : 1);
      } else if (e.key === "Escape" && state.view === "site") {
        if (state.mode === "trail") setMode("explore");
        backToMap();
      } else if (state.mode === "trail" && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        goTrail(state.trailIndex + (e.key === "ArrowRight" ? 1 : -1));
      }
    });

    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { layoutStrata(); map && map.invalidateSize(); }, 120); });
    // Re-layout once the grid column transition settles
    $(".stage").addEventListener("transitionend", e => { if (e.propertyName === "grid-template-columns") layoutStrata(); });
  }

  init();

  // Deep links, e.g. index.html#site=blake&layer=ejecta or #trail=5 (handy for lesson plans)
  function applyHash() {
    const h = new URLSearchParams(location.hash.slice(1));
    if (h.has("learn")) { if (state.mode !== "learn" || state.learnTopic !== h.get("learn")) openLearn(h.get("learn")); }
    else if (h.has("trail")) { setMode("trail"); goTrail((parseInt(h.get("trail"), 10) || 1) - 1); }
    else if (h.has("site") && byId[h.get("site")]) selectSite(h.get("site"), { layer: h.get("layer") });
  }
  applyHash();
  window.addEventListener("hashchange", applyHash);
})();
