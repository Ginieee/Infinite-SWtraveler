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
        this._controls.enablePan = false;
        this._controls.enableDamping = true;
        
        this._pressedKeys = {};

        document.addEventListener("keydown", (event) => {
            this._pressedKeys[event.key.toLowerCase()] = true;
            this._processAnimation();
        });

        document.addEventListener("keyup", (event) => {
            this._pressedKeys[event.key.toLowerCase()] = false;
            this._processAnimation();
        });
    }
    
    _processAnimation() {
        const previousAnimationAction = this._currentAnimationAction;

        if(this._pressedKeys["w"] || this._pressedKeys["a"] || this._pressedKeys["s"] || this._pressedKeys["d"]) {
            if(this._pressedKeys["shift"]) {
                this._currentAnimationAction = this._animationMap["Run"];
                // this._speed = 350;
                this._maxSpeed = 350;
                this._acceleration = 3;                
            } else {
                this._currentAnimationAction = this._animationMap["Walk"];                
                //this._speed = 80;
                this._maxSpeed = 80;
                this._acceleration = 3;
            }
        } else {
            this._currentAnimationAction = this._animationMap["Idle"];
            this._speed = 0;
            this._maxSpeed = 0;
            this._acceleration = 0;
        }

        if(previousAnimationAction !== this._currentAnimationAction) {
            previousAnimationAction.fadeOut(0.5);
            this._currentAnimationAction.reset().fadeIn(0.5).play();
        }
    }

    _setupModel() {
        const planeGeometry = new THREE.PlaneGeometry(3000, 3000);
        const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x878787 });
        // set floor with data/map.jpeg
        const floorMaterial = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load("data/map.jpeg")
        });
        const plane = new THREE.Mesh(planeGeometry, floorMaterial);
        plane.rotation.x = -Math.PI/2;
        this._scene.add(plane);
        plane.receiveShadow = true;

        const startPoint = new THREE.Vector3(-1000, 0, 1300);
        const aiPoint = new THREE.Vector3(-300, 0, -450);
        const gachonPoint = new THREE.Vector3(200, 0, 600);

        new THREE.GLTFLoader().load("data/subway.glb", (gltf) => {
            const subway = gltf.scene;
            this._scene.add(subway);

            subway.traverse(child => {
                if(child instanceof THREE.Mesh) {
                    child.castShadow = true;
                }
            });

            const box = (new THREE.Box3).setFromObject(subway);
            subway.position.y = (box.max.y - box.min.y) / 2;

            subway.scale.set(20, 20, 20);
            subway.position.x = startPoint.x;
            subway.position.z = startPoint.z + 100;

            subway.rotation.y = Math.PI / 2;

            const boxHelper = new THREE.BoxHelper(subway);
            this._scene.add(boxHelper);
            this._boxHelper_subway = boxHelper;
            this._subway = subway;
        });

        new THREE.GLTFLoader().load("data/bus.glb", (gltf) => {
            const bus = gltf.scene;
            this._scene.add(bus);

            bus.traverse(child => {
                if(child instanceof THREE.Mesh) {
                    child.castShadow = true;
                }
            });

            const box = (new THREE.Box3).setFromObject(bus);
            bus.position.y = (box.max.y - box.min.y) / 2;

            bus.scale.set(30, 30, 30);
            bus.position.x = startPoint.x + 100;
            bus.position.z = startPoint.z - 800;

            bus.rotation.y = Math.PI / 2;

            const boxHelper = new THREE.BoxHelper(bus);
            this._scene.add(boxHelper);
            this._boxHelper_bus = boxHelper;
            this._bus = bus;
        });

        new THREE.GLTFLoader().load("data/bus_stop.glb", (gltf) => {
            const busStop = gltf.scene;
            this._scene.add(busStop);

            busStop.traverse(child => {
                if(child instanceof THREE.Mesh) {
                    child.castShadow = true;
                }
            });

            const box = (new THREE.Box3).setFromObject(busStop);
            busStop.position.y = (box.max.y - box.min.y) / 2;

            // set bus stop size bigger
            busStop.scale.set(10, 10, 10);
            busStop.position.x = startPoint.x + 100;
            busStop.position.z = startPoint.z - 900;

            busStop.rotation.y = Math.PI;

            const boxHelper = new THREE.BoxHelper(busStop);
            this._scene.add(boxHelper);
            this._boxHelper_busStop = boxHelper;
            this._busStop = busStop;
        });

        new THREE.GLTFLoader().load("data/building_art.glb", (gltf) => {
            const artBuilding = gltf.scene;
            this._scene.add(artBuilding);

            artBuilding.traverse(child => {
                if(child instanceof THREE.Mesh) {
                    child.castShadow = true;
                }
            });

            const box = (new THREE.Box3).setFromObject(artBuilding);
            artBuilding.position.y = (box.max.y - box.min.y) / 2;

            artBuilding.scale.set(6, 6, 6);
            artBuilding.position.x = startPoint.x - 100;
            artBuilding.position.z = aiPoint.z + 300;

            artBuilding.rotation.y = - Math.PI / 3;

            const boxHelper = new THREE.BoxHelper(artBuilding);
            this._scene.add(boxHelper);
            this._boxHelper_artBuilding = boxHelper;
            this._artBuilding = artBuilding;
        });

        new THREE.GLTFLoader().load("data/ai_building.glb", (gltf) => {
            const aiBuilding = gltf.scene;
            this._scene.add(aiBuilding);

            aiBuilding.traverse(child => {
                if(child instanceof THREE.Mesh) {
                    child.castShadow = true;
                }
            });

            const box = (new THREE.Box3).setFromObject(aiBuilding);
            aiBuilding.position.y = 30;

            aiBuilding.scale.set(0.3, 0.3, 0.3);
            aiBuilding.position.x = aiPoint.x;
            aiBuilding.position.z = aiPoint.z;

            aiBuilding.rotation.y = Math.PI;

            const boxHelper = new THREE.BoxHelper(aiBuilding);
            this._scene.add(boxHelper);
            this._boxHelper_aiBuilding = boxHelper;
            this._aiBuilding = aiBuilding;
        });

        new THREE.GLTFLoader().load("data/ai_cube.glb", (gltf) => {
            const aiCube = gltf.scene;
            this._scene.add(aiCube);

            aiCube.traverse(child => {
                if(child instanceof THREE.Mesh) {
                    child.castShadow = true;
                }
            });

            const box = (new THREE.Box3).setFromObject(aiCube);

            aiCube.scale.set(1, 1, 1);
            aiCube.position.x = aiPoint.x + 30;
            aiCube.position.z = aiPoint.z - 30;
            aiCube.position.y = 90;

            aiCube.rotation.y = Math.PI;

            const boxHelper = new THREE.BoxHelper(aiCube);
            this._scene.add(boxHelper);
            this._boxHelper_aiCube = boxHelper;
            this._aiCube = aiCube;
        });

        new THREE.GLTFLoader().load("data/building_gachon.glb", (gltf) => {
            const gachonBuilding = gltf.scene;
            this._scene.add(gachonBuilding);

            gachonBuilding.traverse(child => {
                if(child instanceof THREE.Mesh) {
                    child.castShadow = true;
                }
            });

            const box = (new THREE.Box3).setFromObject(gachonBuilding);
            gachonBuilding.position.y = (box.max.y - box.min.y) / 2;

            gachonBuilding.scale.set(20, 20, 20);
            gachonBuilding.position.x = gachonPoint.x;
            gachonBuilding.position.z = gachonPoint.z;

            gachonBuilding.rotation.y = Math.PI / 6;

            const boxHelper = new THREE.BoxHelper(gachonBuilding);
            this._scene.add(boxHelper);
            this._boxHelper_gachonBuilding = boxHelper;
            this._gachonBuilding = gachonBuilding;
        });

        new THREE.GLTFLoader().load("data/character.glb", (gltf) => {
            const model = gltf.scene;
            this._scene.add(model);

            model.traverse(child => {
                if(child instanceof THREE.Mesh) {
                    child.castShadow = true;
                }
            });

            const animationClips = gltf.animations; // THREE.AnimationClip[]
            const mixer = new THREE.AnimationMixer(model);
            const animationsMap = {};
            animationClips.forEach(clip => {
                const name = clip.name;
                console.log(name);
                animationsMap[name] = mixer.clipAction(clip); // THREE.AnimationAction
            });

            this._mixer = mixer;
            this._animationMap = animationsMap;
            this._currentAnimationAction = this._animationMap["Idle"];
            this._currentAnimationAction.play();

            model.scale.set(0.3, 0.3, 0.3);
            model.position.x = startPoint.x;
            model.position.z = startPoint.z;

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

        camera.position.set(-1000, 50, 1500);
        this._camera = camera;
    }

    _addPointLight(x, y, z, helperColor) {
        const color = 0xffffff;
        const intensity = 0.2;
    
        const pointLight = new THREE.PointLight(color, intensity, 2000);
        pointLight.position.set(x, y, z);
    
        this._scene.add(pointLight);
    
        const pointLightHelper = new THREE.PointLightHelper(pointLight, 10, helperColor);
        this._scene.add(pointLightHelper);
    }

    _setupLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, .5);
        this._scene.add(ambientLight);

        this._addPointLight(1000, 750, 1000, 0xff0000);
        this._addPointLight(-1000, 750, 1000, 0xffff00);
        this._addPointLight(-1000, 750, -1000, 0x00ff00);
        this._addPointLight(1000, 750, -1000, 0x0000ff);

        const shadowLight = new THREE.DirectionalLight(0xffffff, 0.2);
        shadowLight.position.set(600, 2000, 600);
        shadowLight.target.position.set(0, 0, 0);
        const directionalLightHelper = new THREE.DirectionalLightHelper(shadowLight, 10);
        this._scene.add(directionalLightHelper);
        
        this._scene.add(shadowLight);
        this._scene.add(shadowLight.target);

        shadowLight.castShadow = true;
        shadowLight.shadow.mapSize.width = 3000;
        shadowLight.shadow.mapSize.height = 3000;
        shadowLight.shadow.camera.top = shadowLight.shadow.camera.right = 2000;
        shadowLight.shadow.camera.bottom = shadowLight.shadow.camera.left = -2000;
        shadowLight.shadow.camera.near = 1100;
        shadowLight.shadow.camera.far = 2500;
        shadowLight.shadow.radius = 5;
        const shadowCameraHelper = new THREE.CameraHelper(shadowLight.shadow.camera);
        this._scene.add(shadowCameraHelper);
    }    

    _previousDirectionOffset = 0;

    _directionOffset() {
        const pressedKeys = this._pressedKeys;
        let directionOffset = 0 // w

        if (pressedKeys['w']) {
            if (pressedKeys['a']) {
                directionOffset = Math.PI / 4 // w+a (45도)
            } else if (pressedKeys['d']) {
                directionOffset = - Math.PI / 4 // w+d (-45도)
            }
        } else if (pressedKeys['s']) {
            if (pressedKeys['a']) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a (135도)
            } else if (pressedKeys['d']) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d (-135도)
            } else {
                directionOffset = Math.PI // s (180도)
            }
        } else if (pressedKeys['a']) {
            directionOffset = Math.PI / 2 // a (90도)
        } else if (pressedKeys['d']) {
            directionOffset = - Math.PI / 2 // d (-90도)
        } else {
            directionOffset = this._previousDirectionOffset;
        }

        this._previousDirectionOffset = directionOffset;

        return directionOffset;        
    }

    _speed = 0;
    _maxSpeed = 0;
    _acceleration = 0;

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
                new THREE.Vector3(0,1,0), 
                angleCameraDirectionAxisY + this._directionOffset()
            );
            
            this._model.quaternion.rotateTowards(rotateQuarternion, THREE.MathUtils.degToRad(5));            

            const walkDirection = new THREE.Vector3();
            this._camera.getWorldDirection(walkDirection);

            walkDirection.y = 0;
            walkDirection.normalize();

            walkDirection.applyAxisAngle(new THREE.Vector3(0,1,0), this._directionOffset());

            if(this._speed < this._maxSpeed) this._speed += this._acceleration;
            else this._speed -= this._acceleration*2;

            const moveX = walkDirection.x * (this._speed * deltaTime);
            const moveZ = walkDirection.z * (this._speed * deltaTime);

            this._model.position.x += moveX;
            this._model.position.z += moveZ;    
            
            this._camera.position.x += moveX;
            this._camera.position.z += moveZ;
            
            this._controls.target.set(
                this._model.position.x,
                this._model.position.y,
                this._model.position.z,
            );            

            // this._model 과 this._bus 의 거리가 가까워지면 버스가 출발하도록
            if(this._model && this._bus) {
                const distance = this._model.position.distanceTo(this._bus.position);
                if(distance < 400) {
                    this._busFlag = true;
                }
            }
            
        }

        if(this._boxHelper_subway) {
            this._boxHelper_subway.update();
        }

        // move subway to x axis direction with 1 speed
        if(this._subway) {
            const moveX = 0.4;
            this._subway.position.x += moveX;
        }

        if(this._boxHelper_bus) {
            this._boxHelper_bus.update();
        }

        if(this._bus && this._busFlag) {
            const moveX = 20;
            this._bus.position.x += moveX;
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