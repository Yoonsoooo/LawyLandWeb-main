var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    //port:8081,
    secure: true, //true는 465
    auth: {
      user: "lawyland2021@gmail.com",
      pass: "vfuqrzapcmmbaeqh",
    },
  });
module.exports = transporter;