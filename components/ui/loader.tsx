import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      className="flex justify-center items-center space-x-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <div className="w-4 h-4 bg-primary rounded-full animate-bounce"></div>
      <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-[75ms]"></div>
      <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-150"></div>
    </motion.div>
  );
};

export default Loader;
