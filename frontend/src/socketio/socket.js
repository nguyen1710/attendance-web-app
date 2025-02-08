import { io } from 'socket.io-client'

const value = localStorage.getItem("email");
const API_URL_BASE = import.meta.env.VITE_API_BASE_URL;


const socket = io.connect(API_URL_BASE)

if(value) {
  let cleanEmail = value.replace(/^"|"$/g, '');
  socket.emit("register", {email: cleanEmail});
}


export default socket
