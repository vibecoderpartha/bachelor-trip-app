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
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            contentBlock,
            {
              type: 'text',
              text: `Extract travel booking information from this document. Return ONLY a valid JSON object — no markdown fences, no explanation — with exactly these fields:
{
  "type": "flight" | "hotel" | "ferry" | "activity" | "food" | "transport",
  "title": "<short descriptive title>",
  "date_ist": "<ISO 8601 timestamp in IST UTC+5:30>",
  "end_date_ist": "<ISO 8601 or null>",
  "location": "<departure city or venue name>",
  "location_to": "<destination city or null>",
  "notes": "<any extra details or null>",
  "dep_code": "<IATA departure code or null>",
  "arr_code": "<IATA arrival code or null>",
  "flight_no": "<flight number or null>",
  "airline": "<airline name or null>",
  "terminal": "<terminal info or null>",
  "booking_ref": "<booking/PNR reference or null>",
  "for_users": null
}

IMPORTANT: This trip takes place in May 2026 (22–27 May 2026). If the document does not explicitly state the year, use 2026.`,
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
      throw new Error(`Could not parse Claude response as JSON: ${raw.slice(0, 200)}`)
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
