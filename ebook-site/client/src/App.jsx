import { ArrowRight, Check, X, Star, ShieldCheck, Mail, BookOpen } from 'lucide-react'
import cover from './assets/ebook-cover.png'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4242'

function SectionLabel({ number, children, dark = false }) {
  return <div className={`section-label ${dark ? 'label-dark' : ''}`}>{number} <span /> {children}</div>
}

function PriceBlock({ compact = false }) {
  const buy = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";

      const res = await fetch(`${apiUrl}/api/create-checkout-session`, {
        method: "POST",
      });
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao criar checkout')
      window.location.href = data.url
    } catch (err) {
      alert('Não foi possível abrir o pagamento. Confirma se o servidor está ligado.')
      console.error(err)
    }
  }

  return <div className={`price-block ${compact ? 'price-compact' : ''}`}>
    <div className="price-row">
      <span className="old-price">$16.99</span>
      <span className="price">$9.99</span>
      <span className="discount">40% OFF</span>
    </div>
    <button onClick={buy} className="primary-btn">GET THE BOOK NOW <ArrowRight size={18} /></button>
    <p className="microcopy">Pay with card · PDF delivered automatically by email</p>
  </div>
}

function App() {
  return <main>
    <nav className="nav">
      <a href="#top" className="brand">The Resell Path</a>
      <a href="#price" className="nav-link">Get the book →</a>
    </nav>

    <section id="top" className="hero section">
      <div className="hero-copy">
        <p className="eyebrow">THE EBOOK</p>
        <h1>Stop Buying Wrong.<br /><span>Start Building a Real Resell Income.</span></h1>
        <p className="hero-sub">Most resellers don't fail because of effort. They fail because they buy wrong. This ebook shows you exactly how to fix that.</p>
        <PriceBlock />
      </div>
      <div className="mockup-wrap">
        <div className="book-mockup">
          <img src={cover} alt="The Resell Path ebook cover" />
        </div>
      </div>
    </section>

    <section className="section problem">
      <SectionLabel number="01">THE PROBLEM</SectionLabel>
      <h2>Why most resellers never make real money.</h2>
      <div className="problem-list">
        {[
          "Buying items that don't sell",
          'Paying too much and killing margins',
          'Following random advice from “gurus”',
          'No clear system or path'
        ].map((item) => <div className="problem-item" key={item}><X size={20} /><span>{item}</span></div>)}
      </div>
    </section>

    <section className="section solution">
      <SectionLabel number="02">THE SOLUTION</SectionLabel>
      <h2>A clear path that actually works.</h2>
      <p>The Resell Path is a step-by-step system designed to take you from beginner to consistent reseller. No fluff. No fake promises. Just a clear framework.</p>
    </section>

    <section className="section dark-section">
      <SectionLabel number="03" dark>WHAT YOU GET</SectionLabel>
      <h2>Everything you need to build consistent profit.</h2>
      <div className="dark-list">
        {[
          'A complete resell system from beginner to advanced',
          'A clear path with defined levels',
          'Real strategies to avoid bad buys',
          'A system to build consistent profit',
          'A mindset that keeps you growing'
        ].map((item, index) => <div className="dark-item" key={item}>
          <span className="num">{String(index + 1).padStart(2, '0')}</span><Check size={19} /><span>{item}</span>
        </div>)}
      </div>
    </section>

    <section className="quote section-small">
      <p>“This is not a get-rich-quick guide.<br />It's a practical system based on real reselling principles.”</p>
    </section>

    <section className="section learn">
      <SectionLabel number="04">WHAT YOU WILL LEARN</SectionLabel>
      <h2>From first sale to a real resell system.</h2>
      <div className="grid cards">
        {[
          ['The Beginning', 'Photos, titles, descriptions, market study and choosing a niche.'],
          ['First Wins', 'How to pick your first item, make your first sale and reach 25 sales.'],
          ['Consistency', 'Bundles, packaging, reinvestment and the 100-sale rhythm.'],
          ['Adversity', 'Returns, disputes, damaged items and how to stay calm.'],
          ['Scale', 'Reinvesting profit, surviving the boring middle and scaling to 500 sales.'],
          ['Final Level', 'Daily orders, high-volume systems and the 1000-sale mindset.']
        ].map(([title, text]) => <article className="card" key={title}><BookOpen size={22} /><h3>{title}</h3><p>{text}</p></article>)}
      </div>
    </section>

    <section className="section for-who">
      <SectionLabel number="05">WHO IT IS FOR</SectionLabel>
      <h2>Made for people who want a simple path, not random tips.</h2>
      <div className="split">
        <div>
          <h3>This ebook is for you if...</h3>
          <ul>
            <li>You want to start reselling but don't know what to buy.</li>
            <li>You already sell, but your profit is inconsistent.</li>
            <li>You want a practical framework instead of hype.</li>
          </ul>
        </div>
        <div>
          <h3>It is not for you if...</h3>
          <ul>
            <li>You expect overnight money without execution.</li>
            <li>You don't want to track numbers or learn from mistakes.</li>
            <li>You are looking for fake screenshots and empty promises.</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="section testimonials">
      <SectionLabel number="06">SOCIAL PROOF</SectionLabel>
      <h2>Built for serious beginners.</h2>
      <div className="grid testimonials-grid">
        {[1, 2, 3].map((n) => <article className="testimonial" key={n}>
          <div className="stars"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
          <p>“Clear, direct and practical. This helped me understand what to focus on before buying more stock.”</p>
          <strong>Early reader #{n}</strong>
        </article>)}
      </div>
    </section>

    <section id="price" className="section final-cta">
      <h2>If you keep buying wrong,<br /><span>you keep losing money.</span></h2>
      <p>Fix the foundation. Build consistency. Scale correctly.</p>
      <PriceBlock compact />
      <div className="trust-row"><ShieldCheck size={18} /> Secure Stripe checkout <Mail size={18} /> PDF sent by email after payment</div>
    </section>

    <section className="section faq">
      <SectionLabel number="07">FAQ</SectionLabel>
      <h2>Questions before buying.</h2>
      {[
        ['How do I receive the ebook?', 'After payment, Stripe confirms the purchase and the PDF is sent automatically to the checkout email.'],
        ['Is this instant?', 'Yes. The email is sent as soon as the payment is confirmed by the Stripe webhook.'],
        ['Can I edit the site?', 'Yes. All text, colors, price and sections are inside React and CSS files.'],
        ['Is the PDF public?', 'No. In this setup the PDF stays inside the backend private folder and is only attached after payment.']
      ].map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
    </section>

    <footer className="footer">
      <strong>The Resell Path</strong>
      <p>© 2026 All rights reserved.</p>
    </footer>
  </main>
}

export default App
