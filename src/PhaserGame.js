// src/PhaserGame.js
import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import HouseScene from "./scenes/HouseScene";
import MainScene from "./scenes/MainScene";
import styles from "./constants/styles";
import PlayerMemories from "./components/PlayerMemories";

const PhaserGame = () => {
  const gameContainer = useRef(null);
  const [conversations, setConversations] = useState(() => {
    const savedConversations = localStorage.getItem("conversations");
    return savedConversations ? JSON.parse(savedConversations) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const [villagerMemories, setVillagerMemories] = useState({});
  const [villagers, setVillagers] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.23.138:6789");
    const config = {
      type: Phaser.AUTO,
      width: 1500,
      height: 900,
      parent: gameContainer.current,
      scene: [MainScene, HouseScene], // Adding scenes here
    };
    const game = new Phaser.Game(config);
    game.scene.start("MainScene", {
      socket: socket,
      setConversations: setConversations,
      setVillagerMemories: setVillagerMemories, 
      setVillagers: setVillagers 
    });
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

  return (
    <div style={styles.gameContainer} ref={gameContainer}>
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          backgroundColor: showHistory ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0)',
          overflowY: 'scroll',
          width: '300px', // Fixed width for the container
          height: '400px',
          padding: '10px',
        }}
      >
        <button onClick={handleHistoryToggle} style={styles.toggleButton}>
          {showHistory ? "Hide" : "Show"} Conversation History
        </button>
        {showHistory && (
          <div style={styles.historyPanel}>
            {conversations.length > 0 ? (
              conversations.map((conv, index) => (
                <div key={index} style={styles.conversation}>
                  <strong>
                    {conv.villager1} and {conv.villager2}:
                  </strong>
                  <p style={styles.convoLine}>{conv.conversation}</p>
                </div>
              ))
            ) : (
              <p style={styles.convoLine}>No conversations yet.</p>
            )}
          </div>
        )}
      </div>
      <PlayerMemories players={villagers} villagerMemories={villagerMemories} />
    </div>
  );
};

export default PhaserGame;
