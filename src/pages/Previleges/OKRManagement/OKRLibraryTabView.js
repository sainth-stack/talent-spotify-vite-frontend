import React from 'react'
import "./style.scss";

export default function OKRLibraryTabView({
  roleData,
  companyName
}) {
  return (
    <div>
      <div className="d-flex">
        <div className="col-md-8 d-flex mt-5">
          <label className="label fs-14 col-md-4 col-xs-12 col-sm-12">
            OKR Industry
          </label>
          <p className="fs-14 font-weight-bold">{companyName}</p>
        </div>
      </div>
      <div className="d-flex justify-content-between mt-5">
        <div className="d-flex justify-content-between col-md-5">
          <label className="label fs-14 col-md-6 col-xs-12 col-sm-12">
            OKR Function
          </label>
          <p className='label fs-14 font-weight-bold col-md-8 col-xs-12 col-sm-12'>{roleData.okrFunction}</p>
        </div>
        <div className="d-flex justify-content-between col-md-5">
          <label className="label fs-14 col-md-6 col-xs-12 col-sm-12">
            OKR Category
          </label>
          <p className='label fs-14 font-weight-bold col-md-8 col-xs-12 col-sm-12'>{roleData.okrCategory}</p>
        </div>
      </div>

      {roleData.objectiveKeyResults.map((item, index1) => {
        return (
          <div key={index1}>
            <div>
              <div className="d-flex justify-content-start mt-5 ml-3">
                <label className="label fs-14 col-md-2 col-xs-12 col-sm-12 mr-4">
                  Objective
                </label>
                <input
                  style={{ borderRadius: "20px" }}
                  type="text"
                  className="bg-light outline-none border circle text-dark fs14 col-md-3 mr-1 ml-0 h43"
                  placeholder=""
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  name="objectiveName"
                  value={item.name}
                  disabled
                />
              </div>
            </div>

            {item.keyResults.map((itemm, index2) => {
              return (
                <div className="ml-3" key={index2}>
                  <div className="d-flex justify-content-start mt-5">
                    <label className="label fs-14 col-md-2 col-xs-12 col-sm-12  mr-4">
                      Key Result
                    </label>
                    <input
                      style={{ borderRadius: "20px" }}
                      type="text"
                      className="bg-light outline-none border text-dark fs14 col-md-3 h43"
                      placeholder=""
                      name="keyResult"
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      value={itemm.name}
                      disabled
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      <div className="ml-5 pl-4">
        <div className="d-flex col-md-5 ml-5 pl-5 mt-3 mb-3 align-items-center">
          <input
            type="checkbox"
            className="mr-2"
            name="isActive"
            id="isActive"
            value={roleData.isActive ? true : false}
            checked={roleData.isActive}
            disabled
          />{" "}
          <label className='mt-2 cursor-pointer' htmlFor='isActive'>Active</label>
        </div>
      </div>
    </div>
  )
}
