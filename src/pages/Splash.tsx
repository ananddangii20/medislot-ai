import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => navigate("/home", { replace: true }), 500);
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 rounded-3xl bg-hero-gradient flex items-center justify-center animate-pulse-heart">
              <Heart className="w-10 h-10 text-primary-foreground" fill="currentColor" />
            </div>
            <div className="text-center">
              <h1 className="font-heading font-bold text-3xl">MediSlot AI</h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mt-2 text-sm"
              >
                Smart Healthcare. Simplified.
              </motion.p>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ delay: 0.6, duration: 1.4, ease: "easeInOut" }}
              className="h-1 rounded-full bg-hero-gradient"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
