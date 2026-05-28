# XSS Fix Plan

## Changes

- `index.html` - Add HTML escaping function and use it for `p.name`, `p.desc`, `p.badge`, `x.name` in all innerHTML template literals in the product render and cart render.

## Verification goals

- [x] Server-side email HTML uses escapeHtml() for all user input
- [ ] Frontend renderProducts() escapes product name, desc, badge
- [ ] Frontend cart render escapes product names
- [ ] No unescaped API data inserted via innerHTML

## Manual verification (for Kenny)

1. In the admin panel, create a product with name: `<img src=x onerror="alert('XSS')">`.
2. Visit the public website product section.
3. The product name should appear as literal text, not trigger a JS alert.
