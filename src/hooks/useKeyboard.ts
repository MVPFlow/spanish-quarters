import { useEffect, useState } from "react";

export const useKeyboard = () => {
  const [actions, setActions] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          setActions((prev) => ({ ...prev, moveForward: true }));
          break;
        case "KeyS":
        case "ArrowDown":
          setActions((prev) => ({ ...prev, moveBackward: true }));
          break;
        case "KeyA":
        case "ArrowLeft":
          setActions((prev) => ({ ...prev, moveLeft: true }));
          break;
        case "KeyD":
        case "ArrowRight":
          setActions((prev) => ({ ...prev, moveRight: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          setActions((prev) => ({ ...prev, moveForward: false }));
          break;
        case "KeyS":
        case "ArrowDown":
          setActions((prev) => ({ ...prev, moveBackward: false }));
          break;
        case "KeyA":
        case "ArrowLeft":
          setActions((prev) => ({ ...prev, moveLeft: false }));
          break;
        case "KeyD":
        case "ArrowRight":
          setActions((prev) => ({ ...prev, moveRight: false }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return actions;
};
