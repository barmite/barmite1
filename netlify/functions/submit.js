exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }
  try {
    const data = JSON.parse(event.body || "{}");
    const { name, email, phone, guests, message } = data;
    if (!name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name and email are required" }),
      };
    }
    const text = `
New Invitation Response
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Guests: ${guests || "Not specified"}
Message: ${message || "None"}
    `.trim();
    const telegramUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text: text,
      }),
    });
    const tgResult = await response.json();
    if (!response.ok || !tgResult.ok) {
      console.error("Telegram error:", tgResult);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to send to Telegram" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};
