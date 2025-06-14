import useWindowSize from "components/UseWindowSize";
import React from "react";
import { countries } from "utilities";
import "./styles.scss";

export default function TextInput({
  label = "",
  text,
  placeholder = "",
  style,
  name = "",
  dateType,
  value = "",
  onChangeText,
  index,
  isCountry,
  countryCode = "+91",
  onChangeCountry,
  readonly,
  labelStyle,
  inputStyle,
  stackLabel=false, // New prop to control layout
  ...rest
}) {
  const isMobile = useWindowSize();
  console.log(stackLabel)
  return (
    <div className={`${stackLabel ? 'd-flex flex-column' : 'd-flex justify-content-between align-items-center'}`}>
      {label && (
        <label className={`label fs13 ${stackLabel ? 'mb-1' : isMobile ? 'col-md-4 p-0' : `col-md-4 ${labelStyle}`}`}>
          {label}
        </label>
      )}
      
      <div className={`d-flex ${stackLabel ? 'w-100' : 'col-md-8'} ${isMobile ? 'col-xs-12 col-sm-12' : ''} ${isMobile && !stackLabel ? 'm-0 p-0' : 'ml-2'} ${inputStyle}`}>
        {isCountry && (
          <select
            className={`form-control ${stackLabel ? 'col-md-3' : 'col-md-4'} rightRadius ${isMobile ? 'p-0' : ''}`}
            defaultValue={countryCode}
            value={countryCode}
            onChange={onChangeCountry}
          >
            {countries.map((country, index) => (
              <option value={country.code} key={index}>
                {country.code}
              </option>
            ))}
          </select>
        )}
        
        {readonly ? (
          <input
            type={text ? text : dateType}
            className={`form-control rounded ${isCountry ? "leftradius" : ""}`}
            index={index}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChangeText}
            readOnly
            {...rest}
          />
        ) : (
          <input
            type={text ? text : dateType}
            className={`form-control rounded ${isCountry ? "leftradius" : ""}`}
            placeholder={placeholder}
            name={name}
            value={value}
            index={index}
            onChange={onChangeText}
            {...rest}
          />
        )}
      </div>
    </div>
  );
}