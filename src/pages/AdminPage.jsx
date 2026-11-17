
import { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle";
import StatCard from "../components/StatCard";
import { api } from "../services/api";
import "../styles/admin.css";

function Icon({ name, size = 18 }) {
  const paths = {
    arrow: <path d="M5 12h14M12 5l7 7-7 7" />,
    check: <path d="m5 12 4 4L19 6" />,
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.7l.4 2.8a2 2 0 0 1-.6 1.7L8.5 10.6a16 16 0 0 0 4.9 4.9l1.4-1.4a2 2 0 0 1 1.7-.6l2.8.4a2 2 0 0 1 1.7 2Z" /></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.6 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.4-3" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function AdminPage() {
  const [queues, setQueues] = useState([]);
  const [queueId, setQueueId] = useState("");
  const [tokens, setTokens] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    refreshQueues();
  }, []);

  useEffect(() => {
    if (queueId) refreshQueue(queueId);
  }, [queueId]);

  async function refreshQueues() {
    try {
      const data = await api.getQueues();
      setQueues(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    }
  }

  async function refreshQueue(id = queueId) {
    if (!id) return;

    try {
      setError("");
      const [tokenData, summaryData] = await Promise.all([
        api.getQueueTokens(id),
        api.getSummary(id)
      ]);
      setTokens(Array.isArray(tokenData) ? tokenData : []);
      setSummary(summaryData);
    } catch (e) {
      setError(e.message);
    }
  }

  async function callNext() {
    setBusy(true);
    setError("");

    try {
      await api.callNext(queueId);
      await refreshQueue();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function completeToken(id) {
    setBusy(true);
    setError("");

    try {
      await api.updateTokenStatus(id, "COMPLETED");
      await refreshQueue();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-wrap section-wrap">
      <SectionTitle
        eyebrow="OPERATIONS CONSOLE"
        title="Run the queue. Not after it."
        description="A focused workspace for service teams to monitor customers and move the line forward."
      />

      <div className="admin-toolbar panel">
        <div>
          <span className="tiny-label">ACTIVE SERVICE</span>
          <h3>Queue operations</h3>
        </div>

        <div className="toolbar-controls">
          <select value={queueId} onChange={e => setQueueId(e.target.value)}>
            <option value="">Choose a queue</option>
            {queues.map(q => (
              <option key={q.id} value={q.id}>{q.name}</option>
            ))}
          </select>

          <button
            className="icon-button"
            onClick={() => refreshQueue()}
            disabled={!queueId}
            aria-label="Refresh"
          >
            <Icon name="refresh" size={17} />
          </button>
        </div>
      </div>

      {error && <p className="alert error">{error}</p>}

      {queueId ? (
        <>
          <div className="stats-grid">
            <StatCard label="Waiting" value={summary?.waiting ?? summary?.waitingCount ?? "—"} detail="Customers in line" />
            <StatCard label="Called" value={summary?.called ?? summary?.calledCount ?? "—"} detail="Currently called" />
            <StatCard label="Completed" value={summary?.completed ?? summary?.completedCount ?? "—"} detail="Served customers" />
          </div>

          <div className="operations-actions">
            <button className="button button-lime" onClick={callNext} disabled={busy}>
              <Icon name="phone" size={17} /> Call next customer
            </button>

            <button className="button button-ghost" onClick={() => refreshQueue()}>
              <Icon name="refresh" size={16} /> Refresh queue
            </button>
          </div>

          <section className="panel queue-table-panel">
            <div className="table-heading">
              <div>
                <span className="eyebrow">LIVE CUSTOMER LIST</span>
                <h3>Queue activity</h3>
              </div>

              <span className="count-pill">
                <Icon name="users" size={15} /> {tokens.length} tokens
              </span>
            </div>

            {tokens.length ? (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Token</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tokens.map(t => (
                      <tr key={t.id}>
                        <td className="token-cell">
                          {t.tokenNumber || t.token_number || `#${t.id}`}
                        </td>
                        <td>{t.customerName || t.customer_name || "—"}</td>
                        <td>
                          <span className={`status status-${String(t.status || "waiting").toLowerCase()}`}>
                            {t.status || "WAITING"}
                          </span>
                        </td>
                        <td>
                          {String(t.status).toUpperCase() !== "COMPLETED" ? (
                            <button
                              className="table-action"
                              onClick={() => completeToken(t.id)}
                              disabled={busy}
                            >
                              <Icon name="check" size={15} /> Complete
                            </button>
                          ) : (
                            <span className="muted">Done</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <Icon name="users" size={27} />
                <h3>No tokens in this queue yet</h3>
                <p>Customer tokens will appear here after they join.</p>
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="panel empty-state admin-empty">
          <Icon name="arrow" size={28} />
          <h3>Select a queue to get started</h3>
          <p>Choose one of your available queues above to view its activity.</p>
        </div>
      )}
    </div>
  );
}
