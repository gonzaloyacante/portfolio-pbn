import { motion } from "framer-motion";

const Error = ({ message }: { message: string }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <p className="text-lg text-red-500">{message}</p>
    </motion.div>
  );
};

export default Error;
