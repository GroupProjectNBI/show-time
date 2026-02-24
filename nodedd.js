import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'public', 'images', 'posters');

async function processPosters() {
  try {
    const files = fs.readdirSync(dir);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f) && !f.startsWith('temp_'));

    for (const file of imageFiles) {
      const inputPath = path.join(dir, file);
      const fileName = path.parse(file).name;
      const tempPath = path.join(dir, `temp_${fileName}_${Date.now()}.webp`);
      const finalPath = path.join(dir, `${fileName}.webp`);

      try {
        // Vi läser in filen i minnet först (.toBuffer) för att släppa låset på originalet direkt
        const imageBuffer = await fs.promises.readFile(inputPath);

        // await sharp(imageBuffer)
        //   .resize(800, 1200, { fit: 'cover' })
        //   .webp({ quality: 80, effort: 6 })
        //   .toFile(tempPath);
        await sharp(imageBuffer)
          .resize(1000, 1500, {
            fit: 'cover', // Ändra från 'cover' till 'contain' för att slippa klippning!
            background: { r: 18, g: 18, b: 18, alpha: 1 } // En mörkgrå/svart bakgrund som ser bra ut i mobilen
          })
          .webp({
            quality: 82, // Bra balans mellan skärpa och filstorlek
            effort: 6    // Max kompression (tar längre tid att köra skriptet, men filen blir mindre)
          })
          .toFile(tempPath);

        // Nu när Sharp jobbat färdigt med bufferten (inte filen direkt), 
        // kan vi säkert ta bort originalet.
        if (fs.existsSync(inputPath)) {
          fs.unlinkSync(inputPath);
        }

        // Flytta temp till originalnamnet
        fs.renameSync(tempPath, finalPath);
        console.log(`✅ Fixad: ${fileName}.webp`);

      } catch (err) {
        console.error(`❌ Fel vid ${file}:`, err.message);
      }
    }
    console.log('--- Klart! ---');
  } catch (err) {
    console.error("Fel:", err);
  }
}

processPosters();