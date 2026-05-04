const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT2f_swI2tGnEfFKO0ATNLRpnhMqgWLUQc4vDaGWTbHBGvstHLdvJ5mGEwHdIlgfBMNCUXDBxmM-tcV/pub?output=csv';

const coverImg    = document.getElementById('album-cover');
const albumName   = document.getElementById('album-name');
const artistName  = document.getElementById('artist-name');
const releaseYear = document.getElementById('release-year');
const counter     = document.getElementById('counter');

let albums = [];
let currentIndex = 0;

function showAlbum(index) {
  if (!albums.length) return;

  const album = albums[index];

  coverImg.src = album.artwork;
  albumName.textContent = album.album;
  artistName.textContent = album.artist;
  releaseYear.textContent = album.release;

  counter.textContent = `${index + 1} / ${albums.length}`;
}

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

fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    albums = parseCSV(text);
    showAlbum(currentIndex);
  })
  .catch(err => {
    console.error(err);
    albumName.textContent = "Error loading albums";
  });

coverImg.addEventListener('click', () => {
  if (!albums.length) return;

  currentIndex = (currentIndex + 1) % albums.length;
  showAlbum(currentIndex);
});