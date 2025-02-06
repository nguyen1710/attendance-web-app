import { io } from 'socket.io-client'

const value = localStorage.getItem("email");


const socket = io.connect("http://localhost:4000")
// let cleanEmail = value.replace(/^"|"$/g, '');
// socket.emit("register", {email: cleanEmail});

export default socket