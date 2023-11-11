let scene, camera, renderer;
let plane;
let button, button1, button2;
let startText;
let question, text1, text2;

let isGamePlaying = false;
let currentQuizIndex = 0;
let nowQuiz;

let orbitControls;

const Quiz = [
  {
    question: "Mudang is stop when the weather is...",
    choice: [
      {
        text: "Hot",
        isCorrect: false
      },
      {
        text: "Rainy",
        isCorrect: true
      },
    ]
  },
  {
    question: "In Gachon University, there is a . . .",
    choice: [
      {
        text: "School shuttle bus\nnamed 'Infinity'",
        isCorrect: false
      },
      {
        text: "Statue that\nsymbolizes 'Infinity.'",
        isCorrect: true
      },
    ]
  },
  {
    question: "What is correct about the AI/SW department?",
    choice: [
      {
        text: "Both departments\nshare a common curriculum.",
        isCorrect: true
      },
      {
        text: "The SW department was\nestablished in 2020.",
        isCorrect: false
      },
    ]
  },
];



window.addEventListener('load', function() {
  console.log('load');
  init();
});

document.getElementById('home').addEventListener('click', function() {
  window.location.href = "http://127.0.0.1:5500/basic.html";
});

document.getElementById('retry').addEventListener('click', function() {
  restartGame();
});

document.addEventListener('click', onDocumentClick, false);

function init() {
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 5);

  // // CONTROLS
  // orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
  // orbitControls.enableDamping = true;
  // orbitControls.minDistance = 15;
  // orbitControls.maxPolarAngle = Math.PI;
  // orbitControls.enablePan = false;
  // orbitControls.autoRotate = true;
  // orbitControls.autoRotateSpeed = 7;
  // orbitControls.update();

  generateBackground();

  generatePlane();
  generateLight();
  generateButtons();
  generateStartButton();

  generateQuestion();

  animate();
}

function generateBackground() {
  new THREE.GLTFLoader().load('../../data/games/background_planet/scene.gltf', function(gltf) {
    const background = gltf.scene;
    background.scale.set(250.0, 250.0, 250.0);
    background.position.set(0, 10, 0);
    scene.add(background);
    console.log(background);
  });
}

function generateQuestion() {
  const loader = new THREE.FontLoader();
  loader.load('../../data/assets/fonts/Lilita One_Regular.json', function(font) {
    const geometry = new THREE.TextGeometry('Speed Quiz', {
      font: font,
      size: 1.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: false
    });

    // Text align center
    geometry.computeBoundingBox();
    const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
    geometry.translate(-0.5 * textWidth, 0, 0);

    const material = new THREE.MeshPhongMaterial();
    const textureLoader = new THREE.TextureLoader().setPath('../../data/assets/textures/');
    const textTexture = textureLoader.load('glass.jpg');

    material.map = textTexture;

    question = new THREE.Mesh(geometry, material);
    question.castShadow = true;
    question.position.set(0, 5, -13);

    scene.add(question);
  });
}

function generatePlane() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('../../data/assets/textures/floor.jpeg');

  // To repeat texture, set wrap mode of texture to THREE.RepeatWrapping
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  const repeatX = 4; // repeat 4 times in X direction
  const repeatY = 4; // repeat 4 times in Y direction
  texture.repeat.set(repeatX, repeatY);

  const geometry = new THREE.PlaneGeometry(30, 30, 50, 50);
  const material = new THREE.MeshStandardMaterial({
    map: texture, // add texture to material
    side: THREE.DoubleSide
  });
  plane = new THREE.Mesh(geometry, material);
  plane.receiveShadow = true;
  plane.rotateX(THREE.MathUtils.degToRad(100));

  plane.position.set(0, 0.8, 0);
  plane.receiveShadow = true;

  scene.add(plane);
}

