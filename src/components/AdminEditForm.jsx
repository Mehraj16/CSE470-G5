import React, { useState } from 'react'
import { MdOutlineFileUpload } from "react-icons/md";
import manage from '../css/manage.module.css';
import {useNavigate} from 'react-router-dom';

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

  function ChangePasswordPopup({ onClose, formData }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const id = formData.id
    const requestbody = {
        "userid": id,
        "oldpass": oldPassword,
        "newpass": newPassword
    }
    const handleChange = async (e) => {
        e.preventDefault();
        try {
            console.log(requestbody)
            let url = 'http://127.0.0.1:8000/api/change-pass/'
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestbody),
            });
            const responseBody = await response.json();
            if (!response.ok) {
                console.error('Failed request:', responseBody);
                throw new Error('Failed to update data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
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

export default function EditForm({ enableInputs, inputsEnabled, formData, handleInputChange, cancelInputs, saveInputs}) {
    
    const navigation = useNavigate();

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

    const handleConfirmDelete = async () => {
        try {
            
            const id = formData.id;
            let url = `http://127.0.0.1:8000/api/admin/delete-account/${id}`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const responseBody = await response.json();
            if (!response.ok) {
                console.error('Failed request:', responseBody);
                throw new Error('Failed to update data');
            }
            navigation('/');
        } catch (error) {
            console.error('Error:', error);
        }
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
                    <input type="email" id="email" name="email" value={formData.email} onChange={(e) => handleChange('city', e)} disabled={!inputsEnabled} /><br /><br />
                </div>
                <div className={manage.fileBox} style={{
                        paddingRight:'45px'
                    }}>
                        <label htmlFor="profile-pic-update">Profile Picture:</label><br />
                        <label htmlFor="pro-pic" className={manage.filelabel} style={{
                            padding:'5px 8px',
                            paddingLeft: '4px'
                        }}><MdOutlineFileUpload className={manage.icon} style={{
                            width: '18x',
                            height: '18px'
                        }}/>&nbsp;| Choose File</label><br />
                        <input
                        type="file"
                        id="png"
                        name="png"
                        onChange={(e) => handleChange('profileImage', e)}
                        className={manage.fileInput}
                        /><br /><br />
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
                        checked={formData.gender === 'Male'}
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
                        checked={formData.gender === 'Female'}
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
                        checked={formData.gender === 'Other'}
                                    onChange={(e) => handleChange('gender', e)}
                                    disabled={!inputsEnabled}
                    />
                    Other
                </label>
                <br />
                </div>
            </div>
            <div className='btn2'>
                <button onClick={saveInputs}>Save</button>
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
                {showPopup && <ChangePasswordPopup onClose={handlePopupToggle} formData={formData} />}
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