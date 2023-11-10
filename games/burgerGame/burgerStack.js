let isGamePlaying = false;

let orbitControls;
let renderer;
let scene;
let camera;
let raycaster;
let pointer;

const offsetX = 1700;
let nowIdx = 0;
let currentDirection = false;
let platePosition;
let positionOffset = 60;

const totalGroup = new THREE.Group();
const plateGroup = new THREE.Group();
const bottomBreadGroup = new THREE.Group();
const topBreadGroup = new THREE.Group();
const pattyGroup = new THREE.Group();
const cheeseGroup = new THREE.Group();
const lettuceGroup = new THREE.Group();
const tomatoGroup = new THREE.Group();
const tomatoGroup2 = new THREE.Group();
const onionGroup = new THREE.Group();
const onionGroup2 = new THREE.Group();
const onionGroup3 = new THREE.Group();
const eggGroup = new THREE.Group();

let plate1;
let plate2;
let bottomBread1;
let bottomBread2;
let topBread1;
let topBread2;
let topBread3;
let patty1;
let patty2;
let patty3;
let cheese1;
let cheese2;
let lettuce1;
let lettuce2;
let tomato1;
let tomato2;
let tomato3;
let tomato4;
let onion1;
let onion2;
let onion3;
let egg1;
let egg2;
let egg3;


const names = {
  plate1 : 'Plate002_initialShadingGroup_0',
  plate2 : 'Plate004_Material012_0',
  bottomBread1 : 'pSphere2003_lambert1001_0',
  bottomBread2 : 'pSphere2004_Material012_0',
  topBread1 : 'Cylinder006_lambert1001_0',
  topBread2 : 'Cylinder006_Material013_0',
  topBread3 : 'Cylinder010_Material012_0',
  patty1 : 'Cube006_Material008_0',
  patty2 : 'Cube006_Material009_0',
  patty3 : 'Cube009_Material012_0',
  cheese1 : 'Cube005_Material005_0',
  cheese2 : 'Cube008_Material012_0',
  lettuce1 : 'Lettuce002_Mat10_0',
  lettuce2 : 'Lettuce003_Material012_0',
  tomato1 : 'Cylinder005_Material001_0',
  tomato2 : 'Cylinder005_Material002_0',
  tomato3 : 'Cylinder005_seeds001_0',
  tomato4 : 'Cylinder011_Material012_0',
  onion1 : 'Circle011_Material012_0',
  onion2 : 'Circle007_Material006_0',
  onion3 : 'Circle007_Material010_0',
  egg1 : 'Egg003_Mat6_0',
  egg2 : 'Egg003_Mat12_0',
  egg3 : 'Egg004_Material012_0'
}

const burgerList = [
  bottomBreadGroup, 
  pattyGroup, 
  cheeseGroup, 
  lettuceGroup, 
  tomatoGroup, 
  tomatoGroup2, 
  onionGroup, 
  onionGroup2, 
  onionGroup3, 
  eggGroup, 
  topBreadGroup
];


window.addEventListener('load', function () {
  init();
});

document.getElementById('start-btn').addEventListener('click', function () {
  document.getElementById('start').style.display = 'none';

  orbitControls.autoRotate = false;
  
  gsap.to(totalGroup.rotation, {y: Math.PI * 4 , duration: 2, ease: "power2.inOut"}).then(() => {
    // scene에 추가되어 있던 모든 요소들을 삭제
    if (scene.children.length > 0) {
      scene.remove.apply(scene, scene.children);
    }
    startGame();
  });

});

document.getElementById('home').addEventListener('click', function() {
  window.location.href = 'http://127.0.0.1:5500/basic.html';
});

document.getElementById('retry').addEventListener('click', function() {
  gameRestart();
});


