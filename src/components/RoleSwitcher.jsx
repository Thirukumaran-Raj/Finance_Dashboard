import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { ShieldCheck, UserCircle2, ChevronDown } from "lucide-react";

function RoleSwitcher() {
  const { role, setRole } = useContext(AppContext);

  return (
    <div className="role-switcher-card">
      <div className="role-switcher-header">
        <div className="role-switcher-icon">
          {role === "admin" ? <ShieldCheck size={18} /> : <UserCircle2 size={18} />}
        </div>
        <div>
          <p className="role-switcher-label">Access Mode</p>
          <h4 className="role-switcher-title">
            {role === "admin" ? "Administrator" : "Viewer"}
          </h4>
        </div>
      </div>

      <div className="custom-select-wrapper">
        <select
          className="role-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
        <ChevronDown size={18} className="custom-select-icon" />
      </div>

      <p className="role-switcher-note">
        {role === "admin"
          ? "You can add, edit, delete, and export transactions."
          : "You can only view dashboards, insights, and reports."}
      </p>
    </div>
  );
}

export default RoleSwitcher;