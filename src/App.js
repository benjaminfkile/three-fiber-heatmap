import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { DoubleSide, RepeatWrapping, sRGBEncoding } from "three";
import {
  Loader,
  OrbitControls,
  PerspectiveCamera,
  useTexture
} from "@react-three/drei";

import { vertexShader, fragmentShader } from "./shaders";

import "./style.css";

export default function App() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Canvas>
        <Suspense fallback={null}>
          <group>
            <Terrain />
          </group>
          <ambientLight />
        </Suspense>
        <PerspectiveCamera
          position={[0.5, 0.5, 0.5]}
          near={0.01}
          far={1000}
          makeDefault
        />
        <OrbitControls screenSpacePanning={false} />
      </Canvas>
      <Loader />
    </div>
  );
}

function Terrain() {
  // Load the heightmap image
  const heightMap = useTexture("/uluru-heightmap.png");
  // Apply some properties to ensure it renders correctly
  heightMap.encoding = sRGBEncoding;
  heightMap.wrapS = RepeatWrapping;
  heightMap.wrapT = RepeatWrapping;
  heightMap.anisotropy = 16;

  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[1 / 1024, 1 / 1024, 1 / 1024]}
    >
      <planeBufferGeometry args={[1024, 1024, 256, 256]} />
      <shaderMaterial
        uniforms={{
          // Feed the heightmap
          bumpTexture: { value: heightMap },
          // Feed the scaling constant for the heightmap
          bumpScale: { value: 50 }
        }}
        // Feed the shaders as strings
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={DoubleSide}
      />
    </mesh>
  );
}
