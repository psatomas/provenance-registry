export async function getAuditSummary(auditText: string) {
  const res = await fetch("/api/audit-summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ auditText }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate audit summary");
  }

  return res.json();
}