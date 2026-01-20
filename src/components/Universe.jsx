import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import useStore, { SCALES } from '../stores/useStore';
import UniverseScale from './UniverseScale';
import GalaxyInterior from './GalaxyInterior';
import SolarSystem from './SolarSystem';
import Stars from './Stars';

// Camera settings for each scale
const CAMERA_CONFIGS = {
    [SCALES.UNIVERSE]: {
        position: [8, 4, 8],
        fov: 60,
        near: 0.01,
        far: 1000,
        minDistance: 1,
        maxDistance: 100
    },
    [SCALES.GALAXY]: {
        position: [80, 40, 80],
        fov: 60,
        near: 0.1,
        far: 2000,
        minDistance: 10,
        maxDistance: 500
    },
    [SCALES.SOLAR_SYSTEM]: {
        position: [100, 50, 100],
        fov: 60,
        near: 0.1,
        far: 10000,
        minDistance: 5,
        maxDistance: 1000
    }
};

// Camera controller with scale-based transitions
const CameraController = ({ controlsRef }) => {
    const { camera } = useThree();
    const { currentScale, cameraTarget, clearCameraTarget, isTransitioning, setIsTransitioning } = useStore();
    const animationRef = React.useRef({ progress: 0, startPos: null, targetPos: null });

    // Handle scale changes
    useEffect(() => {
        const config = CAMERA_CONFIGS[currentScale];
        if (config) {
            setIsTransitioning(true);
            animationRef.current = {
                progress: 0,
                startPos: camera.position.clone(),
                targetPos: new THREE.Vector3(...config.position)
            };

            // Update camera properties
            camera.fov = config.fov;
            camera.near = config.near;
            camera.far = config.far;
            camera.updateProjectionMatrix();

            // Update controls
            if (controlsRef.current) {
                controlsRef.current.minDistance = config.minDistance;
                controlsRef.current.maxDistance = config.maxDistance;
            }
        }
    }, [currentScale, camera, setIsTransitioning, controlsRef]);

    // Handle fly-to target
    useEffect(() => {
        if (cameraTarget) {
            animationRef.current = {
                progress: 0,
                startPos: camera.position.clone(),
                targetPos: new THREE.Vector3(
                    cameraTarget[0] + 20,
                    cameraTarget[1] + 10,
                    cameraTarget[2] + 20
                )
            };
        }
    }, [cameraTarget, camera]);

    useFrame((state, delta) => {
        const anim = animationRef.current;

        if (anim.progress < 1 && anim.startPos && anim.targetPos) {
            anim.progress += delta * 0.8;

            if (anim.progress >= 1) {
                anim.progress = 1;
                setIsTransitioning(false);
                clearCameraTarget();
            }

            // Smooth easing
            const t = 1 - Math.pow(1 - anim.progress, 3);
            camera.position.lerpVectors(anim.startPos, anim.targetPos, t);
        }
    });

    return null;
};

// Performance tracker
const PerformanceTracker = () => {
    const { setFps } = useStore();
    const frameCount = React.useRef(0);
    const lastTime = React.useRef(performance.now());

    useFrame(() => {
        frameCount.current++;
        const now = performance.now();
        if (now - lastTime.current >= 1000) {
            setFps(frameCount.current);
            frameCount.current = 0;
            lastTime.current = now;
        }
    });

    return null;
};

// Scene content based on current scale
const SceneContent = () => {
    const { currentScale } = useStore();

    switch (currentScale) {
        case SCALES.UNIVERSE:
            return <UniverseScale />;
        case SCALES.GALAXY:
            return <GalaxyInterior />;
        case SCALES.SOLAR_SYSTEM:
        case SCALES.PLANET:
            return (
                <>
                    <Stars count={10000} />
                    <SolarSystem />
                </>
            );
        default:
            return <UniverseScale />;
    }
};

const Universe = () => {
    const { setObjectCount, currentScale } = useStore();
    const controlsRef = React.useRef();

    useEffect(() => {
        // Update object count based on scale
        const counts = {
            [SCALES.UNIVERSE]: 5 + 300, // 5 galaxies + background
            [SCALES.GALAXY]: 10000, // Star clusters + nebulae
            [SCALES.SOLAR_SYSTEM]: 10010 // Stars + planets
        };
        setObjectCount(counts[currentScale] || 0);
    }, [currentScale, setObjectCount]);

    const config = CAMERA_CONFIGS[currentScale] || CAMERA_CONFIGS[SCALES.UNIVERSE];

    return (
        <div className="canvas-container">
            <Canvas
                camera={{
                    position: config.position,
                    fov: config.fov,
                    near: config.near,
                    far: config.far
                }}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: 'high-performance'
                }}
            >
                {/* Dark space background */}
                <color attach="background" args={['#000008']} />

                {/* Ambient light */}
                <ambientLight intensity={0.15} />

                {/* Camera controls */}
                <OrbitControls
                    ref={controlsRef}
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={config.minDistance}
                    maxDistance={config.maxDistance}
                    zoomSpeed={0.8}
                    rotateSpeed={0.5}
                    panSpeed={0.5}
                    dampingFactor={0.05}
                    enableDamping={true}
                />

                {/* Camera controller */}
                <CameraController controlsRef={controlsRef} />

                {/* Performance tracker */}
                <PerformanceTracker />

                {/* Scene content based on scale */}
                <Suspense fallback={null}>
                    <SceneContent />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Universe;
