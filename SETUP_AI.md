# How to Activate the True AI Engine

The Medical Image Analysis in this application is now powered by **Google Gemini 2.5 Flash**, meaning it actively reads the pixels of the X-Rays, MRIs, and CT Scans you upload. 

To activate the AI, you must provide a free Google Gemini API Key. (This key is private, which is why the AI couldn't generate one for you automatically).

Here is exactly how to do it:

## Step 1: Get your Free API Key
1. Go to Google AI Studio: https://aistudio.google.com/app/apikey
2. Sign in with your normal Google Account.
3. Click the blue **"Create API Key"** button. 
4. Copy the long string of text!

## Step 2: Running it Locally (On your Computer)
1. In your project codebase, open the `.env` file (if you don't see one, create one in the root folder).
2. Paste this exact line inside the `.env` file, but replace the placeholder with your actual key:
   `VITE_GEMINI_API_KEY=your-long-key-string-goes-here`
3. Save the file.
4. Restart your local server by going to the terminal and typing: `npm run dev`

## Step 3: Running it on GitHub Pages (The Live Website)
Since GitHub Pages websites are public and don't allow private `.env` secret files, you need to store your key in your browser's local storage instead. 

1. Open your live website: https://RuthikReedy.github.io/project/
2. Right-click anywhere on the webpage and select **Inspect** (or press F12).
3. Click on the **Console** tab at the top of the inspect window.
4. Paste this exact command into the bottom of the console (making sure to paste your real key instead of the placeholder text), and hit Enter:
   `localStorage.setItem('GEMINI_API_KEY', 'your-long-key-string-goes-here')`
5. Refresh the page! 

The AI will now successfully scan your images!
