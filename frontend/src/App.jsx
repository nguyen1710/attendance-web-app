import { useState } from 'react'
import { Route, Routes, useLocation} from 'react-router-dom'
// import Classroom from '../../backend/classroom-service/models/classroom.model'
import Login from './components/Login/Login.jsx'
import Home from './components/HomePage/Home.jsx'
import SignUp from './components/Login/SignUp.jsx'
import VerifyEmail from './components/Login/VerifyEmail.jsx'
import { Toaster } from 'react-hot-toast'

import Sidebar from './components/common/Sidebar.jsx'

import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const location = useLocation(); // Dùng để kiểm tra route hiện tại

  // Các route hoàn toàn độc lập
  const standaloneRoutes = ["/login", "/signup", "/verify"];
  const isStandaloneRoute = standaloneRoutes.includes(location.pathname);

  if (isStandaloneRoute) {
    // Nếu là route độc lập, render trực tiếp route đó
    return (
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify" element={<VerifyEmail />} />
        </Routes>
        <Toaster position="top-right" reverseOrder={false} />
      </>
    );
  }
  
  return (
    // <>
    //   <Routes>
    //     <Route path="/" element={<Sidebar/>}/>
        // <Route path='/login' element={<Login/>}/>
        // <Route path='/signup' element={<SignUp/>}/>
        // <Route path='/verify' element={<VerifyEmail/>}/>
    //     <Route path='/home' element={<Home/>}/>
    //   </Routes>

    //   <Toaster position="top-right" reverseOrder={false}/>
    // </>

    <div  className='flex h-screen bg-blue-900 text-gray-100 overflow-hidden'>
        <div className='fixed inset-0 z-10'>
            <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
            <div className='absolute inset-0 backdrop-blur-sm' />
        </div>
      
        <Sidebar />
        <Routes>
            <Route path='/' element={<OverviewPage />} />
            <Route path='/products' element={<ProductsPage />} />
            <Route path='/users' element={<UsersPage />} />
            <Route path='/sales' element={<SalesPage />} />
            <Route path='/orders' element={<OrdersPage />} />
            <Route path='/analytics' element={<AnalyticsPage />} />
            <Route path='/settings' element={<SettingsPage />} />
        </Routes>
    </div>
  
  )
}

export default App
