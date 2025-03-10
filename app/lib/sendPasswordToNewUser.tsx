import React from "react";
import { createTransport } from "nodemailer";
import { url } from "inspector";

type Props = {
  username: string;
  email: string;
  password: string;
  name: string;
};

function html(params: { username: string; password: string; name: string }) {
  const { username, password, name } = params;

  const host = `${process.env.NEXTAUTH_URL}/signin`;

  const escapedHost = host.replace(/\./g, "&#8203;.");

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
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Zaloguj się do <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 20px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Witaj ${name}, możesz zacząć korzystać z ${escapedHost}.
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 20px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Twój login to: ${username}
      </td>
      </tr>
      <tr>
      <td align="center"
        style="padding: 0px 0px 20px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Twoje hasło to: ${password}
      </td>
    <tr>
      <td align="center"
        style="padding: 0px 0px 20px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Kliknij poniższy przycisk aby się zalogować.
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${host}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Zaloguj się</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Jeśli nie zakładałeś konta na ${escapedHost}, zignoruj tę wiadomość.
      </td>
    </tr>
  </table>
</body>
`;
}

const sendPasswordToNewUser = async ({
  username,
  email,
  password,
  name,
}: Props) => {
  const transporter = createTransport(process.env.EMAIL_SERVER);
  const result = await transporter.sendMail({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Witaj w Giełda Fenilo",
    text: `Witaj ${username}! Twoje hasło to: ${password}`,
    html: html({ username, password, name }),
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    console.error("Failed to send email to", failed);
    return false;
  }
};

export default sendPasswordToNewUser;
