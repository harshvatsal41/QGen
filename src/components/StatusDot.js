export default function StatusDot({ status }) {
  const active = status === "active";
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${active ? "text-good" : "text-warn"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-good" : "bg-warn"}`} />
      {active ? "Active" : "Paused"}
    </span>
  );
}
