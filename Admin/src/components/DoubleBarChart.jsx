import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import chartcss from '../css/chart.module.css'

const DoubleBarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Admins",
        data: [],
        backgroundColor: "rgb(244, 80, 80, 0.8)", // Blue color
      },
      {
        label: "Volunteers",
        data: [],
        backgroundColor: "rgb(60, 72, 107, 0.8)", // Red color
      },
    ]
  });

  useEffect(() => {
    // Mock data for admins and volunteers for each month of a year
    const mockData = {
      "January": { admins: 5, volunteers: 10 },
      "February": { admins: 8, volunteers: 15 },
      "March": { admins: 10, volunteers: 12 },
      "April": { admins: 6, volunteers: 14 },
      "May": { admins: 9, volunteers: 11 },
      "June": { admins: 7, volunteers: 13 },
      "July": { admins: 11, volunteers: 9 },
      "August": { admins: 8, volunteers: 12 },
      "September": { admins: 10, volunteers: 10 },
      "October": { admins: 12, volunteers: 8 },
      "November": { admins: 9, volunteers: 11 },
      "December": { admins: 7, volunteers: 13 }
    };

    // Extract labels and data from mock data
    const labels = Object.keys(mockData);
    const adminData = labels.map(date => mockData[date].admins);
    const volunteerData = labels.map(date => mockData[date].volunteers);

    // Update chart data state
    setChartData({
      labels: labels,
      datasets: [
        {
          ...chartData.datasets[0],
          data: adminData,
        },
        {
          ...chartData.datasets[1],
          data: volunteerData,
        }
      ]
    });
  }, []);

  return (
    <div className={chartcss.container}>
      <h3>Total Members in the Past Year</h3>
      <Bar
        data={chartData}
        options={{
          scales: {
            x: {
              stacked: true,
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              stacked: true,
              title: {
                display: true,
                text: 'Number of Events'
              },
              ticks: {
                stepSize: 1
              }
            }
          }
        }}
      />
    </div>
  );
};

export default DoubleBarChart;
