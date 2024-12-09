import {MailtrapClient} from "mailtrap"
import dotenv from "dotenv"
dotenv.config()
const TOKEN = "a263149dbc8ea1cf566d430e5baf6479"
// const ENDPOINT = process.env.MAIL_TRAP_ENDPOINT

console.log(TOKEN)

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
})

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Nguyen Thanh Nguyen",
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


  