function init() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1500);
  camera.position.y = 100;
  camera.position.z = 170;
  camera.position.x = 0;

  generateLight();

  // CONTROLS
  orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.minDistance = 15;
  orbitControls.maxPolarAngle = Math.PI;
  orbitControls.enablePan = false;
  orbitControls.autoRotate = true;
  orbitControls.autoRotateSpeed = 7;
  orbitControls.update();

  new THREE.GLTFLoader().load('../../data/games/burger/scene.gltf', function (gltf) {
    const model = gltf.scene;

    model.scale.set(0.1, 0.1, 0.1);
    model.traverse(object => {
      if (object.isMesh) {
        object.castShadow = true;
        switch (object.name) {
          case names.plate1:
            plate1 = object;
            break;
          case names.plate2:
            plate2 = object;
            break;
          case names.bottomBread1:
            bottomBread1 = object;
            break;
          case names.bottomBread2:
            bottomBread2 = object;
            break;
          case names.topBread1:
            topBread1 = object;
            break;
          case names.topBread2:
            topBread2 = object;
            break;
          case names.topBread3:
            topBread3 = object;
            break;
          case names.patty1:
            patty1 = object;
            break;
          case names.patty2:
            patty2 = object;
            break;
          case names.patty3:
            patty3 = object;
            break;
          case names.cheese1:
            cheese1 = object;
            break;
          case names.cheese2:
            cheese2 = object;
            break;
          case names.lettuce1:
            lettuce1 = object;
            break;
          case names.lettuce2:
            lettuce2 = object;
            break;
          case names.tomato1:
            tomato1 = object;
            break;
          case names.tomato2:
            tomato2 = object;
            break;
          case names.tomato3:
            tomato3 = object;
            break;
          case names.tomato4:
            tomato4 = object;
            break;
          case names.onion1:
            onion1 = object;
            break;
          case names.onion2:
            onion2 = object;
            break;
          case names.onion3:
            onion3 = object;
            break;
          case names.egg1:
            egg1 = object;
            break;
          case names.egg2:
            egg2 = object;
            break;
          case names.egg3:
            egg3 = object;
            break;
        }
      }
    });


    plateGroup.add(plate1, plate2);
    bottomBreadGroup.add(bottomBread1, bottomBread2);
    topBreadGroup.add(topBread1, topBread2, topBread3);
    pattyGroup.add(patty1, patty2, patty3);
    cheeseGroup.add(cheese1, cheese2);
    lettuceGroup.add(lettuce1, lettuce2);
    tomatoGroup.add(tomato1, tomato2, tomato3, tomato4);
    tomatoGroup2.copy(tomatoGroup);
    onionGroup.add(onion1, onion2, onion3);
    onionGroup2.copy(onionGroup);
    onionGroup3.copy(onionGroup);
    eggGroup.add(egg1, egg2, egg3);

    totalGroup.add(plateGroup, bottomBreadGroup, pattyGroup, cheeseGroup, lettuceGroup, tomatoGroup, tomatoGroup2, onionGroup, onionGroup2, onionGroup3, eggGroup, topBreadGroup);

    plateGroup.position.y = 0;
    bottomBreadGroup.position.y = 10;
    pattyGroup.position.y = 30;
    cheeseGroup.position.y = 40;
    lettuceGroup.position.y = 50;
    lettuceGroup.scale.set(4.0, 4.0, 4.0);
    tomatoGroup.position.x = -10;
    tomatoGroup.position.y = 60;
    tomatoGroup2.position.x = 20;
    tomatoGroup2.position.y = 65;
    onionGroup.scale.set(1.2, 1.2, 1.2);
    onionGroup2.scale.set(1.2, 1.2, 1.2);
    onionGroup3.scale.set(1.2, 1.2, 1.2);
    onionGroup.position.set(-20, 70, -10);
    onionGroup2.position.set(0, 73, 20);
    onionGroup3.position.set(20, 76, 0);
    eggGroup.position.y = 85;
    eggGroup.scale.set(5.0, 5.0, 5.0);
    topBreadGroup.position.y = 100;

    totalGroup.position.set(0, -100, 0);

    scene.add(totalGroup);

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    animate();
  });

  window.addEventListener("resize", handleResize);
  window.addEventListener("keydown", handleSpaceDown);
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  orbitControls.update();
}

function generateLight() {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 1, 1); // 조명의 위치 설정
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff); // 환경 조명
  scene.add(ambientLight);
}

function checkPosition() {
  if (Math.abs(burgerList[nowIdx].position.x - platePosition.x) +
    Math.abs(burgerList[nowIdx].position.z - platePosition.z) >= positionOffset) {
      return false;
  } else {
    return true;
  }
}

function handleSpaceDown(event) {
  if (event.key !== " ") return;

  if (isGamePlaying) {
    console.log("NOW" ,burgerList[nowIdx].position);
    if (checkPosition()) {
      if (nowIdx === burgerList.length - 1) {
        isGamePlaying = false;
        gameSuccess();
      } else {
        currentDirection = !currentDirection;
        nowIdx++;
        scene.add(burgerList[nowIdx]);
      }
    } else {
      console.log("게임오버");
      isGamePlaying = false;
      gameOver();
      return;
    }
  } else {
    console.log("게임중이 아닙니다.");
    return;
  }
}

function startGame() {
  isGamePlaying = true;
  camera.position.set(0, 15, 200);
  camera.rotateY(Math.PI / 2);
  
  console.log(camera.position);

  generateLight();

  // add plate (default)
  plateGroup.position.y -= 100;
  platePosition = plateGroup.position;
  console.log("PLATE" ,platePosition);
  scene.add(plateGroup);

  // set others
  bottomBreadGroup.position.set(-offsetX, -85, -900);
  pattyGroup.position.set(offsetX, -72, -900);
  cheeseGroup.position.set(-offsetX, -67, -900);
  lettuceGroup.position.set(offsetX, -64, -900);
  tomatoGroup.position.set(-offsetX, -58, -900);
  tomatoGroup2.position.set(offsetX, -55, -900);
  onionGroup.position.set(-offsetX, -53, -900);
  onionGroup2.position.set(offsetX, -50, -900);
  onionGroup3.position.set(-offsetX, -51, -900);
  eggGroup.position.set(offsetX, -45, -900);
  topBreadGroup.position.set(-offsetX, -33, -900);

  scene.add(bottomBreadGroup);
}

function animate() {
  if (isGamePlaying) {
    if (nowIdx === 20) {
      console.log("게임오버");
      isGamePlaying = false;
      gameOver();
    }

    burgerList[nowIdx].position.z += 2.7;
    if (currentDirection) {
      burgerList[nowIdx].position.x -= 5.1;
      if (burgerList[nowIdx].position.x <= -offsetX) {
        console.log("게임오버");
        isGamePlaying = false;
        gameOver();
      }
    } else {
      burgerList[nowIdx].position.x += 5.1;
      if (burgerList[nowIdx].position.x >= offsetX) {
        console.log("게임오버");
        isGamePlaying = false;
        gameOver();
      }
    }
  }

  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function gameRestart () {
  window.location.reload();
}

function gameSuccess () {
  console.log("Game success");

  orbitControls.autoRotate = true;
  orbitControls.autoRotateSpeed = 8.0;

  setTimeout(() => {
    document.getElementById('success').style.display = 'flex';
  }, 3000);


}

function gameOver () {
  console.log("Game over");
  document.getElementById('fail').style.display = 'flex';
}