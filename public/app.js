const $ = s => document.querySelector(s);
const STORE_WA = ""; // Isi nomor WhatsApp format internasional, contoh 62812xxxxxxx.
let currentOrder = null;
$("#year").textContent = new Date().getFullYear();

function waUrl(text) {
  const phone = STORE_WA.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
function formatRp(value) {
  return new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(value)||0);
}
document.querySelectorAll(".game-card").forEach(card => card.addEventListener("click", () => {
  $("#gameSelect").value = card.dataset.game;
  $("#order").scrollIntoView({behavior:"smooth"});
}));
$("#waSupport").href = STORE_WA ? waUrl("Halo Nexora Top Up, saya membutuhkan bantuan.") : "https://wa.me/?text=" + encodeURIComponent("Halo Nexora Top Up, saya membutuhkan bantuan.");

$("#orderForm").addEventListener("submit", async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget));
  data.total = Number(data.total);
  try {
    const response = await fetch("/api/orders", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
    currentOrder = await response.json();
    showOrder(currentOrder);
  } catch {
    currentOrder = {...data,id:"NX"+Date.now(),createdAt:new Date().toISOString(),status:"Demo lokal"};
    showOrder(currentOrder);
  }
});
function showOrder(o) {
  $("#latestOrder").innerHTML = `<b>${o.id}</b><p>${o.game} • ${o.item}</p><p>Total: <b>${formatRp(o.total)}</b></p><p>Status: <span class="status">${o.status}</span></p><button class="button" id="openInvoice">Lihat invoice</button>`;
  $("#openInvoice").addEventListener("click", () => openInvoice(o));
  $("#check").scrollIntoView({behavior:"smooth",block:"center"});
}
function openInvoice(o) {
  const date = new Date(o.createdAt).toLocaleString("id-ID");
  $("#invoiceContent").innerHTML = `<div class="invoice-head"><div><h3>NEXORA TOP UP</h3><small>INVOICE PEMBELIAN</small></div><b>${o.id}</b></div>
  <p style="font-size:12px">Tanggal: ${date}<br>Pelanggan: ${o.customer}</p>
  <hr style="border:0;border-top:1px dashed #bbb">
  <div class="invoice-line"><span>Game</span><b>${o.game}</b></div>
  <div class="invoice-line"><span>Produk</span><b>${o.item}</b></div>
  <div class="invoice-line"><span>User ID</span><b>${o.playerId}</b></div>
  <div class="invoice-line"><span>Server ID</span><b>${o.serverId || "-"}</b></div>
  <div class="invoice-line invoice-total"><span>Total</span><b>${formatRp(o.total)}</b></div>
  <div class="notice">Status: ${o.status}. Ini invoice demo, bukan bukti pembayaran.</div>`;
  $("#invoiceDialog").showModal();
  $("#printInvoice").onclick = () => window.print();
  $("#shareInvoice").onclick = () => {
    const msg = `Invoice ${o.id}%0AGame: ${o.game}%0AProduk: ${o.item}%0AUser ID: ${o.playerId}%0ATotal: ${formatRp(o.total)}%0AStatus: ${o.status}`;
    const phone = STORE_WA.replace(/\D/g,"");
    window.open(phone ? `https://wa.me/${phone}?text=${msg}` : `https://wa.me/?text=${msg}`, "_blank");
  };
}
$("#closeInvoice").onclick = () => $("#invoiceDialog").close();

$("#bookingForm").addEventListener("submit", async e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.currentTarget));
  const message = `Halo Nexora Top Up! Saya ingin booking bantuan.%0ANama: ${encodeURIComponent(d.name)}%0ANomor: ${encodeURIComponent(d.phone)}%0AKeperluan: ${encodeURIComponent(d.topic)}%0AWaktu: ${encodeURIComponent(d.when || "-")}%0APesan: ${encodeURIComponent(d.message || "-")}`;
  try { await fetch("/api/bookings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}); } catch {}
  const phone = STORE_WA.replace(/\D/g,"");
  window.open(phone ? `https://wa.me/${phone}?text=${message}` : `https://wa.me/?text=${message}`, "_blank");
});

// Voice calling demo: browser Text-to-Speech, dapat dipicu dari konsol/admin UI lanjutan.
window.callQueue = function(number, counter = 1) {
  if (!("speechSynthesis" in window)) return alert("Browser ini belum mendukung voice calling.");
  const utterance = new SpeechSynthesisUtterance(`Nomor antrean ${number}, silakan menuju customer service loket ${counter}.`);
  utterance.lang = "id-ID";
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
};

// Download laporan CSV untuk data demo yang tersimpan di server.
window.downloadCsvReport = () => { window.location.href = "/api/reports/orders.csv"; };
