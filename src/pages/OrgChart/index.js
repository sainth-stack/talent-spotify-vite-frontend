import React from 'react';
import "./styles.scss"
import Chart from './Chart';

export default function OrgChart() {
  return (
    <div className='bg-light-primary rounded p-4'>
      <h1 className='orgTitle'>OrgChart</h1>
      <div className='org-bg'>
        <Chart />
      </div>
    </div>
  );
}
