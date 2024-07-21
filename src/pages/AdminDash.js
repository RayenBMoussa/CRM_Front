import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { IconContext } from "react-icons";
import "../styles/AdminDash.css";
import MonthlyProjectsChart from "../components/MonthlyProjectsChart";
import ProjectStatusPieChart from "../components/ProjectStatusPieChart";
import TaskStatusPieChart from "../components/TaskStatusPieChart";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { HiUserGroup } from "react-icons/hi2";
import { PiProjectorScreenChartLight } from "react-icons/pi";
import { BiTask } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { IoIosBook } from "react-icons/io";
import ProgressBarWithLabel from '../components/ProgressBarWithLabel';
import { Typography } from '@mui/material';

const AdminDash = () => {
    const { user } = useAuthContext();
    const admin = user?.userType === "admin";
    const [data, setData] = useState({
        tasksNb: 0,
        projectsNb: 0,
        employeesNb: 0,
        completedProjectsNb: 0,
        progress: 0,
        completedTasks: 0,
        totalTasks: 0,
        monthlyProjects: {},
        statusData: [],
        taskStatusData: [],
        highPriorityProjects: [],
    });
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        const fetchProjectsAndTasks = async () => {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem('token'));

            try {
                const projectsResponse = await fetch("/api/Acm_CRM/nbProjects", {
                    headers: { "Authorization": `Bearer ${token.token}` }
                });
                const countProjects = await projectsResponse.json();

                const tasksResponse = await fetch("/api/Acm_CRM/nbTasks", {
                    headers: { "Authorization": `Bearer ${token.token}` }
                });
                const countTasks = await tasksResponse.json();

                const employeesResponse = await fetch("/api/Acm_CRM/nbEmployees", {
                    headers: { "Authorization": `Bearer ${token.token}` }
                });
                const countEmployees = await employeesResponse.json();

                const activeProjectsResponse = await fetch("/api/Acm_CRM/nbActiveProjects", {
                    headers: { "Authorization": `Bearer ${token.token}` }
                });
                const countActiveProjects = await activeProjectsResponse.json();

                const progressBarResponse = await fetch("/api/Acm_CRM/progressBar", {
                    headers: { "Authorization": `Bearer ${token.token}` }
                });
                const progressBar = await progressBarResponse.json();

                const projectPieResponse = await fetch('/api/Acm_CRM/projectPieChart', {
                    method: 'GET',
                    headers: {"Authorization": `Bearer ${token.token}`}
                });
                const projectsPie = await projectPieResponse.json();

                const taskPieResponse = await fetch('/api/Acm_CRM/taskPieChart', {
                    method: 'GET',
                    headers: {"Authorization": `Bearer ${token.token}`}
                });
                const tasksPie = await taskPieResponse.json();
                if (projectsResponse.ok && tasksResponse.ok && employeesResponse.ok && progressBarResponse.ok && projectPieResponse) {
                    setData(prevData => ({
                        ...prevData,
                        projectsNb: countProjects,
                        tasksNb: countTasks,
                        employeesNb: countEmployees,
                        completedProjectsNb: countActiveProjects,
                        completedTasks: progressBar.completedTasks,
                        totalTasks: progressBar.totalTasks,
                        progress: progressBar.progress,
                        highPriorityProjects: progressBar,
                        statusData: projectsPie,
                        taskStatusData: tasksPie,
                    }))
                } else {
                    console.error('Failed to fetch projects, tasks, or employees');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (admin) {
            fetchProjectsAndTasks();
        }
    }, [admin]);

    useEffect(() => {
        const fetchMonthlyProjects = async () => {
            const token = JSON.parse(localStorage.getItem('token'));

            try {
                const response = await fetch('/api/Acm_CRM/monthlyChart', {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${token.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ year: selectedYear }),
                });
                const monthlyCount = await response.json();

                if (response.ok) {
                    setData(prevData => ({ ...prevData, monthlyProjects: monthlyCount }));
                } else {
                    console.error('Failed to fetch monthly projects');
                }
            } catch (error) {
                console.error('Error fetching monthly projects:', error);
            }
        };

        fetchMonthlyProjects();
    }, [selectedYear]);

   

   
    const handleYearChange = (event) => {
        setSelectedYear(Number(event.target.value));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "60px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "50% 50%", marginTop: "40px", gap: "20px" }}>
                < div className="projects-cont">
                    <h4 style={{ marginTop: "0" }}>Projects Progress</h4>
                    <div style={{ display: "flex", height: "80%", flexDirection: "column", justifyContent: "space-around", }}>
                        {data.highPriorityProjects.length === 0 ? (
                            <div className="no-projects-message">
                                No high priority projects in progress.
                            </div>
                        ) : (

                            data.highPriorityProjects.map((project, index) => (

                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="h6">{project.title}</Typography>
                                    <ProgressBarWithLabel
                                        value={project.progress}
                                        completedTasks={project.completedTasks}
                                        totalTasks={project.totalTasks}
                                    />
                                </Box>

                            ))
                        )}
                    </div>
                </div>
                <div className='dash-cont'>

                    <Link style={{ textDecoration: "none" }} to={"/adminDashboard/employees"}>
                        <div className='dash-cards'>
                            <div className='inside-card'>
                                <IconContext.Provider value={{ className: "dash-icon1" }}>
                                    <HiUserGroup />
                                </IconContext.Provider>

                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                                    <p style={{ color: "gray", margin: "0", fontWeight: "bold" }}>Employees</p >
                                    <h3 style={{ fontSize: "30px ", color: "black" }}>{data.employeesNb}</h3>

                                </div>
                            </div>
                        </div>
                    </Link>


                    <Link style={{ textDecoration: "none" }} to={"/adminDashboard/projects"}>

                        <div className='dash-cards'>
                            <div className='inside-card'>
                                <IconContext.Provider value={{ className: "dash-icon2" }}>
                                    <PiProjectorScreenChartLight />
                                </IconContext.Provider>
                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                                    <p style={{ color: "gray", margin: "0", fontWeight: "bold" }}>Projects</p>
                                    <h3 style={{ fontSize: "30px ", color: "black" }}>{data.projectsNb}</h3>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link style={{ textDecoration: "none", marginTop: "auto" }} to={"/adminDashboard/projects"}>
                        <div className='dash-cards'>
                            <div className='inside-card'>
                                <IconContext.Provider value={{ className: "dash-icon3" }}>
                                    <IoIosBook />
                                </IconContext.Provider>
                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "end", gap: "10px" }}>
                                    <p style={{ color: "gray", margin: "0", fontWeight: "bold" }}>Active Projects</p>
                                    <h3 style={{ fontSize: "30px ", color: "black" }}>{data.completedProjectsNb}</h3>
                                </div>
                            </div>

                        </div>

                    </Link>

                    <Link style={{ textDecoration: "none", marginTop: "auto" }} to={"/adminDashboard/projects"}>
                        <div className='dash-cards'>
                            <div className='inside-card'>
                                <IconContext.Provider value={{ className: "dash-icon4" }}>
                                    <BiTask />
                                </IconContext.Provider>
                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                                    <p style={{ color: "gray", margin: "0", fontWeight: "bold" }}>Tasks</p>
                                    <h3 style={{ fontSize: "30px ", color: "black" }}>{data.tasksNb}</h3>
                                </div>
                            </div>
                        </div>

                    </Link>

                </div>
            </div>
            <div className='sec-con' >
                <div className='chart'>
                    <div style={{ padding: "20px" }}>
                        <h4 style={{ margin: "0" }}>Monthly Project Counts for {data.selectedYear}</h4 >
                    </div>
                    <div className='year-border'>
                        <Box sx={{ maxWidth: 100 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Year</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="yearFilter"
                                    value={selectedYear}
                                    label="Year"
                                    onChange={handleYearChange}
                                    style={{ height: "40px" }}
                                >
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </div>
                    <div style={{ padding: "20px" }}>
                        <MonthlyProjectsChart monthlyProjects={data.monthlyProjects} />
                    </div>
                </div>
                <div >
                    <div className='chartPie' style={{ padding: "20px", borderRadius: "10px" }}>
                        <h4 style={{ margin: "0" }}>Project Status Distribution</h4>
                        <ProjectStatusPieChart statusData={data.statusData} />
                    </div>
                    <div className='chartPie' style={{ padding: "20px", marginTop: "20px", borderRadius: "10px" }}>
                        <h4 style={{ margin: "0" }}>Task Status Distribution</h4>
                        <TaskStatusPieChart taskStatusData={data.taskStatusData} />
                    </div>
                </div>
            </div>


        </div >
    );
};

export default AdminDash;
