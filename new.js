var scene, camera, renderer;

init();
render();

function init(){

  var back = 0xffd8eb; // 0xffd8eb
  scene = new THREE.Scene();
  scene.background = new THREE.Color( back );
  // scene.fog = new THREE.FogExp2( back, 0.04 );
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000);
  // camera.position.set(-11,3,25); // Game cam ?
  camera.position.set(0,10,25);

  var texture = new THREE.TextureLoader();
  texture.crossOrigin = true;
  texture.load(
	// resource URL
	'https://maps.googleapis.com/maps/api/staticmap?center=44.8404400,-0.5805000&zoom=10&scale=4&size=1024x1024&key=AIzaSyCqLgPTMNYrr6TMxmC11aXuOxvnogeCDcs',
	// Function when resource is loaded
	function ( texture ) {
    var material = new THREE.MeshPhongMaterial({map: texture});
    var geometry = new THREE.PlaneGeometry(100, 100);
    var floor = new THREE.Mesh( geometry, material );
    floor.rotation.z = 2*Math.PI;
    floor.rotation.x = -Math.PI/2;
    floor.position.set(0,-0.3,0);
    floor.castShadow = true;
    floor.receiveShadow = true;
    scene.add( floor );
	},
	// Function called when download progresses
	function ( xhr ) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},
	// Function called when download errors
	function ( xhr ) {
		console.log( 'An error happened' );
	} );

  material = new THREE.MeshPhongMaterial({color: "rgb(0,0,0)"});
  geometry = new THREE.PlaneGeometry(10000, 10000);
  var floor2 = new THREE.Mesh( geometry, material );
  floor2.rotation.z = 2*Math.PI;
  floor2.rotation.x = -Math.PI/2;
  floor2.position.set(0,-0.4,0);
  floor2.castShadow = false;
  floor2.receiveShadow = false;
  scene.add( floor2 );

  // Renderer

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMapType = THREE.PCFSoftShadowMap;
  renderer.setClearColor (0xffffff, 1);

  document.body.appendChild(renderer.domElement);

  scene.fog = new THREE.Fog( 0x242234, 0, 48 );
  scene.fog.color.setHSL( 1, 0, 1 );

/*
  var hemiLight = new THREE.HemisphereLight( 0xf7f7f7, 0xfffded, 0.75);
  hemiLight.castShadow = true;
  hemiLight.shadowCameraVisible = true;
  hemiLight.position.set( 2000, 500, 0 );
  scene.add( hemiLight );*/

  scene.add(new THREE.AmbientLight(0x666666));

  var light = new THREE.DirectionalLight(0xdfebff, 0.75);
  light.position.set(300, 400, 50);
  light.position.multiplyScalar(1.3);
  light.castShadow = true;
  light.shadowCameraVisible = true;
  light.shadowMapWidth = 512;
  light.shadowMapHeight = 512;
  var d = 25;
  light.shadowCameraLeft = -d;
  light.shadowCameraRight = d;
  light.shadowCameraTop = d;
  light.shadowCameraBottom = -d;
  scene.add( light );

  var geometry = new THREE.BoxGeometry(0.5, 25, 0.5);
  var material = new THREE.MeshBasicMaterial( {color: "rgb(255,255,0)"} );
  var cubie = new THREE.Mesh( geometry, material );
  cubie.position.x = 0;
  cubie.position.z = 0;
  cubie.position.y = 0;
  cubie.castShadow = true;
  cubie.receiveShadow = true;
  scene.add(cubie);
  cubie.add(camera);

  var cubieAxis = new THREE.AxisHelper(20);
  cubie.add(cubieAxis);

  function add_cube(x, y, p){
    var ratio = 3;
  	var geometry = new THREE.BoxGeometry( 0.5, p, 0.5 );
  	var material = new THREE.MeshPhongMaterial( {color: "rgb(0,100,0)"} );
  	var cube = new THREE.Mesh( geometry, material );
  	cube.position.x = x;
  	cube.position.z = y;
  	cube.position.y = 0;
    cube.castShadow = true;
    cube.receiveShadow = true;
  	scene.add(cube);
  }

  for(var i=0; i<data.length; ++i)
    add_cube(data[i][0], data[i][1], data[i][2]);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI/2-0.1;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function render() {
  requestAnimationFrame( render );
  renderer.render( scene, camera );
  controls.update();
}