import React, { useEffect } from "react";
import * as THREE from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Visualization() {
  useEffect(() => {
    let container;
    let camera, scene, renderer, controls, loader;

    // Drone movement data (replace this with your actual data)
    const droneMovementData = [
      { x: 10, y: 10, z: 10 },
      { x: 20, y: 20, z: 20 },
      // Add more positions as needed
    ];

    init();
    animate();

    function init() {
      // Creating the container for the ply
      container = document.createElement("div");
      document.body.appendChild(container);

      // Initializing the camera
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.01,
        2000
      );
      camera.position.z = 2;
      camera.position.set(0, 9, 1500);

      // Initializing the scene
      scene = new THREE.Scene();
      scene.add(new THREE.AxesHelper(30));

      // Initializing renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      // renderer.outputEncoding = THREE.sRGBEncoding;

      // Adding renderer to DOM
      container.appendChild(renderer.domElement);

      // Initializing interactive controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.update();

      // Rendering ply file
      const plyLoader = new PLYLoader();

      plyLoader.load(
        "example1.ply",
        function (geometry) {
          const material = new THREE.PointsMaterial({
            color: 0xff0000,
            size: 1,
          });
          const points = new THREE.Points(geometry, material);
          points.rotateX(-Math.PI / 2);
          scene.add(points);
        },
        // called when loading is in progress
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // called when loading has errors
        function (error) {
          console.log("An error happened");
          console.log(error);
        }
      );

      // Plotting drone movements
      const dronePathGeometry = new THREE.BufferGeometry();
      const dronePathMaterial = new THREE.LineBasicMaterial({
        color: 0x00ff00,
      });
      const dronePathPoints = [];

      droneMovementData.forEach((position) => {
        dronePathPoints.push(position.x, position.y, position.z);
      });

      dronePathGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(dronePathPoints, 3)
      );
      const dronePath = new THREE.Line(dronePathGeometry, dronePathMaterial);
      scene.add(dronePath);
    }

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update();
    }

    // Clean up Three.js objects and listeners when component unmounts
    return () => {
      // Remove the renderer's DOM element from the container
      container.removeChild(renderer.domElement);
      // Dispose the renderer to release resources
      // renderer.dispose();
      // Dispose controls to release resources
      // controls.dispose();
      // Dispose scene to release resources
      // scene.dispose();
    };
  }, []);

  return <div />;
}
