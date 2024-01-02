import React from "react";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

interface SingleSelectDropdownProps {
  placeholder: string | null
  originalOptions: string[];
  selectedOption: string | null;
  setSelectedOption: React.Dispatch<React.SetStateAction<string | null>>;
}

const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  placeholder,
  originalOptions,
  selectedOption,
  setSelectedOption,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleToggleDropdown = () => {
    setOpen(!open);
  };

  const handleOptionSelect = (value: string) => {
    if (value === selectedOption) {
      setSelectedOption(null);
    } else {
      setSelectedOption(value);
    }

    setOpen(false);
  };

  return (
    <div className="w-1/4 relative">
      <div
        onClick={handleToggleDropdown}
        className="p-3 rounded-3xl flex items-center gap-2 border border-neutral-300 cursor-pointer truncate h-10 bg-white text-black relative"
      >
        <div className="w-4 h-4 ml-2 rounded-full border border-neutral-300 absolute left-0"></div>
        {selectedOption || placeholder}
        <div className="ml-auto">
          <MdKeyboardDoubleArrowDown />
        </div>
      </div>
      {open && (
        <div className="p-3 rounded-lg flex gap-3 w-full shadow-lg x-50 absolute flex-col bg-white dark:bg-gray-200 mt-3">
          {originalOptions.map((name) => (
            <div key={name} className="flex items-center">
              <div
                onClick={() => handleOptionSelect(name)}
                className={`w-4 h-4 ml-2 hover:cursor-pointer rounded-full border border-neutral-300 ${
                  selectedOption === name ? "bg-blue-400" : ""
                }`}
              />
              <label
                onClick={() => handleOptionSelect(name)}
                className="ml-2 text-sm font-medium hover:cursor-pointer text-gray-900 flex-grow"
              >
                {name}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleSelectDropdown;
