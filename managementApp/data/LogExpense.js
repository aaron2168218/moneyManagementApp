// This is the youtube video I used to give me an idea of how to use Query in React native
//www.youtube.com/watch?v=8K1N3fE-cDs
//www.youtube.com/watch?v=XD0KYYQIlVA - This is in Hindi

import { useQuery, useMutation, useQueryClient } from "react-query";

let expensesStore = [];

const fetchExpenses = async () => expensesStore;

const addExpense = async (expense) => {
  const newExpense = { ...expense, id: Date.now().toString() };
  expensesStore.push(newExpense);
  return newExpense;
};

const deleteExpense = async (expenseId) => {
  expensesStore = expensesStore.filter((expense) => expense.id !== expenseId);
};

export const LogExpense = () => {
  const queryClient = useQueryClient();

  const { data: expenses = [], isLoading } = useQuery(
    "expenses",
    fetchExpenses
  );

  const addExpenseMutation = useMutation(addExpense, {
    onSuccess: () => queryClient.invalidateQueries("expenses"),
  });

  const deleteExpenseMutation = useMutation(deleteExpense, {
    onSuccess: () => queryClient.invalidateQueries("expenses"),
  });

  return {
    expenses,
    isLoading,
    addExpense: addExpenseMutation.mutate,
    deleteExpense: deleteExpenseMutation.mutate,
  };
};
