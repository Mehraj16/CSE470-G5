import React, { useState, useEffect } from 'react';
import leaderboard from '../css/leaderboard.module.css'
import Confetti from 'react-confetti';
export default function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [isCelebrating, setIsCelebrating] = useState(false);
    const [nowMVV, setnowMVV] = useState([]);
    const [img, setImg] = useState();
    useEffect(() => {
      let hasSeenConfetti = false; 
      if (!hasSeenConfetti) {
        setIsCelebrating(true);
        hasSeenConfetti = true;
        setTimeout(() => {
          setIsCelebrating(false);
        }, 3000); 
      }
    }, []);
    useEffect(() => {

      const fetchnowMVVData = async () => {
        let url = `http://127.0.0.1:8000/api/mvv/`;
          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          const responseBody = await response.json();
              if (!response.ok) {
                      throw new Error('Failed request');
                  }
                console.log(responseBody[0]);
                setnowMVV(responseBody);
          } catch (error) {
                  console.error('Error:', error);
          }  
      };
  
      fetchnowMVVData();
    }, []);

    useEffect(() => {

      const fetchData = async () => {
        let url = `http://127.0.0.1:8000/api/leaderboard/`;
          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          const responseBody = await response.json();
              if (!response.ok) {
                      console.error('Failed request:', responseBody); 
                      throw new Error('Failed request');
                  }
                setLeaderboardData(responseBody);
          } catch (error) {
                  console.error('Error:', error);
          }  
      };
  
      fetchData();
    }, []);

    useEffect(() => {
      if (nowMVV && nowMVV.length === 1) {
        fetchImageData();
      }
    }, [nowMVV]);
    const fetchImageData = async () => {
      let url = `http://127.0.0.1:8000/api/images/${nowMVV[0].id}`;
        try {
          const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
            const imageBlob = await res.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);
            setImg(imageObjectURL);
            } catch (error) {
                console.error('Error:', error);
            }  
    };
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const lastMonth = new Date(currentDate.getFullYear(), currentMonth - 1).toLocaleDateString('default', { month: 'long' });
    return (
      <div className={leaderboard.leaderboard}>
        <h2>Top 10 Leaderboard</h2>
        <div className={leaderboard.leadBox}>
            <div className={leaderboard.Win}>
            {isCelebrating && <Confetti
                className="confetti"
                width={500}
                numberOfPieces={150}
                gravity={0.5}
            />}
                <div><p>Winners of {lastMonth}</p></div>
                <div className={leaderboard.pastWin}>
                    {nowMVV && nowMVV.length < 2 ? (
                        <div>
                             <p style={{fontWeight: 300, fontSize:'22px'}}> {nowMVV && nowMVV.length === 1 && `${nowMVV[0].firstName} ${nowMVV[0].lastName}`}</p>
                            <img src={img} alt="" />
                            <div className={leaderboard.numberStylized}>
                                <span><img src="src/assets/7.png" alt="1st" /></span>
                            </div>
                        </div>
                    ) : (
                        nowMVV.map((item, index) => (
                            <span key={index}>{item.name}</span>
                        ))
                    )}
                </div>
            </div>
            <div className={leaderboard.topTen}>
                <ol>
                <li className={leaderboard.tableHeader}>
                    <span className={leaderboard.playerName}>Name</span>
                    <span className={leaderboard.playerScore}>Score</span>
                </li>{leaderboardData.slice(0, 10).map((player, index) => (
                <li key={index}>
                  <span className={leaderboard.playerName}>{player.volunteerfirstName}</span>
                  <span className={leaderboard.playerScore}>{player.monthly_score}</span>
                </li>
            ))}
            </ol>
            </div>
        </div>
      </div>
    );
  };
