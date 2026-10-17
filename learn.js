// K-Pg Boundary Explorer: "Background info" topics.
// Each topic is a function that returns HTML; topics with interactive parts also get a mount() hook.
// To add a topic later, append to TOPICS below.
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const SVGNS = "http://www.w3.org/2000/svg";

  // ---------- Cartoon forams (shared by both topics) ----------
  // Each returns SVG markup in a 40×40 box. Earliest chambers are drawn first so later ones overlap them.
  const ell = (cx, cy, rx, ry, rot = 0) =>
    `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}"${rot ? ` transform="rotate(${rot.toFixed(0)} ${cx.toFixed(1)} ${cy.toFixed(1)})"` : ""}/>`;
  const SHAPES = {
    // Large keeled disc with chambers coiled around it (Globotruncana)
    globo() {
      let s = `<circle cx="20" cy="20" r="18.5"/><circle cx="20" cy="20" r="16" class="keel"/>`;
      for (let k = 0; k < 6; k++) {
        const a = (k * 60 - 90) * Math.PI / 180, d = 9.2 - k * 0.5;
        s += ell(20 + d * Math.cos(a), 20 + d * Math.sin(a), 6.6 - k * 0.5, 4.6 - k * 0.3, k * 60);
      }
      return s + `<circle cx="20" cy="20" r="2.6"/>`;
    },
    // Two rows of chambers, flaring upward (Heterohelix, Pseudoguembelina)
    hetero() {
      let s = "", y = 38;
      for (let k = 0; k < 8; k++) {
        const rx = 2.2 + k * 0.72, ry = 1.8 + k * 0.42;
        s += ell(20 + (k % 2 ? 1 : -1) * rx * 0.72, y - ry, rx, ry);
        y -= ry * 1.12;
      }
      return s;
    },
    // Tiny cone with three chambers per whorl (Guembelitria)
    guemb() {
      let s = "";
      for (let r = 0; r < 4; r++) {
        const rad = 2.4 + r * 1.25, cy = 35 - r * 7.6;
        [-1, 1, 0].forEach(i => { s += `<circle cx="${(20 + i * rad * 1.05).toFixed(1)}" cy="${(cy + (i ? 0 : 1.2)).toFixed(1)}" r="${rad.toFixed(1)}"/>`; });
      }
      return s + `<path class="ap" d="M17.4 8.6 q2.6 -2.4 5.2 0"/>`;
    },
    // Tiny, simple coil of a few chambers (Parvularugoglobigerina, Palaeoglobigerina)
    parvu() {
      let s = "";
      for (let k = 0; k < 5; k++) {
        const a = (k * 75 + 120) * Math.PI / 180, d = 2.4 + k * 1.7;
        s += `<circle cx="${(19 + d * Math.cos(a)).toFixed(1)}" cy="${(21 + d * Math.sin(a)).toFixed(1)}" r="${(3 + k * 1.35).toFixed(1)}"/>`;
      }
      return s + `<path class="ap" d="M15.5 17 q3 -3 6 0"/>`;
    },
    // Small biserial, round chambers (Woodringina, Chiloguembelina)
    wood() {
      let s = "", y = 38;
      for (let k = 0; k < 6; k++) {
        const r = 2.4 + k * 0.9;
        s += ell(20 + (k % 2 ? 1 : -1) * r * 0.62, y - r, r, r);
        y -= r * 1.15;
      }
      return s + `<path class="ap" d="M18 ${(y + 6).toFixed(1)} q2.5 -2 5 0"/>`;
    },
    // Larger, globular coil (Eoglobigerina, Parasubbotina, Subbotina)
    eog() {
      let s = "";
      [[200, 6.6, 5.6], [290, 7.2, 6.8], [20, 7.6, 8], [110, 8.2, 9.2]].forEach(([deg, d, r]) => {
        const a = deg * Math.PI / 180;
        s += `<circle cx="${(20 + d * Math.cos(a)).toFixed(1)}" cy="${(20 + d * Math.sin(a)).toFixed(1)}" r="${r}"/>`;
      });
      return s + `<path class="ap" d="M15.5 25 q2.8 -3.2 5.6 0"/>`;
    }
  };
  const foramDefs = () => `<defs>${Object.entries(SHAPES).map(([id, f]) =>
    `<symbol id="f-${id}" viewBox="0 0 40 40"><g class="foram-art">${f()}</g></symbol>`).join("")}</defs>`;
  const foramIcon = (id, size = 34) =>
    `<svg class="foram-ico" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true"><use href="#f-${id}"/></svg>`;

  // ---------- Topic 1: The extinction mystery ----------
  // Sets up the question without giving away the answer; the Trail of Evidence reveals it.
  function extinctionTopic() {
    return `
      <header class="lt-head">
        <div class="eyebrow">Background · 1</div>
        <h2>The extinction mystery</h2>
        <p class="lede">About 66 million years ago, the dinosaurs vanished, along with most life on Earth. For more than a century, nobody could say why.</p>
      </header>

      <section class="lt-sec">
        <h3><span class="num">1</span>What the fossils show</h3>
        <p>Fossil hunters noticed a pattern long ago. In rocks from the <b>Cretaceous</b> period there are dinosaurs, ammonites, giant forams and flowering forests. In the rocks just above, most of them are <b>gone</b>, and they never come back.</p>
        <p>Older textbooks put this at 65 million years ago; better dating methods now give about <b>66 million</b>. It was one of the five largest mass extinctions in Earth’s history: roughly three out of every four species disappeared. Small mammals, birds, crocodiles and some plants made it through, and inherited the planet.</p>
        <p class="lt-note">The fossils tell us <em>that</em> it happened. They don’t, on their own, tell us <em>what</em> happened, or how fast.</p>
      </section>

      <section class="lt-sec">
        <h3><span class="num">2</span>Competing ideas</h3>
        <p>By the 1970s, scientists had proposed many explanations. Two were taken especially seriously:</p>
        <div class="lt-cards">
          <div class="lt-card"><b>Deccan Traps volcanism</b><p>In what is now India, enormous volcanic eruptions poured out lava that piled up more than 2 km thick, right around the end of the Cretaceous. Gases from eruptions this big could have poisoned the air and oceans and changed the climate.</p></div>
          <div class="lt-card"><b>A gradual decline</b><p>Sea levels were falling and the climate was shifting near the end of the Cretaceous. Some paleontologists argued that dinosaurs and other groups were already dwindling over millions of years, and the extinction was a slow fade rather than a sudden event.</p></div>
        </div>
        <p>A key question divided them: was the extinction <b>slow</b>, taking millions of years, or <b>fast</b>? The answer would be recorded in the rocks, but only if someone could tell how much time a layer represents.</p>
      </section>

      <section class="lt-sec">
        <h3><span class="num">3</span>A father, a son, and a thin layer of clay</h3>
        <p>In the 1970s, geologist <b>Walter Alvarez</b> was studying rock layers near Gubbio, Italy. Between the Cretaceous and Paleogene limestones he found a thin layer of clay, only about a centimeter thick. He wanted to know: <b>how long did it take for that clay to form?</b></p>
        <p>He brought samples to his father, <b>Luis Alvarez</b>, a Nobel Prize–winning physicist. Together they came up with a clever way to use the rare element <b>iridium</b> as a kind of clock. Their goal was simply to measure time; they weren’t looking for the cause of the extinction.</p>
        <div class="ask"><strong>Think about it</strong><p>If you wanted to know whether the extinction was slow or sudden, why would it help to know how long the clay layer took to form?</p>
          <details><summary>Show answer</summary><p>A layer that took a few years to form points to a sudden event; one that took hundreds of thousands of years points to a slow change. Knowing the layer’s timespan tells you how fast the world changed.</p></details></div>
        <p>What they measured surprised them, and set off a search across the globe that lasted more than twenty years.</p>
        <div class="lt-actions">
          <button type="button" class="btn" data-start-trail>Follow the clues: Trail of Evidence →</button>
          <button type="button" class="btn ghost" data-topic="core">Next: how to read a core →</button>
        </div>
      </section>`;
  }

  // ---------- Topic 2: How to read a core ----------
  function coreTopic() {
    return `
      <header class="lt-head">
        <div class="eyebrow">Background · 2</div>
        <h2>How to read a core</h2>
        <p class="lede">A core is a column of rock or mud pulled out of the Earth. Read from bottom to top, it is a timeline: each layer is a page, and the K-Pg boundary is one very dramatic page.</p>
      </header>

      <section class="lt-sec">
        <h3><span class="num">1</span>What is a core?</h3>
        <figure class="lt-fig">${figDrill()}</figure>
        <p>Scientists drill into the seafloor (or the ground) with a <b>hollow drill bit</b>. Instead of grinding everything to powder, the bit cuts around a cylinder of sediment, which slides up inside the pipe like an apple core. That cylinder is the <b>core</b>.</p>
        <p>Over millions of years, mud, shells and dust settle onto the seafloor and pile up in layers. A core samples every one of those layers, in order, without digging a giant hole. The Blake Nose core in this app was drilled from a ship; the drill sites on the Blake Nose lie in water 1,300 to 2,600 m deep.</p>
      </section>

      <section class="lt-sec">
        <h3><span class="num">2</span>Bringing it up and sampling it</h3>
        <figure class="lt-fig">${figSplit()}</figure>
        <ol class="lt-steps">
          <li><b>Cut into sections.</b> On deck, each core (often about 9.5 m long) is cut into sections about 1.5 m long, so they can be handled and stored.</li>
          <li><b>Split lengthwise.</b> Each section is sliced in half like a hot dog bun. The <b>archive half</b> is photographed, described and stored for future scientists.</li>
          <li><b>Sample the working half.</b> Small scoops are taken at regular spacing, often every few centimeters, and labeled with their exact depth.</li>
          <li><b>Analyze.</b> Some samples are washed through a sieve to find fossils like forams; others are tested for chemicals like iridium or searched for impact grains.</li>
        </ol>
        <p class="lt-note">Depth is measured in <b>meters below the seafloor (mbsf)</b>. Every sample is tagged with it, which is how a foram count or an iridium value can be placed at an exact level in the core.</p>
      </section>

      <section class="lt-sec">
        <h3><span class="num">3</span>Time runs from bottom to top</h3>
        <figure class="lt-fig">${figStack()}
          <figcaption><button type="button" class="btn ghost small" data-replay>▶ Replay</button> Layers settle one on top of another.</figcaption></figure>
        <p>Each new layer settles <b>on top</b> of the ones already there. So in an undisturbed stack, the <b>bottom is oldest</b> and the <b>top is youngest</b>. This is the <b>law of superposition</b>, first described by Nicolas Steno in 1669.</p>
        <p>That means depth and time point in opposite directions: going <b>down</b> the core takes you <b>back</b> in time. To watch history unfold, start at the bottom and read upward. That is why this app’s ▲ button says “Younger.”</p>
        <div class="ask"><strong>Think about it</strong><p>In the Blake Nose core, the white Cretaceous ooze is below the green ejecta layer. Which formed first?</p>
          <details><summary>Show answer</summary><p>The white Cretaceous ooze. It is lower, so it was deposited first; the ejecta landed on top of it.</p></details></div>
        <p class="lt-note">Superposition works only if the layers haven’t been flipped or stirred. Debris flows, landslides and burrowing animals can mix layers, which is why geologists look closely at contacts, like the jumbled event beds at Brazos River.</p>
      </section>

      <section class="lt-sec">
        <h3><span class="num">4</span>Thickness is not the same as time</h3>
        <figure class="lt-fig">${figRates()}</figure>
        <p>On the quiet deep seafloor, ooze builds up very slowly, roughly a centimeter every thousand years or so. A thin layer can hold thousands of years.</p>
        <p>An impact is the opposite. At Blake Nose, a 10–17 cm layer of ejecta rained down in <b>hours to days</b>. When a thick layer appears suddenly in a slow, calm sequence, it is a sign that something extraordinary happened.</p>
      </section>

      <section class="lt-sec">
        <h3><span class="num">5</span>What to look for</h3>
        <div class="lt-cards">
          ${lookCard("Color and texture", "A sudden change from white ooze to green sand to brown clay marks a sudden change in conditions.", "blake", "contact", "See the K-Pg contact")}
          ${lookCard("Fossils", "Which species are present, how many, and how big. Compare samples below and above a layer.", "blake", "k", "See the forams")}
          ${lookCard("Chemistry", "Elements that are rare on Earth but common in asteroids, like iridium, can spike in one thin layer.", "blake", "ir", "See the iridium layer")}
          ${lookCard("Impact grains", "Glassy spherules and shocked quartz form only in extreme heat and pressure.", "blake", "ejecta", "See the ejecta layer")}
        </div>
      </section>

      <section class="lt-sec">
        <h3><span class="num">6</span>Cliffs and outcrops read the same way</h3>
        <p>Many sites in this app are not drill cores but cliffs, river banks and road cuts, where rock layers are exposed at the surface. The rules are the same: older below, younger above. Sometimes the layers have been tilted by mountain building, as at Gubbio, so “up” follows the layers rather than straight up.</p>
        <div class="lt-actions">
          <button type="button" class="btn" data-goto-site="blake">Explore a real core: Blake Nose →</button>
          <button type="button" class="btn ghost" data-goto-site="gubbio">See a cliff: Gubbio →</button>
          <button type="button" class="btn ghost" data-topic="abundance">Next: species abundance →</button>
        </div>
      </section>`;
  }

  const lookCard = (title, text, site, layer, label) => `
    <div class="lt-card"><b>${title}</b><p>${text}</p>
      <button type="button" class="link-btn" data-goto-site="${site}" data-goto-layer="${layer}">${label} →</button></div>`;

  // Seafloor layer colors, echoing the Blake Nose core
  const BANDS = [
    { h: 30, c: "#d9d4c6", n: "Paleogene ooze" },
    { h: 6, c: "#9b5d3c", n: "iridium layer" },
    { h: 22, c: "#6f8a62", n: "ejecta" },
    { h: 52, c: "#ebe7dc", n: "Cretaceous ooze" }
  ];

  function figDrill() {
    // Cross-section: ship → water → layered seafloor, with the drill and a core inside it
    let y = 220, layers = "", coreLayers = "";
    BANDS.forEach(b => {
      layers += `<rect x="0" y="${y}" width="640" height="${b.h}" fill="${b.c}"/>`;
      // the same layers, seen inside the drill barrel (y 256–318)
      const top = Math.max(y, 256), bot = Math.min(y + b.h, 318);
      if (bot > top) coreLayers += `<rect x="318" y="${top}" width="24" height="${bot - top}" fill="${b.c}"/>`;
      y += b.h;
    });
    return `<svg viewBox="0 0 640 330" role="img" aria-label="A drill ship over the ocean lowers a hollow pipe through the water into layered seafloor sediment; a cylinder of the layers, the core, sits inside the bottom of the pipe.">
      <defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a5677"/><stop offset="1" stop-color="#132a3d"/></linearGradient></defs>
      <rect x="0" y="0" width="640" height="70" fill="#1b1815"/>
      <rect x="0" y="70" width="640" height="150" fill="url(#sea)"/>
      <path d="M0 70 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="#7fb1d6" stroke-width="2"/>
      ${layers}
      <g opacity=".25" stroke="#000">${Array.from({ length: 16 }, (_, i) => `<line x1="0" x2="640" y1="${224 + i * 7}" y2="${224 + i * 7}" stroke-width=".6"/>`).join("")}</g>
      <!-- ship -->
      <path d="M262 58 h136 l-14 18 h-108 z" fill="#d6cfc2"/>
      <path d="M318 58 l12 -50 l12 50 M322 40 h16 M325 26 h10" fill="none" stroke="#d6cfc2" stroke-width="3"/>
      <!-- drill pipe and core -->
      <rect x="326" y="8" width="8" height="244" fill="#8d8f93"/>
      <rect x="314" y="252" width="32" height="70" fill="#8d8f93" opacity=".9"/>
      ${coreLayers}
      <rect x="317" y="255" width="26" height="64" fill="none" stroke="#e8743f" stroke-width="3" rx="3"/>
      <!-- callouts -->
      <g class="callout"><circle cx="240" cy="50" r="15"/><text x="240" y="56">1</text></g>
      <g class="callout"><circle cx="120" cy="140" r="15"/><text x="120" y="146">2</text></g>
      <g class="callout"><circle cx="120" cy="270" r="15"/><text x="120" y="276">3</text></g>
      <g class="callout"><circle cx="400" cy="286" r="15"/><text x="400" y="292">4</text></g>
      <line x1="385" y1="286" x2="348" y2="286" stroke="#e8743f" stroke-width="2.5"/>
      <g class="fig-label">
        <text x="216" y="56" text-anchor="end">Drill ship</text>
        <text x="142" y="146">Ocean</text>
        <text x="142" y="276" class="dark">Layers of sediment</text>
        <text x="422" y="292" class="dark">The core</text>
      </g>
    </svg>
    <ol class="fig-key"><li>A drill ship holds steady over the site.</li><li>Pipe is lowered through hundreds to thousands of meters of water.</li><li>Below the seafloor, sediment lies in layers, oldest at the bottom.</li><li>The hollow bit cuts a cylinder of those layers: the core.</li></ol>`;
  }

  function figSplit() {
    const col = (x, w, half) => {
      let y = 40, s = "";
      BANDS.forEach(b => { const h = b.h * 2.2; s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${b.c}"/>`; y += h; });
      return s + (half ? "" : `<ellipse cx="${x + w / 2}" cy="40" rx="${w / 2}" ry="7" fill="#f3efe6" stroke="#2b2520" stroke-width="1"/>`);
    };
    const H = 110 * 2.2; // column height
    // sample spots on the working half, every "few cm"
    const spots = Array.from({ length: 9 }, (_, i) => `<circle cx="355" cy="${52 + i * 26}" r="5" fill="#13110f" stroke="#e9c64b" stroke-width="1.5"/>`).join("");
    const ticks = Array.from({ length: 12 }, (_, i) => `<line x1="384" x2="${i % 5 === 0 ? 396 : 391}" y1="${40 + i * 22}" y2="${40 + i * 22}" stroke="#9a8e80"/>`).join("");
    return `<svg viewBox="0 0 640 330" role="img" aria-label="A core section is split lengthwise into an archive half and a working half; small samples are taken from the working half at regular depths and one sample, seen under a microscope, contains forams.">
      ${foramDefs()}
      ${col(40, 60)}
      <rect x="40" y="40" width="60" height="${H}" fill="none" stroke="#2b2520"/>
      <text x="70" y="318" class="fig-cap" text-anchor="middle">Core section</text>
      <path d="M118 160 h40" stroke="#c9bdae" stroke-width="2.5" marker-end="url(#ar)"/>
      <defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#c9bdae"/></marker></defs>
      ${col(180, 50, true)}<rect x="180" y="40" width="50" height="${H}" fill="none" stroke="#2b2520"/>
      ${col(320, 50, true)}<rect x="320" y="40" width="50" height="${H}" fill="none" stroke="#2b2520"/>
      ${spots}${ticks}
      <text x="205" y="318" class="fig-cap" text-anchor="middle">Archive half</text>
      <text x="345" y="318" class="fig-cap" text-anchor="middle">Working half</text>
      <text x="400" y="48" class="fig-small">cm</text>
      <!-- magnifier on one sample -->
      <line x1="361" y1="${52 + 7 * 26}" x2="470" y2="200" stroke="#e9c64b" stroke-width="1.5" stroke-dasharray="4 4"/>
      <circle cx="540" cy="190" r="80" fill="#efe9dc" stroke="#e9c64b" stroke-width="3"/>
      <use href="#f-globo" x="488" y="140" width="46" height="46"/>
      <use href="#f-hetero" x="540" y="128" width="40" height="40"/>
      <use href="#f-hetero" x="548" y="200" width="36" height="36" transform="rotate(30 566 218)"/>
      <use href="#f-globo" x="500" y="198" width="38" height="38"/>
      <use href="#f-guemb" x="584" y="170" width="22" height="22"/>
      <text x="540" y="300" class="fig-cap" text-anchor="middle">One sample, magnified</text>
    </svg>`;
  }

  function figStack() {
    const cols = ["#ebe7dc", "#d6cdb8", "#6f8a62", "#9b5d3c", "#d9d4c6"];
    const names = ["1 · first (oldest)", "2", "3", "4", "5 · last (youngest)"];
    return `<svg viewBox="0 0 640 300" class="stack-anim" role="img" aria-label="Five layers settle one after another into a basin; layer 1 at the bottom is oldest and layer 5 at the top is youngest.">
      <path d="M40 40 v230 h300 v-230" fill="none" stroke="#5b5148" stroke-width="3"/>
      ${cols.map((c, i) => `<g class="drop" style="animation-delay:${(i * 0.55).toFixed(2)}s">
        <rect x="43" y="${228 - i * 42}" width="294" height="40" fill="${c}" stroke="rgba(0,0,0,.25)"/>
        <text x="190" y="${253 - i * 42}" text-anchor="middle" class="${i === 2 || i === 3 ? "on-dark" : "on-light"}">${names[i]}</text></g>`).join("")}
      <g class="fig-label">
        <path d="M420 250 V60" stroke="#93c47d" stroke-width="3" marker-end="url(#arUp)"/>
        <defs><marker id="arUp" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#93c47d"/></marker>
        <marker id="arDn" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#c9bdae"/></marker></defs>
        <text x="436" y="72">Younger</text><text x="436" y="250">Older</text>
        <text x="420" y="290" text-anchor="middle" class="fig-small">TIME</text>
        <path d="M596 60 V250" stroke="#c9bdae" stroke-width="3" marker-end="url(#arDn)"/>
        <text x="582" y="72" text-anchor="end">Shallow</text><text x="582" y="250" text-anchor="end">Deep</text>
        <text x="596" y="290" text-anchor="middle" class="fig-small">DEPTH</text>
      </g>
    </svg>`;
  }

  function figRates() {
    const lam = Array.from({ length: 24 }, (_, i) => `<line x1="70" x2="230" y1="${62 + i * 9.5}" y2="${62 + i * 9.5}" stroke="#b9b1a0" stroke-width="${i % 4 ? .7 : 1.4}"/>`).join("");
    let sph = "";
    const rnd = n => { const h = Math.sin(n * 12.9898) * 43758.5453; return h - Math.floor(h); };
    for (let i = 0; i < 70; i++) { const x = 420 + rnd(i + 1) * 140, yy = 66 + rnd(i + 101) * 216; sph += `<circle cx="${x}" cy="${yy}" r="${3 + (i % 3)}" fill="#2a3324" stroke="#c9cf9a" stroke-width="1"/>`; }
    return `<svg viewBox="0 0 640 330" role="img" aria-label="Two 10-centimeter columns: finely layered ooze representing thousands of years, and spherule-filled ejecta representing hours to days.">
      <rect x="70" y="58" width="160" height="232" fill="#ebe7dc"/>${lam}
      <rect x="410" y="58" width="160" height="232" fill="#6f8a62"/>${sph}
      <rect x="70" y="58" width="160" height="232" fill="none" stroke="#2b2520"/><rect x="410" y="58" width="160" height="232" fill="none" stroke="#2b2520"/>
      <g class="fig-label">
        <text x="150" y="40" text-anchor="middle">10 cm of seafloor ooze</text>
        <text x="490" y="40" text-anchor="middle">10 cm of impact ejecta</text>
        <text x="150" y="318" text-anchor="middle" class="big">≈ thousands of years</text>
        <text x="490" y="318" text-anchor="middle" class="big hot">≈ hours to days</text>
      </g>
    </svg>`;
  }

  // ---------- Topic 3: Species abundance through a core ----------
  // Simplified from the Danian planktic foram "acme zones" (DanAZ1–3) of Arenillas and colleagues:
  // percentages are illustrative, chosen to show the pattern, not measured values.
  const GROUPS = [
    { id: "guemb", short: "Guembelitria", name: "Guembelitria", color: "#e07a63", size: 17,
      about: "Tiny, three chambers per turn. Rare in the open Cretaceous ocean, it survived the impact and then exploded in numbers: a “disaster taxon.”" },
    { id: "parvu", short: "Parvularugoglobigerina", name: "Parvularugoglobigerina & Palaeoglobigerina", color: "#b8a7dc", size: 16,
      about: "Tiny, simple coils: among the first new species to evolve after the extinction. Gubbio’s Globigerina eugubina is one of them." },
    { id: "wood", zoom: 3, short: "Woodringina", name: "Woodringina & Chiloguembelina", color: "#e9d45a", size: 19, cards: [2, 7],
      about: "Small forams with two rows of chambers. They take over next, as the ocean slowly stabilizes." },
    { id: "eog", zoom: 3, short: "Eoglobigerina", name: "Eoglobigerina, Parasubbotina & Subbotina", color: "#8cc47a", size: 22, cards: [3, 11],
      about: "Larger, globular coiled forams. Their rise marks the start of a recovery that took hundreds of thousands of years." },
    { id: "hetero", zoom: 2, short: "Heterohelix", name: "Heterohelicids (Heterohelix, Pseudoguembelina)", color: "#6cb7ad", size: 22, cards: [8, 1],
      about: "Two rows of chambers, flaring outward. Common in the Cretaceous; almost all vanish at the boundary." },
    { id: "globo", zoom: 1.4, short: "Globotruncana", name: "Globotruncanids (Globotruncana)", color: "#7aa8d6", size: 29, cards: [16, 4],
      about: "Large, keeled and ornate, adapted to a stable open ocean. All extinct at the boundary." }
  ];
  const BOUNDARY = 40;
  // [time (0 = oldest, 100 = youngest), % of each group in GROUPS order]
  const LEVELS = [
    [0, [4, 0, 0, 0, 44, 52]], [10, [3, 0, 0, 0, 40, 57]], [20, [4, 0, 0, 0, 43, 53]], [30, [3, 0, 0, 0, 41, 56]],
    [39.9, [4, 0, 0, 0, 42, 54]],
    [40, [92, 8, 0, 0, 0, 0]], [44, [86, 12, 2, 0, 0, 0]], [48, [70, 26, 4, 0, 0, 0]], [52, [45, 48, 7, 0, 0, 0]],
    [56, [26, 64, 9, 1, 0, 0]], [60, [15, 70, 13, 2, 0, 0]], [64, [10, 60, 25, 5, 0, 0]], [68, [8, 40, 45, 7, 0, 0]],
    [74, [6, 22, 60, 12, 0, 0]], [80, [5, 12, 63, 20, 0, 0]], [88, [4, 6, 55, 35, 0, 0]], [100, [3, 3, 44, 50, 0, 0]]
  ];
  const ZONES = [
    { from: 0, to: 40, short: "Cretaceous", name: "Latest Cretaceous", color: "#7aa8d6",
      text: "A diverse, stable ocean. Large, ornate globotruncanids and biserial heterohelicids dominate; Guembelitria is a minor player." },
    { from: 40, to: 52, short: "Zone 1", name: "Zone 1 · Disaster bloom", color: "#e07a63",
      text: "Right after the impact, almost every species is gone. Tiny Guembelitria, which could cope with stressed, unstable conditions, makes up nearly all of the forams." },
    { from: 52, to: 68, short: "Zone 2", name: "Zone 2 · Tiny pioneers", color: "#b8a7dc",
      text: "Brand-new species evolve from the survivors. They are tiny and simple, and for a while they dominate." },
    { from: 68, to: 100, short: "Zone 3", name: "Zone 3 · Recovery begins", color: "#e9d45a",
      text: "Small biserial forams take over, and larger globular species start to spread. Diversity slowly climbs, but the giant Cretaceous forms never return." }
  ];
  const zoneAt = t => ZONES.find(z => t >= z.from && t < z.to) || ZONES[ZONES.length - 1];
  function pctAt(t) {
    const pts = t < BOUNDARY ? LEVELS.filter(l => l[0] < BOUNDARY) : LEVELS.filter(l => l[0] >= BOUNDARY);
    if (t <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      if (t <= pts[i][0]) {
        const [t0, a] = pts[i - 1], [t1, b] = pts[i], f = (t - t0) / (t1 - t0);
        return a.map((v, k) => v + (b[k] - v) * f);
      }
    }
    return pts[pts.length - 1][1];
  }

  function abundanceTopic() {
    return `
      <header class="lt-head">
        <div class="eyebrow">Background · 3</div>
        <h2>Species abundance through a core</h2>
        <p class="lede">Fossils don’t just appear or disappear at the boundary. Counting them sample by sample shows <em>who</em> took over afterward, in what order, and how slowly the ocean recovered.</p>
      </header>

      <section class="lt-sec">
        <h3><span class="num">1</span>What are forams, and why count them?</h3>
        <p><b>Forams</b> (short for <em>foraminifera</em>) are single-celled organisms that build tiny shells, most smaller than a grain of sand. Some float in the sunlit surface of the ocean (<b>planktic</b> forams); others live on the seafloor (<b>benthic</b> forams). When they die, their shells sink and pile up, so much of the white ooze and chalk in K-Pg cores is made of foram shells.</p>
        <div class="ab-real" style="margin: 0 0 14px">${[[16, "Globotruncana, a large Cretaceous foram"], [8, "Heterohelix, a Cretaceous foram"], [3, "Eoglobigerina, a Paleogene foram"], [2, "Woodringina, a Paleogene foram"]]
          .map(([n, alt]) => `<span class="ab-thumb"><img src="image/forams/card${String(n).padStart(2, "0")}.jpg" alt="${alt}" loading="lazy"></span>`).join("")}</div>
        <p>Dinosaurs, plants, pollen and shellfish all hold clues about the extinction, but their fossils are scattered: you might find one bone in meters of rock. Forams are different:</p>
        <ul class="lt-list">
          <li><b>They are everywhere.</b> A teaspoon of seafloor mud can hold thousands of shells, so even a tiny sample taken every few centimeters gives a good count.</li>
          <li><b>They record change in fine detail.</b> Because every thin slice of the core has plenty of forams, scientists can track how the mix of species shifts over short spans of time, not just whether a group is there or not.</li>
          <li><b>They are found worldwide.</b> Ocean sediments from Italy to Mexico to the Atlantic seafloor can be compared directly.</li>
          <li><b>Their shapes tell species apart.</b> Each species builds its own style of shell, so a microscope is enough to identify them.</li>
        </ul>
      </section>

      <section class="lt-sec">
        <h3><span class="num">2</span>Counting fossils, sample by sample</h3>
        <div class="lt-strip">
          <div><span class="si">${stepIcon("scoop")}</span><b>Sample</b><p>Take a small scoop from the core every few centimeters.</p></div>
          <div><span class="si">${stepIcon("sieve")}</span><b>Wash</b><p>Rinse it through a fine sieve; mud washes away, shells stay.</p></div>
          <div><span class="si">${stepIcon("scope")}</span><b>Count</b><p>Under a microscope, identify and count about 300 forams.</p></div>
          <div><span class="si">${stepIcon("bars")}</span><b>Plot</b><p>Turn counts into percentages and plot them by depth.</p></div>
        </div>
      </section>

      <section class="lt-sec">
        <h3><span class="num">3</span>Explore the pattern</h3>
        <p class="lt-hint" id="abHint"></p>
        <div class="ab-wrap">
          <div class="ab-readout" id="abReadout"><div id="abRoBody" aria-live="polite"></div><div class="ab-key" id="abKey"></div></div>
          <div class="ab-chart" id="abChart"></div>
        </div>
        <div class="ab-legend" id="abLegend"></div>
        <p class="lt-note">Simplified from the Danian planktic foram acme zones (DanAZ1–3) described by Arenillas and colleagues from 30 sections around the Americas. Percentages are illustrative, chosen to show the pattern. Photos: HHMI foram cards (Brian Huber, Smithsonian).</p>
      </section>

      <section class="lt-sec">
        <h3><span class="num">4</span>How to read this chart</h3>
        <ul class="lt-list">
          <li><b>Up is younger.</b> Like the core it comes from, time runs from bottom to top. The dashed line is the K-Pg boundary.</li>
          <li><b>Width is abundance.</b> At any level, the colored bands add up to 100% of the forams counted. A wider band means that group made up more of the sample.</li>
          <li><b>More drawings, more forams.</b> The cartoons are packed in proportion to each band’s width, so crowded areas are where that group was common.</li>
          <li><b>Size matters too.</b> The drawings are sized like the real animals: big, ornate forms below the boundary, tiny ones above it.</li>
        </ul>
      </section>

      <section class="lt-sec">
        <h3><span class="num">5</span>What happened, zone by zone</h3>
        <div class="ab-zones">${ZONES.map(z => `<div class="ab-zone" style="--zc:${z.color}"><b>${z.name}</b><p>${z.text}</p></div>`).join("")}</div>
        <div class="ask"><strong>Think about it</strong><p>Guembelitria was rare before the impact but dominated right after it. Why might a rare species suddenly take over?</p>
          <details><summary>Show answer</summary><p>Its competitors were gone. Guembelitria was a small, fast-reproducing generalist that could tolerate stressed, unstable waters, so it could multiply quickly into the empty ocean. Species like this are called “disaster taxa.”</p></details></div>
        <div class="ask"><strong>Think about it</strong><p>If you only counted the <em>number of species</em>, what would you miss that these abundance bands show?</p>
          <details><summary>Show answer</summary><p>The order of recovery. Abundance shows which groups dominated at each moment (a bloom of survivors, then tiny new species, then larger ones), which reveals how slowly and in what steps the ecosystem rebuilt itself.</p></details></div>
        <div class="lt-actions">
          <button type="button" class="btn" data-goto-site="blake" data-goto-layer="contact">Compare real forams across the boundary →</button>
          <button type="button" class="btn ghost" data-topic="core">How to read a core</button>
        </div>
      </section>`;
  }

  function stepIcon(kind) {
    const s = 'fill="none" stroke="#c9bdae" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
    const art = {
      scoop: `<rect x="8" y="6" width="14" height="36" rx="2" ${s}/><path d="M8 18h14M8 28h14" ${s}/><path d="M26 22 h12 a4 4 0 0 1 0 8 h-12" ${s}/>`,
      sieve: `<ellipse cx="24" cy="16" rx="16" ry="5" ${s}/><path d="M8 16 v8 a16 5 0 0 0 32 0 v-8" ${s}/><path d="M16 34v4M24 35v6M32 34v4" ${s}/>`,
      scope: `<path d="M18 6 l8 4 -8 16 -8 -4 z" ${s}/><path d="M22 26 a12 12 0 0 1 10 14 M10 42 h28 M24 42 v-6" ${s}/>`,
      bars: `<path d="M8 40 h32 M8 40 V8" ${s}/><path d="M14 40 v-12 M22 40 v-22 M30 40 v-8" ${s} stroke-width="5"/>`
    }[kind];
    return `<svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">${art}</svg>`;
  }

  // Interactive stacked-abundance chart. Rendered at the container's pixel width so text stays readable on phones.
  function mountAbundance(root) {
    const chart = $("#abChart", root), readout = $("#abRoBody", root), legend = $("#abLegend", root), key = $("#abKey", root);
    const touch = !window.matchMedia("(hover: hover)").matches;
    $("#abHint", root).innerHTML = touch
      ? "Tap anywhere on the chart, or use ▲ ▼, to see the mix of forams at that moment."
      : "Move your pointer up and down the chart (or use the ↑ ↓ keys) to see the mix of forams at each moment.";
    let t = 46, W = 0, dims = null, focusGroup = null;

    legend.innerHTML = GROUPS.map(g => `
      <div class="ab-lg" data-g="${g.id}" tabindex="0">
        <span class="sw" style="background:${g.color}"></span>${foramIcon(g.id, 34)}
        <div><b>${g.name}</b><p>${g.about}</p>
        ${g.cards ? `<div class="ab-real">${g.cards.map(n => `<span class="ab-thumb"><img src="image/forams/card${String(n).padStart(2, "0")}.jpg" alt="Real specimen, card ${n}" loading="lazy" style="transform:scale(${g.zoom})"></span>`).join("")}<span>real specimens (enlarged ${g.zoom}×)</span></div>` : ""}</div>
      </div>`).join("");
    // Phones: the cards are hidden and this compact key, pinned above the chart with the readout, does their job
    key.innerHTML = `<div class="ab-chips">${GROUPS.map(g => `
      <button type="button" class="ab-chip" data-g="${g.id}" aria-pressed="false">
        <span class="sw" style="background:${g.color}"></span>${foramIcon(g.id, 18)}<span class="nm">${g.short}</span><b class="pct"></b></button>`).join("")}</div>
      <p class="ab-key-about" hidden></p>`;
    key.querySelectorAll(".ab-chip").forEach(b => b.addEventListener("click", () => {
      focusGroup = focusGroup === b.dataset.g ? null : b.dataset.g;
      highlight();
    }));
    legend.querySelectorAll(".ab-lg").forEach(n => {
      const on = () => { focusGroup = n.dataset.g; highlight(); };
      const off = () => { focusGroup = null; highlight(); };
      n.addEventListener("mouseenter", on); n.addEventListener("mouseleave", off);
      n.addEventListener("focus", on); n.addEventListener("blur", off);
    });

    function draw() {
      W = chart.clientWidth;
      if (!W) return;
      const narrow = W < 520;
      const H = narrow ? 620 : 700, L = narrow ? 34 : 92, R = 10, T = 30, B = 44;
      const PH = H - T - B, PW = W - L - R;
      const y = tt => T + (1 - tt / 100) * PH, x = p => L + p / 100 * PW;
      dims = { H, L, T, PH, y };
      const scale = narrow ? 0.8 : 1;

      // bands: one polygon per group from the cumulative left/right edges at every level
      const ts = LEVELS.map(l => l[0]);
      const edges = ts.map(tt => { const p = pctAt(tt); let acc = 0; return p.map(v => { const e = [acc, acc + v]; acc += v; return e; }); });
      let bands = "";
      GROUPS.forEach((g, k) => {
        const right = ts.map((tt, i) => `${x(edges[i][k][1]).toFixed(1)},${y(tt).toFixed(1)}`);
        const left = ts.map((tt, i) => `${x(edges[i][k][0]).toFixed(1)},${y(tt).toFixed(1)}`).reverse();
        bands += `<polygon class="ab-band" data-g="${g.id}" points="${right.concat(left).join(" ")}" fill="${g.color}"/>`;
      });

      // cartoons: rows across the chart, count per band proportional to its width
      let icons = "", row = 0;
      const gap = narrow ? 24 : 30;
      for (let py = T + gap / 2; py < T + PH - 4; py += gap, row++) {
        const tt = (1 - (py - T) / PH) * 100;
        if (Math.abs(py - y(BOUNDARY)) < gap * 0.55) continue;
        const p = pctAt(tt);
        let acc = 0;
        GROUPS.forEach((g, k) => {
          const x0 = x(acc), x1 = x(acc + p[k]); acc += p[k];
          const s = g.size * scale, w = x1 - x0;
          if (w < s * 0.9) return;
          const n = Math.max(1, Math.floor(w / (s * 1.75)));
          for (let j = 0; j < n; j++) {
            const h = Math.sin((row + 1) * 12.9898 + (j + 1) * 78.233 + k * 3.1) * 43758.5453;
            const r = h - Math.floor(h);
            const cx = x0 + (j + 0.5) * w / n + (row % 2 ? 0.22 : -0.22) * (w / n) * 0.5;
            const cy = py + (r - 0.5) * gap * 0.35;
            icons += `<use href="#f-${g.id}" data-g="${g.id}" class="ab-ico" x="${(cx - s / 2).toFixed(1)}" y="${(cy - s / 2).toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" transform="rotate(${((r - 0.5) * 50).toFixed(0)} ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`;
          }
        });
      }

      // zone strip on the left, with labels
      const zonesSvg = ZONES.map(z => {
        const y0 = y(z.to), y1 = y(z.from), mid = (y0 + y1) / 2;
        const lw = narrow ? 22 : 26;
        return `<rect x="${L - lw - 6}" y="${y0}" width="${lw}" height="${y1 - y0}" fill="${z.color}" opacity=".85"/>
          <text class="ab-zlabel" transform="translate(${L - lw / 2 - 6} ${mid}) rotate(-90)" text-anchor="middle" dy="4">${y1 - y0 > 90 ? z.short : z.short.replace("Zone ", "")}</text>`;
      }).join("");

      const ticks = [0, 25, 50, 75, 100].map(p => `<line x1="${x(p)}" x2="${x(p)}" y1="${T + PH}" y2="${T + PH + 5}" stroke="#9a8e80"/>
        <text x="${x(p)}" y="${T + PH + 19}" text-anchor="${p === 0 ? "start" : p === 100 ? "end" : "middle"}" class="ab-axis">${p}%</text>`).join("");
      const yb = y(BOUNDARY);

      chart.innerHTML = `<svg class="ab-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" tabindex="0" role="img"
          aria-label="Stacked abundance of six foram groups through time. Below the K-Pg boundary large Cretaceous forms dominate; just above it Guembelitria makes up nearly all forams, followed by tiny new species, then small biserial and larger globular forms.">
        ${foramDefs()}
        <rect x="${L}" y="${T}" width="${PW}" height="${PH}" fill="#f6f1e7"/>
        ${bands}<g class="ab-icons">${icons}</g>
        <line x1="${L - 34}" x2="${W - R}" y1="${yb}" y2="${yb}" stroke="#13110f" stroke-width="6"/>
        <line x1="${L - 34}" x2="${W - R}" y1="${yb}" y2="${yb}" stroke="#e9c64b" stroke-width="3" stroke-dasharray="10 6"/>
        <text x="${W - R - 6}" y="${yb - 9}" text-anchor="end" class="ab-bnd">K-Pg boundary · impact</text>
        ${zonesSvg}
        <text x="6" y="${T - 12}" class="ab-axis">▲ Younger</text>
        <text x="6" y="${H - 6}" class="ab-axis">Older</text>
        ${ticks}
        <text x="${L + PW / 2}" y="${H - 6}" text-anchor="middle" class="ab-axis">${narrow ? "Share of forams" : "Share of the forams in each sample"}</text>
        <g class="ab-cursor"><line x1="${L}" x2="${W - R}" stroke="#13110f" stroke-width="2.5"/><circle cx="${L}" r="6.5" fill="#13110f" stroke="#f1e9de" stroke-width="2"/></g>
      </svg>`;
      const svg = $("svg", chart);
      const setFromEvent = e => {
        const r = svg.getBoundingClientRect();
        t = Math.max(0, Math.min(100, (1 - (e.clientY - r.top - T) / PH) * 100));
        update();
      };
      svg.addEventListener("pointerdown", setFromEvent);
      svg.addEventListener("pointermove", e => { if (e.pointerType === "mouse") setFromEvent(e); });
      svg.addEventListener("keydown", e => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); nudge(e.key === "ArrowUp" ? 2 : -2); }
      });
      highlight();
      update();
    }

    function nudge(d) { t = Math.max(0, Math.min(100, t + d)); update(); }

    function update() {
      if (!dims) return;
      const cy = dims.y(t);
      const cur = $(".ab-cursor", chart);
      cur.querySelector("line").setAttribute("y1", cy); cur.querySelector("line").setAttribute("y2", cy);
      cur.querySelector("circle").setAttribute("cy", cy);
      const p = pctAt(t), z = zoneAt(t);
      const rows = GROUPS.map((g, k) => ({ g, v: p[k] })).filter(r => r.v >= 0.5);
      readout.innerHTML = `
        <div class="ab-ro-head"><span class="ab-ro-zone" style="--zc:${z.color}">${z.name}</span>
          <span class="ab-ro-btns"><button type="button" data-nudge="2" aria-label="Younger">▲</button><button type="button" data-nudge="-2" aria-label="Older">▼</button></span></div>
        <div class="ab-ro-stack">${rows.map(r => `<span style="width:${r.v}%;background:${r.g.color}" title="${r.g.name}: ${Math.round(r.v)}%"></span>`).join("")}</div>
        <ul>${rows.map(r => `<li data-g="${r.g.id}"><span class="sw" style="background:${r.g.color}"></span>${foramIcon(r.g.id, 18)}<span class="nm">${r.g.name}</span><b>${Math.round(r.v)}%</b></li>`).join("")}</ul>`;
      readout.querySelectorAll("[data-nudge]").forEach(b => b.addEventListener("click", () => nudge(+b.dataset.nudge)));
      key.querySelectorAll(".ab-chip").forEach((c, k) => {
        c.querySelector(".pct").textContent = `${Math.round(p[k])}%`;
        c.classList.toggle("absent", p[k] < 0.5);
      });
    }

    function highlight() {
      chart.querySelector("svg")?.classList.toggle("focusing", !!focusGroup);
      chart.querySelectorAll("[data-g]").forEach(n => n.classList.toggle("hi", n.dataset.g === focusGroup));
      key.querySelectorAll(".ab-chip").forEach(c => c.setAttribute("aria-pressed", c.dataset.g === focusGroup));
      const about = $(".ab-key-about", key), g = GROUPS.find(g => g.id === focusGroup);
      about.hidden = !g;
      if (g) about.innerHTML = `<b>${g.name}.</b> ${g.about}`;
    }

    draw();
    let rt;
    const ro = new ResizeObserver(() => { if (chart.clientWidth !== W) { clearTimeout(rt); rt = setTimeout(draw, 80); } });
    ro.observe(chart);
    return () => ro.disconnect();
  }

  // ---------- Topic registry + page ----------
  const TOPICS = [
    { id: "extinction", title: "The extinction mystery", blurb: "What vanished 66 million years ago, the competing ideas, and the question that started it all.", html: extinctionTopic },
    { id: "core", title: "How to read a core", blurb: "What a core is, how it’s sampled, and why time runs bottom to top.", html: coreTopic,
      mount(root) {
        const replay = $("[data-replay]", root), svg = $(".stack-anim", root);
        replay && replay.addEventListener("click", () => { svg.classList.remove("play"); void svg.getBBox(); svg.classList.add("play"); });
        // start the stacking animation when it scrolls into view
        const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { svg.classList.add("play"); io.disconnect(); } }), { threshold: 0.4 });
        io.observe(svg);
        return () => io.disconnect();
      } },
    { id: "abundance", title: "Species abundance through a core", blurb: "How forams rose and fell before and after the K-Pg boundary.", html: abundanceTopic, mount: mountAbundance }
  ];

  let cleanup = null;
  function render(topicId, back) {
    const topic = TOPICS.find(t => t.id === topicId) || TOPICS[0];
    const root = $("#learn");
    if (cleanup) { cleanup(); cleanup = null; }
    root.innerHTML = `
      <div class="learn-wrap">
        <nav class="learn-toc" aria-label="Background topics">
          <div class="eyebrow">Background info</div>
          ${TOPICS.map((t, i) => `<button type="button" data-topic="${t.id}" aria-current="${t.id === topic.id}">
            <span class="n">${i + 1}</span><span><b>${t.title}</b><small>${t.blurb}</small></span></button>`).join("")}
        </nav>
        <article class="learn-article">
          ${back ? `<button type="button" class="btn ghost small back-from-learn" id="learnBack">← ${back.label}</button>` : ""}
          ${topic.html()}
        </article>
      </div>`;
    root.scrollTop = 0;
    if (back) $("#learnBack", root).addEventListener("click", back.go);
    root.querySelectorAll("[data-topic]").forEach(b => b.addEventListener("click", () => window.KTApp.openLearn(b.dataset.topic, { keepBack: true })));
    root.querySelectorAll("[data-start-trail]").forEach(b => b.addEventListener("click", () => window.KTApp.openTrail()));
    root.querySelectorAll("[data-goto-site]").forEach(b => b.addEventListener("click", () => window.KTApp.openSite(b.dataset.gotoSite, b.dataset.gotoLayer)));
    if (topic.mount) cleanup = topic.mount(root) || null;
    return topic.id;
  }

  window.KTLearn = { render, topics: TOPICS.map(t => ({ id: t.id, title: t.title })) };
})();
