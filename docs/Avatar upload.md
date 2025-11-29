Avatar upload / developer avatar
===============================

This project now supports uploading a developer avatar from the web UI. Changes include:

- client-side: `src/views/develop/edit-perfil.ejs` and `public/javascripts/developer-edit.js` now allow choosing an image file and previewing it before upload.
- server-side: new endpoint `POST /api/v1/developers/:id/avatar` accepts a multipart/form-data file field `avatar`, stores it under `public/uploads/avatars/` and updates the `Developer.avatar` column.

How to use (manual / curl):

1. Start the app and ensure you have a developer id.

2. Upload a file (example using curl):

   curl -v -F "avatar=@/path/to/photo.jpg" http://localhost:3000/api/v1/developers/<developerId>/avatar

The response will contain JSON with the updated `avatar` field containing a public path like `/uploads/avatars/<filename>`.

Security / notes:
- Uploaded files are stored under `public/uploads/avatars` and served statically. In production you should consider additional file validation, anti-virus scanning, and/or a dedicated asset store (S3) rather than storing in the web root.
- The repo's `.gitignore` now excludes `public/uploads/` so files won't be committed.
