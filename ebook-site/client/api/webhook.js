import Stripe from "stripe";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

async function readRawBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

async function sendEbookEmail(customerEmail) {
  const possiblePaths = [
    path.join(process.cwd(), "private", "The_Resell_Path.pdf"),
    path.join(process.cwd(), "client", "private", "The_Resell_Path.pdf"),
    path.join("/var/task", "private", "The_Resell_Path.pdf"),
    path.join("/var/task", "client", "private", "The_Resell_Path.pdf"),
  ];

  const pdfPath = possiblePaths.find((filePath) => fs.existsSync(filePath));

  if (!pdfPath) {
    console.error("PDF not found. Checked paths:", possiblePaths);
    throw new Error("PDF file not found");
  }

  const pdfBuffer = fs.readFileSync(pdfPath);

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: "Your ebook: The Resell Path",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Thank you for your purchase!</h2>
        <p>Here is your ebook attached: <strong>The Resell Path</strong>.</p>
        <p>Start with the first chapter and execute the system step by step.</p>
        <p>Best,<br/>The Resell Path</p>
      </div>
    `,
    attachments: [
      {
        filename: "The_Resell_Path.pdf",
        content: pdfBuffer.toString("base64"),
      },
    ],
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const signature = req.headers["stripe-signature"];

  let event;

  try {
    const rawBody = await readRawBody(req);

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const customerEmail =
        session.customer_details?.email || session.customer_email;

      if (!customerEmail) {
        console.error("No customer email found in checkout session");
        return res.status(400).send("No customer email found");
      }

      await sendEbookEmail(customerEmail);

      console.log(`Ebook sent to ${customerEmail}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook handling error:", error);
    return res.status(500).send("Webhook handler failed");
  }
}