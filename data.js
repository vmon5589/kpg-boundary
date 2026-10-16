// K-Pg Boundary Explorer: content data
// Sources: HHMI BioInteractive "The Day the Mesozoic Died" teacher/student materials
// (Trail of Evidence, Weighing the Evidence Parts 1 & 2), plus the original papers they cite.
//
// Layer coordinates for photo sites are percentages of the image (x, y from top-left).
// To adjust a hotspot, edit its `poly` points. Schematic sites use `h` (relative thickness).

window.KT = {};

KT.disciplines = {
  paleo:   { label: "Paleontology", color: "#d9a35b" },
  chem:    { label: "Chemistry",    color: "#7fc3b8" },
  phys:    { label: "Physics",      color: "#8fa8e0" },
  astro:   { label: "Astronomy",    color: "#b79be0" },
  geo:     { label: "Geology",      color: "#d98a6c" },
  geophys: { label: "Geophysics",   color: "#c6c66b" },
  bot:     { label: "Botany",       color: "#8cc47a" }
};

// kind drives the color of the layer tag: cretaceous | boundary | paleogene | impact
KT.sites = [
  {
    id: "chicxulub",
    name: "Chicxulub Crater",
    place: "Yucatán Peninsula, Mexico",
    latlng: [21.3, -89.5],
    type: "impact",
    typeLabel: "Impact site",
    cardImage: "image/chicxulubCrater.jpg",
    cardImageAlt: "Painting of the newly formed Chicxulub crater seen from high above, with an outer rim, an inner peak ring, a flooded basin, and rays of ejecta",
    cardImageCredit: "The crater shortly after impact. Painting © Detlev van Ravenswaay",
    boundaryThickness: "The crater itself: ~180–200 km wide, buried under ~1 km of younger limestone",
    summary:
      "The “smoking gun.” A buried crater about 180–200 km across, dated to 66 million years ago, " +
      "exactly the age and size Luis and Walter Alvarez predicted from the iridium. Oil-company geophysicists first " +
      "mapped its strange gravity pattern; in 1991 shocked quartz and melt rock from its cores confirmed it was an impact crater. " +
      "In 2016, scientists drilled straight into the ring of mountains inside the crater and brought up 829 m of core.",
    why:
      "Every other clue (iridium, spherules, shocked quartz, tsunami deposits) was indirect. Finding a crater with " +
      "the right age and size gave direct evidence that a ~10 km asteroid struck Earth at the K-Pg boundary.",
    schematicTitle: "Drill core into the crater’s peak ring (IODP–ICDP Expedition 364, 2016), simplified",
    // 1991 confirmation: shocked quartz from the Yucatán-6 borehole.
    discovery: {
      title: "1991: proof it was an impact crater",
      src: "image/chicxulub.shockedQuartz.png",
      label: "Shocked quartz from the Yucatán-6 borehole",
      alt: "A rainbow-colored quartz grain under a polarizing microscope, crossed by fine, straight, parallel lines",
      text: [
        "Old oil-exploration wells had already drilled into the middle of the buried structure. In 1991, scientists looked closely at rock from one of them, Yucatán-6, " +
        "and found shocked quartz, shocked feldspar, and impact melt rock. That proved Chicxulub was an impact crater, and one formed at the K-Pg boundary. " +
        "This crystal is one of the first images shown, at the 1991 Lunar and Planetary Science Conference.",
        "When the asteroid hit the Yucatán’s crust, a shock wave raced through the rock. It crushed quartz crystals along thin, flat planes and turned those planes into glass. " +
        "Look for the fine, straight, parallel lines: this crystal has two sets, running in different directions. No other natural process makes damage like this, so it is proof of an impact."
      ],
      credit: "Photo © David A. Kring, Lunar and Planetary Institute",
      creditUrl: "https://www.lpi.usra.edu/science/kring/Chicxulub/discovery/"
    },
    // Expedition 364 drill core (site M0077A). Photos: Morgan et al. 2016, Science 354:878, Fig. 3.
    core: {
      title: "The 2016 peak-ring drill core",
      credit: "Core photos: Morgan et al. (2016), “The formation of peak rings in large impact craters,” Science 354, Fig. 3",
      text: [
        "A drill ship parked over the buried crater, about 46 km from its center, and drilled 1,335 m below the seafloor. " +
        "Going down, the core passes through post-impact seafloor sediment, then about 130 m of impact breccia and melt rock, then nearly 600 m of shattered granite.",
        "That granite is the surprise. It normally lies more than 3 km deep, yet here it sits <em>on top of</em> younger sedimentary rock. " +
        "The only way to get it there: in the minutes after the impact, the crust flowed like a liquid, shot upward, and collapsed outward into a ring of mountains (a “peak ring”)."
      ],
      why:
        "Every piece of the granite is shock-damaged: shocked quartz and shatter cones that need pressures of 10–35 GPa (100,000–350,000 times air pressure). " +
        "That is the same shocked quartz found in the K-Pg boundary clay around the world, now traced back to its source. " +
        "Knowing exactly how the crater formed lets scientists estimate the impact’s energy, and how much sulfur, dust and CO₂ it blasted into the sky: the pollutants behind the darkness and cold that ended the dinosaurs."
    },
    layers: [
      {
        id: "post", name: "Post-impact limestone", kind: "paleogene", h: 22, pattern: "limestone",
        age: "Paleogene → present",
        depth: "0–617 m deep",
        what: "About a kilometer of younger limestone that slowly filled and buried the crater. This is why nobody could see the crater at the surface.",
        why: "Burial explains why the crater was missed for so long. Today a ring of sinkholes (cenotes) on the Yucatán traces the buried rim.",
        disciplines: ["geo"]
      },
      {
        id: "ir", name: "Iridium-rich fallback layer", kind: "boundary", h: 4, pattern: "clay",
        age: "Days to years after impact",
        depth: "~617 m deep",
        what: "A thin layer of fine dust that settled back into the crater after the impact. In 2021 scientists reported an iridium spike in this layer inside the crater itself.",
        why: "It ties the crater directly to the worldwide iridium layer: the same signature found at Gubbio, Denmark, and New Zealand also shows up here.",
        disciplines: ["chem", "geo"]
      },
      {
        id: "suevite", name: "Suevite: impact breccia with melt", kind: "impact", h: 18, pattern: "breccia",
        age: "Minutes to hours after impact",
        depth: "618–722 m deep",
        what: "Broken rock fragments mixed with blobs of glassy melt, dumped back into the crater as seawater rushed in. Some fragments carry shatter cones.",
        figures: [
          { src: "image/fig3g.png", label: "Shatter cone", depth: "708.5 m",
            caption: "A shatter cone: a fragment of dark rock (amphibolite) from the breccia, covered in fanning, striated grooves. Shatter cones form only when a shock wave passes through rock, so they are a field geologist’s tell-tale sign of an impact. Scale bar 1 cm." }
        ],
        why: "Melt and breccia like this form only from enormous heat and shock. The target rocks here were rich in anhydrite (calcium sulfate). Vaporized sulfur made sulfate aerosols that helped block sunlight.",
        evidence: "The rocks where the crater is contain lots of sulfur.",
        suggests: "Sulfur and other debris could have shot up in the air, blocking the sun.",
        disciplines: ["geo", "chem"]
      },
      {
        id: "melt", name: "Impact melt rock", kind: "impact", h: 8, pattern: "melt",
        age: "Seconds to minutes after impact",
        depth: "722–748 m deep",
        what: "Rock that was completely melted by the impact, then cooled into a solid sheet.",
        why: "Dating this melt gives the crater’s age, about 66 million years. That matches the K-Pg boundary everywhere else on Earth.",
        evidence: "The rocks at this site are 65 (now 66) million years old. The abnormal gravity field matches a crater about 200 km in diameter.",
        suggests: "The age and size of the crater match what Alvarez predicted.",
        disciplines: ["geo", "geophys", "phys"]
      },
      {
        id: "granite", name: "Shocked granite of the peak ring", kind: "impact", h: 48, pattern: "granite",
        age: "Uplifted and moved >20 km within minutes",
        depth: "748–1,335 m deep",
        showDiscovery: true,
        what: "Pink-and-white granite from more than 3 km deep in the crust that rebounded upward to form a ring of mountains inside the crater. It is fractured, sheared, crushed, and full of shocked quartz.",
        why: "Shocked quartz forms only under extreme pressure, from impacts (or nuclear blasts). The quartz here shows up to four sets of shock lines, from pressures of 10–35 GPa. Finding it here, and in boundary layers far away, points to this crater as the source. " +
          "The granite is also unusually light and porous for granite, because the impact riddled it with cracks.",
        figures: [
          { src: "image/fig3f.png", label: "Shocked quartz", depth: "826.9 m",
            caption: "Shocked quartz under the microscope (cross-polarized light). The white bars mark three sets of straight, parallel “planar deformation features”: microscopic planes where the crystal was crushed by the shock wave. Only an impact (or a nuclear blast) makes these. Scale bar 50 µm, about the width of a human hair." },
          { src: "image/fig3e.png", label: "Peak-ring granite", depth: "862.3 m",
            caption: "Typical granite from the peak ring, with large red-brown crystals of potassium feldspar. This rock started out several kilometers down, below the limestone. Scale bar 5 cm." },
          { src: "image/fig3c.png", label: "Crushed granite", depth: "957.4 m",
            caption: "A cataclastic shear zone: the lower part is still recognizable granite, but toward the top it has been ground into fine, greenish rock flour as blocks of crust slid past each other during the collapse. Scale bar 5 cm." }
        ],
        evidence: "There are abnormal gravitational fields near Chicxulub; this site is also full of shocked quartz.",
        suggests: "This is the crater that formed when the asteroid hit Earth 66 million years ago.",
        disciplines: ["geophys", "geo", "phys"]
      }
    ]
  },

  {
    id: "blake",
    name: "Blake Nose: ODP Site 1049",
    place: "Atlantic seafloor, ~500 km east of Florida",
    latlng: [30.13, -76.1],
    type: "marine",
    typeLabel: "Deep-sea drill core",
    image: "image/kt-boundary1.jpg",
    quickLinks: [
      { label: "Forams below the boundary", layer: "k" },
      { label: "Compare across the boundary", layer: "contact" },
      { label: "Forams above the boundary", layer: "pg" }
    ],
    imageAlt: "Deep-sea sediment core with a pale lower layer, a thick green ejecta layer, a thin brown iridium layer, and pale upper sediment",
    boundaryThickness: "Ejecta layer ~10–17 cm thick",
    summary:
      "A sediment core drilled from the deep Atlantic seafloor in 1997. It shows one of the clearest K-Pg boundaries ever found: " +
      "white Cretaceous ooze, a thick green layer of impact debris, a thin iridium-rich cap, then Paleogene ooze. " +
      "This is the drilling site “off the coast of Florida” in the foram activity.",
    why:
      "In a single core you can see the extinction (forams), the impact debris (spherules and shocked quartz), and the iridium, stacked in the right order.",
    layers: [
      {
        id: "pg", name: "Lower Paleogene ooze", kind: "paleogene",
        poly: [[17.5,0],[44.5,0],[44.5,29],[17.5,29]],
        age: "Just after 66 Ma",
        what: "Pale seafloor mud made of microscopic shells. The forams here are tiny and simple.",
        why: "Only 2 of the 35 planktonic foram species found just below the boundary survived. New species descended from those survivors appear above it.",
        evidence: "Forams were large and diverse in the Cretaceous, but at the start of the Paleogene most foram species went extinct.",
        suggests: "There was a mass extinction of forams. With the forams gone, the base of the food chain was gone.",
        chart: "foramSurvival",
        forams: "tertiary",
        asks: [
          { q: "Some foram species appear only above the boundary. What do they represent?",
            a: "New species descended from the few survivors, or forams that moved into the area after the event." },
          { q: "Suppose you found the same pattern at five other sites scattered around the globe. What could you conclude?",
            a: "Whatever caused the change in forams between the Cretaceous and Paleogene must have affected the whole world, not just one place." }
        ],
        disciplines: ["paleo"]
      },
      {
        id: "ir", name: "Iridium layer", kind: "boundary",
        poly: [[17.5,29],[44.5,29],[44.5,36],[17.5,36]],
        age: "Months to years after impact",
        what: "A thin, rusty-brown layer at the top of the ejecta, made of the finest dust that settled out of the atmosphere last.",
        why: "Iridium is rare in Earth’s crust but common in asteroids. A spike right here, on top of the impact debris, is the asteroid’s chemical fingerprint.",
        evidence: "The K-Pg layer contains much more iridium than is found in Earth’s crust, and it is found all over the world.",
        suggests: "The iridium might have come from outer space, maybe from an asteroid.",
        disciplines: ["chem", "phys"]
      },
      {
        id: "ejecta", name: "Ejecta from the impact (spherule bed)", kind: "impact",
        poly: [[17.5,36],[44.5,36],[44.5,71],[17.5,71]],
        age: "Hours to days after impact",
        what: "A thick, green, sandy layer made almost entirely of spherules: glassy droplets of melted rock (now altered to green clay), plus shocked quartz and torn-up chunks of Cretaceous sediment.",
        why: "Spherules form when vaporized or melted rock is blasted into the sky, cools into droplets, and rains back down. This layer is thick because Blake Nose is only ~1,700 km from Chicxulub.",
        evidence: "The K-Pg layer contains glasslike beads called spherules, and shocked quartz.",
        suggests: "Something generated immense heat, enough to melt rock into glass, along with powerful shock waves.",
        disciplines: ["geo", "phys"]
      },
      {
        id: "contact", name: "The K-Pg contact", kind: "boundary",
        poly: [[17.5,71],[44.5,71],[44.5,74],[17.5,74]],
        age: "66.0 million years ago",
        what: "The sharp surface where normal Cretaceous sedimentation stopped and the ejecta arrived. The arrow on the photo marks it.",
        why: "Below this line, the seafloor record is calm and uniform. Above it, everything changes. That abruptness points to a sudden catastrophe, not a slow decline.",
        evidence: "The Cretaceous mud is very uniform up to the K-Pg boundary.",
        suggests: "The world was in a steady state up to the K-Pg event.",
        forams: "both",
        asks: [
          { q: "Which forams are generally larger: those just below the boundary or those just above it?",
            a: "The Cretaceous forams below the boundary are generally larger. In the measured samples they are ~0.5 mm vs. ~0.1–0.2 mm above." },
          { q: "Other than size, how do their shapes (morphology) differ?",
            a: "Many Cretaceous forams are more elaborate, with keels, ridges and complex chambers. Paleogene forams are small, rounded and simple." },
          { q: "In one or two sentences, summarize how forams differ across the boundary. Stick to observations!",
            a: "Forams above the boundary are smaller and less elaborate than those below it. Note: “large forams went extinct” is an inference, not an observation." }
        ],
        disciplines: ["geo", "paleo"]
      },
      {
        id: "k", name: "Upper Cretaceous ooze", kind: "cretaceous",
        poly: [[17.5,74],[44.5,74],[44.5,100],[17.5,100]],
        age: "Before 66 Ma",
        what: "White ooze full of large, ornate foram shells. Many species lived side by side.",
        why: "Cretaceous forams here measure about 0.5 mm, compared with 0.1–0.2 mm just above the boundary. Large, specialized forams that reproduced slowly were hit hardest.",
        chart: "foramSize",
        forams: "cretaceous",
        asks: [
          { q: "These forams come from below the boundary. Are they older or younger than the forams above it? How do you know?",
            a: "Older. In undisturbed layers, deeper rock was deposited first." },
          { q: "Were small or large forams more likely to survive? Why might size matter?",
            a: "Small ones. They mature and reproduce quickly and are generalists, which helps during rapid environmental change. Large, specialized forams, some living with algae partners, do best when conditions are stable." }
        ],
        disciplines: ["paleo"]
      }
    ]
  },

  {
    id: "gubbio",
    name: "Gubbio (Bottaccione Gorge)",
    place: "Umbria, Italy",
    latlng: [43.37, 12.58],
    type: "marine",
    typeLabel: "Marine limestone outcrop",
    image: "image/ktboundary.gubbio.png",
    imageAlt: "Tilted limestone beds: rusty-tan Paleocene limestone above, a dark recessed clay seam running diagonally, and white-pink Cretaceous limestone below",
    imageCredit: "“KT Boundary, Gubbio, Italy” 3D model, Sketchfab",
    imageCreditUrl: "https://sketchfab.com/3d-models/kt-boundary-gubbio-italy-2-0b406d6922a34042a8566e6c20920a46",
    boundaryThickness: "Boundary clay ~1 cm thick",
    summary:
      "Where the story began. Geologist Walter Alvarez noticed that big forams in the pink limestone vanished at a thin clay layer. " +
      "His father, physicist Luis Alvarez, with chemists Frank Asaro and Helen Michel, measured the clay and found about 30× more iridium than expected (published 1980).",
    why: "Gubbio produced the first two clues: a sudden foram extinction, and an iridium anomaly that pointed to space.",
    schematicTitle: "Outcrop in the Bottaccione Gorge, simplified (the real beds are tilted)",
    layers: [
      {
        id: "pg", name: "Paleocene pink limestone", kind: "paleogene", h: 32, pattern: "limestone",
        poly: [[0,0],[100,0],[100,56.9],[0,65.9]],
        age: "After 66 Ma",
        what: "Pinkish limestone containing only tiny, simple forams. One survivor-era species, Globigerina eugubina, is named after Gubbio itself (Latin: Eugubium).",
        why: "The sudden drop in foram size and variety right above the clay is what first convinced Walter Alvarez that something dramatic happened at this boundary.",
        disciplines: ["paleo"]
      },
      {
        id: "clay", name: "K-Pg boundary clay", kind: "boundary", h: 7, pattern: "clay",
        poly: [[0,65.9],[100,56.9],[100,59.2],[0,68.8]],
        age: "66.0 Ma",
        what: "A centimeter-thick layer of clay with no forams at all. In the photo it is the dark, recessed seam running diagonally: soft clay weathers back faster than the limestone around it. The Alvarezes originally wanted to use it to measure how long the layer took to form.",
        why: "It held about 30 times more iridium than the rocks around it. Iridium is rare in Earth’s crust but common in asteroids and meteorites. That was the first clue the cause came from outer space.",
        evidence: "The K-Pg boundary at Gubbio had 30 times more iridium than is found in Earth’s crust.",
        suggests: "The iridium might have come from outer space, maybe from an asteroid or supernova.",
        ask: { q: "Why wasn’t a supernova a good explanation?",
               a: "A supernova would also have left plutonium-244. None was found in the clay." },
        disciplines: ["chem", "phys", "astro"]
      },
      {
        id: "k", name: "Upper Cretaceous limestone", kind: "cretaceous", h: 40, pattern: "limestone",
        poly: [[0,68.8],[100,59.2],[100,100],[0,100]],
        age: "Before 66 Ma",
        what: "Pale, white-to-pink limestone packed with large, diverse forams such as Globotruncana, big enough to see with a hand lens.",
        why: "A rich, stable ocean ecosystem right up to the boundary. The extinction above it was sudden, not gradual.",
        evidence: "The change in forams was seen at two locations more than 1,000 km apart.",
        suggests: "The foram extinction was widespread rather than a local event.",
        disciplines: ["paleo", "geo"]
      }
    ]
  },

  {
    id: "stevns",
    name: "Stevns Klint",
    place: "Denmark",
    latlng: [55.27, 12.44],
    type: "marine",
    typeLabel: "Sea-cliff outcrop",
    image: "image/whitecliffs.png",
    imageAlt: "Close-up of the Stevns Klint cliff: white chalk at the bottom, a rusty-brown and grey clay layer, broken limestone slabs, and pale limestone on top",
    boundaryThickness: "“Fish Clay” up to ~10 cm",
    summary:
      "A chalk sea cliff (now a UNESCO World Heritage site) about 1,500 km from Gubbio. The Alvarez team found an even larger iridium spike in its dark “Fish Clay.”",
    why: "Finding iridium at a second, distant site showed the anomaly was global, not a local quirk of Italian rocks.",
    layers: [
      {
        id: "pg", name: "Danian bryozoan limestone", kind: "paleogene",
        poly: [[0,0],[100,0],[100,19],[60,20],[0,20.5]],
        age: "Early Paleocene, after 66 Ma",
        what: "Pale limestone built largely by bryozoans, tiny colonial animals that formed mounds on the seafloor after the extinction.",
        why: "Life in the sea recovered, but with a different cast of species than the Cretaceous chalk below.",
        disciplines: ["paleo"]
      },
      {
        id: "cerithium", name: "Cerithium Limestone", kind: "paleogene",
        poly: [[0,20.5],[60,20],[100,19],[100,32],[0,32]],
        age: "Earliest Paleocene",
        what: "Broken slabs of a thin limestone named for the small Cerithium sea snails found in it.",
        why: "This is among the first rock deposited as the ocean began to recover. Only hardy survivors lived here.",
        disciplines: ["paleo", "geo"]
      },
      {
        id: "greyclay", name: "Upper Fish Clay: grey marl", kind: "boundary",
        poly: [[0,32],[100,32],[100,47],[0,47]],
        age: "Just after 66 Ma",
        what: "Grey-black, finely layered clay with little calcium carbonate, plus scattered fish scales and teeth that gave the Fish Clay its name.",
        why: "Chalk is made of plankton shells. When the plankton died off, chalk stopped forming and only clay settled. This “carbonate crash” is the extinction showing up in the rock itself.",
        ask: { q: "Why would a layer of clay, not chalk, form right after the extinction?",
               a: "The plankton whose shells make chalk were mostly wiped out, so only fine clay and dust settled to the seafloor." },
        disciplines: ["geo", "paleo"]
      },
      {
        id: "clay", name: "Basal Fish Clay: rust-red impact layer", kind: "boundary",
        poly: [[0,47],[100,47],[100,69.5],[50,68],[0,67]],
        age: "66.0 Ma",
        what: "The rusty base of the Fish Clay, rich in iron, with tiny altered spherules. This is where the iridium spike sits.",
        why: "Same iridium signal, same position in the rock record, far from Italy. That points to a single global event.",
        evidence: "Iridium was found at the K-Pg boundary all over the world.",
        suggests: "Whatever brought the iridium affected the whole planet at once.",
        disciplines: ["chem", "geo"]
      },
      {
        id: "k", name: "Maastrichtian white chalk", kind: "cretaceous",
        poly: [[0,67],[50,68],[100,69.5],[100,100],[0,100]],
        age: "Before 66 Ma",
        what: "Bright white chalk made of trillions of tiny coccolith plates from marine algae, plus Cretaceous forams.",
        why: "A productive, plankton-based ocean right up to the boundary. The sharp change from white chalk to dark clay shows how abruptly that ecosystem collapsed.",
        evidence: "The Cretaceous sediment is very uniform up to the K-Pg boundary.",
        suggests: "The world was in a steady state up to the K-Pg event.",
        disciplines: ["paleo"]
      }
    ]
  },

  {
    id: "brazos",
    name: "Brazos River",
    place: "Falls County, Texas, USA",
    latlng: [31.12, -96.82],
    type: "marine",
    typeLabel: "River-bank outcrop (ancient seafloor)",
    image: "image/ktboundary.texas.jpg",
    imageAlt: "Stacked river-bank photo: dark Corsicana mudstone at the base, a dashed line, then two gritty event units (Unit I and Unit II), a sandstone complex with hummocky layers, and grey mudstone and sandstone ledges on top",
    imageCredit: "Irizarry et al., “Faunal and stratigraphic analysis of the basal K-Pg boundary event deposits, Brazos River, Texas, USA”",
    boundaryThickness: "Event deposits up to ~1 m",
    summary:
      "In the Cretaceous this was quiet seafloor near the Gulf of Mexico, about 1,000 km from Chicxulub. Between the Cretaceous Corsicana mudstone and the Paleocene Kincaid Formation sits a stack of chaotic “event deposits”: " +
      "debris flows and a wave-rippled sandstone with spherules, shells, and torn-up chunks of seafloor.",
    why: "Debris flows set off by shaking, then sand piled up by giant waves, needed a giant disturbance nearby. It suggests the asteroid hit in or near the ocean around the Gulf of Mexico.",
    schematicTitle: "River-bank section, simplified",
    layers: [
      {
        id: "pg", name: "Paleocene mudstone (Kincaid Fm.)", kind: "paleogene", h: 24, pattern: "mud",
        poly: [[0,0],[100,0],[100,36.5],[0,36.5]],
        age: "After 66 Ma",
        what: "Quiet-water mudstone and thin sandstone ledges deposited once the seafloor settled down again.",
        why: "Calm returned after the disturbance. The iridium-rich fallout dust and the first Paleocene forams are found in the mud just above the sandstone complex.",
        disciplines: ["geo", "paleo", "chem"]
      },
      {
        id: "hcs", name: "Sandstone complex (hummocky beds)", kind: "impact", h: 22, pattern: "sandstone",
        poly: [[0,36.5],[100,36.5],[100,56.2],[0,56.2]],
        age: "Hours to days after impact",
        what: "Sandstone with gently wavy, mound-shaped layering called hummocky cross-stratification (HCS), plus impact spherules and broken shells.",
        why: "Hummocky layers form when huge waves slosh sand back and forth on the seafloor, well below where normal waves reach. Here they record tsunami waves surging back and forth across the Gulf.",
        evidence: "In Texas, scientists found boulders and other large rocks that came from different places.",
        suggests: "Tsunamis scoured the ocean bottom and redeposited the material; the asteroid probably hit in the ocean.",
        ask: { q: "Normal seafloor mud settles slowly in calm water. What does a thick, wave-shaped sandstone in the middle of that mud tell you?",
               a: "Something suddenly brought enormous wave energy to deep, quiet water: a tsunami, most likely from a nearby ocean impact." },
        disciplines: ["geo"]
      },
      {
        id: "unit2", name: "Unit II: tsunami debris flow", kind: "impact", h: 12, pattern: "breccia",
        poly: [[0,56.2],[100,56.2],[100,71.7],[0,71.7]],
        age: "Hours after impact",
        what: "A muddy, gritty layer full of shell fragments and clasts, deposited as a slurry rather than settling grain by grain.",
        why: "The study interprets it as a debris flow set off by tsunami wave energy, the next blow after the seismic shaking that produced Unit I.",
        disciplines: ["geo", "paleo"]
      },
      {
        id: "unit1", name: "Unit I: earthquake-triggered debris flow", kind: "impact", h: 12, pattern: "breccia",
        poly: [[0,71.7],[100,71.7],[100,85.3],[0,85.3]],
        age: "Minutes to hours after impact",
        what: "The lowest event bed: a jumbled mix of mud, shells, and chunks of the Cretaceous seafloor, mostly from local sources.",
        why: "Interpreted as a debris flow started by intense ground shaking from the Chicxulub impact. Seismic waves would have arrived before the tsunami, so it sits at the bottom of the stack.",
        ask: { q: "Unit I sits below Unit II. Which event reached Texas first, the shaking or the waves? Why?",
               a: "The shaking. Seismic waves travel through rock far faster than a tsunami crosses the ocean, so the earthquake-triggered flow (Unit I) was laid down first." },
        disciplines: ["geo", "geophys"]
      },
      {
        id: "k", name: "Corsicana mudstone (Upper Cretaceous)", kind: "cretaceous", h: 26, pattern: "mud",
        poly: [[0,85.3],[100,85.3],[100,100],[0,100]],
        age: "Before 66 Ma",
        what: "Fine, dark, calm-water mud full of Cretaceous marine fossils. The dashed line marks the eroded top of this seafloor.",
        why: "The sharp contrast with the chaotic beds above shows how sudden the event was. The seafloor was even scoured away by the disturbance.",
        disciplines: ["geo", "paleo"]
      }
    ]
  },

  {
    id: "beloc",
    name: "Beloc",
    place: "Southern Haiti",
    latlng: [18.38, -72.62],
    type: "marine",
    typeLabel: "Marine outcrop",
    image: "image/ktboundary.haiti-slab.png",
    imageAlt: "Close-up of a cut rock slab packed with dark, rounded and oval glass tektites, some with pale rims or bubbles, in a tan limestone matrix",
    photoTag: "Close-up · tektite bed",
    imageCredit: "Slab of the K-Pg ejecta layer near Beloc (Jan Smit, VU Amsterdam)",
    imageCreditUrl: "https://www.geo.vu.nl/~smit/tektites/beloc.htm",
    boundaryThickness: "Spherule (tektite) bed up to ~50 cm",
    summary:
      "Here the boundary layer is unusually thick and full of tektites, glass beads with some fresh black glass still inside them. Thick, coarse ejecta means you are close to the crater.",
    why: "The tektites pointed scientists toward the Gulf of Mexico–Caribbean region, narrowing the search for the crater.",
    schematicTitle: "Outcrop section, simplified (photo shows the tektite bed only)",
    layers: [
      {
        id: "pg", name: "Paleocene limestone", kind: "paleogene", h: 30, pattern: "limestone",
        age: "After 66 Ma",
        what: "Marine limestone deposited after the event.",
        why: "Normal marine sedimentation resumed after the ejecta fell.",
        disciplines: ["geo"]
      },
      {
        id: "ir", name: "Iridium-rich clay cap", kind: "boundary", h: 5, pattern: "clay",
        age: "Months to years after impact",
        what: "A thin clay layer at the top of the spherule bed, enriched in iridium.",
        why: "As at Blake Nose, the finest asteroid dust arrived last, on top of the coarse ejecta.",
        disciplines: ["chem"]
      },
      {
        id: "tektites", name: "Tektite (glass spherule) bed", kind: "impact", h: 30, pattern: "spherules",
        poly: [[0,0],[100,0],[100,100],[0,100]],
        age: "Hours after impact",
        what: "Millimeter-sized glass beads, many with unaltered black glass cores. Their chemistry is a mix of continental rock and sulfur-rich sediment. The photo is a cut slab of this bed: each dark oval is a tektite, and some still hold gas bubbles from when they were molten.",
        why: "Tektites are melted rock. A layer this thick and coarse had to come from somewhere close, around the Gulf of Mexico.",
        evidence: "In Haiti, scientists found tektites, which are melted rock.",
        suggests: "The crater was probably near the Gulf of Mexico.",
        disciplines: ["geo", "chem"]
      },
      {
        id: "k", name: "Upper Cretaceous limestone", kind: "cretaceous", h: 30, pattern: "limestone",
        age: "Before 66 Ma",
        what: "Marine limestone with Cretaceous forams.",
        why: "This is the baseline below the ejecta.",
        disciplines: ["paleo"]
      }
    ]
  },

  {
    id: "woodside",
    name: "Woodside Creek",
    place: "Marlborough, South Island, New Zealand",
    latlng: [-42.08, 173.93],
    type: "marine",
    typeLabel: "Marine limestone outcrop",
    image: "image/ktboundary.woodscreek.jpg",
    imageAlt: "Creek-side outcrop: pale limestone ledge at the top, grey slabby beds, thin dark banded beds, a dark recess, then rusty-stained pale limestone below",
    imageCredit: "GNS Science, via Te Ara – the Encyclopedia of New Zealand",
    imageCreditUrl: "https://teara.govt.nz/en/photograph/8316/cretaceous-tertiary-boundary",
    boundaryThickness: "Boundary clay a few mm–cm",
    summary:
      "On the far side of the world from Gubbio, in ancient deep-sea limestone now exposed in a Marlborough creek bed. " +
      "Woodside Creek was one of the first places in New Zealand where the iridium-rich boundary clay was found.",
    why: "A marine section in the Southern Hemisphere, about 12,000 km from Chicxulub, with the same thin iridium clay and the same change in plankton as Gubbio and Stevns Klint. The event was truly global.",
    schematicTitle: "Creek-bed section, simplified (layers interpreted from the photo)",
    layers: [
      {
        id: "pg", name: "Paleocene limestone", kind: "paleogene", h: 34, pattern: "limestone",
        poly: [[0,0],[100,0],[100,52],[0,52]],
        age: "After 66 Ma",
        what: "Pale and grey limestone beds that formed once carbonate-making plankton recovered.",
        why: "Normal limestone deposition returned, but built by a new set of surviving and newly evolved species.",
        disciplines: ["geo", "paleo"]
      },
      {
        id: "basal", name: "Earliest Paleocene dark beds", kind: "paleogene", h: 14, pattern: "mud",
        poly: [[0,52],[100,52],[100,63.5],[0,63.5]],
        age: "Just after 66 Ma",
        what: "Thin, dark, banded beds with little carbonate, directly above the boundary clay. (Interpreted from the photo.)",
        why: "With most chalk- and limestone-making plankton gone, mud and silica settled instead. Like the Fish Clay at Stevns Klint, this “carbonate crash” is the extinction recorded in the rock.",
        ask: { q: "Why would the rock just above the boundary be darker and less limy than the rock below?",
               a: "The plankton whose shells make limestone were mostly wiped out, so for a while only mud and silica-shelled plankton accumulated." },
        disciplines: ["geo", "paleo"]
      },
      {
        id: "clay", name: "Iridium-rich boundary clay", kind: "boundary", h: 5, pattern: "clay",
        poly: [[0,63.5],[100,63.5],[100,67],[0,67]],
        age: "66.0 Ma",
        what: "A thin, dark, soft clay that weathers back into a recess. Samples drilled here in 1977 showed a strong iridium anomaly.",
        why: "Iridium, gold and platinum-group metals rise and fall together here, a pattern that matches asteroid material, not ordinary Earth rock.",
        evidence: "Iridium was found at the K-Pg boundary all over the world.",
        suggests: "Whatever brought the iridium affected the whole planet at once.",
        disciplines: ["chem", "geo"]
      },
      {
        id: "k", name: "Upper Cretaceous limestone", kind: "cretaceous", h: 36, pattern: "chalk",
        poly: [[0,67],[100,67],[100,100],[0,100]],
        age: "Before 66 Ma",
        what: "Pale, hard limestone made of plankton shells. Its top surface is stained rusty orange by iron where the boundary clay sits on it.",
        why: "A productive, plankton-rich ocean right up to the boundary, just like at Gubbio, half a world away.",
        evidence: "The Cretaceous sediment is very uniform up to the K-Pg boundary.",
        suggests: "The world was in a steady state up to the K-Pg event.",
        disciplines: ["paleo"]
      }
    ]
  },

  {
    id: "hellcreek",
    name: "Hell Creek region",
    place: "Eastern Montana, USA (photo location: please confirm)",
    latlng: [47.6, -106.9],
    type: "land",
    typeLabel: "Terrestrial outcrop",
    image: "image/ktboundary2.jpg",
    imageAlt: "Outcrop with pale rock on top, dark coal, a thin tan clay band, more coal, and dark shale rubble below",
    boundaryThickness: "Boundary claystone typically a few cm",
    summary:
      "Rivers and swamps where Tyrannosaurus and Triceratops lived. Dinosaur bones are found up to the boundary but never above it. " +
      "Shocked quartz was first found in a boundary claystone like this one in Montana (1984).",
    why: "This links the impact layer directly to the disappearance of the dinosaurs on land.",
    layers: [
      {
        id: "pg", name: "Paleocene sediments", kind: "paleogene",
        poly: [[0,0],[100,0],[100,30.3],[50,29.8],[30,30.8],[12,33],[0,34.4]],
        age: "After 66 Ma",
        what: "Pale weathered mudstone and sandstone deposited by rivers after the extinction.",
        why: "No dinosaur bones occur in these rocks. The survivors were mostly small animals, including burrowing mammals that could shelter from the heat and cold.",
        evidence: "After the K-Pg boundary, scientists find fossils of smaller animals that lived in holes.",
        suggests: "The survivors were small animals; enough mammals survived to repopulate the planet.",
        disciplines: ["paleo"]
      },
      {
        id: "coal", name: "Earliest Paleocene coal (“fern spike” level)", kind: "paleogene",
        poly: [[0,34.4],[12,33],[30,30.8],[50,29.8],[100,30.3],[100,34.7],[50,38],[0,40.4]],
        age: "Just after 66 Ma",
        what: "Dark coal made from swamp plants that grew right after the impact.",
        why: "Pollen and spores in coal like this record the plant recovery. Ferns came first, then other plants slowly returned.",
        evidence: "After the K-Pg boundary, scientists find mostly fern spores.",
        suggests: "Ferns were the first plants to repopulate the devastated planet.",
        chart: "fernSpike",
        disciplines: ["bot"]
      },
      {
        id: "clay", name: "K-Pg boundary claystone", kind: "boundary",
        poly: [[0,40.4],[50,38],[100,34.7],[100,38],[50,39.9],[0,43.5]],
        age: "66.0 Ma",
        what: "A light tan clay band between the coals. Boundary claystones like this carry the iridium spike, shocked quartz, and altered spherules. (Interpreted from the photo.)",
        why: "The same impact layer found in the deep sea also shows up on land. One event, everywhere at once.",
        evidence: "The K-Pg layer also contains shocked quartz, which is rock shocked by an explosion or impact.",
        suggests: "Shock waves from an impact caused deformations in quartz.",
        disciplines: ["geo", "chem", "phys"]
      },
      {
        id: "kcoal", name: "Latest Cretaceous coal and carbonaceous shale", kind: "cretaceous",
        poly: [[0,43.5],[50,39.9],[100,38],[100,53],[0,56]],
        age: "Just before 66 Ma",
        what: "Dark, plant-rich swamp deposits from the last moments of the Cretaceous.",
        why: "Pollen here records a diverse flora of flowering plants and conifers, many of which never appear again above the claystone.",
        evidence: "Fossil pollen from the Cretaceous represents many different species; about 60% of plant species disappeared at the K-Pg boundary.",
        suggests: "About 60% of plant species went extinct at the K-Pg boundary.",
        disciplines: ["bot"]
      },
      {
        id: "k", name: "Upper Cretaceous mudstone (Hell Creek Fm.)", kind: "cretaceous",
        poly: [[0,56],[100,53],[100,100],[0,100]],
        age: "Before 66 Ma",
        what: "Weathered dark mudstone from the river floodplains where dinosaurs lived.",
        why: "Many dinosaur species are found in these layers, right up to the boundary, and never after.",
        evidence: "In the Hell Creek Formation, dinosaur bones occur up to the K-Pg boundary but never after.",
        suggests: "Many species of dinosaurs lived in the Cretaceous and then went extinct.",
        disciplines: ["paleo"]
      }
    ]
  },

  {
    id: "raton",
    name: "Raton Basin",
    place: "Colorado & New Mexico, USA (photo location: please confirm)",
    latlng: [37.17, -104.52],
    type: "land",
    typeLabel: "Terrestrial outcrop",
    image: "image/ktboundary3.jpg",
    imageAlt: "Outcrop with tan sandstone above, layered siltstone, a thin black coal seam, a thin white clay band, and dark shale below",
    boundaryThickness: "White boundary claystone ~1–2 cm",
    summary:
      "In 1981 an iridium spike was found here in rocks that formed on land, so the iridium could not have come from seawater. " +
      "Fossil leaves here record the collapse and slow recovery of plants.",
    why: "It shows the boundary layer and the extinction on land as well as in the sea. Leaf fossils show diversity crashing, then rebuilding over about 1.5 million years.",
    layers: [
      {
        id: "ss", name: "Paleocene sandstone", kind: "paleogene",
        poly: [[0,0],[100,0],[100,40],[0,41.7]],
        age: "~0.5–1.5 Myr after impact",
        what: "Tan river sandstone from the recovering landscape.",
        why: "Leaf fossils from higher Paleocene layers here show plant diversity rebuilding: 8 → 25 → 35 species, still short of the Cretaceous 47.",
        chart: "leafPhases",
        ask: { q: "Does leaf diversity ever return to Cretaceous levels in this record?",
               a: "Not quite. Phase 5 (~1.5 Myr later) reaches 35 species vs. 47 before the boundary." },
        disciplines: ["bot", "paleo"]
      },
      {
        id: "silt", name: "Layered siltstone and shale", kind: "paleogene",
        poly: [[0,41.7],[100,40],[100,50.3],[0,54.9]],
        age: "Early Paleocene",
        what: "Thinly layered floodplain mud and silt.",
        why: "Regular layering means normal river and swamp deposition resumed after the catastrophe.",
        disciplines: ["geo"]
      },
      {
        id: "coal", name: "Boundary coal (fern spike)", kind: "paleogene",
        poly: [[0,54.9],[100,50.3],[100,54.2],[0,58.3]],
        age: "Immediately after 66 Ma",
        what: "A black coal seam sitting right on the white claystone.",
        why: "Just above the claystone, fern spores take over the pollen record. Ferns colonized the devastated landscape first, like after a volcanic eruption today.",
        evidence: "After the K-Pg boundary, scientists find mostly fern spores.",
        suggests: "Ferns were the first plants to repopulate the devastated planet.",
        chart: "fernSpike",
        disciplines: ["bot"]
      },
      {
        id: "clay", name: "K-Pg boundary claystone", kind: "boundary",
        poly: [[0,58.3],[100,54.2],[100,55.9],[0,61.1]],
        age: "66.0 Ma",
        what: "A thin, pale clay band (interpreted from the photo). In the Raton Basin it contains the iridium spike, shocked quartz, and altered impact spherules.",
        why: "Iridium in rocks that formed on land ruled out ocean chemistry as the cause. The same fallout fell on land and sea.",
        evidence: "Iridium was found at the K-Pg boundary all over the world, including in non-marine rocks.",
        suggests: "The iridium came from outside Earth and spread through the atmosphere.",
        disciplines: ["chem", "geo"]
      },
      {
        id: "k", name: "Upper Cretaceous shale", kind: "cretaceous",
        poly: [[0,61.1],[100,55.9],[100,100],[0,100]],
        age: "Before 66 Ma",
        what: "Dark mudstone and shale with fossil leaves of palms, laurels, and other tropical flowering plants.",
        why: "47 leaf species here (“Phase 1”) drop to just 2 right after the boundary. That is a collapse of the plant community.",
        chart: "leafPhases",
        ask: { q: "Which plants would you expect to dominate right after the boundary?",
               a: "Ferns. Their spores spike right above the boundary clay." },
        disciplines: ["bot"]
      }
    ]
  },

  {
    id: "moody",
    name: "Moody Creek Mine",
    place: "West Coast, South Island, New Zealand",
    latlng: [-42.45, 171.3],
    type: "land",
    typeLabel: "Terrestrial coal-measure section",
    boundaryThickness: "Boundary clay a few mm–cm",
    summary:
      "On the far side of the world from Chicxulub, Vivi Vajda and colleagues (2001) counted pollen and spores layer by layer. These are the data in the “On Land” activity.",
    why: "The same iridium layer, plant collapse, and fern spike, about 12,000 km from the crater, show the impact’s effects were global.",
    schematicTitle: "Coal-measure section, simplified",
    layers: [
      {
        id: "recovery", name: "Paleocene recovery flora", kind: "paleogene", h: 30, pattern: "mud",
        age: "Thousands of years after",
        what: "Mudstone and coal where conifer (gymnosperm) pollen gradually returns.",
        why: "Recovery was slow. Flowering plant (angiosperm) pollen stays below Cretaceous levels.",
        disciplines: ["bot"]
      },
      {
        id: "fern", name: "Fern spike", kind: "paleogene", h: 12, pattern: "coal",
        age: "Just after 66 Ma",
        what: "A thin interval where fern spores suddenly dominate the pollen and spore count.",
        why: "Ferns are pioneers. Their spores can survive in soil and sprout quickly in sunlight once darkness lifts. This is a disaster landscape.",
        evidence: "After the K-Pg boundary, scientists find mostly fern spores.",
        suggests: "Ferns were the first plants to repopulate the devastated planet.",
        chart: "fernSpike",
        disciplines: ["bot"]
      },
      {
        id: "clay", name: "Iridium-rich boundary clay", kind: "boundary", h: 5, pattern: "clay",
        age: "66.0 Ma",
        what: "A thin clay with an iridium anomaly, just like the marine sites.",
        why: "The same chemical signature reached the Southern Hemisphere and is found in land deposits there too.",
        disciplines: ["chem"]
      },
      {
        id: "k", name: "Late Cretaceous coal measures", kind: "cretaceous", h: 36, pattern: "mud",
        age: "Before 66 Ma",
        what: "Coal and mudstone with abundant pollen from gymnosperms and angiosperms.",
        why: "Both groups drop sharply at the boundary. This was a diverse forest before the impact.",
        chart: "pollen",
        ask: { q: "What happens to angiosperm and gymnosperm pollen at the boundary?",
               a: "Both decrease dramatically, and fern spores increase." },
        disciplines: ["bot"]
      }
    ]
  }
];

