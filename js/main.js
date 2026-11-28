/* ==========================================================
   Tandih – Vasquez Wedding
   ========================================================== */

/* ---- Edit these as details are confirmed ------------------ */
const CONFIG = {
  // Wedding day. Add the ceremony time once it is set, e.g. "2027-01-08T16:00:00"
  date: "2027-01-08T00:00:00",
  couplePhoto: "images/couple-sample.jpg", // SAMPLE photo from the moodboard: swap in the couple's own photo. "" shows the T&V monogram instead.
  venue: "",          // e.g. "Venue name, City" — shows "To be announced" while empty
  ceremonyTime: "",   // e.g. "4:00 PM"
  receptionTime: "",  // e.g. "6:00 PM"
  receptionVenue: "", // leave "" if it is the same place and you'd rather not repeat it — it shows "To be announced"
  // RSVP: paste a form endpoint that accepts a POST (Formspree, Getform, Basin…).
  // While empty, the form validates but tells the guest RSVPs are not open yet.
  // For Google Sheets: deploy apps-script/Code.gs as a web app and paste its /exec URL here.
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbzpRMy20N4PSGYWauLWS8gsMTE1E8wqaLDAbzXLiHoiBOAdNTNYvMRMJ8AHwtxlBmSd/exec",

  // ---- Map, Rooms and QR codes -------------------------------------------------
  // Blocks marked `sample: true` hold SAMPLE content so the couple can see the format.
  // Replace the text with the real details, then set that block's `sample` to false
  // to remove the "Sample only" label from the section.

  map: {
    sample: true,
    place: "Venue Name",
    address: "Street / Barangay, City, Province",
    link: "",  // Google Maps → Share → Copy link. The button stays greyed out while empty.
    embed: "", // Google Maps → Share → Embed a map → copy only the https://… address inside src="…". Empty shows the drawn placeholder.
    notes: [
      { label: "From the airport", text: "About 00 minutes by car from the nearest airport." },
      { label: "Parking", text: "Free parking is available at the venue." },
    ],
  },

  rooms: {
    sample: false,
    intro: "Room options at the venue, should you wish to stay close to the celebration.",
    list: [
      // image: save the room photo in images/rooms and put its path here. "" shows "Photo to follow".
      // details, sleeps, extra and guests are optional: leave "" to hide that line.
      { name: "The Gardens", image: "images/rooms/the-gardens.jpg", details: "", sleeps: "", rate: "₱8,500", extra: "₱2,000", guests: "" },
      { name: "The Veranda", image: "images/rooms/the-veranda.jpg", details: "", sleeps: "", rate: "₱13,000", extra: "", guests: "" },
      { name: "The Courtyard", image: "images/rooms/the-courtyard.jpg", details: "", sleeps: "", rate: "₱15,000", extra: "₱1,500", guests: "" },
      { name: "Villa Erlinda Prime", image: "images/rooms/villa-erlinda-prime.jpg", details: "", sleeps: "", rate: "₱15,500", extra: "₱2,500", guests: "" },
      { name: "Villa Erlinda Executive", image: "", details: "", sleeps: "", rate: "₱17,000", extra: "₱2,500", guests: "" },
      { name: "Casa Mercado Premier", image: "images/rooms/casa-mercado-premier.jpg", details: "", sleeps: "", rate: "₱16,000", extra: "", guests: "" },
      { name: "Casa Mercado Executive", image: "images/rooms/casa-mercado-executive.jpg", details: "", sleeps: "", rate: "₱18,000", extra: "", guests: "" },
      { name: "Casa Mercado Semi Presidential", image: "images/rooms/casa-mercado-semi-presidential.jpg", details: "", sleeps: "", rate: "₱20,000", extra: "", guests: "" },
      { name: "Casa Mercado Presidential", image: "", details: "", sleeps: "", rate: "₱21,500", extra: "", guests: "" },
    ],
    booking: "", // e.g. "To book, message Contact Name at 09XX XXX XXXX." Hidden while empty.
  },

  qr: {
    sample: false,
    list: [
      // image: save the QR picture in the images folder and put its path here, e.g. "images/qr-gift.png".
      // While empty, a drawn stand-in marked SAMPLE is shown (it does not scan).
      { title: "Gift of Love", image: "images/qr-gift-pnb.png", caption: "Your presence is the best present. Should you wish to give, a gift toward our next adventure would mean the world.",
        lines: [{ label: "PNB · InstaPay", text: "Tandih – Vasquez Wedding · Account ending 7048" }] },
      // Sample card, add it back once the shared album QR is ready:
      // { title: "Share Your Snaps", image: "", caption: "Scan to add your photos and videos to our wedding album.",
      //   lines: [{ label: "Hashtag", text: "#TandihVasquezWedding" }] },
    ],
  },
};
/* ----------------------------------------------------------- */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- Config-driven text ---------- */
$$("[data-config]").forEach((el) => {
  const value = CONFIG[el.dataset.config];
  if (value) el.textContent = value;
});

