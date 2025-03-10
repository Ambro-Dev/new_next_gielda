import React from "react";
import { createTransport } from "nodemailer";
import { url } from "inspector";

type Props = {
  username: string;
  email: string;
  link: string;
};

function html(params: { username: string; link: string }) {
  const { username, link } = params;

  const brandColor = "#5886e8";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#fff",
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 0px 0px 20px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Witaj ${username}, wchodząc w link poniżej lub klikając przycisk będziesz mógł/mogła zresetować hasło.
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 20px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        ${link}
      </td>
        </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 20px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Kliknij poniższy przycisk aby zresetować hasło.
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${link}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Resetuj hasło</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Jeśli nie Ty wysłałeś prośbę o zmianę hasła, zignoruj tą wiadomość.
      </td>
    </tr>
  </table>
</body>
`;
}

const sendResetPassword = async ({ username, email, link }: Props) => {
  const transporter = createTransport(process.env.EMAIL_SERVER);
  const result = await transporter.sendMail({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Reset hasła dla Giełda Fenilo",
    text: `Witaj ${username}! Link do zmiany hasła (aktywny 24h): ${link}`,
    html: html({ username, link }),
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    console.error("Failed to send email to", failed);
    return false;
  }
};

export default sendResetPassword;