// Trail of Evidence: the order in which the case was actually built (discovery time),
// following the HHMI "Following the Trail of Evidence" answer key.
KT.trail = [
  { year: "1970s", site: "gubbio", layer: "k", learn: { topic: "core", label: "New to rock layers? How to read a core" },
    title: "Big forams vanish at a thin clay layer",
    text: "Walter Alvarez sees large, diverse forams below the clay at Gubbio and only tiny ones above it. Is this boundary a mass extinction?",
    disciplines: ["geo", "paleo"] },
  { year: "1980", site: "gubbio", layer: "clay",
    title: "30× too much iridium",
    text: "Luis Alvarez, Frank Asaro and Helen Michel measure the clay: about 30 times more iridium than Earth’s crust should provide. Iridium is common in asteroids. Hypotheses: an asteroid, or a nearby supernova.",
    disciplines: ["phys", "chem", "astro"] },
  { year: "1980", site: "gubbio", layer: "clay",
    title: "No plutonium-244: the supernova is ruled out",
    text: "A supernova would also have showered Earth with plutonium-244. None is in the clay, so the iridium must have come from an asteroid. Its amount suggests the asteroid was about 10 km across.",
    disciplines: ["chem", "astro", "phys"] },
  { year: "1980", site: "stevns", layer: "clay",
    title: "The iridium is global",
    text: "The same spike shows up in Denmark’s Fish Clay, ~1,500 km away, and soon at dozens of sites worldwide.",
    disciplines: ["chem", "geo"] },
  { year: "1981", site: "raton", layer: "clay",
    title: "On land, too",
    text: "Iridium is found in the Raton Basin in rocks that formed on land. The fallout came through the atmosphere, not ocean chemistry.",
    disciplines: ["chem", "geo"] },
  { year: "1984", site: "hellcreek", layer: "clay",
    title: "Shocked quartz",
    text: "Quartz grains in Montana’s boundary claystone show microscopic shock lamellae, which form only under impact-level pressures.",
    disciplines: ["geo", "phys"] },
  { year: "1980s", site: "blake", layer: "ejecta", learn: { topic: "core", label: "First drill core on the trail: what is a core?" },
    title: "Glass spherules",
    text: "The boundary layer contains spherules: droplets of melted rock that cooled in the sky. Something generated enough heat to turn rock into glass.",
    disciplines: ["geo", "phys"] },
  { year: "1988", site: "brazos", layer: "hcs",
    title: "Tsunami deposits in Texas",
    text: "Boulders and torn-up seafloor in a single bed. Giant waves suggest the impact was in the ocean, near the Gulf of Mexico.",
    disciplines: ["geo"] },
  { year: "1990", site: "beloc", layer: "tektites",
    title: "Thick tektite layer in Haiti",
    text: "Coarse glass tektites in a layer up to half a meter thick. Thick ejecta means the crater must be close.",
    disciplines: ["geo", "chem"] },
  { year: "1991", site: "chicxulub", layer: "granite",
    title: "The crater: Chicxulub",
    text: "A buried ~180–200 km structure with a ring-shaped gravity anomaly, shocked quartz and melt rock, dated to 66 million years. The age and size match the prediction. The smoking gun.",
    disciplines: ["geophys", "geo", "phys"] },
  { year: "1991", site: "chicxulub", layer: "suevite",
    title: "A sulfur-rich target",
    text: "The rocks at the impact site are full of sulfur-bearing anhydrite. Vaporized sulfur and dust blocked sunlight, photosynthesis collapsed, and acid rain followed.",
    disciplines: ["chem", "geo"] },
  { year: "1990s", site: "hellcreek", layer: "k",
    title: "Dinosaurs up to the line, never after",
    text: "Many dinosaur species occur in the Hell Creek Formation right up to the boundary, and none above it. Small burrowing animals survived.",
    disciplines: ["paleo"] },
  { year: "1987–2001", site: "moody", layer: "fern",
    title: "Plants collapse, ferns take over",
    text: "Pollen records show ~60% of plant species disappearing. Ferns spike right above the boundary (Raton Basin, New Zealand), then other plants slowly recover.",
    disciplines: ["bot"] },
  { year: "1997–2002", site: "blake", layer: "pg", learn: { topic: "abundance", label: "Learn more: how foram abundance changes through a core" },
    title: "94% of planktonic forams gone",
    text: "At ODP Site 1049, 33 of 35 foram species go extinct exactly at the ejecta layer. The small, fast-reproducing generalists survived.",
    disciplines: ["paleo"] }
];

