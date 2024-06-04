// src/PhaserGame.js
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const PhaserGame = () => {
    const gameContainer = useRef(null);

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

        const game = new Phaser.Game(config);

        function preload() {
            this.load.image('village', 'assets/map2.png');
            this.load.image('player', 'assets/player.png');
        }

        function create() {
            this.add.image(640, 360, 'village');
            const player = this.add.image(600,300, 'player');
            player.setScale(0.3);
            
            // Connect to WebSocket server
            socket = new WebSocket('ws://localhost:6789');

            // Listen for messages from the server
            socket.onmessage = (event) => {
                console.log(event.data);
                const gameState = JSON.parse(event.data);
                console.log(gameState);

                // Update player position
                player.x = gameState.player.x;
                player.y = gameState.player.y;
            };
        }

        function update() {
            // Game logic here


        }

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div ref={gameContainer} />;
};

export default PhaserGame;
