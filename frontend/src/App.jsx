import { useState } from 'react'
import { Route, Routes, useLocation} from 'react-router-dom'
// import Classroom from '../../backend/classroom-service/models/classroom.model'
import Login from './pages/Login/Login.jsx'
import Home from './pages/HomePage/Home.jsx'
import SignUp from './pages/Login/SignUp.jsx'
import VerifyEmail from './pages/Login/VerifyEmail.jsx'
import { Toaster } from 'react-hot-toast'

import Sidebar from './components/common/Sidebar.jsx'


//admin
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import ClassDetail from './pages/HomePage/ClassDetail.jsx'
import AdminLogin from './components/admin/login/adminLogin.jsx';
import ClassDetailUsers from './pages/HomePage/ClassDetailUsers.jsx'
import AttendanceSession from './pages/Attendances/AttendanceSession.jsx'
import AttendanceForm from './pages/Attendances/AttendanceForm.jsx'
function App() {
  const location = useLocation(); // Dùng để kiểm tra route hiện tại

  // const classroomRoutes = ["/classroom"];
  // const isClassroomRoute = classroomRoutes.includes(location.pathname);
  const isClassroomRoute = location.pathname.startsWith("/classroom");

  if (isClassroomRoute) {
    // Nếu là route độc lập, render trực tiếp route đó
    return (

      <div  className='flex h-screen bg-blue-900 text-gray-100 overflow-hidden'>
        <div className='fixed inset-0 z-10'>
            <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
            <div className='absolute inset-0 backdrop-blur-sm' />
        </div>
        <Routes>
            <Route path="/classroom/:id" element={<ClassDetail />} />
            <Route path="/classroom/:id/users" element={<ClassDetailUsers />} />
            <Route path="/classroom/attendance/:id" element={<AttendanceSession/>}/>

        </Routes>
        <Toaster position="top-right" reverseOrder={false} />

    </div>
    );
  }

  // Các route hoàn toàn độc lập
  const standaloneRoutes = ["/login", "/signup", "/verify", "/admin/login", "/", "/attendance/form/:id"];
  // const isStandaloneRoute = standaloneRoutes.includes(location.pathname);
  const isStandaloneRoute = standaloneRoutes.some(route =>
    route === location.pathname || (route.includes("/:id") && location.pathname.startsWith(route.split("/:id")[0]))
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
        </Routes>
        <Toaster position="top-right" reverseOrder={false} />
      </>
    );
  }
  
  return (
    <div  className='flex h-screen bg-blue-900 text-gray-100 overflow-hidden'>
        <div className='fixed inset-0 z-10'>
            <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
            <div className='absolute inset-0 backdrop-blur-sm' />
        </div>
      
        <Sidebar />
        <Routes>

            <Route path='/admin' element={<OverviewPage />} />
            <Route path='/admin/products' element={<ProductsPage />} />
            <Route path='/admin/users' element={<UsersPage />} />
            <Route path='/admin/sales' element={<SalesPage />} />
            <Route path='/admin/orders' element={<OrdersPage />} />
            <Route path='/admin/analytics' element={<AnalyticsPage />} />
            <Route path='/admin/settings' element={<SettingsPage />} />
        </Routes>
    </div>
  )
}

export default App
