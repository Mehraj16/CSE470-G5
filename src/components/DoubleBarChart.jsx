import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import chartcss from '../css/chart.module.css'

const DoubleBarChart = ({ userdata, admindata }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Admins",
        data: [],
        backgroundColor: "rgb(244, 80, 80, 0.8)", // Red color
      },
      {
        label: "Volunteers",
        data: [],
        backgroundColor: "rgb(60, 72, 107, 0.8)", // Blue color
      },
    ]
  });

  useEffect(() => {
    const monthCounts = {};

    // Count months for admins
    for (const key in admindata) {
      const item = admindata[key];
      const date = new Date(item.AccountCreationDate);
      const month = date.toLocaleString('en-US', { month: 'long' });
      if (monthCounts[month]) {
        monthCounts[month].admins = (monthCounts[month].admins || 0) + 1;
      } else {
        monthCounts[month] = { admins: 1 };
      }
    }

    // Count months for volunteers
    for (const key in userdata) {
      const item = userdata[key];
      const date = new Date(item.AccountCreationDate);
      const month = date.toLocaleString('en-US', { month: 'long' });
      if (monthCounts[month]) {
        monthCounts[month].volunteers = (monthCounts[month].volunteers || 0) + 1;
      } else {
        monthCounts[month] = { volunteers: 1 };
      }
    }

    // Extract labels and data from monthCounts
    const labels = Object.keys(monthCounts);
    const adminData = labels.map(month => monthCounts[month].admins || 0);
    const volunteerData = labels.map(month => monthCounts[month].volunteers || 0);

    // Set chart data
    setChartData(prevChartData => ({
      ...prevChartData,
      labels: labels,
      datasets: [
        {
          ...prevChartData.datasets[0],
          data: adminData,
        },
        {
          ...prevChartData.datasets[1],
          data: volunteerData,
        }
      ]
    }));
  }, [admindata, userdata]);


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
