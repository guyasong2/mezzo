const NOTIFICATION_EMAILS = [
  "tebahstephen38@gmail.com",
  "guyasong1@gmail.com",
  "info@stevemezzoimages.com",
];

interface BookingEmailData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  packageName: string;
  sessionDate: string;
  sessionTime: string;
  location?: string | null;
  message?: string | null;
}

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}

async function getResend() {
  const { Resend } = await import("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendBookingNotification(data: BookingEmailData) {
  const resend = await getResend();
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const toEmails = NOTIFICATION_EMAILS;
  console.log("[Email] Sending booking notification to:", toEmails, "from:", fromEmail);
  console.log("[Email] API key present:", !!process.env.RESEND_API_KEY);
  const { data: result, error } = await resend.emails.send({
    from: `Steve Mezzo Images <${fromEmail}>`,
    to: toEmails,
    subject: `New Booking: ${data.packageName} - ${data.clientName}`,
    html: `
      <h2>New Booking Request</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px">
        <tr><td style="padding:8px;font-weight:bold">Client</td><td style="padding:8px">${data.clientName}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${data.clientEmail}">${data.clientEmail}</a></td></tr>
        <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${data.clientPhone}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Package</td><td style="padding:8px">${data.packageName}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Date</td><td style="padding:8px">${data.sessionDate}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Time</td><td style="padding:8px">${data.sessionTime}</td></tr>
        ${data.location ? `<tr><td style="padding:8px;font-weight:bold">Location</td><td style="padding:8px">${data.location}</td></tr>` : ""}
        ${data.message ? `<tr><td style="padding:8px;font-weight:bold">Notes</td><td style="padding:8px">${data.message}</td></tr>` : ""}
      </table>
    `,
  });
  if (error) {
    console.error("[Email] Booking email FAILED:", JSON.stringify(error));
    throw new Error(`Email send failed: ${error.message}`);
  }
  console.log("[Email] Booking email sent successfully, id:", result?.id);
  return { data: result, error };
}

export async function sendContactNotification(data: ContactEmailData) {
  const resend = await getResend();
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const toEmails = NOTIFICATION_EMAILS;
  console.log("[Email] Sending contact notification to:", toEmails, "from:", fromEmail);
  console.log("[Email] API key present:", !!process.env.RESEND_API_KEY);
  const { data: result, error } = await resend.emails.send({
    from: `Steve Mezzo Images <${fromEmail}>`,
    to: toEmails,
    replyTo: data.email,
    subject: `Contact Form: ${data.subject}`,
    html: `
      <h2>New Contact Message</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px">
        <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${data.name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${data.phone}</td></tr>` : ""}
        <tr><td style="padding:8px;font-weight:bold">Subject</td><td style="padding:8px">${data.subject}</td></tr>
      </table>
      <h3 style="margin-top:20px">Message</h3>
      <p style="white-space:pre-wrap">${data.message}</p>
    `,
  });
  if (error) {
    console.error("[Email] Contact email FAILED:", JSON.stringify(error));
    throw new Error(`Email send failed: ${error.message}`);
  }
  console.log("[Email] Contact email sent successfully, id:", result?.id);
  return { data: result, error };
}
