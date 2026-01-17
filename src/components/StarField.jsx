import React, { useEffect } from 'react';
import * as THREE from 'three';

const StarField = () => {
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const stars = 10000;
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = new Float32Array(stars * 3);

        for (let i = 0; i < stars; i++) {
            starVertices[i * 3] = (Math.random() - 0.5) * 2000;
            starVertices[i * 3 + 1] = (Math.random() - 0.5) * 2000;
            starVertices[i * 3 + 2] = (Math.random() - 0.5) * 2000;
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
        const starsMesh = new THREE.Points(starGeometry, starMaterial);
        scene.add(starsMesh);

        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);
            starsMesh.rotation.x += 0.0005;
            starsMesh.rotation.y += 0.0005;
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            document.body.removeChild(renderer.domElement);
        };
    }, []);

    return null;
};

export default StarField;