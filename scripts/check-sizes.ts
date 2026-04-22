import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'public', 'data');
for (const file of fs.readdirSync(dir)) {
  const stats = fs.statSync(path.join(dir, file));
  console.log(`${file}: ${stats.size} bytes`);
}
