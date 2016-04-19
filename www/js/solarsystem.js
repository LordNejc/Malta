'use strict';

var SolarSystem = (function () {

    var gui;

    var renderer, cameras, scene, controls, world;

    var planetsMeshes = [];

    var scale = 10000;
    var distance = 5;

    //doda pimena panet v 1 var
    var planetNames = {
        SUN: 'Sun',
        MERCURY: 'Mercury',
        VENUS: 'Venus',
        EARTH: 'Earth',
        MARS: 'Mars',
        JUPITER: 'Jupiter',
        SATURN: 'Saturn',
        URANUS: 'Uranus',
        NEPTUNE: 'Neptune',

    };

    var selectedCamera;



    //uporabi iman im jim v 1 var doda se podatke
    var planets = [

        { name: 'Sun', scale: 69634.2, distance: 0, cameraid: 1, textureUrl: 'img/suns.jpg', camera: null, fov: 45},
        { name: 'Mercury', scale: 2440, distance: 57.91, cameraid: 2, textureUrl: 'img/mercury.jpg', camera: null, fov: 45},
        { name: 'Venus', scale: 6052, distance: 108.2, cameraid: 3, textureUrl: 'img/venus.jpg', camera: null, fov: 45},
        { name: 'Earth', scale: 6371, distance: 149.6, cameraid: 4, textureUrl: 'img/earth.jpg', camera: null, fov: 45},
        { name: 'Mars', scale: 3390, distance: 227.9, cameraid: 5, textureUrl: 'img/mars.jpg', camera: null, fov: 45},
        { name: 'Jupiter', scale: 69911/2, distance: 778.5/1.5, cameraid: 6, textureUrl: 'img/jupiter.jpg', camera: null, fov: 45},
        { name: 'Saturn', scale: 58232/2, distance: 1433/1.8, cameraid: 7, textureUrl: 'img/saturn.png', camera: null, fov: 45},
        { name: 'Uranus', scale: 25362/2, distance: 2877/2.87, cameraid: 8, textureUrl: 'img/uranus.jpg', camera: null, fov: 45},
        { name: 'Neptune', scale: 24622/2, distance: 4498/3.8, cameraid: 9, textureUrl: 'img/neptune.jpg', camera: null, fov: 45},
    ];

    var SolarGUI = (function () {

        function SolarGUI() {
            this.cameras = null;
        }

        SolarGUI.prototype.setCameras = function (cameras) {
            this.cameras = cameras;
        };

        SolarGUI.prototype.getCameras = function () {
            return this.cameras;
        };


        return SolarGUI;


    })();

    function setupGUI() {

        var solarGUI = new SolarGUI();

        gui = new dat.GUI();

        var planetNames = [];

        for(var i = 0; i < planets.length; i++){
            planetNames.push(planets[i].name);
        }

        solarGUI.setCameras(planetNames);

        var cameraSetup = gui.add(solarGUI, 'cameras', solarGUI.getCameras());

        cameraSetup.onChange(function (value) {
           setSelectedCamera(value);
        });


    }


    //pridobi ime planeta z for stavkom
    function getPlanet(name) {
        for(var i = 0; i < planets.length; i++){
            if(planets[i].name === name)return planets[i];
        }
    }


    //dobi mesh planeta
    function getPlanetMesh(name) {

        for(var i = 0; i < planetsMeshes.length; i++) {
            if (planetsMeshes[i].planetID === name) {
                return planetsMeshes[i];
            }
        }
    }

    function SolarSystem() {

        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;

        scene = null;
        renderer = null;
        cameras = [];
        world = null;

        controls = null;

    }




    function render() {
        controls.update();


        renderer.render(scene, selectedCamera);

        requestAnimationFrame(render);
    }



    SolarSystem.prototype.init = function (callback) {



        //Init Scene
        scene = new THREE.Scene(); //naredi sceno






        //Init Renderera
        renderer = new THREE.WebGLRenderer({ antialias: true }); //naredi renderer
        renderer.setSize( this.WIDTH, this.HEIGHT );
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;

        document.body.appendChild(renderer.domElement);



        //Init World

        world = new Goblin.World(new Goblin.SAPBroadphase(), new Goblin.NarrowPhase(), new Goblin.IterativeSolver());


        //doda vse planete in ustvari kamere
        for(var i = 0; i < planets.length; i++){

            scene.add(createPlanetMesh(planets[i].name));
            scene.add(createCamera(planets[i].name, this.WIDTH, this.HEIGHT));

        }


        //doloci iybrano kamero
        setSelectedCamera(planetNames.SUN);

        var rgeometry = new THREE.RingGeometry(4, 7, 50, 50);
        //var rmaterial = new THREE.MeshBasicMaterial( { color: 0xfcfac9, side: THREE.DoubleSide } );
        var rmaterial = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('img/saturnring.png'), side: THREE.DoubleSide});
        var rmesh = new THREE.Mesh(rgeometry, rmaterial);

        rmesh.position.set(1433/1.8/distance, 0, 0);
        scene.add(rmesh);

        //Setup Lights
        addDirectionalLight.call(this);

        renderer.render(scene, selectedCamera);

        //nardi svet
        if(callback)callback();


        setupGUI();

        render();

    };


    SolarSystem.prototype.setGlobalGravity = function (x, y, z) {
        if(world){
            world.gravity.x = x;
            world.gravity.y = y;
            world.gravity.z = z;
        }
    };

    //izbere kamero glede na ime planeta
    function setSelectedCamera(planetName) {

        var planet = getPlanet(planetName);
        var camera = planet.camera;

        selectedCamera = camera;

        var position = getPlanetMesh(planetName).position;

        controls = new THREE.TrackballControls(camera, renderer.domElement);

        controls.target = position;

    }




    function createPlanetMesh(name){

        var planet = getPlanet(name);



        var geometry = new THREE.SphereGeometry(planet.scale/scale, 50, 50);
        var material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(planet.textureUrl)});
        var mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(planet.distance/distance, 0, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.planetID = name;

        planetsMeshes.push(mesh);

        return mesh;

    }

    function createCamera(planetName, screenWidth, screenHeight) {

        var cameraNear = 0.1;
        var cameraFar = 20000;

        var planet = getPlanet(planetName);

        var camera = new THREE.PerspectiveCamera(planet.fov, screenWidth / screenHeight, cameraNear, cameraFar);

        var planetScale = planet.scale;

        var ps = planetScale / scale;

        if(ps < 0){
            ps = 1;
        }else if(ps > 0 && ps < 5){
            ps = 5;
        }else if(ps > 5 && ps < 15){
            ps = 15;
        }


        camera.position.set(planet.distance/distance, ps*3 , ps*3);

        camera.lookAt(getPlanetMesh(planetName).position);

        planet.camera = camera;

        return camera;

    }

    function addDirectionalLight() {

       /* var light = new THREE.DirectionalLight( 0xFFFFFF );
        light.position.set( 5, -5, 5);
        light.target.position.copy( scene.position );
        light.castShadow = true;
        light.shadowCameraLeft = -60;
        light.shadowCameraTop = -60;
        light.shadowCameraRight = 60;
        light.shadowCameraBottom = 60;
        light.shadowCameraNear = 20;
        light.shadowCameraFar = 200;
        light.shadowBias = -.0001;
        light.shadowMapWidth = light.shadowMapHeight = 2048;
        light.shadowDarkness = .7;
        scene.add(light);

        */
        //original


        var light = new THREE.AmbientLight(0xFFFFFF);
        light.position.set(0, 0, 0);
        scene.add(light);



    }
    
    return SolarSystem;


})();