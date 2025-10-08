export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString()

export const formatDate = (iso: string) => 
  new Date(iso).toLocaleDateString()

export const formatPct = (x: number, digits = 1) => `${(x*100).toFixed(digits)}%`

export const formatDuration = (ms?: number) => {
  if (!ms || ms <= 0) return "—";
  const s = Math.floor(ms/1000);
  const h = Math.floor(s/3600);
  const m = Math.floor((s%3600)/60);
  const sec = s%60;
  const parts = [h ? `${h}h` : "", m ? `${m}m` : "", sec ? `${sec}s` : ""].filter(Boolean);
  return parts.join(" ");
};

export const formatCurrency = (v: number, c = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: c, maximumFractionDigits: 0 }).format(v);

export const formatNum = (n: number) => new Intl.NumberFormat(undefined).format(n);

export const percent = (x: number, digits = 1) => `${(x*100).toFixed(digits)}%`;

export const formatAgo = (iso: string) => {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime())/1000));
  const mins = Math.floor(s/60), hrs = Math.floor(mins/60), days = Math.floor(hrs/24);
  if (days) return `${days}d ago`;
  if (hrs) return `${hrs}h ago`;
  if (mins) return `${mins}m ago`;
  return `${s}s ago`;
};
