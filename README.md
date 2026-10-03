# Sir Mahee Full-Stack Learning Hub

## Included
- Liquid-glass student website
- Secure admin login/session
- Class/subject/chapter content management
- File upload for PDF, images, video, audio, Word, PowerPoint, Excel and common documents
- SQLite database
- Search/filter library
- Admin delete controls

## Run locally
1. Install Node.js 20+.
2. Copy `.env.example` to `.env` and change the secret/password.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000`.
6. Admin: `http://localhost:3000/admin`

## Production
Use HTTPS and a real reverse proxy/host. For large video files, replace local `/uploads` storage with S3-compatible object storage. The included local storage is intended as a starter deployment.

## Important
Never publish your `.env` file or admin password.
