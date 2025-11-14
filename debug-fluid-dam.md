# Debug Fluid DAM Issues

## Step 1: Check Browser Console
Open your browser console (F12) and look for error messages when you click "Browse DAM"

## Step 2: Check Network Tab
1. Open DevTools → Network tab
2. Click "Browse DAM" button
3. Look for the request to `/api/fluid-dam/assets`
4. Check:
   - What query params are being sent?
   - What's the response status code?
   - What's the error message in the response?

## Step 3: Verify Brand Data
Check if the brand.fluidDam data is actually being loaded
