import React, { useState, useEffect } from "react";
import "./styles.scss";
import paginationFactory from "react-bootstrap-table2-paginator";
import useWindowSize from "components/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
import { LoadingIndicator } from "utilities";
import { getUploadsByCategory } from "action/UploadAct";
import TableNormal from "components/TableNormal";
import {
  deletekeyResult,
  getKeyResults,
  getKeyResultsSingle,
} from "action/keyResultAct";
import TitleHeader from "components/TitleHeader";
import keyResultsColumns from "./keyResultColumns";
import KeyResultsMobileTable from "./KeyResultMobile/KeyResultMobileTable";
import { keyresults } from "reducer";
import { useTranslation } from "react-i18next";

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      okrName: data[i].okrName,
      keyResultName: data[i].keyResultName,
      frequency: data[i].frequency,
      uom: data[i].uom,
      polarity: data[i].polarity,
      msc: data[i].msc,
      targetDate: data[i].targetDate
        ? window.moment(data[i].targetDate).format("D MMM YYYY")
        : "No Date",
      actualDate: data[i].actualDate
        ? window.moment(data[i].actualDate).format("D MMM YYYY")
        : "No Date",
      target: data[i].target,
      actual: data[i].actual,
      feedAttachment: data[i].feedAttachment,
      objectiveId: data[i].objectiveId,
      dimension: data[i].dimension,
      weight: data[i].weight,
      progress: data[i].progress,
      isAlignedToCompany: data[i].isAlignedToCompany,
      createdAt: data[i].createdAt,
      updatedAt: data[i].updatedAt,
      targetDate1: data[i].targetDate,
    });
  }
  return items;
};

export default function Entity({ companyInfo }) {
  const kdata = useSelector((state) => state.data.keyresults);

  const dispatch = useDispatch();
  let legalEntityObj = {
    legalEntityName: "",
    status: "",
    country: "",
    _id: null,
  };
  const [legalEntitySearch] = useState(legalEntityObj);
  const [, setUploads] = useState([]);
  const [searchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [updatepage] = useState(false);
  const [data, setData] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [, setProgress] = useState(0);
  const [, setLoaded] = useState(0);
  const [, setTotal] = useState(0);
  const isMobile = useWindowSize();

  const samData = () => {
    if (kdata.success) {
      setData([]);
      fetchKeyResults();
      dispatch(keyresults({ success: false }));
    }
  };

  useEffect(() => {
    samData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kdata.success]);
  const fetchKeyResults = () => {
    try {
      setLoading(true);
      let user =
        JSON.parse(localStorage.getItem("user")) !== null
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      let response = dispatch(getKeyResultsSingle(user._id));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = tableGenerator(data, data.length);
          setData(result);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setData([]);
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

  const fetchUploads = () => {
    try {
      setLoading(true);
      let response = dispatch(getUploadsByCategory("company"));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          setUploads(data);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setUploads([]);
        } else {
          setLoading(false);
          setError(message);
        }
        setTotal(0);
        setProgress(0);
        setLoaded(0);
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const fetchPrivileges = () => {
    try {
      setLoading(true);
      let privileges =
        localStorage.getItem("privileges") !== null
          ? JSON.parse(localStorage.getItem("privileges"))
          : null;
      setPrivileges(privileges);
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const refreshData = () => {
    try {
      let response = dispatch(getKeyResults());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = tableGenerator(data, data.length);
          setData(result);
          setError("");
        } else if (data.length === 0) {
          setData([]);
          setError("No Data Found!");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error.toString());
    }
  };

  const handleDelete = (id) => {
    try {
      let response = dispatch(deletekeyResult(id));
      response.then(({ success, message }) => {
        if (success) {
          refreshData();
          setError("");
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
    fetchKeyResults();
    fetchUploads();
    fetchPrivileges();
    //eslint-disable-next-line
  }, []);

  const { t } = useTranslation();
  return (
    <div>
      <TitleHeader name={t("KeyResult.title")} />
      <div className="bg-light-primary rounded-12 mh-100 p-4 m-4">
        {loading && privileges.length === 0 ? (
          <div className="text-center">
            <LoadingIndicator size={3} />
          </div>
        ) : error ? (
          <p className="m-0 fs14 text-center text-danger">{error}</p>
        ) : isMobile ? (
          <KeyResultsMobileTable
            privileges={privileges}
            handleDelete={handleDelete}
            refreshData={refreshData}
            title="keyresults"
            data={data}
            columns={keyResultsColumns}
            paginationFactory={paginationFactory}
            searchKey={searchKey}
          />
        ) : (
          <TableNormal
            data={data.filter((item) => {
              return (
                item?.legalEntityName
                  ?.toLowerCase()
                  .indexOf(legalEntitySearch.legalEntityName.toLowerCase()) !==
                  -1 &&
                item?.status?.indexOf(legalEntitySearch.status) !== -1 &&
                item?.country
                  ?.toLowerCase()
                  .indexOf(legalEntitySearch.country.toLowerCase()) !== -1
              );
            })}
            columns={keyResultsColumns(privileges, handleDelete)}
            paginationFactory={paginationFactory}
            searchKey={searchKey}
            updatepage={updatepage}
            keyField="_id"
            title="Company"
          />
        )}
      </div>
    </div>
  );
}
