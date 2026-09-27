// Get HTML elements

const form = document.getElementById("transactionForm");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const transactionList = document.getElementById("transactionList");

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");
const transactionCountElement =
    document.getElementById("transactionCount");

const searchInput = document.getElementById("search");


// Get saved transactions

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];


// Set today's date

dateInput.value = new Date().toISOString().split("T")[0];


// Add transaction

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;


    if (
        description === "" ||
        amount <= 0 ||
        type === "" ||
        category === "" ||
        date === ""
    ) {

        alert("Please fill all the fields.");

        return;
    }


    const transaction = {

        id: Date.now(),

        description: description,

        amount: amount,

        type: type,

        category: category,

        date: date

    };


    transactions.push(transaction);

    saveTransactions();

    displayTransactions();

    updateDashboard();

    form.reset();

    dateInput.value =
        new Date().toISOString().split("T")[0];

});


// Save data

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// Display transactions

function displayTransactions() {

    transactionList.innerHTML = "";

    const searchText =
        searchInput.value.toLowerCase();


    const filteredTransactions =
        transactions.filter(function(transaction) {

            return transaction.description
                .toLowerCase()
                .includes(searchText);

        });


    if (filteredTransactions.length === 0) {

        document.getElementById("emptyMessage")
            .style.display = "block";

    } else {

        document.getElementById("emptyMessage")
            .style.display = "none";

    }


    filteredTransactions.forEach(function(transaction) {

        const row = document.createElement("tr");


        const amountClass =
            transaction.type === "income"
                ? "income"
                : "expense";


        const sign =
            transaction.type === "income"
                ? "+"
                : "-";


        row.innerHTML = `

            <td>${transaction.date}</td>

            <td>${transaction.description}</td>

            <td>${transaction.category}</td>

            <td class="${amountClass}">
                ${transaction.type}
            </td>

            <td class="${amountClass}">
                ${sign} ₹${transaction.amount}
            </td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})"
                >
                    Delete
                </button>

            </td>

        `;


        transactionList.appendChild(row);

    });

}


// Delete transaction

function deleteTransaction(id) {

    const confirmation =
        confirm("Delete this transaction?");


    if (!confirmation) {
        return;
    }


    transactions =
        transactions.filter(function(transaction) {

            return transaction.id !== id;

        });


    saveTransactions();

    displayTransactions();

    updateDashboard();

}


// Update dashboard

function updateDashboard() {

    let totalIncome = 0;

    let totalExpense = 0;


    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {

            totalIncome += transaction.amount;

        } else {

            totalExpense += transaction.amount;

        }

    });


    const balance =
        totalIncome - totalExpense;


    incomeElement.innerText =
        "₹" + totalIncome.toFixed(2);


    expenseElement.innerText =
        "₹" + totalExpense.toFixed(2);


    balanceElement.innerText =
        "₹" + balance.toFixed(2);


    transactionCountElement.innerText =
        transactions.length;

}


// Search transactions

searchInput.addEventListener(
    "input",
    displayTransactions
);


// Start application

displayTransactions();

updateDashboard();