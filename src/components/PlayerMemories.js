import React, { useState } from 'react'

const styles = {
  gameContainer: {
    position: 'relative',
    width: '1500px',
    height: '900px',
    overflow: 'hidden',
  },
  dropdownContainer: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    zIndex: 1000,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    padding: '10px',
    width: '300px', // Fixed width for the container
    height: '400px', // Fixed height for the container
    overflowY: 'scroll', // Add scroll if content overflows
  },
  dropdown: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
  },
  memoriesContainer: {
    marginTop: '10px',
  },
  memory: {
    padding: '5px',
    borderBottom: '1px solid #ccc',
    color: '#000',
  },
  timestamp: {
    fontSize: '12px',
    color: '#000',
  },
  noMemory: {
    fontStyle: 'italic',
    color: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    padding: '5px 10px',
    fontSize: '16px',
    cursor: 'pointer',
    zIndex: 1001,
  },
}

const PlayerMemories = ({ players, villagerMemories }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [isVisible, setIsVisible] = useState(true)

  const handlePlayerChange = (e) => {
    setSelectedPlayer(e.target.value)
  }

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  return (
    <div>
      <button onClick={handleToggleVisibility} style={styles.closeButton}>
        {isVisible ? 'Close Memories' : 'Show Memories'}
      </button>
      {isVisible && (
        <div style={styles.dropdownContainer}>
          <select value={selectedPlayer} onChange={handlePlayerChange} style={styles.dropdown}>
            <option value=''>Select a player</option>
            {players.map((player, index) => (
              <option key={index} value={player.agent_id}>{player.agent_id}</option>
            ))}
          </select>
          <div style={styles.memoriesContainer}>
            {selectedPlayer && villagerMemories[selectedPlayer] ? (
              villagerMemories[selectedPlayer].map((memory, index) => (
                <div key={index} style={styles.memory}>
                  <p>{memory.memory}</p>
                  <p style={styles.timestamp}>{new Date(memory.timestamp).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p style={styles.noMemory}>No memories for this player.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayerMemories
