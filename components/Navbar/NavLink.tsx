import React from "react";

interface NavLinkProps {
  href: string;
  name: string;
  isSelected: boolean;
  setSelectedNavLink: React.Dispatch<React.SetStateAction<string>>;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  name,
  isSelected,
  setSelectedNavLink,
}) => {
  const handleClick = () => {
    setSelectedNavLink(name);
  };

  return (
    <li>
      <a
        href={href}
        className={`
          block py-2 px-3 text-lg rounded md:p-0 dark:border-gray-700
          ${isSelected ? "md:hover:bg-transparent" : "hover:text-blue-400"}
        `}
        onClick={handleClick}
      >
        {name}
      </a>
    </li>
  );
};

export default NavLink;
