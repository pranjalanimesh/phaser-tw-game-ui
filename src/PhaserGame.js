// src/PhaserGame.js
import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";

const PhaserGame = () => {
	const gameContainer = useRef(null);
	const [villagers, setVillagers] = useState([]);

	useEffect(() => {
		let socket;
		const villagerSprites = [];

		const config = {
			type: Phaser.AUTO,
			width: 1280,
			height: 720,
			parent: gameContainer.current,
			scene: {
				preload: preload,
				create: create,
				update: update,
			},
		};

		const game = new Phaser.Game(config);

		function preload() {
			this.load.image("village", "assets/map2.png");
			this.load.image("player", "assets/player.png");
		}

		function create() {
			this.add.image(640, 360, "village");

			// Connect to WebSocket server
			socket = new WebSocket("ws://localhost:6789");

			// Listen for messages from the server
			socket.onmessage = (event) => {
				const gameState = JSON.parse(event.data);
				console.log(gameState);

				// If villagers are not created yet, create them
				if (villagerSprites.length === 0) {
					gameState.villagers.forEach((villager, index) => {
						const sprite = this.add.sprite(villager.x, villager.y, "player");
						sprite.setScale(0.4);
						villagerSprites.push(sprite);
					});

					// Update villagers state
					setVillagers(gameState.villagers);
				} else {
					// Update existing villagers' positions
					gameState.villagers.forEach((villager, index) => {
						villagerSprites[index].setPosition(villager.x, villager.y);
					});
				}
			};
		}

		function update() {
			// Game logic here
		}

		return () => {
			// Clean up on component unmount
			game.destroy(true);
			if (socket) {
				socket.close();
			}
		};
	}, []);

	console.log("villagers");
	console.log(villagers);
	return <div ref={gameContainer} />;
};

export default PhaserGame;
