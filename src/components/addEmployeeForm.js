import { IconContext } from "react-icons";
import Modal from '@mui/material/Modal';
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from 'react';
import 'dayjs/locale/en-gb';
import { RegionDropdown } from 'react-country-region-selector';
import Form from 'react-bootstrap/Form';
import { useEmployeesContext } from "../hooks/useEmployeesContext";
import "../styles/registrationForm.css"
import emailjs from '@emailjs/browser';

const AddEmployeeForm = ({ open, handleClose }) => {
    const { dispatch } = useEmployeesContext()
    const [fullName, setfullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [position, setPosition] = useState("");
    const [gender, setGender] = useState("Male");
    const [birthday_date, setBirthday_date] = useState("");
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        // const isoDateString = birthday_date ? birthday_date.toISOString() : null;
        const employee = {
            fullName,
            email,
            password,
            location,
            phone,
            position,
            gender,
            birthday_date
        };
        const sendEmail = () => {
            emailjs.send('service_jjn0qre', "template_rhopfzs", {
                to_name: fullName,
                message: `I hope you are having a good day, here is your password for our CRM application ${ password} `,
                subject: "Employee account",
                to_email: email,
            }, 'vc4dNF6JlEHb94drI')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
            }, (err) => {
                console.error('FAILED...', err);
            });
        };
        
        const token = JSON.parse(localStorage.getItem('token'));
        const response = await fetch("/api/Acm_CRM/addEmployee", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token.token}`, "Content-Type": "application/json" },
            body: JSON.stringify(employee),
        });
        const json = await response.json();
        if (!response.ok) {
            setError(json.error);
        }



        if (response.ok) {
            dispatch({ type: 'CREATE_EMPLOYEES', payload: json.user })
            sendEmail()
            resetForm();
            setShowAlert(true);
        }
    };
    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
                handleClose(); // Close the modal
            }, 3000); // Alert will be shown for 3 seconds

            return () => clearTimeout(timer); // Cleanup on component unmount
        }
    }, [showAlert, handleClose]);


    const selectRegion = (val) => {
        setLocation(`${val}, Tunisia`);
    };

    const handlePosition = (event) => {
        setPosition(event.target.value);
    };





    const resetForm = () => {
        setfullName("");
        setEmail("");
        setPassword("");
        setLocation("");
        setPhone("");
        setPosition("");
        setGender("Male");
        setBirthday_date("");
        setError(null);
    };

    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className='modal'
            style={{
                outline: "none"
            }}
        >
            <div className="registration-form">
                <IconContext.Provider value={{ className: "close-modal" }}>
                    <IoMdClose onClick={handleClose} />
                </IconContext.Provider>
                <div className="title">
                    <h2>Add Employee</h2>

                </div>
                <form onSubmit={handleSubmit}>
                    <div className="nam-email">
                        <div className="name">
                            <label>Name</label>
                            <input
                                type="text"
                                onChange={(e) => setfullName(e.target.value)}
                                value={fullName}
                                placeholder="Fullname"
                            /></div>
                        <div className="mail">
                            <label>Email</label>
                            <input
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                value={email}
                            />
                        </div>
                    </div>
                    <div className="birth-gen">
                        <div className="birth">
                            <label>date of birth</label>
                            <input
                                type="date"
                                onChange={(e) => setBirthday_date(e.target.value)}
                                placeholder="date of birth"
                                value={birthday_date}
                            />
                        </div>
                        <div className="gender">
                            <div className="gen-label">
                                <label>Gender:</label>
                            </div>
                            <div className="gen-types">
                                <div className="male-radio">
                                    <label>Male</label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        onChange={(e) => setGender(e.target.value)}
                                        value="Male"
                                        checked={gender === "Male"}
                                    />
                                </div>
                                <div className="female-radio">
                                    <label>Female</label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        onChange={(e) => setGender(e.target.value)}
                                        value="Female"
                                        checked={gender === "Female"}
                                    />
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div className="phone-loc">
                        <div className="phone">
                            <label>Phone</label>

                            <input
                                type="tel"
                                minLength="8"
                                maxLength="8"
                                onChange={(e) => setPhone(e.target.value)}
                                value={phone}
                                placeholder="Phone Number"
                            />
                        </div>
                        <div className="adress">
                            <fieldset>
                                <legend>Adress:</legend>
                                <RegionDropdown
                                    className="dropdown1"
                                    country="Tunisia"
                                    value={location.split(", ")[0]}
                                    onChange={(val) => selectRegion(val)}
                                />
                            </fieldset>
                        </div>
                    </div>
                    <div className="pos">
                        <fieldset>
                            <legend>Position</legend>
                            <Form.Select className="dropdown1" value={position} onChange={handlePosition} aria-label="Default select example">
                                <option selected>Select position</option>
                                <option value="UI/UX">UI/UX</option>
                                <option value="Graphic Designer">Graphic Designer</option>
                                <option value="Developper">Developper</option>
                                <option value="Marketing">Marketing</option>
                            </Form.Select >
                        </fieldset>
                    </div>
                    <label>Password</label>
                    <div className="pwd">
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Password"
                        />
                    </div>
                    <button>Create Account</button>
                    {error && <div className="error">{error}</div>}
                </form>
                {showAlert && (
                    <div className="alert">
                        User added successfully!
                    </div>
                )}
            </div>

        </Modal>
    );
};

export default AddEmployeeForm;
