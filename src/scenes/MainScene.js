import Phaser from "phaser";
import { houseLocations, taskLocations } from "../constants/locations";
import HouseScene from "./HouseScene";
import { speakText } from "../utils/gameUtils";

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }
  init(data) {
    this.socket = data.socket;
    this.setConversations = data.setConversations;
    this.setVillagerMemories = data.setVillagerMemories
    this.setVillagers=data.setVillagers
  }
  preload() {
    this.load.image("villageDay", "assets/images/maps/map3_day_scaled.png");
    this.load.image("villageNight", "assets/images/maps/map3_night_scaled.png");
    this.load.image("player", "assets/player.png");
    this.load.image("akio", "assets/images/characters/akio.png");
    this.load.image("chiyo", "assets/images/characters/chiyo.png");
    this.load.image("hana", "assets/images/characters/hana.png");
    this.load.image("izumi", "assets/images/characters/izumi.png");
    this.load.image("kaio", "assets/images/characters/kaio.png");
    this.load.image("vil", "assets/images/characters/vil.png");
    this.load.image("katsumi", "assets/images/characters/katsumi.png");
    this.load.scenePlugin("HouseScene", HouseScene, "houseScene", "houseScene");
  }

  create() {
    const containerWidth = 1500;
    const containerHeight = 900;

    // Add images at the center of the container
    this.villageBGNight = this.add.image(750, 450, "villageDay");
    this.villageBGDay = this.add.image(750, 450, "villageNight");

    // Image dimensions
    this.villageBGDay.setDisplaySize(containerWidth, containerHeight);
    this.villageBGNight.setDisplaySize(containerWidth, containerHeight);

    this.popup = this.add
      .text(0, 0, "", {
        font: "16px Arial",
        fill: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 10 },
        borderRadius: 5,
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false);
    this.popup.setDepth(1000);

    taskLocations.forEach((task) => {
      this.add
        .text(task.x, task.y, `* ${task.label} `, {
          font: "18px Arial",
          fill: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 10, y: 5 },
          borderRadius: 5,
        })
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0); // Ensure labels don't move with the camera if it's used
    });
    houseLocations.forEach((house) => {
      this.add
        .text(house.x, house.y, `${house.emoji} ${house.label} `, {
          font: "18px Arial",
          fill: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 10, y: 5 },
          borderRadius: 5,
        })
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          this.scene.start("HouseScene", { houseNumber: house.label });
        });
    });
    this.villagerSprites = [];
    this.villagerLabels = [];
    this.connectWebSocket();
  }
  connectWebSocket() {
    // Connect to WebSocket server
    // Listen for messages from the server
    this.socket.onmessage = (event) => {
      // Parse the JSON message
      const gameState = JSON.parse(event.data);
      console.log("gamestate.memories",gameState.villager_memories)
      // console.log("gamestate.isDay", gameState.isDay)
      // console.log("gameState.blendFactor",gameState.blendFactor)
      console.log("gameState.is_morning_meeting", gameState.is_morning_meeting);
      if (gameState.isConvo) {
        this.handleConversation(gameState);
        this.handleSpeechBubble(gameState);
      } else {
        console.log("gameState.isConvo", gameState.isConvo);
      }
      // console.log(gameState);

      if (this.villagerSprites.length === 0) {
        this.createVillagers(gameState.villagers);
      } else {
        this.updateVillagers(gameState.villagers);
      }

      this.handleDayNightTransition(gameState);

      this.handleMorningMeeting(gameState);

      this.setVillagerMemories(gameState.villager_memories)
      this.setVillagers(gameState.villagers)
    };
  }

  createVillagers(villagers) {
    villagers.forEach((villager, index) => {
      const sprite = this.add
        .sprite(villager.x, villager.y, villager.agent_id.toLowerCase())
        .setScale(0.4)
        .setInteractive();
      sprite.setData("agent_id", villager.agent_id);
      sprite.setInteractive(
        new Phaser.Geom.Circle(0, 0, 30),
        Phaser.Geom.Circle.Contains
      );
      this.villagerSprites.push(sprite);
      const label = this.add
        .text(villager.x, villager.y - 20, `ID: ${villager.agent_id}`, {
          font: "15px Arial",
          fill: "#fff",
          backgroundColor: "#333",
        })
        .setOrigin(0.5, 0.5);
      this.villagerLabels.push(label);
      sprite.on("pointerover", () => {
        console.log("pointer over");
        this.popup
          .setText([
            `Name: ${villager.agent_id}`,
            `Role: ${villager.agent_id === "Katsumi" ? "Werewolf" : "Villager"}`
          ])
          .setPosition(sprite.x, sprite.y - 50)
          .setVisible(true);
      });
      sprite.on("pointerout", () => {
        console.log("pointer out");
        this.popup.setVisible(false);
      });
    });
  }

  updateVillagers(villagers) {
    villagers.forEach((villager, index) => {
      this.villagerSprites[index].setPosition(villager.x, villager.y);
      this.villagerLabels[index].setPosition(villager.x, villager.y - 20);
    });
  }

  handleDayNightTransition(gameState) {
    // If blendFactor is 0, set the alpha directly to reflect day or night.
    const villageBGDay = this.villageBGDay;
    const villageBGNight = this.villageBGNight;

    if (gameState.blendFactor === 0) {
      if (gameState.isDay) {
        villageBGDay.setAlpha(0);
        villageBGNight.setAlpha(1);
      } else {
        villageBGDay.setAlpha(1);
        villageBGNight.setAlpha(0);
      }
    } else {
      // Kill any existing tweens on the images to avoid conflicts.
      this.tweens.killTweensOf([villageBGDay, villageBGNight]);
      const duration = 30000 * (1 - gameState.blendFactor);

      // Start a new tween to transition the alpha values based on gameState.isDay.
      this.tweens.add({
        targets: [villageBGDay, villageBGNight],
        alpha: { value: 1, duration: duration, ease: "Power1" },
        onUpdate: (tween) => {
          const value = tween.getValue();
          if (gameState.isDay) {
            villageBGDay.setAlpha(value * gameState.blendFactor);
            villageBGNight.setAlpha(1 - value * gameState.blendFactor);
          } else {
            villageBGDay.setAlpha(1 - value * gameState.blendFactor);
            villageBGNight.setAlpha(value * gameState.blendFactor);
          }
        },
      });
    }
  }

  handleSpeechBubble(gameState) {
    const villagerSprite = this.villagerSprites.find(
      (villager) =>
        villager.getData("agent_id") === gameState.conversations[0].villager1
    );
    console.log("trying to speak");
    console.log("villagerSprite", villagerSprite);
    const text1 = gameState.translatedText;
    console.log("text1", text1);
    if (villagerSprite) {
      const padding = 10;
      const borderRadius = 5;
      const arrowHeight = 10;
      const arrowWidth = 20;
      const text = gameState.conversations[0].conversation;
      const displayText = `JP: ${text1}\nEN: ${text}`;
      console.log("displayText", displayText);
      console.log("text", text);
      console.log("text1", text1);

      // Create a text object to measure its dimensions
      const tempText = this.add.text(0, 0, displayText, {
        font: "14px Arial",
        fill: "#000",
        padding: { x: padding, y: padding },
      });
      const textWidth = tempText.width;
      const textHeight = tempText.height;
      tempText.destroy(); // Destroy the temporary text object

      // Create a graphics object for the speech bubble background
      const bubbleWidth = textWidth + padding * 2;
      const bubbleHeight = textHeight + padding * 2 + arrowHeight;

      const speechBubbleGraphics = this.add.graphics();
      speechBubbleGraphics.fillStyle(0xffffff, 1); // White background
      speechBubbleGraphics.lineStyle(1, 0x000000, 1); // Black border
      speechBubbleGraphics.strokeRoundedRect(
        villagerSprite.x - bubbleWidth / 2,
        villagerSprite.y - bubbleHeight - 50,
        bubbleWidth,
        bubbleHeight - arrowHeight,
        borderRadius
      );
      speechBubbleGraphics.fillRoundedRect(
        villagerSprite.x - bubbleWidth / 2,
        villagerSprite.y - bubbleHeight - 50,
        bubbleWidth,
        bubbleHeight - arrowHeight,
        borderRadius
      );

      // Draw the arrow pointing downwards
      speechBubbleGraphics.beginPath();
      speechBubbleGraphics.moveTo(villagerSprite.x, villagerSprite.y - 50);
      speechBubbleGraphics.lineTo(
        villagerSprite.x - arrowWidth / 2,
        villagerSprite.y - 50 - arrowHeight
      );
      speechBubbleGraphics.lineTo(
        villagerSprite.x + arrowWidth / 2,
        villagerSprite.y - 50 - arrowHeight
      );
      speechBubbleGraphics.closePath();
      speechBubbleGraphics.fillPath();
      speechBubbleGraphics.strokePath();

      console.log("gameState.translatedText", gameState.translatedText);
      speakText(gameState.translatedText);

      // Add the text on top of the speech bubble
      const speechBubbleText = this.add
        .text(
          villagerSprite.x,
          villagerSprite.y - bubbleHeight - 50 + padding,
          displayText,
          {
            font: "14px Arial",
            fill: "#000",
            padding: { x: padding, y: padding },
          }
        )
        .setOrigin(0.5, 0);

      setTimeout(() => {
        speechBubbleGraphics.destroy();
        speechBubbleText.destroy();
      }, 5000); // Remove speech bubble after 5 seconds
    }
  }

  handleConversation(gameState) {
    console.log("gameState.conversations", gameState.conversations[0]);
    const newConversation = gameState.conversations[0];
    this.setConversations((prevConversations) => {
      const updatedConversations = [...prevConversations, newConversation];
      localStorage.setItem(
        "conversations",
        JSON.stringify(updatedConversations)
      );
      return updatedConversations;
    });
  }

  handleMorningMeeting(gameState) {
    const containerWidth = 1550;
    let morningMeetingText = this.morningMeetingText;

    if (gameState.is_morning_meeting) {
      if (!morningMeetingText) {
        morningMeetingText = this.add
          .text(containerWidth / 2, 100, "Morning meeting takes place", {
            font: "32px Arial",
            fill: "#ffffff",
            backgroundColor: "#000000",
            padding: { x: 20, y: 20 },
            borderRadius: 5,
          })
          .setOrigin(0.5, 0.5)
          .setDepth(1000);
      }
    } else {
      if (morningMeetingText) {
        morningMeetingText.destroy();
        morningMeetingText = null;
      }
    }
  }
  update() {}
}

export default MainScene;
