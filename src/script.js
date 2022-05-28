import './style.css'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import {Raycaster} from "three"
import * as noisejs from "noisejs"


var scene = new THREE.Scene();
scene.background = new THREE.Color(0x00ffff);
scene.fog = new THREE.Fog(0x00ffff, 10, 650);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var JUMPHEIGHT = -3
var SPEED = 1.5;
var ySpeed = 0;
var GRAVITY = 0.2;
var autoJump = false;


function Block(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.display = function() {
    var blockBox = new THREE.BoxBufferGeometry(5, 5, 5) // width, heigh, depth
    var blockMesh = new THREE.MeshBasicMaterial({color: 0x00ff00})
    var block = new THREE.Mesh(blockBox, blockMesh);
    scene.add(block);
    block.position.x = this.x;
    block.position.y = this.y-10;
    block.position.z = this.z;

    var edges = new THREE.EdgesGeometry(blockBox)
    var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x000000}));
    scene.add(line)
    line.position.x = this.x;
    line.position.y = this.y-10;
    line.position.z = this.z;
  }

}

var blocks = [];
var xoff = 0;
var zoff = 0;
var inc = 0.01;
var amplitude = 200;

var noise = new noisejs.Noise(Math.random());

for (var x=0; x<20; x++) { 
  xoff = 0
  for (var z=0; z<20; z++) {
    var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 5) * 5;
    blocks.push(new Block(x*5, v, z*5))
    xoff = xoff+inc
  }
  zoff = zoff+inc
}

for (var i = 0; i < blocks.length; i++) {
  blocks[i].display();
}

var controls = new PointerLockControls(camera, document.body);
document.body.addEventListener("click", function(){
  controls.lock();
});
controls.addEventListener("lock", function(){

})
controls.addEventListener("unlock", function(){

})

var keys = []
var canJump = true
document.addEventListener("keydown", function(e) { 
  keys.push(e.key)
  if (e.key == " " && canJump) {
    ySpeed = JUMPHEIGHT
    canJump = false
  }

})
document.addEventListener("keyup", function(e) {
  var newArr = [];
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] != e.key){
      newArr.push(keys[i]);
    }
  }
  keys = newArr;
})

function update(){
  if(keys.includes("w")){
    controls.moveForward(SPEED);
    if(autoJump == false){
      for(var i = 0; i < blocks.length; i++){
        if(camera.position.x <= blocks[i].x + 2.5 && camera.position.x >= blocks[i].x - 2.5 && camera.position.z <= blocks[i].z + 2.5 && camera.position.z >= blocks[i].z - 2.5){
          if(camera.position.y == blocks[i].y - 2.5){
            controls.moveForward(-1 * SPEED);
          }
        }
      }
    }
  }
  if(keys.includes("a")){
    controls.moveRight(-1 * SPEED);
    if(autoJump == false){
      for(var i = 0; i < blocks.length; i++){
        if(camera.position.x <= blocks[i].x + 2.5 && camera.position.x >= blocks[i].x - 2.5 && camera.position.z <= blocks[i].z + 2.5 && camera.position.z >= blocks[i].z - 2.5){
          if(camera.position.y == blocks[i].y - 2.5){
            controls.moveRight(SPEED);
          }
        }
      }
    }
  }
  if(keys.includes("s")){
    controls.moveForward(-1 * SPEED);
    if(autoJump == false){
      for(var i = 0; i < blocks.length; i++){
        if(camera.position.x <= blocks[i].x + 2.5 && camera.position.x >= blocks[i].x - 2.5 && camera.position.z <= blocks[i].z + 2.5 && camera.position.z >= blocks[i].z - 2.5){
          if(camera.position.y == blocks[i].y - 2.5){
            controls.moveForward(SPEED);
          }
        }
      }
    }
  }
  if(keys.includes("d")){
    controls.moveRight(SPEED);
    if(autoJump == false){
      for(var i = 0; i < blocks.length; i++){
        if(camera.position.x <= blocks[i].x + 2.5 && camera.position.x >= blocks[i].x - 2.5 && camera.position.z <= blocks[i].z + 2.5 && camera.position.z >= blocks[i].z - 2.5){
          if(camera.position.y == blocks[i].y - 2.5){
            controls.moveRight(-1 * SPEED);
          }
        }
      }
    }
  }

  camera.position.y = camera.position.y - ySpeed;
  ySpeed = ySpeed + GRAVITY;

  for (var i = 0; i < blocks.length; i++) {
			if(camera.position.x <= blocks[i].x + 2.5 && camera.position.x >= blocks[i].x - 2.5 && camera.position.z <= blocks[i].z + 2.5 && camera.position.z >= blocks[i].z - 2.5){
        if(camera.position.y <= blocks[i].y + 2.5 && camera.position.y >= blocks[i].y - 2.5){
          camera.position.y = blocks[i].y + 2.5;
          ySpeed = 0;
          canJump = true;
          break;
			  }
    }
  }

}

function render(){
  renderer.render(scene, camera);
}

function GameLoop(){
  requestAnimationFrame(GameLoop);
  update();
  render();
}

GameLoop();
