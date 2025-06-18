/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import TitleHeader from "components/TitleHeader";
import addNewReward from "assets/svg/addNewReward.svg";
import trashIcon from "assets/svg/trashIcon.svg";
import editIcon from "assets/svg/editIcon.svg";
import { useState } from "react";
import { LoadingIndicator, Validator, removeDuplicates } from "utilities";
import { useDispatch } from "react-redux";
import "./style.scss";
import useWindowSize from "components/UseWindowSize";
import Toolcard from './Toolcard'

import { Toast } from "service/toast";
import Tippy from "@tippyjs/react";
import { createReward, deleteReward, getAllRewards, updateReward } from "action/RewardsAct";
import AddRewardPopup from "./AddRewardPopup";

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      rewardIcon: data[i].rewardIcon,
      rewardName: data[i].rewardName,
      rewardCode: data[i].rewardCode,
      rewardDescription: data[i].rewardDescription,
      rewardType: data[i].rewardType,
      rewardApprover: data[i].rewardApprover,
      rewardPoints: data[i].rewardPoints,
      rewardAmount: data[i].rewardAmount,
      rewardStatus: data[i].rewardStatus,
      updatedAt: window.moment(data[i].updatedAt).format("MM-DD-YYYY hh:mm:ss"),
    });
  }
  return items;

};
function CatalogManagement() {
  const [rewardData, setRewardData] = useState(
    {
      rewardIcon: "",
      rewardName: "",
      rewardCode: "",
      rewardDescription: "",
      rewardPoints: 0,
      rewardAmount: 0,
      rewardStatus: "active",
      rewardType: "",
      rewardApprover: ""
    });
  const [rewardsData, setRewardsData] = useState([]);
  const [showAdd, setShowAdd] = useState(false)
  const isMobile = useWindowSize();
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState("");
  const [, setError] = useState(false);
  const dispatch = useDispatch();
  const [, forceUpdate] = useState(false);
  const validator = Validator();

  const handleSubmit = (rewardData) => {
    if (validator.current.allValid()) {
      if (editId) {
        const finalData = {
          ...rewardData,
          companyId: localStorage.getItem("companyId") !== null ? JSON.parse(localStorage.getItem("companyId")) : null
        };
        setLoading(true);
        let response = dispatch(updateReward(editId, finalData));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            setError("");
            emptyData();
            getRewardsData();
          } else {
            setLoading(false);
            setError(message);
          }
        });
      } else {
        const finalData = {
          ...rewardData,
          companyId: localStorage.getItem("companyId") !== null ? JSON.parse(localStorage.getItem("companyId")) : null
        };
        setLoading(true);
        let response = dispatch(createReward(finalData));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            setError("");
            emptyData();
            getRewardsData();
          } else {
            setLoading(false);
            setError(message);
          }
        });
      }
    } else {
      validator.current.showMessages();
      forceUpdate(true);
      Toast({ message: "OKR Function/OKR Category is required!", time: 4000, type: "warning" })
    }
  };

  const getRewardsData = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllRewards());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = removeDuplicates(data, "rewardName");
          nonduplicate = tableGenerator(data, data.length);
          setRewardsData(nonduplicate);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setRewardsData([]);
          setLoading(false);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const handleEdit = (row) => {
    setRewardData({
      rewardIcon: row.rewardIcon,
      rewardName: row.rewardName,
      rewardCode: row.rewardCode,
      rewardDescription: row.rewardDescription,
      rewardPoints: row.rewardPoints,
      rewardAmount: row.rewardAmount,
      rewardStatus: row.rewardStatus,
      rewardType: row.rewardType,
      rewardApprover: row.rewardApprover
    });
    setEditId(row._id);
    handleShowAdd();
  };
  const handleShowAdd = () => {
    setShowAdd(true);
  };

  const emptyData = () => {
    setRewardData({
      rewardIcon: "",
      rewardName: "",
      rewardCode: "",
      rewardDescription: "",
      rewardPoints: 0,
      rewardAmount: 0,
      rewardStatus: "active",
      rewardType: "",
      rewardApprover: ""
    });
    setEditId(null);
    validator.current.hideMessages();
    setShowAdd(false);
  };
  const handleDelete = (id) => {
    let response = dispatch(deleteReward(id));
    response.then(({ success, message }) => {
      if (success) {
        setError("");
        getRewardsData();
      } else {
        setError(message);
      }
    });
  };

  useEffect(() => {
    getRewardsData();
  }, []);


  return (
    <>
      <TitleHeader name="Admin Portal - Privileges " />
      <div className={isMobile ? "bg-light-primary rounded-12 " : "bg-light-primary rounded-12 mh-100 p-4 m-4"}>
        <p className={isMobile ? "title text-dark font-weight-bold text-center" : "title text-dark font-weight-bold pb20"}>Catalog Management</p>
        <div className="company-form">
          <div className={isMobile ? "col-md-12 circle" : "col-md-12 circle"}>
            <div className="parent  ">
              <div className="card1 mb-2 mt-2 text-center p-2" onClick={() => {
                handleShowAdd();
                setEditId(null);
              }
              }>
                <img src={addNewReward} alt="new reward" className="plus" />
                <h2 className="newreward mt-1"> Add New Reward</h2>
              </div>

              {loading ? <LoadingIndicator /> : (rewardsData.length > 0 && rewardsData.map((reward, index) => (
                <Tippy content={<Toolcard reward={reward} />} placement='right' className="hover" interactive={true}>
                  <div className="col-md-3 card m-2 p-2 mt-2 mb-2">
                    <div className="d-flex justify-content-center">
                      <img src={reward.rewardIcon} alt="reward logo" className="rewardlogo" />
                    </div>
                    <h3 className="rewardtitle mb-0">{reward.rewardName}</h3>
                    <hr />
                    <h5 className="rewardcode m-0">{reward.rewardCode}</h5>
                    <h6 className="rewarddiscount">{reward.rewardDescription}</h6>
                    <small className="text-default rewarddelivery">{reward.rewardType}</small>
                    <div className="d-flex justify-content-end">
                      <img src={editIcon} alt="edit" onClick={() => handleEdit(reward)} className="deleteIcon" />
                      <img src={trashIcon} alt="trash" onClick={() => handleDelete(reward._id)} className="deleteIcon" />
                    </div>
                  </div>
                </Tippy>
              )))}

              {showAdd && <AddRewardPopup handlecallback={handleSubmit} show={showAdd} onHide={() => setShowAdd(!showAdd)} editId={editId} rewardDatas={rewardData} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CatalogManagement;
