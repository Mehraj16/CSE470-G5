import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar } from 'react-chartjs-2';

export default function BarChart({ selectedOption }) {
  const mvv = localStorage.getItem('mvv');
  let bar1 = '#3C486B';
  let bar2 = '#F45050';
  if(mvv){
     bar1 = '#74c091';
  }
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Count",
        data: [],
        backgroundColor: [
          bar1,
          bar2
        ],
        borderRadius: 5,
      }
    ]
  });

  useEffect(() => {
    const fetchpartData = async () => {
    let url = 'http://127.0.0.1:8000/api/events-volunteered/';
    try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });
      const responseBody = await response.json(); // Read response body

      if (!response.ok) {
          console.error('Failed request:', responseBody); // Log error and response body
          throw new Error('Failed request');
      }
        const events = responseBody;
        let filteredEvents;
        console.log(events);
        switch (selectedOption) {
          case 'lastYear':
            filteredEvents = events.filter(event => {
              const eventDate = new Date(event.event_date);
              const currentDate = new Date();
              return eventDate.getFullYear() === currentDate.getFullYear() - 1;
            });
            // Count occurrences for each month
            const yearMonthCounts = {};
            filteredEvents.forEach(event => {
              const date = new Date(event.event_date);
              const month = date.toLocaleString('default', { month: 'long' });
              if (yearMonthCounts[month]) {
                yearMonthCounts[month]++;
              } else {
                yearMonthCounts[month] = 1;
              }
            });
            // Prepare chart data for last year
            setChartData({
              labels: Object.keys(yearMonthCounts),
              datasets: [
                {
                  label: "Count",
                  data: Object.values(yearMonthCounts),
                  backgroundColor: [
                    bar1,
                    bar2
                  ],
                  borderRadius: 5,
                }
              ]
            });
            break;
            case 'lastMonth':
              filteredEvents = events.filter(event => {
                const eventDate = new Date(event.event_date);
                const currentDate = new Date();
                const lastMonth = currentDate.getMonth() - 1; // Get month index for last month
                return eventDate.getMonth() === lastMonth;
              });
            
              // Count occurrences for each day
              const lastMonthCounts = {};
              filteredEvents.forEach(event => {
                const date = new Date(event.event_date);
                const day = date.getDate();
                const monthAbbreviation = date.toLocaleString('default', { month: 'short' }); // Get month abbreviation
                const formattedDate = `${day} ${monthAbbreviation}`;
                if (lastMonthCounts[formattedDate]) {
                  lastMonthCounts[formattedDate]++;
                } else {
                  lastMonthCounts[formattedDate] = 1;
                }
              });
            
              // Prepare chart data for last month
              setChartData({
                labels: Object.keys(lastMonthCounts),
                datasets: [
                  {
                    label: "Count",
                    data: Object.values(lastMonthCounts),
                    backgroundColor: [
                      bar1,
                      bar2
                    ],
                    borderRadius: 5,
                  }
                ]
              });
              break;
            
          case 'allTime':
            filteredEvents = events;
            // Count occurrences for each year
            const yearCounts = {};
            filteredEvents.forEach(event => {
              const date = new Date(event.event_date);
              const year = date.getFullYear();
              if (yearCounts[year]) {
                yearCounts[year]++;
              } else {
                yearCounts[year] = 1;
              }
            });
            // Prepare chart data for all time
            setChartData({
              labels: Object.keys(yearCounts),
              datasets: [
                {
                  label: "Count",
                  data: Object.values(yearCounts),
                  backgroundColor: [
                    bar1,
                    bar2
                  ],
                  borderRadius: 5,
                }
              ]
            });
            break;
          default:
            filteredEvents = events;
            break;
        }
      } catch (error) {
        console.error('Error:', error);
    }
};
fetchpartData();
  }, [selectedOption]);

  return (
    <div>
      <Bar
        data={chartData}
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
                text: 'Number of Volunteered Events'
              }
            }
          }
        }}
      />
    </div>
  );
}
