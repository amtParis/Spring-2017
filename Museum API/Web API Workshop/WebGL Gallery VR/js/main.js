
var token = "7ab6f2ee8f4b3755339c9257df268b51";
var url = "https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.objects.getRandom&access_token="+token+"&has_image=1";
var wallCount = 0;
var totalLoaded = 0;
var roomSize = 250;

//--- GLOBALS
var scene, camera, renderer, controls, effect, container, painting;
var paintings = [];
var useVR = true;

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
    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = -1;
    camera.position.y = -roomSize*.15;
    camera.rotation.y = Math.PI;
    camera.up = new THREE.Vector3(0,0,1);
    scene.add(camera);            

        controls = new THREE.DeviceOrientationControls(camera, true);

    addRoom();
    addLights();

    // request first images
    getJSON(url,cooperHewittResponse);
    

    // event listeners
    window.addEventListener( 'resize', onWindowResize, false );    
    window.addEventListener('deviceorientation', setOrientationControls, true);
    document.addEventListener('keydown',onDocumentKeyDown,false);

    container.onclick = function() { fullscreen(); }

}

function onDocumentKeyDown(event){
    switch(event.keyCode){
        case 32: 
            getJSON(url,cooperHewittResponse);
            break;
        case 38:
            camera.translateZ(-10);//+= 10;
            break;
        case 40:
            camera.translateZ(10);
            break;
        case 39:
            camera.rotation.y -= Math.PI * .05;
            break;
        case 37:
            camera.rotation.y += Math.PI * .05;
            break;
        case 86:
            //v
            useVR = !useVR;
            break;
    }
}

//--- MAIN LOOP
function animate(){

 controls.update();
  if(useVR) effect.render(scene, camera);
  else renderer.render(scene, camera);
  
  requestAnimationFrame(animate);
  
}



//---------- SCENE OBJECT METHODS
function addLights(){
    
    pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set( 0, 50, 0 );
    scene.add(pointLight);
    scene.add(new THREE.PointLightHelper(pointLight, 1));

    
    var hemLight = new THREE.HemisphereLight(0xffffff, 0xffffff, .81);
    scene.add(hemLight);


}

function addFrames(imageUrl,width,height){

    var texloader = new THREE.TextureLoader();
    texloader.load(imageUrl, function(tex) {

        var scaleRatio = width / height;
        var scaleH = (roomSize * .5) * .75;

        var geometry = new THREE.PlaneGeometry(scaleH*scaleRatio, scaleH);
        var material = new THREE.MeshBasicMaterial({  map : tex });
        
        if(wallCount > 3) wallCount = 0;

        scene.remove( paintings[wallCount] );
        paintings[wallCount] = new THREE.Mesh(geometry, material);
        paintings[wallCount].position.y = 0;//(roomSize*.25)-(scaleH*.5);
            
        var roomZ = (roomSize*.5) - 1;


        if(wallCount == 0){
            paintings[wallCount].position.z = roomZ;
            paintings[wallCount].rotation.y = Math.PI;

        }else if(wallCount == 1){
            paintings[wallCount].position.x = -roomZ;
            paintings[wallCount].rotation.y = Math.PI*.5;
        }else if(wallCount == 2){
            paintings[wallCount].position.z = -roomZ;
            //painting.rotation.y = -Math.PI * .5;
        }else{
            paintings[wallCount].position.x = roomZ;
            paintings[wallCount].rotation.y = -Math.PI*.5;
        }

        scene.add( paintings[wallCount] ); 
        wallCount++;
        
        // make sure we have 4 to start with
        if(totalLoaded<3){
         totalLoaded++;
         getJSON(url,cooperHewittResponse);
        
        }

    });
}

function addRoom(){
    
    var texture = new THREE.TextureLoader().load( "http://csugrue.com/parsons/oai/gallery-vr/textures/wood.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 4, 4 );

    var materials = [
        new THREE.MeshPhongMaterial( { color: 0xffffff, side: THREE.BackSide } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff, side: THREE.BackSide } ),
        new THREE.MeshPhongMaterial( { color: 0xe1e1e1, side: THREE.BackSide } ),
        new THREE.MeshBasicMaterial({
           map: texture,
           side: THREE.BackSide
        }),
        new THREE.MeshPhongMaterial( { color: 0xffffff, side: THREE.BackSide } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff, side: THREE.BackSide } )
    ];

    var geometry = new THREE.CubeGeometry(roomSize, roomSize*.5, roomSize, 1, 1, 1);
    var room = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
    //room.position.y = 0;//roomSize*.15;
    //room.receiveShadow = true;
    scene.add( room ); 
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

//--------- DEVICE CONTROLS
function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    window.removeEventListener('deviceorientation', setOrientationControls, true);
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

//--------- API Functions
function cooperHewittResponse(err,data){
    if (err != null) {
        alert("Something went wrong: " + err);
    } else {
        //var expo = JSON.parse(data.object);
        console.log(data.object);

        var imageUrl = data.object.images[0].z.url;
        var width = data.object.images[0].z.width;
        var height = data.object.images[0].z.height;

        addFrames(imageUrl,width,height,wallCount);
        

        //alert("Your query count: " + data.query.count);
    }
}

function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
};