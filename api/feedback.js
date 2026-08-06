// Serverless function (runs on Vercel, not in the browser) that stores one
// feedback submission in Supabase. The browser POSTs { answers, source } here;
// this function writes a row to the "feedback" table using the Supabase REST
// API. The service role key is read from an environment variable and never
// leaves the server, so the browser only ever talks to our own site.
//
// Configure two environment variables in the Vercel project settings:
//   SUPABASE_URL                 e.g. https://xxxxxxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY    the service_role key (secret, server only)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: "Method not allowed" })
  }

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error("Feedback not configured: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    return res.status(500).json({ error: "Server not configured" })
  }

  // Vercel parses a JSON body for us, but accept a raw string too, just in case.
  let payload = req.body
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload)
    } catch {
      payload = null
    }
  }
  if (!payload || typeof payload !== "object") {
    return res.status(400).json({ error: "Invalid body" })
  }

  const answers = payload.answers
  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ error: "Missing answers" })
  }

  const source = payload.source && typeof payload.source === "object" ? payload.source : null

  // Guard against oversized or junk submissions (the form is short text only).
  const raw = JSON.stringify({ answers, source })
  if (raw.length > 20000) {
    return res.status(413).json({ error: "Too large" })
  }

  // A few flat columns for at a glance reading in the Supabase table, plus the
  // full answers and source kept as JSON so nothing is lost and the form can
  // change without a schema change.
  const row = {
    respondent: typeof answers.q1_role === "string" ? answers.q1_role : null,
    device: typeof answers.q2_device === "string" ? answers.q2_device : null,
    reached_position: source && Number.isFinite(source.position) ? source.position : null,
    reached_total: source && Number.isFinite(source.total) ? source.total : null,
    answers,
    source,
  }

  try {
    const insert = await fetch(`${url}/rest/v1/feedback`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    })
    if (!insert.ok) {
      const detail = await insert.text()
      console.error("Supabase insert failed:", insert.status, detail)
      return res.status(502).json({ error: "Store failed" })
    }
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error("Supabase unreachable:", err)
    return res.status(502).json({ error: "Store unreachable" })
  }
}
