import React, { useState, useEffect } from 'react';
import leaderboard from '../css/leaderboard.module.css'

export default function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
      // Simulated leaderboard data, replace this with actual data fetching logic
      const fetchData = async () => {
        // Fetch leaderboard data from an API or some data source
        const response = await fetch('/public/lead.json');
        const data = await response.json();
        // Assuming data is an array of objects with 'name' and 'score' properties
        setLeaderboardData(data);
      };
  
      fetchData();
    }, []);
    const currentDate = new Date();
  // Get the month of the current date
  const currentMonth = currentDate.getMonth();
  const lastMonth = new Date(currentDate.getFullYear(), currentMonth - 1).toLocaleDateString('default', { month: 'long' });
    return (
      <div className={leaderboard.leaderboard}>
        <h2>Top 10 Leaderboard</h2>
        <div className={leaderboard.leadBox}>
            <div className={leaderboard.Win}>
                <div><p>Winners of {lastMonth}</p></div>
                <div className={leaderboard.pastWin}>
                    <div><img src="src/assets/logo.png" alt="" />
                    <div className={leaderboard.numberStylized}><span><img src="src/assets/8.png" alt="2nd" /></span></div>
                    </div>
                    <div><img src="src/assets/logo.png" alt="" />
                    <div className={leaderboard.numberStylized}><span><img src="src/assets/7.png" alt="1st" /></span></div>
                    </div>
                    <div className={leaderboard.image3}><img src="src/assets/logo.png" alt="" />
                    <div className={leaderboard.numberStylized}><span><img src="src/assets/9.png" alt="3rd" /></span></div>
                    </div>
                </div>
            </div>
            <div className={leaderboard.topTen}>
                <ol>
                <li className={leaderboard.tableHeader}>
                    <span className={leaderboard.playerName}>Name</span>
                    <span className={leaderboard.playerScore}>Score</span>
                </li>{leaderboardData.slice(0, 10).map((player, index) => (
                <li key={index}>
                <div className={leaderboard.nameImg}>
                    <img src="../assets/logo.png" alt="" />
                    <span className={leaderboard.playerName}>{player.name}</span>
                </div>
                <span className={leaderboard.playerScore}>{player.score}</span>
                </li>
            ))}
            </ol>
            </div>
        </div>
      </div>
    );
  };
