import React from 'react';

// This context will hold a map of asset keys (e.g., 'background_collection') to their image data URL
export const UiContext = React.createContext<Map<string, string>>(new Map());