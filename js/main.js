/* TLC Day Care concept — interactions
   Kept dependency-free. Everything degrades to plain links/sections without JS. */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: border on scroll ---------- */
  const header = $(".site-header");
  const onScrollHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = $(".menu-toggle");
  const nav = $("#main-nav");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });

  /* ---------- Call sheet ---------- */
  const sheet = $("#call-sheet");
  $$(".js-call").forEach((btn) =>
    btn.addEventListener("click", () => {
      if (typeof sheet.showModal === "function") sheet.showModal();
      else window.location.href = "tel:+15164424910";
    })
  );
  sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });

  /* ---------- Rooms (programs) ---------- */
  const ROOMS = [
    {
      id: "infants", name: "Infants", short: "6 wks–12 mo", age: "6 weeks to 12 months",
      ratio: 3, unit: "babies", color: "var(--coral)", tint: "var(--coral-t)", tab: "#F7909E",
      desc: "Two infant rooms, so the youngest babies get quiet, close care and older babies get more space to roll, crawl and pull up.",
      list: ["Separate rooms for younger and older infants", "Whole or 2% milk offered, with baby food sent from home", "Teachers certified in First Aid and CPR"],
    },
    {
      id: "twaddlers", name: "Twaddlers", short: "12–18 mo", age: "12 to 18 months",
      ratio: 4, unit: "children", color: "var(--sun)", tint: "var(--sun-t)", tab: "#FFC83D",
      desc: "Short stories, flash cards and music build first words while new walkers explore sensory play and movement.",
      list: ["Sensory play with whipped cream and paint", "Parachute and tunnel games for big muscles", "Blocks and puzzles for little hands"],
    },
    {
      id: "toddlers", name: "Toddlers", short: "18 mo–3 yrs", age: "18 months to 3 years",
      ratio: 4, unit: "children", color: "var(--sky)", tint: "var(--sky-t)", tab: "#8FAEF8",
      desc: "Centers with blocks, trains, little people and dramatic play let toddlers choose what they love and learn to play together.",
      list: ["Daily circle time with letters, colors and shapes", "Monthly themes around seasons, holidays and interests", "Art projects shown in class, then sent home"],
    },
    {
      id: "nursery", name: "Nursery", short: "3–4 yrs", age: "3 to 4 years",
      ratio: 6, unit: "children", color: "var(--leaf)", tint: "var(--leaf-t)", tab: "#7FCBAE",
      desc: "Circle time becomes a big part of the day as children start matching letters to their sounds and to words.",
      list: ["Letter sounds and first words", "Games that build early math", "Sensory play with sand, rice and pasta"],
    },
    {
      id: "prek", name: "Pre-K", short: "4–5 yrs", age: "4 to 5 years",
      ratio: 8, unit: "children", color: "var(--grape)", tint: "var(--grape-t)", tab: "#B9A0F0",
      desc: "Getting ready for kindergarten with the Learning Box curriculum, and still plenty of time to play and create.",
      list: ["Patterns, graphs and comparison charts", "Pre-reading and sight words every day", "Pencil grip and safety-scissor skills"],
    },
    {
      id: "upk", name: "UPK", short: "Age 4, district", age: "Universal Pre-K for 4-year-olds",
      ratio: null, hours: "9:00am to 2:00pm", color: "var(--sky-d)", tint: "var(--sky-t)", tab: "#C9D7FB",
      desc: "Your district's Universal Pre-K, taught at TLC. Add morning and afternoon hours so your child can stay from 7:00am to 6:00pm.",
      list: ["Follows your district calendar", "Optional meal plan, $100 a month", "Soccer and basketball with a certified coach"],
    },
  ];

  const tabsEl = $(".age-tabs");
  const panel = $("#room-panel");
  const img = $("#room-img");
  const dots = $("#ratio-dots");

  ROOMS.forEach((r, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "age-tab";
    b.id = "tab-" + r.id;
    b.setAttribute("role", "tab");
    b.setAttribute("aria-controls", "room-panel");
    b.setAttribute("aria-selected", i === 0 ? "true" : "false");
    b.tabIndex = i === 0 ? 0 : -1;
    b.style.setProperty("--tab", r.tab);
    b.innerHTML = `${r.name}<small>${r.short}</small>`;
    b.addEventListener("click", () => selectRoom(i, true));
    tabsEl.appendChild(b);
  });
  const tabs = $$(".age-tab", tabsEl);

  tabsEl.addEventListener("keydown", (e) => {
    const cur = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
    let next = null;
    if (e.key === "ArrowRight") next = (cur + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (cur - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next !== null) { e.preventDefault(); selectRoom(next, true); tabs[next].focus(); }
  });

  function selectRoom(i, animate) {
    const r = ROOMS[i];
    tabs.forEach((t, j) => {
      t.setAttribute("aria-selected", String(j === i));
      t.tabIndex = j === i ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", "tab-" + r.id);
    panel.style.setProperty("--room", r.color);
    panel.style.setProperty("--room-t", r.tint);

    img.src = `images/room-${r.id}.svg`;
    img.alt = "";
    if (animate && !reduceMotion) { img.classList.remove("swap"); void img.offsetWidth; img.classList.add("swap"); }

    $("#room-name").textContent = r.name;
    $("#room-age").textContent = r.age;
    $("#room-desc").textContent = r.desc;
    $("#room-list").innerHTML = r.list.map((li) => `<li>${li}</li>`).join("");
    $("#room-cta").textContent = r.id === "upk" ? "Ask about UPK on a tour" : `Book a tour of the ${r.name} room`;

    dots.innerHTML = "";
    if (r.ratio) {
      dots.hidden = false;
      dots.insertAdjacentHTML("beforeend", '<span class="t"></span>');
      for (let k = 0; k < r.ratio; k++) {
        const s = document.createElement("span");
        s.className = "k";
        s.style.animationDelay = animate ? `${80 + k * 60}ms` : "0ms";
        dots.appendChild(s);
      }
      $("#ratio-text").innerHTML = `<strong>1:${r.ratio}</strong> One teacher for every ${r.ratio} ${r.unit}`;
    } else {
      dots.hidden = true;
      $("#ratio-text").innerHTML = `<strong>${r.hours}</strong> Monday to Friday, extended care available`;
    }
  }
  selectRoom(0, false);

  /* ---------- Day timeline progress ---------- */
  const timeline = $("#timeline");
  const steps = $$("li", timeline);
  let ticking = false;
  const updateTimeline = () => {
    const rect = timeline.getBoundingClientRect();
    const mid = window.innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, (mid - rect.top) / rect.height));
    timeline.style.setProperty("--p", p.toFixed(3));
    steps.forEach((li) => li.classList.toggle("is-past", li.getBoundingClientRect().top + 10 < mid));
    ticking = false;
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(updateTimeline); } }, { passive: true });
  window.addEventListener("resize", updateTimeline);
  updateTimeline();

  /* ---------- Tour form ---------- */
  const form = $("#tour-form");
  const stepEls = $$(".step", form);
  const stepLabels = $$(".steps li");
  const done = $("#form-done");
  const dob = $("#dob");
  const dobHint = $("#dob-hint");
  const LOC_NAMES = { brookside: "TLC Brookside", merrick: "TLC Merrick Avenue", either: "TLC" };

  // "Book a tour here" buttons preselect the center
  $$(".js-pick").forEach((a) =>
    a.addEventListener("click", () => {
      const radio = form.querySelector(`input[name="location"][value="${a.dataset.loc}"]`);
      if (radio) radio.checked = true;
      clearError("location");
    })
  );

  // Room suggestion from date of birth
  function monthsBetween(from, to) {
    let m = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
    if (to.getDate() < from.getDate()) m -= 1;
    return m;
  }
  function roomFor(months, days) {
    if (days < 0) return "Expecting? Infants can join us from 6 weeks old, so it's a great time to tour.";
    if (days < 42) return "Infants can start at 6 weeks old. Tour now and plan your start date.";
    if (months < 12) return "Your child would join our Infants room (1:3 ratio).";
    if (months < 18) return "Your child would join our Twaddlers room (1:4 ratio).";
    if (months < 36) return "Your child would join our Toddlers room (1:4 ratio).";
    if (months < 48) return "Your child would join our Nursery room (1:6 ratio).";
    if (months < 60) return "Your child would join Pre-K. Ask us about UPK with your district too.";
    return "For school-age children, ask about our summer program at Brookside (ages 5 to 12).";
  }
  dob.addEventListener("change", () => {
    clearError("dob");
    if (!dob.value) { dobHint.textContent = "We'll show which room fits your child."; dobHint.classList.remove("is-match"); return; }
    const birth = new Date(dob.value + "T12:00:00");
    const now = new Date();
    const days = Math.floor((now - birth) / 86400000);
    dobHint.textContent = roomFor(monthsBetween(birth, now), days);
    dobHint.classList.add("is-match");
  });

  // Allergy details reveal
  const allergyBox = $("#allergy-details");
  $$('input[name="allergies"]', form).forEach((r) =>
    r.addEventListener("change", () => {
      allergyBox.hidden = r.value !== "yes" || !r.checked;
      if (!allergyBox.hidden) $("#allergy-text").focus();
    })
  );

  function setError(name, msg) {
    const p = form.querySelector(`.error[data-for="${name}"]`);
    if (p) { p.textContent = msg; p.closest(".field").classList.add("has-error"); }
  }
  function clearError(name) {
    const p = form.querySelector(`.error[data-for="${name}"]`);
    if (p) { p.textContent = ""; p.closest(".field").classList.remove("has-error"); }
  }
  $$("input, select", form).forEach((el) => el.addEventListener("input", () => clearError(el.name)));

  function validateStep(n) {
    const errs = [];
    if (n === 1) {
      if (!dob.value) errs.push(["dob", "Enter your child's date of birth, or your due date."]);
      if (!form.querySelector('input[name="location"]:checked')) errs.push(["location", "Choose a center, or pick Either one."]);
      if (!$("#start").value) errs.push(["start", "Choose the month you'd like to start."]);
      if (!$("#days").value) errs.push(["days", "Choose how many days a week."]);
    } else {
      if (!$("#first").value.trim()) errs.push(["first", "Enter your first name."]);
      if (!$("#last").value.trim()) errs.push(["last", "Enter your last name."]);
      const digits = $("#phone").value.replace(/\D/g, "");
      if (digits.length < 10) errs.push(["phone", "Enter a 10-digit phone number so the director can call you."]);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#email").value.trim())) errs.push(["email", "Enter an email like name@example.com."]);
    }
    errs.forEach(([k, m]) => setError(k, m));
    if (errs.length) {
      const first = form.querySelector(`[name="${errs[0][0]}"]`);
      if (first) first.focus();
    }
    return errs.length === 0;
  }

  function goTo(n) {
    stepEls.forEach((s) => (s.hidden = Number(s.dataset.step) !== n));
    stepLabels.forEach((li, i) => {
      li.classList.toggle("is-current", i + 1 === n);
      li.classList.toggle("is-done", i + 1 < n);
    });
    const firstInput = stepEls[n - 1].querySelector("input, select");
    if (firstInput) firstInput.focus({ preventScroll: true });
  }

  form.querySelector("[data-next]").addEventListener("click", () => { if (validateStep(1)) goTo(2); });
  form.querySelector("[data-back]").addEventListener("click", () => goTo(1));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    const loc = form.querySelector('input[name="location"]:checked').value;
    const name = $("#first").value.trim();
    const center = loc === "either" ? "A TLC director" : `The ${LOC_NAMES[loc]} director`;
    $("#done-text").textContent = `Thanks, ${name}. ${center} will call you at ${$("#phone").value.trim()} to pick a time for your tour.`;
    stepEls.forEach((s) => (s.hidden = true));
    stepLabels.forEach((li) => { li.classList.remove("is-current"); li.classList.add("is-done"); });
    done.hidden = false;
    done.focus();
    // Production: POST to a server endpoint here (see proposal, section 3).
  });

  form.querySelector("[data-reset]").addEventListener("click", () => {
    form.reset();
    allergyBox.hidden = true;
    dobHint.textContent = "We'll show which room fits your child.";
    dobHint.classList.remove("is-match");
    done.hidden = true;
    goTo(1);
  });

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
