const form = document.getElementById("form");
const input = document.getElementById("url");
const msg = document.getElementById("msg");
const view = document.getElementById("view");
const img = document.getElementById("img");
let currentBlobUrl = null;

function showError(text) {
  msg.textContent = text;
  msg.style.display = "block";
}

async function open(url) {
  msg.style.display = "none";
  img.style.display = "none";
  view.style.display = "block";
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    let blob = await res.blob();
    let type = blob.type || "";
    const lower = url.split("?")[0].toLowerCase();
    if (!type || type === "application/octet-stream") {
      if (lower.endsWith(".pdf") || lower.endsWith(".ai")) type = "application/pdf";
    }
    if (type !== blob.type) blob = new Blob([blob], { type });
    if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = URL.createObjectURL(blob);
    if (type.startsWith("image/")) {
      view.style.display = "none";
      img.src = currentBlobUrl;
      img.style.display = "block";
    } else {
      view.src = currentBlobUrl;
    }
  } catch (e) {
    showError("開けませんでした: " + e.message);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = input.value.trim();
  history.replaceState(null, "", "?url=" + encodeURIComponent(url));
  open(url);
});

const initial = new URLSearchParams(location.search).get("url");
if (initial) {
  input.value = initial;
  open(initial);
}
