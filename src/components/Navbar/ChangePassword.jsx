import React, { useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import wrong from "../../assets/svg/wrong.svg";
import { LoadingIndicator, Validator } from "utilities";
import SelectInput from "../../components/Company/SelectInput";
import Button from "../../components/Company/Button";
import useWindowSize from "../../components/UseWindowSize";
import TextInput from "../../components/Company/TextInput";
import { Toast } from "../../service/toast";

export default function ChangePassword(props) {
  const [selectedUser, setSelectedUser] = useState("");
  const [, forceUpdate] = useState(false);
  const isMobile = useWindowSize();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSave = () => {
    if (validator.current.allValid()) {
      if (confirmPassword !== newPassword) {
        Toast({ type: "error", message: "Passwords do not match" });
      } else if (confirmPassword === newPassword) {
        props.handlecallback({
          currentPassword,
          newPassword,
          email: props.email,
        });
      }
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  };
  const validator = Validator();
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
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
          Change Password
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        <div
          className={`bg-light-white rounded-12 ${isMobile ? "" : "p-4 m-4"}`}
        >
          <div className="form-group mt-3">
            <Row>
              <Col className="p-1">
                <TextInput label="Email" value={props.email} readonly={true} />
              </Col>
            </Row>
            <Row>
              <Col className="p-1">
                <TextInput
                  label="Current Password*"
                  value={currentPassword}
                  dateType={"password"}
                  onChangeText={(e) => setCurrentPassword(e.target.value)}
                />
                {/* {validator.current.message("Current Password", currentPassword, "required")} */}
              </Col>
            </Row>
            <Row>
              <Col className="p-1">
                <TextInput
                  label="New Password*"
                  value={newPassword}
                  dateType={"password"}
                  onChangeText={(e) => setNewPassword(e.target.value)}
                />
                {/* {validator.current.message("New Password", newPassword, "required")} */}
              </Col>
            </Row>
            <Row>
              <Col className="p-1">
                <TextInput
                  label="Confirm Password*"
                  value={confirmPassword}
                  dateType={"password"}
                  onChangeText={(e) => setConfirmPassword(e.target.value)}
                />
                {/* {validator.current.message("Confirm Password", confirmPassword, "required")} */}
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <div className="d-flex justify-content-end">
            {/*<Button
              text={t("objectives.Clear")}

              className="bg-white border-grey"
              handleClick={clearData}
            />*/}
            {props.loading ? (
              <div className="mr-5">
                <LoadingIndicator size="1" />
              </div>
            ) : (
              <Button
                text="Change"
                className="bg-green border text-white"
                handleClick={handleSave}
              />
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
