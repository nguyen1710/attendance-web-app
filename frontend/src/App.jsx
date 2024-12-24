import { useState } from 'react'
import { Route, Routes} from 'react-router-dom'
// import Classroom from '../../backend/classroom-service/models/classroom.model'
import Login from './components/Login/Login.jsx'
function App() {

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </>
  )
}

export default App
