import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { BsMicFill, BsRecordCircleFill, BsCheckCircleFill } from 'react-icons/bs';
import './index.css';

const MAX_RECORD_TIME = 300;

function VoiceRecorder({ onRecordingComplete, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const mediaRecorderRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= MAX_RECORD_TIME - 1) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]); // eslint-disable-line react-hooks/exhaustive-deps

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedBlob(blob);
        setAudioPreviewUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      toast.error('Microphone access denied. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
      setIsRecording(false);
    }
  };

  const handleReRecord = () => {
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    setRecordedBlob(null);
    setAudioPreviewUrl(null);
    setRecordingTime(0);
  };

  const handleSubmit = () => {
    if (recordedBlob && onRecordingComplete) {
      onRecordingComplete(recordedBlob);
    }
  };

  return (
    <div className="voice-recorder">
      {!isRecording && !recordedBlob && (
        <button
          className={`vr-record-btn ${disabled ? 'vr-record-btn-disabled' : ''}`}
          onClick={startRecording}
          disabled={disabled}
        >
          <BsMicFill className="vr-btn-icon" />
          Record Answer
        </button>
      )}

      {isRecording && (
        <div className="vr-recording-area">
          <div className="vr-recording-status">
            <BsRecordCircleFill className="vr-record-dot" />
            <span className="vr-status-text">Recording...</span>
          </div>
          <span className="vr-timer">
            {formatTime(recordingTime)} / {formatTime(MAX_RECORD_TIME)}
          </span>
          <button className="vr-stop-btn" onClick={stopRecording}>
            Stop
          </button>
        </div>
      )}

      {!isRecording && recordedBlob && (
        <div className="vr-preview">
          <p className="vr-preview-label">Review your recording before submitting:</p>
          <audio className="vr-audio-player" src={audioPreviewUrl} controls />
          <p className="vr-preview-duration">Duration: {formatTime(recordingTime)}</p>
          <div className="vr-preview-actions">
            <button
              className={`vr-rerecord-btn ${disabled ? 'vr-rerecord-btn-disabled' : ''}`}
              onClick={handleReRecord}
              disabled={disabled}
            >
              Re-record
            </button>
            <button
              className={`vr-submit-btn ${disabled ? 'vr-submit-btn-disabled' : ''}`}
              onClick={handleSubmit}
              disabled={disabled}
            >
              <BsCheckCircleFill className="vr-btn-icon" />
              Submit Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoiceRecorder;
