const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const createCollage = require('./functions/createCollage');
const saveCollage = require('./functions/saveImage');
const createPolaroid = require('./functions/createPolaroid');
const createInstagram = require('./functions/createInstagram');
const printImage = require('./functions/print');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Configuración de multer para gestionar la carga de imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para recibir las fotos desde el frontend
app.post('/api/collage', upload.array('photos', 3), async (req, res) => {
  try {
    // Obtener las fotos desde el cuerpo de la solicitud
    const photos = req.files;

    if (photos.length === 0) {
      return res.status(400).json({ error: 'No se han recibido fotos' });
    }

    const collage = await createCollage(photos);

    // Guardar el collage en el servidor (puedes ajustar esto según tus necesidades)
    const collagePath = path.join(__dirname, 'collages', `collage_${Date.now()}.png`);
    await saveCollage(collage, collagePath);
    //printImage(collagePath);

    res.json({ });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar las fotos' });
  }
});

app.post('/api/polaroid', upload.array('photos', 3), async (req, res) => {
  try {
    // Obtener las fotos desde el cuerpo de la solicitud
    const photos = req.files;

    if (photos.length === 0) {
      return res.status(400).json({ error: 'No se han recibido fotos' });
    }

    const collage = await createPolaroid(photos);

    // Guardar el collage en el servidor (puedes ajustar esto según tus necesidades)
    const collagePath = path.join(__dirname, 'polaroid', `polaroid_${Date.now()}.png`);
    await saveCollage(collage, collagePath);
    //printImage(collagePath);

    res.json({ });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar las fotos' });
  }
});

app.post('/api/instagram', upload.array('photos', 3), async (req, res) => {
  try {
    // Obtener las fotos desde el cuerpo de la solicitud
    const photos = req.files;

    if (photos.length === 0) {
      return res.status(400).json({ error: 'No se han recibido fotos' });
    }

    const collage = await createInstagram(photos);

    // Guardar el collage en el servidor (puedes ajustar esto según tus necesidades)
    const collagePath = path.join(__dirname, 'instagram', `instagram_${Date.now()}.png`);
    await saveCollage(collage, collagePath);
    //printImage(collagePath);

    res.json({ });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar las fotos' });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend en http://localhost:${port}`);
});
