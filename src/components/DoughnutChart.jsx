import React, { useRef, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, defaults } from "chart.js/auto";
import chartcss from '../css/chart.module.css'

const DoughnutChart = () => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  // Sample data
  const data = {
    labels: ['Volunteers', 'Admins'],
    datasets: [{
      data: [70, 30], // Sample data percentages
      backgroundColor: [
        "rgb(60, 72, 107, 0.8)",
        "rgb(244, 80, 80, 0.8)"
      ],
    }]
  };

  // Configuration options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Volunteers vs Admins'
    }
  };

  useEffect(() => {
    if (chartInstance) {
      // Destroy the previous chart instance
      chartInstance.destroy();
    }

    // Create a new chart instance if chartRef is initialized
    if (chartRef.current) {
      const newChartInstance = chartRef.current.chartInstance;
      setChartInstance(newChartInstance);
    }
  }, [chartInstance]);

  return (
    <div className={chartcss.container3}>
      <h3>Number of Volunteers vs. Admins</h3>
      <Doughnut ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
