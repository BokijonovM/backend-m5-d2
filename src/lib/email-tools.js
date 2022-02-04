import sgMail from "@sendgrid/mail";

import { getPDFReadableStream } from "./pdf-tools.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendRegistrationEmail = async newBlog => {
  try {
    const data = await getPDFReadableStream(newBlog, true);

    const msg = {
      to: newBlog.author.email,
      from: process.env.SENDER_EMAIL,
      subject: "New Post",
      text: "you created a new post",
      attachments: [
        {
          content: data.toString("base64"),
          filename: `${newBlog.title}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
          content_id: "mytext",
        },
      ],
    };

    const res = await sgMail.send(msg);
  } catch (error) {
    console.log({ errors: error.response.body.errors });
  }
};

// import sgMail from "@sendgrid/mail";

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// export const sendRegistrationEmail = async recipientAddress => {
//   const msg = {
//     to: recipientAddress,
//     from: process.env.SENDER_EMAIL,
//     subject: "Sending with SendGrid is Fun",
//     text: "and easy to do anywhere, even with Node.js",
//     html: "<strong>and easy to do anywhere, even with Node.js</strong>",
//   };

//   await sgMail.send(msg);
// };
