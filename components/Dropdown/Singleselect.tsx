import React, { useState } from "react";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

interface SingleSelectDropdownProps {
  placeholder: string | null;
  originalOptions: Map<number, string>;
  selectedOption: number | null;
  setSelectedOption: React.Dispatch<React.SetStateAction<number | null>>;
}

const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  placeholder,
  originalOptions,
  selectedOption,
  setSelectedOption,
}) => {
  const [open, setOpen] = useState(false);

  const handleToggleDropdown = () => {
    setOpen(!open);
  };

  const handleOptionSelect = (key: number) => {
    if (key === selectedOption) {
      setSelectedOption(null);
    } else {
      setSelectedOption(key);
    }
  };

  return (
    <div className="w-1/4 relative">
      <div
        onClick={handleToggleDropdown}
        className="p-3 rounded-3xl flex items-center gap-2 border border-neutral-300 cursor-pointer truncate h-10 bg-white text-black relative"
      >
        {selectedOption !== null
          ? originalOptions.get(selectedOption)
          : placeholder}
        <div className="ml-auto">
          <MdKeyboardDoubleArrowDown />
        </div>
      </div>
      {open && (
        <div className="p-3 rounded-lg flex gap-3 w-full shadow-lg x-50 absolute flex-col bg-white dark:bg-gray-200 mt-3">
          {Array.from(originalOptions.entries()).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <div
                onClick={() => handleOptionSelect(key)}
                className={`w-4 h-4 ml-2 hover:cursor-pointer rounded-full border border-neutral-300 ${
                  selectedOption === key ? "bg-blue-400" : ""
                }`}
              />
              <label
                onClick={() => handleOptionSelect(key)}
                className="ml-2 text-sm font-medium hover:cursor-pointer text-gray-900 flex-grow"
              >
                {value}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleSelectDropdown;
