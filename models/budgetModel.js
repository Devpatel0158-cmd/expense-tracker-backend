let budgets =[];

module.exports = {
    findByUserId: (userId) => budgets.filter((bud) => bud.userId === userId),
    create: (budget) => {
      const newBudget = { id: Date.now(), ...budget, remaining: parseFloat(budget.amount) };
      budgets.push(newBudget);
      return newBudget;
    },
    update: (id, updates) => {
      const budgetIndex = budgets.findIndex((bud) => bud.id === id);
      if (budgetIndex === -1) return null;
      budgets[budgetIndex] = { ...budgets[budgetIndex], ...updates };
      return budgets[budgetIndex];
    },
    delete: (id) => {
      budgets = budgets.filter((bud) => bud.id !== id);
    },
    checkAlerts: (userId, threshold = 0.8) => {
      const userBudgets = budgets.filter((bud) => bud.userId === userId);
      return userBudgets.map((budget) => {
        const spent = budget.amount - budget.remaining;
        if (spent > budget.amount * threshold) {
          return { category: budget.category, message: 'Budget threshold exceeded!' };
        }
        return null;
      }).filter((alert) => alert);
    },
  };