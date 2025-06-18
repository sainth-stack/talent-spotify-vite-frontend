/* eslint-disable no-unused-vars */
import BrowseOKRLibrary from "components/Company/BrowseOKRLibrary";
import React from "react";
import Button from "components/Company/Button";
import UploadProgress from "components/Company/UploadProgress";
import HorizontalBar from "components/Company/HorizontalBar";

export default function OKRLibraryTab({
  roleData,
  handleChangeSearchBoolean,
  objectives,
  downloadExcel,
  downloadTemplate,
  handleCancel,
  setObjectives,
  handleSubmit,
  isMobile,
  handleFileUpload,
  showProgress,
  fileName,
  progress,
  loaded,
  total,
  uploads,
  cancelUpload,
  deleteUploadData,
}) {
  return (
    <div>
      <div className="d-flex">
      </div>

      {objectives.map((item, index1) => {
        return (
          <div key={index1}>
            {item.keyResults.map((itemm, index2) => {
              return (
                <div className="ml-3" key={index2}>
                </div>
              );
            })}
          </div>
        );
      })}
      <div className={isMobile ? "" : "ml-5 pl-5"}>
        <div className={isMobile ? "" : "d-flex"}>
          <div
            className={
              isMobile
                ? "mt-3 ml-4 mb-3"
                : "d-flex col-md-5 ml-5 pl-5 mt-3 mb-3 align-items-center"
            }
          >
            <input
              type="checkbox"
              className={isMobile ? "mr-2 mt-2" : "mr-2 mt-1"}
              id="exportOKRLibrary"
              name="exportOKRLibrary"
              value={roleData.exportOKRLibrary ? true : false}
              checked={roleData.exportOKRLibrary}
              onChange={handleChangeSearchBoolean}
            />{" "}
            <label
              className={isMobile ? "cursor-pointer" : "mt-2 cursor-pointer"}
              htmlFor="exportOKRLibrary"
            >
              Include OKR
            </label>
          </div>
          <div className={isMobile ? "mt-4 ml-2" : "mt-2"}>
            <Button
              text="Export"
              handleClick={() => downloadExcel()}
              className="mt-0 bg-green border-grey text-white"
            />
            <Button
              text="Download Template"
              handleClick={() => downloadTemplate()}
              className="mt-0 bg-green border-grey text-white"
            />
          </div>
        </div>
      </div>
      <div className={isMobile ? "" : "d-flex"}>
        <label className={isMobile ? "label fs-14 ml-4" : "label fs-14"} >Import OKR Library</label>
        <div className="col-md-5">
          <BrowseOKRLibrary
            setData={
              ({ data, file, url, totalRecords }) => {
                setObjectives(data);
                handleFileUpload({ file, url, totalRecords });
              }
            }
          />
          {showProgress && (
            <UploadProgress
              filename={fileName}
              message="10 records successfully uploading out 15"
              status="inprogress"
              progressWidth={progress}
              cancelUpload={cancelUpload}
              loaded={loaded}
              total={total}
            />
          )}
          {uploads.length > 0 &&
            uploads.map((upload, index) => (
              <div key={index}>
                <UploadProgress
                  deleteUpload={deleteUploadData}
                  index={index}
                  {...upload}
                />
                <HorizontalBar />
              </div>
            ))}
        </div>
      </div>
      <div className="mt-5 d-flex justify-content-end">
        <Button
          text="Cancel"
          handleClick={() => handleCancel()}
          className="bg-white border text-black"
        />
        <Button
          text="Save"
          handleClick={handleSubmit}
          className="bg-green border-grey text-white"
        />
      </div>
    </div>
  );
}
