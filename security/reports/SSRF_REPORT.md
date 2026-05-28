# SSRF (Server-Side Request Forgery) Security Report

## Status: LOW

## Findings

Server-Side Request Forgery occurs when user-supplied URLs are fetched server-side, potentially targeting internal services.

The server does make outbound HTTP requests, but only in one context: sending email via `nodemailer` to `smtp.zoho.eu:587`. The SMTP host is hardcoded, not user-controlled.

**One area of indirect concern:**

In `buildVeraEmail` and `buildBuyerEmail`, product image URLs passed by the client in `/send-order` are embedded in HTML email via the `imgUrl()` helper:

```javascript
function imgUrl(src) {
  if (!src) return null;
  if (String(src).startsWith('http')) return String(src);
  return 'https://veramiek.nl/' + String(src).split('/').map(encodeURIComponent).join('/');
}
```

These URLs are embedded as `<img src="...">` tags in the email HTML. When the email client (Outlook, Gmail) renders the email, **the email client** fetches these images, not the server. This is not a server-side request forgery. However, if a malicious user submits an order with `images: ["http://attacker.com/track.png"]`, the victim's email client will load an external image when viewing the email - this is an email tracking/privacy concern rather than SSRF.

The server itself never fetches user-supplied URLs. No `axios`, `node-fetch`, `http.get`, or similar is used with user input.

## What's at risk

- Low risk: A spoofed order could embed external image tracking pixels in the email sent to `info@veramiek.nl`. Vera's email client would load the external image, revealing her IP address and email open time to an attacker.
- The server itself is not at risk of SSRF.

## What's already secure

- No server-side URL fetching of user-supplied input.
- SMTP host is hardcoded.

## Recommendations

1. In `/send-order`, validate that all image URLs in `items[].images` start with `https://veramiek.nl/` before including them in the email. This prevents external image injection.
