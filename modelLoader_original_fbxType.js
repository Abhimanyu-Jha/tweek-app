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
				mixer = new AnimationMixer(object);
				var action = mixer.clipAction(object2.animations[0]);
				action.play();

				object.traverse(function (child) {
					if (child.isMesh) {
						child.castShadow = true;
						child.receiveShadow = true;
					}
				});
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
