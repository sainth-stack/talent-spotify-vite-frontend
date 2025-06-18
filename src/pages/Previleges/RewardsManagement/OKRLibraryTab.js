/* eslint-disable no-unused-vars */
import React from "react";
import Button from "components/Company/Button";
import { getProgressColor, RewardCategories, RewardTypes1, RewardTypes2 } from "utilities";
import SelectInput from "components/Company/SelectInput";
import { useState } from "react";
import SliderRewards from "components/SliderRewards";

export default function OKRLibraryTab({
  roleData,
  handleChangeSearchBoolean,
  handleCancel,
  handleSubmit,
  isMobile,
  handleChangeSearch,
  eligibilityGroups,
  okrTemplates,
  handleChangeSearch2
}) {
  const [value, setValue] = useState(roleData.rewardPoints ? Number(roleData.rewardPoints / 10) : 0);
  const [value2, setValue2] = useState(roleData.rewardPoints2 ? Number(roleData.rewardPoints2 / 10) : 0);
  const [value3, setValue3] = useState(roleData.rewardPoints3 ? Number(roleData.rewardPoints3 / 10) : 0);
  return (
    <div>
      <div className={isMobile ? "" : "d-flex justify-content-between flex-wrap mt-5"}>
        <div className="col-md-5 d-flex mt-2 mb-2">
          <label className="fs-14 col-md-4">Reward Scheme Name</label>
          <input
            type="text"
            className="outline-none border col-md-7 text-dark fs14 pl-3 rounded ml-3"
            placeholder="Reward Scheme Name"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            name="rewardSchemeName"
            value={roleData.rewardSchemeName}
            onChange={handleChangeSearch}
          />
        </div>
        <div className="col-md-5 mt-2 mb-2">
          <SelectInput
            label="Reward Category*"
            placeholder="--Select--"
            name="rewardCategory"
            options={RewardCategories}
            value={roleData.rewardCategory}
            onChangeText={handleChangeSearch}
          />
        </div>
        <div className="col-md-5 mt-2 mb-2">
          <SelectInput
            label="Reward Type*"
            placeholder="--Select--"
            name="rewardType"
            options={roleData.rewardCategory === "Monetory" ? RewardTypes1 : RewardTypes2}
            value={roleData.rewardType}
            onChangeText={handleChangeSearch}
          />
        </div>
        <div className="col-md-5 mt-2 mb-2">
          <SelectInput
            label="OKR Template*"
            placeholder="--Select OKR Template--"
            name="okrTemplate"
            options={okrTemplates}
            value={roleData.okrTemplate}
            onChangeText={handleChangeSearch}
          />
        </div>

        <div className={isMobile ? "" : "d-flex justify-content-between flex-wrap"}>
          <div className="col-md-10">
          </div>
          <div className="col-md-12 m-3 mt-2 mb-2">
            <p>Select Reward Points (Bronze)</p>
            <span
              className={`text-${getProgressColor(value)}`}
            >
              {value * 10}
            </span>
            <SliderRewards
              size="lg"
              type="range"
              variant="warning"
              progressStatus={value}
              value={value}
              onChange={(changeEvent) => {
                setValue(changeEvent);
                handleChangeSearch2({ target: { name: "rewardPoints", value: changeEvent * 10 } })
              }
              }
            />
          </div>
        </div>
        <div className={isMobile ? "" : "d-flex justify-content-between flex-wrap"}>
          <div className="col-md-10">
          </div>
          <div className="col-md-12 m-3 mt-2 mb-2">
            <p>Select Reward Points (Silver)</p>
            <span
              className={`text-${getProgressColor(value2)}`}
            >
              {value2 * 10}
            </span>
            <SliderRewards
              size="lg"
              type="range"
              variant="warning"
              progressStatus={value2}
              value={value2}
              onChange={(changeEvent) => {
                setValue2(changeEvent);
                handleChangeSearch2({ target: { name: "rewardPoints2", value: changeEvent * 10 } })
              }
              }
            />
          </div>
        </div>
        <div className={isMobile ? "" : "d-flex justify-content-between flex-wrap"}>
          <div className="col-md-10">
          </div>
          <div className="col-md-12 m-3 mt-2 mb-2">
            <p>Select Reward Points (Gold)</p>
            <span
              className={`text-${getProgressColor(value3)}`}
            >
              {value3 * 10}
            </span>
            <SliderRewards
              size="lg"
              type="range"
              variant="warning"
              progressStatus={value3}
              value={value3}
              onChange={(changeEvent) => {
                setValue3(changeEvent);
                handleChangeSearch2({ target: { name: "rewardPoints3", value: changeEvent * 10 } })
              }
              }
            />
          </div>
        </div>
        <div className={isMobile ? "" : "d-flex justify-content-between flex-wrap"}>
          <div className="col-md-5 mt-2 mb-2 d-flex">
            <label className="fs-14 col-md-4">Objectives Achievement %</label>
            <input
              type="text"
              className="outline-none border col-md-7 text-dark fs14 pl-3 rounded ml-3"
              placeholder="Objectives Achievement"
              aria-describedby="basic-addon2"
              name="objectivesAchievementPercent"
              value={roleData.objectivesAchievementPercent}
              onChange={handleChangeSearch}
            />
          </div>
          <div className="col-md-5 mt-2 mb-2 d-flex">
            <label className="fs-14 col-md-4">Objectives Achievement Points</label>
            <input
              type="text"
              className="outline-none border col-md-7 text-dark fs14 pl-3 rounded ml-3"
              placeholder="Objectives Achievement"
              aria-describedby="basic-addon2"
              name="objectivesAchievementPoints"
              value={roleData.objectivesAchievementPoints}
              onChange={handleChangeSearch}
            />
          </div>
          <div className="col-md-5 mt-2 mb-2 d-flex">
            <label className="fs-14 col-md-4">KR Achievement %</label>
            <input
              type="text"
              className="outline-none border col-md-7 text-dark fs14 pl-3 rounded ml-3"
              placeholder="KR Achievement"
              aria-describedby="basic-addon2"
              name="krAchievementPercent"
              value={roleData.krAchievementPercent}
              onChange={handleChangeSearch}
            />
          </div>
          <div className="col-md-5 mt-2 mb-2 d-flex">
            <label className="fs-14 col-md-4">KR Achievement Points</label>
            <input
              type="text"
              className="outline-none border col-md-7 text-dark fs14 pl-3 rounded ml-3"
              placeholder="KR Achievement"
              aria-describedby="basic-addon2"
              name="krAchievementPoints"
              value={roleData.krAchievementPoints}
              onChange={handleChangeSearch}
            />
          </div>
          <div className="col-md-5 mt-2 mb-2 d-flex">
            <label className="fs-14 col-md-4">Task Achievement %</label>
            <input
              type="text"
              className="outline-none border col-md-7 text-dark fs14 pl-3 rounded ml-3"
              placeholder="Task Achievement"
              aria-describedby="basic-addon2"
              name="taskAchievementPercent"
              value={roleData.taskAchievementPercent}
              onChange={handleChangeSearch}
            />
          </div>
          <div className="col-md-5 mt-2 mb-2 d-flex">
            <label className="fs-14 col-md-4">Task Achievement Points</label>
            <input
              type="text"
              className="outline-none border col-md-7 text-dark fs14 pl-3 rounded ml-3"
              placeholder="KR Achievement Points"
              aria-describedby="basic-addon2"
              name="taskAchievementPoints"
              value={roleData.taskAchievementPoints}
              onChange={handleChangeSearch}
            />
          </div>
          <div className="col-md-5 mt-2 mb-2 d-flex">
            <label className="fs-14 col-md-4">Sub Task Achievement %</label>
            <input
              type="text"
              className="outline-none border col-md-7 text-dark fs14 pl-3 rounded ml-3"
              placeholder="Sub Task Achievement"
              aria-describedby="basic-addon2"
              name="subTaskAchievementPercent"
              value={roleData.subTaskAchievementPercent}
              onChange={handleChangeSearch}
            />
          </div>
          <div className="col-md-5 mt-2 mb-2 d-flex">
            <label className="fs-14 col-md-4">Sub Task Points</label>
            <input
              type="text"
              className="outline-none border col-md-7 text-dark fs14 pl-3 rounded ml-3"
              placeholder="Sub Task Points"
              aria-describedby="basic-addon2"
              name="subTaskAchievementPoints"
              value={roleData.subTaskAchievementPoints}
              onChange={handleChangeSearch}
            />
          </div>

          <div className="col-md-5 mt-2 mb-2">
            <SelectInput
              label="Eligibility Group*"
              placeholder="--Select Eligibility Group--"
              name="eligibilityGroup"
              options={eligibilityGroups}
              value={roleData.eligibilityGroup}
              onChangeText={handleChangeSearch}
            />
          </div>
        </div>
      </div>

      <div className={isMobile ? "" : "ml-5 pl-5"}>
        <div className="d-flex flex-wrap">
          <div className={isMobile ? "d-flex mt-3 ml-4 mb-3" : "d-flex col-md-5 ml-5 pl-5 mt-3 mb-3 align-items-center"}>
            <input
              type="checkbox"
              className={isMobile ? "mr-2 mt-2" : "mr-2 mt-1"}
              name="kudosEnabled"
              id="kudosEnabled"
              value={roleData.kudosEnabled ? true : false}
              checked={roleData.kudosEnabled}
              onChange={handleChangeSearchBoolean}
            />{" "}
            <label className={isMobile ? "cursor-pointer" : "mt-2 cursor-pointer"} htmlFor="kudosEnabled">
              Kudos Enabled
            </label>
          </div>
          <div className={isMobile ? "d-flex mt-3 ml-4 mb-3" : "d-flex col-md-5 ml-5 pl-5 mt-3 mb-3 align-items-center"}>
            <input
              type="checkbox"
              className={isMobile ? "mr-2 mt-2" : "mr-2 mt-1"}
              name="birthdayWishesEnabled"
              id="birthdayWishesEnabled"
              value={roleData.birthdayWishesEnabled ? true : false}
              checked={roleData.birthdayWishesEnabled}
              onChange={handleChangeSearchBoolean}
            />{" "}
            <label className={isMobile ? "cursor-pointer" : "mt-2 cursor-pointer"} htmlFor="birthdayWishesEnabled">
              Birthday Wishes Enabled
            </label>
          </div>
          <div className={isMobile ? "d-flex mt-3 ml-4 mb-3" : "d-flex col-md-5 ml-5 pl-5 mt-3 mb-3 align-items-center"}>
            <input
              type="checkbox"
              className={isMobile ? "mr-2 mt-2" : "mr-2 mt-1"}
              name="approvalRequired"
              id="approvalRequired"
              value={roleData.approvalRequired ? true : false}
              checked={roleData.approvalRequired}
              onChange={handleChangeSearchBoolean}
            />{" "}
            <label className={isMobile ? "cursor-pointer" : "mt-2 cursor-pointer"} htmlFor="approvalRequired">
              Approval Required
            </label>
          </div>
          <div className={isMobile ? "d-flex mt-3 ml-4 mb-3" : "d-flex col-md-5 ml-5 pl-5 mt-3 mb-3 align-items-center"}>
            <input
              type="checkbox"
              className={isMobile ? "mr-2 mt-2" : "mr-2 mt-1"}
              name="anniversaryWishesEnabled"
              id="anniversaryWishesEnabled"
              value={roleData.anniversaryWishesEnabled ? true : false}
              checked={roleData.anniversaryWishesEnabled}
              onChange={handleChangeSearchBoolean}
            />{" "}
            <label className={isMobile ? "cursor-pointer" : "mt-2 cursor-pointer"} htmlFor="anniversaryWishesEnabled">
              Anniversary Wishes Enabled
            </label>
          </div>
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
