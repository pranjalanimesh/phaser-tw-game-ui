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
    this.HouseScene=this.add.image(750, 450, 'houseScene').setScale(0.5);
    this.add.text(750, 20, `House ${this.houseNumber}`, {
      font: '32px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000',
    }).setOrigin(0.5);

    this.HouseScene.setDisplaySize(1500, 900);
    // Add door emoji label
    const doorLabel = this.add.text(1050, 800, '🚪 Exit', {
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
