import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, defaults } from "chart.js/auto";
import chartcss from '../css/chart.module.css'

export default function LineChart({ selectedOption='lastYear', myevents, allevents }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Your Events",
        data: [],
        borderColor:'rgb(60, 72, 107, 1)',
        backgroundColor: 'rgb(60, 72, 107, 1)',
        pointBackgroundColor: 'rgb(60, 72, 107, 1)',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: "All Events",
        data: [],
        borderColor:'rgb(244, 80, 80, 1)', 
        backgroundColor: 'rgb(244, 80, 80, 1)', 
        pointBackgroundColor: 'rgb(244, 80, 80, 1)', 
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  });
  useEffect(() => {
    const monthCounts = {};
    console.log(allevents)
    // Count months for admins
    for (const key in myevents) {
      const item = myevents[key];
      const date = new Date(item.date);
      const month = date.toLocaleString('en-US', { month: 'long' });
      if (monthCounts[month]) {
        monthCounts[month].admins = (monthCounts[month].admins || 0) + 1;
      } else {
        monthCounts[month] = { admins: 1 };
      }
    }

    // Count months for volunteers
    for (const key in allevents) {
      const item = allevents[key];
      const date = new Date(item.date);
      const month = date.toLocaleString('en-US', { month: 'long' });
      if (monthCounts[month]) {
        monthCounts[month].others = (monthCounts[month].others || 0) + 1;
      } else {
        monthCounts[month] = { others: 1 };
      }
    }
    console.log(monthCounts)
    // Extract labels and data from monthCounts
    const labels = Object.keys(monthCounts);
    const adminData = labels.map(month => monthCounts[month].admins || 0);
    const allData = labels.map(month => monthCounts[month].others || 0);

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
          data: allData,
        }
      ]
    }));
  }, [myevents, allevents]);
  // useEffect(() => {
  //   // Mock data for events
  //   const mockData = generateMockDataForYear();

  //   // Extract labels and data from mock data
  //   const labels = Object.keys(mockData);
  //   const yourEventsData = labels.map(month => mockData[month].yourEvents);
  //   const allEventsData = labels.map(month => mockData[month].allEvents);

  //   // Update chart data state
  //   setChartData(prevState => ({
  //     ...prevState,
  //     labels: labels,
  //     datasets: [
  //       {
  //         ...prevState.datasets[0],
  //         data: yourEventsData,
  //       },
  //       {
  //         ...prevState.datasets[1],
  //         data: allEventsData,
  //       }
  //     ]
  //   }));
  // }, []);

  // // Function to generate mock data for events for 12 months
  // const generateMockDataForYear = () => {
  //   const months = [
  //     "January", "February", "March", "April", "May", "June",
  //     "July", "August", "September", "October", "November", "December"
  //   ];
  //   const mockData = {};
  //   for (let i = 0; i < months.length; i++) {
  //     const yourEvents = Math.floor(Math.random() * 20); // Random number of events for each month
  //     const allEvents = Math.floor(Math.random() * 30); // Random number of events for each month
  //     mockData[months[i]] = { yourEvents, allEvents };
  //   }
  //   return mockData;
  // };

  return (
    <div className={chartcss.container5}>
       <h3 >Your Organised Events</h3>
      <div className={chartcss.container2}>
      <Line
        data={{
          labels: chartData.labels,
          datasets: chartData.datasets
        }}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: (() => {
                  switch (selectedOption) {
                    case 'lastYear':
                      return 'Months';
                    case 'lastMonth':
                      return 'Days';
                    case 'allTime':
                      return 'Years';
                    default:
                      return '';
                  }
                })()
              }
            },
            y: {
              ticks: {
                stepSize: 1
              },
              title: {
                display: true,
                text: 'Number of Events'
              }
            }
          }
        }}
      />
    </div>
    </div>
  );
}
