// Convert CSV to SQL INSERT statements for Supabase
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const CSV_FILE = path.join(ROOT, 'curriculum_structured.csv')
const OUTPUT = path.join(ROOT, 'supabase', 'curriculum_data.sql')

function csvToSql() {
  const csv = fs.readFileSync(CSV_FILE, 'utf8')
  const lines = csv.split('\n')
  const header = lines[0].split(',').map(h => h.replace(/"/g, ''))
  
  const sql = []
  sql.push('-- Insert curriculum data from CSV')
  sql.push('BEGIN;')
  sql.push('')
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCsvLine(lines[i])
      if (values.length >= 14) {
        const insert = `INSERT INTO public.curriculum (
          chapter_order, chapter_title, topic_order, topic_title, 
          topic_description, topic_details, explanation, example, 
          example_tips, dialogue, image_alt, image_name, image_url, image_prompt
        ) VALUES (
          ${parseInt(values[0]) || 0},
          ${sqlEscape(values[1])},
          ${sqlEscape(values[2])},
          ${sqlEscape(values[3])},
          ${sqlEscape(values[4])},
          ${sqlEscape(values[5])},
          ${sqlEscape(values[6])},
          ${sqlEscape(values[7])},
          ${sqlEscape(values[8])},
          ${sqlEscape(values[9])},
          ${sqlEscape(values[10])},
          ${sqlEscape(values[11])},
          ${sqlEscape(values[12])},
          ${sqlEscape(values[13])}
        );`
        sql.push(insert)
      }
    }
  }
  
  sql.push('')
  sql.push('COMMIT;')
  
  fs.writeFileSync(OUTPUT, sql.join('\n'))
  console.log(`Created ${OUTPUT} with ${lines.length - 1} records`)
}

function parseCsvLine(line) {
  const values = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++ // skip next quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }
  
  values.push(current)
  return values
}

function sqlEscape(str) {
  if (!str) return 'NULL'
  return "'" + str.replace(/'/g, "''") + "'"
}

csvToSql()
