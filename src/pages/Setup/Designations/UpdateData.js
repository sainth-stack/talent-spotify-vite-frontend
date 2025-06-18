import React, { useState, useEffect } from "react";
import { statusesActive, Validator } from "utilities";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import { getDepartmentsData } from "action/DepartmentAct";
import { getGrades } from "action/GradeAct";
import { useDispatch } from "react-redux";

const UpdateDesignation = (props) => {
  const {
    designationName: designationNameExisting,
    departmentName: departmentNameExisting,
    gradeName: gradeNameExisting,
    status: statusExisting,
    _id: idExisting,
  } = props.updata;
  const [departmentName, setDepartmentName] = useState("");
  const [designationName, setDesignationName] = useState("");
  const [status, setStatus] = useState("");
  const [gradeName, setGradeName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [, forceUpdate] = useState(false);
  const [, setMessage] = useState("");

  const validator = Validator();
  const dispatch = useDispatch();

  const onHandleSubmit = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      const updateDepartmentName = departmentName
        ? departmentName
        : departmentNameExisting;
      const updatedesignationName = designationName
        ? designationName
        : designationNameExisting;
      const updateGrade = gradeName
        ? gradeName
        : gradeNameExisting;
      const updateStatus = status
        ? status
        : statusExisting;
      const updateIds = idExisting;
      props.handlecallback({
        departmentName: updateDepartmentName,
        designationName: updatedesignationName,
        gradeName: updateGrade,
        status: updateStatus,
        id: updateIds,
      });
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  };

  const fetchDepartments = () => {
    try {
      let response = dispatch(getDepartmentsData());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0 && data[0].departments.length > 0) {
          let result = data[0].departments.map(item => {
            return { label: item.departmentName, value: item.departmentName }
          })
          result.unshift({ label: "--Select--", value: "" })
          setDepartments(result);
        } else if (data.length === 0) {
          setDepartments([])
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGrades = () => {
    try {
      let response = dispatch(getGrades());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = data.map(item => {
            return { label: item.gradeName, value: item.gradeName }
          })
          result.unshift({ label: "--Select--", value: "" })
          setGrades(result);
        } else if (data.length === 0) {
          setGrades([])
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDepartments();
    fetchGrades();
    //eslint-disable-next-line
  }, [idExisting])
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update Designation
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={onHandleSubmit}>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="question">Designation Name</label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setDesignationName(e.target.value)}
              onFocus={() => setMessage("")}
              id="question"
              defaultValue={designationNameExisting}
              placeholder="DesignationName"
            />
          </div>
          <div className="form-group">
            <label htmlFor="question">Grade Name</label>
            {grades !== undefined && grades.length > 0 &&
              <Select
                value={grades.value}
                options={grades}
                defaultValue={
                  grades && gradeNameExisting
                    ? grades.filter((option) => option.value === gradeNameExisting)[0]
                    : grades[0]
                }
                onChange={(e) => setGradeName(e.value)}
              />}
          </div>

          <div className="form-group">
            <label htmlFor="question">Department Name</label>
            {departments !== undefined && departments.length > 0 &&
              <Select
                value={departments.value}
                options={departments}
                defaultValue={
                  departments && departmentNameExisting
                    ? departments.filter((option) => option.value === departmentNameExisting)[0]
                    : departments[0]
                }
                onChange={(e) => setDepartmentName(e.value)}
              />}
          </div>
          <div className="form-group">
            <label htmlFor="question">Status</label>
            <Select
              value={statusesActive.value}
              options={statusesActive}
              defaultValue={
                statusesActive && statusExisting
                  ? statusesActive.filter((option) => option.value === statusExisting)[0]
                  : statusesActive[0]
              }
              onChange={(e) => setStatus(e.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn text-white" style={{ backgroundColor: "#837F39" }}>
            Update
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default UpdateDesignation;
