import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer, TextureLoader } from "expo-three";
import OrbitControlsView from "expo-three-orbit-controls";
import * as React from "react";
import {
	AmbientLight,
	BoxBufferGeometry,
	Fog,
	GridHelper,
	Mesh,
	MeshStandardMaterial,
	PerspectiveCamera,
	PointLight,
	Scene,
	SpotLight,
	Camera,
	AnimationMixer,
	PlaneBufferGeometry,
	MeshPhongMaterial,
	HemisphereLight,
	DirectionalLight,
} from "three";
import { FBXLoader } from "./node_modules/three/examples/jsm/loaders/FBXLoader";

export default function App() {
	const [camera, setCamera] = React.useState<Camera | null>(null);

	let timeout;

	React.useEffect(() => {
		// Clear the animation loop when the component unmounts
		return () => clearTimeout(timeout);
	}, []);

	const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
		const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
		const sceneColor = "#efefef";

		// Create a WebGLRenderer without a DOM element
		const renderer = new Renderer({ gl });
		renderer.setSize(width, height);
		renderer.setClearColor(sceneColor);

		// const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
		const camera = new PerspectiveCamera(45, width / height, 1, 2000);
		// camera.position.set(2, 5, 5);
		camera.position.set(300, 300, 300);

		setCamera(camera);

		const scene = new Scene();
		scene.fog = new Fog(sceneColor, 1, 10000);
		// scene.add(new GridHelper(10, 10));
		var grid = new GridHelper(2000, 20, 0x000000, 0x000000);
		// grid.material.opacity = 0.2;
		// grid.material.transparent = true;
		scene.add(grid);

		var light = new HemisphereLight(0xffffff, 0x444444);
		light.position.set(0, 200, 0);
		scene.add(light);

		var light2 = new DirectionalLight(0xffffff);
		light2.position.set(0, 200, 100);
		light2.castShadow = true;
		light2.shadow.camera.top = 180;
		light2.shadow.camera.bottom = -100;
		light2.shadow.camera.left = -120;
		light2.shadow.camera.right = 120;
		scene.add(light2);

		// const ambientLight = new AmbientLight(0x101010);
		// scene.add(ambientLight);

		// const pointLight = new PointLight(0xffffff, 2, 1000, 1);
		// pointLight.position.set(0, 200, 200);
		// scene.add(pointLight);

		// const spotLight = new SpotLight(0xffffff, 0.5);
		// spotLight.position.set(0, 500, 100);
		// spotLight.lookAt(scene.position);
		// scene.add(spotLight);

		// ground
		// var mesh = new Mesh(
		// 	new PlaneBufferGeometry(2000, 2000),
		// 	new MeshPhongMaterial({ color: 0x999999, depthWrite: false })
		// );
		// mesh.rotation.x = -Math.PI / 2;
		// mesh.receiveShadow = true;
		// scene.add(mesh);

		var loader = new FBXLoader();
		console.log(loader);
		// loader.load("./test.fbx", (object) => {
		loader.load(
			"https://threejs.org/examples/models/fbx/Samba%20Dancing.fbx",
			(object) => {
				console.log(object.children);
				var mixer = new AnimationMixer(object);

				var action = mixer.clipAction(object.animations[0]);
				action.play();

				// object.traverse(function (child) {
				// 	if (child.isMesh) {
				// 		child.castShadow = true;
				// 		child.receiveShadow = true;
				// 	}
				// });

				scene.add(object);
			}
		);
		console.log(
			"loaderloaderloaderloaderloaderloaderloaderloaderloaderloaderloaderloaderloader"
		);

		console.log(loader);

		// const cube = new IconMesh();
		// scene.add(cube);

		// camera.lookAt(cube.position);

		// function update() {
		// 	cube.rotation.y += 0.05;
		// 	cube.rotation.x += 0.025;
		// }

		// Setup an animation loop
		const render = () => {
			timeout = requestAnimationFrame(render);
			// update();
			renderer.render(scene, camera);

			// ref.current.getControls()?.update();
			gl.endFrameEXP();
		};
		render();
	};

	return (
		<OrbitControlsView style={{ flex: 1 }} camera={camera}>
			<GLView
				style={{ flex: 1 }}
				onContextCreate={onContextCreate}
				key="d"
			/>
		</OrbitControlsView>
	);
}

class IconMesh extends Mesh {
	constructor() {
		super(
			new BoxBufferGeometry(1.0, 1.0, 1.0),
			new MeshStandardMaterial({
				map: new TextureLoader().load(require("./icon.jpg")),
			})
		);
	}
}
