const fs = require("fs");

//task-1 reading the csv file
const bank_statement = fs.readFileSync("fe02_bank.csv", "utf-8");

const rows = bank_statement.trim().split("\n");

const Header = rows[0].split(",");

//task-1 Each row becomes a JavaScript object with column names as keys
const transactions = rows.slice(1).map((row) => {
  const values = row.split(",");
  const obj = {};

  Header.forEach((head, index) => {
    obj[head.trim()] = values[index].trim();
  });

  return obj;
}); // manually parsing csv data into object

//task-2 Sort all transactions in ascending order by Date.
transactions.sort((a, b) => new Date(a.Date) - new Date(b.Date));

//task-3filter and analysis
const summary = {};

transactions.forEach((txn) => {
  const txnId = txn.TransactionID;
  const rmk = txn.Remarks;
  const name = txn.AccountHolder;
  const type = txn.Type;
  const amount = Number(txn.Amount);

  if (!summary[name]) {
    summary[name] = {
      AccountHolder: name,
      TotalCredit: 0,
      TotalDebit: 0,
      LargestTransaction: 0,
      SalaryTransactions: [],
    };
  }

  if (type === "Credit") {
    summary[name].TotalCredit += amount;
  } else {
    summary[name].TotalDebit += amount;
  }

  if (Math.abs(amount) > Math.abs(summary[name].LargestTransaction)) {
    summary[name].LargestTransaction = amount;
  }
  if (rmk.toLowerCase().includes("salary")) {
    summary[name].SalaryTransactions.push(txnId);
  }
});

const summaryArray = Object.values(summary);

//converting summaryArray back into csv format
const csvHeader = [
  "AccountHolder",
  "TotalCredit",
  "TotalDebit",
  "LargestTransaction",
  "SalaryTransactions",
];
const csvRows = summaryArray.map((item) =>
  [
    item.AccountHolder,
    item.TotalCredit,
    item.TotalDebit,
    item.LargestTransaction,
    item.SalaryTransactions.join("|"),
  ].join(",")
);

const finalCSV = csvHeader.join(",") + "\n" + csvRows.join("\n");

fs.writeFileSync("bank_summary.CSV", finalCSV);

console.log(summary);
