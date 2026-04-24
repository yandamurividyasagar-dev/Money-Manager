import { useState, useEffect, useRef } from 'react';

function AudioPlayer({ audioBase64, autoPlay, onEnded }) {
  const [audioInstance, setAudioInstance] = useState(null);
  const onEndedRef = useRef(onEnded);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    if (!audioBase64) return;

    if (audioInstance) {
      audioInstance.pause();
      audioInstance.src = '';
    }

    let binaryString;
    try {
      binaryString = atob(audioBase64);
    } catch (err) {
      console.error('Invalid audio base64:', err.message);
      if (onEndedRef.current) onEndedRef.current();
      return;
    }

    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const audioBlob = new Blob([bytes], { type: 'audio/mp3' });
    const newUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(newUrl);

    audio.onended = () => {
      if (onEndedRef.current) onEndedRef.current();
    };

    setAudioInstance(audio);

    if (autoPlay) {
      audio.play().catch((err) => {
        console.error('Audio autoplay failed:', err.message);
        if (onEndedRef.current) onEndedRef.current();
      });
    }

    return () => {
      audio.pause();
      audio.src = '';
      URL.revokeObjectURL(newUrl);
    };
  }, [audioBase64]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default AudioPlayer;
