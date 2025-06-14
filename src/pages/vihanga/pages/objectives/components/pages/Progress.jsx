import React from "react";

const Progress = ({ value, onChange }) => {
  const rangeStyle = {
    background: `linear-gradient(to right, #73712A ${value}%, #ccc ${value}%)`,
  };

  return (
    <div>
      <label htmlFor="progressRange" style={{ fontWeight: "600" }}>
        Select Your Progress Status (In Percentage)
      </label>
      <input
        id="progressRange"
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={onChange}
        className="green-range"
        style={rangeStyle}
      />
      <div style={{ color: "#73712A", fontWeight: 600 }}>{value}%</div>

      <style>
        {`
          input[type="range"].green-range {
            -webkit-appearance: none;
            width: 100%;
            height: 9px;
            border-radius: 5px;
            outline: none;
            transition: background 0.3s ease-in-out;
          }

          input[type="range"].green-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #73712A;
            cursor: pointer;
            border: none;
            margin-top: -7px;
          }

          input[type="range"].green-range::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #73712A;
            cursor: pointer;
            border: none;
          }

          input[type="range"].green-range::-webkit-slider-runnable-track {
            background: transparent;
            height: 6px;
            border-radius: 5px;
          }

          input[type="range"].green-range::-moz-range-track {
            background: transparent;
            height: 6px;
            border-radius: 5px;
          }
        `}
      </style>
    </div>
  );
};

export default Progress;
