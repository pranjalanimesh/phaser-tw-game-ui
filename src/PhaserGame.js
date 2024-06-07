// src/PhaserGame.js
import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import HouseLayout from './HouseLayout'

import { houseLocations, taskLocations} from "./constants/locations";

const PhaserGame = () => {
	const gameContainer = useRef(null);
	const [villagers, setVillagers] = useState([]);
    const[talk, setTalk] = useState(false);
    let villagerSprites = [];
    let villagerLabels = []; // T

	useEffect(() => {
		let socket;
		const villagerSprites = [];

		
        class MainScene extends Phaser.Scene {
            constructor() {
                super({ key: 'MainScene' });
            }
            preload() {
                this.load.image("villageDay", "assets/map1_day_upscaled.png");
                this.load.image("villageNight", "assets/map1_night_upscaled.png");
                this.load.image("player", "assets/player.png");
                this.load.scenePlugin('HouseLayout', HouseLayout, 'houseLayout', 'houseLayout')
            }

            create() {
                const villageBGNight = this.add.image(640, 357, "villageDay");
                const villageBGDay = this.add.image(640, 360, "villageNight");
                villageBGDay.setScale(0.25);
                villageBGNight.setScale(0.25);
                villageBGDay.setAlpha(0);
                villageBGNight.setAlpha(1);
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
                houseLocations.forEach((house) => {
                    const label = this.add
                    .text(house.x, house.y, `${house.emoji} ${house.label} `, {
                        font: "18px Arial",
                        fill: "#ffffff",
                        backgroundColor: "#000000",
                        padding: { x: 10, y: 5 },
                        borderRadius: 5
                    })
                    .setOrigin(0.5, 0.5)
                    .setScrollFactor(0).setInteractive({ useHandCursor: true })
                    .on('pointerdown', () => {
                        this.scene.start('HouseLayout', { houseNumber: house.label })
                    })
                })
            

                // Connect to WebSocket server
                socket = new WebSocket("ws://localhost:6789");

                // Listen for messages from the server
                socket.onmessage = (event) => {
                    
                    // Parse the JSON message
                    const gameState = JSON.parse(event.data);
                    console.log("gamestate.isDay", gameState.isDay)
                    console.log("gameState.blendFactor",gameState.blendFactor)
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

                    // Handle transition between day and night
                    this.tweens.add({
                        targets: [villageBGDay, villageBGNight],
                        alpha: { value: gameState.blendFactor, duration: 2000, ease: 'Power1' },
                        onUpdate: () => {
                        villageBGDay.setAlpha(gameState.blendFactor);
                        villageBGNight.setAlpha(1 - gameState.blendFactor);
                        }
                    });

                              // Handle speech bubble
                    gameState.villagers.forEach((villager, index) => {
                        
                        if (talk) {
                        const speechBubble = this.add.text(villager.x, villager.y - 50, "villager.speech", {
                            font: '16px Arial',
                            fill: '#000',
                            backgroundColor: '#fff',
                            padding: { x: 10, y: 5 },
                            borderRadius: 5
                        }).setOrigin(0.5, 0.5);

                        setTimeout(() => {
                            speechBubble.destroy();
                        }, 5000); // Remove speech bubble after 5 seconds
                        }
                    });

                    
                };
            }

            update() {}
    }
    
    const config = {
        type: Phaser.AUTO,
        width: 1280,
        height: 720,
        parent: gameContainer.current,
        scene: [MainScene, HouseLayout]  // Adding scenes here
    };
    const game = new Phaser.Game(config);

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
