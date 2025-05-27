import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data.json');
const raw = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(raw);

export let thoughts = data.map((item) => ({ ...item }));
