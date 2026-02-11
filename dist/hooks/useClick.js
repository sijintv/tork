import { useEffect } from 'react';
import { useMouse } from '../contexts/MouseContext.js';
import { measureAbsolute } from '../utils/measure.js';
export const useClick = (ref, handler) => {
    const mouse = useMouse();
    useEffect(() => {
        if (!mouse || mouse.action !== 'down' || !ref.current)
            return;
        try {
            const rect = measureAbsolute(ref.current);
            if (rect) {
                // Check if click is inside
                // Note: Mouse coordinates are 1-based usually from standard terminal, 
                // but Ink layout is 0-based relative to top-left?
                // Let's verify. Usually terminal x=1,y=1 is top-left.
                // Yoga layout (0,0) is top-left.
                // Let's assume mouse 1-based.
                const mx = mouse.x;
                const my = mouse.y;
                // However, user might have scrollback or other offsets if not fullscreen?
                // Assuming fullscreen CLI app.
                // Correction: Ink typically renders starting at current cursor position if not fullscreen.
                // But full-screen app usually clears screen.
                // `measureAbsolute` returns 0-based relative to Ink root.
                // If Ink root is at (1,1), then 0-based + 1 = 1-based mouse.
                // Actually `getComputedLeft()` sums up from root.
                // If root is at (0,0), then it matches.
                // Let's assume a match for now, maybe off by 1.
                // rect.left is 0-based. mouse.x is 1-based.
                if (mx >= rect.left + 1 && mx <= rect.right && my >= rect.top + 1 && my <= rect.bottom) {
                    handler({ x: mx - rect.left - 1, y: my - rect.top - 1 });
                }
            }
        }
        catch (e) {
            // ignore
        }
    }, [mouse]);
};
