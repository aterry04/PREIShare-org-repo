// Small lint for pull-request CI. No ESLint install.
// Fails if browser or route code names the service-role key.
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const forbidden = ['VITE_SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_ROLE_KEY']
const roots = [
  'src/components',
  'src/routes',
  'src/lib/supabase.client.ts',
  'src/lib/supabase/client.ts',
]

async function filesIn(entry) {
  const full = path.resolve(entry)
  let stat
  try {
    stat = await readdir(full, { withFileTypes: true })
  } catch (error) {
    if (error && error.code === 'ENOTDIR') {
      return [full]
    }
    if (error && error.code === 'ENOENT') {
      return []
    }
    throw error
  }

  const found = []
  for (const item of stat) {
    const child = path.join(full, item.name)
    if (item.isDirectory()) {
      found.push(...(await filesIn(child)))
    } else if (item.isFile() && /\.(ts|tsx)$/.test(item.name)) {
      found.push(child)
    }
  }
  return found
}

const hits = []
for (const root of roots) {
  for (const file of await filesIn(root)) {
    const text = await readFile(file, 'utf8')
    for (const name of forbidden) {
      if (text.includes(name)) {
        hits.push(`${path.relative(process.cwd(), file)} contains ${name}`)
      }
    }
  }
}

if (hits.length > 0) {
  console.error(hits.join('\n'))
  process.exit(1)
}

console.log('lint: client and route files do not name the service-role key')
