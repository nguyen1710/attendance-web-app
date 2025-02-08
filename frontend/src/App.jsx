// eslint-disable-next-line no-unused-vars
import { useState } from 'react'
import { Route, Routes, useLocation} from 'react-router-dom'
// import Classroom from '../../backend/classroom-service/models/classroom.model'
import Login from './pages/Login/Login.jsx'
import Home from './pages/HomePage/Home.jsx'
import SignUp from './pages/Login/SignUp.jsx'
import VerifyEmail from './pages/Login/VerifyEmail.jsx'
// import { Toaster } from 'react-hot-toast'
import socket from './socketio/socket.js'
import Sidebar from './components/common/Sidebar.jsx'
import SubmissionPage from './pages/Submission/SubmissionPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import Footer from './components/common/Footer.jsx'
//admin
import OverviewPage from "./pages/OverviewPage";
import ClientsPage from "./pages/ClientsPage.jsx";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AdminLogin from './components/admin/login/adminLogin.jsx';
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import { ToastContainer } from 'react-toastify';

//client
import ClassDetail from './pages/HomePage/ClassDetail.jsx'
import ClassDetailUsers from './pages/HomePage/ClassDetailUsers.jsx'
import AttendanceSession from './pages/Attendances/AttendanceSession.jsx'
import AttendanceForm from './pages/Attendances/AttendanceForm.jsx'
import NotificationPage from './pages/Submission/NotificationPage.jsx'
import UpgradePage from './pages/Upgrade/UpgradePage.jsx'
import Profile from './pages/Profiles/Profile.jsx'
import SendEmail from './pages/ResetPassword/SendEmail.jsx'
import ResetPassword from './pages/ResetPassword/ResetPassword.jsx'
function App() {
  const location = useLocation(); // Dùng để kiểm tra route hiện tại
  
  // const classroomRoutes = ["/classroom"];
  // const isClassroomRoute = classroomRoutes.includes(location.pathname);
  const isClassroomRoute = location.pathname.startsWith("/classroom") || location.pathname.startsWith("/notifications") || location.pathname.startsWith("/upgrade") || location.pathname.startsWith("/profile");

  if (isClassroomRoute) {
    // Nếu là route độc lập, render trực tiếp route đó
    return (

      <div className='flex h-screen bg-[#E4E6EB] text-black overflow-hidden'>
        <div className='fixed inset-0 z-10'>
          <div className='absolute inset-0 ' />
          <div className='absolute inset-0 backdrop-blur-sm' />
        </div>
        <Routes>
            <Route path="/classroom/:classId" element={<ClassDetail />} />
            <Route path="/classroom/:classId/users" element={<ClassDetailUsers />} />
            <Route path="/classroom/:classId/attendance/:attendanceId" element={<AttendanceSession/>}/>
            <Route path="/classroom/:classId/submission" element={<SubmissionPage/>}/>
            <Route path="/notifications" element={<NotificationPage/>}/>
            <Route path="/upgrade" element={<UpgradePage/>}/>
            <Route path='/profile' element={<Profile/>} />
        </Routes>
        {/* <Toaster position="top-right" reverseOrder={false} /> */}
        <ToastContainer autoClose={1000} />
    </div>
    
    );
  }

  // Các route hoàn toàn độc lập
  const standaloneRoutes = ["/login", "/signup", "/verify", "/admin/login", "/", "/attendance/form/:id", "/notifications", "/sendEmail", "/reset-password/:token"];
  // const isStandaloneRoute = standaloneRoutes.includes(location.pathname);
  const isStandaloneRoute = standaloneRoutes.some(route =>
    route === location.pathname || (route.includes("/:") && location.pathname.startsWith(route.split("/:")[0]))
  );

  if (isStandaloneRoute) {
    // Nếu là route độc lập, render trực tiếp route đó
    return (
      <>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/attendance/form/:id" element={<AttendanceForm/>}/>
          <Route path="/sendEmail" element={<SendEmail/>}/>
          <Route path="/reset-password/:token" element={<ResetPassword/>}/>
        </Routes>
        <Footer/>
        {/* <Toaster position="top-right" reverseOrder={false} /> */}
        <ToastContainer autoClose={1000} />
      </>
    );
  }
  
  return (
    <div  className='flex h-screen  text-gray-100 overflow-hidden'>
        <div className='fixed inset-0 z-10'>
            <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
            <div className='absolute inset-0 backdrop-blur-sm' />
        </div>
      
        <Sidebar />
        <Routes>

            <Route path='/admin' element={<OverviewPage />} />
            <Route path='/admin/clients' element={<ClientsPage />} />
            <Route path='/admin/users' element={<UsersPage />} />
            <Route path='/admin/sales' element={<SalesPage />} />
            <Route path='/admin/orders' element={<OrdersPage />} />
            <Route path='/admin/analytics' element={<AnalyticsPage />} />
            <Route path='/admin/settings' element={<SettingsPage />} />
            <Route path='/admin/profile' element={<ProfilePage />} />
        </Routes>
        {/* <Toaster position="top-right" reverseOrder={false} /> */}
        <ToastContainer autoClose={1000} />
    </div>
  )
}

export default App
