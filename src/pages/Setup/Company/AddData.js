import React, { useState } from "react";
import {
  countriesNames,
  industries,
  statusesActive,
  Validator,
} from "utilities";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";

export default function AddCompanyData(props) {
  const [companyName, setCompanyName] = useState("");
  const [status, setStatus] = useState("Active");
  const [country, setCountry] = useState("India");
  const [industry, setIndustry] = useState("Aviation");
  const [, forceUpdate] = useState(false);
  const [, setMessage] = useState("");

  const validator = Validator();

  const onHandleSubmit = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      props.handlecallback({
        status: status,
        country: country,
        companyEntityName: companyName,
        industry: industry,
      });
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  };

  const { t } = useTranslation();

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
          {t("Company.add_new_company")}
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={onHandleSubmit}>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="question">{t("Company.company_name")}</label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setCompanyName(e.target.value)}
              onFocus={() => setMessage("")}
              id="companyName"
              defaultValue={companyName}
              placeholder="Company Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="question">{t("Company.industry")}</label>
            <Select
              value={industries.value}
              options={industries}
              defaultValue={
                industries && industry
                  ? industries.filter((option) => option.value === industry)[0]
                  : industries[0]
              }
              onChange={(e) => setIndustry(e.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="question">{t("Company.Status")}</label>
            <Select
              value={statusesActive.value}
              options={statusesActive}
              defaultValue={
                statusesActive && status
                  ? statusesActive.filter(
                      (option) => option.value === status
                    )[0]
                  : statusesActive[0]
              }
              onChange={(e) => setStatus(e.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="question">{t("Company.Country")}</label>
            <Select
              value={countriesNames.value}
              options={countriesNames}
              defaultValue={
                countriesNames && country
                  ? countriesNames.filter(
                      (option) => option.value === country
                    )[0]
                  : countriesNames[0]
              }
              onChange={(e) => setCountry(e.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
