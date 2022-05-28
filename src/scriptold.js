import './style.css'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import {Raycaster} from "three"
import * as noisejs from "noisejs"


const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.y = 10;
const scene = new THREE.Scene();

const controls = new PointerLockControls( camera, document.body );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const grass = new THREE.TextureLoader().load( 'https://raw.githubusercontent.com/Isaiah08-D/namelater/main/textures/blocks/grass.png' );


const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({map:grass});


const game = document.getElementById('game');

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let SPEED = 1
let JUMP = 3



let chunks = {}
let blockchunkConversion = {}
let blocklist = []
console.log('test')

for (let i = 1; i == 10; i += 1) {
  for (let f = 1; f == 10; f += 1) {
    chunks[Date.now()] = [[[], [], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], [], []], [], [[], [], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], [], []]]
    for (let x=i*10; x==i*10+10; x += 1) {
      console.log(x)
    }
  
  }
}


function init() {

  camera.position.y = 2


  var noise = new noisejs.Noise(Math.random());


    for (let x=0; x < 201; x += 10) {
      for (let z=0; z<201; z+=10) {
        //const chunk = getChunk(x, z)
        const cube = new THREE.Mesh(geometry, material)
        cube.position.x = x
        cube.position.z = z
        cube.position.y = noise.perlin2(x/100, z/100) * 100;
        cube.scale.set(10,10,10);
        blocklist.push(cube);
        scene.add( cube );
      }
    };
 




  const test = new THREE.Mesh( geometry, material );
  test.position.x = 200
  test.scale.set(10,10,10)
  scene.add(test)

  game.addEventListener( 'click', function () {
    controls.lock();
  } );

  controls.addEventListener( 'lock', function () {

  } );

  controls.addEventListener( 'unlock', function () {

  } );

  scene.add( controls.getObject() );


  const onKeyDown = function ( event ) {

    switch ( event.code ) {

      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;

      case 'Space':
        if ( canJump === true ) velocity.y += 350;
        canJump = false;
        break;

    }

  };
  const onKeyUp = function ( event ) {

    switch ( event.code ) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;

    }

  };

  document.addEventListener( 'keydown', onKeyDown );
  document.addEventListener( 'keyup', onKeyUp );

};



function animate() {
  requestAnimationFrame( animate );
  const time = performance.now()
  if ( controls.isLocked === true ) {

    raycaster.ray.origin.copy( controls.getObject().position );
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects( blocklist, false );

    const onObject = intersections.length > 0;

    const delta = ( time - prevTime ) / 1000;

    velocity.x -= velocity.x * 5.0 * delta;
    velocity.z -= velocity.z * 5.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveRight ) - Number( moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions

    if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

    if ( onObject === true ) {

      velocity.y = Math.max( 0, velocity.y );
      canJump = true;

    }

    controls.moveRight( - velocity.x * delta );
    controls.moveForward( - velocity.z * delta );

    controls.getObject().position.y += ( velocity.y * delta ); // new behavior

    if ( controls.getObject().position.y < 10 ) {

      velocity.y = 0;
      controls.getObject().position.y = 10;

      canJump = true;

    }

  }

  prevTime = time;

  renderer.render( scene, camera );
};

init();
animate();
