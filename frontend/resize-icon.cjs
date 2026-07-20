const sharp = require('sharp');

sharp('resources/icon.png')
  .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
  .toFile('resources/icon-square.png')
  .then(() => console.log('Listo'));