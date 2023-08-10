import Chart from "react-apexcharts";

const LineChart = (props) => {
  const { series, options } = props;

  return (
    <Chart
      options={options}
      type="area"
      width="100%"
      height="80%"
      series={series}
    />
  );
};

export default LineChart;
