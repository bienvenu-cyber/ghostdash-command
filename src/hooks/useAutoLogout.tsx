import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const useAutoLogout = () => {
  const { user, signOut } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (user) {
      timeoutRef.current = setTimeout(() => {
        toast.info("You've been logged out due to inactivity");
        signOut();
      }, INACTIVITY_TIMEOUT);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Events that reset the timer
    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Initial timer
    resetTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user]);
};
