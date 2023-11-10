let scene, camera, renderer;
let cameraTarget;
let floor;
let model;
let modelAnimation;
let mixer;
let previousAction;
let currentAction;
let idleAction;
let runAction;
let jumpAction1; 
let jumpAction2; 
let jumpAction3; 

const clock = new THREE.Clock();
const IDLE = 0;
const RUN = 4;
const JUMP_1 = 1;
const JUMP_2 = 2;
const JUMP_3 = 3;

const speed = 1.0;

let pinwheelList = [];
let pinwheelOriginY = 2.1;
const pinwheelUnderY = 0.1;
const pinwheelZPositions = [
  -22, -35, -47, -64, -80, -90, -104, -116, -130, -145
]
const pinwheelTextures = [
  '../../data/assets/textures/pinwheel_texture_1.jpg',
  '../../data/assets/textures/pinwheel_texture_2.jpg',
  '../../data/assets/textures/pinwheel_texture_4.jpg',
  '../../data/assets/textures/pinwheel_texture_5.jpg',
  '../../data/assets/textures/pinwheel_texture_6.jpg',
  '../../data/assets/textures/pinwheel_texture_7.jpg',
  '../../data/assets/textures/pinwheel_texture_8.jpg',
  '../../data/assets/textures/pinwheel_texture_9.jpg',
  '../../data/assets/textures/pinwheel_texture_10.jpg',
  '../../data/assets/textures/pinwheel_texture_3.jpg',
]
const pinwheelMeshList = [];
let pinwheelMaterial;

let cube;

let orbitControls;
let raycaster;

let isGamePlaying = false;
let isModelRunning = false;
let isModelJumping = false;
let isModelJumpBack = false;
const jumpY = 2.8;
let originY;

let modelBoundingBox;
let pinwheelBoundingBoxList = [];
let pinwheelHelperList = [];
let cubeBoundingBox;

let modelHelper;

const removeObjectList = [
  "Object_96",
  "Object_97",
  "Object_114",
  "Object_115",
  "Object_117",
  "Object_118",
  "Object_125",
  "Object_126",
]

window.addEventListener('load', init);

document.getElementById('home').addEventListener('click', function() {
  window.location.href = 'http://127.0.0.1:5500/basic.html';
});

document.getElementById('retry').addEventListener('click', function() {
  gameRestart();
});

async function init() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(9, 3.5, -14);

  // // CONTROL
  // orbitControls = new OrbitControls(camera, renderer.domElement);
  // orbitControls.enableDamping = true;
  // orbitControls.enablePan = false;
  // orbitControls.update();

  const progressBar = document.querySelector('#progress-bar');
  const progressBarContainer = document.querySelector('#progress-bar-cotnainer');

  const loadingManager = new THREE.LoadingManager();
  loadingManager.onProgress = (url, loaded, total) => {
    progressBar.value = loaded / total * 100;
  };
  loadingManager.onLoad = () => {
    progressBarContainer.style.display = 'none';
  };
  
  const gltfLoader = new THREE.GLTFLoader(loadingManager);
  const gltf = await gltfLoader.loadAsync('../../data/games/low_poly_forest_road/scene.gltf');
  floor = gltf.scene;
  floor.scale.set(1.0, 1.0, 1.0);
  floor.traverse((object) => {
    if (object.isMesh) {
      if (removeObjectList.includes(object.name)) {
        object.visible = false;
      } else {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    }
  });
  floor.position.set(0, 0, 0);
  generateFloor();
  generatePinwheel();
  generateCube();

  await generateModel();
  scene.add(floor);

  generateLight();

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }
  window.addEventListener("resize", handleResize);
  window.addEventListener("click", onDocumentClick);

  window.addEventListener("mouseup", () => {
    console.log(camera.position);
  });

  animate();
}

function generateFloor() {
  let i = 0;
  while (i < 19) {
    const newFloor = floor.clone();
    newFloor.position.set(0, 0, -10 * (i + 1));
    scene.add(newFloor);
    i++;
  }
}

