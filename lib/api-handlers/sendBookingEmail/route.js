import sgMail from "@sendgrid/mail";

const sendGridApiKey = process.env.SENDGRID_API_KEY;
if (sendGridApiKey?.startsWith("SG.")) {
  sgMail.setApiKey(sendGridApiKey);
}

export async function sendBookingEmail(user, bookingData) {
  if (!sendGridApiKey?.startsWith("SG.")) {
    console.warn("SendGrid is not configured; booking email skipped.");
    return;
  }

  const msg = {
    to: user.email,
    from: "admin@soldelnilo.com", // لازم يكون verified sender في SendGrid
    cc: "admin@soldelnilo.com",
    subject: "Your Trip Booking Confirmation",
    text: `
Dear ${user?.user_metadata?.name},

Your booking has been confirmed successfully.

Trip Details:
- Title: ${bookingData.title}
- Price: ${bookingData.price}
- Cities: ${bookingData.cities}
- Arrival Date: ${bookingData.arrivalDate}
- Departure Date: ${bookingData.departureDate}
- Number of Persons: ${bookingData.numPersons}
- Children: ${bookingData.hasChildren ? bookingData.numChildren : 0}
- Pets: ${bookingData.hasPets ? bookingData.petTypes.join(", ") : "None"}
- Guide Languages: ${bookingData.selectedLanguages.join(", ") || "None"}

For any assistance, please contact our admin:
- Phone: +20 100 123 4567
- Email: admin@soldelnilo.com

Best regards,
SolDelNilo Team
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully ✅");
  } catch (error) {
    console.error("Error sending email ❌", error);
  }
}
