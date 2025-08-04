import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function IdleLogout() {
  const navigate = useNavigate();
  const timer = useRef();

  const resetTimer = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      alert("You have been logged out due to inactivity");

      try {
        await axios.post("http://localhost:3000/api/user/logout", {}, { withCredentials: true });
      } catch (error) {
        console.error("Error logging out:", error);
      }

      navigate("/");
    }, 60 * 1000);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearTimeout(timer.current);
    };
  }, []);

  return null;
}
