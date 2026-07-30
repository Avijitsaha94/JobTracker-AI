import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInterviewReminder(
  toEmail: string,
  userName: string,
  companyName: string,
  position: string,
  interviewDate: Date
) {
  const formattedDate = interviewDate.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  await resend.emails.send({
    from: "JobTrackr AI <onboarding@resend.dev>",
    to: toEmail,
    subject: `Reminder: Interview with ${companyName} tomorrow`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Hi ${userName},</h2>
        <p>This is a friendly reminder that you have an upcoming interview:</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Company:</strong> ${companyName}</p>
          <p style="margin: 4px 0;"><strong>Position:</strong> ${position}</p>
          <p style="margin: 4px 0;"><strong>Date & Time:</strong> ${formattedDate}</p>
        </div>
        <p>Good luck! You've got this. 💪</p>
        <p style="color: #888; font-size: 12px;">— JobTrackr AI</p>
      </div>
    `,
  });
}