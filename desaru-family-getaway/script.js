/* ==========================================================================
   Pure Intent — Desaru Family Getaway
   Lightweight progressive enhancement. The page works without JavaScript
   (all CTAs fall back to the #enquire section).
   ========================================================================== */

/* --------------------------------------------------------------------------
   WHATSAPP CONFIGURATION — the ONLY place the booking number is set.

   ⚠ NOT YET CONFIRMED. "REPLACE_WITH_CONFIRMED_NUMBER" is a placeholder,
   not a booking line. Replace it with the organiser-confirmed number in
   international format, digits only — no "+", spaces or dashes.
   e.g. a Singapore number 9123 4567 becomes "6591234567".

   Do NOT substitute one of the personal numbers printed on the poster
   unless the organiser confirms it as the official booking line.
   -------------------------------------------------------------------------- */
const WHATSAPP_NUMBER = "REPLACE_WITH_CONFIRMED_NUMBER";

const WHATSAPP_MESSAGE = [
  "Hi Pure Intent! I’m interested in the Desaru Family Getaway on 9–10 January 2027.",
  "",
  "Could you share the package details and availability?",
  "",
  "Number of travellers:",
  "Preferred package: S$268 per person / S$500 for two people",
  "",
  "Thank you!"
].join("\n");

(function () {
  "use strict";

  const doc = document.documentElement;
  doc.classList.remove("no-js");
  doc.classList.add("js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     Analytics hooks (no third-party scripts loaded by default).
     Events are pushed to window.dataLayer if a tag manager is added later,
     and dispatched as a "pi:track" DOM event for any other listener.
     NOTE: a click is only an intent to enquire. It is NOT a confirmed
     enquiry or booking — WhatsApp conversations happen outside this page.
     ------------------------------------------------------------------------ */
  function track(event, detail) {
    const payload = Object.assign({ event: event }, detail || {});
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
    document.dispatchEvent(new CustomEvent("pi:track", { detail: payload }));
    if (window.location.search.indexOf("debug") !== -1) console.info("[track]", payload);
  }

  track("landing_page_view", { page: "desaru_family_getaway" });

  /* ------------------------------------------------------------------------
     WhatsApp links — every element with [data-whatsapp] uses the same URL.
     ------------------------------------------------------------------------ */
  const isNumberConfigured = /^[1-9]\d{7,14}$/.test(WHATSAPP_NUMBER);
  const whatsappUrl = isNumberConfigured
    ? "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE)
    : null;

  const ctas = document.querySelectorAll("[data-whatsapp]");
  const dialog = document.getElementById("config-dialog");

  ctas.forEach(function (link) {
    if (whatsappUrl) {
      link.href = whatsappUrl;
      link.target = "_blank";
      link.rel = "noopener";
      link.setAttribute("aria-label", link.textContent.trim() + " (opens WhatsApp)");
    }

    link.addEventListener("click", function (e) {
      track("whatsapp_cta_click", {
        cta_location: link.dataset.cta || "unknown",
        number_configured: isNumberConfigured
      });

      if (!whatsappUrl) {
        // Placeholder state: never send visitors to a fake destination.
        e.preventDefault();
        if (dialog && typeof dialog.showModal === "function") {
          dialog.showModal();
        } else {
          window.location.hash = "enquire";
        }
      }
    });
  });

  if (!isNumberConfigured) {
    console.warn(
      "[Pure Intent] WhatsApp number not configured. Set WHATSAPP_NUMBER in script.js. " +
      ctas.length + " CTA(s) are currently showing the 'opening soon' dialog."
    );
    const banner = document.createElement("div");
    banner.className = "config-banner";
    banner.setAttribute("role", "note");
    banner.innerHTML = "Preview build — WhatsApp booking number not yet configured " +
      "(<code>WHATSAPP_NUMBER</code> in script.js).";
    document.querySelector(".skip-link").after(banner);
  }

  /* ------------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------------ */
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  function setNav(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function () { setNav(false); });
  }

  window.addEventListener("scroll", function () {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }, { passive: true });

  /* ------------------------------------------------------------------------
     Mobile sticky enquiry bar — shown after the hero CTAs scroll away,
     hidden while the final CTA or footer is on screen so it never covers them.
     ------------------------------------------------------------------------ */
  const sticky = document.querySelector(".sticky-cta");
  const heroActions = document.querySelector(".hero-actions");
  const endZone = [document.getElementById("enquire"), document.querySelector(".site-footer")];

  if (sticky && heroActions && "IntersectionObserver" in window) {
    document.body.classList.add("has-sticky-cta");
    const stickyLink = sticky.querySelector("a");
    let pastHero = false;
    const inEnd = new Set();

    function updateSticky() {
      const show = pastHero && inEnd.size === 0;
      sticky.classList.toggle("is-visible", show);
      sticky.setAttribute("aria-hidden", String(!show));
      stickyLink.tabIndex = show ? 0 : -1;
    }

    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        pastHero = !en.isIntersecting && en.boundingClientRect.top < 0;
      });
      updateSticky();
    }).observe(heroActions);

    const endObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) inEnd.add(en.target); else inEnd.delete(en.target);
      });
      updateSticky();
    });
    endZone.forEach(function (el) { if (el) endObserver.observe(el); });
  }

  /* ------------------------------------------------------------------------
     Decorative fireflies (skipped entirely with reduced motion → static dots)
     ------------------------------------------------------------------------ */
  document.querySelectorAll(".fireflies").forEach(function (layer) {
    const count = layer.classList.contains("fireflies-sparse") ? 14 : 26;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.style.left = (Math.random() * 100).toFixed(2) + "%";
      s.style.top = (Math.random() * 100).toFixed(2) + "%";
      if (!reduceMotion) {
        s.style.setProperty("--d", (4 + Math.random() * 5).toFixed(2) + "s");
        s.style.setProperty("--dd", (10 + Math.random() * 10).toFixed(2) + "s");
        s.style.setProperty("--delay", (-Math.random() * 8).toFixed(2) + "s");
        s.style.setProperty("--dx", (Math.random() * 40 - 20).toFixed(0) + "px");
        s.style.setProperty("--dy", (Math.random() * 40 - 20).toFixed(0) + "px");
      }
      frag.appendChild(s);
    }
    layer.appendChild(frag);
  });

  /* ------------------------------------------------------------------------
     Subtle reveal on scroll
     ------------------------------------------------------------------------ */
  if (!reduceMotion && "IntersectionObserver" in window) {
    const targets = document.querySelectorAll(
      ".section-head, .intro-grid, .theme, .exp, .optional-band, .day, .incl-card, .not-incl, .price-card, .faq"
    );
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }
})();