function generateStartButton() {
  // start button
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('../../data/assets/textures/hologram.avif');

  const geometry = new THREE.BoxGeometry(5, 2, 0.4, 50, 50, 50);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide
  });
  button = new THREE.Mesh(geometry, material);
  button.receiveShadow = true;
  button.rotateX(THREE.MathUtils.degToRad(100));
  button.name = 'start-button';
  button.position.set(0, 1.8, -5);
  scene.add(button);

  // start text
  const loader = new THREE.FontLoader();
  loader.load('../../data/assets/fonts/Lilita One_Regular.json', function (font) {
    const geometry = new THREE.TextGeometry('START', {
      font: font,
      size: 0.8,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: false
    });

    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
    });

    startText = new THREE.Mesh(geometry, material);
    startText.rotateX(THREE.MathUtils.degToRad(-80));

    // Get bounding box of text
    geometry.computeBoundingBox();
    const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;

    // Calculate center position of the text relative to the button
    const textCenterX = button.position.x - textWidth * 0.5; // Adjust for centering

    startText.position.set(textCenterX, button.position.y + 0.2, button.position.z + 0.4);
    scene.add(startText);
  });
}


function generateButtons() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('../../data/assets/textures/button.jpg');
  
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  const repeatX = 4; 
  const repeatY = 4;
  texture.repeat.set(repeatX, repeatY);

  const geometry = new THREE.BoxGeometry(15, 6, 0.4, 50, 50, 50);
  const material = new THREE.MeshStandardMaterial({
    map: texture, 
    side: THREE.DoubleSide
  });
  button1 = new THREE.Mesh(geometry, material);
  button1.receiveShadow = true;
  button1.rotateX(THREE.MathUtils.degToRad(100));

  button2 = button1.clone();

  button1.name = 'button1';
  button2.name = 'button2';

  button1.position.set(-8, 0, 5);
  button2.position.set(8, 0, 5);

  scene.add(button1, button2);
}


function generateLight() {
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  const directionLight = new THREE.DirectionalLight(0xffffff, 1);
  directionLight.position.set(0, 20, -15);
  directionLight.castShadow = true;

  directionLight.shadow.mapSize.width = 1024;
  directionLight.shadow.mapSize.height = 1024;
  
  directionLight.shadow.camera.top = 10;
  directionLight.shadow.camera.bottom = -20;
  directionLight.shadow.camera.left = -20;
  directionLight.shadow.camera.right = 20;
  directionLight.shadow.camera.near = 0.1;
  directionLight.shadow.camera.far = 30;

  const directionLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
  directionLight2.position.set(0, 0, 15);
  directionLight2.castShadow = false;

  scene.add(directionLight, directionLight2);
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}
window.addEventListener("resize", handleResize);

function onDocumentClick(event) {
  event.preventDefault();
  // Get mouse position
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  // Find clicked objects
  const raycaster = new THREE.Raycaster();
  const mouseVector = new THREE.Vector2(mouseX, mouseY);
  raycaster.setFromCamera(mouseVector, camera);
  
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    if (object.name === 'button1' || object.name === 'button2') {
      animateButton(object);
    }

    if (object.name === 'start-button') {
      isGamePlaying = true;
      playGame();
      if(camera.position.z === 17) {
        if (startText) {
          new TWEEN.Tween(startText.position)
            .to({ y: -1 }, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
        } if (button) {
          new TWEEN.Tween(button.position)
            .to({ y: -1 }, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
        }
        return;
      }

      // Move camera to game position
      new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 3, z: 25 }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => {
          if (startText) {
            new TWEEN.Tween(startText.position)
              .to({ y: -1 }, 1000)
              .easing(TWEEN.Easing.Quadratic.InOut)
              .start();
          } if (button) {
            new TWEEN.Tween(button.position)
              .to({ y: -1 }, 1000)
              .easing(TWEEN.Easing.Quadratic.InOut)
              .start();
          }
        })
        .start();
    }
  }
}

function animateButton(button) {
  const initialPosition = button.position.y;
  const targetPosition = initialPosition - 0.2;

  // When button is pressed, move it down
  const buttonPress = new TWEEN.Tween({ y: initialPosition })
    .to({ y: targetPosition }, 300)
    .easing(TWEEN.Easing.Quadratic.In)
    .onUpdate(function (object) {
      button.position.y = object.y;
    });

  // Animation when button is released
  const buttonRelease = new TWEEN.Tween({ y: targetPosition })
    .to({ y: initialPosition }, 300)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onComplete(() => {
      if(isGamePlaying){
        if(nowQuiz.choice[button === button1 ? 0 : 1].isCorrect){
          correctAnswer();
        } else {
          wrongAnswer();
        }
      }
    })
    .onUpdate(function (object) {
      button.position.y = object.y;
    });

  // Execute animations in sequence
  buttonPress.chain(buttonRelease).start();
}

