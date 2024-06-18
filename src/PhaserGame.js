// src/PhaserGame.js
import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import HouseLayout from "./HouseLayout";

import { houseLocations, taskLocations } from "./constants/locations";




const speakText = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP'; // Japanese language
  console.log("utterance",utterance)
  speechSynthesis.speak(utterance);
};

const PhaserGame = () => {
  const gameContainer = useRef(null);
  const [villagers, setVillagers] = useState([]);
  const [talk, setTalk] = useState(false);
  const [conversations, setConversations] = useState(() => {
    const savedConversations = localStorage.getItem("conversations");
    return savedConversations ? JSON.parse(savedConversations) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
  let villagerSprites = [];
  let villagerLabels = []; // T


  useEffect(() => {
    let socket;
    const villagerSprites = [];
    let morningMeetingText
    // localStorage.removeItem('conversations')

    class MainScene extends Phaser.Scene {
      constructor() {
        super({ key: "MainScene" });
      }
      preload() {
        this.load.image("villageDay", "assets/images/maps/map3_day_scaled.png");
        this.load.image("villageNight", "assets/images/maps/map3_night_scaled.png");
        this.load.image("player", "assets/player.png");
        this.load.image("akio","assets/images/characters/akio.png");
        this.load.image("chiyo","assets/images/characters/chiyo.png");
        this.load.image("hana","assets/images/characters/hana.png");
        this.load.image("izumi","assets/images/characters/izumi.png");
        this.load.image("kaio","assets/images/characters/kaio.png");
        this.load.image("vil","assets/images/characters/vil.png");
        this.load.image("katsumi","assets/images/characters/katsumi.png");
        this.load.scenePlugin(
          "HouseLayout",
          HouseLayout,
          "houseLayout",
          "houseLayout"
        );
      }

      create() {
        const containerWidth = 1550
        const containerHeight = 900
      
        // Add images at the center of the container
        const villageBGNight = this.add.image(containerWidth/2, containerHeight / 2, "villageDay")
        const villageBGDay = this.add.image(containerWidth/2, containerHeight / 2, "villageNight")
      
        // Image dimensions
        villageBGDay.setDisplaySize(containerWidth, containerHeight)
        villageBGNight.setDisplaySize(containerWidth, containerHeight)
      
        // Calculate scale factors
        // const scaleX = containerWidth / imageWidth
        // const scaleY = containerHeight / imageHeight
        
        // // Determine the larger scale factor to cover the container

        // const scale = Math.min(scaleX, scaleY)
        // console.log("scale",scale)
        
        // villageBGDay.setScale(0.75)
        // villageBGNight.setScale(0.75)
        // villageBGDay.setPosition(containerWidth / 2, containerHeight / 2)
        // villageBGNight.setPosition(containerWidth / 2, containerHeight / 2)

        // Popup template for displaying details
        let popup = this.add
          .text(0, 0, "", {
            font: "16px Arial",
            fill: "#ffffff",
            backgroundColor: "#000000",
            padding: { x: 10, y: 10 },
            borderRadius: 5,
          })
          .setOrigin(0.5, 0.5)
          .setVisible(false);
        popup.setDepth(1000);

        taskLocations.forEach((task) => {
          const label = this.add
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
          const label = this.add
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
              this.scene.start("HouseLayout", { houseNumber: house.label });
            });
        });

        // Connect to WebSocket server
        socket = new WebSocket("ws://localhost:6789");

        // Listen for messages from the server
        socket.onmessage = (event) => {
          // Parse the JSON message
          const gameState = JSON.parse(event.data);
          // console.log("gamestate.isDay", gameState.isDay)
          // console.log("gameState.blendFactor",gameState.blendFactor)
          if (gameState.isConvo) {
            console.log("gameState.conversations", gameState.conversations[0]);
            const newConversation = gameState.conversations[0];
          
            setConversations((prevConversations) => {
              const updatedConversations = [...prevConversations, newConversation];
              localStorage.setItem("conversations", JSON.stringify(updatedConversations));
              return updatedConversations;
            });
          }
           else {
            console.log("gameState.isConvo", gameState.isConvo);
          }
          // console.log(gameState);

          // If villagers are not created yet, create them
          if (villagerSprites.length === 0) {

            gameState.villagers.forEach((villager, index) => {
              const sprite = this.add
                .sprite(villager.x, villager.y, villager.agent_id.toLowerCase())
                .setScale(0.4)
                .setInteractive();
              sprite.setData("agent_id", villager.agent_id);
              sprite.setInteractive(
                new Phaser.Geom.Circle(0, 0, 30),
                Phaser.Geom.Circle.Contains
              );
              villagerSprites.push(sprite);
              const label = this.add
                .text(villager.x, villager.y - 20, `ID: ${villager.agent_id}`, {
                  font: "15px Arial",
                  fill: "#fff",
                  backgroundColor: "#333",
                })
                .setOrigin(0.5, 0.5);
              villagerLabels.push(label);
              sprite.on("pointerover", () => {
                console.log("pointer over");
                popup
                  .setText([
                    `Name: ${villager.agent_id}`,
                    `Role: blajh}`,
                    `Age: aksjd`,
                  ])
                  .setPosition(sprite.x, sprite.y - 50)
                  .setVisible(true);
              });
              sprite.on("pointerout", () => {
                console.log("pointer out");
                popup.setVisible(false);
              });
            });

            // Update villagers state
            setVillagers(gameState.villagers);
          } else {
            gameState.villagers.forEach((villager, index) => {
              villagerSprites[index].setPosition(villager.x, villager.y);
              villagerLabels[index].setPosition(villager.x, villager.y - 20);
            });
          }

          // console.log(gameState.isDay)

          // Handle transition between day and night
          // If blendFactor is 0, set the alpha directly to reflect day or night.
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

          // Handle speech bubble
          if(gameState.isConvo){
            // console.log("vilagerSprites",villagerSprites)
            const villagerSprite= villagerSprites.find(villager=>villager.getData("agent_id")===gameState.conversations[0].villager1)
            console.log("trying to speak")
            console.log("villagerSprite",villagerSprite)
            const text1=gameState.translatedText
            console.log("text1",text1)
              if (villagerSprite) {
                const padding = 10;
                const borderRadius = 5;
                const arrowHeight = 10;
                const arrowWidth = 20;
                const text = gameState.conversations[0].conversation;
                const displayText = `JP: ${text1}\nEN: ${text}`
                console.log("displayText",displayText)
                console.log("text",text)
                console.log("text1",text1)
              

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
                
                console.log("gameState.translatedText",gameState.translatedText)
                speakText(gameState.translatedText)

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
          // Handle morning meeting text display
          if (gameState.is_morning_meeting) {
            if (!morningMeetingText) {
              morningMeetingText = this.add.text(containerWidth / 2, 100, "Morning meeting takes place", {
                font: "32px Arial",
                fill: "#ffffff",
                backgroundColor: "#000000",
                padding: { x: 20, y: 20 },
                borderRadius: 5,
              })
              .setOrigin(0.5, 0.5)
              .setDepth(1000)
            }
          } else {
            if (morningMeetingText) {
              morningMeetingText.destroy()
              morningMeetingText = null
            }
          }

        };
      }

      update() {}
    }

    const config = {
      type: Phaser.AUTO,
      width: 1500,
      height: 900,
      parent: gameContainer.current,
      scene: [MainScene, HouseLayout], // Adding scenes here
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
  const handleHistoryToggle = () => {
    setShowHistory(!showHistory);
  };
  // console.log("villagers");
  // console.log(villagers);
  // console.log(day);
  return (
    <div ref={gameContainer}>
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={handleHistoryToggle}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "5px",
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
          }}
        >
          {showHistory ? "Hide" : "Show"} Conversation History
        </button>
        {showHistory && (
          <div
            style={{
              backgroundColor: "#fff",
              padding: "14px",
              border: "1px solid #333",
              maxHeight: "300px",
              overflowY: "scroll",
              borderRadius: "5px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            {conversations.length > 0 ? (
              conversations.map((conv, index) => (
                <div
                  key={index}
                  style={{ marginBottom: "10px", color: "#000" }}
                >
                  <strong>
                    {conv.villager1} and {conv.villager2}:
                  </strong>
                  <p style={{ margin: "5px 0", color: "#000" }}>
                    {conv.conversation}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: "#000" }}>No conversations yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaserGame;
