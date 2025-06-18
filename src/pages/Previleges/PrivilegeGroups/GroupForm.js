/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import add from "assets/svg/add.svg";
import trash from "assets/svg/delete-green.svg";
import lock from "assets/svg/lock-green.svg";
import SelectInput from "components/Company/SelectInput";
import HorizontalBar from 'components/Company/HorizontalBar';
import { Categories, ExcludeCategories, Role } from 'utilities';
import Button from 'components/Company/Button';
import SelectInputNoLabel from 'components/Company/SelectInputNoLabel';
import { inActivefilterFinalItems, inActivefilterFinalItemsDelete } from './filterItemsData';
import { previleges } from 'reducer/privilegesGroup';

export default function GroupForm({ roleData, handleChangeSearch, handleChangeGroupMembers, handleChangeExcludeGroupMembers, handleAdd, dispatch, handleSubmit, filterFinalItems, filterFinalItemsDelete }) {
  const [finalActiveMembers, setfinalActiveMembers] = useState([]);
  useEffect(() => {
    if (roleData?.inActiveGroupMembers || roleData.activeGroupMembers) {
      let finalInActiveMembers = roleData?.inActiveGroupMembers && roleData?.inActiveGroupMembers.length > 0 ? [...roleData?.inActiveGroupMembers].filter(item => item.statuss).map(item => item._id) : [];
      let finalActiveMembers = finalInActiveMembers.length > 0 ? (roleData.activeGroupMembers && [...roleData.activeGroupMembers].filter(item => !finalInActiveMembers.includes(item._id))) : roleData.activeGroupMembers;
      setfinalActiveMembers(finalActiveMembers)
    }
  }, [roleData])
  return (
    <div>
      <div className="d-flex justify-content-between mt-5">
        <div className="col-md-8 pl-0">
          <div className="d-flex justify-content-between mb-5">
            <label className="label fs13 col-md-4 col-xs-12 col-sm-12">
              Group Name
            </label>
            <div className="d-flex ml-2 col-md-8  col-xs-12 col-sm-12">
              <input
                style={{ borderRadius: "20px" }}
                id="groupName"
                className="form-control col-12 p-3"
                name="groupName"
                value={roleData?.groupName}
                onChange={handleChangeSearch}
              />
            </div>
          </div>
        </div>
        <div className="col-md-3 bg-gray rounded shadow">
          <h6 className="text-right">Active Group Membership</h6>
          <p className="text-right"><i>Insert/Update</i></p>
          <div className="count-style">
            <p className="count-number">{finalActiveMembers.length > 0 ? finalActiveMembers.filter(item => item.statuss).length : 0}</p>
          </div>
        </div>
      </div>

      <HorizontalBar className="pt-3 pb-3" />

      <div>
        <div className="m-3 d-flex justify-content-between align-items-center">
          <h6>Choose Group Members:</h6>
          <p className="text-teal font-italic fs-14">Tip you can include multiple People pools in the same group. See examples</p>
        </div>

        <div className="m-3 d-flex justify-content-start align-items-center">
          <h6 className="text-teal mr-2">People Pool</h6>
        </div>

        {roleData?.groupMembers.length > 0 && roleData.groupMembers.map((groupMember, index) => (
          <div className="d-flex justify-content-start align-items-center mt-2 mb-2" key={index}>
            <div className="col-md-5 col-xs-12 col-sm-12 pl-0">
              <SelectInput
                label="Pick a category"
                placeholder="--Select--"
                name="categoryName"
                options={Categories}
                value={groupMember.categoryName}
                onChangeText={handleChangeGroupMembers(index)}
              />
            </div>
            <div className={`col-md-${groupMember.categoryName === "Hire Date" ? '3' : '6'} col-xs-12 col-sm-12 pl-0 pr-0`}>
              <SelectInputNoLabel
                label=""
                placeholder="--Select--"
                name="categoryValue"
                options={groupMember.categoryValues}
                value={groupMember.categoryValue}
                onChangeText={handleChangeGroupMembers(index)}
              />
            </div>
            {groupMember.categoryName === "Hire Date" && <div className="col-md-3 col-xs-12 col-sm-12 pl-0 pr-2">
              <input
                type="date"
                style={{ borderRadius: "20px" }}
                id="categoryValueText"
                className="form-control col-12 p-3"
                name="categoryValueText"
                value={groupMember.categoryValueText}
                onChange={handleChangeGroupMembers(index)}
              />
            </div>}
            <div>
              <img src={add} alt="add" className="mr-2" onClick={() => {
                dispatch(previleges({
                  ...roleData,
                  groupMembers: [...roleData.groupMembers, { categoryName: "", categoryValue: "", categoryValueText: "", categoryValues: [] }]
                }));
              }} />
              <img src={trash} alt="trash" onClick={() => {
                let groupMembers = roleData.groupMembers.filter((item, ind) => index !== ind);
                groupMembers = groupMembers.length === 0 ? [{ categoryName: "", categoryValue: "", categoryValueText: "", categoryValues: [] }] : groupMembers;
                let activeGroupMembers = filterFinalItemsDelete(roleData.activeGroupMembers, roleData.groupMembers, roleData, groupMember.categoryValue, index, dispatch);
                let finalRoleData = {
                  ...roleData,
                  groupMembers,
                  activeGroupMembers
                };
                dispatch(previleges(finalRoleData));
                filterFinalItems(activeGroupMembers, finalRoleData, roleData.groupMembers, dispatch)
              }} />
            </div>
          </div>
        ))}
      </div>

      <HorizontalBar className="pt-3 pb-3" />

      <div>
        <div className="m-3 d-flex justify-content-between align-items-center">
          <h6>Exclude these People Group Name</h6>
        </div>

        <div className="m-3 d-flex justify-content-start align-items-center">
          <h6 className="text-teal mr-2">People Pool</h6>
        </div>
        {roleData?.excludeGroupMembers && roleData?.excludeGroupMembers.length > 0 && roleData?.excludeGroupMembers.map((groupMember, index) => (
          <div className="d-flex justify-content-start align-items-center mt-2 mb-2" key={index}>
            <div className="col-md-5 col-xs-12 col-sm-12 pl-0">
              <SelectInput
                label="Pick a category"
                placeholder="--Select--"
                name="categoryName"
                options={ExcludeCategories}
                value={groupMember.categoryName}
                onChangeText={handleChangeExcludeGroupMembers(index)}
              />
            </div>
            <div className={`col-md-${groupMember.categoryName === "Hire Date" ? '3' : '6'} col-xs-12 col-sm-12 pl-0 pr-0`}>
              <SelectInputNoLabel
                label=""
                placeholder="--Select--"
                name="categoryValue"
                options={groupMember.categoryValues}
                value={groupMember.categoryValue}
                onChangeText={handleChangeExcludeGroupMembers(index)}
              />
            </div>
            {groupMember.categoryName === "Hire Date" && <div className="col-md-3 col-xs-12 col-sm-12 pl-0 pr-2">
              <input
                type="date"
                style={{ borderRadius: "20px" }}
                id="categoryValueText"
                className="form-control col-12 p-3"
                name="categoryValueText"
                value={groupMember.categoryValueText}
                onChange={handleChangeExcludeGroupMembers(index)}
              />
            </div>}
            <div>
              <img src={add} alt="add" className="mr-2" onClick={() => {
                dispatch(previleges({
                  ...roleData,
                  excludeGroupMembers: [...roleData.excludeGroupMembers, { categoryName: "", categoryValue: "", categoryValueText: "", categoryValues: [] }]
                }));
              }} />
              <img src={trash} alt="trash"
                onClick={() => {
                  let excludeGroupMembers = roleData.excludeGroupMembers.filter((item, ind) => index !== ind);
                  excludeGroupMembers = excludeGroupMembers.length === 0 ? [{ categoryName: "", categoryValue: "", categoryValueText: "", categoryValues: [] }] : excludeGroupMembers;
                  let inActiveGroupMembers = inActivefilterFinalItemsDelete(roleData.inActiveGroupMembers, roleData.excludeGroupMembers, roleData, groupMember.categoryValue, index, dispatch);
                  let finalRoleData = {
                    ...roleData,
                    excludeGroupMembers,
                    inActiveGroupMembers
                  };
                  dispatch(previleges(finalRoleData));
                  inActivefilterFinalItems(inActiveGroupMembers, finalRoleData, roleData.excludeGroupMembers, dispatch)
                }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 d-flex justify-content-end">
        <Button text="Cancel" handleClick={() => handleAdd()} className="bg-white border text-black" />
        <Button text="Finished" handleClick={() => handleSubmit()} className="bg-green border-grey text-white" />
      </div>
    </div>
  )
}
