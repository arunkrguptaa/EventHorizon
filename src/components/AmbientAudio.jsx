import React, { useEffect, useRef, useState } from 'react';
import useStore, { SCALES } from '../stores/useStore';

// Audio tracks (Royalty Free from Mixkit)
// Universe: Deep, heavy, cinematic (Interstellar vibe)
const AUDIO_TRACKS = {
    [SCALES.UNIVERSE]: 'https://assets.mixkit.co/active_storage/sfx/262/262-preview.m4a', // Deep Space Drone
    [SCALES.GALAXY]: 'https://assets.mixkit.co/active_storage/sfx/243/243-preview.m4a',   // Ethereal/Mystery
    [SCALES.SOLAR_SYSTEM]: 'https://assets.mixkit.co/active_storage/sfx/142/142-preview.m4a' // Sci-Fi Hum
};

const AmbientAudio = () => {
    const audioRef = useRef(null);
    const { currentScale, audioEnabled, toggleAudio } = useStore();
    const [isLoaded, setIsLoaded] = useState(false);
    const [volume, setVolume] = useState(0.3);

    // Initialize audio element
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.loop = true;
            audioRef.current.volume = volume;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Handle audio source changes based on scale
    useEffect(() => {
        if (!audioRef.current) return;

        const newSource = AUDIO_TRACKS[currentScale] || AUDIO_TRACKS[SCALES.UNIVERSE];

        if (audioRef.current.src !== newSource) {
            const wasPlaying = !audioRef.current.paused;
            audioRef.current.src = newSource;
            setIsLoaded(false);

            audioRef.current.oncanplaythrough = () => {
                setIsLoaded(true);
                if (wasPlaying && audioEnabled) {
                    audioRef.current.play().catch(() => { });
                }
            };
        }
    }, [currentScale, audioEnabled]);

    // Handle play/pause
    useEffect(() => {
        if (!audioRef.current || !isLoaded) return;

        if (audioEnabled) {
            audioRef.current.play().catch((e) => {
                // Autoplay may be blocked, user needs to interact first
                console.log('Audio autoplay blocked, user interaction required');
            });
        } else {
            audioRef.current.pause();
        }
    }, [audioEnabled, isLoaded]);

    // Handle volume changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handleToggle = () => {
        toggleAudio();
        // If turning on, try to play (this counts as user interaction)
        if (!audioEnabled && audioRef.current && isLoaded) {
            audioRef.current.play().catch(() => { });
        }
    };

    return (
        <div className="audio-controls glass-panel" style={{
            position: 'absolute',
            bottom: 'var(--spacing-lg)',
            left: 'var(--spacing-lg)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            zIndex: 100
        }}>
            {/* Toggle button */}
            <button
                onClick={handleToggle}
                style={{
                    background: audioEnabled ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s ease'
                }}
            >
                <span style={{ fontSize: '1.1rem' }}>{audioEnabled ? '🔊' : '🔇'}</span>
                <span>{audioEnabled ? 'Sound On' : 'Sound Off'}</span>
            </button>

            {/* Volume slider (only show when audio is on) */}
            {audioEnabled && (
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    style={{
                        width: '80px',
                        accentColor: 'var(--color-accent)',
                        cursor: 'pointer'
                    }}
                />
            )}
        </div>
    );
};

export default AmbientAudio;
