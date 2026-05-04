// ── STEP 1: Paste your published Google Sheet CSV URL here ──────────────────
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT2f_swI2tGnEfFKO0ATNLRpnhMqgWLUQc4vDaGWTbHBGvstHLdvJ5mGEwHdIlgfBMNCUXDBxmM-tcV/pubhtml';
// It looks like: https://docs.google.com/spreadsheets/d/ABC123/pub?output=csv


// ── STEP 2: Grab the HTML elements we'll be updating ───────────────────────
// These match the id="" attributes in your HTML
const coverImg   = document.getElementById('album-cover');
const albumName  = document.getElementById('album-name');
const artistName = document.getElementById('artist-name');
const releaseYear = document.getElementById('release-year');


// ── STEP 3: A variable to track which album we're currently showing ─────────
let albums = [];      // will hold all your albums once loaded
let currentIndex = 0; // starts at the first album


// ── STEP 4: A function that displays whichever album is at currentIndex ──────
function showAlbum(index) {
  const album = albums[index];         // grab the album object at this position
  coverImg.src     = album.cover;      // swap the image
  albumName.textContent  = album.album;   // update the title text
  artistName.textContent = album.artist;  // update the artist text
  releaseYear.textContent = album.year;   // update the year text
}


// ── STEP 5: A function that parses raw CSV text into an array of objects ─────
// CSV comes in as plain text like:
//   album,artist,year,cover
//   Rumours,Fleetwood Mac,1977,https://...
// We need to turn each row into a neat object like: { album, artist, year, cover }

function parseCSV(text) {
  const lines = text.trim().split('\n');  // split into individual rows
  const headers = lines[0].split(',');    // first row is the column names

  // For every row after the header, zip it together with the headers
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i]?.trim(); // .trim() removes any hidden spaces
    });
    return obj;
  });
}


// ── STEP 6: Fetch the Sheet data when the page loads ────────────────────────
// fetch() reaches out to the URL and gets back the CSV text
fetch(SHEET_URL)
  .then(response => response.text())   // read the response as plain text
  .then(text => {
    albums = parseCSV(text);           // parse it into our albums array
    showAlbum(currentIndex);           // display the first album right away
  })
  .catch(error => {
    // If something goes wrong (bad URL, no internet), log it so you can debug
    console.error('Could not load album data:', error);
    albumName.textContent = 'Could not load albums. Check the console.';
  });


// ── STEP 7: When the cover is clicked, advance to the next album ─────────────
coverImg.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % albums.length;
  // The % (modulo) wraps back to 0 after the last album,
  // so it loops forever instead of stopping at the end
  showAlbum(currentIndex);
});