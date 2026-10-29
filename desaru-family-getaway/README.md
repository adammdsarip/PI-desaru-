# Pure Intent — Desaru Family Getaway landing page

A single-page, mobile-first promotional site for the **Desaru Family Getaway** (9–10 January 2027). It uses plain HTML, CSS and a little vanilla JavaScript, with no build step, framework, backend or tracking scripts. WhatsApp is the only enquiry channel.

> **Status: not production-ready.** The WhatsApp booking number is still a placeholder, and several content items need the organiser's confirmation (see below). The site has not been deployed.

---

## 1. File structure

```
desaru-family-getaway/
├── index.html          Page markup (all 10 sections + inline SVG icon sprite)
├── styles.css          Design tokens (:root) and all styles, mobile-first
├── script.js           WhatsApp config, CTA links, analytics hooks, nav, sticky bar
├── README.md
└── assets/
    ├── logo/           Pure Intent submark (header PNG, footer JPG, favicons)
    ├── hero/           Hero images + Open Graph placeholder
    ├── experiences/    Farm lunch, dinner, horse-riding images
    ├── accommodation/  Room image
    └── source/         Original supplied logo and poster (reference only, not loaded by the page)
```

## 2. Preview locally

Any static server works. From this folder, run:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

You can also open `index.html` directly in a browser. Fonts (Playfair Display, Inter) load from Google Fonts. Without a connection, the page falls back to system fonts.

---

## 3. Adding the confirmed WhatsApp number ⚠

The number is set in **one place**, at the top of `script.js`:

```js
const WHATSAPP_NUMBER = "REPLACE_WITH_CONFIRMED_NUMBER";
```

1. Replace it with the organiser-confirmed booking number in international format, **digits only**, with no `+`, spaces or dashes. For example, the Singapore number `9123 4567` becomes `"6591234567"`.
2. Save the file and reload. Every element with a `data-whatsapp` attribute (nav, hero, both pricing cards, FAQ, final CTA, footer and the mobile sticky bar) then links to:
   `https://wa.me/<number>?text=<URL-encoded pre-filled message>`
3. The yellow "Preview build" strip disappears automatically once a valid number (8–15 digits) is set.

**While the number is a placeholder:**
- A yellow "Preview build" strip appears at the top of the page.
- Clicking any WhatsApp CTA opens an "opening soon" dialog that points to the email address from the poster. It never opens a fake WhatsApp chat.
- The browser console logs a warning.
- Without JavaScript, CTAs scroll to the final enquiry section.

The three personal numbers on the poster (Ischa, Shee, Zab) were **deliberately not used**. Use one only if the organiser confirms it as the official booking line.

You can edit the pre-filled message in `WHATSAPP_MESSAGE`, also at the top of `script.js`. It is URL-encoded automatically.

---

## 4. Analytics readiness

No third-party scripts are included. `script.js` emits these events:

| Event | When | Fields |
|---|---|---|
| `landing_page_view` | page load | `page` |
| `whatsapp_cta_click` | any WhatsApp CTA click | `cta_location`, `number_configured` |

`cta_location` values come from each button's `data-cta` attribute: `nav_enquire`, `hero_whatsapp`, `pricing_per_person`, `pricing_two_pax`, `faq_whatsapp`, `mid_whatsapp`, `final_whatsapp`, `footer_whatsapp`, `sticky_whatsapp`.

Events are pushed to `window.dataLayer` when it exists (for example, after you add Google Tag Manager) and also dispatched as a `pi:track` DOM event. Add `?debug` to the URL to log events to the console.

**A click is not an enquiry.** Each click records an intent to open WhatsApp. Confirmed enquiries and bookings happen in WhatsApp and must be counted there.

---

## 5. Placeholders and assets needing replacement

### Images
All photographs are **temporary crops from the campaign poster**. They are low-resolution and were upscaled 2×. On the page, they are labelled "Illustrative image".

| File | Used for | Needed |
|---|---|---|
| `hero/firefly-cruise-poster.jpg` | Hero main image | Licensed high-res photo (≥1600px wide) of the Sungai Lebam firefly cruise |
| `hero/mangrove-fireflies-poster.jpg` | Hero inset, fireflies card | Genuine firefly/mangrove photo |
| `experiences/farm-lunch-poster.jpg` | Farm lunch card | Photo of the Aliyah Rizq Farm lunch |
| `experiences/dinner-buffet-poster.jpg` | Fruitfly Kelong card | **Photo of Fruitfly Kelong.** The current image is a generic buffet and is labelled "not the venue" |
| `accommodation/room-poster.jpg` | Tunamaya card | Official Tunamaya Desaru room photo (with permission) |
| `experiences/horse-riding-poster.jpg` | Optional activities band | Photo of the actual horse-riding/ATV provider |
| *(none — icon panel)* | Aliyah Rizq Farm Tour card | Farm photo |
| *(none — icon panel)* | Animal Encounters card | Buggy ride / baby sheep & goats photo |
| `hero/og-image-placeholder.jpg` | Social share image | Final 1200×630 share image |

To swap an image, replace the file at the same path, or update its `src`, `width` and `height` in `index.html`. Each `<img>` has a comment or alt text that identifies it. Keep aspect ratios similar. CSS crops with `object-fit: cover`.

