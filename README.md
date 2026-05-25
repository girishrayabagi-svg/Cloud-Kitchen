<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1EisaOzQ33dowUvTKL89QSxnTSN8YRHyW

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Replace `public/payment-qr.svg` with your real QR scanner image, keeping the same filename.
3. Run the app:
   `npm run dev`

The checkout supports QR scan payment and Cash on Delivery. Online payment gateway integration has been removed.

## Vercel Deployment Note

If the deployed site does not show the latest login page, redeploy the updated project files on Vercel. If you previously opened the site before this change, clear the browser site data for your Vercel domain or open it in an incognito window once.
