const $ = s => document.querySelector(s);
$("#callButton").addEventListener("click", () => {
  const n = $("#queueNumber").value.trim();
  const c = $("#counterNumber").value || 1;
  if (!n) return alert("Masukkan nomor antrean.");
  if (!("speechSynthesis" in window)) return alert("Browser tidak mendukung pemanggilan suara.");
  const u = new SpeechSynthesisUtterance(`Nomor antrean ${n}, silakan menuju customer service loket ${c}.`);
  u.lang = "id-ID";
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
});
$("#csvButton").addEventListener("click", () => window.location.href = "/api/reports/orders.csv");
async function loadOrders() {
  const el = $("#ordersTable");
  try {
    const orders = await (await fetch("/api/orders")).json();
    if (!orders.length) { el.innerHTML = '<p class="muted">Belum ada transaksi. Buat pesanan dari halaman toko untuk melihat data di sini.</p>'; return; }
    el.innerHTML = `<div style="overflow:auto"><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr>${["Invoice","Pelanggan","Game","Produk","Total","Status"].map(x=>`<th style="text-align:left;padding:12px;border-bottom:1px solid #343246">${x}</th>`).join("")}</tr></thead><tbody>${orders.map(o=>`<tr>${[o.id,o.customer,o.game,o.item,"Rp "+Number(o.total).toLocaleString("id-ID"),o.status].map(x=>`<td style="padding:12px;border-bottom:1px solid #29283a">${String(x??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  } catch { el.innerHTML = '<p class="muted">Gagal memuat data. Pastikan server berjalan.</p>'; }
}
$("#refreshOrders").addEventListener("click", loadOrders);
loadOrders();
