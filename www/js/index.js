'use strict';



var solarSystem;

var app =
{
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        solarSystem = new SolarSystem();
        solarSystem.init(setGravity);

    }
};

function setGravity() {
    solarSystem.setGlobalGravity(0,0,0);
    console.log(solarSystem);
}

function render() {
    controls.update();
    requestAnimationFrame( render );
    renderer.render( scene, camera );
    render_stats.update();
};




/*
createShape = (function() {
    var addshapes = true,
        shapes = 0,
        box_geometry = new THREE.BoxGeometry( 3, 3, 3 ),
        sphere_geometry = new THREE.SphereGeometry( 1.5, 32, 32 ),
        cylinder_geometry = new THREE.CylinderGeometry( 2, 2, 1, 32 ),
        cone_geometry = new THREE.CylinderGeometry( 0, 2, 4, 32 ),
        octahedron_geometry = new THREE.OctahedronGeometry( 1.7, 1 ),
        torus_geometry = new THREE.TorusKnotGeometry ( 1.7, .2, 32, 4 ),
        doCreateShape;

    setTimeout(
        function addListener() {
            var button = document.getElementById( 'mybutton' );
            if ( button ) {
                button.addEventListener( 'click', function() { runApp(); } );
            } else {
                setTimeout( addListener );
            }
        }
    );

    doCreateShape = function() {

        if(objects.length>=4)return;

        var shape, material = new THREE.MeshLambertMaterial({ opacity: 0, transparent: true });

        switch ( Math.floor(Math.random() * 6) ) {
            case 0:
                shape = new Physijs.BoxMesh(
                    box_geometry,
                    material
                );
                break;

            case 1:
                shape = new Physijs.SphereMesh(
                    sphere_geometry,
                    material,
                    undefined,
                    { restitution: Math.random() * 1.5 }
                );
                break;

            case 2:
                shape = new Physijs.CylinderMesh(
                    cylinder_geometry,
                    material
                );
                break;

            case 3:
                shape = new Physijs.ConeMesh(
                    cone_geometry,
                    material
                );
                break;

            case 4:
                shape = new Physijs.ConvexMesh(
                    octahedron_geometry,
                    material
                );
                break;

            case 5:
                shape = new Physijs.ConvexMesh(
                    torus_geometry,
                    material
                );
                break;



        }
        shape.material.color.setRGB( Math.random() * 100 / 100, Math.random() * 100 / 100, Math.random() * 100 / 100 );
        shape.castShadow = true;
        shape.receiveShadow = true;

        shape.position.set(
            Math.random() * 30 - 15,
            20,
            Math.random() * 30 - 15
        );

        if(shape.position.y <= 3){



        }

        shape.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        if ( addshapes ) {
            shape.addEventListener( 'ready', createShape );
        }
        scene.add( shape );

        console.log(shape);

        objects.push(shape);

        new TWEEN.Tween(shape.material).to({opacity: 1}, 500).start();

        //document.getElementById( 'shapecount' ).textContent = ( ++shapes ) + ' shapes created';
    };

    return function() {
        setTimeout( doCreateShape, 250 );
    };
})();
*/
app.initialize();

function runApp() {
    for(var i=0; i < objects.length; i++){
        scene.remove(objects[i]);
    }
    objects = [];

    createShape();
}

/*
var physis = function () {

    return;

    TWEEN.start();



    //renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;

    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById( 'viewport' ).appendChild( renderer.domElement );

    console.log('Renderer started');

    //Stats
    render_stats = new Stats();
    render_stats.domElement.style.position = 'absolute';
    render_stats.domElement.style.top = '0px';
    render_stats.domElement.style.zIndex = 100;
    document.getElementById( 'viewport' ).appendChild( render_stats.domElement );

    console.log('Stat running');

    physics_stats = new Stats();
    physics_stats.domElement.style.position = 'absolute';
    physics_stats.domElement.style.top = '50px';
    physics_stats.domElement.style.zIndex = 100;
    document.getElementById( 'viewport' ).appendChild( physics_stats.domElement );

    scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
    scene.setGravity(new THREE.Vector3( 0, -300, 0 ));


    scene.addEventListener
    (
        'update',
        function()
        {
            scene.simulate( undefined, 2 );
            physics_stats.update();
        }
    );

    camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set( 60, 50, 60 );
    camera.lookAt( scene.position );
    scene.add( camera );

    controls = new THREE.TrackballControls(camera,render.domElement);

    // Light
     light = new THREE.DirectionalLight( 0xFFFFFF );
     light.position.set( 20, 40, -15 );
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
     scene.add( light );


    // Materials
    ground_material = Physijs.createMaterial(
        //new THREE.MeshLambertMaterial({ color: 0xAA0000, opacity: 1, transparent: true }),
        new THREE.MeshLambertMaterial({color: 0xFFFFFF, opacity: 1, transparent: true }),
        .8, // high friction
        100 // low restitution
    );
    //ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
    //ground_material.map.repeat.set( 2.5, 2.5 );

    // Ground
    ground = new Physijs.BoxMesh(

        new THREE.BoxGeometry(50, 2, 50),
        ground_material,
        0 // mass
    );

    ground.receiveShadow = true;
    scene.add( ground );

     // Bumpers
     var bumper;
     var bumper_geom = new THREE.BoxGeometry(2, 50, 50);

     bumper = new Physijs.BoxMesh( bumper_geom, ground_material, 0, { restitution: .2 } );
     bumper.position.y = 25;
     bumper.position.x = -24;
     bumper.receiveShadow = true;
     bumper.castShadow = true;
     scene.add( bumper );

     bumper = new Physijs.BoxMesh( bumper_geom, ground_material, 0, { restitution: .2 } );
     bumper.position.y = 25;
     bumper.position.x = 24;
     bumper.receiveShadow = true;
     bumper.castShadow = true;
     scene.add( bumper );

     bumper = new Physijs.BoxMesh( bumper_geom, ground_material, 0, { restitution: .2 } );
     bumper.position.y = 25;
     bumper.position.z = -24;
     bumper.rotation.y = Math.PI / 2;
     bumper.receiveShadow = true;
     bumper.castShadow = true;
     scene.add( bumper );

     bumper = new Physijs.BoxMesh( bumper_geom, ground_material, 0, { restitution: .2 } );
     bumper.position.y = 25;
     bumper.position.z = 24;
     bumper.rotation.y = Math.PI / 2;
     bumper.receiveShadow = true;
     bumper.castShadow = true;
     scene.add( bumper );

     requestAnimationFrame(render);
     scene.simulate();

     createShape();

};
    */