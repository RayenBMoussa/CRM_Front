import { FaRegCircleUser } from "react-icons/fa6";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import man_avatar from "../avatars&logos/suit_man_avatar.png"
import women_avatar from "../avatars&logos/suit_women_avatar.png"
import "../styles/employeeList.css"

const EmployeesList = ({ employee }) => {
    const calculateAge = (birthday) => {
        const birthDate = new Date(birthday);
        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDifference = currentDate.getMonth() - birthDate.getMonth();

        // Adjust age if the birthday has not occurred yet in the current year
        if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    // Calculate the full age using the birthday date
    const fullAge = calculateAge(employee.birthday_date);
    return (

        <div className="employee-card">
            <Link className="emp-profile" to={`/adminDashboard/employee-profile/${employee._id}`}>
                <div className="card-upper">
                    <div className="icon">
                        {employee.gender.toLowerCase() === 'male' ? (
                            <img src={man_avatar} alt="Male Avatar" className="user-icon-man" />
                        ) : (
                            <img src={women_avatar} alt="Female Avatar" className="user-icon" />
                        )}
                    </div>
                    <div className="name-mail">
                        <h3>{employee.fullName}</h3>
                        <p>{employee.email}</p>
                    </div>
                    <div className="bottom-card-border">

                    </div>
                </div>
                <div className="card-middle">
                    <div className="middle">
                        <div className="middle-part">
                            <h5>Gender</h5>
                            <p>{employee.gender}</p>
                        </div>
                        <div className="middle-part">
                            <h5>Birthday</h5>
                            <p>{employee.birthday_date}</p>

                        </div>
                        <div className="middle-part">
                            <h5 >Full Age</h5>
                            <p>{fullAge}</p>
                        </div>
                    </div>
                    <div className="card-lower">
                        <h5>Position</h5>
                        <p>{employee.position}</p>
                    </div>

                </div>
            </Link>

        </div >

    );
}

export default EmployeesList;