import React from 'react'

export default function EditForm({ enableInputs, inputsEnabled, formData, handleInputChange, cancelInputs, selectedGender, handleGenderChange }) {
    const handleChange = (field, e) => {
        handleInputChange(field, e.target.value);
      };
  return (
    <div className='all-details'>
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
                    <input type="date" id="dob" name="dob" value={formData.dob} onChange={(e) => handleChange('dob', e)} disabled={!inputsEnabled} /><br /><br />
                </div>
                <div>
                    <label htmlFor="city">City:</label><br />
                    <input type="text" id="city" name="city" value={formData.city} onChange={(e) => handleChange('city', e)} disabled={!inputsEnabled} /><br /><br />
                </div>
            </div>
            <div className='inputs'>
                <div>
                    <label htmlFor="email">Email:</label><br />
                    <input type="email" id="email" name="email" value={formData.email} onChange={(e) => handleChange('email', e)} disabled={!inputsEnabled} /><br /><br />
                </div>
                <div>
                    <label htmlFor="password">Password:</label><br />
                    <input type="password" id="password" name="password" value={formData.password} onChange={(e) => handleChange('password', e)} disabled={!inputsEnabled} /><br /><br />
                </div>
            </div>
            <label htmlFor="biography">Biography:</label><br />
            <textarea id="biography" name="biography" rows="5" cols="52" value={formData.biography} onChange={(e) => handleChange('biography', e)} disabled={!inputsEnabled}></textarea><br /><br />
            <div>
                <div>
                    <label htmlFor="blood">Blood Group:</label><br />
                    <input type="text" id="blood" name="blood" value={formData.blood} onChange={(e) => handleChange('blood', e)} disabled={!inputsEnabled} /><br /><br />
                </div>
                <div>
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
            <div className='inputs'>
                <div>
                    <label htmlFor="interests">Interests:</label><br />
                    <input type="text" id="interests" name="interests" value={formData.interests} onChange={(e) => handleChange('interests', e)} disabled={!inputsEnabled} /><br /><br />
                </div>
                <div>
                    <label htmlFor="skills">Skills:</label><br />
                    <input type="text" id="skills" name="skills" value={formData.skills} onChange={(e) => handleChange('skills', e)} disabled={!inputsEnabled} /><br /><br />
                </div>
            </div>
            <div className='btn2'>
                <button type='submit'>Save</button>
                <button onChange={cancelInputs}>Cancel</button>
            </div>
        </form>
      </div>
    </div>
  )
}