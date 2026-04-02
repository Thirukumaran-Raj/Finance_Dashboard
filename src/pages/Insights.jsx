import { useContext, useMemo } from "react";
import { AppContext } from "../context/AppContext";

function Insights() {
  const { transactions, totalIncome, totalExpense, totalBalance } =
    useContext(AppContext);

  const expenseTransactions = transactions.filter(
    (item) => item.type === "expense"
  );

  const highestSpendingCategory = useMemo(() => {
    const categoryMap = {};

    expenseTransactions.forEach((item) => {
      categoryMap[item.category] =
        (categoryMap[item.category] || 0) + item.amount;
    });

    const sorted = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
    return sorted[0] || ["N/A", 0];
  }, [expenseTransactions]);

  const monthlyComparison = useMemo(() => {
    const monthlyMap = {};

    transactions.forEach((item) => {
      const month = new Date(item.date).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyMap[month]) {
        monthlyMap[month] = { income: 0, expense: 0 };
      }

      if (item.type === "income") {
        monthlyMap[month].income += item.amount;
      } else {
        monthlyMap[month].expense += item.amount;
      }
    });

    return Object.entries(monthlyMap).map(([month, values]) => ({
      month,
      ...values,
      balance: values.income - values.expense,
    }));
  }, [transactions]);

  const latestMonth = monthlyComparison[monthlyComparison.length - 1];

  const largestTransaction = useMemo(() => {
    if (!transactions.length) return null;
    return [...transactions].sort((a, b) => b.amount - a.amount)[0];
  }, [transactions]);

  const groupedByCategory = useMemo(() => {
    const grouped = {};

    transactions.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = 0;
      }
      grouped[item.category] += item.amount;
    });

    return Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2>Insights</h2>
          <p>Smart financial observations, grouped summaries, and patterns.</p>
        </div>
      </div>

      <div className="insight-grid">
        <div className="insight-card">
          <h3>Highest Spending Category</h3>
          <p>
            Your top expense category is{" "}
            <strong>{highestSpendingCategory[0]}</strong> with spending of{" "}
            <strong>₹ {highestSpendingCategory[1].toLocaleString("en-IN")}</strong>.
          </p>
        </div>

        <div className="insight-card">
          <h3>Monthly Comparison</h3>
          {latestMonth ? (
            <p>
              In <strong>{latestMonth.month}</strong>, income was{" "}
              <strong>₹ {latestMonth.income.toLocaleString("en-IN")}</strong> and
              expense was{" "}
              <strong>₹ {latestMonth.expense.toLocaleString("en-IN")}</strong>.
            </p>
          ) : (
            <p>No monthly comparison data available yet.</p>
          )}
        </div>

        <div className="insight-card">
          <h3>Net Position</h3>
          <p>
            Current balance is{" "}
            <strong>₹ {totalBalance.toLocaleString("en-IN")}</strong>, from income
            of <strong>₹ {totalIncome.toLocaleString("en-IN")}</strong> and
            expenses of <strong>₹ {totalExpense.toLocaleString("en-IN")}</strong>.
          </p>
        </div>

        <div className="insight-card">
          <h3>Largest Transaction</h3>
          {largestTransaction ? (
            <p>
              Biggest entry: <strong>{largestTransaction.description}</strong>{" "}
              ({largestTransaction.type}) worth{" "}
              <strong>₹ {largestTransaction.amount.toLocaleString("en-IN")}</strong>.
            </p>
          ) : (
            <p>No transaction data available.</p>
          )}
        </div>

        <div className="insight-card">
          <h3>Grouped Category Summary</h3>
          <div className="grouped-list">
            {groupedByCategory.map(([category, amount]) => (
              <div className="grouped-item" key={category}>
                <span>{category}</span>
                <strong>₹ {amount.toLocaleString("en-IN")}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="insight-card">
          <h3>Useful Observation</h3>
          <p>
            {totalExpense > totalIncome
              ? "Expenses are currently higher than income. Reduce the top categories first."
              : "Income is higher than expenses. Your financial position looks healthy right now."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Insights;