import SelectInput from 'components/Company/SelectInput';
import PopupTransferOKR from 'pages/Objectives/PopupTransferKRs';
import useGetEmployees from 'pages/Objectives/hooks/useGetEmployees';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

export default function TransferTab() {
  let companyObj = {
    fromEmployeeName: "",
    toEmployeeName: "",
    role: "",
    employeeName: ""
  };
  const [companyInfo, setCompanyInfo] = useState(companyObj);
  const { data: employeeResponse, message, success, isLoading } = useGetEmployees();
  const [empData, setEmpData] = useState([]);
  const [showOKRs, setShowOkrs] = useState(false);
  useEffect(() => {
    if (!isLoading && employeeResponse && employeeResponse.data.length > 0) {
      let employeeData = employeeResponse && employeeResponse.data.length > 0 && employeeResponse.data.map((item) => {
        return {
          key:
            item.personalInformation.firstName +
            " " +
            item.personalInformation.lastName,
          value: item._id,
          role: item.employmentInformation.role
        };
      });
      setEmpData(employeeData);
    }
  }, [isLoading, employeeResponse])
  const handleChange = (e) => {
    setCompanyInfo({ ...companyInfo, [e.target.name]: e.target.value, role: empData.filter(item => e.target.name === "fromEmployeeName" && item.value === e.target.value).length > 0 ? empData.filter(item => e.target.name === "fromEmployeeName" && item.value === e.target.value)[0].role : companyInfo.role, employeeName: empData.filter(item => e.target.name === "toEmployeeName" && item.value === e.target.value).length > 0 ? empData.filter(item => e.target.name === "toEmployeeName" && item.value === e.target.value)[0].key : companyInfo.employeeName });
    setShowOkrs(false);
  };
  return (
    <div>
      <div className='mt-2'>
        <SelectInput
          label="Transfer From Employee:"
          placeholder="--Select--"
          name="fromEmployeeName"
          options={empData.filter(item => item.value !== companyInfo.toEmployeeName)}
          value={companyInfo.fromEmployeeName}
          onChangeText={(e) => {
            handleChange(e);
          }}
        />
      </div>
      <div className='mt-2'>
        <SelectInput
          label="Transfer To Employee:"
          placeholder="--Select--"
          name="toEmployeeName"
          options={empData.filter(item => item.value !== companyInfo.fromEmployeeName)}
          value={companyInfo.toEmployeeName}
          onChangeText={(e) => {
            handleChange(e);
          }}
        />
      </div>
      <div className='mt-2 m-2'>
        <button className='btn btn-success bg-green btn-sm rounded' onClick={() => {
          setShowOkrs(!showOKRs);
          setTimeout(() => {
            setShowOkrs(!showOKRs);
          }, 500);
        }
        }>Find OKR</button>
      </div>
      {showOKRs && <PopupTransferOKR companyObj={companyInfo} />}
    </div>
  )
}
