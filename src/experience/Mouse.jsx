import { motion, useMotionValue, useSpring } from "framer-motion";
import useMouse from "../hooks/useMouse";

const MouseFollow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 300, damping: 90 });
  const y = useSpring(mouseY, { stiffness: 300, damping: 90 });
  const mouse = useMouse();
  mouseX.set(mouse.x - 8);
  mouseY.set(mouse.y - 8);
  return (
    <motion.div
      style={{
        x,
        y,
      }}
      className="absolute size-4 rounded-full z-10 top-0 left-0 bg-black"
    />
  );
};

export default MouseFollow;