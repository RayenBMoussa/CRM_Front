import { useState, useEffect } from "react";
import { useEmployeesContext } from "../hooks/useEmployeesContext";
import { useParams } from 'react-router-dom';
import man_avatar from "../avatars&logos/suit_man_avatar.png"
import women_avatar from "../avatars&logos/suit_women_avatar.png"
import '../styles/empProfileAdmin.css';
import emailjs from '@emailjs/browser';

const EmployeeProfileAdmin = () => {
    const { dispatch } = useEmployeesContext();
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState(null)
    const [formState, setFormState] = useState({
        fullName: '',
        email: '',
        password: '',
        location: '',
        phone: '',
        position: '',
        gender: '',
        birthday_date: '',
    });
    const { id } = useParams();

    const token = JSON.parse(localStorage.getItem('token'));
    useEffect(() => {
        
        const fetchEmployeeDetails = async () => {
            try {
               
                const response = await fetch(`/api/Acm_CRM/employee/${id}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token.token}`, 
                    },
                });
                const data = await response.json();
                setFormState(data); 

            } catch (error) {
                console.error('Failed to fetch employee details:', error);
            }
        };

        fetchEmployeeDetails();
    }, [id, dispatch]);
    const handleInputChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        setIsEditing(true);
    };
   

    const handleSave = async () => {

        const updatedEmployee = {
            ...formState,
            fullName: formState.fullName,
            email: formState.email,
            password: formState.password,
            location: formState.location,
            phone: formState.phone,
            position: formState.position,
            gender: formState.gender,
            birthday_date: formState.birthday_date,
        };
        const sendEmail = () => {
            emailjs.send('service_jjn0qre', "template_836qgzg", {
                to_name: formState.fullName,
                message: `I hope you are having a good day, here is your updated password ${ formState.password} `,
                subject: "Employee account",
                to_email: formState.email,
            }, 'vc4dNF6JlEHb94drI')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
            }, (err) => {
                console.error('FAILED...', err);
            });
        };

      
        const response = await fetch(`/api/Acm_CRM/updateEmployee/${id}`, {
            method: "PATCH",
            headers: { "Authorization": `Bearer ${token.token}`, "Content-Type": "application/json" },
            body: JSON.stringify(updatedEmployee),
        });
        const json = await response.json();
        if (!response.ok) {
            setError(json.error)
            console.log(json.error);
        }

        if (response.ok) {
            setError(null)
            dispatch({ type: 'UPDATE_EMPLOYEES', payload: json });
            sendEmail()
            setIsEditing(false);
            setSuccessMessage("Updated successfully")
            setTimeout(() => {
                setSuccessMessage(''); 
            }, 4000);
        }
    };

    const handleCancel = () => {
        setError(null)
        setIsEditing(false);
    };

    return (
        <div className="page-container">
            {/* Section for uploading user image */}
            <div className="image-upload-section">
                {formState.gender.toLowerCase() === 'male' ? (
                    <img src={man_avatar} alt="Male Avatar" className="user-man" />
                ) : (
                    <img src={women_avatar} alt="Female Avatar" className="user-woman" />
                )}
            </div>

            {/* Main content section divided into two parts */}
            <div className="main-content">
                {/* General Information section */}
                <form className="employee-profile-form">
                    <h3>General Information</h3>
                    {/* Form fields for general information */}

                    <div className="general-info">
                        <div className="line1">
                            <label>
                                Full Name:
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formState.fullName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </label>
                            <label>
                                Birthday:
                                <input
                                    type="date"
                                    name="birthday_date"
                                    value={formState.birthday_date}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </label>
                        </div>
                        <div className="line2">
                            <div className="line2-1">
                                <label>
                                    Gender:</label>
                                <select
                                    className="dropdown"
                                    name="gender"
                                    value={formState.gender}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                    
                                </select>
                            </div>
                            <label>
                                Phone:
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formState.phone}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </label>
                        </div>
                        <div className="line3">
                            <div className="line3-1">
                                <label> Position:</label>
                                <select name="position"
                                    value={formState.position}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="dropdown"
                                >
                                    <option value="UI/UX">UI/UX</option>
                                    <option value="Graphic Designer">Graphic Designer</option>
                                    <option value="Developper">Developper</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                            </div>
                            <label>
                                Address:
                                <input
                                    type="text"
                                    name="location"
                                    value={formState.location}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </label>
                        </div>

                    </div>

                    {/* Account Settings section */}
                    <h3>Account Settings</h3>
                    <div className="account-settings">

                        {/* Form fields for account settings */}
                        <div className="line4">
                            <label>
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={formState.email}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </label>
                            {isEditing && ( // Conditionally render the password field
                                <label>
                                    Password:
                                    <input
                                        type="password"
                                        name="password"
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </label>
                            )}
                        </div>
                        <div className="line5">
                            {isEditing ? (
                                <>
                                    <button className="save" type="button" onClick={handleSave}>Save</button>
                                    <button type="button" onClick={handleCancel}>Cancel</button>

                                </>
                            ) : (
                                <button type="button" onClick={handleUpdate}>Update</button>
                            )}
                        </div>
                        {successMessage && <div className="success">{successMessage}</div>}
                        {error && <div className="error">{error}</div>}
                    </div>
                    
                </form>
            </div >

        </div >
    );

}
export default EmployeeProfileAdmin;