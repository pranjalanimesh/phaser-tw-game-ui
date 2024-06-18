const styles = {
    controlPanel: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 10, // Ensure it overlays the game container
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    toggleButton: {
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      borderRadius: '5px',
      backgroundColor: '#333',
      color: '#fff',
      border: 'none',
    },
    historyPanel: {
      maxHeight: '400px',
      backgroundColor: '#fff',
      padding: '10px',
      border: '1px solid #333',
      maxHeight: '300px',
      overflowY: 'scroll',
      borderRadius: '5px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    conversation: {
      marginBottom: '10px',
      color: '#000',
    },
    convoLine:{ margin: "5px 0", color: "#000" },
    gameContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  };