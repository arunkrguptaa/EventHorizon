import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../stores/useStore';

const AsteroidBelt = ({ count = 2000 }) => {
    const meshRef = useRef();
    const { isPaused, timeScale } = useStore();

    // Generate asteroid data
    const asteroids = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            // Distance between Mars (228) and Jupiter (778)
            // Main belt is roughly 2.2 to 3.2 AU (329 to 478 million km)
            const angle = Math.random() * Math.PI * 2;
            const distance = 350 + Math.random() * 150;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            const y = (Math.random() - 0.5) * 20; // Some vertical spread

            const scale = Math.random() * 0.5 + 0.1; // Varied sizes

            temp.push({
                position: new THREE.Vector3(x, y, z),
                rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
                scale: scale,
                angle: angle,
                distance: distance,
                speed: (0.5 + Math.random() * 0.5) * (1000 / distance) // Inner ones faster
            });
        }
        return temp;
    }, [count]);

    // Update positions (orbit)
    useFrame((state, delta) => {
        if (meshRef.current && !isPaused) {
            const time = state.clock.getElapsedTime();

            asteroids.forEach((asteroid, i) => {
                const matrix = new THREE.Matrix4();

                // Calculate new angle based on speed
                // We simplify by adding speed * time to initial angle
                // In a real simulation we'd integrate, but this is visual
                const currentAngle = asteroid.angle + (time * asteroid.speed * timeScale * 0.0001);

                const x = Math.cos(currentAngle) * asteroid.distance;
                const z = Math.sin(currentAngle) * asteroid.distance;

                // Construct matrix
                matrix.makeRotationFromEuler(asteroid.rotation);
                matrix.setPosition(x, asteroid.position.y, z);
                matrix.scale(new THREE.Vector3(asteroid.scale, asteroid.scale, asteroid.scale));

                meshRef.current.setMatrixAt(i, matrix);
            });

            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
                color="#666666"
                roughness={0.9}
                metalness={0.1}
            />
        </instancedMesh>
    );
};

export default AsteroidBelt;
