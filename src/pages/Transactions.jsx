import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import TransactionTable from "../components/TransactionTable";

const initialForm = {
  date: "",
  description: "",
  amount: "",
  category: "",
  type: "expense",
};

function Transactions() {
  const {
    filteredTransactions,
    addTransaction,
    role,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    categories,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useContext(AppContext);

  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.date ||
      !formData.description ||
      !formData.amount ||
      !formData.category
    ) {
      alert("Please fill all fields.");
      return;
    }

    addTransaction({
      ...formData,
      amount: Number(formData.amount),
    });

    setFormData(initialForm);
  };

  const exportCSV = () => {
    const rows = filteredTransactions.map(
      (item) =>
        `${item.date},"${item.description}",${item.category},${item.type},${item.amount}`
    );

    const csvContent =
      "Date,Description,Category,Type,Amount\n" + rows.join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filteredTransactions, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.json";
    link.click();
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2>Transactions</h2>
          <p>Search, filter, sort, and manage your financial records.</p>
        </div>
      </div>

      {role === "admin" && (
        <div className="panel form-panel">
          <div className="panel-header">
            <h3>Add Transaction</h3>
            <span>Admin only action</span>
          </div>

          <form className="transaction-form" onSubmit={handleSubmit}>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
            />
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <button type="submit">Add Transaction</button>
          </form>
        </div>
      )}

      <div className="panel filter-panel">
        <div className="panel-header">
          <h3>Filters</h3>
          <span>Advanced filtering, sorting, and export</span>
        </div>

        <div className="filters-row advanced-filters">
          <input
            type="text"
            placeholder="Search description, category, type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button className="export-btn" onClick={exportCSV} type="button">
            Export CSV
          </button>

          <button className="export-btn secondary" onClick={exportJSON} type="button">
            Export JSON
          </button>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="panel-header">
          <h3>Transaction History</h3>
          <span>{filteredTransactions.length} record(s) shown</span>
        </div>

        <TransactionTable transactions={filteredTransactions} />
      </div>
    </div>
  );
}

export default Transactions;