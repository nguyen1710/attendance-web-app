import React from 'react'
import Logo from '~/public/img/logo.png'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  useEffect(() => {
    // const storedToken = localStorage.getItem('token');

    if (!email || !username ) {
        // Nếu không có token hoặc thông tin người dùng, chuyển hướng về trang đăng nhập
        navigate('/login');
    } else {
      setUsername(JSON.parse(username));
      setEmail(JSON.parse(email));
    }
}, [navigate]);

  return (
    <>
      <h1>Helllo</h1>
      <h1>{email}</h1>
      <h1>{username}</h1>
    </>
  
  )
}

export default Home