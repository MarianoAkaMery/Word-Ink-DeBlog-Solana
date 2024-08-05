"use client"

import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import React, { useContext, useEffect, useState } from "react";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const context = useContext<ThemeContextType | undefined>(ThemeContext);

  if (!context) {
    // Handle the case where context is undefined
    return null;
  }

  const { theme } = context;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted) {
    return <div className={theme}>{children}</div>;
  }

  return null;
};

export default ThemeProvider;
