import styles from "./themeToggle.module.css";
import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

const ThemeToggle = () => {
  const context = useContext<ThemeContextType | undefined>(ThemeContext);

  if (!context) {
    // Handle the case where context is undefined
    return null;
  }

  const { toggle, theme } = context;

  console.log(theme); // Now accessing theme from the context object

  return (
    <div
      className={styles.container}
      onClick={toggle}

    >
      {theme === "dark" ? <HiOutlineMoon /> : <HiOutlineSun />}

    </div>
  );
};

export default ThemeToggle;
