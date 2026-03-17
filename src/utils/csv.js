function parseCsvRows(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]

    if (inQuotes) {
      if (ch === '"') {
        const next = text[i + 1]
        if (next === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
      continue
    }

    if (ch === '"') {
      inQuotes = true
      continue
    }

    if (ch === ',') {
      row.push(field)
      field = ''
      continue
    }

    if (ch === '\n') {
      row.push(field)
      field = ''
      rows.push(row)
      row = []
      continue
    }

    if (ch === '\r') {
      const next = text[i + 1]
      if (next === '\n') i++
      row.push(field)
      field = ''
      rows.push(row)
      row = []
      continue
    }

    field += ch
  }

  if (inQuotes) {
    // 非严格模式：文件末尾引号未闭合时，仍然把已读到的内容作为字段。
    inQuotes = false
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows
}

export function extractCsvColumns(text, columns) {
  const wanted = Array.isArray(columns) && columns.length ? columns : ['data', 'logIndex', 'time']
  const rows = parseCsvRows(text)
  if (!rows.length) return { records: [], missingColumns: wanted.slice(), rowCount: 0 }

  const headers = rows[0].map((h) => (h ?? '').trim())
  const headerIndex = new Map()
  headers.forEach((h, idx) => headerIndex.set(h, idx))

  const missingColumns = wanted.filter((c) => !headerIndex.has(c))
  const records = []

  for (let r = 1; r < rows.length; r++) {
    const line = rows[r]
    if (!line || (line.length === 1 && line[0] === '')) continue

    const obj = {}
    for (const c of wanted) {
      const idx = headerIndex.get(c)
      obj[c] = typeof idx === 'number' ? (line[idx] ?? '') : ''
    }
    records.push(obj)
  }

  return { records, missingColumns, rowCount: records.length }
}