async function generateModel() {
  const gltfLoader = new THREE.GLTFLoader();
  const gltf = await gltfLoader.loadAsync('../../data/muhan_move.glb');
  model = gltf.scene;
  model.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  model.scale.set(0.6, 0.6, 0.6);
  model.position.set(3, 2.1, -10);
  originY = model.position.y;
  model.rotateY(Math.PI);

  console.log(gltf.animations);

  mixer = new THREE.AnimationMixer(model);

  let isJumping = false;
  let beforeJump;

  if(gltf.animations.length > 0) {
    idleAction = mixer.clipAction(gltf.animations[IDLE]);
    runAction = mixer.clipAction(gltf.animations[RUN]).setEffectiveTimeScale(speed);
    jumpAction1 = mixer.clipAction(gltf.animations[JUMP_1]);
    jumpAction2 = mixer.clipAction(gltf.animations[JUMP_2]);
    jumpAction3 = mixer.clipAction(gltf.animations[JUMP_3]);
  
    idleAction.play();
    currentAction = idleAction;
  
    window.addEventListener('keydown', (event) => {
      previousAction = currentAction;
      switch (event.key) {
        case 'Enter':
          if(!isGamePlaying && !isJumping) {
            isGamePlaying = true;
            isModelRunning = true;
            isJumping = false;
            currentAction = runAction;
          }
          break;
        case ' ':
          if (!isModelJumping && !isJumping) {
            isModelJumping = true;
            isModelJumpBack = false;
            isJumping = true;
            beforeJump = previousAction;
            const randomJump = (Math.floor(Math.random() * 3) + 1);
            console.log(randomJump);
            currentAction = randomJump === 1 ? jumpAction1 : randomJump === 2 ? jumpAction2 : jumpAction3;
          }
          break;
        case 'Escape':
          if (isGamePlaying && !isJumping) {
            isGamePlaying = false;
            isModelRunning = false;
            isJumping = false;
            currentAction = idleAction;
          }
          break;
      }
      if (currentAction !== previousAction) {
        previousAction.fadeOut(0.5);
        currentAction.reset();
        currentAction.fadeIn(0.5);
        currentAction.play();

        if (isJumping) {
          setTimeout(() => {
            previousAction = currentAction;
            currentAction = beforeJump;

            previousAction.fadeOut(0.5);
            currentAction.reset();
            currentAction.fadeIn(0.5);
            currentAction.play();

            isJumping = false;
          }, 1500);
        }
      }
    });
  } else {
    console.log('no animation');
  }

  modelBoundingBox = new THREE.Box3().setFromObject(model);
  const mbb = modelBoundingBox.getSize(new THREE.Vector3());
  // modelHelper = new THREE.BoxHelper(model, 0xffff00);
  // scene.add(modelHelper);

  scene.add(model);
  cameraTarget = model.position.clone();
  cameraTarget.z -= 4;
  cameraTarget.y += 0.5;
  camera.lookAt(cameraTarget);
}

