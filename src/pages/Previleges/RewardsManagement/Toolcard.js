import React from "react";
import "./style1.scss";

export default function Toolcard({ reward: { rewardName, rewardIcon, rewardDescription, rewardCode, rewardStatus, rewardPoints, rewardAmount } }) {
  return (
    <div className="container1">
      <img src={rewardIcon} alt="reward logo" className="rewardIcon" />
      <h1 className="rewardName">{rewardName}</h1>
      <h2 className="description">Description</h2>
      <h3 className="rewardDescription">
        {rewardDescription}
      </h3>
      <div className="code">
        <h5 className="rewardcode1">{rewardCode}</h5>
      </div>

      <div className="row ml-3 points">
        <div className="col-6 col-md-4 mt-5">Reward Points</div>
        <div className="col-6 mt-5 ">Amount</div>
      </div>

      <div className="row ml-3 mt-1">
        <div className="col-6 col-md-4">{rewardPoints}</div>
        <div className="col-6 col-md-4">USD {rewardAmount}</div>
      </div>
      <div className="row">
        <button
          className={`btn dropdown-hide text-capitalize text-white p-2 ml-5 mt-4 fs16 w-30 button1 ${rewardStatus === "active" ? "bg-green" : ""}`}
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Active
        </button>
        <button
          className={`btn dropdown-hide text-capitalize p-2 ml-5 mt-4 fs16 w-30 button1 ${rewardStatus !== "active" ? "bg-green text-white" : ""}`}
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Inactive
        </button>
      </div>
      <div className="row mt-5 mr-4 d-flex justify-content-end ">
        <button
          className="btn dropdown-hide text-capitalize p-2 ml-5 mt-4 fs16 w-30 button1"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Cancel
        </button>
        <button
          className="btn dropdown-hide text-capitalize p-2 ml-2 mt-4 bg-green text-white fs16 w-30 button1"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Add to catalogue
        </button>
      </div>
    </div>
  );
}
