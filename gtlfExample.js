import * as THREE from "../build/three.module.js";

import { OrbitControls } from "./jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "./jsm/loaders/RGBELoader.js";
import { RoughnessMipmapper } from "./jsm/utils/RoughnessMipmapper.js";

var container, controls;
var camera, scene, renderer;

init();
render();

function init() {
	container = document.createElement("div");
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		0.25,
		20
	);
	camera.position.set(-1.8, 0.6, 2.7);

	scene = new THREE.Scene();

	new RGBELoader()
		.setDataType(THREE.UnsignedByteType)
		.setPath("textures/equirectangular/")
		.load("royal_esplanade_1k.hdr", function (texture) {
			var envMap = pmremGenerator.fromEquirectangular(texture).texture;

			scene.background = envMap;
			scene.environment = envMap;

			texture.dispose();
			pmremGenerator.dispose();

			render();

			// model

			// use of RoughnessMipmapper is optional
			var roughnessMipmapper = new RoughnessMipmapper(renderer);

			var loader = new GLTFLoader().setPath(
				"models/gltf/DamagedHelmet/glTF/"
			);
			loader.load("DamagedHelmet.gltf", function (gltf) {
				gltf.scene.traverse(function (child) {
					if (child.isMesh) {
						// TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
						// roughnessMipmapper.generateMipmaps( child.material );
					}
				});

				scene.add(gltf.scene);

				roughnessMipmapper.dispose();

				render();
			});
		});

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	renderer.outputEncoding = THREE.sRGBEncoding;
	container.appendChild(renderer.domElement);

	var pmremGenerator = new THREE.PMREMGenerator(renderer);
	pmremGenerator.compileEquirectangularShader();

	controls = new OrbitControls(camera, renderer.domElement);
	controls.addEventListener("change", render); // use if there is no animation loop
	controls.minDistance = 2;
	controls.maxDistance = 10;
	controls.target.set(0, 0, -0.2);
	controls.update();

	window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

	render();
}

//

function render() {
	renderer.render(scene, camera);
}
