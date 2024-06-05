// src/PhaserGame.js
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const PhaserGame = () => {
    const gameContainer = useRef(null);
    const [numVillagers, setNumVillagers] = useState(3);
    const [villagers, setVillagers] = useState([]);

    useEffect(() => {
        let socket;

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

        const game = new Phaser.Game(config)

        function preload() {
            this.load.image('village', 'assets/map2.png');
            this.load.image('player1', 'assets/player.png');
            this.load.image('player2', 'assets/player.png');
            this.load.image('player3', 'assets/player.png');
        }

        function create() {
            this.add.image(640, 360, 'village');

            this.player1 = this.add.sprite(-20, -20, 'player1');
            this.player1.setScale(0.3);

            this.player2 = this.add.sprite(-20, -20, 'player2');
            this.player2.setScale(0.3);

            this.player3 = this.add.sprite(-20, -20, 'player3');
            this.player3.setScale(0.3);

            // Connect to WebSocket server
            socket = new WebSocket('ws://localhost:6789');

            // Listen for messages from the server
            socket.onmessage = (event) => {
                const gameState = JSON.parse(event.data);
                console.log(gameState);
                
                // Update the number of villagers
                setNumVillagers(gameState.numVillagers);

                this.player1.setPosition(gameState.villagers[0].x, gameState.villagers[0].y)
                this.player2.setPosition(gameState.villagers[1].x, gameState.villagers[1].y)
                this.player3.setPosition(gameState.villagers[2].x, gameState.villagers[2].y)

            };
        }

        function update() {
            // Game logic here

        }

        return () => {
            game.destroy(true);
        };
    }, []);

    console.log("villagers");
    console.log(villagers);
    return <div ref={gameContainer} />;
};

export default PhaserGame;
