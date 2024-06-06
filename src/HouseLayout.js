// src/HouseLayout.js
import Phaser from 'phaser';

class HouseLayout extends Phaser.Scene {
  constructor() {
    super({ key: 'HouseLayout' });
  }

  init(data) {
    this.houseNumber = data.houseNumber;
    console.log(`House number: ${this.houseNumber}`);
  }

  preload() {
    // Load assets for the house layout
    this.load.image('houseLayout', 'assets/house_layout2.webp');
  }

  create() {
    this.add.image(640, 360, 'houseLayout').setScale(0.5);
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
    // Update logic for the house layout scene
  }
  boot() {
    console.log('HouseLayout scene booted');
  } 
}

export default HouseLayout;
