import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../stores/useStore';

const Planet = ({
    data,
    parentPosition = [0, 0, 0],
    initialAngle = 0
}) => {
    const meshRef = useRef();
    const orbitRef = useRef();
    const ringRef = useRef();

    const { timeScale, isPaused, setSelectedObject, showOrbits } = useStore();

    // Calculate orbital speed from period
    const orbitalSpeed = useMemo(() => {
        return (2 * Math.PI) / (data.orbitalPeriod * 60); // Scale time
    }, [data.orbitalPeriod]);

    // Create orbit line geometry
    const orbitGeometry = useMemo(() => {
        const points = [];
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            points.push(
                new THREE.Vector3(
                    Math.cos(angle) * data.orbitalRadius + parentPosition[0],
                    parentPosition[1],
                    Math.sin(angle) * data.orbitalRadius + parentPosition[2]
                )
            );
        }
        return new THREE.BufferGeometry().setFromPoints(points);
    }, [data.orbitalRadius, parentPosition]);

    // Saturn's rings geometry
    const ringGeometry = useMemo(() => {
        if (!data.hasRings) return null;
        return new THREE.RingGeometry(data.ringInnerRadius, data.ringOuterRadius, 64);
    }, [data.hasRings, data.ringInnerRadius, data.ringOuterRadius]);

    // Animation
    useFrame((state, delta) => {
        if (meshRef.current && !isPaused) {
            // Orbital motion
            const time = state.clock.getElapsedTime();
            const angle = initialAngle + time * orbitalSpeed * timeScale;

            meshRef.current.position.x = Math.cos(angle) * data.orbitalRadius + parentPosition[0];
            meshRef.current.position.z = Math.sin(angle) * data.orbitalRadius + parentPosition[2];
            meshRef.current.position.y = parentPosition[1];

            // Self rotation
            meshRef.current.rotation.y += delta * (1 / Math.abs(data.rotationPeriod || 1)) * 0.5;

            // Update rings position if present
            if (ringRef.current) {
                ringRef.current.position.copy(meshRef.current.position);
            }
        }
    });

    const handleClick = (e) => {
        e.stopPropagation();
        setSelectedObject({
            ...data,
            currentPosition: meshRef.current ? meshRef.current.position.toArray() : [0, 0, 0]
        });
    };

    return (
        <group>
            {/* Orbit path */}
            {showOrbits && (
                <line ref={orbitRef} geometry={orbitGeometry}>
                    <lineBasicMaterial
                        color={data.color}
                        transparent
                        opacity={0.2}
                    />
                </line>
            )}

            {/* Planet sphere */}
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
                <sphereGeometry args={[Math.max(data.radius, 0.5), 32, 32]} />
                <meshStandardMaterial
                    color={data.color}
                    roughness={0.8}
                    metalness={0.1}
                />
            </mesh>

            {/* Saturn's rings */}
            {data.hasRings && ringGeometry && (
                <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
                    <primitive object={ringGeometry} attach="geometry" />
                    <meshStandardMaterial
                        color="#f4d59e"
                        transparent
                        opacity={0.6}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}
        </group>
    );
};

export default Planet;
