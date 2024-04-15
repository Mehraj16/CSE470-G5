import React from 'react';

export default function Alert({ isVisible, alertText, alertColor }) {
    const alertBanner = {
        padding: '20px',
        backgroundColor: alertColor || '#8cddaf',
        color: 'white',
        display: isVisible ? 'block' : 'none' // Set display based on isVisible prop
    };
    
    const closebtn = {
        marginLeft: '15px',
        color: 'white',
        fontWeight: 'bold',
        float: 'right',
        fontSize: '22px',
        lineHeight: '20px',
        cursor: 'pointer',
        transition: '0.3s',
    };

    function closeAlertBanner() {
        const alertBanner = document.getElementById("alertBanner");
        alertBanner.style.display = "none";
    }

    return isVisible && alertText !== "" && (
        <div id="alertBanner" style={alertBanner}>
            <span style={closebtn} onClick={closeAlertBanner}>&times;</span>
            {alertText}
        </div>
    );
}
