import { useContext, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppContext } from "../context/AppContext";
import SummaryCard from "../components/SummaryCard";

const PIE_COLORS = ["#7c3aed", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

function Dashboard() {
  const { transactions, totalIncome, totalExpense, totalBalance } =
    useContext(AppContext);

  const monthlyTrendData = useMemo(() => {
    const monthlyMap = {};

    transactions.forEach((item) => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthLabel = date.toLocaleString("en-US", { month: "short" });

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = {
          month: monthLabel,
          income: 0,
          expense: 0,
          balance: 0,
        };
      }

      if (item.type === "income") {
        monthlyMap[monthKey].income += item.amount;
      } else {
        monthlyMap[monthKey].expense += item.amount;
      }

      monthlyMap[monthKey].balance =
        monthlyMap[monthKey].income - monthlyMap[monthKey].expense;
    });

    return Object.values(monthlyMap);
  }, [transactions]);

  const spendingByCategory = useMemo(() => {
    const categoryMap = {};

    transactions
      .filter((item) => item.type === "expense")
      .forEach((item) => {
        categoryMap[item.category] = (categoryMap[item.category] || 0) + item.amount;
      });

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2>Dashboard Overview</h2>
          <p>Track your money flow, trends, and category-wise spending.</p>
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard
          title="Total Balance"
          value={totalBalance}
          subtitle="Current net position"
          variant="balance"
        />
        <SummaryCard
          title="Income"
          value={totalIncome}
          subtitle="Total cash inflow"
          variant="income"
        />
        <SummaryCard
          title="Expenses"
          value={totalExpense}
          subtitle="Total cash outflow"
          variant="expense"
        />
      </div>

      <div className="chart-grid">
        <div className="panel glow-panel">
          <div className="panel-header">
            <h3>Balance Trend</h3>
            <span>Time-based visualization</span>
          </div>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(148,163,184,0.22)" />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "14px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#balanceFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel glow-panel">
          <div className="panel-header">
            <h3>Spending Breakdown</h3>
            <span>Category-wise expenses</span>
          </div>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="44%"
                  outerRadius={95}
                  innerRadius={52}
                  paddingAngle={3}
                >
                  {spendingByCategory.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "14px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="legend-list">
              {spendingByCategory.map((item, index) => (
                <div className="legend-item" key={item.name}>
                  <span
                    className="legend-dot"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span>{item.name}</span>
                  <strong>₹ {item.value.toLocaleString("en-IN")}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="panel recent-panel">
        <div className="panel-header">
          <h3>Recent Transactions</h3>
          <span>Latest 5 activities</span>
        </div>

        <div className="recent-list">
          {recentTransactions.map((item) => (
            <div className="recent-item" key={item.id}>
              <div>
                <strong>{item.description}</strong>
                <p>
                  {new Date(item.date).toLocaleDateString("en-GB")} • {item.category}
                </p>
              </div>
              <div className={`recent-amount ${item.type}`}>
                {item.type === "income" ? "+" : "-"}₹ {item.amount.toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;