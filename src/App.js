// src/App.js
import React from 'react';
import PhaserGame from './PhaserGame';
import './App.css';

const App = () => {
    return (
        <div className="App">
            <h1>Townsfolks vs Werewolves</h1>
            <div className="PhaserGame">
              <PhaserGame />
            </div>
        </div>
    );
};

export default App;
