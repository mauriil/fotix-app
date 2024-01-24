const sharp = require("sharp");

// Función para crear el collage con marco
const createCollage = async (photos) => {
    try {
      // Obtener las dimensiones del collage final
      const collageWidth = 800;
      const collageHeight = 2400;
  
      // Redimensionar todas las fotos al mismo tamaño
      const resizedPhotos = await Promise.all(
        photos.map(async (photo) => {
          try {
            return await sharp(photo.buffer).resize({ width: collageWidth - 45, height: parseInt(collageHeight / 4 ) }).toBuffer();
          } catch (resizeError) {
            console.error('Error al redimensionar una imagen:', resizeError);
            throw resizeError;
          }
        })
      );
  
      const bg = './background.png';
      const bgResized = await sharp(bg).resize({ width: collageWidth, height: collageHeight }).toBuffer();
  
      // Combinar las fotos en el collage
      const collage = await sharp({
        create: {
          width: collageWidth,
          height: collageHeight,
          channels: 4,
          background: {
            r: 255,
            g: 255,
            b: 255,
            // alpha: 0, // transparency
          },
        },
      })
        .composite([
          { input: resizedPhotos[0], gravity: 'north', top: 510, left: 20 },
          { input: resizedPhotos[1], gravity: 'center', top: 1140, left: 20 }, // 1665
          { input: resizedPhotos[2], gravity: 'south', top: 1770, left: 20 }, // 2275
          { input: bgResized, gravity: 'center', blend: 'over'},
        ])
        .png()
        .toBuffer();
  
      return collage;
    } catch (error) {
      console.error('Error al crear el collage:', error);
      throw error;
    }
  };
  
module.exports = createCollage;