### Logo
- The supplied file is the **PI submark only**. "PURE INTENT" next to it in the header and footer is set as text in Playfair Display. A wordmark/lockup file should be supplied if one exists.
- `logo/pure-intent-submark-120.png` is the supplied artwork with its off-white ground made transparent. The colours and proportions are unchanged. The footer uses the original JPG on a light circular badge so it stays legible on navy.

### Code placeholders
- `index.html`: canonical URL and `og:url` / `og:image` use `REPLACE-WITH-PRODUCTION-DOMAIN`.
- Footer "Good to know": booking terms, cancellation policy and privacy notice are placeholders until approved.
- Footer copyright year (2026) needs checking.

---

## 6. Ambiguities in the source poster to verify with the organiser

1. **WhatsApp booking number.** The poster lists three personal numbers. Which one, if any, is the official line?
2. **Itinerary order and timings.** The poster gives none. The Day 1 / Day 2 allocation on the page is a provisional outline (farm, lunch, check-in, firefly cruise and dinner on Day 1; morning, checkout, JB shopping and return on Day 2). Please confirm or correct it, and add departure and return times and meeting points.
3. **Day 2 morning.** Is breakfast included? Any activity? Currently: "Morning arrangements to be confirmed by the organiser".
4. **S$500 for 2 pax.** Must both travellers share one twin room? Does it apply to an adult + child?
5. **Child pricing and family rooms.** Twin-share for families with children: how many per room, and are there child or infant rates?
6. **"Fruitfly Kelong".** Please confirm the spelling and venue name.
7. **Optional activity prices** for horse riding and ATV rides, and where they happen (at Aliyah Rizq Farm?).
8. **UEN.** The poster reads "5352596IA". The last characters are ambiguous (`1A` or `IA`), so the UEN is **not shown** on the site. Confirm before adding.
9. **Brand guidelines.** `BRAND_GUIDELINES.md` was not supplied with the brief. The palette (#0B357B, #F06D94, #F8F9FA, #2B2B3A) and fonts (Playfair Display, Inter) come from the brief itself.
10. **Contact email** `pureintentsg@gmail.com` is taken from the poster. Confirm it is the right public enquiry address.
11. **Minimum group size / smaller vehicle.** The poster mentions a smaller vehicle if numbers are lower. Is there a minimum for the trip to run?
12. **Deposit, payment and cancellation terms.** None are published yet.

---

## 7. Testing checklist

Items marked ✅ were checked during development in headless Chromium (Playwright) at 390px, 768px and 1440px. Everything else still needs checking on real devices before launch.

**Layout and responsiveness**
- ✅ No horizontal overflow at 390 / 768 / 1440px
- ✅ Hero headline, dates, starting price and primary CTA visible in the first mobile viewport (390×844)
- ✅ Pricing cards stack on mobile and sit side by side from 640px
- ☐ Check on real iOS Safari and Android Chrome (safe-area insets, sticky bar)
- ☐ Check at 320px width and with browser text zoom at 200%

**Links and CTAs**
- ✅ All nav anchors scroll to their sections, and the header offset is respected
- ✅ All `data-whatsapp` CTAs resolve to one identical URL when a number is set (tested with a dummy number, then reverted)
- ✅ The pre-filled message decodes exactly as specified
- ✅ Placeholder state: CTAs open the "opening soon" dialog and never a fake chat
- ☐ After adding the real number: tap every CTA on a phone and confirm WhatsApp opens with the message
- ✅ "Explore the Experience" scrolls to the Experience section

**Mobile sticky bar**
- ✅ Hidden in the hero, shown after the hero CTAs scroll away
- ✅ Hidden when the final CTA or footer is on screen, so it never covers them
- ✅ Not focusable while hidden (`aria-hidden` and `tabindex` toggle)

**Accessibility**
- ✅ Semantic landmarks (header, nav, main, sections with headings, footer) and skip link
- ✅ Mobile menu: `aria-expanded`, closes on Escape and on link tap
- ✅ FAQ uses native `<details>/<summary>`, so it is keyboard operable
- ✅ Visible focus ring (pink outline) on all interactive elements
- ✅ `prefers-reduced-motion` disables firefly animation, reveal effects and smooth scroll
- ✅ Pink is never used for small body text on white. Buttons use dark text on pink.
- ☐ Run Lighthouse / axe and a screen-reader pass (VoiceOver, TalkBack)

**Performance**
- ✅ Images below the fold use `loading="lazy"`, and all images have width and height set
- ✅ No JS dependencies. Images loaded by the page total about 310 KB (the 1200×630 share image adds 168 KB).
- ☐ Replace the poster crops with optimised final photos (WebP/AVIF, `srcset`)
- ☐ Lighthouse performance run on the deployed URL

**SEO and sharing**
- ✅ Title, meta description, Open Graph tags and favicon present
- ☐ Set the production domain in the canonical and `og:*` tags. Test with the Facebook Sharing Debugger and a WhatsApp link preview.

---

## 8. Remaining launch tasks

1. Add the confirmed WhatsApp number (Section 3).
2. Resolve the poster ambiguities (Section 6) and update the itinerary and FAQ copy to match.
3. Replace the poster crops with licensed venue photography (Section 5).
4. Add approved booking terms, cancellation policy and privacy notice.
5. Set the production domain in meta tags. Deploy to any static host (Netlify, Vercel, GitHub Pages, S3 and similar).
6. Optionally add a tag manager. CTA events are already emitted (Section 4).
