import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Employees from './pages/Employees';
import { EmployeesContextProvider } from './context/EmployeesContext';
import { useEffect, useState } from 'react';
import EmployeeProfileAdmin from './components/EmployeeProfileAdmin';
import EmployeeDashboard from './pages/EmployeeDashboard';
import { useAuthContext } from './hooks/useAuthContext';
import EmployeeAccount from './pages/EmployeeAccount';
import EmployeeOwnProfile from "./pages/EmployeeOwnProfile"
import ProjectsAdmin from './pages/ProjectsAdmin';
import { ProjectsContextProvider } from './context/ProjectsContext';
import { TasksContextProvider } from './context/TasksContext';
import EditProject from './components/EditProject';
import ProjectsEmployee from './pages/ProjectsEmployee';
import EditTask from './components/EditTask';
import EmployeeTasks from './components/EmployeeTasks';
import TaskManagement from './components/TaskManagement';
function App() {
  const { user, loading } = useAuthContext()
  if (loading) return (
    <div className="">
      Loading...
    </div>
  )


  return (
    <div className="App">
      <BrowserRouter>
        <EmployeesContextProvider>
          <ProjectsContextProvider>
            <TasksContextProvider>
              <div className="pages">
                <Routes>
                  <Route path="/login"
                    element={user?.userType === "admin" ? <Navigate to="/adminDashboard" /> : user?.userType === "employee" ? <Navigate to="/employeeAccount" /> : <Login />}
                  />
                  <Route path='/adminDashboard' element={user?.userType === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}>
                    <Route path='' element={<h3>Admin's Dashboard</h3>} />
                    <Route path='employees' element={<Employees />} />
                    <Route path='projects' element={<ProjectsAdmin />} />
                    <Route path='employee-profile/:id' element={<EmployeeProfileAdmin />} />
                    <Route path='edit-project/:id' element={<EditProject />} />
                    <Route path='EditTask/:id' element={<EditTask/>} />
                  </Route>

                  <Route path={"/employeeAccount"} element={user?.userType === "employee" ? <EmployeeAccount /> : <Navigate to="/login" />} >
                    <Route path="" element={<EmployeeDashboard />} />
                    <Route path='Profile' element={<EmployeeOwnProfile />} />
                    <Route path="projects" element={<ProjectsEmployee />} />
                    <Route path='tasks/:id' element={<EmployeeTasks/>}/>
                    <Route path='management/:id' element={<TaskManagement/>}/>
                    
                  </Route>
                  <Route path="*" element={<div>Not Found</div>} />
                </Routes>
              </div>
            </TasksContextProvider>
          </ProjectsContextProvider>
        </EmployeesContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
// user && `/${user.fullName}`