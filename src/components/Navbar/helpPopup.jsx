import React, { useState, useRef, useEffect } from "react";
import wrong from "assets/svg/wrong.svg";
import { Modal } from "react-bootstrap";
import useWindowSize from "components/UseWindowSize";
import SelectInput from "components/Company/SelectInput";
import paginationFactory from "react-bootstrap-table2-paginator";
import TableNormal from "components/TableNormal";
import ArrowOrderComponent from "../../pages/Objectives/ObjectivesTable/ArrowOrderComponent";
import { getRandom } from "utilities";
import { useDispatch } from "react-redux";
import {
  createIssue,
  getIssueByEmpId,
  getIssues,
  updateIssue,
} from "action/IssuesAct";
import { Toast } from "service/toast";
import { t } from "i18next";

const HelpPopup = (props) => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  let user =
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  let company =
    localStorage.getItem("companyId") !== null
      ? JSON.parse(localStorage.getItem("companyId"))
      : null;
  let userRole =
    localStorage.getItem("userRole") !== null
      ? JSON.parse(localStorage.getItem("userRole"))
      : null;
  const [error, setError] = useState(false);
  const [create, setCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const superAdmin = user.role === "Super Admin";
  const defaultData = {
    SRnumber: getRandom(9),
    priority: "High",
    problemArea: "",
    raisedBy: user?.name,
    status: "New",
    description: "",
    userId: user._id,
    attachments: "",
    companyId: company,
    feed: [],
    update: "",
    url: "",
  };
  const [task, setTask] = useState(defaultData);
  const handleChange = ({ target: { name, value } }) => {
    let updatedData = { ...task };
    updatedData[name] = value;
    setTask(updatedData);
  };
  const isMobile = useWindowSize();

  const columns = [
    {
      dataField: "id",
      text: "S.No",
      csvExport: false,
      hidden: true,
    },
    {
      dataField: "_id",
      text: "_id",
      hidden: true,
    },
    {
      dataField: "SRnumber",
      text: "SR Number",
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} column={column.dataField} />;
      },
      headerClasses: "id-custom-cell",
      style: {
        width: "400px",
      },
      formatter: (cellContent, row) => {
        return (
          <a href="#">
            <div
              className="d-flex"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setTask(row);
                setCreate(true);
              }}
            >
              {row.SRnumber}
            </div>
          </a>
        );
      },
    },
    {
      dataField: "problemArea",
      text: "Area",
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} column={column.dataField} />;
      },
      headerClasses: "id-custom-cell",
      style: {
        width: "400px",
      },
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} column={column.dataField} />;
      },
      headerClasses: "id-custom-cell",
      style: {
        width: "400px",
      },
    },
    {
      dataField: "status",
      text: t("objectives.Progress_Status"),
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} column={column.dataField} />;
      },
      headerClasses: "id-custom-cell",
      style: {
        width: "400px",
      },
    },
    {
      dataField: "raisedBy",
      text: "Created By",
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} column={column.dataField} />;
      },
      headerClasses: "id-custom-cell",
      style: {
        width: "400px",
      },
    },
    {
      dataField: "createdAt",
      text: "Creation Date",
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} column={column.dataField} />;
      },
      headerClasses: "id-custom-cell",
      style: {
        width: "400px",
      },
    },
    {
      dataField: "updatedAt",
      text: "Last Update Date",
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} column={column.dataField} />;
      },
      headerClasses: "id-custom-cell",
      style: {
        width: "400px",
      },
    },
  ];

  if (superAdmin) {
    columns.splice(4, 0, {
      dataField: "companyName",
      text: "Company",
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} column={column.dataField} />;
      },
      headerClasses: "id-custom-cell",
      style: {
        width: "400px",
      },
    });
  }

  const problemArea = [
    { key: "Dashboard", value: "Dashboard" },
    { key: "Objectives", value: "Objectives" },
    { key: "Key Results", value: "Key Results" },
    { key: "Tasks", value: "Tasks" },
    { key: "Org Chart", value: "Org Chart" },
    { key: "Goals", value: "Goals" },
    { key: "Advance Launch Forms", value: "Advance Launch Forms" },
    { key: "Rewards Points", value: "Rewards Points" },
  ];

  const priority = [
    { key: "High", value: "High" },
    { key: "Medium", value: "Medium" },
    { key: "Low", value: "Low" },
  ];

  const status = [
    { key: "New", value: "New" },
    { key: "Work In Progress", value: "Work In Progress" },
    { key: "Resolved", value: "Resolved" },
  ];
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    // You can perform further actions with the selected file if needed
    console.log("File selected:", selectedFile);
    setTask({
      ...task,
      attachments: selectedFile,
    });
  };

  const handleButtonClick = () => {
    // Trigger click event on file input
    fileInputRef.current.click();
  };


  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("SRnumber", task.SRnumber);
      formData.append("problemArea", task.problemArea);
      formData.append("raisedBy", task.raisedBy);
      formData.append("priority", task.priority);
      formData.append("status", task.status);
      formData.append("description", task.description);
      formData.append("userId", task.userId);
      formData.append("companyId", task.companyId);
      if (task.feed.length > 0) {
        formData.append("companyName", task.companyName);
        formData.append("attachments", task.url);
        formData.append(
          "feed",
          JSON.stringify([
            ...task.feed,
            {
              comment: task.update,
              date: window.moment(new Date()).format("YYYY/MM/DD"),
              user: user?.name,
            },
          ])
        );
        let response = dispatch(updateIssue(task._id, formData));
        response.then(({ success, message }) => {
          if (success) {
            setError("");
            setTask(defaultData);
            setCreate(false);
            getIssuesAll();
          } else {
            setError(message);
          }
        });
      } else {
        let originalFileName = task.attachments?.name;
        let fileName = originalFileName.split(".")[0] + "_" + getRandom(9);
        const data = new FormData();
        data.append("file", task.attachments);
        data.append("upload_preset", "ma7nge92");
        data.append("public_id", "talentspotifypics/" + fileName);
        fetch("https://api.cloudinary.com/v1_1/dbqm9svvp/image/upload", {
          method: "post",
          body: data,
        })
          .then((responce) => responce.json())
          .then((data) => {
            Toast({
              type: "success",
              message: "Image Uploaded Successfully",
              time: 5000,
            });
            setTask({
              ...task,
              url: data.url,
            });
            formData.append("attachments", data.url);
            formData.append(
              "feed",
              JSON.stringify([
                {
                  comment: "issue has been created by user",
                  date: window.moment(new Date()).format("YYYY/MM/DD"),
                  user: user?.name,
                },
              ])
            );
            let response = dispatch(createIssue(formData));
            response.then(({ success, message }) => {
              if (success) {
                setError("");
                setTask(defaultData);
                setCreate(false);
                getIssuesAll();
              } else {
                setError(message);
              }
            });
          })
          .catch((err) => console.log(err));
      }
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const getIssuesAll = () => {
    try {
      let response = dispatch(superAdmin ? getIssues() : getIssueByEmpId());
      response.then(({ data, success, message }) => {
        const updateData = data.map((item) => {
          return {
            ...item,
            feed: JSON.parse(item.feed),
            createdAt: window.moment(item.createdAt).format("YYYY-MM-DD"),
            updatedAt: window.moment(item.updatedAt).format("YYYY-MM-DD"),
          };
        });
        if (success) {
          setError("");
          console.log(updateData);
          setData(updateData);
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  useEffect(() => {
    getIssuesAll();
  }, []);

  const handleHide = () => {
    props.onHide();
    setCreate(false);
  };
  return (
    <Modal
      show={props.show}
      onHide={handleHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ top: 0 }}
    >
      <Modal.Header
        style={{
          background: "#F5F5F6",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.17)",
        }}
      >
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ paddingTop: "10px", paddingLeft: "20px" }}
        >
          Support
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        <div style={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}>
          {superAdmin ? (
            <div>
              <div className="mx-3">
                <div className="d-flex justify-content-between">
                  <h2 style={{ fontSize: "20px" }}>History</h2>
                </div>
                <TableNormal
                  data={data}
                  columns={columns}
                  paginationFactory={paginationFactory}
                  keyField="_id"
                  title="Company"
                />
              </div>
              {create && (
                <div>
                  <div
                    style={{
                      width: "50%",
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                      gap: "40px",
                      marginLeft: "20px",
                    }}
                  >
                    <label
                      htmlFor="taskTitle"
                      className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                      style={{ width: "160px" }}
                    >
                      SR Number
                    </label>
                    <label
                      htmlFor="taskTitle"
                      className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                    >
                      {task.SRnumber}
                    </label>
                  </div>
                  <div
                    className={
                      isMobile
                        ? "form-group mt-2"
                        : "form-group mt-3 d-flex justify-content-between"
                    }
                  >
                    <div className="" style={{ width: "60%" }}>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                          gap: "40px",
                          marginLeft: "20px",
                        }}
                      >
                        <label
                          htmlFor="taskTitle"
                          className={isMobile ? "mr-3 col-3 p-0 m-0" : ""}
                          style={{ width: "160px" }}
                        >
                          Problem Area
                        </label>
                        <label
                          htmlFor="taskTitle"
                          className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                        >
                          {task.problemArea}
                        </label>
                      </div>
                    </div>
                    <div
                      style={{
                        width: "60%",
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        gap: "40px",
                        marginLeft: "20px",
                      }}
                    >
                      <label
                        htmlFor="taskTitle"
                        className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                        style={{ width: superAdmin ? "150px" : "80px" }}
                      >
                        Raised By
                      </label>
                      <label
                        htmlFor="taskTitle"
                        className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                      >
                        {task.raisedBy}
                      </label>
                    </div>
                  </div>
                  <div
                    className={
                      isMobile
                        ? "form-group mt-2"
                        : "form-group mt-3 d-flex justify-content-between"
                    }
                  >
                    <div className="" style={{ width: "80%" }}>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                          gap: "40px",
                          marginLeft: "20px",
                        }}
                      >
                        <label
                          htmlFor="taskTitle"
                          className={isMobile ? "mr-3 col-3 p-0 m-0" : ""}
                          style={{ width: "160px" }}
                        >
                          Priority
                        </label>
                        <label
                          htmlFor="taskTitle"
                          className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                        >
                          {task.priority}
                        </label>
                      </div>
                    </div>
                    <div className="" style={{ width: "80%" }}>
                      <SelectInput
                        label={t("Tasks.Status")}
                        placeholder=""
                        name="status"
                        options={status}
                        value={task.status}
                        onChangeText={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between">
                      <div
                        className="form-group d-flex mx-3"
                        style={{ gap: "40px" }}
                      >
                        <label
                          htmlFor="taskDescription"
                          className={isMobile ? "mr-5 col-3 m-0 p-0" : ""}
                          style={{ width: "160px" }}
                        >
                          Description
                        </label>
                        {task.description}
                      </div>
                      <div className="w-50">
                        <label
                          htmlFor="taskTitle"
                          className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                          style={{ cursor: "pointer" }}
                        >
                          <a
                            href={"#"}
                            onClick={() => window.open(task.attachments)}
                          >
                            {" "}
                            View Attachment
                          </a>
                        </label>
                      </div>
                    </div>
                    <div
                      className="form-group d-flex mx-3"
                      style={{ gap: "40px" }}
                    >
                      <label
                        htmlFor="taskDescription"
                        className={isMobile ? "mr-5 col-3 m-0 p-0" : ""}
                        style={{ width: "160px" }}
                      >
                        Update
                      </label>
                      <textarea
                        id="taskDescription"
                        className={`form-control p-2 ${
                          isMobile ? "mr-1" : "col-8"
                        }`}
                        rows="5"
                        name="update"
                        value={task.update}
                        onChange={handleChange}
                        style={{ width: "100%", borderRadius: "0px" }}
                      />
                    </div>
                    <div className="d-flex justify-content-end mt-4">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setCreate(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary ml-2"
                        onClick={handleSave}
                      >
                        {task.feed.length == 0 ? "Save" : "Update"}
                      </button>
                    </div>
                    {task.feed.length > 0 && (
                      <div className="mx-3">
                        <label
                          htmlFor="taskDescription"
                          className={isMobile ? "mr-5 col-3 m-0 p-0" : ""}
                        >
                          Feed of the ticket
                        </label>
                        <ul>
                          {task.feed.map((item) => {
                            return (
                              <li className="ml-2">
                                {item?.user}-{item.date}: {item.comment}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {create && (
                <div>
                  <div
                    style={{
                      width: "50%",
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                      gap: "40px",
                      marginLeft: "15px",
                    }}
                  >
                    <label
                      htmlFor="taskTitle"
                      className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                      style={{ width: "140px" }}
                    >
                      SR Number
                    </label>
                    <label
                      htmlFor="taskTitle"
                      className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                    >
                      {task.SRnumber}
                    </label>
                  </div>
                  <div
                    className={
                      isMobile
                        ? "form-group mt-2"
                        : "form-group mt-3 d-flex justify-content-between"
                    }
                  >
                    <div className="" style={{ width: "50%" }}>
                      <SelectInput
                        label="Problem Area"
                        placeholder=""
                        name="problemArea"
                        options={problemArea}
                        value={task.problemArea}
                        onChangeText={handleChange}
                      />
                    </div>
                    <div
                      style={{
                        width: "50%",
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        gap: "40px",
                        marginLeft: "20px",
                      }}
                    >
                      <label
                        htmlFor="taskTitle"
                        className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                        style={{ width: superAdmin ? "150px" : "80px" }}
                      >
                        Raised By
                      </label>
                      <label
                        htmlFor="taskTitle"
                        className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                      >
                        {task.raisedBy}
                      </label>
                    </div>
                  </div>
                  <div
                    className={
                      isMobile
                        ? "form-group mt-2"
                        : "form-group mt-3 d-flex justify-content-between"
                    }
                  >
                    <div className="" style={{ width: "50%" }}>
                      <SelectInput
                        label="Priority"
                        placeholder=""
                        name="priority"
                        options={priority}
                        value={task.priority}
                        onChangeText={handleChange}
                      />
                    </div>
                    <div
                      style={{
                        width: "50%",
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        gap: "40px",
                        marginLeft: "20px",
                      }}
                    >
                      <label
                        htmlFor="taskTitle"
                        className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                        style={{ width: superAdmin ? "150px" : "80px" }}
                      >
                        {t("objectives.Progress_Status")}
                      </label>
                      <label
                        htmlFor="taskTitle"
                        className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                      >
                        {task.status}
                      </label>
                    </div>
                  </div>
                  {!task.feed.length > 0 ? (
                    <div>
                      <div
                        className="form-group d-flex mx-3"
                        style={{ gap: "40px" }}
                      >
                        <label
                          htmlFor="taskDescription"
                          className={isMobile ? "mr-5 col-3 m-0 p-0" : ""}
                          style={{ width: "140px" }}
                        >
                          Description
                        </label>
                        <textarea
                          id="taskDescription"
                          className={`form-control p-2 ${
                            isMobile ? "mr-1" : "col-8"
                          }`}
                          rows="5"
                          name="description"
                          value={task.description}
                          onChange={handleChange}
                          style={{ width: "100%", borderRadius: "0px" }}
                        />
                      </div>
                      <div
                        className="mx-3 d-flex"
                        style={{ gap: "98px", alignItems: "center" }}
                      >
                        <label
                          htmlFor="taskDescription"
                          className={isMobile ? "mr-5 col-3 m-0 p-0" : ""}
                        >
                          Attachment
                        </label>
                        <div className="d-flex w-100">
                          <input
                            type="text"
                            placeholder=""
                            id="title"
                            className={`form-control searchBox text-dark fs14 ${
                              isMobile ? "mr-1" : "col-4"
                            }`}
                            name="title"
                            disabled={true}
                            style={{ borderRadius: "0px" }}
                            value={task.attachments?.name || ""}
                          />
                          <div>
                            <input
                              type="file"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={handleFileChange}
                            />
                            <button
                              className="btn btn-primary ml-2"
                              onClick={handleButtonClick}
                            >
                              Browse
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="d-flex justify-content-between">
                        <div
                          className="form-group d-flex mx-3"
                          style={{ gap: "40px" }}
                        >
                          <label
                            htmlFor="taskDescription"
                            className={isMobile ? "mr-5 col-3 m-0 p-0" : ""}
                            style={{ width: "140px" }}
                          >
                            Description
                          </label>
                          {task.description}
                        </div>
                        <div className="w-50">
                          <label
                            htmlFor="taskTitle"
                            className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                            style={{ cursor: "pointer" }}
                          >
                            <a
                              href={"#"}
                              onClick={() => window.open(task.attachments)}
                            >
                              {" "}
                              View Attachment
                            </a>
                          </label>
                        </div>
                      </div>
                      <div
                        className="form-group d-flex mx-3"
                        style={{ gap: "40px" }}
                      >
                        <label
                          htmlFor="taskDescription"
                          className={isMobile ? "mr-5 col-3 m-0 p-0" : ""}
                          style={{ width: "140px" }}
                        >
                          Update
                        </label>
                        <textarea
                          id="taskDescription"
                          className={`form-control p-2 ${
                            isMobile ? "mr-1" : "col-8"
                          }`}
                          rows="5"
                          name="update"
                          value={task.update}
                          onChange={handleChange}
                          style={{ width: "100%", borderRadius: "0px" }}
                        />
                      </div>
                    </div>
                  )}
                  {/* {task.feed.length === 0 && <div className="d-flex justify-content-center mt-4">
                                    <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
                                </div>} */}
                  <div className="d-flex justify-content-end mt-4">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setCreate(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary ml-2"
                      onClick={handleSave}
                    >
                      {task.feed.length == 0 ? "Save" : "Update"}
                    </button>
                  </div>
                  {task.feed.length > 0 && (
                    <div className="mx-3">
                      <label
                        htmlFor="taskDescription"
                        className={isMobile ? "mr-5 col-3 m-0 p-0" : ""}
                      >
                        Feed of the ticket
                      </label>
                      <ul>
                        {task.feed.map((item) => {
                          return (
                            <li className="ml-2">
                              {item?.user}-{item.date}: {item.comment}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  <hr />
                </div>
              )}
              <div className="mx-3">
                <div className="d-flex justify-content-between">
                  <h2 style={{ fontSize: "20px" }}>History</h2>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setCreate(true);
                      setTask(defaultData);
                    }}
                  >
                    Create SR
                  </button>
                </div>
                <TableNormal
                  data={data}
                  columns={columns}
                  paginationFactory={paginationFactory}
                  keyField="_id"
                  title="Company"
                />
              </div>
            </div>
          )}
          <div></div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default HelpPopup;
