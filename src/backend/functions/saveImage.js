const path = require('path');
const fs = require('fs');
  // Función para guardar el collage en el servidor
  async function saveCollage(collage, filePath) {
    // Crea el directorio 'collages' si no existe
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  
    // Guarda el collage en el archivo especificado
    fs.writeFileSync(filePath, collage);
  }

  module.exports = saveCollage;