if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var scene, camera, renderer;
var API_Key = 'AIzaSyCqLgPTMNYrr6TMxmC11aXuOxvnogeCDcs';
var container = document.getElementById( 'canvas' );
document.body.appendChild( container );

function init(events){

  var back = 0xffd8eb;
  scene = new THREE.Scene();
  scene.background = new THREE.Color( back );
  //scene.fog = new THREE.FogExp2( back, 0.04 );
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100);
  // camera.position.set(-11,3,25); // Game cam ?
  camera.position.set(0,10,25);


  var zoom = 12;

  /*
  var m4pixel = 156543.03392 * Math.cos(latitude * Math.PI / 180) / Math.pow(2, zoom);
  var tileSize = 512;
  var initialResolution = 2 * Math.PI * 6378137 / tileSize;
  var originShift = 2 * Math.PI * 6378137 / 2.0;

  function LatLonToMeters( lat, lon ){
    var m = [];
        m[0] = lon * originShift / 180.0
        m[1] = Math.log( Math.tan((90 + lat) * Math.PI / 360.0 )) / (Math.PI / 180.0)

        m[1] = m[1] * originShift / 180.0
        return m;
  }


function MetersToPixels( mx, my, zoom){
  var p = [];
  var res = m4pixel;
  p[0] = (mx + originShift) / res;
  p[1] = (my + originShift) / res;
  return p;
}


var p = LatLonToMeters(MetersToPixels( latitude, longitude, zoom));
console.log(p);


  var lat_dif = 0.06246550898534858;
  var lng_dif = 0.08774443833097914;
  console.log(m4pixel);

  */
  function make_plan(lat, lng){
    var texture = new THREE.TextureLoader();
    texture.crossOrigin = true;
    texture.load(
  	// resource URL
  	'https://maps.googleapis.com/maps/api/staticmap?center='+lat+','+lng+'&zoom='+zoom+'&scale=4&size=512x512&key='+API_Key,
  	// Function when resource is loaded
  	function ( texture ) {
      var material = new THREE.MeshPhongMaterial({map: texture});
      var geometry = new THREE.PlaneGeometry(48, 48);
      var floor = new THREE.Mesh( geometry, material );
      floor.rotation.z = 2*Math.PI;
      floor.rotation.x = -Math.PI/2;
      floor.position.set(latitude-lat, -0.3, longitude-lng);
      floor.castShadow = true;
      floor.receiveShadow = true;
      scene.add(floor);
  	},
  	// Function called when download progresses
  	function ( xhr ) {
  		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  	},
  	// Function called when download errors
  	function ( xhr ) {
  		console.log( 'An error happened' );
  	} );
  }

  make_plan(latitude, longitude);

  material = new THREE.MeshPhongMaterial({color: "rgb(255,255,255)"});
  geometry = new THREE.PlaneGeometry(1000, 1000);
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
  container.appendChild( renderer.domElement );
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMapType = THREE.PCFSoftShadowMap;
  renderer.setClearColor (0xffffff, 1);

  document.body.appendChild(renderer.domElement);

  scene.fog = new THREE.Fog( 0x242234, 0, 128 );
  scene.fog.color.setHSL( 1, 0, 1 );

  /*
  var hemiLight = new THREE.HemisphereLight( 0xf7f7f7, 0xfffded, 0.1);
  hemiLight.castShadow = true;
  hemiLight.shadowCameraVisible = true;
  hemiLight.position.set( 2000, 500, 0 );
  scene.add( hemiLight );
  */

  var light = new THREE.AmbientLight(0x666666);
  scene.add(light);


  light = new THREE.DirectionalLight(0xdfebff, 0.75);
  light.position.set(300, 400, 50);
  light.position.multiplyScalar(1.3);
  light.castShadow = true;
  light.shadowMapWidth = 2048;
  light.shadowMapHeight = 2048;
  light.shadowBias = 0.0001;
  light.shadowDarkness = 0.2;
  scene.add( light );

  var darkMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );
	var wireframeMaterial = new THREE.MeshPhongMaterial( { color: "rgb(10,10,10)", wireframe: true, transparent: true } );
	var multiMaterial = [ darkMaterial, wireframeMaterial ];
  var shape = THREE.SceneUtils.createMultiMaterialObject(
		new THREE.TorusGeometry( 1.2, 0.4, 8, 4 ),
		multiMaterial );
	shape.position.set(0, 1.2, 0);
  shape.castShadow = true;
  shape.receiveShadow = true;
	scene.add( shape );
  shape.add( camera );

/*
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
  */
  var top = 8;

  function add_cube(x, y, p){
    var ratio = 3;
  	var geometry = new THREE.BoxGeometry( 0.5, p, 0.5 );
    if(p==0)
      var material = new THREE.MeshPhongMaterial( {color: 'rgb(0,255,0)'});
    else if(p>0 && p<=10)
      var material = new THREE.MeshPhongMaterial( {color: 'rgb(0,200,0)'});
    else if(p>10 && p<=30)
      var material = new THREE.MeshPhongMaterial( {color: 'rgb(200,200,0)'});
    else if(p>30 && p<=50)
      var material = new THREE.MeshPhongMaterial( {color: 'rgb(200,0,0)'});
    else
      var material = new THREE.MeshPhongMaterial( {color: 'rgb(255,0,0)'});
    console.log(x, y);
  	var cube = new THREE.Mesh( geometry, material );
  	cube.position.x = x;
  	cube.position.z = y;
  	cube.position.y = 0;
    cube.castShadow = true;
    cube.receiveShadow = true;
  	scene.add(cube);
  }

  for(var i=0; i<events.length; ++i){
    var tmp = [];
    tmp[0] = -(-events[i]._geoloc.lat+latitude)*240;
    tmp[1] = -(events[i]._geoloc.lng-longitude)*240;
    console.log(tmp);
    if(events[i].price.value==0)
      add_cube(tmp[0], tmp[1], top);
    else
      add_cube(tmp[0], tmp[1], top-Math.log(events[i].price.value));
    }
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
