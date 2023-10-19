
class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.VSMShadowMap;

        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls() {
        this._controls = new THREE.OrbitControls(this._camera, this._divContainer);
        this._controls.target.set(0, 100, 0);

        this._pressedKeys = {};

        document.addEventListener('keydown', (event) => {
            this._pressedKeys[event.key.toLowerCase()] = true;
            this._processAnimation();
        });

        document.addEventListener('keyup', (event) => {
            this._pressedKeys[event.key.toLowerCase()] = false;
            this._processAnimation();
        });
    }

    _processAnimation() {
        const previousAnimationAction = this._currentAnimationAction;

        if(this._pressedKeys['w'] || this._pressedKeys['a'] || this._pressedKeys['s'] || this._pressedKeys['d']) {
            if(this._pressedKeys['shift']) {
                this._currentAnimationAction = this._animationMap['Run'];
                this._speed = 350;
            } else {
                this._currentAnimationAction = this._animationMap['Walk'];
                this._speed = 80;
            }
        } else {
            this._currentAnimationAction = this._animationMap['Idle'];
            this._speed = 0;
        }

        if(previousAnimationAction !== this._currentAnimationAction) {
            previousAnimationAction.fadeOut(0.5);
            this._currentAnimationAction.reset().fadeIn(0.5).play();
        }
    }

    _setupModel() {
        const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
        const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x878787 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        this._scene.add(plane);
        plane.receiveShadow = true;

        new THREE.GLTFLoader().load('data/character.glb', (gltf) => {
            const model = gltf.scene;
            this._scene.add(model);
        
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });

            const animationClips = gltf.animations;
            const mixer = new THREE.AnimationMixer(model);
            const animationMap = {};
            animationClips.forEach((clip) => {
                const name = clip.name;
                console.log(name);
                animationMap[name] = mixer.clipAction(clip);
            });

            this._mixer = mixer;
            this._animationMap = animationMap;
            this._currentAnimationAction = this._animationMap['Idle'];
            this._currentAnimationAction.play();

            const box = (new THREE.Box3).setFromObject(model);
            model.position.y = (box.max.y - box.min.y) / 2;

            const axisHelper = new THREE.AxesHelper(1000);
            this._scene.add(axisHelper);

            const boxHelper = new THREE.BoxHelper(model);
            this._scene.add(boxHelper);
            this._boxHelper = boxHelper;
            this._model = model;
        });
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            60, 
            window.innerWidth / window.innerHeight, 
            1, 
            5000
        );

        camera.position.set(0, 100, 500);
        this._camera = camera;
    }

    _addPointLight(x, y, z, helperColor) { 
        const color = 0xffffff;
        const intensity = 1.5;

        const pointLight = new THREE.PointLight(color, intensity, 2000);
        pointLight.position.set(x, y, z);

        this._scene.add(pointLight);

        const pointLightHelper = new THREE.PointLightHelper(pointLight, 10, helperColor);
        this._scene.add(pointLightHelper);
    }

    _setupLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this._scene.add(ambientLight);

        this._addPointLight(500, 150, 500, 0xff0000);
        this._addPointLight(-500, 150, 500, 0x00ff00);
        this._addPointLight(500, 150, -500, 0x0000ff);
        this._addPointLight(-500, 150, -500, 0xffff00);

        const shadowLight = new THREE.DirectionalLight(0xffffff, 0.2);
        shadowLight.position.set(200, 500, 200);
        shadowLight.target.position.set(0, 0, 0);
        const directionalLightHelper = new THREE.DirectionalLightHelper(shadowLight, 10);
        this._scene.add(directionalLightHelper);

        this._scene.add(shadowLight);
        this._scene.add(shadowLight.target);

        shadowLight.castShadow = true;
        shadowLight.shadow.mapSize.width = 1024;
        shadowLight.shadow.mapSize.height = 1024;
        shadowLight.shadow.camera.near = 100;
        shadowLight.shadow.camera.far = 900;
        shadowLight.shadow.camera.top = shadowLight.shadow.camera.right = 700;
        shadowLight.shadow.camera.bottom = shadowLight.shadow.camera.left = -700;
        shadowLight.shadow.radius = 5;
        const shadowCameraHelper = new THREE.CameraHelper(shadowLight.shadow.camera);
        this._scene.add(shadowCameraHelper);
    }

    _deriectionOffset() {
        const pressedKeys = this._pressedKeys;
        let directionOffset = 0

        if(pressedKeys['w']) {
            if (pressedKeys['a']) {
                directionOffset = Math.PI / 4;
            } else if (pressedKeys['d']) {
                directionOffset = -Math.PI / 4;
            }
        } else if (pressedKeys['s']) {
            if (pressedKeys['a']) {
                directionOffset = Math.PI * 3 / 4;
            } else if (pressedKeys['d']) {
                directionOffset = -Math.PI * 3 / 4;
            } else {
                directionOffset = Math.PI;
            }
        } else if (pressedKeys['a']) {
            directionOffset = Math.PI / 2;
        } else if (pressedKeys['d']) {
            directionOffset = -Math.PI / 2;
        }

        return directionOffset;
    }

    _speed = 0;

    update(time) {
        time *= 0.001; // second unit

        this._controls.update();

        if(this._boxHelper) {
            this._boxHelper.update();
        }

        if(this._mixer) {
            const deltaTime = time - this._previousTime;
            this._mixer.update(deltaTime);

            const angleCameraDirectionAxisY = Math.atan2(
                (this._camera.position.x - this._model.position.x),
                (this._camera.position.z - this._model.position.z)
            ) + Math.PI; 

            const rotateQuarternion = new THREE.Quaternion();
            rotateQuarternion.setFromAxisAngle(
                new THREE.Vector3(0, 1, 0),
                angleCameraDirectionAxisY + this._deriectionOffset()
            );

            this._model.quaternion.rotateTowards(rotateQuarternion, THREE.MathUtils.degToRad(5));
            
            const walkDirection = new THREE.Vector3();
            this._camera.getWorldDirection(walkDirection);

            walkDirection.y = 0;
            walkDirection.normalize();

            walkDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), this._deriectionOffset());

            const moveX = walkDirection.x * this._speed * deltaTime;
            const moveZ = walkDirection.z * this._speed * deltaTime;

            this._model.position.x += moveX;
            this._model.position.z += moveZ;

            this._camera.position.x += moveX;
            this._camera.position.z += moveZ;

            this._controls.target.set(
                this._camera.position.x,
                this._camera.position.y,
                this._camera.position.z
            )
        } 
        this._previousTime = time;
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);   
        this.update(time);

        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        
        this._renderer.setSize(width, height);
    }
}

window.onload = function () {
    new App();
}