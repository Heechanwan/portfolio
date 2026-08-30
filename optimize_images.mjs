import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = 'C:\\Users\\Heechanwan\\Desktop\\Portfolio\\public\\images';

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const e of entries) {
    const fullPath = path.join(dir, e.name);
    if (e.isDirectory()) {
      await processDirectory(fullPath);
    } else if (/\.(png|jpe?g)$/i.test(e.name)) {
      const stat = fs.statSync(fullPath);
      // If image is larger than 350KB or wider than 1400px, compress and optimize
      if (stat.size > 300 * 1024) {
        try {
          const image = sharp(fullPath);
          const metadata = await image.metadata();

          let pipeline = sharp(fullPath);
          if (metadata.width && metadata.width > 1600) {
            pipeline = pipeline.resize({ width: 1600, withoutEnlargement: true });
          }

          if (e.name.endsWith('.png')) {
            await pipeline.png({ quality: 85, compressionLevel: 8 }).toFile(fullPath + '.tmp');
          } else {
            await pipeline.jpeg({ quality: 85, mozjpeg: true }).toFile(fullPath + '.tmp');
          }

          fs.unlinkSync(fullPath);
          fs.renameSync(fullPath + '.tmp', fullPath);
          const newStat = fs.statSync(fullPath);
          console.log(`[Optimized] ${e.name}: ${(stat.size / 1024 / 1024).toFixed(2)}MB -> ${(newStat.size / 1024).toFixed(0)}KB`);
        } catch (err) {
          console.error(`Failed to optimize ${e.name}:`, err.message);
        }
      }
    }
  }
}

async function run() {
  console.log('Starting image compression & GPU memory optimization...');
  await processDirectory(PUBLIC_DIR);
  console.log('All images optimized!');
}

run();
