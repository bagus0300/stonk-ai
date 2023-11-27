import React from "react";

interface NavLinkProps {
    href: string;
    name: string;
    isSelected: boolean;
    setSelectedNavLink: React.Dispatch<React.SetStateAction<string>>;
  }

const NavLink: React.FC<NavLinkProps> = ({ href, name, isSelected, setSelectedNavLink}) => {

    const handleClick = () => {
        setSelectedNavLink(name)
    }

  return (
    <li>
      <a
        href={href}
        className={`
          block py-2 px-3 text-lg rounded md:p-0 dark:border-gray-700
          ${isSelected ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"}
        `}
        onClick={handleClick}
      >
        {name}
      </a>
    </li>
  );
};

export default NavLink;
