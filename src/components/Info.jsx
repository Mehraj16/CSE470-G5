import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BarChart from './BarChart';
import { IoArrowForwardCircle } from "react-icons/io5";
import '../css/info.css';

export default function Info(props) {
    const [selectedOption, setSelectedOption] = useState('lastYear');
    const [invitations, setInvitations] = useState(0);

    const handleSelectChange = async (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
    };
    const navigation = useNavigate();
    const showInvites = () => {
        navigation('../invites', { state: props });
    };
    const showMyEvents = () => {
        navigation('../myevents', { state: props });
    };
    useEffect(() => {
        const fetchpartData = async () => {
            let url = 'http://127.0.0.1:8000/api/invitations/';
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
                if (responseBody && responseBody.length > 0) {
                    const filteredEvents = responseBody.filter(event => event.id === props.data.id);
                    setInvitations(filteredEvents.length)
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
            fetchpartData();
    }, []);
    return (
        <div className="dashboard">
            <div className="welcomeText">
                <p>Welcome, {props.data.firstName}</p>
            </div>
            <div className="dashEvent">
                <div className="totalEvents">
                    <p className='upcoming'>Upcoming Events</p>
                    <p className='total'>{props.totalEvents}</p>
                </div>
                <div className='invitation' style={{ paddingRight: '20px' }}>
                    <div>
                        <p className='upcoming'>Invitation Pending</p><IoArrowForwardCircle className='showInvite' onClick={showInvites} />
                    </div>
                    <p className='total'>{invitations}</p>
                </div>
                <div className="eventDetail">
                    <div className="eventRoster">
                        <p>Event Roster</p>
                        <button className='detailbtn' onClick={showMyEvents}>Details</button>
                    </div>
                    <p>{props.nearestEvent.event_date} {props.info.time}</p>
                    <p>{props.info.location}</p>
                </div>
            </div>
            <div className='analytic'>
                <div className='history'>
                    <p style={{ margin: 0 }}>History</p>
                    <select value={selectedOption} onChange={handleSelectChange}>
                        <option value="lastYear">Last Year</option>
                        <option value="lastMonth">Last Month</option>
                        <option value="allTime">All Time</option>
                    </select>
                </div>
                <BarChart selectedOption={selectedOption} />
            </div>
        </div>
    );
}
