// Theme Toggle Functionality
const themeButton = document.getElementById('themeButton');
const body = document.body;

themeButton.addEventListener('click', () => {
  body.dataset.theme = body.dataset.theme === 'light' ? 'dark' : 'light';
  themeButton.textContent = body.dataset.theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
});

// Indian Number Formatting Function
function formatIndianCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Transaction Functionality
let transactions = [];

document.getElementById('transactionForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const date = document.getElementById('date').value;
  const type = document.querySelector('input[name="type"]:checked').value;

  const transaction = {
    id: Date.now(),
    description,
    amount,
    date,
    type,
  };

  transactions.push(transaction);
  updateTransactionList();
  updateBalance();
  document.getElementById('transactionForm').reset();
});

function updateTransactionList() {
  const transactionList = document.getElementById('transactionList');
  transactionList.innerHTML = '';

  let runningBalance = 0;

  transactions.forEach((transaction) => {
    const row = document.createElement('tr');

    // Update running balance
    if (transaction.type === 'credit') {
      runningBalance += transaction.amount;
    } else {
      runningBalance -= transaction.amount;
    }

    row.innerHTML = `
      <td>${transaction.description}</td>
      <td class="amount ${transaction.type}">${transaction.type === 'debit' ? '-' : '+'}${formatIndianCurrency(transaction.amount)}</td>
      <td>${transaction.date}</td>
      <td>${formatIndianCurrency(runningBalance)}</td>
      <td class="actions">
        <button onclick="editTransaction(${transaction.id})">Edit</button>
        <button onclick="deleteTransaction(${transaction.id})">Delete</button>
      </td>
    `;
    transactionList.appendChild(row);
  });
}

function updateBalance() {
  const balanceElement = document.getElementById('balance');
  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === 'credit' ? acc + transaction.amount : acc - transaction.amount;
  }, 0);
  balanceElement.textContent = formatIndianCurrency(balance);
}

function editTransaction(id) {
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) return;

  document.getElementById('description').value = transaction.description;
  document.getElementById('amount').value = transaction.amount;
  document.getElementById('date').value = transaction.date;
  document.querySelector(`input[name="type"][value="${transaction.type}"]`).checked = true;

  transactions = transactions.filter((t) => t.id !== id);
  updateTransactionList();
  updateBalance();
}

function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateTransactionList();
  updateBalance();
}