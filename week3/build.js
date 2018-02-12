global.THREE = require('three');
require('three/examples/js/exporters/OBJExporter');
require('three/examples/js/utils/GeometryUtils');

const font_json = require('three/examples/fonts/helvetiker_regular.typeface')

const fs = require('fs');

const letters = require('./parsed_headlines_in_words');

// Generate your ThreeJS geometry
const geometry = generate();

// Export the Geometry to a file if specified, otherwise stdout
exportGeometry(geometry);

function generate () {

  //General geomtery object
  const geometry = new THREE.Geometry();

  //Set a counter so we don't have to build everything
  let letterCounter = 0;

  //Create a font from the loaded JSON font
  let font = new THREE.Font(font_json);

  let totalNum = 50;

  for(let i = 0; i < letters['letters'].length; i++){
    letterCounter++;
    if(letterCounter > totalNum) break;
    console.log(letters['letters'][i]);
    var chunk = new THREE.TextGeometry(letters['letters'][i], {
      font: font,
      size: 80,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1,
      bevelSegments: 2
    });

    chunk.translate(Math.cos(i + 50) + 5, 0, Math.sin(i + 50) + 5);
    chunk.rotateX(Math.PI / 2 + -i * 0.15);

    //Create an object3D
    const object = new THREE.Object3D();

    object.position.set(Math.cos(i + 5), 0, Math.sin(i + 5));
    object.rotation.y = -i;
    object.updateMatrix();

    geometry.merge(chunk, object.matrix);

    // clean it up after
    chunk.dispose();
  }

  geometry.computeBoundingBox();
  var offset = geometry.boundingBox.getCenter().negate();
  geometry.translate(offset.x, 0, offset.z);

  return geometry;
}

function exportGeometry (geometry) {

  const object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
  const scene = new THREE.Scene();
  scene.add(object);
  object.updateMatrixWorld(true);
  const exporter = new THREE.OBJExporter();
  const result = exporter.parse(object);

  // write to file
  const file = './models/test.obj'
  try {
    console.error('Writing to file', file);
    fs.writeFileSync(file, result);
  } catch (err) {
    console.error('Error:', err.message);
  }

  scene.remove(object);

}
