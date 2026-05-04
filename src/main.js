// ── STEP 1: Google Sheet CSV URL ─────────────────────────────
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT2f_swI2tGnEfFKO0ATNLRpnhMqgWLUQc4vDaGWTbHBGvstHLdvJ5mGEwHdIlgfBMNCUXDBxmM-tcV/pub?output=csv';


// ── STEP 2: DOM ELEMENTS ─────────────────────────────────────
const coverImg    = document.getElementById('album-cover');
const albumName   = document.getElementById('album-name');
const artistName  = document.getElementById('artist-name');
const releaseYear = document.getElementById('release-year');
const counter     = document.getElementById('counter');


// ── STEP 3: STATE ─────────────────────────────────────────────
let albums = [];
let currentIndex = 0;


// ── STEP 4: DISPLAY ALBUM ─────────────────────────────────────
function showAlbum(index) {
  if (!albums.length) return;

  const album = albums[index];

  // optional fade effect (works with your CSS)
  coverImg.style.opacity = 0;

  setTimeout(() => {
    coverImg.src = album.artwork;
    albumName.textContent = album.album;
    artistName.textContent = album.artist;
    releaseYear.textContent = album.release;

    // ✅ FIXED COUNTER (now works)
    counter.textContent = `${index + 1} / ${albums.length}`;

    coverImg.style.opacity = 1;
  }, 150);
}


// ── STEP 5: CSV PARSER ────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};

    headers.forEach((header, i) => {
      obj[header.trim()] = values[i]?.trim();
    });

    return obj;
  });
}


// ── STEP 6: FETCH SHEET DATA ──────────────────────────────────
fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    albums = parseCSV(text);

    if (!albums.length) {
      albumName.textContent = "No albums found.";
      return;
    }

    showAlbum(currentIndex);
  })
  .catch(err => {
    console.error('Could not load album data:', err);
    albumName.textContent = 'Error loading albums.';
  });


// ── STEP 7: CLICK TO ADVANCE ──────────────────────────────────
coverImg.addEventListener('click', () => {
  if (!albums.length) return;

  currentIndex = (currentIndex + 1) % albums.length;
  showAlbum(currentIndex);
});