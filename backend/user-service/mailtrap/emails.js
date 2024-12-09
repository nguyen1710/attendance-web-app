import { verify } from "crypto";
import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";

export const sendVerificationEmail = async (email,verificationToken) => {
    const recipient = [{email}]
    console.log(email)
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your emails",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })
        console.log("Email sent successflly:", response)
    } catch (error) {
        console.log("Error sending email", error)
    }
}

export const sendWelcomEmail = async (email, name) => {
    const recipient = [{email}]
    console.log(email)
    try {
        await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "972f4fdc-613c-4b3f-bfc9-86051335c6c3",
            template_variables: {
            "company_info_name": "NN",
            "name": name,
            "company_info_address": "address",
            "company_info_city": "city",
            "company_info_zip_code": "Test_Company_info_zip_code",
            "company_info_country": "Test_Company_info_country"
            }
        })
        console.log("Email sent successflly:")
    } catch (error) {
        console.log("Error sending email", error)
    }
}