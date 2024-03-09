import React, { createContext, useContext, useState } from "react";

const BudgetContext = createContext();

export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState({
    Food: '',
    Transport: '',
    Utilities: '',
    Entertainment: '',
    Other: '',
  });

  const updateBudget = (category, amount) => {
    setBudgets((prevBudgets) => ({
      ...prevBudgets,
      [category]: amount,
    }));
  };

  return (
    <BudgetContext.Provider value={{ budgets, updateBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};