KT.conclusion = {
  title: "The case is closed",
  text: "A ~10 km asteroid struck the Yucatán 66 million years ago. Dust, soot and sulfur blocked the Sun for years, photosynthesis shut down, and food chains collapsed in the sea and on land. No single clue proved it. Geology, geophysics, chemistry, physics, astronomy, paleontology and botany each added independent evidence, and only an impact explains all of it.",
  question: "Which piece of evidence definitively showed that an asteroid had struck Earth?",
  answer: "The Chicxulub crater. It matched the predicted age and size and provided direct evidence. Everything before it was indirect."
};

// Small datasets for the inline charts (from the HHMI activities).
KT.charts = {
  foramSurvival: {
    title: "Planktonic foram species at the boundary, ODP Site 1049",
    source: "Huber et al. 2002, via HHMI",
    bars: [ { label: "Went extinct", value: 33, tone: "loss" }, { label: "Survived", value: 2, tone: "keep" } ],
    unit: "species", note: "33 of 35 = 94% extinct"
  },
  foramSize: {
    title: "Measured foram size (max length, mm)",
    source: "HHMI foram activity, Table 1",
    bars: [
      { label: "Cretaceous #1", value: 0.517, tone: "k" }, { label: "Cretaceous #3", value: 0.483, tone: "k" },
      { label: "Paleogene #2", value: 0.186, tone: "pg" }, { label: "Paleogene #4", value: 0.105, tone: "pg" }
    ],
    unit: "mm"
  },
  leafPhases: {
    title: "Leaf species by phase, Raton Basin",
    source: "Wolfe & Upchurch 1987, via HHMI",
    bars: [
      { label: "Phase 1 (Cretaceous)", value: 47, tone: "k" },
      { label: "Phase 2 (just after)", value: 2, tone: "pg" },
      { label: "Phase 3", value: 8, tone: "pg" },
      { label: "Phase 4", value: 25, tone: "pg" },
      { label: "Phase 5 (~1.5 Myr)", value: 35, tone: "pg" }
    ],
    unit: "species"
  },
  fernSpike: {
    title: "“Fern 2” spores, % of all pollen and spores (approx.)",
    source: "Read from Vajda et al. 2001 figure, Moody Creek NZ, via HHMI",
    bars: [
      { label: "Late Cretaceous", value: 1, tone: "k" },
      { label: "Just above boundary", value: 55, tone: "pg" },
      { label: "Later Paleocene", value: 20, tone: "pg" }
    ],
    unit: "%"
  },
  pollen: {
    title: "Gymnosperm pollen, % abundance (approx.)",
    source: "Read from Vajda et al. 2001 figure, via HHMI",
    bars: [
      { label: "Late Cretaceous", value: 45, tone: "k" },
      { label: "At boundary", value: 3, tone: "pg" },
      { label: "Early Paleocene", value: 15, tone: "pg" }
    ],
    unit: "%"
  }
};

