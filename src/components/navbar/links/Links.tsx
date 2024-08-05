import React, { useState, useEffect } from "react";
import NavLink from "./navLink/navLink";
import { HiUserCircle, HiPencilAlt } from "react-icons/hi";
import styles from "./links.module.css";

const Links = () => {
  const links = [
    {
      title: "Profile",
      path: "/profile",
      icon: <HiUserCircle />,
    },
    {
      title: "Write",
      path: "/write",
      icon: <HiPencilAlt />,
    },
  ];

  const [isHidden, setIsHidden] = useState(false);

  let timeout: number | undefined;

  useEffect(() => {
    const handleScroll = () => {
      setIsHidden(true);
      if (timeout) clearTimeout(timeout);
      timeout = window.setTimeout(() => setIsHidden(false), 500); // Adjust the delay time as needed (in milliseconds)
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.links}>
        {links.map((link) => (
          <NavLink item={link} key={link.title} />
        ))}
      </div>
      {!isHidden && (
        <div className={styles.mobileLinksContainer}>
          <div className={styles.mobileLinksBottom}>
            {links.map((link) => (
              <NavLink item={link} key={link.title} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Links;
