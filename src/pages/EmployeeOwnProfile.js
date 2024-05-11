import { useAuthContext } from "../hooks/useAuthContext";
import man_avatar from "../avatars&logos/stick-man.png"
import women_avatar from "../avatars&logos/woman.png"
import { useEmployeesContext } from "../hooks/useEmployeesContext";
import { useState } from "react";

const EmployeeOwnProfile = () => {
    const { user } = useAuthContext()
    const { dispatch } = useEmployeesContext();
    const [isEditing, setIsEditing] = useState(false);
    const [ error, setError ] = useState(null)
    const [successMessage, setSuccessMessage] = useState('');
    const [formState, setFormState] = useState(user);
    const handleInputChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {

        const updatedEmployee = {
            
            fullName: formState.fullName,
            email: formState.email,
            password: formState.password,
            location: formState.location,
            phone: formState.phone,
            position: formState.position,
            gender: formState.gender,
            birthday_date: formState.birthday_date,
        };

        const token = JSON.parse(localStorage.getItem("token"))
        const response = await fetch(`/api/Acm_CRM/updateEmployee/${user._id}`, {
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
                {user.gender.toLowerCase() === 'male' ? (
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
                                <input name="position"
                                    value={formState.position}
                                    onChange={handleInputChange}
                                    disabled
                                    
                                />
                                    
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
            </div>
        </div>


    );
}

export default EmployeeOwnProfile;