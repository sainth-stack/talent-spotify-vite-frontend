import React, { useState } from "react";
import { countriesNames, statusesActive, Validator } from "utilities";
import { Modal } from "react-bootstrap";
import Select from "react-select";

export default function UpdateDepartmentData(props) {
  const {
    departmentName: departmentNameExisting,
    legalEntityName: legalEntityNameExisting,
    status: statusExisting,
    location: locationExisting,
    parentDepartment: parentDepartmentExisting,
    _id: idExisting,
  } = props.updata;
  const [legalEntityName, setLegalEntityName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [parentDepartmentName, setParentDepartmentName] = useState(parentDepartmentExisting);
  const [departs,] = useState(props.departments.map(item => {
    return { label: item.value, value: item.value }
  }));
  const [legalEntities,] = useState(props.legalEntities.map(item => {
    return { label: item.value, value: item.value }
  }));
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [, forceUpdate] = useState(false);
  const [, setMessage] = useState("");

  const validator = Validator();

  const onHandleSubmit = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      const updateDepartmentName = departmentName
        ? departmentName
        : departmentNameExisting;
      const updateLegalEntityName = legalEntityName
        ? legalEntityName
        : legalEntityNameExisting;
      const updateStatus = status
        ? status
        : statusExisting;
      const updateLocation = location
        ? location
        : locationExisting;
      const updateIds = idExisting;
      props.handlecallback({
        departmentName: updateDepartmentName,
        parentDepartment: parentDepartmentName,
        legalEntityName: updateLegalEntityName,
        status: updateStatus,
        location: updateLocation,
        id: updateIds,
      });
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  };
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
          Update Department
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={onHandleSubmit}>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="question">Department Name</label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setDepartmentName(e.target.value)}
              onFocus={() => setMessage("")}
              id="departmentName"
              defaultValue={departmentNameExisting}
              placeholder="Department Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="question">Parent Department Name</label>
            {departs !== undefined && departs.length > 0 &&
              <Select
                value={departs.value}
                options={departs}
                defaultValue={
                  departs && parentDepartmentExisting
                    ? departs.filter((option) => option.value === parentDepartmentExisting)[0]
                    : departs[0]
                }
                onChange={(e) => setParentDepartmentName(e.value)}
              />}
          </div>
          <div className="form-group">
            <label htmlFor="question">Legal Entity Name</label>
            {legalEntities !== undefined && legalEntities.length > 0 &&
              <Select
                value={legalEntities.value}
                options={legalEntities}
                defaultValue={
                  legalEntities && legalEntityNameExisting
                    ? legalEntities.filter((option) => option.value === legalEntityNameExisting)[0]
                    : legalEntities[0]
                }
                onChange={(e) => setLegalEntityName(e.value)}
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
          <div className="form-group">
            <label htmlFor="question">Country</label>
            <Select
              value={countriesNames.value}
              options={countriesNames}
              defaultValue={
                countriesNames && locationExisting
                  ? countriesNames.filter((option) => option.value === locationExisting)[0]
                  : countriesNames[0]
              }
              onChange={(e) => setLocation(e.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn bg-green text-white">
            Update
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
