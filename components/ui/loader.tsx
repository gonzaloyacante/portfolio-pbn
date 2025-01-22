import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height: "calc(100vh - 12rem)" }}>
      <motion.div
        className="flex justify-center items-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <div className="w-4 h-4 bg-primary rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-75"></div>
        <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-150"></div>
      </motion.div>
    </div>
  );
};

export default Loader;
