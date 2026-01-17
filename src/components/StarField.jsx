import React, { useRef, useEffect } from 'react';

const StarField = () => {
    const canvasRef = useRef(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [lastX, setLastX] = React.useState(0);
    const [lastY, setLastY] = React.useState(0);
    const [zoom, setZoom] = React.useState(1);

    const draw = (context) => {
        // Your drawing code here, taking `zoom` into account
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        // ... (draw stars with the current zoom level)
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setLastX(e.clientX);
        setLastY(e.clientY);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            // Apply camera control logic based on dx and dy
            setLastX(e.clientX);
            setLastY(e.clientY);
            // After updating positions, redraw
            const context = canvasRef.current.getContext('2d');
            draw(context);
        }
    };

    const handleWheel = (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            setZoom((prevZoom) => Math.min(prevZoom * 1.1, 5)); // zoom in
        } else {
            setZoom((prevZoom) => Math.max(prevZoom / 1.1, 1)); // zoom out
        }
        const context = canvasRef.current.getContext('2d');
        draw(context);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        draw(context);

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('wheel', handleWheel);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('wheel', handleWheel);
        };
    }, [isDragging, lastX, lastY, zoom]);

    return <canvas ref={canvasRef} width={800} height={600} />;
};

export default StarField;
