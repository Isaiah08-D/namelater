import './style.css'
import * as THREE from '../three.js'
import * as noisejs from "noisejs"


var scene = new THREE.Scene();
scene.background = new THREE.Color(0x00ffff);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


THREE.PointerLockControls = function ( camera, domElement ) {

	if ( domElement === undefined ) {

		console.warn( 'THREE.PointerLockControls: The second parameter "domElement" is now mandatory.' );
		domElement = document.body;

	}

	this.domElement = domElement;
	this.isLocked = false;

	//
	// internals
	//

	var scope = this;

	var changeEvent = { type: 'change' };
	var lockEvent = { type: 'lock' };
	var unlockEvent = { type: 'unlock' };

	var euler = new THREE.Euler( 0, 0, 0, 'YXZ' );

	var PI_2 = Math.PI / 2;

	var vec = new THREE.Vector3();

	function onMouseMove( event ) {

		if ( scope.isLocked === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		euler.setFromQuaternion( camera.quaternion );

		euler.y -= movementX * 0.002;
		euler.x -= movementY * 0.002;

		euler.x = Math.max( - PI_2, Math.min( PI_2, euler.x ) );

		camera.quaternion.setFromEuler( euler );

		scope.dispatchEvent( changeEvent );

	}

	function onPointerlockChange() {

		if ( document.pointerLockElement === scope.domElement ) {

			scope.dispatchEvent( lockEvent );

			scope.isLocked = true;

		} else {

			scope.dispatchEvent( unlockEvent );

			scope.isLocked = false;

		}

	}

	function onPointerlockError() {

		console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );

	}

	this.connect = function () {

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'pointerlockchange', onPointerlockChange, false );
		document.addEventListener( 'pointerlockerror', onPointerlockError, false );

	};

	this.disconnect = function () {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'pointerlockchange', onPointerlockChange, false );
		document.removeEventListener( 'pointerlockerror', onPointerlockError, false );

	};

	this.dispose = function () {

		this.disconnect();

	};

	this.getObject = function () { // retaining this method for backward compatibility

		return camera;

	};

	this.getDirection = function () {

		var direction = new THREE.Vector3( 0, 0, - 1 );

		return function ( v ) {

			return vec.copy( direction ).applyQuaternion( camera.quaternion );

		};

	}();

	this.moveForward = function ( distance ) {

		// move forward parallel to the xz-plane
		// assumes camera.up is y-up

		vec.setFromMatrixColumn( camera.matrix, 0 );

		vec.crossVectors( camera.up, vec );

		camera.position.addScaledVector( vec, distance );

	};

	this.moveRight = function ( distance ) {

		vec.setFromMatrixColumn( camera.matrix, 0 );

		camera.position.addScaledVector( vec, distance );

	};

	this.lock = function () {

		this.domElement.requestPointerLock();

	};

	this.unlock = function () {

		document.exitPointerLock();

	};

	this.connect();

};

THREE.PointerLockControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.PointerLockControls.prototype.constructor = THREE.PointerLockControls;



var autoJump = true;
function toggleAutoJump() {
  if (autoJump == true) {
    autoJump = false;
    document.getElementById("autojumpbutton").innerHTML = "<h2>AutoJump : Off</h2>";
  } else {
    autoJump = true;
    document.getElementById("autojumpbutton").innerHTML = "<h2>AutoJump : On</h2>";
  }
}

var loader = new THREE.TextureLoader();
var materialArray = [

  new THREE.MeshBasicMaterial({ map: loader.load("https://raw.githubusercontent.com/Isaiah08-D/namelater/main/textures/blocks/grass-side.png") }),
  new THREE.MeshBasicMaterial({ map: loader.load("https://raw.githubusercontent.com/Isaiah08-D/namelater/main/textures/blocks/grass-side.png") }),
  new THREE.MeshBasicMaterial({ map: loader.load("https://raw.githubusercontent.com/Isaiah08-D/namelater/main/textures/blocks/grass-top.png") }),
  new THREE.MeshBasicMaterial({ map: loader.load("https://raw.githubusercontent.com/Isaiah08-D/namelater/main/textures/blocks/dirt.png") }),
  new THREE.MeshBasicMaterial({ map: loader.load("https://raw.githubusercontent.com/Isaiah08-D/namelater/main/textures/blocks/grass-side.png") }),
  new THREE.MeshBasicMaterial({ map: loader.load("https://raw.githubusercontent.com/Isaiah08-D/namelater/main/textures/blocks/grass-side.png") }),

];

function Block(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.display = function () {
    var blockBox = new THREE.BoxBufferGeometry(5, 5, 5); // w, h, d
    // var blockMaterial = new THREE.MeshBasicMaterial({color : 0x00ff00});
    var block = new THREE.Mesh(blockBox, materialArray);
    scene.add(block);
    block.position.x = this.x;
    block.position.y = this.y - 10;
    block.position.z = this.z;

    var edges = new THREE.EdgesGeometry(blockBox);
    var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 4 }));
    scene.add(line);
    line.position.x = this.x;
    line.position.y = this.y - 10;
    line.position.z = this.z;
  }
}

// var axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

/*
var blocks = [];
var xoff = 0;
var zoff = 0;
var inc = 0.05;
var amplitude = 50;
for(var x = 0; x < 20; x++){
  xoff = 0;
  for(var z = 0; z < 20; z++){
    var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 5) * 5;
    blocks.push(new Block(x * 5, v, z * 5));
    xoff = xoff + inc;
  }
  zoff = zoff + inc;
}
*/

