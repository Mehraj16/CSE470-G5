import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar } from 'react-chartjs-2';

export default function BarChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Count",
        data: [],
        backgroundColor: [
          "rgba(43, 63, 229, 0.8)",
          "rgba(250, 192, 19, 0.8)",
          "rgba(253, 135, 135, 0.8)",
        ],
        borderRadius: 5,
      }
    ]
  });

  useEffect(() => {
    fetch('/history.json')
      .then(response => response.json())
      .then(data => {
        const events = data.eventsVolunteered;
        const monthCounts = {};
        events.forEach(event => {
          const date = new Date(event.date);
          const month = date.toLocaleString('default', { month: 'long' });
          if (monthCounts[month]) {
            monthCounts[month]++;
          } else {
            monthCounts[month] = 1;
          }
        });

        const labels = Object.keys(monthCounts);
        const chartDataValues = Object.values(monthCounts);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Count",
              data: chartDataValues,
              backgroundColor: [
                "rgba(43, 63, 229, 0.8)",
                "rgba(250, 192, 19, 0.8)",
                "rgba(253, 135, 135, 0.8)",
              ],
              borderRadius: 5,
            }
          ]
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <Bar
        data={chartData}
      />
    </div>
  );
}

// import { Chart as ChartJS, defaults } from "chart.js/auto";
// import React, { useState, useEffect } from 'react';
// import { Bar } from 'react-chartjs-2';

// export default function BarChart(selectedMode) {
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [
//       {
//         label: "Count",
//         data: [],
//         backgroundColor: [
//           '#ebebd3'
//         ],
//         borderRadius: 5,
//       }
//     ]
//   });
//   console.log(selectedMode);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('/history.json');
//         const data = await response.json();
//         const events = data.eventsVolunteered;

//         let processedData;
//         if (selectedMode === 'lastMonth') {
//           processedData = processDataForLastMonth(events);
//         } else if (selectedMode === 'lastYear') {
//           processedData = processDataForLastYear(events);
//         } else if (selectedMode === 'allTime') {
//           processedData = processDataForAllTime(events);
//         }

//         setChartData(processedData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, [selectedMode]);
  
//   const processDataForLastMonth = (events) => {
//     const currentDate = new Date();
//     const lastMonthEvents = events.filter(event => {
//       const eventDate = new Date(event.date);
//       return eventDate.getMonth() === currentDate.getMonth() - 1 && eventDate.getFullYear() === currentDate.getFullYear();
//     });
  
//     const dateCounts = {};
//     lastMonthEvents.forEach(event => {
//       const eventDate = new Date(event.date);
//       const dateString = eventDate.toISOString().split('T')[0]; // Extracting date in YYYY-MM-DD format
//       if (dateCounts[dateString]) {
//         dateCounts[dateString]++;
//       } else {
//         dateCounts[dateString] = 1;
//       }
//     });
  
//     const labels = Object.keys(dateCounts);
//     const chartDataValues = Object.values(dateCounts);
  
//     return {
//       labels: labels,
//       datasets: [
//         {
//           label: "Events Volunteered in Last Month",
//           data: chartDataValues,
//           backgroundColor: [
//             '#ebebd3'
//           ],
//           borderRadius: 5,
//         }
//       ]
//     };
//   };
  

//   const processDataForLastYear = (events) => {
//     const currentDate = new Date();
//     const lastYearEvents = events.filter(event => {
//       const eventDate = new Date(event.date);
//       return eventDate.getFullYear() === currentDate.getFullYear() - 1;
//     });

//     const monthCounts = {};
//     lastYearEvents.forEach(event => {
//       const date = new Date(event.date);
//       const month = date.toLocaleString('default', { month: 'long' });
//       if (monthCounts[month]) {
//         monthCounts[month]++;
//       } else {
//         monthCounts[month] = 1;
//       }
//     });
//     const labels = Object.keys(monthCounts);
//     const chartDataValues = Object.values(monthCounts);

//     return {
//       labels: labels,
//       datasets: [
//         {
//           label: "Events Volunteered in last Year",
//           data: chartDataValues,
//           backgroundColor: [
//             '#ebebd3'
//           ],
//           borderRadius: 5,
//         }
//       ]
//     };
//   };

//   const processDataForAllTime = (events) => {
//     const yearCounts = {};
//     events.forEach(event => {
//       const date = new Date(event.date);
//       const year = date.getFullYear();
//       if (yearCounts[year]) {
//         yearCounts[year]++;
//       } else {
//         yearCounts[year] = 1;
//       }
//     });

//     const labels = Object.keys(yearCounts);
//     const chartDataValues = Object.values(yearCounts);

//     return {
//       labels: labels,
//       datasets: [
//         {
//           label: "Events Volunteered all time",
//           data: chartDataValues,
//           backgroundColor: [
//             '#ebebd3'
//           ],
//           borderRadius: 5,
//         }
//       ]
//     };
//   };

//   return (
//     <div style={{ minHeight: '250px', display: 'flex', justifyContent: 'space-evenly' }}>
//       <Bar
//         data={chartData}
//       />
//     </div>
//   );
// }
