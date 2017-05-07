if(!Detector.webgl) Detector.addWebGLMessage();

// nice black color 		-> 0x252525
// nice grey/white color  	-> 0xd4d4d4

var container = document.getElementById( 'container' );

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x252525 );
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 1, 1000 );
camera.position.z = 1000;

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;

controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', render ); // remove when using animation loop
// enable animation loop when using damping or autorotation
// controls.enableDamping = true;
// controls.dampingFactor = 0.25;
controls.enableZoom = false;
/*
var loader = new THREE.TextureLoader();
loader.load( 'texture.jpg', function ( texture ) {
	var geometry = new THREE.SphereGeometry( 200, 20, 20 );
	var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
	var mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
} ); */

var light = new THREE.DirectionalLight(0xffffff);
light.position.set(1, 1, 1);
scene.add(light);

light = new THREE.DirectionalLight(0x002288);
light.position.set(-1, -1, -1);
scene.add(light);

light = new THREE.AmbientLight(0x222222);
scene.add(light);

function add_cube(x, y, z){
	var geometry = new THREE.BoxGeometry( 3, 3, 3 );
	var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
	var cube = new THREE.Mesh( geometry, material );
	cube.position.x = x;
	cube.position.y = y;
	cube.position.z = z;
	scene.add(cube);
}

add_cube(0, 0, 0);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

var render = function () {
	requestAnimationFrame( render );
	renderer.render(scene, camera);
	controls.update();
};

render();
