import jwt from "jsonwebtoken"

const generateTokenAndSetCookie = (res, userEmail, userRole) => {
    const token = jwt.sign({userEmail, userRole}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token, {
        httpOnly: true, // prevent XSS attach
        secure: process.env.NODE_ENV === "prouction",
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: "localhost"
    })

    return token
}

export default generateTokenAndSetCookie

