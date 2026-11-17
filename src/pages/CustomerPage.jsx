
import { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle";
import StatCard from "../components/StatCard";
import { api } from "../services/api";
import "../styles/customer.css";

function Icon({ name, size = 18 }) {
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
    refresh: <><path d="M20 7v5h-5" /><path d="M4 17v-5h5" /><path d="M5.6 9a7 7 0 0 1 11.5-2L20 12M4 12l2.9 5a7 7 0 0 0 11.5-2" /></>,
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

export default function CustomerPage() {
  const [organizations, setOrganizations] = useState([]);
  const [queues, setQueues] = useState([]);
  const [organizationId, setOrganizationId] = useState("");
  const [queueId, setQueueId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [token, setToken] = useState(null);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    loadOrganizations();
  }, []);

  async function loadOrganizations() {
    try {
      setError("");
      const data = await api.getOrganizations();
      setOrganizations(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    }
  }

  async function loadQueues(id) {
    setOrganizationId(id);
    setQueueId("");
    setQueues([]);
    setNotice("");
    setError("");

    if (!id) return;

    try {
      const data = await api.getQueuesForOrganization(id);
      setQueues(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    }
  }

  async function joinQueue(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    setToken(null);
    setPosition(null);

    try {
      const data = await api.createToken(queueId, customerName.trim());
      setToken(data);
      setNotice("You're in the queue. Keep your token number handy.");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function checkPosition() {
    if (!token?.id) return;

    try {
      const data = await api.getPosition(token.id);
      setPosition(data);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="page-wrap section-wrap">
      <SectionTitle
        eyebrow="CUSTOMER SPACE"
        title="Your place in line, without the line."
        description="Choose an organization, pick a service and get your digital token."
      />

      <div className="customer-layout">
        <form className="panel join-panel" onSubmit={joinQueue}>
          <div className="panel-heading">
            <span className="panel-icon"><Icon name="ticket" /></span>
            <div>
              <h3>Join a queue</h3>
              <p>It only takes a moment.</p>
            </div>
          </div>

          <label>
            Your name
            <input
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Enter your full name"
              required
              pattern="[a-zA-Z ]+"
              title="Use letters and spaces only"
            />
          </label>

          <label>
            Organization
            <select
              value={organizationId}
              onChange={e => loadQueues(e.target.value)}
              required
            >
              <option value="">Select an organization</option>
              {organizations.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </label>

          <label>
            Service queue
            <select
              value={queueId}
              onChange={e => setQueueId(e.target.value)}
              required
              disabled={!organizationId}
            >
              <option value="">Select a queue</option>
              {queues.map(q => (
                <option key={q.id} value={q.id}>{q.name}</option>
              ))}
            </select>
          </label>

          <button
            className="button button-lime button-full"
            disabled={loading || !queueId}
          >
            {loading ? "Joining..." : "Get my token"}
            <Icon name="arrow" size={17} />
          </button>

          {error && <p className="alert error">{error}</p>}
          {notice && <p className="alert success">{notice}</p>}
        </form>

        <aside className="panel token-panel">
          <span className="eyebrow">YOUR QUEUE PASS</span>

          {token ? (
            <>
              <div className="token-ticket">
                <span>TOKEN NUMBER</span>
                <strong>
                  {token.tokenNumber || token.token_number || `#${token.id}`}
                </strong>
                <small>{token.customerName || customerName}</small>
              </div>

              <div className="token-actions">
                <button
                  className="button button-ghost button-full"
                  onClick={checkPosition}
                  type="button"
                >
                  <Icon name="refresh" size={16} />
                  Check my position
                </button>
              </div>

              {position && (
                <div className="position-result">
                  <StatCard
                    label="Your position"
                    value={position.position ?? position.queuePosition ?? JSON.stringify(position)}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="empty-token">
              <span className="empty-ticket"><Icon name="ticket" size={30} /></span>
              <h3>Your token will appear here.</h3>
              <p>Once you join a queue, this panel becomes your digital queue pass.</p>
            </div>
          )}
        </aside>
      </div>

      <div className="customer-footnote">
        <Icon name="users" size={17} />
        Queue information is retrieved from your QueueLess backend. If no
        organizations appear, check that the backend is running.
      </div>
    </div>
  );
}
