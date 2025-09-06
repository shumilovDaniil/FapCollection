// Create a single AudioContext instance for the entire application.
// This is important because creating multiple contexts can be resource-intensive.
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
};

// Function to decode audio data from an ArrayBuffer into an AudioBuffer
export const decodeAudioData = async (arrayBuffer: ArrayBuffer): Promise<AudioBuffer> => {
    const context = getAudioContext();
    // Use a copy of the buffer to avoid issues with detached ArrayBuffers
    return context.decodeAudioData(arrayBuffer.slice(0));
};

// Function to play a decoded AudioBuffer
export const playSound = (audioBuffer: AudioBuffer) => {
    try {
        const context = getAudioContext();
        // If the context is suspended (e.g., due to browser policy), resume it.
        if (context.state === 'suspended') {
            context.resume();
        }
        const source = context.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(context.destination);
        source.start(0);
    } catch (e) {
        console.error("Error playing sound:", e);
    }
};