import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import compsLogo from "../avatars&logos/CompsLogo.png";
import { MdDashboard } from "react-icons/md";
import { ImBooks } from "react-icons/im";
import { IoMdPeople } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { IconContext } from "react-icons";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import "../styles/navbar.css"
const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleClick = () => {
    logout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };


  return (
    <header>
      <div className="container">
        <img src={compsLogo} alt='Logo' className="img" onClick={toggleSidebar} />

        <nav className='navbar'>
          <NotificationsIcon className='profileIcon' />
          <AccountCircleIcon fontSize='large' className='profileIcon' />
        </nav>
      </div>
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="sidebar">
          <div className='sidebar-items'>
            <div className='sidebar-header'>
              <img src={compsLogo} alt='Logo' className="close-button" onClick={toggleSidebar} />
              <span className='sidebar-title'><span className='blue'>Acm </span><span className='green'>Mar</span><span className='pink'>keting</span></span>
            </div>
            <div className='sidebar-tags'>
            <Link to="/adminDashboard" className="sidebar-item" onClick={toggleSidebar}>
              <div className='align-icon' >
                <IconContext.Provider value={{ className: "top-react-icons" }}><MdDashboard /></IconContext.Provider>Dashboard
              </div>
            </Link>
            <Link to="/adminDashboard/projects" className="sidebar-item" onClick={toggleSidebar}>
              <div className='align-icon'>
                <IconContext.Provider value={{ className: "top-react-icons" }}><ImBooks /></IconContext.Provider>Projects
              </div>
            </Link>
            <Link to="/adminDashboard/employees" className="sidebar-item" onClick={toggleSidebar}>
              <div className='align-icon'>
                <IconContext.Provider value={{ className: "top-react-icons" }}><IoMdPeople /></IconContext.Provider>Employees
              </div>
            </Link>
          </div>
          </div>
          <div className="logout-sidebar">
            <button onClick={handleClick} className='logout-button'>Log out<IconContext.Provider value={{ className: "logout-icon" }}></IconContext.Provider><IoLogOutOutline />  </button>
          </div>
        </div>
      )}
    </header>
  )
};

export default Navbar;
