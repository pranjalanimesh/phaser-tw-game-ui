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
			this.load.image("villageDay", "assets/map1_day_upscaled.png");
			this.load.image("villageNight", "assets/map1_night_upscaled.png");
			this.load.image("player", "assets/player.png");
		}

		function create() {
			const villageBGNight = this.add.image(640, 357, "villageDay");
            const villageBGDay = this.add.image(640, 360, "villageNight");
            villageBGDay.setScale(0.25);
            villageBGNight.setScale(0.25);
            let x = false;

            setInterval(() => {
                console.log("changing background");
                console.log(x)

                if (x) {
                    villageBGDay.setAlpha(1);
                    villageBGNight.setAlpha(0);
                    console.log("day");
                    console.log("to night")
                }
                else {
                    villageBGDay.setAlpha(0);
                    villageBGNight.setAlpha(1);
                    console.log("night");
                    console.log("to day")
                }

                x= !x;

            }, 25000);

			// Connect to WebSocket server
			socket = new WebSocket("ws://localhost:6789");

			// Listen for messages from the server
			socket.onmessage = (event) => {
                
                // Parse the JSON message
				const gameState = JSON.parse(event.data);
				// console.log(gameState);

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

	// console.log("villagers");
	// console.log(villagers);
    // console.log(day);
	return <div ref={gameContainer} />;
};

export default PhaserGame;
