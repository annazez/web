import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../../');

const getJsonContent = (collection, id) => {
  const filePath = path.join(projectRoot, 'src/content', collection, `${id}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return null;
};

export const getEntry = async (collection, id) => {
  const data = getJsonContent(collection, id);
  if (data) {
    return { data };
  }
  return null;
};

export const getCollection = async collection => {
  const collectionPath = path.join(projectRoot, 'src/content', collection);
  if (!fs.existsSync(collectionPath)) return [];

  const files = [];
  const scan = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.name.endsWith('.json')) {
        const id = path.relative(collectionPath, fullPath).replace(/\.json$/, '');
        files.push({
          id,
          data: JSON.parse(fs.readFileSync(fullPath, 'utf8')),
        });
      }
    }
  };

  scan(collectionPath);
  return files;
};
