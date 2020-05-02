import React, { useState } from 'react';

const ProgressBar = () => {
  const [percentage, setPercentage] = useState(45);

  return (
    <div className="shadow w-full bg-gray-300">
      <div
        className="bg-blue-500 text-xs leading-none py-1 text-center text-white"
        style={{ width: percentage + '%' }}
      >
        45%
      </div>
    </div>
  );
};

export default ProgressBar;
