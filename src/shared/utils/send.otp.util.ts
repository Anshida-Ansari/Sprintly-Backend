import nodemailer from 'nodemailer'
export const sendOtpEmail = async (email:string,otp:number)=>{

 const transporter  = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
 })

   await transporter.sendMail({
    from:`Sprintly <${process.env.EMAIL_USER}>`,
    to:email,
    subject:"Your OTP code",
    text:`Your OTP is: ${otp}. it expires in 3 minute`
 })

}