import React from "react";

interface NavLinkProps {
  href: string;
  name: string;
  setSelectedNavLink: React.Dispatch<React.SetStateAction<string>>;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  name,
  setSelectedNavLink,
}) => {
  const handleClick = () => {
    setSelectedNavLink(name);
  };

  return (
    <li>
      <a
        href={href}
        className={"block relative py-2 px-3 text-xl rounded md:p-0 dark:border-gray-700 hover:text-red-400 group"}
        onClick={handleClick}
      >
        {name}
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-400 transform scale-x-0 origin-bottom transition-transform group-hover:scale-x-100"></span>
      </a>
    </li>
  );
};

export default NavLink;
