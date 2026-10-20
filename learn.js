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

  // ---------- Topic 3: The extinction mystery ----------
  // Sets up the question without giving away the answer; the Trail of Evidence reveals it.
  function extinctionTopic() {
    return `
      <header class="lt-head">
        <div class="eyebrow">Background · 3</div>
        <h2>The extinction mystery</h2>
        <p class="lede">About 66 million years ago, the dinosaurs vanished, along with most life on Earth. For more than a century, nobody could say why.</p>
      </header>

      <section class="lt-sec">
        <h3><span class="num">1</span>What the fossils show</h3>
        <p>Fossil hunters noticed a pattern long ago. In rocks from the <b>Cretaceous</b> period there are dinosaurs, ammonites, giant forams and flowering forests. In the rocks just above, most of them are <b>gone</b>, and they never come back.</p>
        <p>Older textbooks put this at 65 million years ago; better dating methods now give about <b>66 million</b>. It was one of the five largest mass extinctions in Earth’s history: roughly three out of every four species disappeared. Small mammals, birds, crocodiles and some plants made it through, and inherited the planet.</p>
        <p><button type="button" class="link-btn" data-topic="timeline">See all five mass extinctions on the geological timeline →</button></p>
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

  // ---------- Topic 4: How to read a core ----------
  function coreTopic() {
    return `
      <header class="lt-head">
        <div class="eyebrow">Background · 4</div>
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
          <button type="button" class="btn ghost" data-topic="minerals">Next: crucial minerals →</button>
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

  // ---------- Topic 5: Crucial minerals ----------
  function mineralsTopic() {
    return `
      <header class="lt-head">
        <div class="eyebrow">Background · 5</div>
        <h2>Crucial minerals</h2>
        <p class="lede">Iridium hinted that something came from space. Minerals changed by the impact proved it, pointed to where it hit, explained why it was so deadly, and showed when it happened.</p>
      </header>

      <section class="lt-sec">
        <h3><span class="num">1</span>Minerals as witnesses</h3>
        <p>A mineral is a natural crystal with a set chemical recipe and a regular arrangement of atoms. Crystals keep a record of what happened to them. Squeeze one hard enough and its atomic structure breaks in telltale ways; heat it enough and it melts into glass. Some even hold atomic “clocks” that tell their age.</p>
        <p>Volcanoes are hot, but they can’t create the sudden, extreme pressure of an asteroid strike. So when the same damaged minerals turn up in the K-Pg boundary layer all over the world, they point to an impact, not an eruption.</p>
      </section>

      <section class="lt-sec">
        <h3><span class="num">2</span>Shocked quartz: proof of an impact</h3>
        <figure class="min-pair">
          <div><img src="image/unshocked-quartz.png" alt="An unshocked quartz grain under a polarizing microscope: smooth bands of color with no lines through it" loading="lazy"><span><b>Unshocked quartz</b> smooth, no lines</span></div>
          <div><img src="image/shocked-quartz.png" alt="A shocked quartz grain under a polarizing microscope, crossed by many fine, straight, parallel lines" loading="lazy"><span><b>Shocked quartz</b> sets of straight, parallel lines</span></div>
          <figcaption>Quartz grains under a polarizing microscope. Photos © David A. Kring, <a href="https://www.lpi.usra.edu/science/kring/Chicxulub/discovery/" target="_blank" rel="noopener">Lunar and Planetary Institute</a>.</figcaption>
        </figure>
        <p><b>Quartz</b> is one of the most common minerals in continental rock like granite and sandstone. When an asteroid hits, a shock wave squeezes the rock to more than 100,000 times the pressure of the air around us in a split second. Quartz crystals buckle along thin, flat planes that turn to glass. Under a microscope these show up as sets of fine, <b>straight, parallel lines</b> crossing the grain, often in two or more directions.</p>
        <p>In 1984, Bruce Bohor and colleagues found shocked quartz in the boundary clay in Montana. Volcanoes don’t make these features, so it was strong evidence for the asteroid. Scientists later noticed the grains are <b>biggest in North America</b> and smaller farther away, a hint that the crater was nearby.</p>
        <div class="lt-actions">
          <button type="button" class="link-btn" data-goto-site="hellcreek" data-goto-layer="clay">See it in the Hell Creek boundary clay →</button>
          <button type="button" class="link-btn" data-goto-site="chicxulub" data-goto-layer="granite">See it in the crater itself →</button>
        </div>
      </section>

      <section class="lt-sec">
        <h3><span class="num">3</span>Shocked feldspar: a pressure gauge</h3>
        <p><b>Feldspar</b> is the other main mineral in granite (the big pink and white crystals). It shows the same shock lines as quartz, but at higher pressures it does something more dramatic: it turns into <b>glass without ever melting</b>. The shock wave scrambles its atoms so fast that the crystal doesn’t have time to become liquid.</p>
        <p>In 1991, shocked quartz and shocked feldspar from old oil wells drilled into the buried Chicxulub structure proved it was an impact crater. Because feldspar changes in steps as pressure rises, it works like a <b>pressure gauge</b>, showing how hard different parts of the crater were hit.</p>
      </section>

      <section class="lt-sec">
        <h3><span class="num">4</span>Tektites and spherules: melted rock that rained down</h3>
        <figure class="min-photo min-slab"><img src="image/ktboundary.haiti-slab.png" alt="Cut rock slab packed with dark, rounded glass tektites in tan limestone" loading="lazy">
          <figcaption>Tektites in the Beloc boundary bed, Haiti. Photo: Jan Smit, VU Amsterdam.</figcaption></figure>
        <p>The impact melted and vaporized rock and blasted it above the atmosphere. The melt cooled into <b>glass droplets</b> that rained back down around the planet. Big ones (millimeters across) are called <b>tektites</b>; tiny ones are <b>spherules</b>. Over millions of years, most of this glass turns into clay, like the green spherule bed at Blake Nose.</p>
        <p>At Beloc, Haiti, the bed is up to half a meter thick, and some tektites still have fresh black glass inside. Some of that glass is unusually rich in <b>calcium and sulfur</b>, the recipe you’d get by melting a mix of continental rock and limestone and anhydrite. Thick ejecta and that recipe both pointed to a crater close by, around the Gulf of Mexico. When the glass was dated, it matched the age of Chicxulub’s melt rock.</p>
        <div class="lt-actions">
          <button type="button" class="link-btn" data-goto-site="beloc" data-goto-layer="tektites">See the Beloc tektites →</button>
          <button type="button" class="link-btn" data-goto-site="blake" data-goto-layer="ejecta">See the Blake Nose spherule bed →</button>
        </div>
      </section>

      <section class="lt-sec">
        <h3><span class="num">5</span>Anhydrite and sulfur: why this impact was so deadly</h3>
        <p>The asteroid struck a shallow sea on the Yucatán. Under it lay about 3 km of limestone and <b>anhydrite</b> (calcium sulfate, CaSO₄, a close cousin of gypsum). The impact <b>vaporized</b> this rock, releasing hundreds of billions of tonnes of sulfur, along with huge amounts of carbon dioxide.</p>
        <p>In the upper atmosphere the sulfur formed a haze of tiny <b>sulfate droplets</b> that reflected sunlight. For years the Earth was darker and much colder, photosynthesis faltered, food chains collapsed, and acid rain fell. An asteroid of the same size hitting deep ocean or granite would have released far less sulfur. Many scientists think the impact was so deadly partly because of <b>where</b> it hit.</p>
        <p class="lt-note">Anhydrite is common in the rocks around Chicxulub, but it is nearly missing from the impact rocks drilled from the crater in 2016. That is what you’d expect if most of it went up in vapor.</p>
        <div class="lt-actions">
          <button type="button" class="link-btn" data-goto-site="chicxulub" data-goto-layer="suevite">See the crater’s impact breccia →</button>
        </div>
      </section>

      <section class="lt-sec">
        <h3><span class="num">6</span>Zircon: the clock that pins down the date</h3>
        <figure class="min-pair min-zircon">
          <div><img src="image/unshocked-zircon.png" alt="An unshocked zircon crystal under an electron microscope, with sharp, unbroken growth rings from its center to its edge" loading="lazy"><span><b>Unshocked zircon</b> growth rings intact, edge to edge</span></div>
          <div><img src="image/shocked-zircon.png" alt="A shocked zircon crystal: a blue inner core with growth rings, surrounded by a grainy pink rim" loading="lazy"><span><b>Shocked zircon</b> grainy rim rebuilt by the impact</span></div>
          <figcaption>Zircons under an electron microscope. Right: shocked zircon crystal used to date another impact (Yarrabubba in Australia). The pink layer is recrystallised during impact leaving the blue inner core intact. Images via <a href="https://ontherocksgeoblog.wordpress.com/2013/02/21/zircon-geologys-tiny-timepiece/" target="_blank" rel="noopener">On the Rocks</a> (left) and <a href="https://www.realclearscience.com/articles/2020/01/22/earths_oldest_asteroid_strike_identified__it_may_have_caused_a_global_thaw_111265.html" target="_blank" rel="noopener">RealClearScience</a> (right).</figcaption>
        </figure>
        <p><b>Zircon</b> is a tiny, extremely tough crystal. When it grows, it traps a little <b>uranium</b> but almost no lead. Uranium slowly decays into lead at a known rate, so measuring the two tells you how long ago the crystal formed. Zircon is one of geology’s best clocks.</p>
        <ul class="lt-list">
          <li><b>Unshocked zircon</b> keeps the age of the rock it grew in. Zircons in the ejecta are hundreds of millions of years old, the same as the old basement rock under the Yucatán. That <b>fingerprint</b> ties boundary layers far away to Chicxulub.</li>
          <li><b>Shocked zircon</b> had its structure broken by the shock wave. The most strongly shocked grains turn granular, lose their lead and <b>restart their clocks</b>. Their ages point to the impact itself: about <b>66 million years ago</b>.</li>
        </ul>
        <p>One crystal can even hold both clocks, as in the shocked zircon above (right). Its grainy pink rim rebuilt itself during the impact, so it records <b>when the impact happened</b>. The blue core went through the same shock but kept its structure (look for the growth rings), so it still records <b>when the crystal first grew</b>.</p>
        <p>Zircons in volcanic ash beds just above and below the boundary, in places like Montana and Colorado, have been dated with similar care. Together these show that the crater, the ejecta and the extinction all happened at the <b>same moment</b>, within a few tens of thousands of years of each other, which is a blink in geologic time.</p>
      </section>

      <section class="lt-sec">
        <h3><span class="num">7</span>Putting it together</h3>
        <div class="min-table" role="table" aria-label="What each mineral revealed">
          <div role="row" class="mt-head"><span role="columnheader">Mineral</span><span role="columnheader">What it revealed</span></div>
          <div role="row"><b role="cell">Shocked quartz</b><span role="cell">An impact happened, and the crater was in North America</span></div>
          <div role="row"><b role="cell">Shocked feldspar</b><span role="cell">Chicxulub is an impact crater; how intense the shock was</span></div>
          <div role="row"><b role="cell">Tektites & spherules</b><span role="cell">Melted rock rained worldwide; thick beds point to the Gulf of Mexico</span></div>
          <div role="row"><b role="cell">Anhydrite & sulfur</b><span role="cell">Why the impact was so deadly: a sun-blocking sulfate haze</span></div>
          <div role="row"><b role="cell">Zircon</b><span role="cell">Links the ejecta to Chicxulub and dates the impact to 66 million years ago</span></div>
        </div>
        <div class="ask"><strong>Think about it</strong><p>Some scientists argued that Deccan Traps volcanoes caused the extinction. Why was finding shocked quartz in the boundary clay such a problem for that idea?</p>
          <details><summary>Show answer</summary><p>Volcanoes can’t produce the extreme, instant pressure needed to make the parallel shock lines in quartz. Only a high-speed impact can, so shocked quartz showed an impact happened right at the boundary.</p></details></div>
        <div class="ask"><strong>Think about it</strong><p>Two zircons from the same ejecta layer give different ages: one 550 million years, the other 66 million years. How can both be right?</p>
          <details><summary>Show answer</summary><p>They record different events. The unshocked zircon kept the age of the rock it grew in. The shocked zircon had its clock reset by the impact, so it records when the asteroid hit.</p></details></div>
        <div class="lt-actions">
          <button type="button" class="btn" data-goto-site="chicxulub">Explore the crater: Chicxulub →</button>
          <button type="button" class="btn ghost" data-topic="abundance">Next: species abundance →</button>
        </div>
      </section>`;
  }

  // ---------- Topic 6: Species abundance through a core ----------
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
        <div class="eyebrow">Background · 6</div>
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
        <div class="ab-wrap" id="abWrap">
          <div class="ab-readout" id="abReadout">
            <div class="ab-ro-head"><span class="ab-ro-zone" id="abZone" aria-live="polite"></span>
              <span class="ab-ro-btns"><button type="button" class="ab-play" id="abPlay">▶ Play</button><button type="button" data-nudge="2" aria-label="Younger">▲</button><button type="button" data-nudge="-2" aria-label="Older">▼</button></span></div>
            <div class="ab-ro-stack" id="abStack"></div>
            <ul class="ab-rows" id="abRows"></ul>
            <div class="ab-key" id="abKey"></div>
            <p class="ab-key-about" id="abAbout" hidden></p>
          </div>
          <div class="ab-chart" id="abChart"></div>
        </div>
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

  // Guided tour: the cursor climbs the section and pauses at these moments (g = group to highlight).
  const STOPS = [
    { t: 20, g: "globo", title: "Latest Cretaceous",
      text: "A stable, diverse ocean. Large, ornate Globotruncana (blue) and two-rowed Heterohelix (teal) make up almost all the forams. Tiny Guembelitria (red) is rare, about 4%." },
    { t: 40, g: "guemb", title: "The impact: K-Pg boundary",
      text: "At this line an asteroid hits Chicxulub. The blue and teal bands stop dead: every Globotruncana and nearly every Heterohelix is gone. Rare Guembelitria suddenly makes up over 90% of the survivors." },
    { t: 46, g: "guemb", title: "Zone 1 · Disaster bloom",
      text: "Guembelitria is a tough, fast-breeding generalist. With its competitors gone, it floods the stressed ocean. Species like this are called “disaster taxa.”" },
    { t: 60, g: "parvu", title: "Zone 2 · Tiny pioneers",
      text: "Brand-new species evolve from the few survivors. Tiny, simple Parvularugoglobigerina (purple) now make up about 70%, and Guembelitria fades." },
    { t: 78, g: "wood", title: "Zone 3 · Recovery begins",
      text: "Small two-rowed Woodringina (yellow) take over, and larger globular Eoglobigerina (green) start to spread." },
    { t: 100, g: "eog", title: "Top of the section",
      text: "Hundreds of thousands of years after the impact, diversity is still climbing, and the giant Cretaceous forms never come back." }
  ];
  const TOUR_SPEED = 9; // % of the section per second

  // Interactive stacked-abundance chart. Rendered at the container's pixel width so text stays readable on phones.
  // `root` is the scrolling #learn container.
  function mountAbundance(root) {
    const chart = $("#abChart", root), rows = $("#abRows", root), key = $("#abKey", root), about = $("#abAbout", root);
    const readout = $("#abReadout", root), zoneEl = $("#abZone", root), stack = $("#abStack", root), playBtn = $("#abPlay", root);
    const touch = !window.matchMedia("(hover: hover)").matches;
    const phone = () => window.matchMedia("(max-width: 860px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    $("#abHint", root).innerHTML = touch
      ? "Press <b>▶ Play</b> to travel up through the core. It pauses at the key moments; use ▲ ▼ to step on your own."
      : "Move your pointer up and down the chart (or use the ↑ ↓ keys) to see the mix of forams at each moment, or press <b>▶ Play</b> for a guided tour. Hover a foram in the legend to learn about it.";
    let t = 46, W = 0, dims = null, focusGroup = null;
    let tour = null; // { next: index into STOPS, mode: "run" | "pause" | "stop", raf, last }

    // Legend beside the chart (desktop): live percentages plus real specimens
    rows.innerHTML = GROUPS.map(g => `
      <li data-g="${g.id}" tabindex="0" title="${g.name}">
        <span class="sw" style="background:${g.color}"></span>${foramIcon(g.id, 26)}
        <span class="nm">${g.short}${g.cards ? `<span class="ab-real">${g.cards.map(n => `<span class="ab-thumb" title="Real specimen, enlarged ${g.zoom}×"><img src="image/forams/card${String(n).padStart(2, "0")}.jpg" alt="Real specimen, card ${n}" loading="lazy" style="transform:scale(${g.zoom})"></span>`).join("")}</span>` : ""}</span>
        <b class="pct"></b></li>`).join("");
    // Phones: a compact key does the same job
    key.innerHTML = `<div class="ab-chips">${GROUPS.map(g => `
      <button type="button" class="ab-chip" data-g="${g.id}" aria-pressed="false">
        <span class="sw" style="background:${g.color}"></span>${foramIcon(g.id, 18)}<span class="nm">${g.short}</span><b class="pct"></b></button>`).join("")}</div>`;
    const setFocus = id => { focusGroup = id; highlight(); };
    key.querySelectorAll(".ab-chip").forEach(b => b.addEventListener("click", () => setFocus(focusGroup === b.dataset.g ? null : b.dataset.g)));
    rows.querySelectorAll("li").forEach(n => {
      n.addEventListener("mouseenter", () => setFocus(n.dataset.g));
      n.addEventListener("mouseleave", () => setFocus(null));
      n.addEventListener("focus", () => setFocus(n.dataset.g));
      n.addEventListener("blur", () => setFocus(null));
    });
    readout.querySelectorAll("[data-nudge]").forEach(b => b.addEventListener("click", () => { endTour(); nudge(+b.dataset.nudge); }));
    playBtn.addEventListener("click", () => {
      if (!tour) startTour();
      else if (tour.mode === "run") { tour.mode = "pause"; cancelAnimationFrame(tour.raf); syncPlay(); }
      else if (tour.mode === "pause") run();
      else resume();
    });

    const pop = document.createElement("div");
    pop.className = "ab-pop";
    pop.hidden = true;
    pop.setAttribute("role", "status");

    function draw() {
      W = chart.clientWidth;
      if (!W) return;
      const narrow = W < 520;
      let H = narrow ? 620 : 700;
      // phones: fit the whole chart on screen below the pinned readout
      if (phone()) H = Math.round(Math.max(380, Math.min(H, root.clientHeight - readout.offsetHeight - 8)));
      const L = narrow ? 34 : 92, R = 10, T = 30, B = 44;
      const PH = H - T - B, PW = W - L - R;
      const y = tt => T + (1 - tt / 100) * PH, x = p => L + p / 100 * PW;
      dims = { H, L, T, PH, y, x };
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
      // mouse only: on touch screens taps fought with scrolling and zooming, so phones use Play and ▲ ▼
      svg.addEventListener("pointerdown", e => { if (e.pointerType === "mouse") { endTour(); setFromEvent(e); } });
      svg.addEventListener("pointermove", e => { if (e.pointerType === "mouse" && !tour) setFromEvent(e); });
      svg.addEventListener("keydown", e => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); endTour(); nudge(e.key === "ArrowUp" ? 2 : -2); }
      });
      chart.appendChild(pop);
      highlight();
      update();
      placePop();
    }

    function nudge(d) { t = Math.max(0, Math.min(100, t + d)); update(); }

    function update() {
      if (!dims) return;
      const cy = dims.y(t);
      const cur = $(".ab-cursor", chart);
      cur.querySelector("line").setAttribute("y1", cy); cur.querySelector("line").setAttribute("y2", cy);
      cur.querySelector("circle").setAttribute("cy", cy);
      const p = pctAt(t), z = zoneAt(t);
      if (zoneEl.textContent !== z.name) { zoneEl.textContent = z.name; zoneEl.style.setProperty("--zc", z.color); }
      stack.innerHTML = GROUPS.map((g, k) => p[k] >= 0.5 ? `<span style="width:${p[k]}%;background:${g.color}" title="${g.name}: ${Math.round(p[k])}%"></span>` : "").join("");
      [rows.querySelectorAll("li"), key.querySelectorAll(".ab-chip")].forEach(list => list.forEach((n, k) => {
        n.querySelector(".pct").textContent = `${Math.round(p[k])}%`;
        n.classList.toggle("absent", p[k] < 0.5);
      }));
    }

    function highlight() {
      chart.querySelector("svg")?.classList.toggle("focusing", !!focusGroup);
      chart.querySelectorAll("[data-g]").forEach(n => n.classList.toggle("hi", n.dataset.g === focusGroup));
      rows.querySelectorAll("li").forEach(n => n.classList.toggle("hi", n.dataset.g === focusGroup));
      key.querySelectorAll(".ab-chip").forEach(c => c.setAttribute("aria-pressed", c.dataset.g === focusGroup));
      const g = GROUPS.find(g => g.id === focusGroup);
      about.hidden = !g || !!tour; // during the tour the pop-up does the explaining
      if (g) about.innerHTML = `<b>${g.name}.</b> ${g.about}`;
    }

    // ----- guided tour -----
    function syncPlay() {
      const m = tour && tour.mode;
      playBtn.textContent = m === "run" ? "❚❚ Pause" : m === "stop" ? (tour.next === STOPS.length - 1 ? "↺ Replay" : "▶ Next") : "▶ Play";
      playBtn.classList.toggle("on", !!tour);
    }
    function step(now) {
      if (!tour || tour.mode !== "run") return;
      const dt = Math.min(0.05, (now - (tour.last || now)) / 1000);
      tour.last = now;
      const target = STOPS[tour.next].t;
      t = reduce ? target : Math.min(target, t + TOUR_SPEED * dt);
      update();
      if (t >= target) { tour.mode = "stop"; showStop(); syncPlay(); return; }
      tour.raf = requestAnimationFrame(step);
    }
    function run() {
      tour.mode = "run";
      tour.last = 0;
      pop.hidden = true;
      setFocus(null);
      syncPlay();
      tour.raf = requestAnimationFrame(step);
    }
    function startTour() {
      endTour();
      tour = { next: 0 };
      t = 0;
      setTouring(true);
      $("#abWrap", root).scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
      run();
    }
    function resume() {
      if (tour.next >= STOPS.length - 1) return startTour();
      tour.next++;
      run();
    }
    function endTour() {
      if (!tour) return;
      cancelAnimationFrame(tour.raf);
      tour = null;
      pop.hidden = true;
      setFocus(null);
      syncPlay();
      setTouring(false);
    }
    // phones: shrink the key while touring so the whole chart fits on screen
    function setTouring(on) {
      readout.classList.toggle("touring", on);
      if (phone()) draw(); else update();
    }
    function showStop() {
      const i = tour.next, s = STOPS[i], last = i === STOPS.length - 1;
      setFocus(s.g);
      pop.innerHTML = `<button type="button" class="ab-pop-x" aria-label="End tour">×</button>
        <b>${s.title}</b><p>${s.text}</p>
        <div class="ab-pop-foot"><span>${i + 1} of ${STOPS.length}</span><button type="button" class="btn small">${last ? "↺ Replay" : "Continue ▶"}</button></div>`;
      pop.querySelector(".btn").addEventListener("click", resume);
      pop.querySelector(".ab-pop-x").addEventListener("click", endTour);
      pop.hidden = false;
      placePop();
    }
    // Place the pop-up beside the cursor line, its arrow pointing at the middle of the highlighted band.
    function placePop() {
      if (pop.hidden || !dims || !tour) return;
      const s = STOPS[tour.next], cy = dims.y(s.t), p = pctAt(s.t);
      const k = GROUPS.findIndex(g => g.id === s.g);
      const ax = dims.x(p.slice(0, k).reduce((a, v) => a + v, 0) + p[k] / 2);
      const w = Math.min(290, W - 16), px = Math.max(8, Math.min(W - w - 8, ax - w / 2));
      const below = cy < dims.H * 0.45;
      pop.classList.toggle("below", below);
      pop.style.width = w + "px";
      pop.style.left = px + "px";
      pop.style.top = below ? `${cy + 14}px` : "";
      pop.style.bottom = below ? "" : `${dims.H - cy + 14}px`;
      pop.style.setProperty("--ax", `${Math.max(16, Math.min(w - 16, ax - px))}px`);
    }

    draw();
    let rt;
    const ro = new ResizeObserver(() => { if (chart.clientWidth !== W) { clearTimeout(rt); rt = setTimeout(draw, 80); } });
    ro.observe(chart);
    return () => { ro.disconnect(); endTour(); };
  }

  // ---------- Topic 1: Using this app ----------
  function guideTopic() {
    const mode = (kind, title, what, steps, btn) => `
      <div class="gd-mode">
        <figure class="gd-fig">${figMode(kind)}</figure>
        <b>${title}</b><p>${what}</p>
        <ul class="lt-list">${steps.map(s => `<li>${s}</li>`).join("")}</ul>
        ${btn}
      </div>`;
    return `
      <header class="lt-head">
        <div class="eyebrow">Background · 1</div>
        <h2>Using this app</h2>
        <p class="lede">The K-Pg Boundary Explorer lets you investigate one of the biggest mysteries in Earth’s history the way geologists did: by reading the rocks.</p>
      </header>

      <section class="lt-sec">
        <h3><span class="num">1</span>What this app is</h3>
        <p>About 66 million years ago, most life on Earth disappeared, dinosaurs included. A thin layer of rock records that moment at sites all over the world. This app brings ten of them together: cores drilled from the seafloor and from the crater itself, sea cliffs, river banks and badlands.</p>
        <p>At each site you can climb up through the rock, layer by layer, and see what each layer is, what it contains, and what it tells scientists. The content follows HHMI BioInteractive’s <em>The Day the Mesozoic Died</em> classroom materials and published research, so it works alongside the worksheets.</p>
      </section>

      <section class="lt-sec">
        <h3><span class="num">2</span>Three ways in</h3>
        <p>The tabs at the top of the screen switch between them. You can move between them at any time.</p>
        <div class="gd-modes">
          ${mode("explore", "Explore", "Pick a site and move through its rock layers at your own pace.", [
            "Click a dot on the world map, or a site card below it.",
            "Hover over (or tap) a layer to see what it is, why it matters and the evidence it holds.",
            "Step from older to younger layers with <kbd>↑</kbd> <kbd>↓</kbd> or ▲ ▼.",
            "<b>← World map</b> (or <kbd>Esc</kbd>) takes you back."
          ], `<button type="button" class="btn small" data-goto-map>Open the map →</button>`)}
          ${mode("trail", "Trail of Evidence", "Follow 14 clues in the order scientists found them, from Italy in the 1970s to a crater buried in Mexico.", [
            "Each clue opens the right site and layer for you.",
            "Use <b>Next clue →</b> and <b>← Prev</b> in the bar at the bottom.",
            "A tally shows which fields of science added evidence.",
            "The trail ends with a verdict."
          ], `<button type="button" class="btn small" data-start-trail>Start the trail →</button>`)}
          ${mode("learn", "Background info", "Short reading pages on the ideas you need: geologic time, cores, minerals and fossils.", [
            "Choose a topic from the menu.",
            "Charts have a <b>▶ Play</b> button for a guided tour.",
            "“Learn more” links elsewhere in the app jump here; a <b>← Back</b> button returns you to where you were."
          ], `<button type="button" class="btn small" data-topic="timeline">Read the timeline →</button>`)}
        </div>
      </section>

      <section class="lt-sec">
        <h3><span class="num">3</span>Handy controls</h3>
        <div class="min-table" role="table" aria-label="Controls and what they do">
          <div role="row" class="mt-head"><span role="columnheader">Control</span><span role="columnheader">What it does</span></div>
          <div role="row"><b role="cell"><kbd>↑</kbd> <kbd>↓</kbd> or ▲ ▼</b><span role="cell">Move to a younger or older layer, or through time on a chart</span></div>
          <div role="row"><b role="cell">Fit / Zoom</b><span role="cell">Show the whole rock column, or enlarge it to see thin layers</span></div>
          <div role="row"><b role="cell">Think about it</b><span role="cell">Try the question first, then press <b>Show answer</b></span></div>
          <div role="row"><b role="cell">Learn more →</b><span role="cell">Opens the background topic that explains what you’re looking at</span></div>
          <div role="row"><b role="cell">On a phone</b><span role="cell">Layer details slide up from the bottom; tap or swipe the handle to see more or less</span></div>
        </div>
        <p class="lt-note">Teachers: you can link straight to a site, layer, clue or topic. For example, add <code>#site=blake&amp;layer=contact</code>, <code>#trail=1</code> or <code>#learn=timeline</code> to the end of the app’s web address.</p>
      </section>

      <section class="lt-sec">
        <h3><span class="num">4</span>A good place to start</h3>
        <p>New to all of this? Try this order:</p>
        <ol class="lt-steps">
          <li><b>Geological timeline:</b> where the K-Pg boundary fits in Earth’s history.</li>
          <li><b>The extinction mystery:</b> the question scientists were trying to answer.</li>
          <li><b>How to read a core:</b> why the bottom is older than the top.</li>
          <li><b>Explore</b> a site or two, such as Blake Nose and Gubbio.</li>
          <li><b>Trail of Evidence:</b> put the clues together and reach the verdict.</li>
          <li><b>Crucial minerals</b> and <b>Species abundance</b> to dig deeper.</li>
        </ol>
        <div class="lt-actions">
          <button type="button" class="btn" data-topic="timeline">Next: geological timeline →</button>
        </div>
      </section>`;
  }

  // Small sketches of each mode's screen (not to scale)
  function figMode(kind) {
    const frame = `<rect x="1" y="1" width="238" height="138" rx="10" fill="#13110f" stroke="rgba(241,233,222,.28)"/>`;
    const lines = (x, y, ws, gap = 7) => ws.map((w, i) => `<rect x="${x}" y="${y + i * gap}" width="${w}" height="3" rx="1.5" fill="#5b5148"/>`).join("");
    let art = "";
    if (kind === "explore") {
      let yy = 14;
      const col = BANDS.map(b => { const h = b.h * 1.05; const r = `<rect x="150" y="${yy}" width="26" height="${h}" fill="${b.c}"/>`; yy += h; return r; }).join("");
      art = `<rect x="10" y="10" width="126" height="120" rx="6" fill="#1d3346"/>
        <path d="M22 40 q18 -14 40 -4 q10 14 -6 26 q-22 6 -34 -22z M78 70 q24 -8 44 6 q-6 30 -30 34 q-18 -16 -14 -40z" fill="#3a4a36"/>
        <path d="M46 52 Q70 40 98 86" fill="none" stroke="#e9c64b" stroke-width="1.5" stroke-dasharray="4 3"/>
        <circle cx="46" cy="52" r="5" fill="#e8743f" stroke="#13110f"/><circle cx="98" cy="86" r="4.5" fill="#7aa8d6" stroke="#13110f"/>
        <circle cx="34" cy="30" r="3.5" fill="#93c47d" stroke="#13110f"/><circle cx="108" cy="104" r="3.5" fill="#7aa8d6" stroke="#13110f"/>
        ${col}<rect x="148" y="${14 + BANDS[0].h * 1.05 + 1}" width="30" height="${BANDS[1].h * 1.05 + 2}" fill="none" stroke="#e9c64b" stroke-width="2"/>
        <rect x="184" y="14" width="46" height="112" rx="5" fill="#24201c"/>
        <rect x="190" y="20" width="30" height="4" rx="2" fill="#e9c64b"/>${lines(190, 30, [34, 28, 32, 22, 30, 26, 34, 18], 8)}`;
    } else if (kind === "trail") {
      const dots = Array.from({ length: 14 }, (_, i) => `<circle cx="${18 + i * 15.6}" cy="18" r="4.5" fill="${i < 5 ? "#e9c64b" : "#3a332c"}"/>`).join("");
      art = `<line x1="18" x2="221" y1="18" y2="18" stroke="#3a332c" stroke-width="2"/>${dots}
        <rect x="16" y="32" width="208" height="62" rx="6" fill="#24201c"/>
        <rect x="24" y="40" width="70" height="5" rx="2.5" fill="#e9c64b"/>${lines(24, 52, [180, 160, 172, 120], 9)}
        <rect x="16" y="102" width="208" height="28" rx="6" fill="#1c1916" stroke="rgba(241,233,222,.12)"/>
        <rect x="24" y="109" width="40" height="14" rx="7" fill="none" stroke="#9a8e80"/><rect x="170" y="109" width="46" height="14" rx="7" fill="#f1e9de"/>
        <rect x="76" y="113" width="80" height="6" rx="3" fill="#3a332c"/><rect x="76" y="113" width="30" height="6" rx="3" fill="#93c47d"/>`;
    } else {
      const toc = Array.from({ length: 6 }, (_, i) => `<rect x="12" y="${14 + i * 19}" width="56" height="14" rx="4" fill="${i === 1 ? "#24201c" : "none"}" stroke="${i === 1 ? "#e9c64b" : "none"}"/>
        <circle cx="20" cy="${21 + i * 19}" r="4" fill="${i === 1 ? "#e9c64b" : "#3a332c"}"/><rect x="28" y="${19.5 + i * 19}" width="34" height="3" rx="1.5" fill="#5b5148"/>`).join("");
      const sp = (x, w) => `<path d="M${x} 126 C${x - w} 110 ${x - w} 70 ${x} 54 C${x + w} 70 ${x + w} 110 ${x} 126Z" fill="#a9cf6e"/>`;
      art = `${toc}<rect x="80" y="14" width="90" height="7" rx="3" fill="#f1e9de"/>${lines(80, 28, [146, 130])}
        <rect x="80" y="46" width="148" height="84" rx="5" fill="#f6f1e7"/>
        <rect x="80" y="${46 + 84 * 0.55}" width="148" height="5" fill="#e9c64b" opacity=".6"/>
        ${sp(110, 10)}<path d="M150 126 C142 110 140 80 150 70 C160 80 158 110 150 126Z" fill="#e3a24f"/><path d="M190 80 C180 70 184 56 190 50 C196 56 200 70 190 80Z" fill="#d99ac6"/>`;
    }
    return `<svg viewBox="0 0 240 140" role="img" aria-label="Sketch of the ${kind === "learn" ? "Background info" : kind === "trail" ? "Trail of Evidence" : "Explore"} screen">${frame}${art}</svg>`;
  }

  // ---------- Topic 2: Geological timeline ----------
  // Ages in millions of years ago (Ma), from the International Chronostratigraphic Chart; colors are the chart's official ones.
  const AGE = 538.8;
  const ERAS = [
    { name: "Paleozoic", from: 538.8, to: 251.9, color: "#99c08d", means: "ancient life" },
    { name: "Mesozoic", from: 251.9, to: 66, color: "#67c5ca", means: "middle life" },
    { name: "Cenozoic", from: 66, to: 0, color: "#f2f91d", means: "new life" }
  ];
  const PERIODS = [
    { name: "Cambrian", abbr: "Ꞓ", from: 538.8, to: 485.4, color: "#7fa056", named: "Cambria, the Latin name for Wales",
      text: "Life explodes in the sea: the first animals with shells, eyes and legs. Trilobites are everywhere. Nothing lives on land yet." },
    { name: "Ordovician", abbr: "O", from: 485.4, to: 443.8, color: "#009270", named: "The Ordovices, an ancient tribe in Wales",
      text: "Sea life diversifies and the first tiny plants creep onto land. It ends in an ice age and the first of the Big Five extinctions." },
    { name: "Silurian", abbr: "S", from: 443.8, to: 419.2, color: "#b3e1b6", named: "The Silures, another ancient Welsh tribe",
      text: "Coral reefs spread, fish with jaws appear, and small plants with stems grow along the shore." },
    { name: "Devonian", abbr: "D", from: 419.2, to: 358.9, color: "#cb8c37", named: "Devon, England",
      text: "The “Age of Fishes.” The first forests grow and the first four-legged animals crawl onto land." },
    { name: "Carboniferous", abbr: "C", from: 358.9, to: 298.9, color: "#67a599", named: "“Coal-bearing,” for its coal beds",
      text: "Swamp forests of giant tree ferns and club mosses, later buried to become coal. Amphibians rule the land and insects grow huge." },
    { name: "Permian", abbr: "P", from: 298.9, to: 251.9, color: "#f04028", named: "Perm, a region of Russia",
      text: "The continents join into one supercontinent, Pangaea. Sail-backed synapsids, distant relatives of mammals, are the top land animals." },
    { name: "Triassic", abbr: "T", from: 251.9, to: 201.4, color: "#812b92", named: "Three-part rock layers in Germany",
      text: "Life slowly recovers from the Great Dying. The first dinosaurs and the first mammals appear." },
    { name: "Jurassic", abbr: "J", from: 201.4, to: 145, color: "#34b2c9", named: "The Jura Mountains of France and Switzerland",
      text: "Giant dinosaurs roam forests of conifers, cycads and ferns. Ammonites fill the seas and the first birds appear." },
    { name: "Cretaceous", abbr: "K", from: 145, to: 66, color: "#7fc64e", named: "Creta, Latin for chalk",
      text: "Flowering plants spread, and dinosaurs, ammonites and giant sea reptiles thrive, until the very end." },
    { name: "Paleogene", abbr: "Pg", from: 66, to: 23.03, color: "#fd9a52", named: "Greek for “old-born”",
      text: "With the dinosaurs gone, mammals and birds diversify fast, from tiny shrews to the first whales." },
    { name: "Neogene", abbr: "N", from: 23.03, to: 2.58, color: "#ffe619", named: "Greek for “new-born”",
      text: "Grasslands spread and many modern mammals appear, including the earliest human relatives." },
    { name: "Quaternary", abbr: "Q", from: 2.58, to: 0, color: "#f9f97f", named: "“Fourth,” from an old four-part scheme",
      text: "Ice ages come and go. Modern humans appear about 300,000 years ago." }
  ];
  const EXTINCTIONS = [
    { t: 444, short: "End-Ordovician", name: "End-Ordovician", lost: 85,
      cause: "An ice age: glaciers locked up water, sea level dropped and the oceans cooled.", hit: "Trilobites, shellfish, reef animals" },
    { t: 372, short: "Late Devonian", name: "Late Devonian", lost: 75,
      cause: "Still debated. The oceans lost oxygen, perhaps linked to volcanoes and to the first forests.", hit: "Reef builders, armored fish, trilobites" },
    { t: 251.9, short: "End-Permian", name: "End-Permian · “the Great Dying”", lost: 90,
      cause: "Enormous eruptions in Siberia: extreme global warming and acidic oceans short on oxygen.", hit: "The last trilobites, most synapsids, many insects and plants" },
    { t: 201.4, short: "End-Triassic", name: "End-Triassic", lost: 75,
      cause: "Massive eruptions as the supercontinent Pangaea began to split apart.", hit: "Many reptiles and large amphibians; dinosaurs survived and took over" },
    { t: 66, short: "K-Pg", name: "End-Cretaceous (K-Pg)", lost: 75, kpg: true,
      cause: "The mystery this app investigates.", hit: "All dinosaurs except birds, ammonites, giant sea reptiles, many plants and forams" }
  ];
  const periodAt = t => PERIODS.find(p => t <= p.from && t >= p.to) || PERIODS[0];
  const eraAt = t => ERAS.find(e => t <= e.from && t >= e.to) || ERAS[0];
  const fmtMa = t => t < 0.5 ? "today" : `${t < 10 ? t.toFixed(1) : Math.round(t)} million years ago`;

  // Silhouettes in a 40×40 box, drawn in currentColor so they work on the light chart and the dark readout.
  const TL_ICONS = {
    trilo: () => `<path d="M5 16 C5 8 12 4 20 4 C28 4 35 8 35 16 L33.5 25 L30.5 16.8 Q20 12.6 9.5 16.8 L6.5 25 Z"/>` +
      [0, 1, 2, 3, 4, 5].map(i => { const w = 21 - i * 1.4; return `<rect x="${(20 - w / 2).toFixed(1)}" y="${(16.4 + i * 3.3).toFixed(1)}" width="${w.toFixed(1)}" height="2.5" rx="1.2"/>`; }).join("") +
      `<ellipse cx="20" cy="37.2" rx="6" ry="2.4"/>`,
    ammon() {
      const r = th => 17 * Math.exp(-0.15 * th);
      let d = "";
      for (let th = 0; th <= 3.4 * Math.PI; th += 0.2) d += `${d ? "L" : "M"}${(20 + r(th) * Math.cos(th)).toFixed(1)} ${(20 + r(th) * Math.sin(th)).toFixed(1)}`;
      let ribs = "";
      for (let th = 0; th < 2 * Math.PI; th += Math.PI / 7) {
        const a = r(th), b = r(th + 2 * Math.PI);
        ribs += `M${(20 + a * Math.cos(th)).toFixed(1)} ${(20 + a * Math.sin(th)).toFixed(1)}L${(20 + b * Math.cos(th)).toFixed(1)} ${(20 + b * Math.sin(th)).toFixed(1)}`;
      }
      return `<g fill="none" stroke="currentColor" stroke-linecap="round"><path d="${d}" stroke-width="3.2"/><path d="${ribs}" stroke-width="1.6"/></g>`;
    },
    fish: () => `<path d="M3 20 C9 11 22 10 30 18 L38 11 L36 20 L38 29 L30 22 C22 30 9 29 3 20Z"/><path d="M13 14 L18 6 L23 13Z"/><path d="M15 26 L19 32 L21 26Z"/>`,
    amph: () => `<path d="M2 21 C3 17 7 16 11 17 C15 16 22 16 28 17 C33 18 36 20 39 23 C34 22 30 22 27 22.5 C21 23.5 15 23.5 11 23.5 C7 24.5 3 24 2 21Z"/><path d="M12 22 L9 29 L12.5 29 L15 23Z M23 22 L20 29 L23.5 29 L26 22.5Z"/>`,
    sail: () => `<path d="M3 27 C9 25 15 24 19 24 L33 24 C36 24 38 26 39 28 C37 29 35 29 33 29 L30 29 L31 34 L28 34 L26.5 29 L17 29 L16 34 L13 34 L13 28.5 C9 28.5 6 28 3 27Z"/><path d="M17 24 C18 15 22 8 25 7 C28 9 30 16 31 24Z"/>`,
    mammal: () => `<ellipse cx="19" cy="26" rx="11" ry="7"/><path d="M26 21 C31 19 35 21 39 25 C35 27 31 28 26 28Z"/><circle cx="29" cy="18.5" r="3.2"/><rect x="12" y="30" width="3" height="5"/><rect x="23" y="30" width="3" height="5"/><path d="M9 27 Q3 31 2 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,
    dino: () => `<path d="M2 27 C8 27 12 23 16 21 C20 17 26 17 29 20 C30 14 32 8 35 6 C37 5 39 6 38.5 8 L36 8.5 C34.5 12 33.5 18 32.5 24 L32.5 33 L29.5 33 L29.5 28 L24 28 L23.5 33 L20.5 33 L20.5 27.5 C14 28 8 28.5 2 27Z"/>`,
    bird: () => `<path d="M2 15 Q11 9 20 19 Q29 9 38 15 Q29 13 21 23 L19 23 Q11 13 2 15Z"/>`,
    fern() {
      let s = `<path d="M20 39 Q19 22 23 6 Q24 3 21 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`;
      for (let i = 0; i < 8; i++) {
        const y = 34 - i * 4, len = 11 - i * 1.1, xc = 19.6 + i * 0.4;
        s += ell(xc - len / 2, y, len / 2, 1.7, 20) + ell(xc + len / 2, y, len / 2, 1.7, -20);
      }
      return s;
    },
    conifer: () => `<path d="M20 2 L28 13 L24.5 13 L32 23 L27 23 L35 33 L5 33 L13 23 L8 23 L15.5 13 L12 13Z"/><rect x="18" y="33" width="4" height="6"/>`,
    flower() {
      let s = `<path d="M20 22 V39" stroke="currentColor" stroke-width="2"/>` + ell(25, 32, 4.5, 2, -30);
      for (let k = 0; k < 5; k++) {
        const a = -90 + k * 72, r = a * Math.PI / 180;
        s += ell(20 + 9.5 * Math.cos(r), 15 + 9.5 * Math.sin(r), 4.6, 6.2, a + 90);
      }
      return s + `<circle cx="20" cy="15" r="2.6"/>`;
    }
  };
  const tlDefs = () => `<defs>${Object.entries(TL_ICONS).map(([id, f]) =>
    `<symbol id="t-${id}" viewBox="0 0 40 40"><g fill="currentColor">${f()}</g></symbol>`).join("")}</defs>`;
  const tlIcon = (id, size = 26) =>
    `<svg class="foram-ico tl-ri" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true"><use href="#t-${id}"/></svg>`;

  // Relative abundance/diversity of each group, 0–1, as [Ma, value] from oldest to youngest.
  // Illustrative, simplified from textbook spindle diagrams; widths compare a group with itself through time.
  // Groups with `phases` change name and icon at an age (the phase applies while t >= its `to`).
  const HABITATS = [{ id: "sea", name: "In the water", short: "Water" }, { id: "land", name: "Land animals", short: "Land animals" }, { id: "plant", name: "Plants", short: "Plants" }];
  const LIFE = [
    { id: "trilo", hab: "sea", short: "Trilobites", color: "#9cc3e6",
      about: "Armored sea creatures related to crabs and insects. They ruled the early seas, dwindled after each crisis, and the Great Dying finished them off.",
      pts: [[521, 0], [510, 0.9], [500, 1], [485, 0.85], [460, 0.7], [444.2, 0.6], [443.8, 0.3], [420, 0.25], [390, 0.25], [372.2, 0.2], [371.8, 0.08], [300, 0.05], [252.1, 0.04], [251.9, 0]] },
    { id: "ammon", hab: "sea", short: "Ammonites", color: "#5fb3a8",
      about: "Squid relatives in coiled shells. Nearly wiped out three times, they bounced back each time, until the K-Pg boundary ended them for good.",
      pts: [[410, 0], [395, 0.4], [372.2, 0.55], [371.8, 0.12], [355, 0.4], [300, 0.4], [252.1, 0.45], [251.9, 0.05], [240, 0.6], [205, 0.6], [201.6, 0.55], [201.4, 0.05], [190, 0.65], [150, 0.85], [100, 0.85], [66.1, 0.7], [66, 0]] },
    { id: "fish", hab: "sea", short: "Fish", color: "#8b9be0",
      about: "Fish appeared in the Cambrian and peaked first in the Devonian, the “Age of Fishes.” Today there are more species of fish than of all other vertebrates combined.",
      pts: [[505, 0], [470, 0.12], [430, 0.3], [400, 0.75], [372.2, 0.85], [371.8, 0.45], [320, 0.55], [252.1, 0.55], [251.9, 0.35], [201.4, 0.55], [150, 0.65], [100, 0.8], [66.1, 0.82], [66, 0.62], [30, 0.9], [0, 1]] },
    { id: "amph", hab: "land", short: "Amphibians", color: "#e9d45a",
      about: "The first four-legged animals. Some Carboniferous amphibians were as long as a car; today’s frogs and salamanders are their small descendants.",
      pts: [[375, 0], [355, 0.35], [330, 0.85], [305, 1], [270, 0.75], [252.1, 0.65], [251.9, 0.3], [230, 0.4], [201.6, 0.35], [201.4, 0.14], [150, 0.18], [66.1, 0.25], [66, 0.22], [0, 0.35]] },
    { id: "mammal", hab: "land", short: "Mammals", color: "#e07a63",
      phases: [{ to: 201.4, icon: "sail", short: "Synapsids", name: "Synapsids (mammal ancestors)" }, { icon: "mammal", short: "Mammals", name: "Mammals" }],
      about: "Sail-backed synapsids like Dimetrodon ruled the Permian. Their small descendants, the first mammals, lived in the dinosaurs’ shadow for 150 million years, then took over.",
      pts: [[320, 0], [300, 0.45], [280, 0.85], [260, 0.95], [252.1, 0.85], [251.9, 0.25], [240, 0.3], [220, 0.18], [201.4, 0.14], [150, 0.16], [66.1, 0.18], [66, 0.13], [56, 0.6], [40, 0.9], [0, 1]] },
    { id: "dino", hab: "land", short: "Dinosaurs", color: "#e3a24f",
      phases: [{ to: 66, icon: "dino", short: "Dinosaurs", name: "Dinosaurs" }, { icon: "bird", short: "Birds", name: "Birds (living dinosaurs)", faded: true }],
      about: "Small at first, dinosaurs took over after the End-Triassic extinction and ruled the land for 135 million years. Birds evolved from them in the Jurassic and are the only ones left.",
      pts: [[240, 0], [230, 0.12], [205, 0.3], [201.6, 0.3], [201.4, 0.26], [190, 0.55], [160, 0.85], [120, 0.9], [66.1, 1], [66, 0.12], [50, 0.3], [0, 0.4]] },
    { id: "fern", hab: "plant", short: "Ferns", name: "Ferns & club mosses", color: "#a9cf6e",
      about: "Plants that spread by spores instead of seeds. Tree-sized ones formed the coal swamps. Right after the K-Pg boundary they briefly took over: the “fern spike.”",
      pts: [[430, 0], [410, 0.25], [390, 0.55], [360, 0.85], [320, 1], [305, 0.75], [252.1, 0.55], [251.9, 0.3], [230, 0.45], [150, 0.4], [100, 0.3], [66.1, 0.25], [66, 0.65], [65.4, 0.6], [64, 0.25], [0, 0.3]] },
    { id: "conifer", hab: "plant", short: "Conifers", name: "Conifers, cycads & ginkgos", color: "#6db38a",
      about: "Seed plants without flowers. They handled the dry Permian well and formed the forests that dinosaurs lived in.",
      pts: [[385, 0], [360, 0.15], [320, 0.35], [300, 0.7], [252.1, 0.75], [251.9, 0.4], [230, 0.8], [200, 0.9], [145, 1], [110, 0.75], [90, 0.5], [66.1, 0.42], [66, 0.3], [0, 0.3]] },
    { id: "flower", hab: "plant", short: "Flowers", name: "Flowering plants", color: "#d99ac6",
      about: "Latecomers that appeared in the Cretaceous and spread fast with the help of insects. Today about 9 in 10 plant species have flowers.",
      pts: [[135, 0], [125, 0.12], [100, 0.5], [80, 0.72], [66.1, 0.78], [66, 0.55], [50, 0.88], [0, 1]] }
  ];
  LIFE.forEach(g => { g.phases = g.phases || [{ icon: g.id, short: g.short, name: g.name || g.short }]; });
  const phaseAt = (g, t) => g.phases.find(p => p.to == null || t >= p.to);
  function lifeAt(g, t) {
    const p = g.pts;
    if (t >= p[0][0]) return p[0][1];
    for (let i = 1; i < p.length; i++) {
      if (t >= p[i][0]) { const f = (p[i - 1][0] - t) / (p[i - 1][0] - p[i][0]); return p[i - 1][1] + (p[i][1] - p[i - 1][1]) * f; }
    }
    return p[p.length - 1][1];
  }

  function timelineTopic() {
    const row = p => `<div role="row"><b role="cell"><i class="tl-sw" style="background:${p.color}"></i>${p.name}</b>
      <span role="cell">${p.from < 10 ? p.from : Math.round(p.from)}–${p.to === 0 ? "today" : p.to < 10 ? p.to : Math.round(p.to)}</span><span role="cell">${p.named}</span></div>`;
    return `
      <header class="lt-head">
        <div class="eyebrow">Background · 2</div>
        <h2>Geological timeline</h2>
        <p class="lede">Dinosaurs are Mesozoic, trilobites are Paleozoic, and the K-Pg boundary sits between the Cretaceous and the Paleogene. Here is how those names fit together, and what was alive in each chapter of Earth’s history.</p>
      </header>

      <section class="lt-sec">
        <h3><span class="num">1</span>Eras and periods</h3>
        <p>Earth is about 4.6 billion years old. Geologists split that time into nested chunks, a bit like a book: <b>eons</b> are the volumes, <b>eras</b> are the parts, and <b>periods</b> are the chapters. This page covers the eon called the <b>Phanerozoic</b> (“visible life”), the last 539 million years, when animals and plants with hard parts left plenty of fossils.</p>
        <div class="lt-cards tl-eras">${ERAS.map(e => `<div class="lt-card" style="--zc:${e.color}"><b>${e.name} Era</b><p>“${e.means[0].toUpperCase() + e.means.slice(1)}”, ${Math.round(e.from)}–${e.to ? Math.round(e.to) : "today"} million years ago</p></div>`).join("")}</div>
        <p>Many period boundaries were drawn where the fossils suddenly change, which is why several of them line up with <b>mass extinctions</b>. The K-Pg boundary ends both the Cretaceous Period and the Mesozoic Era.</p>
        <div class="min-table tl-table" role="table" aria-label="Geological periods, their ages and what they are named after">
          <div role="row" class="mt-head"><span role="columnheader">Period</span><span role="columnheader">Million yrs ago</span><span role="columnheader">Named after</span></div>
          ${PERIODS.slice().reverse().map(row).join("")}
        </div>
        <p class="lt-note">Memory trick, oldest to youngest: <b>C</b>ows <b>O</b>ften <b>S</b>it <b>D</b>own <b>C</b>arefully. <b>P</b>erhaps <b>T</b>heir <b>J</b>oints <b>C</b>reak. <b>P</b>robably <b>N</b>ot <b>Q</b>uietly.</p>
      </section>

      <section class="lt-sec">
        <h3><span class="num">2</span>Life through time</h3>
        <p class="lt-hint" id="tlHint"></p>
        <div class="ab-wrap" id="tlWrap">
          <div class="ab-readout" id="tlReadout">
            <div class="ab-ro-head"><span class="ab-ro-zone" id="tlZone" aria-live="polite"></span>
              <span class="ab-ro-btns"><button type="button" class="ab-play" id="tlPlay">▶ Play</button><button type="button" data-nudge="-10" aria-label="Younger">▲</button><button type="button" data-nudge="10" aria-label="Older">▼</button></span></div>
            <p class="tl-alert" id="tlAlert" hidden></p>
            <ul class="ab-rows" id="tlRows"></ul>
            <div class="ab-key" id="tlKey"></div>
            <p class="ab-key-about" id="tlAbout" hidden></p>
            <p class="tl-period" id="tlPeriod"></p>
          </div>
          <div class="ab-chart" id="tlChart"></div>
        </div>
        <p class="lt-note">Spindle widths are illustrative, simplified from textbook diagrams of fossil diversity; each one compares a group with itself through time, not with the other groups. Ages from the International Chronostratigraphic Chart.</p>
      </section>

      <section class="lt-sec">
        <h3><span class="num">3</span>How to read this chart</h3>
        <ul class="lt-list">
          <li><b>Up is younger.</b> Just like a core, the oldest time is at the bottom and today is at the top.</li>
          <li><b>Time is to scale.</b> Each period is as tall as it was long. The Cambrian lasted 54 million years; the Quaternary, which includes all of human history, is a sliver at the very top.</li>
          <li><b>Width is abundance.</b> A wide spindle means that group was thriving, with many species; a thin one means it was hanging on. The drawings grow and shrink with it.</li>
          <li><b>Shaded lines are the Big Five mass extinctions.</b> Watch which spindles stop dead, which get pinched, and which widen right after.</li>
        </ul>
      </section>

      <section class="lt-sec">
        <h3><span class="num">4</span>The Big Five mass extinctions</h3>
        <p>A mass extinction is when a large share of all species, about three-quarters or more, disappears in a geologically short time. It has happened five times since animals became common.</p>
        <div class="ab-zones">${EXTINCTIONS.map((e, i) => `<div class="ab-zone" style="--zc:${e.kpg ? "var(--boundary)" : "var(--loss)"}"><b>${i + 1}. ${e.name}</b>
          <p><b class="tl-when">${Math.round(e.t)} million years ago · about ${e.lost}% of species lost</b>${e.cause} <em>Hit hardest:</em> ${e.hit}.</p></div>`).join("")}
          <div class="ab-zone" style="--zc:var(--muted)"><b>A sixth, today?</b><p>Species are now disappearing far faster than the normal background rate, mostly because of habitat loss, hunting, pollution and climate change. Many scientists warn that this could become a sixth mass extinction.</p></div></div>
        <div class="ask"><strong>Think about it</strong><p>Dinosaurs were a small group before the End-Triassic extinction and dominant after it. Mammals were small before the K-Pg extinction and dominant after it. What pattern do you see?</p>
          <details><summary>Show answer</summary><p>Mass extinctions clear out the dominant groups. Survivors that were minor players before get the chance to spread into the empty roles. Each extinction resets who rules.</p></details></div>
        <div class="ask"><strong>Think about it</strong><p>Squeeze the whole 539 million years of this chart into one calendar year, starting January 1. On what date does the K-Pg extinction happen? When do modern humans appear?</p>
          <details><summary>Show answer</summary><p>66 ÷ 539 × 365 ≈ 45 days before the end of the year, around <b>November 16</b>. Modern humans (300,000 years) arrive about <b>5 hours before midnight</b> on December 31.</p></details></div>
        <div class="lt-actions">
          <button type="button" class="btn" data-topic="extinction">Next: the extinction mystery →</button>
          <button type="button" class="btn ghost" data-start-trail>Trail of Evidence →</button>
        </div>
      </section>`;
  }

  // Guided tour: climbs from the Cambrian to today, pausing at these moments (g = group to highlight).
  const TL_STOPS = [
    { t: 515, g: "trilo", title: "Cambrian: life explodes",
      text: "In a few million years the seas fill with animals that have shells, eyes and legs. Trilobites are everywhere. Nothing lives on land yet." },
    { t: 444, g: "trilo", title: "Mass extinction 1 · End-Ordovician",
      text: "An ice age lowers the sea and chills the oceans. About 85% of species die out. Trilobites survive, but never fully recover." },
    { t: 372, g: "fish", title: "Mass extinction 2 · Late Devonian",
      text: "After the “Age of Fishes,” the oceans lose oxygen. Reefs and armored fish are hit hard and about 75% of species vanish." },
    { t: 310, g: "fern", title: "Carboniferous coal swamps",
      text: "Forests of giant tree ferns and club mosses cover the wetlands; buried, they become today’s coal. Amphibians are the biggest land animals." },
    { t: 251.9, g: "mammal", title: "Mass extinction 3 · The Great Dying",
      text: "Giant eruptions in Siberia heat the planet and poison the oceans. About 90% of species die, the worst extinction ever. The last trilobites vanish and the sail-backed synapsids crash." },
    { t: 201.4, g: "dino", title: "Mass extinction 4 · End-Triassic",
      text: "Eruptions as Pangaea starts to split wipe out about 75% of species, including many of the dinosaurs’ rivals. Dinosaurs survive and take over." },
    { t: 150, g: "conifer", title: "Jurassic: the age of giants",
      text: "Huge plant-eating dinosaurs graze forests of conifers, cycads and ferns. Ammonites fill the seas and the first birds appear." },
    { t: 100, g: "flower", title: "Cretaceous: flowers spread",
      text: "Flowering plants appear and spread quickly across the continents, while the dinosaurs are at their peak." },
    { t: 66, g: "dino", title: "Mass extinction 5 · K-Pg boundary",
      text: "Every dinosaur except the birds is gone, and so are the ammonites. For a moment ferns take over on land (the “fern spike”). What happened? That is the mystery this app investigates." },
    { t: 0, g: "mammal", title: "Today",
      text: "Mammals, birds, fish and flowering plants dominate. Many scientists warn that we may be causing a sixth mass extinction." }
  ];
  const TL_SPEED = 45; // million years per second

  function mountTimeline(root) {
    const chart = $("#tlChart", root), rows = $("#tlRows", root), key = $("#tlKey", root), about = $("#tlAbout", root);
    const readout = $("#tlReadout", root), zoneEl = $("#tlZone", root), alertEl = $("#tlAlert", root), periodEl = $("#tlPeriod", root), playBtn = $("#tlPlay", root);
    const touch = !window.matchMedia("(hover: hover)").matches;
    const phone = () => window.matchMedia("(max-width: 860px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    $("#tlHint", root).innerHTML = touch
      ? "Press <b>▶ Play</b> to travel from the Cambrian to today. It pauses at each mass extinction; use ▲ ▼ to move on your own. Tap a group to learn about it."
      : "Move your pointer up and down the chart (or use the ↑ ↓ keys) to see what was alive at each moment, or press <b>▶ Play</b> for a guided tour. Hover a group in the legend to learn about it.";
    let t = 66, W = 0, dims = null, focusGroup = null, tour = null;

    const meter = g => `<span class="tl-meter"><i style="background:${g.color}"></i></span><span class="tl-gone"></span>`;
    rows.innerHTML = LIFE.map(g => `
      <li data-g="${g.id}" tabindex="0"><span class="sw" style="background:${g.color}"></span>${tlIcon(g.id, 24)}
        <span class="nm"></span>${meter(g)}</li>`).join("");
    key.classList.add("tl-key");
    key.innerHTML = `<div class="ab-chips">${LIFE.map(g => `
      <button type="button" class="ab-chip" data-g="${g.id}" aria-pressed="false">
        <span class="sw" style="background:${g.color}"></span>${tlIcon(g.id, 18)}<span class="nm"></span>${meter(g)}</button>`).join("")}</div>`;
    const setFocus = id => { focusGroup = id; highlight(); };
    key.querySelectorAll(".ab-chip").forEach(b => b.addEventListener("click", () => setFocus(focusGroup === b.dataset.g ? null : b.dataset.g)));
    rows.querySelectorAll("li").forEach(n => {
      n.addEventListener("mouseenter", () => setFocus(n.dataset.g));
      n.addEventListener("mouseleave", () => setFocus(null));
      n.addEventListener("focus", () => setFocus(n.dataset.g));
      n.addEventListener("blur", () => setFocus(null));
    });
    readout.querySelectorAll("[data-nudge]").forEach(b => b.addEventListener("click", () => { endTour(); nudge(+b.dataset.nudge); }));
    playBtn.addEventListener("click", () => {
      if (!tour) startTour();
      else if (tour.mode === "run") { tour.mode = "pause"; cancelAnimationFrame(tour.raf); syncPlay(); }
      else if (tour.mode === "pause") run();
      else resume();
    });

    const pop = document.createElement("div");
    pop.className = "ab-pop";
    pop.hidden = true;
    pop.setAttribute("role", "status");

    function draw() {
      W = chart.clientWidth;
      if (!W) return;
      const narrow = W < 520;
      let H = narrow ? 640 : 760;
      if (phone()) H = Math.round(Math.max(420, Math.min(H, root.clientHeight - readout.offsetHeight - 8)));
      const eraW = narrow ? 14 : 20, perW = narrow ? 30 : 86, tickW = narrow ? 26 : 34;
      const L = eraW + perW + tickW + 6, R = 6, T = narrow ? 52 : 62, B = 22;
      const PH = H - T - B, PW = W - L - R, colW = PW / LIFE.length;
      const y = tt => T + tt / AGE * PH, cx = k => L + (k + 0.5) * colW;
      dims = { H, T, PH, y, cx };
      const xP = eraW + 2;

      // left strips: eras, then periods (tinted across the plot too)
      const fits = (h, s, px) => h > s.length * px + 8;
      const eras = ERAS.map(e => {
        const y0 = y(e.to), h = y(e.from) - y0;
        return `<rect x="0" y="${y0}" width="${eraW}" height="${h}" fill="${e.color}" stroke="#13110f" stroke-width=".6"/>` +
          (fits(h, e.name, narrow ? 6 : 6.6) ? `<text class="tl-elabel" transform="translate(${eraW / 2} ${y0 + h / 2}) rotate(-90)" text-anchor="middle" dy="3.5">${e.name}</text>` : "");
      }).join("");
      const periods = PERIODS.map(p => {
        const y0 = y(p.to), h = y(p.from) - y0, mid = y0 + h / 2;
        let label = "";
        if (!narrow) label = h >= 14 ? `<text class="tl-plabel" x="${xP + 6}" y="${mid}" dy="4">${p.name}</text>` : "";
        else if (fits(h, p.name, 6.2)) label = `<text class="tl-plabel" transform="translate(${xP + perW / 2} ${mid}) rotate(-90)" text-anchor="middle" dy="4">${p.name}</text>`;
        else if (h >= 11) label = `<text class="tl-plabel" x="${xP + perW / 2}" y="${mid}" dy="4" text-anchor="middle">${p.abbr}</text>`;
        if (["Paleogene", "Neogene", "Permian", "Triassic", "Cambrian", "Ordovician"].includes(p.name) && label) label = label.replace("tl-plabel", "tl-plabel on-dark");
        return `<rect x="${xP}" y="${y0}" width="${perW}" height="${h}" fill="${p.color}" stroke="#13110f" stroke-width=".6"/>${label}
          <rect x="${L}" y="${y0}" width="${PW}" height="${h}" fill="${p.color}" opacity=".16"/>
          <line x1="${L}" x2="${W - R}" y1="${y(p.from)}" y2="${y(p.from)}" stroke="rgba(19,17,15,.14)"/>`;
      }).join("");
      // Quaternary is a sliver: label it just above the strip
      const q = `<text class="tl-qlabel" x="${xP + (narrow ? perW / 2 : 6)}" y="${T - 5}" text-anchor="${narrow ? "middle" : "start"}">${narrow ? "Q ↓" : "Quaternary ↓"}</text>`;
      const ticks = [0, 66, 100, 200, 300, 400, 500, AGE].map(a => `<line x1="${L - 5}" x2="${L}" y1="${y(a)}" y2="${y(a)}" stroke="#9a8e80"/>
        <text x="${L - 7}" y="${y(a)}" dy="4" text-anchor="end" class="ab-axis${a === 66 ? " tl-k" : ""}">${Math.round(a)}</text>`).join("");

      // column headers: habitat labels, then each group's icon
      const habs = HABITATS.map(h => {
        const ks = LIFE.map((g, k) => g.hab === h.id ? k : -1).filter(k => k >= 0);
        const x0 = L + ks[0] * colW, x1 = L + (ks[ks.length - 1] + 1) * colW;
        return `<text class="tl-hab" x="${(x0 + x1) / 2}" y="${narrow ? 12 : 14}" text-anchor="middle">${narrow ? h.short : h.name}</text>
          <line x1="${x0 + 4}" x2="${x1 - 4}" y1="${narrow ? 17 : 20}" y2="${narrow ? 17 : 20}" stroke="var(--line-strong)"/>` +
          (ks[0] ? `<line x1="${x0}" x2="${x0}" y1="${T}" y2="${T + PH}" stroke="rgba(19,17,15,.28)" stroke-dasharray="3 3"/>` : "");
      }).join("");
      const hs = Math.min(narrow ? 24 : 30, colW - 4);
      const heads = LIFE.map((g, k) => `<use href="#t-${g.phases[0].icon === "sail" ? "mammal" : g.phases[0].icon}" data-g="${g.id}" class="tl-head-ico" x="${cx(k) - hs / 2}" y="${(narrow ? 20 : 24)}" width="${hs}" height="${hs}" style="color:${g.color}"/>`).join("");

      // spindles: one polygon per phase, symmetric about the column's center line
      const maxHalf = colW / 2 - 1.5;
      let bands = "";
      LIFE.forEach((g, k) => {
        let old = AGE;
        g.phases.forEach(ph => {
          const young = ph.to == null ? 0 : ph.to;
          const ts = [old, ...g.pts.map(p => p[0]).filter(a => a < old && a > young), young];
          old = young;
          const vs = ts.map(a => lifeAt(g, a));
          if (!vs.some(v => v > 0)) return;
          const right = ts.map((a, i) => `${(cx(k) + vs[i] * maxHalf).toFixed(1)},${y(a).toFixed(1)}`);
          const left = ts.map((a, i) => `${(cx(k) - vs[i] * maxHalf).toFixed(1)},${y(a).toFixed(1)}`).reverse();
          bands += `<polygon class="ab-band${ph.faded ? " tl-faded" : ""}" data-g="${g.id}" points="${right.concat(left).join(" ")}" fill="${g.color}"/>`;
        });
      });

      // drawings inside the spindles, sized by width
      let icons = "", rowN = 0;
      const gap = narrow ? 26 : 30, maxS = narrow ? 22 : 28, minS = narrow ? 9 : 11;
      for (let py = T + gap / 2; py < T + PH - 4; py += gap, rowN++) {
        const tt = (py - T) / PH * AGE;
        if (EXTINCTIONS.some(e => Math.abs(py - y(e.t)) < gap * 0.42)) continue;
        LIFE.forEach((g, k) => {
          const v = lifeAt(g, tt), s = Math.min(maxS, 2 * v * maxHalf * 0.95);
          if (s < minS) return;
          const ph = phaseAt(g, tt);
          const h = Math.sin((rowN + 1) * 12.9898 + (k + 1) * 78.233) * 43758.5453, r = h - Math.floor(h);
          const x0 = cx(k) + (r - 0.5) * Math.max(0, 2 * v * maxHalf - s) * 0.5, y0 = py + (r - 0.5) * gap * 0.25;
          icons += `<use href="#t-${ph.icon}" data-g="${g.id}" class="ab-ico${ph.faded ? " tl-faded" : ""}" x="${(x0 - s / 2).toFixed(1)}" y="${(y0 - s / 2).toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" transform="rotate(${((r - 0.5) * 16).toFixed(0)} ${x0.toFixed(1)} ${y0.toFixed(1)})"/>`;
        });
      }

      // the Big Five, highlighted across the whole chart
      const exts = EXTINCTIONS.map((e, i) => {
        const ye = y(e.t), c = e.kpg ? "#e9c64b" : "#d2554a";
        return `<rect x="${xP}" y="${ye - 5}" width="${W - R - xP}" height="10" fill="${c}" opacity="${e.kpg ? .45 : .32}"/>
          <line x1="${xP}" x2="${W - R}" y1="${ye}" y2="${ye}" stroke="#13110f" stroke-width="4.5"/>
          <line x1="${xP}" x2="${W - R}" y1="${ye}" y2="${ye}" stroke="${c}" stroke-width="2.5" stroke-dasharray="9 5"/>
          <text class="tl-xlabel${e.kpg ? " kpg" : ""}" x="${W - R - 4}" y="${ye - 8}" text-anchor="end">${narrow ? e.short : `${i + 1} · ${e.short} · −${e.lost}%`}</text>`;
      }).join("");

      chart.innerHTML = `<svg class="ab-svg tl-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" tabindex="0" role="img"
          aria-label="Geological timeline from 539 million years ago to today, with eras and periods to scale and the Big Five mass extinctions marked. Spindles show the rise and fall of trilobites, ammonites, fish, amphibians, synapsids and mammals, dinosaurs and birds, ferns, conifers and flowering plants.">
        ${tlDefs()}
        <rect x="${L}" y="${T}" width="${PW}" height="${PH}" fill="#f6f1e7"/>
        ${periods}${eras}${habs}${heads}
        ${bands}<g class="tl-icons" color="#2b2520">${icons}</g>
        ${exts}${q}${ticks}
        <text x="${L - 7}" y="${H - 5}" text-anchor="end" class="ab-axis tl-unit">${narrow ? "Ma" : "Ma ▲"}</text>
        <g class="ab-cursor"><line x1="${xP}" x2="${W - R}" stroke="#13110f" stroke-width="2.5"/><circle cx="${L}" r="6.5" fill="#13110f" stroke="#f1e9de" stroke-width="2"/></g>
      </svg>`;
      const svg = $("svg", chart);
      const setFromEvent = e => {
        const r = svg.getBoundingClientRect();
        t = Math.max(0, Math.min(AGE, (e.clientY - r.top - T) / PH * AGE));
        update();
      };
      svg.addEventListener("pointerdown", e => { if (e.pointerType === "mouse") { endTour(); setFromEvent(e); } });
      svg.addEventListener("pointermove", e => { if (e.pointerType === "mouse" && !tour) setFromEvent(e); });
      svg.addEventListener("keydown", e => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); endTour(); nudge(e.key === "ArrowUp" ? -10 : 10); }
      });
      chart.appendChild(pop);
      highlight();
      update();
      placePop();
    }

    function nudge(d) {
      // ▲ ▼ snap onto an extinction line when stepping across one, so none get skipped
      const nt = Math.max(0, Math.min(AGE, t + d));
      const ex = EXTINCTIONS.find(e => d < 0 ? e.t < t - 0.5 && e.t > nt : e.t > t + 0.5 && e.t < nt);
      t = ex ? ex.t : nt;
      update();
    }

    function update() {
      if (!dims) return;
      const cy = dims.y(t);
      const cur = $(".ab-cursor", chart);
      cur.querySelector("line").setAttribute("y1", cy); cur.querySelector("line").setAttribute("y2", cy);
      cur.querySelector("circle").setAttribute("cy", cy);
      const p = periodAt(t), era = eraAt(t);
      const label = `${p.name} · ${era.name}<small>${fmtMa(t)}</small>`;
      if (zoneEl.innerHTML !== label) { zoneEl.innerHTML = label; zoneEl.style.setProperty("--zc", p.color); }
      periodEl.innerHTML = `<b>${p.name} Period</b>, ${p.from < 10 ? p.from : Math.round(p.from)}–${p.to ? (p.to < 10 ? p.to : Math.round(p.to)) : "0"} million years ago. ${p.text}`;
      const ex = EXTINCTIONS.find(e => Math.abs(e.t - t) <= 4);
      alertEl.hidden = !ex;
      if (ex) {
        alertEl.classList.toggle("kpg", !!ex.kpg);
        const n = EXTINCTIONS.indexOf(ex) + 1;
        alertEl.innerHTML = `<b class="tl-long">Mass extinction ${n}: ${ex.name}</b><b class="tl-short">Mass extinction ${n} · ${ex.short}</b> About ${ex.lost}% of species lost.`;
      }
      [rows.querySelectorAll("li"), key.querySelectorAll(".ab-chip")].forEach(list => list.forEach((n, k) => {
        const g = LIFE[k], v = lifeAt(g, t), ph = phaseAt(g, t), gone = v < 0.01;
        n.querySelector(".nm").textContent = ph.short;
        n.querySelector("use").setAttribute("href", `#t-${ph.icon}`);
        n.querySelector(".tl-meter").hidden = gone;
        n.querySelector(".tl-meter i").style.width = `${Math.round(v * 100)}%`;
        n.querySelector(".tl-gone").textContent = gone ? (t > g.pts[0][0] ? "not yet" : "extinct") : "";
        n.classList.toggle("absent", gone);
        n.title = `${ph.name}: ${gone ? (t > g.pts[0][0] ? "not yet evolved" : "extinct") : v > 0.75 ? "dominant" : v > 0.45 ? "common" : v > 0.15 ? "present" : "rare"}`;
      }));
    }

    function highlight() {
      chart.querySelector("svg")?.classList.toggle("focusing", !!focusGroup);
      chart.querySelectorAll("[data-g]").forEach(n => n.classList.toggle("hi", n.dataset.g === focusGroup));
      rows.querySelectorAll("li").forEach(n => n.classList.toggle("hi", n.dataset.g === focusGroup));
      key.querySelectorAll(".ab-chip").forEach(c => c.setAttribute("aria-pressed", c.dataset.g === focusGroup));
      const g = LIFE.find(g => g.id === focusGroup);
      about.hidden = !g || !!tour;
      if (g) about.innerHTML = `<b>${g.phases.map(p => p.name).join(" → ")}.</b> ${g.about}`;
    }

    // ----- guided tour (same controls as the foram chart) -----
    function syncPlay() {
      const m = tour && tour.mode;
      playBtn.textContent = m === "run" ? "❚❚ Pause" : m === "stop" ? (tour.next === TL_STOPS.length - 1 ? "↺ Replay" : "▶ Next") : "▶ Play";
      playBtn.classList.toggle("on", !!tour);
    }
    function step(now) {
      if (!tour || tour.mode !== "run") return;
      const dt = Math.min(0.05, (now - (tour.last || now)) / 1000);
      tour.last = now;
      const target = TL_STOPS[tour.next].t;
      t = reduce ? target : Math.max(target, t - TL_SPEED * dt);
      update();
      if (t <= target) { tour.mode = "stop"; showStop(); syncPlay(); return; }
      tour.raf = requestAnimationFrame(step);
    }
    function run() {
      tour.mode = "run";
      tour.last = 0;
      pop.hidden = true;
      setFocus(null);
      syncPlay();
      tour.raf = requestAnimationFrame(step);
    }
    function startTour() {
      endTour();
      tour = { next: 0 };
      t = AGE;
      setTouring(true);
      $("#tlWrap", root).scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
      run();
    }
    function resume() {
      if (tour.next >= TL_STOPS.length - 1) return startTour();
      tour.next++;
      run();
    }
    function endTour() {
      if (!tour) return;
      cancelAnimationFrame(tour.raf);
      tour = null;
      pop.hidden = true;
      setFocus(null);
      syncPlay();
      setTouring(false);
    }
    function setTouring(on) {
      readout.classList.toggle("touring", on);
      if (phone()) draw(); else update();
    }
    function showStop() {
      const i = tour.next, s = TL_STOPS[i], last = i === TL_STOPS.length - 1;
      setFocus(s.g);
      pop.innerHTML = `<button type="button" class="ab-pop-x" aria-label="End tour">×</button>
        <b>${s.title}</b><p>${s.text}</p>
        <div class="ab-pop-foot"><span>${i + 1} of ${TL_STOPS.length}</span><button type="button" class="btn small">${last ? "↺ Replay" : "Continue ▶"}</button></div>`;
      pop.querySelector(".btn").addEventListener("click", resume);
      pop.querySelector(".ab-pop-x").addEventListener("click", endTour);
      pop.hidden = false;
      placePop();
    }
    // Beside the cursor line, the arrow pointing at the highlighted group's column.
    function placePop() {
      if (pop.hidden || !dims || !tour) return;
      const s = TL_STOPS[tour.next], cy = dims.y(s.t);
      const ax = dims.cx(LIFE.findIndex(g => g.id === s.g));
      const w = Math.min(290, W - 16), px = Math.max(8, Math.min(W - w - 8, ax - w / 2));
      const below = cy < dims.H * 0.45;
      pop.classList.toggle("below", below);
      pop.style.width = w + "px";
      pop.style.left = px + "px";
      pop.style.top = below ? `${cy + 14}px` : "";
      pop.style.bottom = below ? "" : `${dims.H - cy + 14}px`;
      pop.style.setProperty("--ax", `${Math.max(16, Math.min(w - 16, ax - px))}px`);
    }

    draw();
    let rt;
    const ro = new ResizeObserver(() => { if (chart.clientWidth !== W) { clearTimeout(rt); rt = setTimeout(draw, 80); } });
    ro.observe(chart);
    return () => { ro.disconnect(); endTour(); };
  }

  // ---------- Topic registry + page ----------
  const TOPICS = [
    { id: "guide", title: "Using this app", short: "Using the app", blurb: "What this app is, and the three ways to explore it: sites, clues and background.", html: guideTopic },
    { id: "timeline", title: "Geological timeline", short: "Timeline", blurb: "Eras, periods and the Big Five mass extinctions: 539 million years of life at a glance.", html: timelineTopic, mount: mountTimeline },
    { id: "extinction", title: "The extinction mystery", short: "Extinction mystery", blurb: "What vanished 66 million years ago, the competing ideas, and the question that started it all.", html: extinctionTopic },
    { id: "core", title: "How to read a core", short: "Reading a core", blurb: "What a core is, how it’s sampled, and why time runs bottom to top.", html: coreTopic,
      mount(root) {
        const replay = $("[data-replay]", root), svg = $(".stack-anim", root);
        replay && replay.addEventListener("click", () => { svg.classList.remove("play"); void svg.getBBox(); svg.classList.add("play"); });
        // start the stacking animation when it scrolls into view
        const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { svg.classList.add("play"); io.disconnect(); } }), { threshold: 0.4 });
        io.observe(svg);
        return () => io.disconnect();
      } },
    { id: "minerals", title: "Crucial minerals", short: "Crucial minerals", blurb: "Shocked quartz, tektites, sulfur and zircon: how minerals proved an impact and dated it.", html: mineralsTopic },
    { id: "abundance", title: "Species abundance through a core", short: "Species abundance", blurb: "How forams rose and fell before and after the K-Pg boundary.", html: abundanceTopic, mount: mountAbundance }
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
            <span class="n">${i + 1}</span><span><b>${t.title}</b><b class="short">${t.short}</b><small>${t.blurb}</small></span></button>`).join("")}
        </nav>
        <article class="learn-article">
          ${back ? `<button type="button" class="btn ghost small back-from-learn" id="learnBack">← ${back.label}</button>` : ""}
          ${topic.html()}
        </article>
      </div>`;
    root.scrollTop = 0;
    if (back) $("#learnBack", root).addEventListener("click", back.go);
    root.querySelectorAll("[data-topic]").forEach(b => b.addEventListener("click", () => window.KTApp.openLearn(b.dataset.topic, { keepBack: true })));
    root.querySelectorAll("[data-goto-map]").forEach(b => b.addEventListener("click", () => window.KTApp.openMap()));
    root.querySelectorAll("[data-start-trail]").forEach(b => b.addEventListener("click", () => window.KTApp.openTrail()));
    root.querySelectorAll("[data-goto-site]").forEach(b => b.addEventListener("click", () => window.KTApp.openSite(b.dataset.gotoSite, b.dataset.gotoLayer)));
    if (topic.mount) cleanup = topic.mount(root) || null;
    return topic.id;
  }

  window.KTLearn = { render, topics: TOPICS.map(t => ({ id: t.id, title: t.title })) };
})();
