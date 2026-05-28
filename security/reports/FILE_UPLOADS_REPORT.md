# File Uploads Security Report

## Status: MEDIUM

## Findings

File upload is implemented in `api/server.js` using `multer`:

```javascript
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, Date.now() + '-' + crypto.randomBytes(6).toString('hex') + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Alleen afbeeldingen toegestaan'));
    cb(null, true);
  }
});
```

**Positive:**
- Upload endpoint is protected by JWT `auth` middleware (admin-only).
- File size limited to 10MB.
- MIME type check: only `image/*` accepted.
- Randomized filename with `crypto.randomBytes(6)` prevents enumeration and path prediction.
- File extension extracted from original filename using `path.extname` (safe).
- Uploads served as static files via nginx `/uploads` path.

**Issues:**

1. **MEDIUM: MIME type check relies on Content-Type header, not magic bytes.** The `file.mimetype` from multer comes from the client-supplied `Content-Type` in the multipart form. A malicious admin could upload a PHP/HTML/SVG file with `Content-Type: image/jpeg`. SVG files in particular can contain embedded JavaScript that executes in browsers. Since uploads are served as static files from the same origin (`veramiek.nl/api/uploads/`), a stored SVG with JavaScript could execute XSS.

2. **LOW: No maximum number of files per upload.** The admin upload endpoint uses `upload.single('image')`, so only one file per request is accepted. This is fine.

3. **LOW: Original file extension is trusted.** An attacker could upload `malware.php.jpg` - the extension would be `.jpg` (correct), but if a PHP interpreter were ever accidentally configured, this would be a concern. In practice, this container runs Node.js, not PHP, so the risk is nil.

## What's at risk

- A compromised admin account could upload an SVG file with JavaScript, which would execute in visitors' browsers when they load the image URL directly (not via the `<img>` tag, which does not execute SVG scripts when the `src` is cross-origin, but DOES when same-origin and the user navigates to the file directly).
- Given the X-Content-Type-Options: nosniff header, this risk is reduced for direct navigation in modern browsers.

## What's already secure

- Admin-only upload route.
- MIME type check.
- Randomized, unpredictable filenames.
- 10MB size limit.

## Recommendations

1. Add a check to reject SVG files specifically (they can contain active content): if `file.mimetype === 'image/svg+xml'`, reject.
2. Optionally add magic byte verification using a library like `file-type` to verify the file content matches the declared MIME type.
