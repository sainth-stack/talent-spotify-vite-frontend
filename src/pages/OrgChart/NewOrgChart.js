import React from 'react';
import { OrgChart } from 'd3-org-chart';
import Button from "components/Company/Button";

class OrgChartComponent extends React.Component {
  constructor(props) {
    super(props);
    this.createDiagram = this.createDiagram.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.handleCollapseAll = this.handleCollapseAll.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
  }

  componentDidMount() {
    this.createDiagram();
  }

  componentDidUpdate() {
    this.createDiagram();
  }

  handleExpandAll() {
    if (this.chart) {
      this.chart.expandAll();
    }
  }

  handleCollapseAll() {
    if (this.chart) {
      this.chart.collapseAll();
    }
  }

  handlePrint() {
    // Wait for a short delay to allow the org chart to fully render
    window.setTimeout(() => {
      window.print();
    }, 500); // Adjust the delay time as needed
  }

  render() {
    return (
      <div>
        <div className='d-flex justify-content-end non-printable'>
          <Button
            text="Expand All"
            className="bg-green border text-white"
            onClick={this.handleExpandAll} />
          <Button
            text="Collapse All"
            className="bg-green border text-white"
            onClick={this.handleCollapseAll} />
          <Button
            text="Print"
            className="bg-green border text-white"
            onClick={this.handlePrint}
          />
        </div>
        <div ref={(node) => (this.node = node)} />
      </div>
    );
  }

  createDiagram() {
    const node = this.node;
    if (!this.props.data) {
      return;
    }
    if (!this.chart) {
      this.chart = new OrgChart();
    }
    this.chart
      .container(node)
      .data(this.props.data)
      .svgWidth(400)
      .initialZoom(0.6)
      .onNodeClick((d) => console.log(d + ' node clicked'))
      .nodeWidth((d) => 250)
      .nodeHeight((d) => 175)
      .childrenMargin((d) => 40)
      .compactMarginBetween((d) => 35)
      .compactMarginPair((d) => 100)
      .nodeContent((d, i, arr, state) => {
        return `
          <div style="padding-top:30px;background-color:none;margin-left:1px;height:${d.height}px;border-radius:2px;overflow:visible">
            <div style="height:${d.height - 32}px;padding-top:0px;background-border-radius:10px">
              <img src="${d.data.nodeImage}" style="margin-top:-60px;margin-left:${d.width / 2 - 30}px;border-radius:100px;width:60px;height:60px;" />
              <div style="padding:20px; padding-top:25px;text-align:center">
                <div style="color:white;font-size:11px;font-weight:bold">${d.data.name}</div>
                <div style="color:white;font-size:11px;margin-top:4px">${d.data.positionName}</div>
              </div>
              <div style="text-align:center;color:white;padding-left:15px;padding-right:15px;">
                <div style="text-center">${d.data.directSubordinates} Direct/ ${d.data.totalSubordinates} Subordinates</div>
              </div>
            </div>
          </div>
        `;
      })
      .render();
  }
}

export default OrgChartComponent;