// Foram cards (HHMI foram_cards.pdf). All images share one scale; the 0.1 mm bar is
// 19.9% of the image width. Names are as printed on the cards.
KT.forams = {
  scaleBarFraction: 0.199,
  source: "SEM images courtesy of Brian Huber (Smithsonian), from the HHMI foram cards",
  cards: [
    { n: 1,  age: "cretaceous", name: "Pseudoguembelina excolata" },
    { n: 2,  age: "tertiary",   name: "Chiloguembelina crinita" },
    { n: 3,  age: "tertiary",   name: "Eoglobigerina eobulloides" },
    { n: 4,  age: "cretaceous", name: "Globotruncana dupleublei" },
    { n: 5,  age: "tertiary",   name: "Eoglobigerina simplicissima" },
    { n: 6,  age: "cretaceous", name: "Eoglobigerina fringa" },
    { n: 7,  age: "tertiary",   name: "Chiloguembelina midwayensis" },
    { n: 8,  age: "cretaceous", name: "Heterohelix globulosa" },
    { n: 9,  age: "cretaceous", name: "Pseudotextularia nuttalli" },
    { n: 10, age: "tertiary",   name: "Chiloguembelina crinita" },
    { n: 11, age: "tertiary",   name: "Parasubbotina pseudobulloides" },
    { n: 12, age: "tertiary",   name: "Globoconusa daubjergensis" },
    { n: 13, age: "tertiary",   name: "Eoglobigerina edita" },
    { n: 14, age: "cretaceous", name: "Pseudoguembelina palpebra" },
    { n: 15, age: "tertiary",   name: "Species unknown" },
    { n: 16, age: "cretaceous", name: "Globotruncana arca" },
    { n: 17, age: "tertiary",   name: "Species unknown" },
    { n: 18, age: "cretaceous", name: "Species unknown" },
    { n: 19, age: "cretaceous", name: "Heterohelix planata" },
    { n: 20, age: "cretaceous", name: "Pseudoguembelina hariaensis" }
  ]
};
