import React, { useState } from 'react'
import question from "../../../assets/svg/questionm.svg";
import star from "assets/svg/star.svg";
import plus from "assets/svg/plus.svg";
import SelectInput from 'components/Company/SelectInput';
import { useEffect } from 'react';
import TextInput from 'components/Company/TextInput';
import "./style.scss";
const GuideLinesTab = ({ templates, performance, setTemplateInfo }) => {
  const templateData = templates;
  const [data, setData] = useState([])
  const _options = [
    { key: "Calibration", label: "Calibration", value: "Calibration" },
    { key: "Self Submission", label: "Self Submission", value: "Self Submission" },
    { key: "Manager Review", label: "Manager Review", value: "Manager Review" },
    { key: "Manager SignOff", label: "Manager SignOff", value: "Manager SignOff" },
    { key: "Employee SignOff", label: "Employee SignOff", value: "Employee SignOff" },
  ];
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    if (performance.length > 0) {
      setData(performance)
    } else if (templates.length > 0) {
      let updatedData = templates.map((item, index) => {
        let formattedRating = item.ratingScale.scores.map((score, index) => {
          return {
            rating: score.score,
            ratingLabel: score.label,
            distribution: "",
            key: score.label,
            label: score.label,
            value: score.score
          }
        });
        return {
          templateName: item.value,
          step: _options[0].value,
          ratingScale: item.ratingScale.scores,
          overallFormRating: formattedRating
        }
      })
      setData(updatedData)
      setTemplateInfo(updatedData)
    }
  }, [templates, performance])
  const handleChange = ({ target: { name, value } }, index) => {
    let updatedData = [...data];
    updatedData[index][name] = value;
    setData(updatedData)
    setTemplateInfo(updatedData)
  }
  const handleChangeRating = ({ target: { name, value } }, index) => {
    let updatedData = [...data];
    updatedData[selectedIndex].overallFormRating[index][name] = value;
    setData(updatedData)
    setTemplateInfo(updatedData)
  }
  useEffect(() => {
  }, [selectedIndex])
  const handleUpdate = () => {
    if (performance.length > 0) {
      setData(performance)
    } else if (templates.length > 0) {
      let updatedData = templates.map((item, index) => {
        return {
          templateName: item.value,
          step: _options[0].value,
          ratingScale: item.ratingScale,
          overallFormRating: [{
            rating: 1,
            ratingLabel: '1. Ineffective',
            distribution: ""
          },
          {
            rating: 2,
            ratingLabel: '2. Somewhat Achieved',
            distribution: ""
          }, {
            rating: 3,
            ratingLabel: '3. Achieved',
            distribution: ""
          }, {
            rating: 4,
            ratingLabel: '4. Overperformed',
            distribution: ""
          }, {
            rating: 5,
            ratingLabel: '5. Outstanding',
            distribution: ""
          }]
        }
      })
      setData(updatedData)
      setTemplateInfo(updatedData)
    }
  }
  return (
    <div>
      <p className="fs-14">Select the data source for the elements you want to calibrate:</p>
      <input type={"checkbox"} id="performance" />
      <label htmlFor='performance' className='text-dark'>
        <h5 className='form-headings pl-2 mb-0'>Performance</h5>
      </label>
      <div className='ml-4'>
        <p className='fs-14'>Performance calibration includes the evaluation of performance, goals, potential, or other customer-defined elements.</p>
        <div className='col-12'>
          <p className='fs-14'>1. Select the form templates(s) that elements you want to calibrate: All fields are required.</p>
          <table className='table table-bordered table-responsive'>
            <thead className='bg bg-gray'>
              <tr className=''>
                <th style={{ width: "5%" }}></th>
                <th style={{ width: "30%" }}>
                  Template
                </th>
                <th style={{ width: "25%" }}>
                  Route map
                </th>
                <th style={{ width: "50%" }}>
                  At which routing step can the data be used?
                </th>
              </tr>
            </thead>
            <tbody>
              {
                data.map((item, index) => (
                  <tr key={index} onClick={() => setSelectedIndex(index)}>
                    {index === selectedIndex ? <td><img src={star} alt="active row" /></td> : <td></td>}
                    <td>
                      <div className="">
                        <SelectInput
                          placeholder="Please select a template..."
                          name="templateName"
                          options={templates}
                          value={item.templateName}
                        />
                      </div>
                    </td>
                    <td>
                      <p>PM2 Performance Evaluation</p>
                    </td>
                    <td>
                      <div className="">
                        <SelectInput
                          placeholder="Please select a template..."
                          name="step"
                          options={_options}
                          value={item.step}
                          onChangeText={(e) => {
                            handleChange(e, index);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <p className='fs-14'>Note: sometimes your calibration data might come from multiple templates in that case, the system only supports the elements defined in the primary template (indicated with the <img src={star} alt="star" />). <span className='text-danger'>If you select multiple Performance templates, make sure that these templates have the same structure, indexes, and route map.</span></p>
        <div className='col-12'>
          <p className='fs-14'>2. Select at least one element for calibration. Then define its distribution guideline.</p>
          <div className='row d-flex flex-column'>
            <div className='col-sm-12 col-md-3'>
              <input type={"checkbox"} id="overallFormRating" />
              <label htmlFor='overallFormRating' className='text-dark'>
                <h5 className='form-headings pl-2 mb-0'>Overall Form rating</h5>
              </label>
            </div>
            <div className='col-sm-12 col-md-9'>
              <div id="accordion">
                <div className="card">
                  <div className="card-header">
                    <a className="card-link text-dark" data-toggle="collapse" href="#distributionGuideline">
                      Set distribution guideline(optional)
                    </a>
                  </div>
                  <div id="distributionGuideline" className="collapse show ml-0" data-parent="#accordion">
                    <div className="card-body">
                      <table className='table table-responsive'>
                        <thead className='bg bg-gray'>
                          <tr className=''>
                            <th>No.</th>
                            <th style={{ width: "50%" }}>
                              Rating
                            </th>
                            <th style={{ width: "20%" }}>
                              Distribution
                            </th>
                            <th>
                              Delete
                            </th>
                            <th style={{ width: "5%" }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            data.length > 0 && data[selectedIndex].overallFormRating && data[selectedIndex].overallFormRating.length > 0 && data[selectedIndex].overallFormRating.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <div className="">
                                    <SelectInput
                                      placeholder="Please select a template..."
                                      name="rating"
                                      options={data[selectedIndex].overallFormRating}
                                      value={item.rating}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <input
                                      placeholder="Distribution"
                                      name="distribution"
                                      className='text-primary form-control'
                                      value={item.distribution}
                                      onChange={(e) => {
                                        handleChangeRating(e, index);
                                      }}
                                    />%
                                  </div>
                                </td>
                                <td>
                                  <span className='text-danger cursor-pointer' onClick={() => {
                                    let updatedData = [...data];
                                    updatedData[selectedIndex].overallFormRating.splice(index, 1)
                                    setData(updatedData)
                                  }}>X</span>
                                </td>
                                <td>{index === data[selectedIndex].overallFormRating.length - 1 && <img src={plus} alt="addMore" className='cursor-pointer' onClick={() => {
                                  let updatedData = [...data];
                                  updatedData[selectedIndex].overallFormRating.push({
                                    rating: '',
                                    ratingLabel: '',
                                    distribution: ''
                                  })
                                  setData(updatedData)
                                }} />}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuideLinesTab