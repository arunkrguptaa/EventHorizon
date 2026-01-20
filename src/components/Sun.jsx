import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../stores/useStore';
import { SUN } from '../data/celestialData';

const Sun = () => {
    const meshRef = useRef();
    const glowRef = useRef();
    const { setSelectedObject } = useStore();

    // Animate sun glow
    useFrame((state) => {
        if (glowRef.current) {
            const time = state.clock.getElapsedTime();
            glowRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
        }
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.001;
        }
    });

    const handleClick = (e) => {
        e.stopPropagation();
        setSelectedObject({
            ...SUN,
            currentPosition: [0, 0, 0]
        });
    };

    return (
        <group position={[0, 0, 0]}>
            {/* Sun core */}
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
                <sphereGeometry args={[SUN.radius, 64, 64]} />
                <meshBasicMaterial
                    color={SUN.color}
                />
            </mesh>

            {/* Inner glow */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[SUN.radius * 1.1, 32, 32]} />
                <meshBasicMaterial
                    color={SUN.emissiveColor}
                    transparent
                    opacity={0.3}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Outer glow */}
            <mesh>
                <sphereGeometry args={[SUN.radius * 1.5, 32, 32]} />
                <meshBasicMaterial
                    color={SUN.emissiveColor}
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Point light from sun */}
            <pointLight
                color="#fff5e6"
                intensity={2}
                distance={500}
                decay={0.5}
            />
        </group>
    );
};

export default Sun;
