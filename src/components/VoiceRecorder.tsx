import React, { useState, useRef } from 'react';
import './VoiceRecorder.css';

const VoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      // Check if browser supports media recording
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support audio recording. Please use Chrome, Firefox, or Edge.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access denied. Please allow microphone permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleConvert = (instrument: string) => {
    if (!audioUrl) {
      alert('Please record audio first!');
      return;
    }
    alert(`Converting to ${instrument}... (Feature coming soon!)`);
    // TODO: Add actual conversion logic
  };

  return (
    <div className="voice-recorder">
      <h2>Voice to Music Converter</h2>
      
      <div className="recorder-controls">
        {!isRecording ? (
          <button onClick={startRecording} className="record-btn">
            🎤 Start Recording
          </button>
        ) : (
          <button onClick={stopRecording} className="stop-btn">
            ⏹️ Stop Recording
          </button>
        )}
      </div>

      {isRecording && (
        <div className="recording-indicator">
          <div className="pulse"></div>
          <span>Recording... Speak or sing now!</span>
        </div>
      )}

      {audioUrl && (
        <div className="audio-preview">
          <h3>Your Recording:</h3>
          <audio controls src={audioUrl} style={{ width: '100%', margin: '10px 0' }} />
          <div className="action-buttons">
            <button 
              onClick={() => handleConvert('piano')} 
              className="convert-btn"
            >
              🎹 Convert to Piano
            </button>
            <button 
              onClick={() => handleConvert('strings')} 
              className="convert-btn"
            >
              🎻 Convert to Strings
            </button>
            <button 
              onClick={() => handleConvert('guitar')} 
              className="convert-btn"
            >
              🎸 Convert to Guitar
            </button>
          </div>
          
          <div className="download-section">
            <button 
              onClick={() => {
                const a = document.createElement('a');
                a.href = audioUrl;
                a.download = 'voice-recording.wav';
                a.click();
              }} 
              className="download-btn"
            >
              💾 Download Recording
            </button>
          </div>
        </div>
      )}

      <div className="instructions">
        <h4>How it works:</h4>
        <ol>
          <li>Click <strong>Start Recording</strong> - allow microphone access when prompted</li>
          <li><strong>Sing, hum, or whistle</strong> a melody (5-30 seconds works best)</li>
          <li>Click <strong>Stop Recording</strong> when finished</li>
          <li>Choose an instrument to convert your voice</li>
          <li>Download your recording or wait for AI conversion</li>
        </ol>
        
        <div className="tips">
          <h5>💡 Tips for best results:</h5>
          <ul>
            <li>Record in a quiet environment</li>
            <li>Hold your device close to your mouth</li>
            <li>Sing clear, simple melodies</li>
            <li>Avoid background noise</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;
