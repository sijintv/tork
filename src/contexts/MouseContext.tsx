import React, { createContext, useContext, useEffect, useState } from 'react';
import { useStdin } from 'ink';

type MouseAction = 'down' | 'up' | 'move' | 'scroll-up' | 'scroll-down';

interface MouseEvent {
    x: number;
    y: number;
    action: MouseAction;
    button: number; // 0: left, 1: middle, 2: right
}

const MouseContext = createContext<MouseEvent | null>(null);

export const MouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { stdin, setRawMode } = useStdin();
    const [mouseEvent, setMouseEvent] = useState<MouseEvent | null>(null);

    useEffect(() => {
        setRawMode(true);
        process.stdout.write('\x1b[?1003h\x1b[?1006h\x1b[?1015h'); // Enable mouse reporting

        const handler = (data: Buffer) => {
            const str = data.toString();
            // Parse CSI < button ; x ; y M/m
            if (str.startsWith('\x1b[<')) {
                const match = str.match(/\x1b\[<(\d+);(\d+);(\d+)([Mm])/);
                if (match) {
                    const code = parseInt(match[1], 10);
                    const x = parseInt(match[2], 10);
                    const y = parseInt(match[3], 10);
                    const type = match[4]; // M = press, m = release

                    let action: MouseAction = 'move';
                    let button = 0;

                    if (type === 'M') {
                        if (code === 0) action = 'down';
                        else if (code === 2) action = 'down'; // right
                        else if (code === 64) action = 'scroll-up';
                        else if (code === 65) action = 'scroll-down';
                        // Add more mappings as needed
                    } else {
                        action = 'up';
                    }

                    // Adjust button (0 = left, 1 = middle, 2 = right usually)
                    // Just simple mapping for now
                    if (code === 0) button = 0;
                    if (code === 2) button = 2;

                    setMouseEvent({ x, y, action, button });
                }
            }
        };

        stdin.on('data', handler);

        return () => {
            const cleanup = () => {
                stdin.off('data', handler);
                process.stdout.write('\x1b[?1003l\x1b[?1006l\x1b[?1015l'); // Disable mouse
            };
            cleanup();
        };
    }, [stdin, setRawMode]);

    return (
        <MouseContext.Provider value={mouseEvent}>
            {children}
        </MouseContext.Provider>
    );
};

export const useMouse = () => useContext(MouseContext);
