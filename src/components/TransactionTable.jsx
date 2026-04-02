import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

function TransactionTable({ transactions }) {
  const { role, deleteTransaction, updateTransaction } = useContext(AppContext);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    date: "",
    description: "",
    category: "",
    type: "expense",
    amount: "",
  });

  const startEdit = (item) => {
    setEditId(item.id);
    setEditData({
      ...item,
      amount: String(item.amount),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveEdit = () => {
    if (
      !editData.date ||
      !editData.description ||
      !editData.category ||
      !editData.amount
    ) {
      alert("Please fill all fields.");
      return;
    }

    updateTransaction({
      ...editData,
      amount: Number(editData.amount),
    });

    setEditId(null);
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  if (!transactions.length) {
    return (
      <div className="empty-state">
        <h3>No transactions found</h3>
        <p>Try changing the search, filter, or date range.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th className="amount-cell">Amount</th>
            {role === "admin" && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {transactions.map((item) => (
            <tr key={item.id}>
              {editId === item.id ? (
                <>
                  <td>
                    <input
                      type="date"
                      name="date"
                      value={editData.date}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="description"
                      value={editData.description}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="category"
                      value={editData.category}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <select
                      name="type"
                      value={editData.type}
                      onChange={handleChange}
                    >
                      <option value="income">income</option>
                      <option value="expense">expense</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      name="amount"
                      value={editData.amount}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={saveEdit} type="button">
                        Save
                      </button>
                      <button
                        className="delete-btn"
                        onClick={cancelEdit}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td>{new Date(item.date).toLocaleDateString("en-GB")}</td>
                  <td>{item.description}</td>
                  <td>
                    <span className="category-pill">{item.category}</span>
                  </td>
                  <td>
                    <span className={`type-badge ${item.type}`}>{item.type}</span>
                  </td>
                  <td className={`amount-cell ${item.type}`}>
                    {item.type === "income" ? "+" : "-"}₹{" "}
                    {item.amount.toLocaleString("en-IN")}
                  </td>

                  {role === "admin" && (
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => startEdit(item)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteTransaction(item.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;