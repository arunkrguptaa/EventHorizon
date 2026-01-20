import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../stores/useStore';
import { GALAXY_TYPES } from '../data/galaxyData';

// Spiral galaxy shader for particle-based arms
const galaxyVertexShader = `
  attribute float size;
  attribute vec3 customColor;
  varying vec3 vColor;
  varying float vDistance;
  
  void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDistance = length(mvPosition.xyz);
    // Scale size based on distance for perspective but keep distant stars visible
    gl_PointSize = size * (300.0 / vDistance);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const galaxyFragmentShader = `
  varying vec3 vColor;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    // Soft particle edge
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Brighter core for each star
    float glow = exp(-dist * 4.0);
    
    // Boost color saturation and brightness
    vec3 color = vColor * (0.8 + glow * 0.8);
    gl_FragColor = vec4(color, alpha);
  }
`;

const Galaxy = ({ data, onClick }) => {
    const groupRef = useRef();
    const coreRef = useRef();
    const particlesRef = useRef();
    const [hovered, setHovered] = useState(false);

    const { setSelectedObject, currentScale } = useStore();

    // Generate spiral arm particles
    const { positions, colors, sizes } = useMemo(() => {
        // Increase count for denser, clearer galaxies
        const count = data.starCount || (data.type === GALAXY_TYPES.IRREGULAR ? 3000 : 8000);
        const posArray = new Float32Array(count * 3);
        const colorArray = new Float32Array(count * 3);
        const sizeArray = new Float32Array(count);

        const armColor = new THREE.Color(data.armColor);
        const coreColor = new THREE.Color(data.coreColor);
        const hiiColor = new THREE.Color('#ff0055'); // Pinkish for star formation

        const hasBar = data.type === GALAXY_TYPES.BARRED_SPIRAL;
        const barLength = hasBar ? data.size * 2.5 : 0;
        const barWidth = hasBar ? data.size * 0.6 : 0;

        for (let i = 0; i < count; i++) {
            let x, y, z;
            let r, g, b;

            // Barred Spiral Logic (Milky Way)
            if (hasBar && i < count * 0.25) {
                // --- BAR GENERATION ---
                const t = (Math.random() - 0.5) * 2; // -1 to 1
                const densityProfile = 1 - Math.abs(t);

                x = t * barLength * (0.5 + Math.random() * 0.5);
                z = (Math.random() - 0.5) * barWidth * Math.pow(Math.abs(densityProfile), 0.5);
                y = (Math.random() - 0.5) * barWidth * 0.3 * densityProfile;

                // Rotation for the bar
                const barAngle = Math.PI / 4;
                const bx = x * Math.cos(barAngle) - z * Math.sin(barAngle);
                const bz = x * Math.sin(barAngle) + z * Math.cos(barAngle);
                x = bx; z = bz;

                const barCol = coreColor.clone().lerp(new THREE.Color('#ffaa66'), 0.3);
                r = barCol.r; g = barCol.g; b = barCol.b;

                sizeArray[i] = 1.0 + Math.random() * 2.0;
            }
            else if (data.type === GALAXY_TYPES.SPIRAL || data.type === GALAXY_TYPES.BARRED_SPIRAL) {
                // --- SPIRAL ARMS ---
                const arms = data.type === GALAXY_TYPES.BARRED_SPIRAL ? 2 : 3;
                const armIndex = Math.floor(Math.random() * arms);
                const angleOffset = Math.PI * 2 / arms * armIndex;

                const distNorm = Math.pow(Math.random(), 0.7);
                // Arms start further out for barred spirals
                const startRadius = hasBar ? barLength * 0.5 : 0;
                const radius = startRadius + distNorm * data.size * 6.0;

                const winding = 5.0;
                const angle = angleOffset + (winding * distNorm);

                const curveX = Math.cos(angle) * radius;
                const curveZ = Math.sin(angle) * radius;

                const width = data.size * 1.5 * (0.3 + distNorm);
                const scatterR = (Math.random() - 0.5) * width;
                const scatterTheta = Math.random() * Math.PI * 2;

                x = curveX + Math.cos(scatterTheta) * scatterR;
                z = curveZ + Math.sin(scatterTheta) * scatterR;

                y = (Math.random() - 0.5) * data.size * 1.0 * Math.exp(-distNorm * 3);

                // Colors
                let baseCol = coreColor.clone().lerp(armColor, distNorm);

                // Dust lanes (gaps/darker patches)
                const noise = Math.sin(x * 0.4) * Math.cos(z * 0.4);
                if (noise > 0.6 && distNorm > 0.2) {
                    baseCol.multiplyScalar(0.5).add(new THREE.Color(0.1, 0.05, 0));
                }

                // Star forming regions
                if (Math.random() > 0.97 && distNorm > 0.4) {
                    baseCol = hiiColor;
                }

                r = baseCol.r; g = baseCol.g; b = baseCol.b;
                sizeArray[i] = 0.8 + Math.random() * 2.2;
            }
            else if (data.type === GALAXY_TYPES.ELLIPTICAL) {
                // Elliptical Logic
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const rNorm = Math.pow(Math.random(), 0.4);
                const radius = rNorm * data.size * 4;

                x = radius * Math.sin(phi) * Math.cos(theta);
                y = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
                z = radius * Math.cos(phi);

                const col = coreColor.clone().lerp(new THREE.Color('#ffffff'), rNorm * 0.5);
                r = col.r; g = col.g; b = col.b;
                sizeArray[i] = 1.0 + Math.random() * 2.0;
            }
            else {
                // Irregular
                const clumpX = (Math.random() - 0.5) * data.size * 3;
                const clumpZ = (Math.random() - 0.5) * data.size * 3;
                x = clumpX + (Math.random() - 0.5) * data.size * 1.5;
                z = clumpZ + (Math.random() - 0.5) * data.size * 1.5;
                y = (Math.random() - 0.5) * data.size * 0.8;

                r = armColor.r; g = armColor.g; b = armColor.b;
                sizeArray[i] = 1.0 + Math.random() * 2.0;
            }

            // Global noise
            r += (Math.random() - 0.5) * 0.1;
            g += (Math.random() - 0.5) * 0.1;
            b += (Math.random() - 0.5) * 0.1;

            posArray[i * 3] = x;
            posArray[i * 3 + 1] = y;
            posArray[i * 3 + 2] = z;

            colorArray[i * 3] = r;
            colorArray[i * 3 + 1] = g;
            colorArray[i * 3 + 2] = b;
        }

        return { positions: posArray, colors: colorArray, sizes: sizeArray };
    }, [data]);

    // Shader material
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: galaxyVertexShader,
            fragmentShader: galaxyFragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
    }, []);

    // Slow rotation
    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.03; // Slightly faster rotation
        }
    });

    const handleClick = (e) => {
        e.stopPropagation();
        if (onClick) {
            onClick(data);
        } else {
            setSelectedObject({ ...data, currentPosition: data.position });
        }
    };

    const handlePointerOver = (e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHovered(true);
    };

    const handlePointerOut = (e) => {
        document.body.style.cursor = 'default';
        setHovered(false);
    };

    return (
        <group
            ref={groupRef}
            position={data.position}
            rotation={data.rotation || [0, 0, 0]}
        >
            {/* Interactive Hit Box (Invisible but larger than galaxy) */}
            <mesh
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                visible={false}
            >
                <sphereGeometry args={[data.size * 4, 16, 16]} />
                <meshBasicMaterial />
            </mesh>

            {/* Galaxy Label */}
            {hovered && (
                <Html position={[0, data.size * 2, 0]} distanceFactor={10} center>
                    <div className="galaxy-label glass-panel" style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(0,0,0,0.8)',
                        border: '1px solid var(--color-primary)',
                        color: 'var(--color-primary-light)',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px'
                    }}>
                        <span style={{ fontSize: '1.2em' }}>{data.icon} {data.name}</span>
                        <span style={{ fontSize: '0.8em', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                            {data.type}
                        </span>
                        <span style={{ fontSize: '0.7em', color: '#88ccff' }}>
                            Double-click to visit
                        </span>
                    </div>
                </Html>
            )}

            {/* Core glow */}
            <mesh>
                <sphereGeometry args={[data.size * 0.8, 32, 32]} />
                <meshBasicMaterial
                    color={data.coreColor}
                    transparent
                    opacity={0.6}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Star particles */}
            <points ref={particlesRef} material={shaderMaterial}>
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
        </group>
    );
};

export default Galaxy;
