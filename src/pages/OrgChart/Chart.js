import React, { useEffect, useState } from 'react';
import "./styles.scss";
import { useDispatch } from 'react-redux';
import { getOrgChart } from 'action/EmployeeAct';
import { LoadingIndicator } from 'utilities';
import OrgChartComponent from './NewOrgChart';

const Chart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [, setEmployees] = useState([]);
  const dispatch = useDispatch();
  const fetchOrgChartData = () => {
    try {
      setLoading(true);
      let response = dispatch(getOrgChart());
      response.then(({ data, message }) => {
        if (data !== undefined && data.finalData.length > 0) {
          let oldData = data.finalData;
          let finalData = [];
          oldData.forEach((item, index) => {
            let obj = {
              nodeId: "O-" + index,
              parentNodeId: item.lineManager === "" || item.lineManager === " " ? null : "O-" + (oldData.findIndex(old => old._id == item.lineManager) !== -1 ? oldData.findIndex(old => old._id == item.lineManager) : 0),
              nodeImage: item.profilePicture,
              name: item.name,
              positionName: item.role,
              jobCategory: item.jobCategory || item.role,
              directSubordinates: item.direct,
              totalSubordinates: item.subOrdinates
            };

            let childs = item.children.length > 0 ? item.children.filter(itemm => itemm._id === item._id && itemm.children.length === 0).map((itemm, indexx) => {
              let child = {
                nodeId: "O-" + index + indexx + 1,
                parentNodeId: "O-" + oldData.findIndex(old => item._id == itemm.lineManager),
                nodeImage: itemm.profilePicture,
                name: itemm.name,
                positionName: itemm.role || item.role,
                jobCategory: itemm.jobCategory || item.role,
                directSubordinates: itemm.direct,
                totalSubordinates: itemm.subOrdinates
              };
              return child;
            }) : [];
            finalData.push(obj);
            finalData = finalData.concat(childs);
          })
          setData(finalData);
          setEmployees(data.employees);
          setLoading(false);
          setError("");
        } else if (data.finalData.length === 0) {
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
  useEffect(() => {
    fetchOrgChartData();
  }, []);
  return error ? (
    <h3 className="text-danger">{error}</h3>
  ) : loading ? (
    <LoadingIndicator size="3" />
  ) : (
    <>
      <div className="d-flex justify-content-between pt-2 bg bg-white org-topbar">
      </div>
      <div className='printonly'>
        <OrgChartComponent
          data={data}
        />
      </div>
    </>
  );
};

export default Chart;