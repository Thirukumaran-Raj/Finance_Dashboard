const STORAGE_KEY = "zorvyn-finance-dashboard";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchTransactions = async () => {
  await delay(500);
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTransactions = async (transactions) => {
  await delay(200);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};