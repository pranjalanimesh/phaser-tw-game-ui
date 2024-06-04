// src/PhaserGame.js
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const PhaserGame = () => {
    const gameContainer = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameContainer.current,
            scene: {
                preload: preload,
                create: create,
                update: update,
            },
        };

        const game = new Phaser.Game(config);

        function preload() {
            this.load.image('sky', 'assets/map2.png');
        }

        function create() {
            this.add.image(400, 300, 'sky');
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
