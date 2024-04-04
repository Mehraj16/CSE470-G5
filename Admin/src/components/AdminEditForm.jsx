import React, { useState } from 'react'

function DeleteAccountPopup({ onCancel, onConfirm }) {
    return (
      <div className="popup">
        <div className="popup-inner">
          <h3>Are you sure?</h3>
          <p>Deleting the account will permanently erase all your data. You will not be able to retrieve any data after.</p>
          <div className="btn-group">
            <button onClick={onCancel}>Cancel</button>
            <button onClick={onConfirm}>Confirm</button>
          </div>
        </div>
      </div>
    );
  }

function ChangePasswordPopup({ onClose }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleChange = () => {
        // Add your logic here to handle password change
        // You can send oldPassword and newPassword to your backend for validation and update

        // After password change, close the popup
        onClose();
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <button className="close-btn" onClick={onClose}>X</button>
                <h3>Change Password</h3>
                <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button className="change-btn"onClick={handleChange}>Change Password</button>
            </div>
        </div>
    );
}

export default function EditForm({ enableInputs, inputsEnabled, formData, handleInputChange, cancelInputs}) {
     const handleChange = (field, e) => {
        handleInputChange(field, e.target.value);
      };

    const [showPopup, setShowPopup] = useState(false);

    const handlePopupToggle = () => {
        setShowPopup(!showPopup);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const [showDeletePopup, setShowDeletePopup] = useState(false);

    const handleDeleteButtonClick = () => {
        setShowDeletePopup(true);
    };

    const handleCancelDelete = () => {
        setShowDeletePopup(false);
    };

    const handleConfirmDelete = () => {
        // Add logic to delete the account here
        // You can make an API call or perform any other action

        // After deletion, close the popup
        setShowDeletePopup(false);
    };
  return (
    <div className='all-details'>
        <h3 className='settings-headers'>Profile</h3>
      <div className='btn'><button onClick={enableInputs}>Edit Profile</button></div>  
      <div className='profile-details'>
        <form>
            <div className='inputs'>
                <div>
                    <label htmlFor="first_name">First Name:</label><br />
                    <input type="text" id="first_name" name="first_name" value={formData.firstName} onChange={(e) => handleChange('firstName', e)}  disabled={!inputsEnabled} /><br /><br />
                </div>

                <div>
                <label htmlFor="last_name">Last Name:</label><br />
                <input type="text" id="last_name" name="last_name" value={formData.lastName} onChange={(e) => handleChange('lastName', e)} disabled={!inputsEnabled} /><br /><br />
                </div>
            </div>
            <div className='inputs'>
                <div>
                    <label htmlFor="dob">Date of Birth:</label><br />
                    <input type="date"  className='date-input' id="dob" name="dob" value={formData.dob} onChange={(e) => handleChange('dob', e)} disabled={!inputsEnabled} /><br /><br />
                </div>
                <div>
                    <label htmlFor="city">City:</label><br />
                    <input type="text" id="city" name="city" value={formData.city} onChange={(e) => handleChange('city', e)} disabled={!inputsEnabled} /><br /><br />
                </div>
            </div>
            <div className='inputs'>
                <div>
                    <label htmlFor="email">Email:</label><br />
                    <input type="email" id="email" name="email" value={formData.email} disabled /><br /><br />
                </div>
                <div>
                    <label htmlFor="password">Password:</label><br />
                    <input type="password" id="password" name="password" value={formData.password} disabled/><br /><br />
                </div>
            </div>
            <label htmlFor="biography">Biography:</label><br />
            <textarea id="biography" name="biography" rows="5" cols="52" value={formData.biography} onChange={(e) => handleChange('biography', e)} disabled={!inputsEnabled}></textarea><br /><br />
            <div className='inputs'>
                <div>
                    <label htmlFor="blood">Blood Group:</label><br />
                    <input type="text" id="blood" name="blood" value={formData.blood} onChange={(e) => handleChange('blood', e)} disabled={!inputsEnabled} /><br /><br />
                </div>
                <div style={{
                    width: '35%',
                    lineHeight: '30px'
                }}>
                    <label >Gender:</label><br />
                    <label>
                    <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                                    onChange={(e) => handleChange('gender', e)}
                                    disabled={!inputsEnabled}
                    />
                    Male
                </label>
                <br />
                <label>
                    <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                                    onChange={(e) => handleChange('gender', e)}
                                    disabled={!inputsEnabled}
                    />
                    Female
                </label>
                <br />
                <label>
                    <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={formData.gender === 'other'}
                                    onChange={(e) => handleChange('gender', e)}
                                    disabled={!inputsEnabled}
                    />
                    Other
                </label>
                <br />
                </div>
            </div>
            <div className='btn2'>
                <button type='submit'>Save</button>
                <button onClick={cancelInputs}>Cancel</button>
            </div>
        </form>
      </div>
      <div>
                <h3 className='settings-headers'>Manage Password</h3>
                <p className='settings-headers' style={{border: 'None'}}>Upon changing your password, you will be logged out and need to log in again.</p>
                <div style={{
                    width: '95%',
                    display: 'inline-flex',
                    justifyContent: 'flex-end'
                }}>
                    <button className='del-btn' onClick={handlePopupToggle}>Change Password</button>
                </div>
                {showPopup && <ChangePasswordPopup onClose={handlePopupToggle} />}
            </div>
            <br />
            <div>
                <h3 className='settings-headers'>Account</h3>
                <p className='settings-headers' style={{border: 'None'}}>
                    Deleting the account will permanently erase all your data. You will not be able to retrieve any data after.
                </p>
                <div style={{
                    width: '95%',
                    display: 'inline-flex',
                    justifyContent: 'flex-end'
                }}>
                    <button className='del-btn' onClick={handleDeleteButtonClick}>Delete Account</button>
                </div>
                {showDeletePopup && (
                    <DeleteAccountPopup
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                    />
                )}
            </div>
            <br />
            <br />
    </div>
  )
}