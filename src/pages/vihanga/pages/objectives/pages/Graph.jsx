import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useGetPrediction } from "pages/Goals/hooks/useGetAuditHistory";
import useGetAuditHistory from "pages/Objectives/hooks/useGetAuditHistory";

const BellCurveChart = ({ okrdetails }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const krId = urlParams.get("keyResultId");

  // Prepare request body for prediction
  const requestBody = {
    createdAt: window
      .moment(okrdetails?.createdAt)
      .format("YYYY-MM-DDTHH:mm:ss"),
    updatedAt: window
      .moment(okrdetails?.updatedAt)
      .format("YYYY-MM-DDTHH:mm:ss"),
    progress: parseFloat(okrdetails?.percent),
    targetDate: window
      .moment(okrdetails?.targetDate)
      .format("YYYY-MM-DDTHH:mm:ss"),
  };

  // Fetch audit history data
  const { data: auditHistory = [] } = useGetAuditHistory(krId);

  // Fetch prediction data
  const {
    data: probabilityData,
    isLoading,
    isError,
    error,
  } = useGetPrediction(requestBody);

  // Process data for the chart
  const processChartData = () => {
    // Process target/actual data from auditHistory
    const labels =
      auditHistory?.length > 0
        ? auditHistory.map((item) =>
            window.moment(item.updatedAt).format("DD/MM")
          )
        : [];

    const targets =
      auditHistory.length > 0
        ? auditHistory.map((item) => item.dataDocument?.target || 0)
        : [];

    const actuals =
      auditHistory.length > 0
        ? auditHistory.map((item) => item.dataDocument?.actual || 0)
        : [];

    // Format the data correctly for the chart
    const bellCurveData = actuals.map((value, index) => ({
      name: labels[index] || `Point ${index + 1}`,
      value: Number(value) || 0, // Ensure it's a number
    }));

    return { bellCurveData, labels, targets, actuals };
  };

  const { bellCurveData } = processChartData();

  const CustomDot = ({ cx, cy, payload, index }) => {
    if ([1, 3, 5].includes(index)) {
      return (
        <g>
          <circle cx={cx} cy={cy} r={5} fill="#444" />
          <text
            x={cx}
            y={cy - 25}
            textAnchor="middle"
            fontSize={14}
            fontWeight={600}
            fill="#908a55"
          >
            {payload.name}
          </text>
          <text
            x={cx}
            y={cy - 10}
            textAnchor="middle"
            fontSize={10}
            fill="#888"
          >
            {index === 1 ? "At Lower" : index === 3 ? "At Average" : "At Upper"}
          </text>
        </g>
      );
    }
    return null;
  };

  return (
    <div className="relative bg-white rounded-[20px] shadow-md p-2">
      {isLoading && <p className="text-center">Loading...</p>}
      {isError && (
        <p className="text-center text-red-500">
          Error: {error?.message || "Unknown error"}
        </p>
      )}

      {/* Bell Curve Chart */}
      {!isLoading && !isError && bellCurveData.length > 0 && (
        <div style={{ height: 300 }}>
          <ResponsiveContainer>
            <AreaChart
              data={bellCurveData}
              margin={{ top: 40, right: 30, left: 30, bottom: 30 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#908a55" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#908a55" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                horizontal
                vertical={false}
                stroke="#bba77b"
                strokeWidth={1}
                strokeOpacity={0.4}
              />

              <XAxis
                axisLine={false}
                tickLine={false}
                tick={false}
                padding={{ left: 0, right: 0 }}
              />
              <YAxis
                domain={[0, 120]}
                axisLine={false}
                tickLine={false}
                tick={false}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#908a55"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorValue)"
                dot={<CustomDot />}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {!isLoading && !isError && bellCurveData.length === 0 && (
        <p className="text-center text-gray-500">No curve data available</p>
      )}
    </div>
  );
};

export default BellCurveChart;
