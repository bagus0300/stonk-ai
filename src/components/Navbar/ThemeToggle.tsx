"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Switch
        checked={false}
        className={
          "bg-gray-800 relative inline-flex h-8 w-14 items-center rounded-full border border-gray-300 focus:outline-none"
        }
      ></Switch>
    );
  }

  const handleSwitchChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Switch
      checked={theme === "dark"}
      onChange={handleSwitchChange}
      className={`${
        theme === "light" ? "bg-gray-800" : "bg-gray-800"
      } relative inline-flex h-8 w-14 items-center rounded-full border border-gray-300 focus:outline-none`}
    >
      <span
        className={`${
          theme === "light" ? "translate-x-8" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
};

export default ThemeToggle;
