import nodemailer from "nodemailer";
import env from "@infrastructure/providers/env/env.validation";

export const sendInviteEmail = async (email: string, inviteLink: string) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: env.EMAIL_USER,
			pass: env.EMAIL_PASS,
		},
	});

	await transporter.sendMail({
		from: `Sprintly <${process.env.EMAIL_USER}>`,
		to: email,
		subject: "You're invited to join Sprintly",
		html: `
      <p>You have been invited to join Sprintly.</p>
      <p>Click below to create your account:</p>
      <a href="${inviteLink}">${inviteLink}</a>
      <p>This link expires in 48 hours.</p>
    `,
	});
};
