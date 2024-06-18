// src/HouseScene.js
import Phaser from 'phaser';

class HouseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HouseScene' });
  }

  init(data) {
    this.houseNumber = data.houseNumber;
    console.log(`House number: ${this.houseNumber}`);
  }

  preload() {
    // Load assets for the house Scene
    this.load.image('houseScene', 'assets/images/maps/house_layout2.webp');
  }

  create() {
    this.add.image(640, 360, 'houseScene').setScale(0.5);
    this.add.text(640, 50, `House ${this.houseNumber}`, {
      font: '32px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Add door emoji label
    const doorLabel = this.add.text(1000, 600, '🚪 Exit', {
      font: '24px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
      borderRadius: 5
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('MainScene');
      });
  }

  update() {
    // Update logic for the house Scene 
  }
  boot() {
    console.log('HouseScene  booted');
  } 
}

export default HouseScene;
