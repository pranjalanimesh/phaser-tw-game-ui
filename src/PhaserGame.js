// src/PhaserGame.js
import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import HouseScene from "./scenes/HouseScene";
import MainScene from "./scenes/MainScene";
import styles from "./constants/styles";


const PhaserGame = () => {
  const gameContainer = useRef(null);
  const [conversations, setConversations] = useState(() => {
    const savedConversations = localStorage.getItem("conversations");
    return savedConversations ? JSON.parse(savedConversations) : [];
  });
  const [showHistory, setShowHistory] = useState(false);



  useEffect(() => {
    const socket = new WebSocket("ws://localhost:6789")
    const config = {
      type: Phaser.AUTO,
      width: 1500,
      height: 900,
      parent: gameContainer.current,
      scene: [MainScene, HouseScene], // Adding scenes here
    };
    const game = new Phaser.Game(config);
    game.scene.start("MainScene", { socket: socket , setConversations: setConversations});
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
      <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
        }}>
        <button onClick={handleHistoryToggle} style={styles.toggleButton}>
          {showHistory ? 'Hide' : 'Show'} Conversation History
        </button>
        {showHistory && (
          <div style={styles.historyPanel}>
            {conversations.length > 0 ? (
              conversations.map((conv, index) => (
                <div key={index} style={styles.conversation}>
                  <strong>{conv.villager1} and {conv.villager2}:</strong>
                  <p style={styles.convoLine}>{conv.conversation}</p>
                </div>
              ))
            ) : <p style={styles.convoLine}>No conversations yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaserGame;
