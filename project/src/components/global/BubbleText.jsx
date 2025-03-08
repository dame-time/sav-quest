import React from "react";
import styles from "./BubbleText.module.css";

export const BubbleText = ({ children }) => {
  return (
    <h2 className="text-center text-2xl font-thin text-copy-lighter">
      {children.split("").map((child, idx) => (
        <span className={styles.hoverText} key={idx}>
          {child}
        </span>
      ))}
    </h2>
  );
};