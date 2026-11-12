const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const orders = [];
const bookings = [];

app.get("/api/health", (_, res) => res.json({ ok: true, mode: "demo" }));
app.get("/api/orders", (_, res) => res.json(orders));
app.post("/api/orders", (req, res) => {
  const order = { ...req.body, id: "NX" + Date.now(), createdAt: new Date().toISOString(), status: "Menunggu verifikasi" };
  orders.unshift(order);
  res.status(201).json(order);
});
app.post("/api/bookings", (req, res) => {
  const booking = { ...req.body, id: "BK" + Date.now(), createdAt: new Date().toISOString() };
  bookings.unshift(booking);
  res.status(201).json(booking);
});
app.get("/api/reports/orders.csv", (_, res) => {
  const cols = ["id","createdAt","customer","game","item","playerId","serverId","total","status"];
  const esc = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...orders.map(o => cols.map(c => esc(o[c])).join(","))].join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="nexora-laporan-transaksi.csv"');
  res.send("\uFEFF" + csv);
});

// Adapter API provider: isi setelah provider dan dokumentasi API dipilih.
// Jangan menaruh API secret di frontend/public.
app.post("/api/provider/topup", async (req, res) => {
  res.status(501).json({
    ok: false,
    message: "Integrasi provider belum dikonfigurasi. Tambahkan endpoint, autentikasi, dan callback sesuai dokumentasi provider."
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Nexora Top Up berjalan di http://localhost:${port}`));