/* ---------- Map, Rooms, QR codes: built from CONFIG ---------- */
(function details() {
  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }
  // <dl> rows: [{ label, text }]
  function rows(dl, list) {
    (list || []).forEach((row) => {
      const div = el("div");
      div.append(el("dt", "", row.label), el("dd", "", row.text));
      dl.appendChild(div);
    });
    dl.hidden = !dl.children.length;
  }
  $$("[data-sample]").forEach((tag) => { tag.hidden = !(CONFIG[tag.dataset.sample] || {}).sample; });

  // Map
  const map = CONFIG.map;
  if (map.place) $("#mapPlace").textContent = map.place;
  $("#mapAddress").textContent = map.address;
  $("#mapAddress").hidden = !map.address;
  rows($("#mapNotes"), map.notes);
  if (map.link) $("#mapLink").href = map.link;
  if (map.embed) {
    const frame = el("iframe");
    frame.src = map.embed;
    frame.title = `Map to ${map.place}`;
    frame.loading = "lazy";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.allowFullscreen = true;
    $("#mapBox").replaceChildren(frame);
  }

  // Rooms
  const rooms = CONFIG.rooms;
  $("#roomsIntro").textContent = rooms.intro;
  $("#roomsIntro").hidden = !rooms.intro;
  $("#roomsBooking").textContent = rooms.booking;
  $("#roomsBooking").hidden = !rooms.booking;
  rooms.list.forEach((room, i) => {
    const card = el("article", "room reveal");
    card.style.setProperty("--d", `${(i % 3) * 0.12}s`);
    const photo = el("div", "room__photo");
    if (room.image) {
      const img = el("img");
      img.src = room.image;
      img.alt = `${room.name} room`;
      img.loading = "lazy";
      photo.appendChild(img);
    } else {
      photo.classList.add("room__photo--none");
      photo.insertAdjacentHTML("beforeend",
        '<svg class="room__key" viewBox="0 0 48 48" aria-hidden="true"><circle cx="15" cy="24" r="8"/><path d="M23 24h19M36 24v7M42 24v5"/></svg>');
      photo.appendChild(el("span", "", "Photo to follow"));
    }
    card.append(photo, el("span", "arch__num", `Room ${String(i + 1).padStart(2, "0")}`), el("h3", "", room.name));
    const rule = el("span", "arch__rule", "✦");
    rule.setAttribute("aria-hidden", "true");
    card.append(rule);
    if (room.details) card.append(el("p", "", room.details));
    const facts = el("dl", "arch__facts");
    rows(facts, [{ label: "Sleeps", text: room.sleeps }, { label: "Rate", text: room.rate }, { label: "Additional pax", text: room.extra }].filter((f) => f.text));
    facts.classList.toggle("arch__facts--one", facts.children.length === 1);
    card.appendChild(facts);
    if (room.guests) {
      const guests = el("p", "room__guests");
      guests.append(el("small", "", "Reserved for"), el("span", "", room.guests));
      card.appendChild(guests);
    }
    $("#roomsList").appendChild(card);
  });

  // QR codes
  // Stand-in drawing used until a real QR image is supplied. It is not a working code.
  function sampleQr() {
    const n = 25;
    let seed = 20270108;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const corner = (x, y) => (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
    let cells = "";
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const on = rnd() > 0.5;
        if (on && !corner(x, y) && (y < 10 || y > 14)) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
      }
    }
    const eye = (x, y) => `<path fill-rule="evenodd" d="M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5z"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
    return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" fill="#3d4429" role="img" aria-label="Sample QR code placeholder">${cells}${eye(0, 0)}${eye(n - 7, 0)}${eye(0, n - 7)}` +
      `<text x="${n / 2 + 0.3}" y="13.6" text-anchor="middle" fill="#a4553f" font-family="Aboreto, Georgia, serif" font-size="3.4" letter-spacing=".6">SAMPLE</text></svg>`;
  }
  CONFIG.qr.list.forEach((item, i) => {
    const card = el("article", "scan__card reveal");
    card.style.setProperty("--d", `${(i % 3) * 0.12}s`);
    const code = el("div", "scan__code");
    if (item.image) {
      const img = el("img");
      img.src = item.image;
      img.alt = `QR code: ${item.title}`;
      img.loading = "lazy";
      const link = el("a");
      link.href = item.image;
      link.download = "";
      link.setAttribute("aria-label", `Save the ${item.title} QR code`);
      link.appendChild(img);
      code.classList.add("scan__code--image");
      code.appendChild(link);
    } else {
      code.innerHTML = sampleQr();
    }
    card.append(code);
    if (item.image) card.append(el("small", "scan__hint", "Tap the QR to save it"));
    card.append(el("h3", "", item.title), el("p", "", item.caption));
    const lines = el("dl", "scan__lines");
    rows(lines, item.lines);
    card.appendChild(lines);
    $("#qrList").appendChild(card);
  });
})();

