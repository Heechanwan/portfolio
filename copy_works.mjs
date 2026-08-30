import fs from 'fs';
import path from 'path';

const SRC = 'C:\\Users\\Heechanwan\\Desktop\\Works';
const DST = 'C:\\Users\\Heechanwan\\Desktop\\Portfolio\\public\\images\\works';
const PUBLIC_ROOT = 'C:\\Users\\Heechanwan\\Desktop\\Portfolio\\public\\images';

if (!fs.existsSync(DST)) fs.mkdirSync(DST, { recursive: true });

// Copy photos
fs.copyFileSync(path.join(SRC, 'Photo.jpg'), path.join(PUBLIC_ROOT, 'photo_bw.jpg'));
fs.copyFileSync(path.join(SRC, 'Photo_colored.jpg'), path.join(PUBLIC_ROOT, 'photo_colored.jpg'));
console.log('Copied hero portrait photos!');

function copyRecursive(srcDir, dstDir) {
  if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const e of entries) {
    const sPath = path.join(srcDir, e.name);
    // Sanitize filename to web safe
    const cleanName = e.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const dPath = path.join(dstDir, cleanName);

    if (e.isDirectory()) {
      copyRecursive(sPath, dPath);
    } else if (e.isFile() && (e.name.endsWith('.jpg') || e.name.endsWith('.png') || e.name.endsWith('.jpeg') || e.name.endsWith('.webp'))) {
      fs.copyFileSync(sPath, dPath);
      console.log(`Copied: ${path.relative(DST, dPath)}`);
    }
  }
}

copyRecursive(SRC, DST);
console.log('All project works copied successfully!');
