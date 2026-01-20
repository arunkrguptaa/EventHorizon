import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../stores/useStore';
import { MOON } from '../data/celestialData';

const Moon = ({ earthRef }) => {
    const meshRef = useRef();
    const orbitRef = useRef();

    const { timeScale, isPaused, setSelectedObject, showOrbits } = useStore();

    // Orbital speed
    const orbitalSpeed = useMemo(() => {
        return (2 * Math.PI) / (MOON.orbitalPeriod * 60);
    }, []);

    // Animation - follow Earth and orbit around it
    useFrame((state) => {
        if (meshRef.current && earthRef?.current && !isPaused) {
            const earthPos = earthRef.current.position;
            const time = state.clock.getElapsedTime();
            const angle = time * orbitalSpeed * timeScale;

            meshRef.current.position.x = earthPos.x + Math.cos(angle) * MOON.orbitalRadius;
            meshRef.current.position.z = earthPos.z + Math.sin(angle) * MOON.orbitalRadius;
            meshRef.current.position.y = earthPos.y;

            // Update orbit line position
            if (orbitRef.current) {
                orbitRef.current.position.copy(earthPos);
            }
        }
    });

    // Orbit line geometry (centered at origin, moved by orbitRef)
    const orbitGeometry = useMemo(() => {
        const points = [];
        const segments = 64;
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            points.push(
                new THREE.Vector3(
                    Math.cos(angle) * MOON.orbitalRadius,
                    0,
                    Math.sin(angle) * MOON.orbitalRadius
                )
            );
        }
        return new THREE.BufferGeometry().setFromPoints(points);
    }, []);

    const handleClick = (e) => {
        e.stopPropagation();
        setSelectedObject({
            ...MOON,
            currentPosition: meshRef.current ? meshRef.current.position.toArray() : [0, 0, 0]
        });
    };

    return (
        <group>
            {/* Moon orbit (follows Earth) */}
            {showOrbits && (
                <line ref={orbitRef} geometry={orbitGeometry}>
                    <lineBasicMaterial color="#888888" transparent opacity={0.2} />
                </line>
            )}

            {/* Moon sphere */}
            <mesh
                ref={meshRef}
                onClick={handleClick}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                    document.body.style.cursor = 'default';
                }}
            >
                <sphereGeometry args={[MOON.radius, 32, 32]} />
                <meshStandardMaterial
                    color={MOON.color}
                    roughness={0.9}
                    metalness={0}
                />
            </mesh>
        </group>
    );
};

export default Moon;