/* ---------- Opening curtain ---------- */
const body = document.body;
const nav = $("#nav");

function openInvitation() {
  if (body.classList.contains("is-open")) return;
  body.classList.add("is-open");
  body.classList.remove("is-locked");
  setTimeout(() => nav.classList.add("is-shown"), reduceMotion ? 0 : 1800);
}

/* ---------- Passport: scratch the seal, the cover opens, the curtain parts ---------- */
(function passportIntro() {
  const curtain = $("#curtain");
  const canvas = $("#scratch");
  const hint = $("#scratchHint");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  let finished = false, drawing = false, last = null, lastCheck = 0, cw = 0, ch = 0;

  function paintFoil() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const box = canvas.getBoundingClientRect();
    if (!box.width) return;
    cw = canvas.width = Math.round(box.width * dpr);
    ch = canvas.height = Math.round(box.height * dpr);
    ctx.globalCompositeOperation = "source-over";
    const g = ctx.createLinearGradient(0, 0, cw, ch);
    g.addColorStop(0, "#f6e7b4"); g.addColorStop(0.3, "#c99d4a"); g.addColorStop(0.55, "#f0d993");
    g.addColorStop(0.8, "#b88a39"); g.addColorStop(1, "#e8cf8c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cw, ch);
    // fine brushed-metal grain
    for (let i = 0; i < ch * 1.6; i++) {
      ctx.fillStyle = `rgba(${Math.random() > 0.5 ? "255,250,225" : "120,84,30"},${(Math.random() * 0.12).toFixed(3)})`;
      ctx.fillRect(Math.random() * cw, Math.random() * ch, 1 + Math.random() * cw * 0.06, 1);
    }
    ctx.fillStyle = "rgba(111, 79, 24, .78)";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `${Math.round(cw * 0.2)}px serif`;
    ctx.fillText("✦", cw / 2, ch * 0.38);
    ctx.font = `${Math.round(cw * 0.085)}px Aboreto, Georgia, serif`;
    ctx.fillText("S C R A T C H", cw / 2, ch * 0.56);
  }

  function point(e) {
    const r = canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * cw, y: ((e.clientY - r.top) / r.height) * ch };
  }

  function scratch(from, to) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = ctx.lineJoin = "round";
    ctx.lineWidth = cw * 0.24;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x + 0.01, to.y + 0.01);
    ctx.stroke();
  }

  // Share of the oval window that has been scratched away (0–1)
  function cleared() {
    const data = ctx.getImageData(0, 0, cw, ch).data;
    const step = Math.max(4, Math.round(cw / 40));
    let total = 0, gone = 0;
    for (let y = 0; y < ch; y += step) {
      for (let x = 0; x < cw; x += step) {
        const nx = (x - cw / 2) / (cw / 2), ny = (y - ch / 2) / (ch / 2);
        if (nx * nx + ny * ny > 1) continue;
        total++;
        if (data[(y * cw + x) * 4 + 3] < 40) gone++;
      }
    }
    return total ? gone / total : 0;
  }

  function finish() {
    if (finished) return;
    finished = true;
    if (reduceMotion) { openInvitation(); return; }
    curtain.classList.add("is-scratched");                                  // foil melts away
    setTimeout(() => curtain.classList.add("is-booklet-open"), 750);       // cover swings open
    setTimeout(openInvitation, 750 + 1600 + 1300);                         // curtain parts
  }

  canvas.addEventListener("pointerdown", (e) => {
    if (finished) return;
    drawing = true;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* pointer already gone */ }
    curtain.classList.add("is-touched");
    hint.textContent = "Keep scratching…";
    last = point(e);
    scratch(last, last);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drawing || finished) return;
    const p = point(e);
    scratch(last, p);
    last = p;
    const now = performance.now();
    if (now - lastCheck > 120) { lastCheck = now; if (cleared() > 0.45) finish(); }
  });
  const stop = () => { if (drawing) { drawing = false; if (!finished && cleared() > 0.45) finish(); } };
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);

  $("#openInvite").addEventListener("click", finish);

  paintFoil();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!drawing && !finished && !curtain.classList.contains("is-touched")) paintFoil(); });
  window.addEventListener("resize", () => { if (!finished && !curtain.classList.contains("is-touched")) paintFoil(); });
})();

