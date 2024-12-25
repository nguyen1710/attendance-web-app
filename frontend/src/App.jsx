import { useState } from 'react'
import { Route, Routes} from 'react-router-dom'
// import Classroom from '../../backend/classroom-service/models/classroom.model'
import Login from './components/Login/Login.jsx'
import Home from './components/HomePage/Home.jsx'
import SignUp from './components/Login/SignUp.jsx'
import VerifyEmail from './components/Login/VerifyEmail.jsx'
import { Toaster } from 'react-hot-toast'
function App() {

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/verify' element={<VerifyEmail/>}/>
        <Route path='/home' element={<Home/>}/>
      </Routes>

      <Toaster position="top-right" reverseOrder={false}/>
    </>
  )
}

export default App
