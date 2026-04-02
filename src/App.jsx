import { useContext } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import {
  Wallet,
  LayoutDashboard,
  ReceiptText,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import RoleSwitcher from "./components/RoleSwitcher";
import { AppContext } from "./context/AppContext";
import "./App.css";

function App() {
  const { theme, toggleTheme } = useContext(AppContext);

  return (
    <div className={`app-shell ${theme}`}>
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-grid" />

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Wallet size={20} />
          </div>
          <div className="brand-copy">
            <h1>Zorvyn</h1>
            <p>Finance Dashboard</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className="nav-link">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/transactions" className="nav-link">
            <ReceiptText size={18} />
            <span>Transactions</span>
          </NavLink>

          <NavLink to="/insights" className="nav-link">
            <Sparkles size={18} />
            <span>Insights</span>
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <RoleSwitcher />
        </div>
      </aside>

      <main className="main-content fade-in">
        <header className="topbar">
          <div className="topbar-copy">
            <h2>Financial Activity Portal</h2>
            <p>Track spending, trends, categories, and cash flow with clarity.</p>
          </div>

          <button className="theme-toggle" onClick={toggleTheme} type="button">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          </button>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;