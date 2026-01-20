import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getStarCatalog, getStarPositions, getStarColors, getStarSizes } from '../data/starCatalog';

// Custom shader for star points with glow effect
const starVertexShader = `
  attribute float size;
  attribute vec3 customColor;
  varying vec3 vColor;
  
  void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragmentShader = `
  varying vec3 vColor;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    // Create soft glow effect
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    float glow = exp(-dist * 4.0);
    
    vec3 color = vColor * (0.8 + glow * 0.5);
    gl_FragColor = vec4(color, alpha * 0.9);
  }
`;

const Stars = ({ count = 10000 }) => {
    const pointsRef = useRef();

    // Generate star data
    const { positions, colors, sizes } = useMemo(() => {
        const stars = getStarCatalog(count);
        return {
            positions: getStarPositions(stars),
            colors: getStarColors(stars),
            sizes: getStarSizes(stars),
        };
    }, [count]);

    // Create shader material
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: starVertexShader,
            fragmentShader: starFragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
    }, []);

    // Subtle rotation animation
    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.005;
        }
    });

    return (
        <points ref={pointsRef} material={shaderMaterial}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-customColor"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={sizes.length}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
        </points>
    );
};

export default Stars;
