import React, { useRef, useEffect, useState } from "react";
import styles from "./category.module.css"; // Ensure this path matches your file structure
import { categories } from "@/constants/categories";

const MediumCategoryList = ({ onCategoryChange }) => {
  const containerRef = useRef(null);
  const [showArrows, setShowArrows] = useState({ left: false, right: true });

  const checkScrollPosition = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      setShowArrows({
        left: scrollLeft > 0,
        right: scrollLeft < scrollWidth - clientWidth,
      });
    }
  };

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 150; 
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      checkScrollPosition();
    }
  };

  useEffect(() => {
    const handleResize = () => checkScrollPosition();
    window.addEventListener("resize", handleResize);

    checkScrollPosition(); // Check on initial render

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    checkScrollPosition(); // Check on initial render to ensure arrows are set correctly
  }, [categories]); // Recheck if categories change

  if (!categories || categories.length === 0) {
    return <p>No categories available</p>;
  }

  return (
    <div className={styles.wrapper}>
      {showArrows.left && (
        <button
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={() => scroll("left")}
        >
          &lt;
        </button>
      )}
      <div className={styles.container} ref={containerRef} onScroll={checkScrollPosition}>
        <button
          className={styles.category}
          onClick={() => onCategoryChange("all")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.value}
            className={styles.category}
            onClick={() => onCategoryChange(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>
      {showArrows.right && (
        <button
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={() => scroll("right")}
        >
          &gt;
        </button>
      )}
    </div>
  );
};

export default MediumCategoryList;
