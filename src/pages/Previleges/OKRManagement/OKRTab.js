import BrowseFiles from "components/Company/BrowseFiles";
import Button from "components/Company/Button";
import add from "assets/svg/add.svg";
import trash from "assets/svg/delete-green.svg";
import TextInput from "components/Company/TextInput";
import React from "react";
import SelectInput from "components/Company/SelectInput";
import { Toast } from "service/toast";
import UploadProgress from "components/Company/UploadProgress";
import HorizontalBar from "components/Company/HorizontalBar";
export function OKRTab({
  handleChangeSearch2,
  handleChangeSearch3,
  handleChangeRages,
  search,
  handleAddOkrTab,
  handleDeleteOkrTab,
  data,
  data2,
  handleDeleteMultiple,
  validator,
  okrData,
  roleData,
  handleCancel,
  handleSubmit2,
  handleChangeEligibilityGroup,
  downloadExcel,
  setObjectives,
  importObjectives,
  showProgress,
  uploads,
  deleteUploadData,
  fileName,
  progress,
  cancelUpload,
  loaded,
  total,
  handleFileUpload,
  isMobile,
  downloadTemplate
}) {
  return (
    <div>
      <div>
        <div className="col-md-10">
          <div className={isMobile ? "mt-2" : "d-flex justify-content-start mt-5"}>
            <label className="label fs-14 col-md-3 col-xs-12 col-sm-12">
              OKR Template Name*
            </label>
            <div className="input-group col-md-6 circle p-0 nav-item border h43">
              <input
                style={{
                  borderRadius: "20px",
                }}
                type="text"
                className="outline-none border-0 col-md-10 text-dark fs14 pl-3"
                placeholder="Type Template Name"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                name="okrTemplateName"
                value={okrData.okrTemplateName}
                onChange={handleChangeSearch2}
              />
            </div>
          </div>{" "}
        </div>
      </div>
      <div className={isMobile ? "mt-2 ml-3" : "d-flex justify-content-start mt-5 ml-3"}>
        <label className="label fs-14 col-md-2 col-xs-12 col-sm-12 ">
          Instructions to Users*
        </label>
        <textarea
          style={{
            borderRadius: "20px",
          }}
          id="description"
          className={isMobile ? "form-control p-3 col-md-4 ml-0" : "form-control p-3 col-md-4 ml-5"}
          rows="5"
          name="instructionsToUsers"
          value={okrData.instructionsToUsers}
          onChange={handleChangeSearch2}
        ></textarea>
      </div>
      <div className={isMobile ? "mt-2" : "d-flex justify-content-between mt-5"}>
        <div className="col-md-7">
          <TextInput
            dateType="date"
            label="Start Date"
            placeholder="--Select--"
            name="startDate"
            value={okrData.startDate}
            onChangeText={handleChangeSearch2}
          />
        </div>
        <div className="col-md-5">
          <TextInput
            dateType="date"
            label="End Date"
            placeholder="--Select--"
            name="endDate"
            value={okrData.endDate}
            onChangeText={handleChangeSearch2}
          />
        </div>
      </div>
      <div>
        {!isMobile && <div className={isMobile ? "" : "ml-3"}>
          <div className={isMobile ? "d-flex justify-content-start mt-3" : "d-flex justify-content-start mt-5"}>
            <label className="label fs-14 col-md-2 col-xs-12 col-sm-12"></label>
            <p
              style={{
                borderRadius: "20px",
              }}
              type="text"
              className={isMobile ? "outline-none text-dark fs14 col-md-2 mr-1 text-center" : "outline-none text-dark fs14 col-md-2 mr-4 text-center"}
            >
              Min
            </p>
            <p
              style={{
                borderRadius: "20px",
              }}
              type="text"
              className={isMobile ? "outline-none text-dark fs14 col-md-2 ml-1 text-center" : "outline-none text-dark fs14 col-md-2 ml-4 text-center"}
            >
              Max
            </p>
          </div>{" "}
        </div>}
        <div className="ml-3">
          <div className={isMobile ? "mt-2" : "d-flex justify-content-start mt-5"}>
            <label className="label fs-14 col-md-2 col-xs-12 col-sm-12">
              Low Value Range
            </label>
            <input
              style={{
                borderRadius: "20px",
              }}
              type="number"
              className="bg-light outline-none border searchInput text-dark fs14 col-md-2 mr-4 h43"
              placeholder={isMobile ? "Min" : ''}
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              name="lowValueRange"
              value={okrData.lowValueRange[0].min}
              onChange={(e) => handleChangeRages(e, "min")}
            />
            <input
              style={{
                borderRadius: "20px",
              }}
              type="number"
              className={isMobile ? "bg-light outline-none border searchInput text-dark fs14 col-md-2 mt-2 h43" : "bg-light outline-none border searchInput text-dark fs14 col-md-2 ml-4 h43"}
              placeholder={isMobile ? "Max" : ''}
              name="lowValueRange"
              label='max*'
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={okrData.lowValueRange[0].max}
              onChange={(e) => handleChangeRages(e, "max")}
            />
          </div>{" "}
        </div>
        <div className="ml-3">
          <div className={isMobile ? "mt-2" : "d-flex justify-content-start mt-5"}>
            <label className="label fs-14 col-md-2 col-xs-12 col-sm-12">
              Mid Value Range*
            </label>
            <input
              style={{
                borderRadius: "20px",
              }}
              type="number"
              className="bg-light outline-none border searchInput text-dark fs14 col-md-2 mr-4 h43"
              placeholder={isMobile ? "Min" : ''}
              name="midValueRange"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={okrData.midValueRange[0].min}
              onChange={(e) => handleChangeRages(e, "min")}
            />
            <input
              style={{
                borderRadius: "20px",
              }}
              type="number"
              className={isMobile ? "bg-light outline-none border searchInput text-dark fs14 col-md-2 mt-2 h43" : "bg-light outline-none border searchInput text-dark fs14 col-md-2 ml-4 h43"}
              placeholder={isMobile ? "Max" : ''}
              aria-label="Recipient's username"
              name="midValueRange"
              aria-describedby="basic-addon2"
              value={okrData.midValueRange[0].max}
              onChange={(e) => handleChangeRages(e, "max")}
            />
          </div>{" "}
        </div>

        <div className="ml-3">
          <div className={isMobile ? "mt-2" : "d-flex justify-content-start mt-5"}>
            <label className="label fs-14 col-md-2 col-xs-12 col-sm-12">
              High Value Range*
            </label>
            <input
              style={{
                borderRadius: "20px",
              }}
              type="number"
              className="bg-light outline-none border searchInput text-dark fs14 col-md-2 mr-4 h43"
              placeholder={isMobile ? "Min" : ''}
              name="highValueRange"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={okrData.highValueRange[0].min}
              onChange={(e) => handleChangeRages(e, "min")}
            />
            <input
              style={{
                borderRadius: "20px",
              }}
              type="number"
              className={isMobile ? "bg-light outline-none border searchInput text-dark fs14 col-md-2 mt-2 h43" : "bg-light outline-none border searchInput text-dark fs14 col-md-2 ml-4 h43"}
              placeholder={isMobile ? "Max" : ''}
              name="highValueRange"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={okrData.highValueRange[0].max}
              onChange={(e) => handleChangeRages(e, "max")}
            />
          </div>{" "}
        </div>

        {okrData.eligibilityGroup.map((item, index) => {
          return (
            <div className={isMobile ? "" : "d-flex align-items-center"}>
              <div className={isMobile ? "ml-3 col-md-6 mt-3 pl-0" : "ml-3 col-md-6 mt-5 pl-0"}>
                <SelectInput
                  label="Eligibility Group*"
                  placeholder="--Select--"
                  name="eligibilityGroup"
                  options={data2}
                  value={item}
                  onChangeText={(e) => {
                    if (data2.filter(itemm => itemm.value === item && okrData.eligibilityGroup.includes(itemm.value)).length === 0) {
                      let updatedEligibilities = okrData.eligibilityGroup;
                      updatedEligibilities[index] = e.target.value;
                      handleChangeSearch2({ target: { name: "eligibilityGroup", value: updatedEligibilities } })
                    } else {
                      Toast({ message: "Already added", type: "warning", time: 4000 })
                    }
                  }
                  }
                />
              </div>
              <div className={isMobile ? "ml-4 mt-3" : "ml-2 mt-5"}>
                <img
                  src={add}
                  alt="add"
                  onClick={(e) => handleAddOkrTab(e)}
                  className="mr-2 cursor-pointer"
                />
                <img
                  src={trash}
                  alt="add"
                  onClick={(e) => handleDeleteOkrTab(index)}
                  className="mr-2 cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className={isMobile ? "ml-3" : "d-flex ml-3 justify-content-start mt-5"}>
        <div className={isMobile ? "" : "d-flex col-md-2 mt-3 mb-3 align-items-center fs-14"}>
        </div>
        <div className={isMobile ? "d-flex col-md-3 mt-1 mb-1 align-items-center  fs-14" : "d-flex col-md-3 mt-3 mb-3 align-items-center  fs-14"}>
          <input
            type="checkbox"
            className="mr-2"
            name="includingKeyResults"
            value={okrData.includingKeyResults ? true : false}
            checked={okrData.includingKeyResults}
            onChange={handleChangeSearch3}
            id="includeKR"
          />{" "}
          <label htmlFor="includeKR" className="mt-2">Including Key Results</label>
        </div>
        <Button
          text="Export"
          handleClick={() => downloadExcel()}
          className="mt-3 bg-green border-grey text-white"
        />
        <Button
          text="Download Template"
          handleClick={() => downloadTemplate()}
          className="mt-3 bg-green border-grey text-white"
        />
      </div>
      <div className={isMobile ? "ml-4" : "d-flex ml-4 pl-1 mt-5"}>
        <label className="label fs-14">Import OKR Library</label>
        <div className="col-md-5">
          <BrowseFiles
            setData={({ data, file, url, totalRecords }) => {
              setObjectives(data);
              importObjectives(data);
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
      <div className="col-md-8 text-center mt-3">
        <Button
          text="Import"
          className="mt-0 bg-green border-grey text-white"
        />
      </div>

      <div className="mt-5 d-flex justify-content-end">
        <Button
          text="Cancel"
          handleClick={() => handleCancel()}
          className="bg-white border text-black"
        />
        <Button
          text="Save"
          handleClick={() => handleSubmit2()}
          className="bg-green border-grey text-white"
        />
      </div>
    </div>
  );
}
