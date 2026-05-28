# File Uploads Fix Plan

## Changes

- `api/server.js` - In the multer `fileFilter`, add explicit rejection of `image/svg+xml` MIME type in addition to the general image/* check.

## Verification goals

- [x] Upload route requires JWT authentication
- [x] File size limited to 10MB
- [x] Only image/* MIME types accepted
- [x] Randomized filenames prevent enumeration
- [ ] SVG files explicitly rejected

## Manual verification (for Kenny)

1. Try uploading an SVG file via the admin panel. It should be rejected with an error message.
2. Verify uploaded files are accessible at `https://veramiek.nl/api/uploads/[filename]` and render as images in the browser.
