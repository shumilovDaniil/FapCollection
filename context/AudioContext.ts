import React from 'react';

// This context will hold a map of asset keys (e.g., 'hitSound') to their decoded AudioBuffer
export const AudioContext = React.createContext<Map<string, AudioBuffer>>(new Map());