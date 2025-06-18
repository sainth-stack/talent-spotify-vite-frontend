import React from "react";

const TopHeader = ({image, isDeleteBtn=false}) => {
  return (
    <div className="top-header pb-1">
      <div
        className="pt-0 pb-0 d-flex align-items-center"
        style={{ gap: "8px" }}
      >
        <img src={image} width={25} height={25} alt="salesforce" />
        <h4 className="mb-0 title">Manage Salesforce Connection</h4>
      </div>
      {isDeleteBtn && <button type="button" class="btn btn-outline-danger mr-2 del-btn">Delete</button> }
    </div>
  );
};

export default TopHeader;
