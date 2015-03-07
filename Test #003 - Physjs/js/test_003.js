	Physijs.scripts.worker = 'js/physijs/physijs_worker.js';
	Physijs.scripts.ammo = 'ammo.js'

	var keyboard = new THREEx.KeyboardState();
	var drop;
	var enemy;
	var enemyPic;
	var hidden;
	var rotX, rotY, rotZ;
	var upAndDown = 1;//------------>detect position of player
	var canChangeGravity = 1;
	var xPos = 0;
	var ground;
	var gravZ = 1.0;
	var winner = 0;////----------------check if  player won
	var loser = 0;/////-----------------check if player lost
	var gravY = -10.0;
	var platform, platform2, platform3, platform4, platform5, platform6;///--------platforms top and bottom
	//var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
	var obstacles = [];
	var container,
		projector,
		camera, controls, scene, renderer,
		light_1, light_2;

	var clock = new THREE.Clock();
	var light_rotation_1 = 0,
		light_rotation_2 = 0;

	var textOverMesh;
	var textWinMesh;
	var t = 0;


    //--------------------------------------------- display text
	var text = "press Space to change gravity",

            height = 0.3,
            size = 1,
            hover = 0,

            curveSegments = 4,

            bevelThickness = 2,
            bevelSize = 1.5,
            bevelSegments = 3,
            bevelEnabled = false,

            font = "helvetiker", // helvetiker, optimer, gentilis, droid sans, droid serif
            weight = "bold", // normal bold
            style = "normal"; // normal italic

	//--------------------------------------------- display avoid this enemy
	var textAvoid = "Avoid This Guy --> ",

            height = 0.3,
            size = 1,
            hover = 0,

            curveSegments = 4,

            bevelThickness = 2,
            bevelSize = 1.5,
            bevelSegments = 3,
            bevelEnabled = false,

            font = "helvetiker", // helvetiker, optimer, gentilis, droid sans, droid serif
            weight = "bold", // normal bold
            style = "normal"; // normal italic

	//--------------------------------------------- display game over text
	var text2 = "LOSER",

            height = 0.3,
            size2 = 5,
            hover = 0,

            curveSegments = 4,

            bevelThickness = 2,
            bevelSize = 1.5,
            bevelSegments = 3,
            bevelEnabled = false,

            font = "helvetiker", // helvetiker, optimer, gentilis, droid sans, droid serif
            weight = "bold", // normal bold
            style = "normal"; // normal italic

	//--------------------------------------------- display game over text
	var text3 = "WINNER",

            height = 0.3,
            size2 = 5,
            hover = 0,

            curveSegments = 4,

            bevelThickness = 2,
            bevelSize = 1.5,
            bevelSegments = 3,
            bevelEnabled = false,

            font = "helvetiker", // helvetiker, optimer, gentilis, droid sans, droid serif
            weight = "bold", // normal bold
            style = "normal"; // normal italic

	function initScene() {
		console.log( '[START] initScene' );
		projector = new THREE.Projector();

		container = document.getElementById( 'container' );

		/* Init the camera */
		camera = new THREE.PerspectiveCamera( 50.0, window.innerWidth / window.innerHeight, 0.001, 30.0 );
		camera.position.set( 0.0, 2.0, 15 );
		//camera.rotation.set(0.001, 0, 0);
		

		/* Init the scene */
		scene = new Physijs.Scene();
		scene.setGravity( new THREE.Vector3( 0, -500, 0 ));
		scene.addEventListener( 'update', function() {
			scene.simulate( undefined, 1 );
		} );
		//scene.fog = new THREE.Fog( 0x72654b, 2, 15 );

		/* Create our immovable platform *//////--------not using
		var ground_material = Physijs.createMaterial(
			new THREE.MeshPhongMaterial( {
				ambient : 0x999999,
				color   : 0xff0000,
				specular: 0x101010
			} ),
			1.0, 1.0
		);
	    //------  -----------------------------------   load text instructions

		var textGeo = new THREE.TextGeometry(text, {

		    size: size,
		    height: height,
		    curveSegments: curveSegments,

		    font: font,
		    weight: weight,
		    style: style,

		    bevelThickness: bevelThickness,
		    bevelSize: bevelSize,
		    bevelEnabled: bevelEnabled,


		});

	    //------  -----------------------------------   load text avoid this guy

		var textAvoidMesh = new THREE.TextGeometry(textAvoid, {

		    size: size,
		    height: height,
		    curveSegments: curveSegments,

		    font: font,
		    weight: weight,
		    style: style,

		    bevelThickness: bevelThickness,
		    bevelSize: bevelSize,
		    bevelEnabled: bevelEnabled,


		});

	    //  var geometry = new THREE.CubeGeometry(10,10,1);
		var material2 = new THREE.MeshBasicMaterial({ color: 0x000000 });
		var textAvoidMesh = new THREE.Mesh(textAvoidMesh, material2);
		textAvoidMesh.position.z = -3;
		textAvoidMesh.position.y = -5;
		textAvoidMesh.position.x = -5;
		scene.add(textAvoidMesh);

		var textGeo = new THREE.Mesh(textGeo, material2);
		textGeo.position.z = -3;
		textGeo.position.y = 8;
		textGeo.position.x = -5;
		scene.add(textGeo);

        //----------------------------------------------------- load gameover text

		var textOver = new THREE.TextGeometry(text2, {

		    size: size2,
		    height: height,
		    curveSegments: curveSegments,

		    font: font,
		    weight: weight,
		    style: style,

		    bevelThickness: bevelThickness,
		    bevelSize: bevelSize,
		    bevelEnabled: bevelEnabled,


		});

	    //  var geometry = new THREE.CubeGeometry(10,10,1);
		//var material2 = new THREE.MeshBasicMaterial({ color: 0x000000 });
		textOverMesh = new THREE.Mesh(textOver, material2);

	    //----------------------------------------------------- load winner text
		var textWinner = new THREE.TextGeometry(text3, {

		    size: size2,
		    height: height,
		    curveSegments: curveSegments,

		    font: font,
		    weight: weight,
		    style: style,

		    bevelThickness: bevelThickness,
		    bevelSize: bevelSize,
		    bevelEnabled: bevelEnabled,


		});

	    //  var geometry = new THREE.CubeGeometry(10,10,1);
	    //var material2 = new THREE.MeshBasicMaterial({ color: 0x000000 });
		textWinMesh = new THREE.Mesh(textWinner, material2);
		
		
		

	    //--------- light
		var light = new THREE.AmbientLight(0x404040); // soft white light
		scene.add(light);
		

	var	dirLight = new THREE.DirectionalLight(0xffffff, 1);
		dirLight.color.setHSL(0.1, 1, 0.95);
		dirLight.position.set(-1, 1.75, 1);
		dirLight.position.multiplyScalar(50);
		scene.add(dirLight);
	    ////--------not using
		ground = new Physijs.SphereMesh(new THREE.SphereGeometry(2, 30, 30), ground_material, 0.0);
		ground.position.set( 0, 0, 0 );
		//ground.receiveShadow = true;
		//scene.add( ground );
		var platform_material= new THREE.MeshPhongMaterial({
		    map: THREE.ImageUtils.loadTexture('images/rocks.jpg'),
		    ambient: 0xffffff,
		    specular: 0xAAAAAA,
		    shininess: 100

		});
		var obstacles_material = new THREE.MeshPhongMaterial({
		    map: THREE.ImageUtils.loadTexture('images/stone.jpg'),
		    ambient: 0xffffff,
		    specular: 0xAAAAAA,
		    shininess: 100

		});
        ///-------------------------------      platforms
		platform = new Physijs.BoxMesh(new THREE.BoxGeometry(50, 2, 2), platform_material, 0);
		platform.position.set(18, -1, 0);
		scene.add(platform);

		platform2 = new Physijs.BoxMesh(new THREE.BoxGeometry(50, 2, 2), platform_material, 0);
		platform2.position.set(18, 5, 0);
		scene.add(platform2);

		platform3 = new Physijs.BoxMesh(new THREE.BoxGeometry(10, 2, 2), platform_material, 0);
		platform3.position.set(49, -1, 0);
		scene.add(platform3);

		platform4 = new Physijs.BoxMesh(new THREE.BoxGeometry(5, 2, 2), platform_material, 0);
		platform4.position.set(58, 5, 0);
		scene.add(platform4);

		platform5 = new Physijs.BoxMesh(new THREE.BoxGeometry(5, 2, 2), platform_material, 0);
		platform5.position.set(63, -1, 0);
		scene.add(platform5);

		platform6= new Physijs.BoxMesh(new THREE.BoxGeometry(5, 2, 2), platform_material, 0);
		platform6.position.set(68, 5, 0);
		scene.add(platform6);

	    ///-------------------------------      obstacles

		//obstacle1 = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 1, 1), material, 0);
		//obstacle1.position.set(0, 0.5, 0.5);
		//scene.add(obstacle1);

		//obstacle2 = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 1, 1), material, 0);
		//obstacle2.position.set(2, 3.5, 0.5);
		//scene.add(obstacle2);

		var obsXPos = 0;
		var obsYPos = 0.5;
		for (var i = 0; i < 15; i++)
		{
		    obstacles[i] = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 1, 1), obstacles_material, 0);
		    if (i % 2 == 0) {
		        obstacles[i].position.set(obsXPos, 0.5, 0.5);
		    }
		    else {
		        obstacles[i].position.set(obsXPos, 3.5, 0.5);
		    }
		    obsXPos += 3;

		    scene.add(obstacles[i]);
		}


		var color = new THREE.Color(Math.random() * 1.0, Math.random() * 1.0, Math.random() * 1.0);
		var material = Physijs.createMaterial(
			new THREE.MeshPhongMaterial({
			    ambient: color,
			    color: color,
			    specular: 0xAAAAAA,
			    shininess: 100
			}),
			0.4, 0.5
		);

		var material2 = new THREE.MeshLambertMaterial({
		    map: THREE.ImageUtils.loadTexture('images/earth.jpg')

		});
	    // Create spheres */--------    player 
		drop = new Physijs.SphereMesh(
			new THREE.SphereGeometry(0.5, 30, 30),
			material2, 1);

	    /* Randomly position drops in the 1sky */
		drop.position.set(
			-5,
			1.5,
			0.5
            );
		//drop.position.x += 0.0000001;
		scene.add(drop);
		drop.addEventListener('collision', handleCollision);


	    // Create spheres */--------    enemy 
		var material3 = new THREE.MeshLambertMaterial({
		    map: THREE.ImageUtils.loadTexture('images/earth2.jpg')

		});
	    
		enemy = new Physijs.SphereMesh(
			new THREE.SphereGeometry(0.5, 30, 30),
			material3, 0);

	    /* Randomly position drops in the 1sky */
		enemy.position.set(
			-7,
			1.5,
			0.5
            );
	    //drop.position.x += 0.0000001;
		scene.add(enemy);

        //////////------------------
		enemyPic = new Physijs.SphereMesh(
			new THREE.SphereGeometry(1, 30, 30),
			material3, 0);

	    /* Randomly position drops in the 1sky */
		enemyPic.position.set(
			10,
			-5.5,
			-5
            );
	    //drop.position.x += 0.0000001;
		scene.add(enemyPic);

		

        //---    hidden object
		hidden = new Physijs.BoxMesh(
			new THREE.BoxGeometry(1, 1, 1),
			material, 1);

	    /* Randomly position drops in the sky */
		hidden.position.set(
			-6,
			1.5,
			-19
            );
		scene.add(hidden);

		//scene.setGravity(new THREE.Vector3(0, -500, 0));

	    //////////////////////              FIREWORKS         ///////////////////////////////////////////////////////////////////////////

		emitterSettings = {
		    type: 'sphere',
		    positionSpread: new THREE.Vector3(1, 1, 1),
		    acceleration: new THREE.Vector3(0, -5, 0),
		    radius: 6,
		    speed: 0.06,
		    speedSpread: 2,
		    sizeStart: 2,
		    // sizeStartSpread: 30,
		    sizeEnd: 0.1,
		    opacityStart: 1,
		    opacityMiddle: 1,
		    opacityEnd: 0,
		    colorStart: new THREE.Color('white'),
		    colorStartSpread: new THREE.Vector3(0.5, 0.5, 0.5),
		    colorMiddle: new THREE.Color('red'),
		    colorEnd: new THREE.Color('red'),
		    particlesPerSecond: 3000,
		    alive: 0, // initially disabled, will be triggered later
		    emitterDuration: 0.1
		};

	    // Create a particle group to add the emitter
		this.particleGroup = new ShaderParticleGroup(
        {
            texture: THREE.ImageUtils.loadTexture('images/spark.png'),
            maxAge: 2,
            colorize: 1,
            blending: THREE.AdditiveBlending,
        });

		var colors = ["red", "orange", "yellow", "green", "blue", "violet", "pink", "magenta", "cyan", "steelblue", "seagreen"];
		for (var i = 0; i < colors.length; i++) {
		    emitterSettings.colorMiddle = new THREE.Color(colors[i]);
		    emitterSettings.colorEnd = new THREE.Color(colors[i]);
		    particleGroup.addPool(1, emitterSettings, true);
		}

	    // Add the particle group to the scene so it can be drawn.
		scene.add(particleGroup.mesh);

	    //////////////////////              FIREWORKS END        ///////////////////////////////////////////////////////////////////////////



		/* Init the renderer */
		renderer = new THREE.WebGLRenderer( {antialias: true} );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setClearColor( 0x0099ff, 1 );
		renderer.gammaInput  		= true;
		renderer.gammaOutput 		= true;
		//renderer.shadowMapEnabled 	= true;
		//renderer.shadowMapSoft = true;
		//renderer.shadowMapCullFace 	= THREE.CullFaceBack;

		container.appendChild( renderer.domElement );

		scene.simulate();
		console.log('[END] initScene');
		drop.setLinearVelocity({ z: 0, y: 0, x: 5 });
		hidden.setLinearVelocity({ z: 0, y: 0, x: 10 });
		camera.position.set(hidden.position.x, 2.0, 15);
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );

		//controls.handleResize();
	}

	

	

	function animate() {
	    
	   drop.rotation.x = 0;
	    drop.rotation.y = 0;
	    drop.rotation.z = 0;
	    //drop.position.y = 0;
	    drop.position.z = 0.5;
        ///-----enemy
	    enemy.rotation.x = 0;
	    enemy.rotation.y = 0;
	    enemy.rotation.z = 0;
	    //drop.position.y = 0;
	    enemy.position.z = 0.5;

	    if (keyboard.pressed("space") && canChangeGravity == 1) {////-------> press space to change gravity

	        if (upAndDown == 1) {
	            scene.setGravity(new THREE.Vector3(0, -500, 0));

	        }

	        else {
	            scene.setGravity(new THREE.Vector3(0, 500, 0));
	        }
	   
	         drop.__dirtyPosition = false;
	            canChangeGravity = 0;
	       
	    }

	    if (  (drop.position.y <= 4.5 && drop.position.y >= -0.5 &&
            (camera.position.x - drop.position.x) < 17)
            && winner == 0 && loser == 0) {
	        drop.setLinearVelocity({ z: 0, y: 0, x: 5 });
	        enemy.setLinearVelocity({ z: 0, y: 0, x: 4.5 });
	        hidden.setLinearVelocity({ z: 0, y: 0, x: 5 });
	        camera.position.set(hidden.position.x, 2.0, 15);
	        
	    }
	    else if(winner == 0)
	    {
	        textOverMesh.position.z = 1;
	        textOverMesh.position.y = 0;
	        textOverMesh.position.x = camera.position.x-10;
	        scene.add(textOverMesh);
	        loser = 1;
	    }
	    else if (winner == 1 && loser == 0)
	    {
	        textWinMesh.position.z = 1;
	        textWinMesh.position.y = 0;
	        textWinMesh.position.x = camera.position.x - 13;
	        scene.add(textWinMesh);
	        var delta = clock.getDelta();
	        particleGroup.tick(delta);

	        if (Math.random() < delta) {

	            //particleGroup.triggerPoolEmitter(1, THREE.Vector3(-6, 1.5, 0.5));//randomVector3(-200, 200, 50, 200, -200, -100));
	            //particleGroup.triggerPoolEmitter(1, randomVector3(camera.position.x, 1.5, 0.5, camera.position.x + 4, 1.5, 0.5));
	            particleGroup.triggerPoolEmitter(1, randomVector3(camera.position.x - 10, camera.position.x + 10, -3.5, 3.5, 0.5, 0.5));
	            
	        }
	    }
	    //console.log(drop.position.x);
	    //////////////////////////////////// FIREWORKS  FUNCTION CALL///////////////////////////////

	    if (drop.position.x >= 72)
	    {
	        winner = 1;
	        
	    }
	    
	    //console.log(drop.position.y);
	    requestAnimationFrame(animate);
		render();

	}
	function randomVector3(xMin, xMax, yMin, yMax, zMin, zMax) {
	    return new THREE.Vector3(xMin + (xMax - xMin) * Math.random(),
            yMin + (yMax - yMin) * Math.random(), zMin + (zMax - zMin) * Math.random());
	}

	function render() {
		
		renderer.render( scene, camera );
	}
    //-----------------------   collision function
	function handleCollision(collided_with, linearVelocity, angularVelocity)
	{
	    
	    canChangeGravity = 1;

	    if (collided_with == platform || collided_with == platform3 || collided_with == platform5)
	    {
	        scene.setGravity(new THREE.Vector3(0, -200, 0));
	        //console.log("here");
	        //console.log("1");
	        upAndDown = 0;
	    }
	    else if (collided_with == platform2 || collided_with == platform4 || collided_with == platform6)
	    {
	        scene.setGravity(new THREE.Vector3(0, 200, 0));
	        //console.log("0");
	        upAndDown = 1;
	    }
	    if(collided_with == enemy)
	    {
	        loser = 1;
	    }
	        
	}


	initScene();
	animate();