async function generatePinwheel() {
  const gltfLoader = new THREE.GLTFLoader();
  const gltf = await gltfLoader.loadAsync('../../data/games/fwprops_pinwheel/scene.gltf');
  const pinwheel = gltf.scene;
  pinwheel.scale.set(0.5, 0.5, 0.5);
  pinwheel.traverse((object) => {
    if (object.isMesh) {
      pinwheelMeshList.push(object.material);
    }
  });

  const textureLoader = new THREE.TextureLoader();
  
  for(let i = 0; i < 10; i++) {
    const newPinwheel = pinwheel.clone();
    newPinwheel.position.set(3.5, pinwheelUnderY, pinwheelZPositions[i]);
    newPinwheel.rotateY(Math.PI / 2);

    const texture = textureLoader.load(pinwheelTextures[i]);

    newPinwheel.traverse((object) => {
      if (object.isMesh) {
        object.material = pinwheelMeshList[0].clone();
        object.castShadow = true;
        object.receiveShadow = true;
        object.material.map = texture;
      }
    });
    pinwheelList.push(newPinwheel);

    const pbbOffsetX = 5;
    const pbbOffsety = 2.1;
    const pbbOffsetz = 1;
    const newPinwheelBoundingBox = new THREE.Box3();
    const minX = 3.5 - pbbOffsetX; // X 최소값
    const minY = pinwheelUnderY - pbbOffsety; // Y 최소값
    const minZ = pinwheelZPositions[i] - pbbOffsetz; // Z 최소값
    const maxX = 3.5 + pbbOffsetX; // X 최대값
    const maxY = pinwheelUnderY + pbbOffsety; // Y 최대값
    const maxZ = pinwheelZPositions[i] + pbbOffsetz;  // Z 최대값

    // 직접 값을 설정하여 bounding box 만들기
    newPinwheelBoundingBox.set(
      new THREE.Vector3(minX, minY, minZ), // 최소 지점
      new THREE.Vector3(maxX, maxY, maxZ)  // 최대 지점
    );

    pinwheelBoundingBoxList.push(newPinwheelBoundingBox);
    console.log(newPinwheelBoundingBox);
    
    // const pinwheelHelper = new THREE.BoxHelper(newPinwheel, 0xffff00);
    // pinwheelHelperList.push(pinwheelHelper);
    // scene.add(pinwheelHelperList[pinwheelHelperList.length - 1]);

    scene.add(newPinwheel);
  }
}

async function generateCube() {
  const gltfLoader = new THREE.GLTFLoader();
  const gltf = await gltfLoader.loadAsync('../../data/games/glass_cube/scene.gltf');
  cube = gltf.scene;
  cube.scale.set(0.03, 0.03, 0.03);
  cube.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  cube.position.set(3, 4.0, -175);
  cube.rotation.set(Math.PI / 4, Math.PI / 4, 0);

  cubeBoundingBox = new THREE.Box3().setFromObject(cube);
    
  // const cubeHelper = cubeBoundingBox.getSize(new THREE.Vector3());
  // const cubeHelperMesh = new THREE.BoxHelper(cube, 0xffff00);
  // scene.add(cubeHelperMesh);

  scene.add(cube);

  const initial = cube.position.y;
  const target = initial + 1.0;
  
  const cubeFloat = new TWEEN.Tween({ y: initial })
  .to({ y: target }, 800) // 움직임의 크기 및 시간 설정
  .easing(TWEEN.Easing.Quadratic.InOut) // 움직임의 형태 설정
  .yoyo(true) // 애니메이션을 왕복하도록 설정
  .repeat(Infinity) // 애니메이션을 계속 반복하도록 설정
  .onUpdate(function (object) {
    cube.position.y = object.y;
  });

  cubeFloat.start(); // 애니메이션 실행
}

function generateLight() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(9, 5, -15);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.top = 2;
  directionalLight.shadow.camera.bottom = -2;
  directionalLight.shadow.camera.right = 2;
  directionalLight.shadow.camera.left = -2;
  directionalLight.shadow.mapSize.set(4096, 4096);
  scene.add(directionalLight);
}

function onDocumentClick(event) {
  event.preventDefault();

  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster = new THREE.Raycaster();
  const mouseVector = new THREE.Vector2(mouseX, mouseY);
  raycaster.setFromCamera(mouseVector, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    const object = intersects[0].object;
    console.log(object.name);
  }
};

