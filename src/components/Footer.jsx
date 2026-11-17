import { Link } from "react-router-dom";
export default function Footer() {
  return <footer className="footer"><div><Link to="/" className="brand"><span className="brand-mark">Q</span>QueueLess<span className="brand-dot">.</span></Link><p>Less waiting. More living.</p></div><div className="footer-links"><Link to="/customer">Join a queue</Link><Link to="/admin">Operations</Link><a href="/#how-it-works">How it works</a></div><small>© {new Date().getFullYear()} QueueLess. Built to give time back.</small></footer>;
}