var chunks = [];
var xoff = 0;
var zoff = 0;
var inc = 0.05;
var amplitude = 30 + (Math.random() * 70);
var renderDistance = 3;
var chunkSize = 10;
const noise = new noisejs.Noise();
camera.position.x = renderDistance * chunkSize / 2 * 5;
camera.position.z = renderDistance * chunkSize / 2 * 5;
camera.position.y = 50;
for (var i = 0; i < renderDistance; i++) {
  var chunk = [];
  for (j = 0; j < renderDistance; j++) {
    for (var x = i * chunkSize; x < (i * chunkSize) + chunkSize; x++) {
      for (var z = j * chunkSize; z < (j * chunkSize) + chunkSize; z++) {
        xoff = inc * x;
        zoff = inc * z;
        var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 5) * 5;
        chunk.push(new Block(x * 5, v, z * 5));
      }
    }
  }
  chunks.push(chunk);
}

for (var i = 0; i < chunks.length; i++) {
  for (var j = 0; j < chunks[i].length; j++) {
    chunks[i][j].display();
  }
}

var keys = [];
var canJump = true;
document.addEventListener("keydown", function (e) {
  keys.push(e.key);
  if (e.key == " " && canJump == true) {
    ySpeed = -1.3;
    canJump = false;
  }
});
document.addEventListener("keyup", function (e) {
  var newArr = [];
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] != e.key) {
      newArr.push(keys[i]);
    }
  }
  keys = newArr;
});

var controls = new THREE.PointerLockControls(camera, document.body);
document.body.addEventListener("click", function () {
  controls.lock();
});
controls.addEventListener("lock", function () {

});
controls.addEventListener("unlock", function () {

});

var movingSpeed = 0.7;
var ySpeed = 0;
var acc = 0.08;
function update() {
  if (keys.includes("w")) {
    controls.moveForward(movingSpeed);
    if (autoJump == false) {
      for (var i = 0; i < chunks.length; i++) {
        for (var j = 0; j < chunks[i].length; j++) {
          if (camera.position.x <= chunks[i][j].x + 2.5 && camera.position.x >= chunks[i][j].x - 2.5 && camera.position.z <= chunks[i][j].z + 2.5 && camera.position.z >= chunks[i][j].z - 2.5) {
            if (camera.position.y == chunks[i][j].y - 2.5) {
              controls.moveForward(-1 * movingSpeed);
            }
          }
        }
      }
    }
  }
  if (keys.includes("a")) {
    controls.moveRight(-1 * movingSpeed);
    if (autoJump == false) {
      for (var i = 0; i < chunks.length; i++) {
        for (var j = 0; j < chunks[i].length; j++) {
          if (camera.position.x <= chunks[i][j].x + 2.5 && camera.position.x >= chunks[i][j].x - 2.5 && camera.position.z <= chunks[i][j].z + 2.5 && camera.position.z >= chunks[i][j].z - 2.5) {
            if (camera.position.y == chunks[i][j].y - 2.5) {
              controls.moveRight(movingSpeed);
            }
          }
        }
      }
    }
  }
  if (keys.includes("s")) {
    controls.moveForward(-1 * movingSpeed);
    if (autoJump == false) {
      for (var i = 0; i < chunks.length; i++) {
        for (var j = 0; j < chunks[i].length; j++) {
          if (camera.position.x <= chunks[i][j].x + 2.5 && camera.position.x >= chunks[i][j].x - 2.5 && camera.position.z <= chunks[i][j].z + 2.5 && camera.position.z >= chunks[i][j].z - 2.5) {
            if (camera.position.y == chunks[i][j].y - 2.5) {
              controls.moveForward(movingSpeed);
            }
          }
        }
      }
    }
  }
  if (keys.includes("d")) {
    controls.moveRight(movingSpeed);
    if (autoJump == false) {
      for (var i = 0; i < chunks.length; i++) {
        for (var j = 0; j < chunks[i].length; j++) {
          if (camera.position.x <= chunks[i][j].x + 2.5 && camera.position.x >= chunks[i][j].x - 2.5 && camera.position.z <= chunks[i][j].z + 2.5 && camera.position.z >= chunks[i][j].z - 2.5) {
            if (camera.position.y == chunks[i][j].y - 2.5) {
              controls.moveRight(-1 * movingSpeed);
            }
          }
        }
      }
    }
  }

  camera.position.y = camera.position.y - ySpeed;
  ySpeed = ySpeed + acc;

  for (var i = 0; i < chunks.length; i++) {
    for (var j = 0; j < chunks[i].length; j++) {
      if (camera.position.x <= chunks[i][j].x + 2.5 && camera.position.x >= chunks[i][j].x - 2.5 && camera.position.z <= chunks[i][j].z + 2.5 && camera.position.z >= chunks[i][j].z - 2.5) {
        if (camera.position.y <= chunks[i][j].y + 2.5 && camera.position.y >= chunks[i][j].y - 2.5) {
          camera.position.y = chunks[i][j].y + 2.5;
          ySpeed = 0;
          canJump = true;
          break;
        }
      }
    }
  }
}

// Resize Window
window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

function render() {
  renderer.render(scene, camera);
}

function GameLoop() {
  requestAnimationFrame(GameLoop);
  update();
  render();
}

GameLoop();