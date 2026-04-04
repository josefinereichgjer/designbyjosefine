window.PROJECTS = [
  {
    id: "reina-fruktgard",
    title: "Reina Fruktgård",
    year: "2025",
    tags: ["Emballasje design"],
    cover: "./assets/reinalys.webp",
    images: [
      "./assets/grain2.webp",
      "./assets/reinalys.webp",
      "./assets/reinaside.webp",
      "./assets/reinastor.webp"
    ],
    intro: "I dette prosjektet redesignet jeg emballasjen for Reina Fruktgård, en småskala økologisk produsent i Molde. Utgangspunktet var bedriftens eksisterende uttrykk, som ble videreutviklet for å tydeligere formidle opprinnelse, kvalitet og håndverksmessig produksjon. Målet var å skape et helhetlig uttrykk som kunne fungere som en visuell mal på tvers av produktene, samtidig som emballasjen fremhever det lokale og autentiske preget ved produsenten.",
    background: [
      {
        heading: "Innsikt i oppdragsgiver",
        body: "Reina er en tradisjonsrik gård med røtter langs Fannefjorden. Den har tidligere drevet med melk og kjøtt, men ble i 2021 omstilt til økologisk frukt-dyrking. Den sørvendte beliggenheten gir ideelle klimaforhold for epleproduksjon. Navnet Reina betyr «helling» eller «skråning», og refererer til gårdens plassering og lysforhold: «en skråning som vender mot sola». Dette har også inspirert bedriftens opprinnelige logo og visuelle uttrykk. Bedriften drives i dag av familien Fredriksen, og inngår i det lokale nettverket av småskalaprodusenter på Nordvestlandet."
      },
      {
        heading: "Oppgaven",
        body: "<strong>Verdier og identitet:</strong>\nReina Fruktgård er en familieeid produsent med sterk tradisjonsforankring. De legger vekt på økologi, kvalitet og nærhet. Hele produksjonen er økologisk, og råvarene utnyttes fullt ut, blant annet gjennom produktet Reinarampen laget av bunnfallet fra eplepressing. Produksjon, pressing og tapping skjer på gården, noe som gir en tydelig lokal forankring og et ærlig, håndverkspreget uttrykk.\n\n<strong>Marked og kontekst:</strong>\nReina opererer i det norske lokalmatmarkedet, særlig innen sider og eplemost. Med økt interesse for økologiske og autentiske produkter retter de seg mot et nisjemarked mellom landbruk, håndverksdrikke og reiseliv."
      },
      {
        heading: "Typografi",
        body: "Typografisystemet kombinerer skrifttypene Above the Beyond Script og Questa. Above the Beyond Script har et håndtegnet og kalligrafisk preg som gir identiteten et personlig og håndverksnært uttrykk. Den mer dekorative formen gjør at skriften ikke egner seg til lengre tekst, men fungerer godt som et karakterbærende element i identiteten.\n\nFor å balansere dette er serifskriften Questa brukt til mer informativ tekst. Questa har et tydelig og rolig uttrykk som gir god lesbarhet og struktur. Sammen skaper de to skrifttypene en balanse mellom det uttrykksfulle og det funksjonelle, samtidig som de understreker koblingen til håndverk og kvalitet.",
        image: "./assets/reinatypografi.webp"
      },
      {
        heading: "Illustrasjon",
        body: "<strong>Illustrasjonen</strong> er inspirert av gårdens navn og beliggenhet – «reina» betyr skråning eller helling mot sola. Den fungerer som et gjenkjennbart signaturelement på tvers av all emballasje.",
        image: "./assets/reinategning.webp"
      },
      {
        heading: "Fargepalett",
        body: "Paletten er redusert til to farger for å skape et tydelig og enkelt uttrykk. Den dype rødfargen refererer til epler og knytter emballasjen direkte til frukten og råvarene fra gården.",
        palette: [
          {
            hex: "#960C0C",
            name: "Reinarød",
            rgb: "150 / 12 / 12",
            cmyk: "0 / 92 / 92 / 41",
            pantone: "Pantone 7621 C"
          },
          {
            hex: "#000000",
            name: "Svart",
            rgb: "0 / 0 / 0",
            cmyk: "0 / 0 / 0 / 100",
            pantone: "Process Black C"
          }
        ]
      },
      {
        heading: "Første utkast",
        body: "Hvorfor endret jeg uttrykket i 2026? I den første versjonen brukte jeg både landskapsillustrasjonen og flere menneskefigurer som en del av hoveduttrykket. Selv om dette formidlet historien om familiebruket og fellesskapet, ble systemet ganske komplekst og litt visuelt rotete når det skulle brukes på ulike produkter. Derfor utviklet jeg i 2026 en ny løsning som er mer minimalistisk og renere. Ved å forenkle uttrykket og redusere antall elementer blir designet mer oversiktlig, lettere å tilpasse til flere produkter og mer konsistent som visuell identitet.",
        link: { label: "Se første utkast", src: "./assets/forsteutkastemballasje.pdf" }
      }
    ],
    projectMeta: [
      { label: "År", value: "2026" },
      { label: "Fag", value: "IDG3010 – Emballasjedesign" },
      { label: "Fag ansvarlig", value: "Thomas Tengsedal Nordby" },
      { label: "Verktøy", value: "Illustrator, Pacdora, Photoshop, Procreate" }
    ],
    pdf: {
      label: "Første utkast",
      src: "./assets/forsteutkastemballasje.pdf",
      note: {
        heading: "Hvorfor endret jeg uttrykket fra 2025?",
        body: "I den første versjonen brukte jeg både landskapsillustrasjonen og flere menneskefigurer i hoveduttrykket. Dette formidlet historien om familiebruket, men gjorde systemet mer komplekst og visuelt rotete på ulike produkter. Derfor utviklet jeg i 2026 en ny, mer minimalistisk løsning som er enklere å tilpasse og mer konsistent som visuell identitet."
      }
    },
    finalPdf: { label: "Nyskjerrig på mer om dette?", src: "./assets/ferdigreina.pdf" },
    skipBuild: true
  },
  {
    id: "bokomslag",
    skipBuild: true,
    title: "Bokomslag",
    subtitle: "Redaksjonell design",
    year: "2026",
    tags: ["Redaksjonell"],
    cover: "./assets/blaa.png",
    coverFilter: "brightness(1.2)",
    noSlideshow: true,
    gallery: [
      { src: "./assets/red-1.webp", wide: true },
      { src: "./assets/red-2.webp", wide: true },
      { src: "./assets/red-3.webp", wide: true },
      { src: "./assets/nede.webp", wide: true },
      { type: "heading", text: "Prototyper" },
      { src: "./assets/rot.webp", wide: true },
      { src: "./assets/gul.webp", wide: true },
      { src: "./assets/bla.webp", wide: true },
      { type: "palette", wide: true, colors: [
        { name: "Forrådt",           hex: "#ce2e27", color: "rgba(206, 46, 39, 0.62)",  description: "Opasitet 62%" },
        { name: "Jenny",             hex: "#ffeea8", color: "rgba(255, 238, 168, 0.62)", description: "Opasitet 62%" },
        { name: "Amtmandens Døtre",  hex: "#4ab3e1", color: "rgba(74, 179, 225, 0.25)",  description: "Opasitet 25%" }
      ]}
    ],
    processImages: ["./assets/prosess1.png", "./assets/prosess2.png"]
  },
  {
    id: "stoppestedet",
    skipBuild: true,
    title: "Stoppestedet",
    subtitle: "Visuell identitet & nettside",
    year: "2026",
    tags: ["Nettside og visuell identitet"],
    cover: "./stopp/assets/utenforforside.webp",
    coverPosition: "center 50%",
    noSlideshow: true,
    heroVideo: "./stoppestedet/images/nystoppvid.mp4",
    videoLink: "./stoppestedet/index.html",
    heroCollage: {
      src: "./stoppestedet/design.html",
      label: "Se tilhørende visuell identitet →",
      images: [
        "./stoppestedet/images/skiltdesign.webp",
        "./stoppestedet/images/storefrontstoppis.webp",
        "./stoppestedet/images/skiltutestopp.webp",
        "./stoppestedet/images/idcard.webp",
      ]
    },
    projectMeta: [
      { label: "År", value: "2026" },
      { label: "Plattform", value: "HTML / CSS, JavaScript" },
      { label: "Verktøy", value: "Adobe Illustrator, Adobe Photoshop, Figma" },
      { label: "Fag", value: "IDG3015 — Emneoverbyggende prosjekt" },
      { label: "Fag ansvarlig", value: "Jesper Egemar" }
    ],
    intro: "Stoppestedet er en fiktiv møteplass for ungdom i Oslo sentrum. Prosjektet omfatter utviklingen av en helhetlig visuell identitet, inkludert logo, fargepalett og profilering på fysiske flater, samt design og utvikling av en tilhørende nettside.\n\nJeg valgte dette prosjektet for å kombinere grafisk design med mine kodekunnskaper. Samtidig fikk jeg noe støtte fra Claude Code, som bidro til å effektivisere deler av utviklingsprosessen og gjøre det enklere å realisere løsningene i praksis.",
    link: { label: "Åpne nettsiden", src: "./stoppestedet/index.html" },
    processText: "<strong>Primærmålgruppe</strong>\nUngdom mellom 13 og 25 år i og rundt Oslo sentrum, som ønsker et uformelt, inkluderende og lett tilgjengelig sted å møtes. Tilbudet er samtidig åpent for alle som ønsker å være en del av miljøet.\n\n<strong>Sekundærmålgruppe</strong>\nForeldre, ungdomsarbeidere og frivillige organisasjoner som ønsker et trygt, synlig og inkluderende tilbud for unge i byen."
  },
  {
    id: "ansatts-portal",
    title: "Tjønnås og Norvald",
    subtitle: "UX design",
    year: "2026",
    tags: ["UX"],
    cover: "./assets/norvald/norvald.webp",
    images: ["./assets/tjonnipadiphone.webp"],
    noSlideshow: true,
    introBorder: true,
    showAccordion: true,
    intro: "Ansattportal for Tjønnås Delikatesser og Norvald Café:\nett system som samler vaktlister, kommunikasjon og opplæring på én plass.",
    scrollGalleries: [
      {
        label: "<strong>iPhone 16 Pro Max</strong> (utvalgte prototyper)",
        size: "mobile",
        images: [
          "./assets/norvald/tjonnas-2-mock.webp",
          "./assets/norvald/tjonnas-1-mock.webp"
        ]
      },
      {
        label: "<strong>iPad Pro 12.9\"</strong> (utvalgte prototyper)",
        size: "ipad",
        images: [
          "./assets/norvald/ipad10.webp",
          "./assets/norvald/ipad11.webp",
          "./assets/norvald/ipad12.webp",
          "./assets/norvald/ipad13.webp",
          "./assets/norvald/ipad14.webp",
          "./assets/norvald/ipad15.webp",
          "./assets/norvald/ipad16.webp",
          "./assets/norvald/ipad17.webp"
        ]
      }
    ],
    background: [
      {
        heading: "Prototype",
        body: "Utforsk den interaktive Figma-prototypen – mobil eller iPad.",
        links: [
          { label: "Mobil-prototype (Figma)", src: "https://www.figma.com/proto/SwPTqrNk3YUqrM2xNAKrhO/Tj%C3%B8nn%C3%A5s?node-id=370-654&t=gURyvsCsv2Xut1a-1", plain: true },
          { label: "iPad-prototype (Figma)", src: "https://www.figma.com/proto/SIwHbrWgze8kbEIWvYqJug/Tj%C3%B8nn%C3%A5smain?node-id=357-92&t=WdrI0DT0DpxmhxMO-1", plain: true }
        ]
      },
      {
        heading: "Rapport",
        link: { label: "Åpne rapport", src: "./assets/norvald/Endelig-rapport- informasjonsarkitektur.pdf", plain: true }
      },
      {
        heading: "Intervju",
        link: { label: "Åpne intervjuguide", src: "./assets/norvald/Intervju.pdf", plain: true }
      },
      {
        heading: "Sitemap",
        link: { label: "Åpne sitemap", src: "./assets/norvald/sitemap.pdf", plain: true }
      },
      {
        heading: "Designmanual",
        link: { label: "Åpne designmanual", src: "./assets/norvald/Designmanual.pdf", plain: true }
      },
      {
        heading: "Presentasjon",
        link: { label: "Åpne presentasjon", src: "https://www.canva.com/design/DAG5D6PV-Tc/0pcCKonM91HyyvCOiMM8ZA/view?utm_content=DAG5D6PV-Tc&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hf8713a3968", plain: true }
      }
    ],
    sections: [
      {
        type: "problem",
        bg: "krem",
        label: "Innsikt & utfordringer",
        heading: "Jobbhverdagen er spredt på for mange systemer",
        body: "Intervju med daglig leder (Mari-Mette) avdekket at driften var spredt over Messenger, Apple Notater, separate kassesystemer og muntlig opplæring – uten noen felles struktur.",
        image: "./assets/norvald/marimette.webp",
        itemsLabel: "Hovedproblemer:",
        items: [
          { title: "Vaktplaner", body: "Håndtert i et separat system uten kobling til felles kommunikasjon." },
          { title: "Internkommunikasjon", body: "Viktig info forsvant i Messenger-tråder." },
          { title: "Opplæring", body: "Kun fysisk og muntlig – tidkrevende og ikke tilgjengelig utenom arbeidstid." },
          { title: "Dokumenter & rutiner", body: "Ingen versjonskontroll. Nye ansatte hadde vansker med å finne frem til riktig informasjon." }
        ]
      },
      {
        type: "steps",
        bg: "mandel-light",
        label: "Designprosess",
        heading: "Fra innsikt til løsning",
        steps: [
          { num: "01", title: "Intervju", body: "Kvalitativt intervju med daglig leder. Ga innsikt i drift, kommunikasjon og utfordringer." },
          { num: "02", title: "Affinity map", body: "Observasjoner gruppert i 6 temaer: salgsmål, vaktplan, kommunikasjon, opplæring, dokumenter og markedsføring." },
          { num: "03", title: "Personas & scenarier", body: "5 personas. Primærbrukere: Kari (erfaren ansatt) og Eirik (nyansatt)." },
          { num: "04", title: "Wireframes → Hi-fi", body: "Lo-fi skisser iterert til hi-fi prototyper i Figma, med designmanual og WCAG-krav." }
        ]
      },
      {
        type: "features",
        bg: "krem",
        label: "Løsningen",
        heading: "Én samlet ansattportal",
        body: "Portalens kjerneområder samler det som tidligere lå spredt på ulike plattformer – tilgjengelig på mobil og iPad.",
        items: [
          { num: "01", title: "Landing page", body: "Daglige mål, ukentlige oppdateringer og viktige beskjeder samlet på én startside." },
          { num: "02", title: "Vaktliste", body: "Månedlig kalender med full oversikt over tid, sted og hvem du jobber med." },
          { num: "03", title: "Chat & kommunikasjon", body: "Felles meldingskanal med historikk. Viktig info drukner ikke lenger i Messenger-tråder." },
          { num: "04", title: "Digital opplæring", body: "Modulbaserte kurs med steg-for-steg instruksjoner. Kan fullføres hjemmefra i eget tempo." },
          { num: "05", title: "Dokumenter & rutiner", body: "Samlet bibliotek med versjonskontroll. Alltid oppdatert og lett å finne." },
          { num: "06", title: "Min side", body: "Personlig profil, innstillinger og notifikasjonslogg, tilpasset etter arbeidssted." }
        ]
      },
      {
        type: "team",
        bg: "none",
        label: "Gruppe 01",
        heading: "Teamet bak prosjektet",
        members: [
          { initials: "JR", name: "Josefine Reichelt Gjertsen", role: "Intervjuguide · Personas · Design", color: "#571721" },
          { initials: "HB", name: "Herman Brenn-Svendsen", role: "Sitemap · Prototyper · Wireframes", color: "#ad822e" },
          { initials: "TD", name: "Tia Linnea Dahl", role: "Designmanual · Personas · Rapport", color: "#c0523f" },
          { initials: "AJ", name: "Axel Bruusgaard Jewett", role: "Prototyper · Wireframes · Intervju", color: "#403d26" }
        ]
      }
    ]
  },
  {
    id: "flerkanalspublisering",
    skipBuild: true,
    title: "Flerkanalspublisering",
    subtitle: "Redesign",
    year: "2024",
    tags: ["Redesign"],
    cover: "./assets/srhbrosk.webp",
    coverCaption: "Brosjyre om universitetets bærekraftsarbeid",
    noSlideshow: true,
    gallery: [
      { type: "expandable",
        heading: "Trykte flater",
        cover: { src: "./assets/srhbrosk.webp", caption: "Brosjyre om universitetets bærekraftsarbeid", eager: true },
        items: [
          { src: "./assets/bak.webp",            caption: "Brosjyre – bakside",    cropX: 1.4 },
          { src: "./assets/foran.webp",          caption: "Brosjyre – forside",    cropX: 1.4 },
          { src: "./assets/plakat_mockup.webp",  caption: "Plakat i A2-format" },
          { src: "./assets/srhbanner_mockup.webp", caption: "Roll-up banner" },
        ]
      },
      { type: "expandable",
        heading: "Digitale flater",
        cover: { src: "./assets/srhvideo.mp4", caption: "Tilhørende nettside", captionLink: "./srh-open-day-3/index.html", video: true, autoplay: true },
        items: [
          { src: "./assets/linkedinsrh.webp",    caption: "LinkedIn-karusell" },
          { src: "./assets/facebook.webp",       caption: "Facebook event cover" },
          { src: "./assets/powerpointmal.webp",  caption: "PowerPoint-mal" },
        ]
      },
    ],
    intro: "Oppgaven har vært å utvikle en visuell kommunikasjonsløsning for et arrangement på tvers av flere medier. Prosjektet tar utgangspunkt i Open Day ved SRH Campus Berlin og studieområdet Digital Media & Creative Arts, et fiktivt paraplykonsept for kreative fag. Arrangementet brukes som et case for å utforske et tydelig visuelt uttrykk gjennom struktur, hierarki og konsistente designprinsipper.",
    background: [
      {
        heading: "Oppgaven",
        body: "Prosjektet går ut på å utvikle et visuelt uttrykk som fungerer på tvers av flere flater.\n\nDesignet bygger på SRH University Berlins eksisterende visuelle identitet, men videreutvikles gjennom egne designvalg. Fokus har vært på tydelig hierarki, struktur og en balansert bruk av typografi, bilde og luft i layouten."
      },
      {
        heading: "Hva skal produseres",
        body: "<ul class=\"bg__list\"><li>Plakat i A2-format</li><li>Roll-up banner (850 × 2000 mm)</li><li>Brosjyre om universitetets bærekraftsarbeid</li><li>LinkedIn-karusell for promotering av arrangementet</li><li>PowerPoint-mal for presentasjoner</li><li>Digitale reklamebannere</li><li>Facebook event cover for mobil og desktop</li><li>Designmanual for den visuelle identiteten</li></ul>"
      },
      {
        heading: "Typografi",
        body: "Typografien er basert på en rund og moderne grotesk skrifttype inspirert av SRHs visuelle profil.\n\nSiden den originale fonten ikke er tilgjengelig, brukes en alternativ font med lignende uttrykk (men ikke like brukervennlig). Ulike skriftvekter og størrelser skaper likevel et tydelig hierarki mellom overskrifter, mellomtitler og brødtekst."
      },
      {
        heading: "Fotografi",
        body: "Fotografiene viser campusmiljøet ved SRH University Berlin og fungerer som sentrale visuelle elementer i designet. Bildene gir kontekst til arrangementet. Alle er gratis nedlastbare hos deres nettside."
      },
      {
        heading: "Fargepalett",
        body: "Fargepaletten tar utgangspunkt i SRH University Berlins merkevarefarger.\n\nEn varm oransjetone brukes som aksentfarge sammen med mørke og lyse nøytrale toner. Dette skaper et tydelig og konsistent uttrykk på tvers av flater.",
        palette: [
          { hex: "#c44f24", name: "SRH Oransj",  description: "Primær farge" },
          { hex: "#1c1c1c", name: "SRH Mørk",    description: "Tekst og mørke slides" },
          { hex: "#e2ded5", name: "SRH Krem",     description: "Seksjon bakgrunn" },
          { hex: "#ffffff", name: "SRH Hvit",     description: "Bakgrunn" }
        ]
      }
    ],
    projectMeta: [
      { label: "År", value: "2024" },
      { label: "Fag", value: "IDG1009 – Flerkanalpublisering" },
      { label: "Fagansvarlig", value: "Mari Hermansen" },
      { label: "Verktøy", value: "Illustrator, Photoshop" }
    ],
    link: { label: "Åpne nettsiden", src: "./srh-open-day-3/index.html" },
    finalPdf: { label: "Nyskjerrig på mer om dette?", src: "./assets/srh_pdf.pdf" }
  },
  {
    id: "we-visuell-profil",
    skipBuild: true,
    title: "Stiftelsen WE",
    subtitle: "Strategisk design",
    year: "2026",
    tags: ["Strategisk design"],
    cover: "./assets/lillawenettside.webp",
    images: ["./assets/doorskilt.webp", "./assets/storefront.webp", "./assets/skjema.webp", "./assets/newicon.webp", "./assets/weinsta.webp", "./assets/wenettside.webp", "./assets/banner.webp"],
    finalPdf: { label: "Se hele PDF-en", src: "./assets/we.pdf" }
  },
  {
    id: "tidsskrift",
    title: "Tidsskrift",
    subtitle: "Redaksjonell design",
    year: "2026",
    tags: ["Redaksjonell"],
    cover: "./stoppestedet/images/lockin.webp",
  },
  {
    id: "emanuel-viegeland",
    title: "Emanuel Viegeland nettside",
    subtitle: "UX + redesign",
    year: "2026",
    tags: ["Redesign/UX"],
    cover: "./stoppestedet/images/lockin.webp",
    images: ["./assets/me.webp"],
    noSlideshow: true,
  },
  {
    id: "lovechild",
    title: "Weit & Weiter",
    subtitle: "café identitet",
    year: "2026",
    tags: [],
    cover: "./assets/3.april-brot.webp",
    noSlideshow: true,
    skipBuild: true,
    personal: true,
    gallery: [
      { src: "./assets/babilogo.webp", wide: true },
      { src: "./assets/3.april.webp", wide: true },
      { src: "./assets/3.april-brot.webp", wide: true },
      { src: "./assets/baby-skilt.webp", wide: true },
      { src: "./assets/baby-tote.webp", wide: true }
    ]
  }
];
