import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import HeroScene from '../components/landing/HeroScene'
import styles from './LandingPage.module.css'

const EMBED_SNIPPET = `<script>
  window.BotForgeConfig = { apiKey: "bf_live_your_key_here" };
</script>
<script src="https://cdn.botforge.app/widget.js"></script>`

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    highlight: false,
    features: ['1 bot', '50 messages / day', 'PDF, DOCX & TXT knowledge', 'Widget embed'],
  },
  {
    name: 'Starter',
    price: '$29',
    period: '/ mo',
    highlight: true,
    features: ['3 bots', '1,000 messages / day', 'Everything in Free', 'Email support'],
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/ mo',
    highlight: false,
    features: ['Unlimited bots', '10,000 messages / day', 'Priority tweaks', 'Usage insights'],
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const token = useAuthStore((s) => s.token)

  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true })
  }, [token, navigate])

  if (token) return null

  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <span className={styles.logo}>BotForge</span>
        <nav className={styles.navLinks}>
          <a href="#integrate">Integrate</a>
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className={styles.navCt}>
          <Link to="/login" className={styles.signIn}>
            Sign in
          </Link>
          <Link to="/signup" className={styles.ctaNav}>
            Try free
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCanvas} aria-hidden>
          <HeroScene />
        </div>
        <div className={styles.heroOverlay} aria-hidden />
        <div className={styles.heroGrid} aria-hidden />
        <div className={styles.heroInner}>
          <p className={styles.badge}>
            <span className={styles.badgePulse} />
            AI chatbots for your site
          </p>
          <h1 className={styles.heroTitle}>
            Forge a bot that
            <span className={styles.heroGradient}> actually knows </span>
            your business.
          </h1>
          <p className={styles.heroLead}>
            Train with text, files, and FAQs—then drop one script on your site. No credit card to start.
          </p>
          <div className={styles.heroBtns}>
            <Link to="/signup" className={styles.heroCtaPrimary}>
              Start building — it's free
            </Link>
            <Link to="/login" className={styles.heroCtaGhost}>
              I have an account
            </Link>
          </div>
        </div>
      </section>

      <section id="integrate" className={styles.section}>
        <h2 className={styles.secTitle}>Add the widget in seconds</h2>
        <p className={styles.secLead}>
          Copy your API key from the dashboard, paste this snippet before{' '}
          <code>&lt;/body&gt;</code>, and you&apos;re live. The widget hits our secure endpoint with your
          key—visitors chat; you stay within your plan limits.
        </p>
        <pre className={styles.codeBlock}>
          <code>{EMBED_SNIPPET}</code>
        </pre>
        <ul className={styles.checkList}>
          <li>Use HTTPS pages in production for best security.</li>
          <li>Replace <code>bf_live_your_key_here</code> with the key from <strong>Test bot</strong>.</li>
          <li>Style conflicts? Load our script after your main CSS.</li>
        </ul>
      </section>

      <section id="how" className={styles.sectionAlt}>
        <h2 className={styles.secTitle}>How it works</h2>
        <div className={styles.steps}>
          {[
            { n: '01', t: 'Create & name', d: 'Set your bot’s knowledge—scope, tone, and what it should never guess.' },
            { n: '02', t: 'Train deeper', d: 'Drop in PDFs, DOCX, TXT, and FAQs so answers match your real docs.' },
            { n: '03', t: 'Embed & test', d: 'Grab the snippet, ship to production, and watch conversations in the app.' },
          ].map((s) => (
            <article key={s.n} className={styles.stepCard}>
              <span className={styles.stepNum}>{s.n}</span>
              <h3 className={styles.stepTitle}>{s.t}</h3>
              <p className={styles.stepDesc}>{s.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className={styles.section}>
        <h2 className={styles.secTitle}>Simple pricing</h2>
        <p className={styles.secLead}>Upgrade when you outgrow the free tier—same product, higher limits.</p>
        <div className={styles.pricingGrid}>
          {PLANS.map((p) => (
            <article
              key={p.name}
              className={`${styles.priceCard} ${p.highlight ? styles.priceCardHot : ''}`}
            >
              {p.highlight && <span className={styles.popular}>Popular</span>}
              <h3 className={styles.priceName}>{p.name}</h3>
              <p className={styles.priceTag}>
                <strong>{p.price}</strong>
                <span>{p.period}</span>
              </p>
              <ul className={styles.priceFeatures}>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link to="/signup" className={p.highlight ? styles.priceCta : styles.priceCtaOutline}>
                {p.name === 'Free' ? 'Start free' : 'Get started'}
              </Link>
            </article>
          ))}
        </div>
        <p className={styles.enterprise}>
          Need SAML, SLAs, or custom limits?{' '}
          <a href="mailto:sales@botforge.app" className={styles.link}>
            Talk to us about Enterprise
          </a>
          .
        </p>
      </section>

      <footer className={styles.footer}>
        <span className={styles.logo}>BotForge</span>
        <div className={styles.footerCt}>
          <Link to="/signup">Create free account</Link>
          <Link to="/login">Sign in</Link>
        </div>
      </footer>
    </div>
  )
}
