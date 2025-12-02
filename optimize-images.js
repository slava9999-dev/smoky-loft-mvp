import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join } from 'path';

const inputDir = './public/images';
const outputDir = './public/images';

async function optimizeImages() {
  const files = await readdir(inputDir);
  
  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.png')) {
      const inputPath = join(inputDir, file);
      const outputPath = join(outputDir, file.replace(/\.(jpg|png)$/, '.webp'));
      
      await sharp(inputPath)
        .resize(800, 600, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      console.log(`✓ Optimized: ${file} -> ${outputPath}`);
    }
  }
  
  console.log('✓ All images optimized!');
}

optimizeImages().catch(console.error);