// Every visit and every reload starts at the entrance, at the top of the page.
// (Add ?open to the URL to skip the entrance, e.g. while editing the site.)
if (new URLSearchParams(location.search).has("open")) {
  openInvitation();
} else {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  window.scrollTo(0, 0);
}

/* ---------- Hero title: split into letters ---------- */
$$("[data-split]").forEach((el) => {
  const base = 1.1 + parseFloat(el.dataset.splitDelay || 0);
  const text = el.textContent;
  el.textContent = "";
  el.setAttribute("aria-hidden", "true");
  [...text].forEach((ch, i) => {
    const s = document.createElement("span");
    s.textContent = ch;
    s.style.setProperty("--ld", `${(base + i * 0.06).toFixed(2)}s`);
    el.appendChild(s);
  });
});

/* ---------- Couple photo: hero frame, passport seal, passport ID page ---------- */
if (CONFIG.couplePhoto) {
  $$("img.js-couple").forEach((img) => {
    const show = () => { img.hidden = false; img.parentElement.classList.add("has-photo"); };
    img.addEventListener("load", show);
    img.src = CONFIG.couplePhoto;
    if (img.complete && img.naturalWidth) show();
  });
}

/* ---------- Scroll reveal ---------- */
const revealEls = [...$$(".reveal"), ...$$("#footerPhoto")];
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

