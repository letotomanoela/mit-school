import React, { useState, useEffect } from "react";

const BarChart = ({ chartData, chartOptions,h }) => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    setData(chartData);
    setOptions(chartOptions);
  }, [chartData, chartOptions]);

  return (
    <>hello chart</>
  );
};

export default BarChart;
