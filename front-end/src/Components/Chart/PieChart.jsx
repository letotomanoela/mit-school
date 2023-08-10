import Chart from "react-apexcharts";

const PieChart = (props) => {
  const { series, options } = props;

  return (
    <Chart
      options={options}
      type="pie"
      width="90%"
      height="90%"
      series={series}
    />
  );
};

export default PieChart;