function animateText(textMesh, state) {
  const initialPosition = textMesh.position.y;

  const initial = state ? initialPosition : initialPosition + 0.5;
  const target = state ? initialPosition + 0.5 : initialPosition;

  const textFloat = new TWEEN.Tween({ y: initial })
    .to({ y: target }, 2000) 
    .easing(TWEEN.Easing.Quadratic.InOut) 
    .yoyo(true) 
    .repeat(Infinity) 
    .onUpdate(function (object) {
      textMesh.position.y = object.y;
    });

  textFloat.start();
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  renderer.render(scene, camera);
}

function playGame() {
  console.log('playGame');
  if (currentQuizIndex >= Quiz.length) {
    successGame();
    return;
  }

  nowQuiz = Quiz[currentQuizIndex];

  // Update the question text in the 3D scene
  const fontLoader = new THREE.FontLoader();
  fontLoader.load('../../data/assets/fonts/Lilita One_Regular.json', function (font) {
    const geometry = new THREE.TextGeometry(nowQuiz.question, {
      font: font,
      size: 1.2, // Adjust the size of the question text as needed
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: false,
      
    });

    // Compute the centering for the question text
    geometry.computeBoundingBox();
    const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
    geometry.translate(-0.5 * textWidth, 0, 0);

    const material = new THREE.MeshPhongMaterial({ color: 0xffffff }); // Adjust color as needed

    // Remove the previous question mesh before adding the new one
    if (question) {
      scene.remove(question);
    }

    question = new THREE.Mesh(geometry, material);
    question.castShadow = true;
    question.position.set(0, 8, -13); // Adjust the position of the question text

    scene.add(question);
  });

  // Update the choice text in the 3D scene (text1 and text2)
  const loader = new THREE.FontLoader();
  loader.load('../../data/assets/fonts/Lilita One_Regular.json', function (font) {
    const choice1Geometry = new THREE.TextGeometry(nowQuiz.choice[0].text, {
      font: font,
      size: 0.6,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: false
    });

    const choice2Geometry = new THREE.TextGeometry(nowQuiz.choice[1].text, {
      font: font,
      size: 0.6,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: false
    });

    const material = new THREE.MeshPhongMaterial({ color: 0x0000ff }); // Adjust color as needed

    // Remove the previous choice meshes before adding the new ones
    if (text1 && text2) {
      scene.remove(text1);
      scene.remove(text2);
    }

    text1 = new THREE.Mesh(choice1Geometry, material);
    text2 = new THREE.Mesh(choice2Geometry, material);
    text1.castShadow = true;
    text2.castShadow = true;

    // Position the text above the button's center (adjust positions as needed)
    text1.position.set(button1.position.x, button1.position.y + 2, button1.position.z - 1);
    text2.position.set(button2.position.x, button2.position.y + 2, button2.position.z - 1);

    choice1Geometry.computeBoundingBox();
    const text1Width = choice1Geometry.boundingBox.max.x - choice1Geometry.boundingBox.min.x;
    text1.position.x -= 0.5 * text1Width;

    choice2Geometry.computeBoundingBox();
    const text2Width = choice2Geometry.boundingBox.max.x - choice2Geometry.boundingBox.min.x;
    text2.position.x -= 0.5 * text2Width;

    scene.add(text1);
    scene.add(text2);
    animateText(text1, true);
    animateText(text2, false);
  });
}

function correctAnswer() {
  console.log('correctAnswer');
  currentQuizIndex++;
  playGame();
}

function wrongAnswer() {
  console.log('wrongAnswer');
  document.getElementById('incorrect').style.display = 'flex';
}

function restartGame() {
  console.log('restartGame');
  document.getElementById('incorrect').style.display = 'none';
  currentQuizIndex = 0;
  playGame();
}

function successGame() {
  console.log('successGame');
  document.getElementById('correct').style.display = 'flex';
}