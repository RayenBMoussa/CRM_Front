import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import ProgressBarWithLabel from '../components/ProgressBarWithLabel';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { IconContext } from "react-icons";
import { HiUserGroup } from "react-icons/hi2";
import { PiProjectorScreenChartLight } from "react-icons/pi";
import { BiTask } from "react-icons/bi";
import "../styles/EmployeeDash.css";
import MonthlyProjectsChart from "../components/MonthlyProjectsChart";
import TaskStatusPieChart from "../components/TaskStatusPieChart";
import TasksMonthlyChart from "../components/TasksMonthlyChart";
const EmployeeDashboard = () => {
    const { user } = useAuthContext();
    const employee = user?.userType === "employee";
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        nbProjects: 0,
        nbTasks: 0,
        progress: 0,
        nbFinishedTasks: 0,
        monthlyTasks: {},
        statusData: [],
        highPriorityTasks: []
    })
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    useEffect(() => {
        const ownProjectsAndTasks = async () => {
            setLoading(true)
            const token = JSON.parse(localStorage.getItem("token"))
            try {
                const projectsResponse = await fetch(`/api/Acm_CRM/employeeProjects/${user._id}`, {
                    headers: { "Authorization": `Bearer ${token.token}` }
                });
                const projects = await projectsResponse.json();

                const tasksResponse = await fetch(`/api/Acm_CRM/employeeTasks/${user._id}`, {
                    headers: { "Authorization": `Bearer ${token.token}` }
                });
                const tasks = await tasksResponse.json();

                const finishedTasksResponse = await fetch(`/api/Acm_CRM/finishedTasks/${user._id}`, {
                    headers: { "Authorization": `Bearer ${token.token}` }
                });
                const finishedTasks = await finishedTasksResponse.json();

                const progressBarResponse = await fetch(`/api/Acm_CRM/tasksProgress/${user._id}`, {
                    headers: { "Authorization": `Bearer ${token.token}` }
                });
                const progressBar = await progressBarResponse.json();

                const pieChartResponse = await fetch(`/api/Acm_CRM/emptasksPie/${user._id}`, {
                    headers: { "Authorization": `Bearer ${token.token}` }
                });
                const piechart = await pieChartResponse.json();
                if (projectsResponse.ok && tasksResponse.ok && progressBarResponse.ok) {
                    setData(prevData => ({
                        ...prevData,
                        nbProjects: projects,
                        nbTasks: tasks,
                        nbFinishedTasks: finishedTasks,
                        progress: progressBar.progress,
                        statusData:piechart,
                        highPriorityTasks: progressBar

                    })

                    )
                }
                else {
                    console.log("failed to fetch")
                }
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
            finally {
                setLoading(false);
            }
        }
        if (employee) {
            ownProjectsAndTasks()
        }
    }, [employee])

    useEffect(() => {
        const fetchMonthlyTasks = async () => {
            const token = JSON.parse(localStorage.getItem('token'));

            try {
                const response = await fetch(`/api/Acm_CRM/taskMonthlyChart/${user._id}`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${token.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ year: selectedYear }),
                });
                const monthlyCount = await response.json();

                if (response.ok) {
                    setData(prevData => ({ ...prevData, monthlyTasks: monthlyCount }));
                } else {
                    console.error('Failed to fetch monthly tasks');
                }
            } catch (error) {
                console.error('Error fetching monthly tasks:', error);
            }
        };

        fetchMonthlyTasks();
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
                    <h4 style={{ marginTop: "0" }}>Tasks Progress</h4>
                    <div style={{ display: "flex", height: "80%", flexDirection: "column", justifyContent: "space-around", }}>
                        {data.highPriorityTasks.length === 0 ? (
                            <div className="no-projects-message">
                                No high priority projects in progress.
                            </div>
                        ) : (

                            data.highPriorityTasks.map((task, index) => (

                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="h6">{task.taskName}</Typography>
                                    <ProgressBarWithLabel
                                        value={task.progress}

                                    />
                                </Box>

                            ))
                        )}
                    </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div className='dash-cards1'>
                        <div className='inside-card'>
                            <IconContext.Provider value={{ className: "dash-icon1" }}>
                                <PiProjectorScreenChartLight />
                            </IconContext.Provider>

                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                                <p style={{ color: "gray", margin: "0", fontWeight: "bold" }}>Assigned Projects</p >
                                <h3 style={{ fontSize: "30px ", color: "black" }}>{data.nbProjects}</h3>

                            </div>
                        </div>
                    </div>
                    <div className='dash-cards1 '>
                        <div className='inside-card'>
                            <IconContext.Provider value={{ className: "dash-icon4" }}>
                                <BiTask />
                            </IconContext.Provider>

                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                                <p style={{ color: "gray", margin: "0", fontWeight: "bold" }}>Assigned Tasks</p >
                                <h3 style={{ fontSize: "30px ", color: "black" }}>{data.nbTasks}</h3>

                            </div>
                        </div>
                    </div>
                    <div className='dash-cards1 card-align '>
                        <div className='inside-card'>
                            <IconContext.Provider value={{ className: "dash-icon2" }}>
                                <BiTask />
                            </IconContext.Provider>

                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                                <p style={{ color: "gray", margin: "0", fontWeight: "bold" }}>Finished Tasks</p >
                                <h3 style={{ fontSize: "30px ", color: "black" }}>{data.nbFinishedTasks}</h3>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='sec-con' >
                <div className='chart'>
                    <div style={{ padding: "20px" }}>
                        <h4 style={{ margin: "0" }}>Monthly Task Counts for {data.selectedYear}</h4 >
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
                        <TasksMonthlyChart monthlyTasks={data.monthlyTasks} />
                    </div>
                </div>
                <div >
                    
                    <div className='chartPie' style={{ padding: "20px",  borderRadius: "10px" }}>
                        <h4 style={{ margin: "0" }}>Task Status Distribution</h4>
                        <TaskStatusPieChart taskStatusData={data.statusData} />
                    </div>
                </div>
            </div>
        </div >
    );
}

export default EmployeeDashboard;