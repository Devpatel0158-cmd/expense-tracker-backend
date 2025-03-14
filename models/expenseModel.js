let expense=[];

module.exports = {
    findByUserId: (userId) => expenses.filter((exp) => exp.userId === userId),
    create: (expense) => {
      const newExpense = { id: Date.now(), ...expense };
      expenses.push(newExpense);
      return newExpense;
    },
    update: (id, updates) => {
      const expenseIndex = expenses.findIndex((exp) => exp.id === id);
      if (expenseIndex === -1) return null;
      expenses[expenseIndex] = { ...expenses[expenseIndex], ...updates };
      return expenses[expenseIndex];
    },
    delete: (id) => {
      expenses = expenses.filter((exp) => exp.id !== id);
    },
  };