import nodemailer from "nodemailer";

 const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your app password
      },
      });

      const sendMail =async({to,subject,body})=> {
        const response = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to, // send to your own inbox
      subject,
      html: body,
        })
        return response;
    };

    export default sendMail;