import React, { useState, useRef } from 'react';
import './VoiceRecorder.css';

const VoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="voice-recorder">
      <h2>🎤 Voice to Music Converter</h2>
      
      <div className="recorder-controls">
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
          Recording... Speak now!
        </div>
      )}

      {audioUrl && (
        <div className="audio-preview">
          <h3>Your Recording:</h3>
          <audio controls src={audioUrl} />
          <div className="action-buttons">
            <button className="convert-btn">
              🎹 Convert to Piano
            </button>
            <button className="convert-btn">
              🎻 Convert to Strings
            </button>
            <button className="convert-btn">
              🎸 Convert to Guitar
            </button>
          </div>
        </div>
      )}

      <div className="instructions">
        <h4>How it works:</h4>
        <ol>
          <li>Click "Start Recording" and sing/whistle a melody</li>
          <li>Stop recording when finished</li>
          <li>Choose an instrument to convert your voice</li>
          <li>Download or share your created music!</li>
        </ol>
      </div>
    </div>
  );
};

export default VoiceRecorder;
