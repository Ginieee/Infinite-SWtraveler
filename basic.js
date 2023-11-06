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
        this._controls.enabled = false;
        
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
        const planeGeometry = new THREE.PlaneGeometry(4000, 3000);
        const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x878787 });
        const mesh = []
        // set floor with data/map.jpeg
        const map = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load("data/map.jpeg")
        });
     
        const plane = new THREE.Mesh(planeGeometry, map);
        plane.rotation.x = -Math.PI/2;
        this._scene.add(plane);
        plane.receiveShadow = true;

        const textureloader = new THREE.TextureLoader();
        const startPoint = new THREE.Vector3(-1000, 0, 1300);
        const aiPoint = new THREE.Vector3(-300, 0, -450);
        const gachonPoint = new THREE.Vector3(200, 0, 600);

        //ch1
        const ch_1 = textureloader.load("data/ch1.png");
        const ch1 = new THREE.Mesh(
            new THREE.PlaneGeometry(600,150),
            new THREE.MeshStandardMaterial({
                map: ch_1
                ,transparent: true, opacity: 1.0, color: 'fffff'
            })
        );
        ch1.rotation.x = -Math.PI/2;
        ch1.position.set(startPoint.x+100, 1, startPoint.z-650);
        this._scene.add(ch1);

        //ch2
        const ch_2 = textureloader.load("data/ch2.png");
        const ch2 = new THREE.Mesh(
            new THREE.PlaneGeometry(600,150),
            new THREE.MeshStandardMaterial({
                map: ch_2
                ,transparent: true, opacity: 1.0, color: 'fffff'
            })
        );
        ch2.rotation.x = -Math.PI/2;
        ch2.position.set(startPoint.x+300, 1, startPoint.z-1650);
        this._scene.add(ch2);

        //ch3
        const ch_3 = textureloader.load("data/ch3.png");
        const ch3 = new THREE.Mesh(
            new THREE.PlaneGeometry(600,150),
            new THREE.MeshStandardMaterial({
                map: ch_3
                ,transparent: true, opacity: 1.0, color: 'fffff'
            })
        );
        ch3.rotation.x = -Math.PI/2;
        ch3.position.set(startPoint.x+1500, 1, startPoint.z-1650);
        this._scene.add(ch3);

         //ch4
         const ch_4 = textureloader.load("data/ch4.png");
         const ch4 = new THREE.Mesh(
             new THREE.PlaneGeometry(600,150),
             new THREE.MeshStandardMaterial({
                 map: ch_4
                 ,transparent: true, opacity: 1.0, color: 'fffff'
             })
         );
         ch4.rotation.x = -Math.PI/2;
         ch4.position.set(startPoint.x+1700, 1, startPoint.z-500);
         this._scene.add(ch4);


         //star
         const _star = textureloader.load("data/star.png");
         const star = new THREE.Mesh(
             new THREE.PlaneGeometry(150,150),
             new THREE.MeshStandardMaterial({
                 map: _star
                 ,transparent: true, opacity: 1.0, color: 'fffff'
             })
         );
         star.rotation.x = -Math.PI/2;
         star.position.set(startPoint.x+1200, 1, startPoint.z-1000);
         this._scene.add(star);

          //moon
          const _moon = textureloader.load("data/moon.png");
          const moon = new THREE.Mesh(
              new THREE.PlaneGeometry(120,120),
              new THREE.MeshStandardMaterial({
                  map: _moon
                  ,transparent: true, opacity: 1.0, color: 'fffff'
              })
          );
          moon.rotation.x = -Math.PI/2;
          moon.position.set(startPoint.x+1000, 1, startPoint.z-500);
          this._scene.add(moon);

         //quiz
         const _quiz = textureloader.load("data/quiz.png");
         const quiz = new THREE.Mesh(
             new THREE.PlaneGeometry(300,300),
             new THREE.MeshStandardMaterial({
                 map: _quiz
                 ,transparent: true, opacity: 1.0, color: 'fffff'
             })
         );
         quiz.rotation.x = -Math.PI/2;
         quiz.position.set(startPoint.x+700, 2, startPoint.z-1000);
         this._scene.add(quiz);

         //ap
         const _ap = textureloader.load("data/a+.png");
         const ap = new THREE.Mesh(
             new THREE.PlaneGeometry(300,300),
             new THREE.MeshStandardMaterial({
                 map: _ap
                 ,transparent: true, opacity: 1.0, color: 'fffff'
             })
         );
         ap.rotation.x = -Math.PI/2;
         ap.position.set(startPoint.x-300, 2, startPoint.z-1800);
         this._scene.add(ap);

         //tutor
         const _tutor = textureloader.load("data/tutor.png");
         const tutor = new THREE.Mesh(
             new THREE.PlaneGeometry(300,500),
             new THREE.MeshStandardMaterial({
                 map: _tutor
                 ,transparent: true, opacity: 1.0, color: 'fffff'
             })
         );
         tutor.rotation.x = -Math.PI/2;
         tutor.position.set(startPoint.x+850, 2, startPoint.z-2000);
         this._scene.add(tutor);

         //muhan1
         const _muhan1 = textureloader.load("data/muhan1.png");
         const muhan1 = new THREE.Mesh(
             new THREE.PlaneGeometry(200,300),
             new THREE.MeshStandardMaterial({
                 map: _muhan1
                 ,transparent: true, opacity: 1.0, color: 'fffff'
             })
         );
         muhan1.rotation.x = -Math.PI/2;
         muhan1.position.set(startPoint.x+2400, 2, startPoint.z-1000);
         this._scene.add(muhan1);

         //muhan2
         const _muhan2 = textureloader.load("data/muhan2.png");
         const muhan2 = new THREE.Mesh(
             new THREE.PlaneGeometry(200,300),
             new THREE.MeshStandardMaterial({
                 map: _muhan2
                 ,transparent: true, opacity: 1.0, color: 'fffff'
             })
         );
         muhan2.rotation.x = -Math.PI/2;
         muhan2.position.set(startPoint.x+400, 2, startPoint.z-300);
         this._scene.add(muhan2);

         //red
         const _red = textureloader.load("data/red.png");
         const red = new THREE.Mesh(
             new THREE.PlaneGeometry(50,100),
             new THREE.MeshStandardMaterial({
                 map: _red
                 ,transparent: true, opacity: 1.0, color: 'fffff'
             })
         );
         red.rotation.x = -Math.PI/2;
         red.position.set(startPoint.x+600, 2, startPoint.z-300);
         this._scene.add(red);

         //bird
         const _bird = textureloader.load("data/bird.png");
         const bird = new THREE.Mesh(
             new THREE.PlaneGeometry(100,100),
             new THREE.MeshStandardMaterial({
                 map: _bird
                 ,transparent: true, opacity: 1.0, color: 'fffff'
             })
         );
         bird.rotation.x = -Math.PI/2;
         bird.position.set(startPoint.x-500, 2, startPoint.z-1000);
         this._scene.add(bird);

          //mudang
          const _mudang = textureloader.load("data/mudang.png");
          const mudang = new THREE.Mesh(
              new THREE.PlaneGeometry(100,100),
              new THREE.MeshStandardMaterial({
                  map: _mudang
                  ,transparent: true, opacity: 1.0, color: 'fffff'
              })
          );
          mudang.rotation.x = -Math.PI/2;
          mudang.position.set(startPoint.x-500, 2, startPoint.z-500);
          this._scene.add(mudang);

         //tree
         const _tree = textureloader.load("data/tree.png");
         const tree = new THREE.Mesh(
             new THREE.PlaneGeometry(100,100),
             new THREE.MeshStandardMaterial({
                 map: _tree
                 ,transparent: true, opacity: 1.0, color: 'fffff'
             })
         );
         tree.rotation.x = -Math.PI/2;
         tree.position.set(startPoint.x+1100, 2, startPoint.z-200);
         this._scene.add(tree);

          //gachon
          const _gachon = textureloader.load("data/gachon.png");
          const gachon = new THREE.Mesh(
              new THREE.PlaneGeometry(600,500),
              new THREE.MeshStandardMaterial({
                  map: _gachon
                  ,transparent: true, opacity: 1.0, color: 'fffff'
              })
          );
          gachon.rotation.x = -Math.PI/2;
          gachon.position.set(startPoint.x+1700, 2, startPoint.z-800);
          this._scene.add(gachon);


           //ai
           const _ai = textureloader.load("data/ai.png");
           const ai = new THREE.Mesh(
               new THREE.PlaneGeometry(600,500),
               new THREE.MeshStandardMaterial({
                   map: _ai
                   ,transparent: true, opacity: 1.0, color: 'fffff'
               })
           );
           ai.rotation.x = -Math.PI/2;
           ai.position.set(startPoint.x+300, 2, startPoint.z-1950);
           this._scene.add(ai);

          //kitchen
          const _kitchen = textureloader.load("data/kitchen.png");
          const kitchen = new THREE.Mesh(
              new THREE.PlaneGeometry(600,500),
              new THREE.MeshStandardMaterial({
                  map: _kitchen
                  ,transparent: true, opacity: 1.0, color: 'fffff'
              })
          );
          kitchen.rotation.x = -Math.PI/2;
          kitchen.position.set(startPoint.x+1500, 2, startPoint.z-1950);
          this._scene.add(kitchen);

          //p1
          const _p1 = textureloader.load("data/p1.png");
          const p1 = new THREE.Mesh(
              new THREE.PlaneGeometry(400,60),
              new THREE.MeshStandardMaterial({
                  map: _p1
                  ,transparent: true, opacity: 0.0, color: 'fffff'
              })
          );
          p1.rotation.x = -Math.PI/2;
          p1.position.set(startPoint.x-300, 2, startPoint.z-1300);
          this.p1=p1;
          this._scene.add(this.p1);

          //p4
          const _p4 = textureloader.load("data/p4.png");
          const p4 = new THREE.Mesh(
              new THREE.PlaneGeometry(400,60),
              new THREE.MeshStandardMaterial({
                  map: _p4
                  ,transparent: true, opacity: 0.0, color: 'fffff'
              })
          );
          p4.rotation.x = -Math.PI/2;
          p4.position.set(startPoint.x-300, 2, startPoint.z-900);
          this.p4=p4;
          this._scene.add(this.p4);

          //p2
          const _p2 = textureloader.load("data/p2.png");
          const p2 = new THREE.Mesh(
              new THREE.PlaneGeometry(400,60),
              new THREE.MeshStandardMaterial({
                  map: _p2
                  ,transparent: true, opacity: 0.0, color: 'fffff'
              })
          );
          p2.rotation.x = -Math.PI/2;
          p2.position.set(startPoint.x+1100, 2, startPoint.z-900);
          this.p2=p2;
          this._scene.add(this.p2);

           //p3
           const _p3 = textureloader.load("data/p3.png");
           const p3 = new THREE.Mesh(
               new THREE.PlaneGeometry(400,60),
               new THREE.MeshStandardMaterial({
                   map: _p3
                   ,transparent: true, opacity: 0.0, color: 'fffff'
               })
           );
           p3.rotation.x = -Math.PI/2;
           p3.position.set(startPoint.x+1300, 2, startPoint.z-700);
           this.p3=p3;
           this._scene.add(this.p3);

           //p5
           const _p5 = textureloader.load("data/p5.png");
           const p5 = new THREE.Mesh(
               new THREE.PlaneGeometry(400,60),
               new THREE.MeshStandardMaterial({
                   map: _p5
                   ,transparent: true, opacity: 0.0, color: 'fffff'
               })
           );
           p5.rotation.x = -Math.PI/2;
           p5.position.set(startPoint.x+1100, 2, startPoint.z-500);
           this.p5=p5;
           this._scene.add(this.p5);
 

          //shift
          const _shift = textureloader.load("data/shift.png");
          const shift = new THREE.Mesh(
              new THREE.PlaneGeometry(400,60),
              new THREE.MeshStandardMaterial({
                  map: _shift
                  ,transparent: true, opacity: 1.0, color: 'fffff'
              })
          );
          shift.rotation.x = -Math.PI/2;
          shift.position.set(startPoint.x-150, 2, startPoint.z-100);
          this.shift=shift;
          this._scene.add(this.shift);

          //ch1_p
          const _ch1_p = textureloader.load("data/ch1_p.png");
          const ch1_p = new THREE.Mesh(
              new THREE.PlaneGeometry(400,60),
              new THREE.MeshStandardMaterial({
                  map: _ch1_p
                  ,transparent: true, opacity: 0.0, color: 'fffff'
              })
          );
          ch1_p.rotation.x = -Math.PI/2;
          ch1_p.position.set(startPoint.x-150, 1, startPoint.z-1050);
          this.ch1_p=ch1_p;
          this._scene.add(this.ch1_p);

          //tunnel
          const _tunnel = textureloader.load("data/tunnel.png");
          const tunnel = new THREE.Mesh(
              new THREE.PlaneGeometry(300,300),
              new THREE.MeshStandardMaterial({
                  map: _tunnel
                  ,transparent: true, opacity: 1.0, color: 'fffff'
              })
          );
          tunnel.rotation.x = -Math.PI/2;
          tunnel.position.set(startPoint.x-180, 2, startPoint.z-450);
          this.tunnel=tunnel;
          this._scene.add(this.tunnel);


          //tunnel1
          const _tunnel1 = textureloader.load("data/tunnel.png");
          const tunnel1 = new THREE.Mesh(
              new THREE.PlaneGeometry(300,300),
              new THREE.MeshStandardMaterial({
                  map: _tunnel1
                  ,transparent: true, opacity: 1.0, color: 'fffff'
              })
          );
          tunnel1.rotation.x = -Math.PI/2;
          tunnel1.position.set(startPoint.x+100, 2, startPoint.z-1450);
          this.tunnel1=tunnel1;
          this._scene.add(this.tunnel1);

          //tunnel2
          const _tunnel2 = textureloader.load("data/tunnel.png");
          const tunnel2 = new THREE.Mesh(
              new THREE.PlaneGeometry(300,300),
              new THREE.MeshStandardMaterial({
                  map: _tunnel2
                  ,transparent: true, opacity: 1.0, color: 'fffff'
              })
          );
          tunnel2.rotation.x = -Math.PI/2;
          tunnel2.position.set(startPoint.x+1300, 1, startPoint.z-1450);
          this.tunnel2=tunnel2;
          this._scene.add(this.tunnel2);

           //tunnel3
           const _tunnel3 = textureloader.load("data/tunnel.png");
           const tunnel3 = new THREE.Mesh(
               new THREE.PlaneGeometry(300,300),
               new THREE.MeshStandardMaterial({
                   map: _tunnel3
                   ,transparent: true, opacity: 1.0, color: 'fffff'
               })
           );
           tunnel3.rotation.x = -Math.PI/2;
           tunnel3.position.set(startPoint.x+1500, 1, startPoint.z-300);
           this.tunnel3=tunnel3;
           this._scene.add(this.tunnel3);


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
            this._artUpperBound = (box.max.y - box.min.y) / 2;
            artBuilding.position.y = -100;

            artBuilding.scale.set(6, 6, 6);
            artBuilding.position.x = startPoint.x - 500;
            artBuilding.position.z = aiPoint.z + 200;

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
            aiBuilding.position.x = startPoint.x+300;
            aiBuilding.position.z = startPoint.z-1850;

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
            aiCube.position.x = startPoint.x+330;
            aiCube.position.z = startPoint.z-1820;
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
            gachonBuilding.position.x = startPoint.x+1700;
            gachonBuilding.position.z = startPoint.z-800;

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

        camera.position.set(-1000, 50, 1700);
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
    _buildingMoveY = 0.5;
    _buildingAcceleration = 0.01;
    _cameraHold = new THREE.Vector3(0, 150, 400);
    _isHold = true;

    update(time) {
        time *= 0.001; // second unit

        this._controls.update();

        if(this._boxHelper) {
            this._boxHelper.update();
        }

        if(this._mixer) {
            const deltaTime = time - this._previousTime;
            this._mixer.update(deltaTime);

            if (this._isHold && this._model.position.x < -1200 && this._cameraHold.x > -700) {
                this._cameraHold.x -= 2;
            } else if(this._isHold && this._model.position.x > -1200 && this._cameraHold.x < 0){
                this._cameraHold.x += 2;
            }

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
                    this._isHold = false;
                }
            }

            if(this.p1 && this._model) {
                const distance1 = this._model.position.distanceTo(this.p1.position);
                if(distance1 < 300) {
                    gsap.to(this.p1.material, {
                        opacity: 1, // 최종 투명도 (1: 완전 불투명, 0: 완전 투명)
                        duration: 1, // 애니메이션 지속 시간 (초 단위)
                        ease: "power1.out" // 애니메이션 효과 (옵션)
                    });
                }
            }

            if(this.p4 && this._model) {
                const distance2 = this._model.position.distanceTo(this.p4.position);
                if(distance2 < 300) {
                    gsap.to(this.p4.material, {
                        opacity: 1, // 최종 투명도 (1: 완전 불투명, 0: 완전 투명)
                        duration: 1, // 애니메이션 지속 시간 (초 단위)
                        ease: "power1.out" // 애니메이션 효과 (옵션)
                    });
                }
            }

            if(this.p2 && this._model) {
                const distance3 = this._model.position.distanceTo(this.p2.position);
                if(distance3 < 300) {
                    gsap.to(this.p2.material, {
                        opacity: 1, // 최종 투명도 (1: 완전 불투명, 0: 완전 투명)
                        duration: 1, // 애니메이션 지속 시간 (초 단위)
                        ease: "power1.out" // 애니메이션 효과 (옵션)
                    });
                }
            }

            if(this.p3 && this._model) {
                const distance4 = this._model.position.distanceTo(this.p3.position);
                if(distance4 < 300) {
                    gsap.to(this.p3.material, {
                        opacity: 1, // 최종 투명도 (1: 완전 불투명, 0: 완전 투명)
                        duration: 1, // 애니메이션 지속 시간 (초 단위)
                        ease: "power1.out" // 애니메이션 효과 (옵션)
                    });
                }
            }

            if(this.p5 && this._model) {
                const distance5 = this._model.position.distanceTo(this.p5.position);
                if(distance5 < 300) {
                    gsap.to(this.p5.material, {
                        opacity: 1, // 최종 투명도 (1: 완전 불투명, 0: 완전 투명)
                        duration: 1, // 애니메이션 지속 시간 (초 단위)
                        ease: "power1.out" // 애니메이션 효과 (옵션)
                    });
                }
            }


            if(this._model && this._artBuilding) {
                const distance = this._model.position.distanceTo(this._artBuilding.position);
                if(distance < 400) {
                    this._artFlag = true;
                }
            }
            
            // 카메라가 항상 모델로부터 일정한 거리에 있도록
            if(this._isHold) {
                this._camera.position.x += (this._model.position.x + this._cameraHold.x - this._camera.position.x) / 50;
                this._camera.position.y += (this._model.position.y + this._cameraHold.y - this._camera.position.y) / 50;
                this._camera.position.z += (this._model.position.z + this._cameraHold.z - this._camera.position.z) / 50;
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

        if(this._boxHelper_artBuilding) {
            this._boxHelper_artBuilding.update();
        }        

        if(this._bus && this._busFlag) {
            const moveX = 20;
            this._bus.position.x += moveX;
            // 카메라가 버스를 바라보게 회전
            this._camera.lookAt(this._bus.position);

            if (this._bus.position.x > 4000) {
                this._busFlag = false;
                this._isHold = true;
                this.p = false; //완료
            }
        }

        if(this.ch1_p && this._model && this.p == false) {
            const distance1 = this._model.position.distanceTo(this.ch1_p.position);
            if(distance1 < 200) {
                gsap.to(this.ch1_p.material, {
                    opacity: 1, // 최종 투명도 (1: 완전 불투명, 0: 완전 투명)
                    duration: 1, // 애니메이션 지속 시간 (초 단위)
                    ease: "power1.out" // 애니메이션 효과 (옵션)
                }).then(() => {
                    console.log("ch1_p 완료")
                })
            }
        }

        // 모델과 artBuilding이 가까워지면 artBuilding이 올라오도록
        if(this._artBuilding && this._artFlag) {
            if(this._artBuilding.position.y > this._artUpperBound) {
                this._artFlag = false;
                this._buildingMoveY = 0.5;
                console.log("artBuilding 완료")
                //setTimeout(() => window.location.href = "http://127.0.0.1:5500/games/burgerGame/burgerStack.html", 3000)
                // setTimeout(() => window.location.href = "http://127.0.0.1:5500/games/chromeGame/chromeGame.html", 3000)
                // setTimeout(() => window.location.href = "http://127.0.0.1:5500/games/quizGame/quizGame.html", 3000)
            } else {
                this._artBuilding.position.y += Math.pow(this._buildingMoveY, 2);
                this._buildingMoveY += this._buildingAcceleration;
            }
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