/* ---------- Countdown ---------- */
(function countdown() {
  const target = new Date(CONFIG.date).getTime();
  const els = { d: $("#cdDays"), h: $("#cdHours"), m: $("#cdMins"), s: $("#cdSecs") };
  const pad = (n) => String(n).padStart(2, "0");

  function set(el, value) {
    if (el.textContent === value) return;
    el.textContent = value;
    if (reduceMotion) return;
    el.classList.remove("tick");
    void el.offsetWidth; // restart the animation
    el.classList.add("tick");
  }

  function update() {
    const diff = target - Date.now();
    if (diff <= 0) {
      $(".countdown__grid").hidden = true;
      $("#cdDone").hidden = false;
      clearInterval(timer);
      return;
    }
    const sec = Math.floor(diff / 1000);
    set(els.d, String(Math.floor(sec / 86400)));
    set(els.h, pad(Math.floor((sec % 86400) / 3600)));
    set(els.m, pad(Math.floor((sec % 3600) / 60)));
    set(els.s, pad(sec % 60));
  }
  const timer = setInterval(update, 1000);
  update();
})();

/* ---------- Scroll-driven bits: nav, parallax, flight path ---------- */
(function scrollFx() {
  const parallaxEls = $$("[data-parallax]");
  const flight = $("#flight");
  const path = $("#flightPath");
  const revealPath = $("#flightReveal");
  const plane = $("#plane");
  const total = revealPath ? revealPath.getTotalLength() : 0;

  if (revealPath) {
    revealPath.style.strokeDasharray = total;
    revealPath.style.strokeDashoffset = reduceMotion ? 0 : total;
  }

  let ticking = false;
  function frame() {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;

    nav.classList.toggle("is-solid", y > vh * 0.6);

    if (reduceMotion) return;

    if (y < vh * 1.2) {
      parallaxEls.forEach((el) => {
        el.style.transform = `translate3d(0, ${(y * parseFloat(el.dataset.parallax)).toFixed(1)}px, 0)`;
      });
    }

    if (flight && total) {
      const r = flight.getBoundingClientRect();
      // 0 when the strip enters the bottom of the viewport, 1 when it is ~30% from the top
      const p = Math.min(1, Math.max(0, (vh * 0.95 - r.top) / (vh * 0.65)));
      revealPath.style.strokeDashoffset = total * (1 - p);
      const len = total * p;
      const pt = path.getPointAtLength(len);
      const ahead = path.getPointAtLength(Math.min(total, len + 1));
      const sx = r.width / 1000, sy = r.height / 170; // viewBox → pixels (non-uniform)
      const angle = (Math.atan2((ahead.y - pt.y) * sy, (ahead.x - pt.x) * sx) * 180) / Math.PI + 90;
      plane.style.transform = `translate(${(pt.x * sx).toFixed(1)}px, ${(pt.y * sy).toFixed(1)}px) rotate(${angle.toFixed(1)}deg)`;
      plane.style.opacity = p > 0.01 ? 1 : 0;
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  frame();
})();

/* ---------- Boarding pass tilt ---------- */
(function tilt() {
  const pass = $("#pass");
  if (!pass || reduceMotion || !window.matchMedia("(hover: hover)").matches) return;
  pass.addEventListener("pointermove", (e) => {
    const r = pass.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    pass.style.transform = `perspective(1100px) rotateY(${(px * 7).toFixed(2)}deg) rotateX(${(-py * 7).toFixed(2)}deg)`;
  });
  pass.addEventListener("pointerleave", () => { pass.style.transform = ""; });
})();

/* ---------- Twinkling stars in the candlelight section ---------- */
(function stars() {
  const box = $("#stars");
  if (!box) return;
  for (let i = 0; i < 34; i++) {
    const s = document.createElement("span");
    s.style.left = `${(Math.random() * 100).toFixed(1)}%`;
    s.style.top = `${(Math.random() * 62).toFixed(1)}%`;
    s.style.setProperty("--t", `${(2.4 + Math.random() * 3.6).toFixed(1)}s`);
    s.style.setProperty("--dl", `${(-Math.random() * 5).toFixed(1)}s`);
    box.appendChild(s);
  }
})();

/* ---------- Gold dust floating over every section ---------- */
(function dust() {
  const canvas = $("#dust");
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = 1, motes = [], running = false, raf = 0, lastScroll = window.scrollY;

  function resize() {
    const newW = window.innerWidth, newH = window.innerHeight;
    const widthChanged = newW !== w;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = newW; h = newH;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Phones fire "resize" whenever the address bar slides away; only re-seed on a real width change.
    if (widthChanged || !motes.length) {
      const count = Math.round(Math.min(80, Math.max(28, (w * h) / 16000)));
      motes = Array.from({ length: count }, () => spawn());
    }
  }
  function spawn() {
    const r = 0.8 + Math.random() * 2.2;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r,
      vy: 0.12 + Math.random() * 0.4,
      depth: 0.08 + (r / 3) * 0.34, // bigger motes feel closer: they slide further as the page scrolls
      drift: Math.random() * Math.PI * 2,
      tw: Math.random() * Math.PI * 2,
    };
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    const scrolled = window.scrollY - lastScroll;
    lastScroll = window.scrollY;
    for (let i = 0; i < motes.length; i++) {
      const m = motes[i];
      m.y -= m.vy + scrolled * m.depth;
      m.drift += 0.008;
      m.tw += 0.03;
      m.x += Math.sin(m.drift) * 0.25;
      // wrap around the screen edges so the dust never runs out
      if (m.y < -12) { m.y += h + 24; m.x = Math.random() * w; }
      else if (m.y > h + 12) { m.y -= h + 24; m.x = Math.random() * w; }
      const a = 0.2 + 0.4 * (0.5 + 0.5 * Math.sin(m.tw));
      const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 3);
      grad.addColorStop(0, `rgba(214, 174, 96, ${a})`);
      grad.addColorStop(1, "rgba(214, 174, 96, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    if (running) raf = requestAnimationFrame(draw);
  }
  function start() { if (!running) { running = true; raf = requestAnimationFrame(draw); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  resize();
  window.addEventListener("resize", resize);
  // Runs for the whole page; pauses only while the tab is hidden.
  if (!document.hidden) start();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop(); else { lastScroll = window.scrollY; start(); }
  });
})();

/* ---------- RSVP ---------- */
(function rsvp() {
  const form = $("#rsvpForm");
  const status = $("#rsvpStatus");
  if (!form) return;

  function say(message, kind) {
    status.textContent = message;
    status.className = "form__status" + (kind ? ` is-${kind}` : "");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.elements.name;
    const choice = $(".choice", form);
    const attending = form.elements.attending.value;

    name.setAttribute("aria-invalid", String(!name.value.trim()));
    choice.setAttribute("aria-invalid", String(!attending));
    if (!name.value.trim()) { say("Please tell us your name.", "error"); name.focus(); return; }
    if (!attending) { say("Please let us know if you can make it.", "error"); return; }

    if (!CONFIG.rsvpEndpoint) {
      say("RSVPs aren't open just yet — please check back soon.", "error");
      return;
    }

    const btn = $("button[type=submit]", form);
    btn.disabled = true;
    say("Sending…");
    try {
      // Sent as a plain form post with no custom headers: that is what a Google Apps Script
      // web app accepts from another site without extra permission checks.
      const res = await fetch(CONFIG.rsvpEndpoint, {
        method: "POST",
        body: new URLSearchParams(new FormData(form)),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json().catch(() => ({}));
      if (data.ok === false) { say(data.error || "Something went wrong sending your RSVP. Please try again.", "error"); return; }
      form.reset();
      say(attending === "yes" ? "Thank you — see you there!" : "Thank you — you'll be missed.", "ok");
    } catch (err) {
      say("Something went wrong sending your RSVP. Please try again.", "error");
    } finally {
      btn.disabled = false;
    }
  });
})();
