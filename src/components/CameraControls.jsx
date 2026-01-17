import React, { useState, useEffect } from 'react';

const CameraControls = () => {
    const [position, setPosition] = useState({ x: 0, y: 0, z: 10 });
    const [isDragging, setIsDragging] = useState(false);
    const [prevMousePos, setPrevMousePos] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setPrevMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const deltaX = e.clientX - prevMousePos.x;
            const deltaY = e.clientY - prevMousePos.y;
            setPosition((prevPosition) => ({
                ...prevPosition,
                x: prevPosition.x - deltaX * 0.1,
                y: prevPosition.y - deltaY * 0.1,
            }));
            setPrevMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e) => {
        setPosition((prevPosition) => ({
            ...prevPosition,
            z: prevPosition.z + e.deltaY * 0.1,
        }));
        e.preventDefault();
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('wheel', handleWheel);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('wheel', handleWheel);
        };
    }, [isDragging]);

    return (
        <div>
            <h1>Camera Position</h1>
            <p>X: {position.x.toFixed(2)}</p>
            <p>Y: {position.y.toFixed(2)}</p>
            <p>Z: {position.z.toFixed(2)}</p>
        </div>
    );
};

export default CameraControls;