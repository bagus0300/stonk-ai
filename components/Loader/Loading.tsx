import React from 'react';

const Loading = () => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="border-t-8 border-red-400 border-solid rounded-full animate-spin w-12 h-12"></div>
    </div>
  );
};

export default Loading;
