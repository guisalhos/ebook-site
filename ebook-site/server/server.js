import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import { Resend } from 'resend'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)

const PORT = process.env.PORT || 4242
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const PDF_PATH = path.join(__dirname, 'private', 'The_Resell_Path.pdf')

app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const customerEmail = session.customer_details?.email || session.customer_email
      const paymentStatus = session.payment_status

      if (paymentStatus === 'paid' && customerEmail) {
        await sendEbookEmail(customerEmail)
        console.log(`Ebook sent to ${customerEmail}`)
      }
    }

    res.json({ received: true })
  } catch (err) {
    console.error('Webhook handling failed:', err)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
})

app.use(cors({ origin: CLIENT_URL }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/create-checkout-session', async (_req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${CLIENT_URL}/?success=true`,
      cancel_url: `${CLIENT_URL}/?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error('Checkout session failed:', err)
    res.status(500).json({ error: 'Could not create Stripe Checkout Session' })
  }
})

async function sendEbookEmail(to) {
  const pdfBuffer = await fs.readFile(PDF_PATH)

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'The Resell Path <onboarding@resend.dev>',
    to,
    subject: 'Your ebook: The Resell Path',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h1>Thank you for your purchase!</h1>
        <p>Here is your ebook attached: <strong>The Resell Path</strong>.</p>
        <p>Start with the first chapter, apply the system, and keep building consistently.</p>
        <p>If you have any issue opening the PDF, reply to this email.</p>
      </div>
    `,
    attachments: [
      {
        filename: 'The_Resell_Path.pdf',
        content: pdfBuffer.toString('base64'),
      },
    ],
  })

  if (error) {
    throw new Error(JSON.stringify(error))
  }
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
