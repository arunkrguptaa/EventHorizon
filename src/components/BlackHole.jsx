import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../stores/useStore';

// Black hole shader with gravitational lensing effect
const blackHoleVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const blackHoleFragmentShader = `
  uniform float time;
  uniform vec3 diskColor;
  varying vec2 vUv;
  
  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    
    // Event horizon (pure black)
    if (dist < 0.15) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }
    
    // Accretion disk
    if (dist > 0.15 && dist < 0.5) {
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
      float spiral = sin(angle * 3.0 + time * 2.0 + dist * 10.0) * 0.5 + 0.5;
      
      float intensity = (1.0 - (dist - 0.15) / 0.35) * spiral;
      intensity = pow(intensity, 1.5);
      
      vec3 color = diskColor * intensity;
      color += vec3(1.0, 0.5, 0.2) * pow(intensity, 3.0); // Hot inner edge
      
      gl_FragColor = vec4(color, intensity);
    } else {
      discard;
    }
  }
`;

// Accretion disk vertex shader
const diskVertexShader = `
  varying vec2 vUv;
  varying float vRadius;
  
  void main() {
    vUv = uv;
    vRadius = length(position.xz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const diskFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying float vRadius;
  
  void main() {
    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
    
    // Spiral pattern
    float spiral = sin(angle * 5.0 - time * 3.0 + vRadius * 20.0) * 0.5 + 0.5;
    
    // Temperature gradient (hotter closer to center)
    float temp = 1.0 - smoothstep(0.2, 0.9, vRadius / 2.0);
    
    // Color from hot (white/blue) to cool (red/orange)
    vec3 hotColor = vec3(1.0, 0.9, 0.8);
    vec3 coolColor = vec3(1.0, 0.3, 0.1);
    vec3 color = mix(coolColor, hotColor, temp);
    
    float intensity = spiral * (1.0 - vRadius / 2.5) * 1.5;
    intensity = clamp(intensity, 0.0, 1.0);
    
    gl_FragColor = vec4(color * intensity, intensity * 0.9);
  }
`;

const BlackHole = ({ position = [0, 0, 0], size = 1, name = "Sagittarius A*" }) => {
    const groupRef = useRef();
    const diskRef = useRef();
    const eventHorizonRef = useRef();
    const coronaRef = useRef();

    const { setSelectedObject } = useStore();

    // Time uniform for animation
    const uniforms = useMemo(() => ({
        time: { value: 0 },
        diskColor: { value: new THREE.Color('#ff6b35') }
    }), []);

    // Disk shader material
    const diskMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms,
            vertexShader: diskVertexShader,
            fragmentShader: diskFragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
    }, [uniforms]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        uniforms.time.value = time;

        if (diskRef.current) {
            diskRef.current.rotation.y = time * 0.5;
        }

        if (coronaRef.current) {
            const scale = 1 + Math.sin(time * 3) * 0.1;
            coronaRef.current.scale.setScalar(scale);
        }
    });

    const handleClick = (e) => {
        e.stopPropagation();
        setSelectedObject({
            id: 'sagittarius-a',
            name,
            type: 'black hole',
            icon: '🕳️',
            currentPosition: position,
            facts: {
                mass: '4 million solar masses',
                diameter: '44 million km',
                distance: '26,000 light years',
                type: 'Supermassive Black Hole',
                discovered: '1974'
            }
        });
    };

    return (
        <group ref={groupRef} position={position}>
            {/* Event Horizon (the "black" part) */}
            <mesh
                ref={eventHorizonRef}
                onClick={handleClick}
                onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { document.body.style.cursor = 'default'; }}
            >
                <sphereGeometry args={[size * 0.3, 64, 64]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Photon sphere glow */}
            <mesh>
                <sphereGeometry args={[size * 0.35, 32, 32]} />
                <meshBasicMaterial
                    color="#ff4500"
                    transparent
                    opacity={0.2}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Accretion Disk */}
            <mesh
                ref={diskRef}
                rotation={[Math.PI / 2.5, 0, 0]}
                material={diskMaterial}
            >
                <ringGeometry args={[size * 0.4, size * 2.5, 128, 8]} />
            </mesh>

            {/* Second tilted disk layer for volume */}
            <mesh rotation={[Math.PI / 2.2, 0.3, 0]} material={diskMaterial}>
                <ringGeometry args={[size * 0.5, size * 2, 128, 8]} />
            </mesh>

            {/* Corona / gravitational lensing glow */}
            <mesh ref={coronaRef}>
                <sphereGeometry args={[size * 3, 32, 32]} />
                <meshBasicMaterial
                    color="#ff6b35"
                    transparent
                    opacity={0.05}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Relativistic jets (simplified) */}
            <mesh position={[0, size * 3, 0]} rotation={[0, 0, 0]}>
                <coneGeometry args={[size * 0.3, size * 4, 16]} />
                <meshBasicMaterial
                    color="#88ccff"
                    transparent
                    opacity={0.3}
                />
            </mesh>
            <mesh position={[0, -size * 3, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[size * 0.3, size * 4, 16]} />
                <meshBasicMaterial
                    color="#88ccff"
                    transparent
                    opacity={0.3}
                />
            </mesh>
        </group>
    );
};

export default BlackHole;
