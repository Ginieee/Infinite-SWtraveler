let scene, camera, renderer;
let plane;
let button, button1, button2;
let startText;
let question, text1, text2;

let isGamePlaying = false;
let currentQuizIndex = 0;
let nowQuiz;

const Quiz = [
  {
    question: "문제1",
    choice: [
      {
        text: "1-1",
        isCorrect: false
      },
      {
        text: "1-2",
        isCorrect: true
      },
    ]
  },
  {
    question: "문제2",
    choice: [
      {
        text: "2-1",
        isCorrect: false
      },
      {
        text: "2-2",
        isCorrect: true
      },
    ]
  },
  {
    question: "문제3",
    choice: [
      {
        text: "3-1",
        isCorrect: true
      },
      {
        text: "3-2",
        isCorrect: false
      },
    ]
  },
]


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

  generatePlane();
  generateLight();
  generateButtons();
  generateStartButton();

  generateQuestion();
  generateAnswers();

  animate();
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

    // 텍스트의 중심을 정렬하여 위치 조정
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

function generateAnswers() {
  const loader = new THREE.FontLoader();
  loader.load('../../data/assets/fonts/Lilita One_Regular.json', function (font) {
    const geometry1 = new THREE.TextGeometry('A', {
      font: font,
      size: 0.6,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: false
    });

    const geometry2 = new THREE.TextGeometry('B', {
      font: font,
      size: 0.6,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: false
    });

    const material = new THREE.MeshPhongMaterial({
      color: 0x0000ff,
    });

    text1 = new THREE.Mesh(geometry1, material);
    text2 = new THREE.Mesh(geometry2, material);
    text1.castShadow = true;
    text2.castShadow = true;
  
    // Position the text above the button's center
    text1.position.set(button1.position.x, button1.position.y + 2, button1.position.z - 1);
    text2.position.set(button2.position.x, button2.position.y + 2, button2.position.z - 1);
  
    scene.add(text1);
    scene.add(text2);
    animateText(text1, true);
    animateText(text2, false);
  });
}

function generatePlane() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('../../data/assets/textures/floor.jpeg');

  // 텍스처를 반복시키기 위해 repeat 설정
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  const repeatX = 4; // X 방향으로 4번 반복
  const repeatY = 4; // Y 방향으로 4번 반복
  texture.repeat.set(repeatX, repeatY);

  const geometry = new THREE.PlaneGeometry(30, 30, 50, 50);
  const material = new THREE.MeshStandardMaterial({
    map: texture, // 텍스처를 머티리얼에 추가
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
  
  // 텍스처를 반복시키기 위해 repeat 설정
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  const repeatX = 4; // X 방향으로 4번 반복
  const repeatY = 4; // Y 방향으로 4번 반복
  texture.repeat.set(repeatX, repeatY);

  const geometry = new THREE.BoxGeometry(6, 6, 0.4, 50, 50, 50);
  const material = new THREE.MeshStandardMaterial({
    map: texture, // 텍스처를 머티리얼에 추가
    side: THREE.DoubleSide
  });
  button1 = new THREE.Mesh(geometry, material);
  button1.receiveShadow = true;
  button1.rotateX(THREE.MathUtils.degToRad(100));

  button2 = button1.clone();

  button1.name = 'button1';
  button2.name = 'button2';

  button1.position.set(-5, 0, 5);
  button2.position.set(5, 0, 5);

  scene.add(button1, button2);
}


function generateLight() {
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  const directionLight = new THREE.DirectionalLight(0xffffff, 1);
  directionLight.position.set(0, 20, -15);
  directionLight.castShadow = true;

  // 추가 설정 - 그림자를 드리우기 위해 필요한 설정
  directionLight.shadow.mapSize.width = 1024;
  directionLight.shadow.mapSize.height = 1024;
  // Additional settings for shadows to appear larger
  directionLight.shadow.camera.top = 10;
  directionLight.shadow.camera.bottom = -20;
  directionLight.shadow.camera.left = -20;
  directionLight.shadow.camera.right = 20;
  directionLight.shadow.camera.near = 0.1;
  directionLight.shadow.camera.far = 30;

  scene.add(directionLight);
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
  // 마우스 클릭 좌표를 획득
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  // 레이캐스팅을 통해 클릭한 객체를 찾음
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

      // 카메라를 게임 화면으로 이동
      new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 3, z: 17 }, 1000)
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
  const targetPosition = initialPosition - 0.2; // 클릭시 버튼의 이동 위치

  // 버튼을 눌렀을 때의 Tween 애니메이션
  const buttonPress = new TWEEN.Tween({ y: initialPosition })
    .to({ y: targetPosition }, 300) // 500ms 동안의 애니메이션
    .easing(TWEEN.Easing.Quadratic.In)
    .onUpdate(function (object) {
      button.position.y = object.y;
    });

  // 버튼이 원래 위치로 돌아오는 Tween 애니메이션
  const buttonRelease = new TWEEN.Tween({ y: targetPosition })
    .to({ y: initialPosition }, 300) // 500ms 동안의 애니메이션
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

  // 각 애니메이션을 이어붙이고 순차적으로 실행
  buttonPress.chain(buttonRelease).start();
}

function animateText(textMesh, state) {
  const initialPosition = textMesh.position.y;

  const initial = state ? initialPosition : initialPosition + 0.5;
  const target = state ? initialPosition + 0.5 : initialPosition;

  // 애니메이션을 위한 Tween 구성
  const textFloat = new TWEEN.Tween({ y: initial })
    .to({ y: target }, 2000) // 움직임의 크기 및 시간 설정
    .easing(TWEEN.Easing.Quadratic.InOut) // 움직임의 형태 설정
    .yoyo(true) // 애니메이션을 왕복하도록 설정
    .repeat(Infinity) // 애니메이션을 계속 반복하도록 설정
    .onUpdate(function (object) {
      textMesh.position.y = object.y;
    });

  textFloat.start(); // 애니메이션 실행
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
      bevelEnabled: false
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
    question.position.set(0, 5, -13); // Adjust the position of the question text

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