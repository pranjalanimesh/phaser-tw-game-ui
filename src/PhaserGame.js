// src/PhaserGame.js
import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";

const PhaserGame = () => {
	const gameContainer = useRef(null);
	const [villagers, setVillagers] = useState([]);
    let villagerSprites = [];
    let villagerLabels = []; // T
    const taskLocations = [
        { x: 1000, y: 300, label: "Gather food" },
        { x: 200, y: 200, label: "Build a house" },
        { x: 600, y: 600, label: "Collect wood" },
        { x: 80, y: 600, label: "Fetch water" },
        { x: 1000, y: 600, label: "Guard the village", },
        { x: 200, y: 500, label: "Cook food", },
        { x: 300, y: 100, label: "Hunt for animals", },
        { x: 600, y: 400, label: "Scout the area", },
        { x: 350, y: 350, label: "Heal the injured", },
        { x: 700, y: 200, label: "Teach children", }
    ];
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
    // Popup template for displaying details
            let popup = this.add.text(0, 0, '', {
                font: '16px Arial',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 10, y: 10 },
                borderRadius: 5
            }).setOrigin(0.5, 0.5).setVisible(false);
            popup.setDepth(1000);

            function day(){
                villageBGDay.setAlpha(1);
                villageBGNight.setAlpha(0);
            }
            function night(){
                villageBGDay.setAlpha(0);
                villageBGNight.setAlpha(1);
            }

            taskLocations.forEach(task => {
                const label = this.add.text(task.x, task.y, `* ${task.label} `, {
                    font: '18px Arial',
                    fill: '#ffffff',
                    backgroundColor: '#000000',
                    padding: { x: 10, y: 5 },
                    borderRadius: 5
                }).setOrigin(0.5, 0.5).setScrollFactor(0);  // Ensure labels don't move with the camera if it's used
            });
        

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
						const sprite = this.add.sprite(villager.x, villager.y, "player").setScale(0.4).setInteractive();
						sprite.setInteractive(new Phaser.Geom.Circle(0, 0, 30), Phaser.Geom.Circle.Contains);
						villagerSprites.push(sprite);
                        const label = this.add.text(villager.x, villager.y - 20, `ID: ${villager.agent_id}`, {
                            font: '15px Arial',
                            fill: '#fff',
                            backgroundColor: '#333'
                        }).setOrigin(0.5, 0.5);
                        villagerLabels.push(label)
                        sprite.on('pointerover', () => {
                            console.log('pointer over')
                            popup.setText([
                                `Name: ${villager.agent_id}`,
                                `Role: blajh}`,
                                `Age: aksjd`
                            ]).setPosition(sprite.x, sprite.y - 50).setVisible(true);
                        });
                        sprite.on('pointerout', () => {
                            console.log('pointer out')
                            popup.setVisible(false);
                        });
					});

   

					// Update villagers state
					setVillagers(gameState.villagers);
				} else {
					// Update existing villagers' positions
					gameState.villagers.forEach((villager, index) => {
						villagerSprites[index].setPosition(villager.x, villager.y);
                        villagerLabels[index].setPosition(villager.x, villager.y - 20);
					});
				}

                // console.log(gameState.isDay)

                if (gameState.isDay === true){
                    night();
                } else {
                    day();
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
