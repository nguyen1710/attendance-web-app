import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()
const TOKEN = "a263149dbc8ea1cf566d430e5baf6479"
// const ENDPOINT = process.env.MAIL_TRAP_ENDPOINT

console.log(TOKEN)

// Tạo transporter sử dụng dịch vụ email của bạn (ví dụ Gmail)
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Email của bạn
    pass: process.env.EMAIL_PASSWORD, // Mật khẩu ứng dụng (app password) của email
  },
});

export const sender = {
  email: process.env.EMAIL_USER,
  name: "Admin",
}
// const recipients = [
//   {
//     email: "nguyenthanhnguyen17102003@gmail.com",
//   }
// ]

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error)


  