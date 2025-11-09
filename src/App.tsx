import React from 'react';
import './App.css';
import VoiceRecorder from './components/VoiceRecorder';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🎵 AI Voice to Music Converter</h1>
        <p>Transform your voice into beautiful music</p>
      </header>
      <main>
        <VoiceRecorder />
      </main>
    </div>
  );
}

export default App;
