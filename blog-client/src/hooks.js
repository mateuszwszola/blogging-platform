import { useEffect } from 'react';

export function useOnClickOutside(ref, callback) {
    useEffect(() => {
        function handleMouseDown(event) {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            callback(event);
        }

        document.addEventListener('mousedown', handleMouseDown);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
        }
    }, [ref, callback]);
}