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
import Stats from "three/examples/jsm/libs/stats.module.js";
import { Asset } from "expo-asset";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { decode, encode } from "base-64";

if (!global.btoa) {
	global.btoa = encode;
}

if (!global.atob) {
	global.atob = decode;
}

export default function App() {
	const [appState, setAppState] = React.useState(null);
	const [cameraX, setCameraX] = React.useState(100);

	const [camera, setCamera] = React.useState<Camera | null>(null);
	let mixer;
	let timeout;
	var clock = new Clock();
	// var stats = new Stats();
	// stats.showPanel();

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

		const camera = new PerspectiveCamera(60, width / height, 1, 2000);
		camera.position.set(0, cameraX, 400);

		setCamera(camera);

		const scene = new Scene();
		scene.fog = new Fog(sceneColor, 1, 10000);
		var grid = new GridHelper(200, 5, 0xaaa000, 0x000000);

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

		setAppState("Loading Model");
		// const asset = Asset.fromModule(require("./assets/Model.fbx"));
		const asset = Asset.fromModule(require("./characters/ybot.fbx"));
		// const asset = Asset.fromModule(require("./characters/xbot.fbx"));
		await asset.downloadAsync();
		console.log(asset.uri);

		// var modelLoader = new GLTFLoader();
		var modelLoader = new FBXLoader();
		modelLoader.load(
			asset.uri,
			// "https://github.com/Abhimanyu-Jha/tweek-app/raw/master/Zombie%20Stand%20Up.fbx",
			// "https://github.com/Abhimanyu-Jha/tweek-app/blob/master/Capoeira.fbx",
			// "https://threejs.org/examples/models/fbx/Samba%20Dancing.fbx",
			// "scene.gltf",
			// "./test.fbx",
			// "Zombie Stand Up.fbx",
			// "https://github.com/Abhimanyu-Jha/tweek-app/raw/master/ybot.gltf",
			async (object) => {
				setAppState("Loading Animation");
				console.log("Loaded model to scene.");
				var animationLoader = new FBXLoader();
				// var animationLoader = new GLTFLoader();
				animationLoader.load(
					// "https://github.com/Abhimanyu-Jha/tweek-app/raw/master/Zombie%20Stand%20Up.fbx",
					"https://threejs.org/examples/models/fbx/Samba%20Dancing.fbx",
					// "https://github.com/Abhimanyu-Jha/tweek-app/raw/master/ybot.glb",
					// asset.uri,
					(object2) => {
						setAppState("Loaded Animation.");
						// console.log(object2.animations[0]);
						console.log("Loaded animation to scene.");
						// mixer = new AnimationMixer(object.scene);
						mixer = new AnimationMixer(object);
						var action = mixer.clipAction(object2.animations[0]);
						action.play();

						// object.scene.traverse(function (child) {
						object.traverse(function (child) {
							if (child.isMesh) {
								child.castShadow = true;
								child.receiveShadow = true;
							}
						});
						// scene.add(object.scene);
						scene.add(object);
					}
				);
			},
			function (xhr) {
				console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
			},
			function (err) {
				console.log(err);
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
		<View style={{ flex: 1 }}>
			<OrbitControlsView
				style={{
					flex: 1,
					position: "relative",
				}}
				camera={camera}
			>
				<GLView
					style={{ flex: 1 }}
					onContextCreate={onContextCreate}
					key="d"
				/>
			</OrbitControlsView>
			<View
				style={{
					position: "absolute",
					bottom: 0,
					alignSelf: "center",
					paddingBottom: 50,
				}}
			>
				<Text
					style={{
						fontSize: 24,
					}}
				>
					{appState}
				</Text>
				<Button
					mode="outlined"
					onPress={() => {
						camera.position.set(
							camera.position.x + 100,
							camera.position.y,
							camera.position.z
						);
					}}
				>
					Camera++
				</Button>
				<Button
					mode="outlined"
					onPress={() => {
						camera.position.set(
							camera.position.x - 100,
							camera.position.y,
							camera.position.z
						);
					}}
				>
					Camera--
				</Button>
			</View>
		</View>
	);
}