function checkPinwheelUp() {
  // console.log("Checking pinwheel up");
  // console.log("Camera position: " + camera.position.z);
  // console.log("Pinwheel position: " + pinwheelList[0].position.z);
  for (let i = 0; i < pinwheelList.length; i++) {
    if (camera.position.z <= pinwheelList[i].position.z + 5 && camera.position.z > pinwheelList[i].position.z) {
      if (pinwheelList[i].position.y < originY) {
        pinwheelList[i].position.y += 0.2;
        console.log(model.position);
        // pinwheelHelperList[i].update();
        // console.log(pinwheelList[i].position);
        // console.log(model.position);
        // console.log("Pinwheel " + i + " is going up");
      }
    }
  }
}

function checkCollision() {
  for (let i = 0; i < pinwheelBoundingBoxList.length; i++) {
    if (modelBoundingBox.intersectsBox(pinwheelBoundingBoxList[i])) {
      console.log("Collision detected between model and pinwheel " + i);
      isGamePlaying = false;
      isModelRunning = false;

      previousAction = currentAction;
      isGamePlaying = false;
      isModelRunning = false;
      currentAction = idleAction;
      
      if (currentAction !== previousAction) {
        previousAction.fadeOut(0.5);
        currentAction.reset();
        currentAction.fadeIn(0.5);
        currentAction.play();
      }

      gameOver();
    }

    if (modelBoundingBox.intersectsBox(cubeBoundingBox)) {
      console.log("Success!");

      previousAction = currentAction;
      isGamePlaying = false;
      isModelRunning = false;
      currentAction = idleAction;
      
      if (currentAction !== previousAction) {
        previousAction.fadeOut(0.5);
        currentAction.reset();
        currentAction.fadeIn(0.5);
        currentAction.play();
      }
      
      gsap.to(model.rotation, {y: Math.PI * 2 , duration: 1.5, ease: "power2.inOut"});

      // 애니메이션을 위한 Tween 구성
      const initial = model.position.y;
      const target = model.position.y + 1.0;
      const modelFloat = new TWEEN.Tween({ y: initial })
      .to({ y: target }, 500) // 움직임의 크기 및 시간 설정
      .easing(TWEEN.Easing.Quadratic.InOut) // 움직임의 형태 설정
      .yoyo(true) // 애니메이션을 왕복하도록 설정
      .repeat(Infinity) // 애니메이션을 계속 반복하도록 설정
      .onUpdate(function (object) {
        model.position.y = object.y;
      });

      modelFloat.start(); // 애니메이션 실행

      gameSuccess();
    }
  }
}

function animate() {
  const delta = clock.getDelta();
  if (mixer) {
    mixer.update(delta);
  }
  // orbitControls.update();
  TWEEN.update();
  renderer.render(scene, camera);

  if (isGamePlaying) {
    document.getElementById("start-info").style.display = "none";
    if (isModelRunning) {
      model.position.z -= 0.1;
      camera.position.z -= 0.1;
      cameraTarget.z -= 0.1;
      camera.lookAt(cameraTarget);

      modelBoundingBox = new THREE.Box3().setFromObject(model);
      // modelHelper.update();
      // console.log(modelBoundingBox);
      // console.log(model.position);
      // console.log(modelBoundingBox);

      checkCollision();
      checkPinwheelUp();
      
      // cameraTarget.x = model.position.x;
      // cameraTarget.y = model.position.y;
      // cameraTarget.z = model.position.z;
      // orbitControls.target = cameraTarget;
    }
  }
  if (isModelJumping) {
    if (!isModelJumpBack) {
      model.position.y += 0.1;
      cameraTarget.y += 0.1;
      if (model.position.y >= originY + jumpY) {
        isModelJumpBack = true;
      }
    } else {
      model.position.y -= 0.1;
      cameraTarget.y -= 0.1;
      if (model.position.y <= originY) {
        isModelJumping = false;
        isModelJumpBack = false;
      }
    }
  }

  requestAnimationFrame(animate);
}

function gameRestart () {
  window.location.reload();
}

function gameSuccess () {
  console.log("Game success");
  document.getElementById('success').style.display = 'flex';
}

function gameOver () {
  console.log("Game over");
  document.getElementById('fail').style.display = 'flex';
}