import { verify } from "crypto";
import { transporter, sender } from "./nodeMailer.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";

export const sendVerificationEmail = async (email,verificationToken) => {
    const recipient = [{email}]
    console.log(email)
    try {
        const mailOptions = {
            from: `"${sender.name}" <${sender.email}>"`,
            to: email,
            subject: "Verify your emails",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        }
        await transporter.sendMail(mailOptions)
        console.log("Email sent successflly:", mailOptions)
    } catch (error) {
        console.log("Error sending email", error)
    }
}

export const sendWelcomEmail = async (email, name) => {
    const recipient = email
    console.log(email)
    try {
        const mailOptions = {
            from: `"${sender.name}" <${sender.email}>"`,
            to: recipient,
            subject: "Welcome to our website"
        }
        await transporter.sendMail(mailOptions);
        console.log("Email sent successflly:")
    } catch (error) {
        console.log("Error sending email", error)
    }
}