import React from 'react'
import Logo from '~/public/img/logo.png'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(localStorage.getItem('user'));
  useEffect(() => {
    // const storedToken = localStorage.getItem('token');

    if (!user ) {
        // Nếu không có token hoặc thông tin người dùng, chuyển hướng về trang đăng nhập
        navigate('/login');
    } else {
        setUser(JSON.parse(user));
    }
}, [navigate]);

  return (
    <>
      <h1>Helllo</h1>
      <h1>{user.email}</h1>
      <h1>{user.username}</h1>
    </>
  
  )
}

export default Home