import { Canvas } from "@react-three/fiber";
import Index from "./experience/Index";
import useImageStore from "./stores/useImageStore";
import { frames } from "../constants";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, delay } from "framer-motion";
import MouseFollow from "./experience/Mouse";
import './App.css'
import Background from "./Background/background";

function App() {
  const image = useImageStore((state) => state.image);
  const [frame, setFrame] = useState(frames[image]);
  const [isOut, setIsOut] = useState(true);
  const timeOutId = useRef(null);
  useEffect(() => {
    if (image === null) {
      timeOutId.current = setTimeout(() => setIsOut(true), 1000);
    } else {
      clearTimeout(timeOutId.current);
      setIsOut(false);
      setFrame(frames[image]);
    }
  }, [image]);
  return (
    <section className="h-screen overflow-hidden
     css-selector gradient-background
     ">
      {/* <Background /> */}
      <Canvas
        camera={{
          position: [0, 0, 22],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
        <Index />
      </Canvas>
      <AnimatePresence mode="wait">
        {!isOut ? <Image frame={frame} key={1} /> : <Orewa key={2} />}
      </AnimatePresence>
      <MouseFollow />
    </section>
  );
}

export default App;

const Image = ({ frame }) => {
  const mainVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
  };
  const titleVariants = {
    exit: {
      y: 50,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };
  const imageVariants = {
    exit: {
      scale: "0",
      transition: {
        duration: 0.25,
        delay:0.4
      },
    },
  };
  return (
    <motion.div
      variants={mainVariants}
      initial={"initial"}
      animate={"animate"}
      exit={"exit"}
      className="absolute left-0 z-10 top-0 w-full h-screen pointer-events-none flex flex-col justify-center items-center"
    >
      <h1 className="text-4xl text-white  font-bold mb-2 overflow-hidden">
        <motion.span variants={titleVariants} className="inline-block my-2">
          {frame.text}
        </motion.span>
      </h1>
      <figure className="w-80 relative overflow-hidden">
        <motion.div
       
          // className="bg-[#1010101f] w-full h-full absolute -top-full left-0"
        />
        <motion.img   variants={imageVariants} className="rounded-3xl" src={frame.url} alt={frame.text} />
      </figure>
    </motion.div>
  );
};

const Orewa = () => {
  const firstVariants = {
    initial: {
      x: "0%",
    },
    animate: {
      x: "105%",
      transition: {
        duration: 0.5,
        delay: 0.5,
      },
    },
  };
  const finalVariants = {
    initial: {
      x: "-105%",
    },
    animate: {
      x: "105%",
      transition: {
        duration: 1,
        delay: 0.5,
      },
    },
  };
  return (
    <div className="absolute left-0 top-0 w-full h-screen pointer-events-none flex  justify-center items-center">
      <div className="bg-[#1010104b] p-2 rounded-xl">
        <motion.h1 className="text-5xl uppercase font-bold relative overflow-hidden">
          <motion.div
            // variants={firstVariants}
            // initial={"initial"}
            // animate={"animate"}
            // className="w-full h-full bg-white absolute z-20 "
          />
          <motion.div
            // variants={finalVariants}
            // initial={"initial"}
            // animate={"animate"}
            // className="w-full h-full bg-white absolute z-10 mix-blend-difference"
          />
          <span className="text-white">Danyal Khan</span>
        </motion.h1>
      </div>
    </div>
  );
};