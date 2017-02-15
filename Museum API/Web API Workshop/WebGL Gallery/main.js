//--- GLOBALS
var scene, camera, renderer, controls, container, effect;


//--- START APP
init();
animate();

//--- SETUP
function init(){

    // create the rendereer and set its size
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.setClearColor( 0xffffff );

    effect = new THREE.StereoEffect(renderer);


    container = document.getElementById( 'world' );
    container.appendChild( renderer.domElement );

    // create and set up the scene
    scene = new THREE.Scene();

    // set up a camera with fov, aspect ratio, near, far clipping places
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 5;
    camera.position.y= 1;
    scene.add(camera);            

    //--- controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.rotateUp(Math.PI / 4);
    controls.target.set(
        camera.position.x + 0.1,
        camera.position.y,
        camera.position.z
    );

    addFloor(0,1000);
    addCube();
    addLights();

 
    // event listeners
    window.addEventListener('deviceorientation', setOrientationControls, true);
    window.addEventListener( 'resize', onWindowResize, false );
    // container.onclick = function() { fullscreen(); }

}



//--- MAIN LOOP
function animate(){

  controls.update();
  effect.render(scene, camera);
  requestAnimationFrame(animate);
  
}



//---------- SCENE OBJECT METHODS

function addFloor(yOffset,size){

    var texture = THREE.ImageUtils.loadTexture('textures/checker.png');
    texture.wrapS = THREE.RepeatWrapping; // repeat x
    texture.wrapT = THREE.RepeatWrapping; // repeat y
    texture.repeat = new THREE.Vector2(20, 20); // repeat 20 times
    texture.anisotropy = renderer.getMaxAnisotropy(); // sharpest image

    var material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: texture // set the texure map
    });

    // var material = new THREE.MeshLambertMaterial( { color: 0x68c3c0, side: THREE.DoubleSide } ); 
    
    var geometry = new THREE.PlaneGeometry(size,size);
    var plane = new THREE.Mesh(geometry,material);
    plane.rotation.x = -Math.PI/2.0;
    plane.position.y = yOffset;
    plane.receiveShadow = true; 
    scene.add( plane);
}

function addLights(){
    
    var light = new THREE.AmbientLight( 0x808080 ); // soft white light
    scene.add( light );

    var shadowLight = new THREE.DirectionalLight(0xffffff, .5);
    shadowLight.position.set(10, 50, 10);
    shadowLight.castShadow = true;
    scene.add(shadowLight);
}

function addCube(){
    
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshLambertMaterial( { color: 0x68c3c0 } );
    
    // make a mesch with geometry and material and add it to the scene
    var cube = new THREE.Mesh( geometry, material );
    cube.castShadow = true;
    cube.position.set(0,2,0);
    cube.rotation.set(Math.PI/4,Math.PI/4,0);
    scene.add( cube ); 
}


//--------- DEVICE CONTROLS
function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    //element.addEventListener('click', fullscreen, false);

    window.removeEventListener('deviceorientation', setOrientationControls, true);
}

//--------- WINDOW
function onWindowResize() {
    
    var width = window.innerWidth;
    var height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);

}


function fullscreen() {
    if (container.requestFullscreen) {
    container.requestFullscreen();
    } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
    } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
    }
}   
