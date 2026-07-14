import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export function getDataFilePath(fileName) {
  return path.join(dataDir, `${fileName}.json`);
}

export function readJsonFile(fileName, fallback = []) {
  const filePath = getDataFilePath(fileName);

  if (!fs.existsSync(filePath)) {
    writeJsonFile(fileName, fallback);
    return fallback;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Failed to read ${fileName}.json`, error);
    return fallback;
  }
}

export function writeJsonFile(fileName, data) {
  const filePath = getDataFilePath(fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return filePath;
}
