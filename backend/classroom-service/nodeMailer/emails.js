import { verify } from "crypto";
import { transporter, sender } from "./nodeMailer.config.js";
import { INVITE_EMAIL_TEMPLATE } from "./emailTemplate.js";

export const sendInviteEmail = async (email,className) => {
    const recipient = email
    console.log(email)
    try {
        const mailOptions = {
            from: `"${sender.name}" <${sender.email}>"`,
            to: recipient,
            subject: "Invitation",
            html: INVITE_EMAIL_TEMPLATE.replace("{className}", className)
        }
        await transporter.sendMail(mailOptions);
        console.log("Email sent successflly:")
    } catch (error) {
        console.log("Error sending email", error)
    }
}