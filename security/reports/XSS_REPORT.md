# XSS (Cross-Site Scripting) Security Report

## Status: MEDIUM

## Findings

### Server-side (email generation)

The server uses `escapeHtml()` for all user-supplied fields rendered in HTML emails:

```javascript
function escapeHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
```

All customer fields (`naam`, `email`, `tel`, `adres`, `bericht`, `onderwerp`) are passed through `escapeHtml()` before being placed in the email HTML. This is correct.

### Frontend (index.html)

**Issue 1 - MEDIUM: `innerHTML` with API data.**

In `loadContent()`, the site content loaded from `/api/content` is rendered via `setHtml()` for two fields:

```javascript
const setHtml = (id, v) => { const el = document.getElementById(id); if (el && v != null) el.innerHTML = v }
setHtml('heroTitle', h.title)   // allows <br> and <em>
setHtml('aboutTitle', a.title)  // allows <br>
```

These fields allow limited HTML (`<br>`, `<em>`). If an attacker gains admin access and saves a malicious value like `<img src=x onerror=alert(1)>` to `hero.title`, it would execute as XSS on the public website.

This is a **post-authentication XSS** - an attacker must already be an admin to exploit it. Given the single-admin design with 2FA, the realistic risk is low, but it is still a code quality concern.

**Issue 2 - LOW: Product HTML injection in product grid.**

In `renderProducts()`, product data is inserted into innerHTML:

```javascript
grid.innerHTML = products.map((p, i) => {
  ...
  return `<div class="product-card" data-cat="${p.cat}" ...>
    ...
    <h3>${p.name}</h3>
    <p class="product-desc">${p.desc}</p>
    ...
    ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
  `;
```

`p.name`, `p.desc`, and `p.badge` are inserted without HTML escaping. Since these come from the API (which is admin-controlled and stored in a JSON file), this is again post-authentication XSS. The admin could inject HTML/JS via product name or description.

**Issue 3 - LOW: Cart render with `x.name` in innerHTML.**

In `openCart()`, cart item names are rendered with `x.name` directly in a template literal inside innerHTML. Same concern as above.

### Admin panel (admin.html)

The admin panel has an `esc()` function used for product name/image alt text in the product grid render. However, product descriptions and other fields are placed in form inputs via `.value = p.desc`, which is safe (no innerHTML). The `esc()` function is used correctly where needed.

## What's at risk

- An attacker who compromises the admin panel (password + 2FA) could store XSS payloads in product names or site content fields that would execute on veramiek.nl for all visitors.
- This requires full admin compromise first, which requires both password and TOTP.

## What's already secure

- All user-submitted form data (contact/order) is properly escaped before use in emails.
- Admin panel uses `.value` assignment for form fields (safe).
- `esc()` function used in admin panel renders.

## Recommendations

1. In `index.html`, HTML-escape `p.name`, `p.desc`, and `p.badge` before injecting into innerHTML in `renderProducts()`.
2. Consider restricting the `setHtml` fields to only allow `<br>` and `<em>` via a sanitizer, or switch to server-side rendering for those fields.
