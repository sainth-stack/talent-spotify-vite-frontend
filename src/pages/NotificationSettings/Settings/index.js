/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import TitleHeader from "components/TitleHeader";
import HorizontalBar from "components/Company/HorizontalBar";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Button from "components/Company/Button";
import { Validator, Role, actionsData } from "utilities";
import { useDispatch } from "react-redux";
import TabsContainer from "./tabs";
import { createNotificationSettings, getAllNotificationSettings, updateNotificationSettings } from "action/NotificationSettingsAct";
import SelectInput from "components/Company/SelectInput";
import axios from 'axios';
import CKEditorContainer from "components/CKEditorContainer";

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      role: data[i].role,
      description: data[i].description,
      active: data[i].active,
      privileges: data[i].privileges,
      updatedAt: data[i].updatedAt,
    });
  }
  return items;
};
function NotificationSettings() {
  const [roleData, setRoleData] = useState({
    toAddress: "",
    ccAddress: "",
    subject: "",
    message: "",
    attachment: "",
  });
  const [, setLoading] = useState(false);
  const [editId, setEditId] = useState("");
  const [, setError] = useState(false);
  const [, setData] = useState([]);
  const dispatch = useDispatch();
  const [, forceUpdate] = useState(false);

  const validator = Validator();
  const [actions, setActions] = useState(actionsData);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleChangeSearch = ({ target: { name, value, label } }) => {
    let updatedData = { ...roleData };
    updatedData[name] = value;
    setRoleData(updatedData);
  };
  const handleUpload = (e) => {
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", "ma7nge92");
    axios
      .post(
        "https://api.cloudinary.com/v1_1/dbqm9svvp/raw/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
          },
        }
      )
      .then((response) => {
        let updatedData = { ...roleData };
        updatedData.attachment = response.data.secure_url;
        setRoleData(updatedData);
      }).catch(error => {
        console.log("Error", error);
      })
  };
  const handleSubmit = () => {
    if (validator.current.allValid()) {
      if (editId) {
        let finalActions = [...actions];
        if (selectedIndex !== null) {
          finalActions[selectedIndex].toAddress = roleData.toAddress;
          finalActions[selectedIndex].ccAddress = roleData.ccAddress;
          finalActions[selectedIndex].subject = roleData.subject;
          finalActions[selectedIndex].message = roleData.message;
          finalActions[selectedIndex].attachment = roleData.attachment;
        }
        const finalData = {
          actions: finalActions,
          companyId: localStorage.getItem("companyId") !== null ? JSON.parse(localStorage.getItem("companyId")) : null
        };
        setLoading(true);
        let response = dispatch(updateNotificationSettings(editId, finalData));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            setError("");
            getPrivilegesDataRefresh();
            emptyData();
          } else {
            setLoading(false);
            setError(message);
          }
        });
      } else {
        let finalActions = [...actions];
        finalActions[selectedIndex].toAddress = roleData.toAddress;
        finalActions[selectedIndex].ccAddress = roleData.ccAddress;
        finalActions[selectedIndex].subject = roleData.subject;
        finalActions[selectedIndex].message = roleData.message;
        finalActions[selectedIndex].attachment = roleData.attachment;
        const finalData = {
          actions: finalActions,
          companyId: localStorage.getItem("companyId") !== null ? JSON.parse(localStorage.getItem("companyId")) : null
        };
        setLoading(true);
        let response = dispatch(createNotificationSettings(finalData));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            setError("");
            getPrivilegesDataRefresh();
            emptyData();
          } else {
            setLoading(false);
            setError(message);
          }
        });
      }
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  }


  const getPrivilegesData = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllNotificationSettings());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          setData(data)
          setActions(data[0].actions);
          setEditId(data[0]._id)
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
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


  const getPrivilegesDataRefresh = () => {
    try {
      let response = dispatch(getAllNotificationSettings());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          setData(data);
          setActions(data[0].actions);
          setEditId(data[0]._id)
          setError("");
        } else if (data.length === 0) {
          setError("No Data Found!");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error.toString());
    }
  };

  const emptyData = () => {
    setRoleData({
      toAddress: "",
      ccAddress: "",
      subject: "",
      message: "",
      attachment: "",
    });
    setActions(actionsData);
    setEditId(null);
    validator.current.hideMessages();
  }

  const reUpload = () => {
    let updatedData = { ...roleData };
    updatedData.attachment = "";
    setRoleData(updatedData);
  }


  useEffect(() => {
    getPrivilegesData()
  }, [])
  return (
    <>
      <TitleHeader name="Admin Portal - Notification Settings " />
      <div className="bg-light-primary rounded-12 mh-100 p-4 m-4">
        <p className="title text-dark font-weight-bold pb20">
          Notification Settings
        </p>
        <div className="company-form">
          <Row>
            <Col md={5}>
              <TabsContainer actions={actions} setActions={setActions} setRoleData={setRoleData} setSelectedIndex={setSelectedIndex} />
            </Col>
            <Col md={7}>
              {selectedIndex !== null ?
                <div>
                  <p className="mb-3 text-center font-weight-bold border p-2 rounded">{actions[selectedIndex].page}</p>
                </div> : null
              }
              <div className="mb-5">
                <SelectInput
                  label="To*"
                  placeholder="--Select--"
                  name="toAddress"
                  options={Role}
                  value={roleData.toAddress}
                  onChangeText={handleChangeSearch}
                />
              </div>
              <SelectInput
                label="CC"
                placeholder="--Select--"
                name="ccAddress"
                options={Role}
                value={roleData.ccAddress}
                onChangeText={handleChangeSearch}
              />
              <div className="d-flex justify-content-between mt-5">
                <label className="label fs13 col-md-4 col-xs-12 col-sm-12">
                  Subject*
                </label>
                <div className="d-flex ml-2 col-md-8  col-xs-12 col-sm-12">
                  <input
                    style={{ borderRadius: "5px" }}
                    id="subject"
                    className="form-control col-12 p-3"
                    name="subject"
                    rows="5"
                    value={roleData.subject}
                    onChange={handleChangeSearch}
                  />
                </div>
              </div>{" "}
              <div className="d-flex justify-content-between mt-5">
                <label className="label fs13 col-md-4 col-xs-12 col-sm-12">
                  Message*
                </label>
                <div className="ml-2 col-md-8  col-xs-12 col-sm-12">
                  {roleData.toAddress ? <CKEditorContainer onChange={(e) => handleChangeSearch(e)} message={roleData.message} /> : <textarea
                    style={{ borderRadius: "20px" }}
                    className="form-control col-12 p-3"
                    name="message"
                    rows="5"
                    disabled
                  ></textarea>}
                </div>
              </div>
              <div className="d-flex justify-content-between mt-5">
                <label className="label fs13 col-md-4 col-xs-12 col-sm-12">
                  Attachment
                </label>
                <div className="d-flex ml-2 col-md-8  col-xs-12 col-sm-12">
                  {roleData.attachment.length > 0 ? <div className="d-flex justify-content-between align-items-center">
                    <a href={roleData.attachment} target="_blank">View</a>
                    <button className="btn btn-primary ml-5" onClick={() => reUpload()}>Re-Upload</button>
                  </div> : <input
                    type="file"
                    className="form-control col-12 p-1"
                    name="attachment"
                    rows="5"
                    onChange={handleUpload}
                  />}
                </div>
              </div>
            </Col>
          </Row>

          <Button text={`${editId ? "Update Settings" : "Save Settings"}`} handleClick={() => handleSubmit()} className="bg-green border-grey text-white" />
          <HorizontalBar className="pt-3 pb-3" />
        </div>
      </div>
    </>
  );
}

export default NotificationSettings;
