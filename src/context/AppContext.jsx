import { createContext, useEffect, useMemo, useState } from "react";
import mockData from "../data/mockData";

export const AppContext = createContext();

const STORAGE_KEY = "zorvyn-finance-dashboard";
const THEME_KEY = "zorvyn-theme";

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : mockData;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || "light";
  });

  const [role, setRole] = useState("viewer");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [monthFilter, setMonthFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const addTransaction = (transaction) => {
    setTransactions((prev) => [
      {
        ...transaction,
        id: Date.now(),
      },
      ...prev,
    ]);
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((item) =>
        item.id === updatedTransaction.id ? updatedTransaction : item
      )
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  };

  const categories = useMemo(() => {
    const unique = [...new Set(transactions.map((item) => item.category))];
    return unique.sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.description.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          item.type.toLowerCase().includes(term)
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((item) => item.type === typeFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    if (monthFilter) {
      result = result.filter((item) => {
        const itemMonth = new Date(item.date).toISOString().slice(0, 7);
        return itemMonth === monthFilter;
      });
    }

    if (fromDate) {
      result = result.filter((item) => item.date >= fromDate);
    }

    if (toDate) {
      result = result.filter((item) => item.date <= toDate);
    }

    switch (sortBy) {
      case "latest":
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "amount-high":
        result.sort((a, b) => b.amount - a.amount);
        break;
      case "amount-low":
        result.sort((a, b) => a.amount - b.amount);
        break;
      default:
        break;
    }

    return result;
  }, [
    transactions,
    searchTerm,
    typeFilter,
    categoryFilter,
    sortBy,
    monthFilter,
    fromDate,
    toDate,
  ]);

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((item) => item.type === "income")
        .reduce((sum, item) => sum + item.amount, 0),
    [transactions]
  );

  const totalExpense = useMemo(
    () =>
      transactions
        .filter((item) => item.type === "expense")
        .reduce((sum, item) => sum + item.amount, 0),
    [transactions]
  );

  const totalBalance = totalIncome - totalExpense;

  const value = {
    transactions,
    filteredTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    role,
    setRole,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    categories,
    totalIncome,
    totalExpense,
    totalBalance,
    monthFilter,
    setMonthFilter,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    theme,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}