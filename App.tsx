import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer } from "expo-three";
import OrbitControlsView from "expo-three-orbit-controls";
import * as React from "react";
import {
	Fog,
	GridHelper,
	PerspectiveCamera,
	Scene,
	Camera,
	AnimationMixer,
	HemisphereLight,
	DirectionalLight,
	Clock,
	LOD,
} from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Asset } from "expo-asset";

export default function App() {
	const [camera, setCamera] = React.useState<Camera | null>(null);
	let mixer;
	let timeout;
	var clock = new Clock();

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

		const camera = new PerspectiveCamera(90, width / height, 1, 2000);
		camera.position.set(200, 300, 400);

		setCamera(camera);

		const scene = new Scene();
		scene.fog = new Fog(sceneColor, 1, 10000);
		var grid = new GridHelper(2000, 20, 0x000000, 0x000000);

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

		// var loader = new GLTFLoader();
		var loader = new FBXLoader();
		loader.load(
			// "https://github.com/Abhimanyu-Jha/tweek-app/raw/master/Zombie%20Stand%20Up.fbx",
			// "https://github.com/Abhimanyu-Jha/tweek-app/blob/master/Capoeira.fbx",
			"https://threejs.org/examples/models/fbx/Samba%20Dancing.fbx",
			// "scene.gltf",
			// "./test.fbx",
			// "Zombie Stand Up.fbx",
			async (object) => {
				// console.log(object.animations[0]);
				// var loader2 = new GLTFLoader();
				// const asset = Asset.fromModule(
				// 	require("./Zombie Stand Up.fbx")
				// );
				// console.log("starting.....");
				// await asset.downloadAsync().catch((err) => {
				// 	console.error(err);
				// });
				// console.log("got the asset");
				// console.log(asset.localUri);
				var loader2 = new FBXLoader();
				loader2.load(
					// "https://github.com/Abhimanyu-Jha/tweek-app/raw/master/Zombie%20Stand%20Up.fbx",
					"https://threejs.org/examples/models/fbx/Samba%20Dancing.fbx",
					// asset.localUri,
					(object2) => {
						console.log(object2.animations[0]);
						mixer = new AnimationMixer(object);
						var action = mixer.clipAction(object2.animations[0]);
						action.play();

						object.traverse(function (child) {
							if (child.isMesh) {
								child.castShadow = true;
								child.receiveShadow = true;
							}
						});
						var lod = new LOD();
						lod.addLevel(object, 10);
						scene.add(object);
					}
				);
			}
		);

		const render = () => {
			timeout = requestAnimationFrame(render);
			var delta = clock.getDelta();
			if (mixer) mixer.update(delta);
			renderer.render(scene, camera);
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
