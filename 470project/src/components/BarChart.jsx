import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar } from 'react-chartjs-2';

export default function BarChart({ selectedOption }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Count",
        data: [],
        backgroundColor: [
          "rgb(60, 72, 107, 0.8)",
          "rgb(244, 80, 80, 0.8)"
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
        let filteredEvents;

        switch (selectedOption) {
          case 'lastYear':
            filteredEvents = events.filter(event => {
              const eventDate = new Date(event.date);
              const currentDate = new Date();
              return eventDate.getFullYear() === currentDate.getFullYear() - 1;
            });
            // Count occurrences for each month
            const yearMonthCounts = {};
            filteredEvents.forEach(event => {
              const date = new Date(event.date);
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
                    "rgb(60, 72, 107, 0.8)",
                    "rgb(244, 80, 80, 0.8)"
                  ],
                  borderRadius: 5,
                }
              ]
            });
            break;
          case 'lastMonth':
            filteredEvents = events.filter(event => {
              const eventDate = new Date(event.date);
              const currentDate = new Date();
              const lastMonth = currentDate.getMonth() - 1; // Get month index for last month
              return eventDate.getMonth() === lastMonth;
            });
            // Count occurrences for each day
            const lastMonthCounts = {};
            filteredEvents.forEach(event => {
              const date = new Date(event.date);
              const day = date.getDate();
              if (lastMonthCounts[day]) {
                lastMonthCounts[day]++;
              } else {
                lastMonthCounts[day] = 1;
              }
            });
            // Prepare chart data for last month
            setChartData({
              labels: Object.keys(lastMonthCounts).map(day => parseInt(day)),
              datasets: [
                {
                  label: "Count",
                  data: Object.values(lastMonthCounts),
                  backgroundColor: [
                    "rgb(60, 72, 107, 0.8)",
                    "rgb(244, 80, 80, 0.8)"
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
              const date = new Date(event.date);
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
                    "rgb(60, 72, 107, 0.8)",
                    "rgb(244, 80, 80, 0.8)"
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
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
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
