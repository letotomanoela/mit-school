import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const BarChart = ({ chartData, chartOptions,h }) => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    setData(chartData);
    setOptions(chartOptions);
  }, [chartData, chartOptions]);

  return (
    <Chart
      options={options}
      series={data}
      type="bar"
      width="100%"
      height={h ? "93%":"88%"}
    />
  );
};

export default BarChart;
