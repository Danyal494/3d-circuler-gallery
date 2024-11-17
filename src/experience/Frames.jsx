import React, { useEffect, useRef } from "react";
import { frames } from "../../constants";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { lerp } from "three/src/math/MathUtils.js";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useDragging from "../hooks/useDragging";
import useImageStore from "../stores/useImageStore";
const bunchofFrames = (n) => {
  const newFrames = [];
  for (let i = 0; i < n; i++) {
    newFrames.push(...frames);
  }
  return newFrames;
};

const Frames = () => {

  const groupRef = useRef();
  const newFrames = bunchofFrames(10);
  const xRotation = Math.PI * 0.2;
  const coef = 0.1;
  const sief = 0.1;
  const ease = 0.06;

  useFrame((state) => {
    const x = state.pointer.x;
    const y = state.pointer.y;

    // groupRef.current.rotation.y = x * 0.4
    groupRef.current.rotation.y = lerp(
      groupRef.current.rotation.y,
      x * sief,
      ease
    );
    groupRef.current.rotation.x = lerp(
      groupRef.current.rotation.x,
      xRotation - y * coef,
      ease
    );
  });
  return (
    <>
      <group ref={groupRef} rotation={[xRotation, 0, 0]} position={[0, 2, 0]}>
        {newFrames.map((frame, index) => {
          return (
            <Frame
              key={index}
              frame={frame}
              index={index}
              total={newFrames.length}
            />
          );
        })}
      </group>
    </>
  );
};

export default Frames;

const Frame = (props) => {
  const {nodes} = useGLTF("/Plane.glb")
  const { frame, index, total } = props;
  //   const total = frames.length

  if (!nodes) {
    console.error("GLTF nodes not found");
    return null;
  }

  if (!nodes.Cube || !nodes.Cube.geometry) {
    console.error("Plane node or geometry missing. Available nodes:", nodes);
    return null;
  }
  const geometry = nodes.Cube.geometry;

  const normalize = (vec2) => {
    const distance = Math.sqrt(vec2.x ** 2 + vec2.y ** 2);
    return {
      x: vec2.x / distance ,
      y: vec2.y / distance ,
    };
  };

  const radius = 10;
  const x = Math.cos((index * Math.PI * 2) / total) * radius;
  const z = Math.sin((index * Math.PI * 2) / total) * radius;
  const yRotation = -(index * Math.PI * 2) / total;
  const texture = useTexture(frame.url);
  texture.wrapS = THREE.RepeatWrapping; // Horizontal wrapping
texture.wrapT = THREE.RepeatWrapping; // Vertical wrapping

// Adjust the texture scale if needed
texture.repeat.set(1, 1); // Set repeat scaling factors (1 means no repeat)

  const image = useRef();
const groupRef = useRef()

const setImage = useImageStore((state) =>state.setImage) 

  const { contextSafe } = useGSAP();

  const handlePointerHover = contextSafe((e) => {
    e.stopPropagation();
    const offset = normalize({ x, y: z });
    gsap.to(image.current.position, { x: x + offset.x * 2, z: z + offset.y * 2 });
    
    const newImageIndex = index % frames.length;  // Correct frame array reference
    console.log("Setting image index:", newImageIndex);
    setImage(newImageIndex);
  });
  const handlePointerOut = contextSafe((e) => {
    e.stopPropagation()
    gsap.to(image.current.position,{
      x,
      z,
    })
    setImage(null)
  });

  const scrollOffset = useRef(0)
  const speed = 0.001
  const {isDragging,eventData} = useDragging()

  useEffect(()=>{
    if (isDragging && eventData ){

    
if(eventData.type == "mousemove"){
  const movement = Math.max(
    Math.abs(eventData.movementY),
    Math.abs(eventData.movementX)
  ) * speed * 0.5
  const direction = Math.abs(eventData.movementY) > Math.abs(eventData.movementX) ? Math.sign(eventData.movementY) : -Math.sign(eventData.movementX);
  scrollOffset.current += movement * direction
} else if (eventData.type === "touchmove") {
  scrollOffset.current += Math.max(eventData.clientY,eventData.clientX) * speed
}
}
  },[isDragging,eventData])

useFrame(() => {
  scrollOffset.current = lerp(scrollOffset.current, 0 ,0.1 )
  groupRef.current.rotation.y += scrollOffset.current
})

  return (
    <>
    <group ref={groupRef}>

      <mesh
        ref={image}
//  geometry={geometry}
        position={[x, 0, z]}
        rotation={[0, yRotation, 0]}
        // scale={[-0.014, -1, -1]}
        >
        <planeGeometry args={[1.5, 1]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
      <mesh   onPointerEnter={handlePointerHover}
        onPointerOut={handlePointerOut} position={[x,0,z]} rotation={[0,yRotation,0]}>
        <planeGeometry args={[1.5,1]}/>
        <meshBasicMaterial   transparent opacity={0} side={THREE.DoubleSide}/>
       </mesh>
          </group>
    </>
  );
};
