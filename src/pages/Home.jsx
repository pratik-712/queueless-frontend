
import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import "../styles/home.css";

function Icon({ name, size = 20 }) {
  const paths = {
    arrow: <><path d="M7 17 17 7" /><path d="M7 7h10v10" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    radio: <><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    ticket: <><path d="M2 9a3 3 0 0 0 0 6v4h20v-4a3 3 0 0 0 0-6V5H2Z" /><path d="M13 5v2m0 4v2m0 4v2" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const features = [
  {
    icon: <Icon name="radio" />,
    title: "Know where the line stands",
    text: "See queue movement and your place in line without hovering around a counter."
  },
  {
    icon: <Icon name="clock" />,
    title: "Make waiting predictable",
    text: "Get a clearer picture of the wait so you can spend that time elsewhere."
  },
  {
    icon: <Icon name="shield" />,
    title: "A calmer service experience",
    text: "One simple flow for customers and the teams serving them."
  }
];

export default function Home() {
  return (
    <>
      <section className="hero section-wrap">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="live-dot" /> QUEUE INTELLIGENCE, REIMAGINED
          </span>

          <h1>Waiting is<br /><em>outdated.</em><br />Your time isn't.</h1>

          <p className="hero-description">
            Join a queue digitally, follow your turn in real time, and arrive
            when it matters. QueueLess puts people before the line.
          </p>

          <div className="hero-actions">
            <Link className="button button-lime" to="/customer">
              Find a queue <Icon name="arrow" size={18} />
            </Link>
            <a className="button button-ghost" href="#how-it-works">
              See how it works
            </a>
          </div>

          <div className="hero-proof">
            <span><Icon name="users" size={16} /> For customers</span>
            <span><Icon name="ticket" size={16} /> For service teams</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />

          <div className="queue-preview">
            <div className="preview-top">
              <div>
                <span className="tiny-label">LIVE SERVICE SNAPSHOT</span>
                <h3>General consultation</h3>
              </div>
              <span className="live-pill"><i /> LIVE</span>
            </div>

            <div className="preview-number">
              <div>
                <span className="tiny-label">YOUR DEMO TOKEN</span>
                <strong>A012</strong>
              </div>
              <span className="status-tag">WAITING</span>
            </div>

            <div className="progress-track"><span /></div>

            <div className="preview-stats">
              <div><strong>03</strong><span>People ahead</span></div>
              <div><strong>~18<span> min</span></strong><span>Est. waiting time</span></div>
            </div>

            <div className="next-call">
              <span className="next-icon"><Icon name="radio" size={17} /></span>
              <div>
                <b>Queue is moving</b>
                <small>Stay updated. We'll keep your place.</small>
              </div>
              <span className="signal-bars"><i /><i /><i /><i /></span>
            </div>
          </div>

          <div className="floating-note">
            <span className="note-icon"><Icon name="clock" size={17} /></span>
            <div>
              <b>Your time, returned.</b>
              <small>Wait on your terms.</small>
            </div>
          </div>

          <span className="visual-caption">
            A BETTER WAY TO WAIT <span>↗</span>
          </span>
        </div>
      </section>

      <section className="ticker">
        <div>
          LESS WAITING <b>✳</b> MORE LIVING <b>✳</b> BETTER SERVICE
          <b>✳</b> LESS WAITING <b>✳</b> MORE LIVING <b>✳</b> BETTER SERVICE
        </div>
      </section>

      <section className="section-wrap how-section" id="how-it-works">
        <SectionTitle
          eyebrow="THE FLOW"
          title="Three steps. A lot less standing."
          description="From finding a service to knowing when it's your turn."
          centered
        />

        <div className="steps-grid">
          <article>
            <span className="step-index">01 / DISCOVER</span>
            <div className="step-symbol"><Icon name="users" /></div>
            <h3>Choose your service</h3>
            <p>Find an organization and select the queue that matches what you need.</p>
          </article>

          <article>
            <span className="step-index">02 / JOIN</span>
            <div className="step-symbol"><Icon name="ticket" /></div>
            <h3>Get your token</h3>
            <p>Enter your name and receive a digital token—no physical line required.</p>
          </article>

          <article>
            <span className="step-index">03 / TRACK</span>
            <div className="step-symbol"><Icon name="radio" /></div>
            <h3>Follow your turn</h3>
            <p>Check your position and status, then head over when you're called.</p>
          </article>
        </div>
      </section>

      <section className="feature-band" id="services">
        <div className="section-wrap feature-inner">
          <SectionTitle
            eyebrow="BUILT FOR BOTH SIDES"
            title="One platform. Two better experiences."
            description="QueueLess connects the people waiting with the teams managing the wait."
          />

          <div className="feature-list">
            {features.map((feature) => (
              <article key={feature.title}>
                <span className="feature-icon">{feature.icon}</span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-cta section-wrap">
        <div>
          <span className="eyebrow">TAKE BACK YOUR TIME</span>
          <h2>The next time you wait,<br /><em>make it count.</em></h2>
        </div>
        <Link to="/customer" className="button button-lime">
          Explore queues <Icon name="arrow" size={18} />
        </Link>
      </section>
    </>
  );
}
