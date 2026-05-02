import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ALLOWED_FIELDS = [
  'type', 'title', 'date_ist', 'end_date_ist', 'location', 'location_to',
  'notes', 'dep_code', 'arr_code', 'flight_no', 'airline', 'terminal',
  'booking_ref', 'for_users',
]

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunkSize = 8192
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const uploadedBy = (formData.get('uploaded_by') as string) || 'scan'
    const forUsersRaw = formData.get('for_users') as string | null
    const forUsers: string[] = forUsersRaw ? JSON.parse(forUsersRaw) : [uploadedBy]

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const mediaType = file.type || 'application/octet-stream'
    const isImage = mediaType.startsWith('image/')
    const isPdf = mediaType === 'application/pdf'

    if (!isImage && !isPdf) {
      return new Response(JSON.stringify({ error: 'Only images and PDFs are supported' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Upload to storage
    const fileExt = file.name.split('.').pop() ?? 'bin'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
    const fileBytes = new Uint8Array(await file.arrayBuffer())

    const { data: storageData, error: storageError } = await supabase.storage
      .from('tickets')
      .upload(fileName, fileBytes, { contentType: mediaType })

    if (storageError) throw new Error(`Storage upload failed: ${storageError.message}`)
    const docStoragePath = storageData.path

    // Call Claude Haiku with vision
    const contentBlock = isPdf
      ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: toBase64(fileBytes) } }
      : { type: 'image', source: { type: 'base64', media_type: mediaType, data: toBase64(fileBytes) } }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: [
            contentBlock,
            {
              type: 'text',
              text: `You are extracting a flight/ferry/hotel booking from a ticket image or PDF.

STEP 1 — IDENTIFY TIMES (do this mentally before writing JSON):
A ticket contains TWO completely different kinds of numbers that look similar. Do NOT confuse them:

  DEPARTURE TIME — a 24-hour clock time printed next to the word "Departs", "Departure", "STD", or the origin airport code.
    • Looks like: 06:15  14:30  23:55  (hours 00–23, minutes 00–59)
    • The hours can be 0–23. Minutes can be 0–59.
    • This is what goes in "date_ist".

  FLIGHT DURATION — how long the journey takes. Printed between the two times or near an arrow.
    • Looks like: 5h 30m  2h 45m  3h 10m  or  5:30h
    • Duration hours are usually 1–12. It ALWAYS has an "h" or "hrs" or "hours" label.
    • THIS IS NOT A TIME. NEVER put this in date_ist or end_date_ist.

  ARRIVAL TIME — a 24-hour clock time next to "Arrives", "Arrival", "STA", or the destination airport code.
    • Same format as departure time. This is what goes in "end_date_ist".

EXAMPLE — given a ticket showing:
  DEL 06:15  ——5h 30m——  DPS 11:45+1  (or 14:15 IST)
  → date_ist = "2026-05-22T06:15:00+05:30"   (departure 06:15 IST)
  → end_date_ist = "2026-05-22T11:45:00+05:30"  (arrival in local time converted to IST)
  WRONG would be: date_ist using "05:30" (that's the duration, not a time)

TIMEZONE CONVERSIONS:
  • India (DEL, BOM, BLR, CCU, MAA…) = IST (UTC+5:30) — no change needed.
  • Bali / Indonesia (DPS, Denpasar) = WITA (UTC+8) — subtract 2h 30m to convert to IST.
    Example: 09:00 WITA → 06:30 IST

MULTI-PAGE DOCUMENTS: If this is a multi-page itinerary with several bookings, extract ONLY the FIRST / PRIMARY booking (the one that appears earliest in the document). Output a single JSON object, not an array.

STEP 2 — OUTPUT this exact JSON and nothing else (no markdown fences):
{
  "type": "flight" | "hotel" | "ferry" | "activity" | "transport",
  "title": "<Airline FlightNo · DEP → ARR, e.g. IndiGo 6E-123 · DEL → DPS>",
  "date_ist": "<ISO 8601 DEPARTURE clock-time in IST, e.g. 2026-05-22T06:15:00+05:30>",
  "end_date_ist": "<ISO 8601 ARRIVAL clock-time in IST, or null>",
  "location": "<departure airport / terminal / hotel name>",
  "location_to": "<arrival airport or null>",
  "notes": "<seat, check-in time, baggage, PNR details — or null>",
  "dep_code": "<IATA 3-letter code or null>",
  "arr_code": "<IATA 3-letter code or null>",
  "flight_no": "<e.g. 6E-123 or null>",
  "airline": "<airline name or null>",
  "terminal": "<terminal info or null>",
  "booking_ref": "<PNR / booking ref or null>",
  "for_users": null
}

This trip is 22–27 May 2026. If no year is shown, use 2026.`,
            },
          ],
        }],
      }),
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      throw new Error(`Claude API error: ${errText}`)
    }

    const claudeData = await anthropicRes.json()
    const raw = (claudeData.content?.[0]?.text ?? '').trim()
    const clean = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(clean)
    } catch {
      // Surface enough of the raw response to diagnose truncation
      throw new Error(`Could not parse Claude response as JSON. stop_reason=${claudeData.stop_reason ?? '?'} raw=${raw.slice(0, 400)}`)
    }

    // Sanity-check timestamps: end must be after start; gap must be < 48h; year must be 2026
    const startTs = parsed.date_ist ? new Date(parsed.date_ist as string).getTime() : NaN
    const endTs = parsed.end_date_ist ? new Date(parsed.end_date_ist as string).getTime() : NaN
    if (!isNaN(startTs)) {
      const year = new Date(startTs).getFullYear()
      if (year < 2026 || year > 2026) {
        parsed.date_ist = (parsed.date_ist as string).replace(/^\d{4}/, '2026')
      }
      if (!isNaN(endTs)) {
        if (endTs <= startTs) {
          // arrival before departure — likely a duration was used; drop end time and flag in notes
          parsed.end_date_ist = null
          parsed.notes = `[WARNING: arrival time could not be determined automatically] ${parsed.notes ?? ''}`
        } else if (endTs - startTs > 48 * 3600 * 1000) {
          // gap > 48h is almost certainly wrong for a flight/ferry
          parsed.end_date_ist = null
          parsed.notes = `[WARNING: arrival time could not be determined automatically] ${parsed.notes ?? ''}`
        }
      }
    }

    // Whitelist fields before insert; always override for_users with the form-provided value
    const eventData: Record<string, unknown> = { doc_storage_path: docStoragePath, doc_source: uploadedBy }
    for (const field of ALLOWED_FIELDS) {
      if (parsed[field] !== undefined) eventData[field] = parsed[field]
    }
    eventData.for_users = forUsers

    const { data: event, error: dbError } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single()

    if (dbError) throw new Error(`DB insert failed: ${dbError.message}`)

    return new Response(JSON.stringify({ success: true, event }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
