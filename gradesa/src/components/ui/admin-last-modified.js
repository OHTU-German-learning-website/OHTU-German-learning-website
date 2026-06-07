"use client";

export default function AdminLastModified({ updatedAt, updatedBy, className }) {
  const date = formatDateDdMmYyyy(updatedAt);
  const displayUser = String(updatedBy || "Unbekannt").trim() || "Unbekannt";
  const message = date
    ? `Letzte Änderung: ${date} durch ${displayUser}`
    : "Letzte Änderung: noch nicht gespeichert";

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "flex-end",
        width: "100%",
        marginBottom: "0.75rem",
        color: "var(--fg3)",
        fontSize: "var(--font-sm)",
      }}
    >
      {message}
    </div>
  );
}

function formatDateDdMmYyyy(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  return `${day}/${month}/${year}`;
}
