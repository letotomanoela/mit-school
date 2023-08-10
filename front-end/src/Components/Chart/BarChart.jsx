import React, { useState, useEffect } from "react";

const BarChart = ({ chartData, chartOptions,h }) => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    setData(chartData);
    setOptions(chartOptions);
  }, [chartData, chartOptions]);

  return (
    <div>hello chart<div/>
  );
};

export default BarChart;
