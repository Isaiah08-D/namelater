import './style.css'
import * as THREE from 'three'
import * as math from "mathjs"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

function getChunk(x,z) {
  
}
const chunks = {}

for (let i = 1; i < 10; i += 2) {
  for (let f = 1; f < 10; f += 2) {
    chunks[stringify(i)+"|"+stringify(f)+"|"+stringify(f)] = [[[], [], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], [], []], [], [[], [], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], [], []]]
  }
}


function init() {
  for (let x=0; x < 101; x++) {
    for (let z=0; z<101; z++) {
      const chunk = getChunk(x, z)
      const cube = new THREE.Mesh( geometry, material );
      cube.position.x = x
      cube.position.z = z
      chunks[stringify(x)+"|"+stringify(z)][x-(x-)].push(cube)
    }
  }
}


camera.position.z = 5;

function animate() {
  requestAnimationFrame( animate );

  document.addEventListener("keydown", function(e) {
    if (e.key == 'w'){
      camera.position.z += 0.001
    }
    if (e.key == 's') {
      camera.position.z -= 0.001
    }
    if (e.key == 'a'){
      camera.position.x += 0.001
    }
    if (e.key == 'd') {
      camera.position.x -= 0.001
    }
  })
  
  renderer.render( scene, camera );
};

init();
animate();
