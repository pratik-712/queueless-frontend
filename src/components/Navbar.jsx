
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <Link to="/" className="brand" onClick={close}>
        <span className="brand-mark">Q</span>
        QueueLess<span className="brand-dot">.</span>
      </Link>

      <button
        className="mobile-menu"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? "X" : "☰"}
      </button>

      <nav className={open ? "nav-links nav-open" : "nav-links"}>
        <a href="/#how-it-works" onClick={close}>How it works</a>
        <a href="/#services" onClick={close}>Services</a>
        <NavLink to="/customer" onClick={close}>Customer</NavLink>
        <NavLink to="/admin" onClick={close}>Operations</NavLink>
        <Link className="nav-cta" to="/customer" onClick={close}>
          Join a queue <span>↗</span>
        </Link>
      </nav>
    </header>
  );
}
