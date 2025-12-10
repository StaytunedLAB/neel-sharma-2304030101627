// ============================================
// Banking System - Refactored Modern Version
// ============================================

// ---------- Utility Helpers ---------- //

/**
 * Safely converts a value to a number
 */
const toNumber = (value) => {
  const n = Number(value);
  return isFinite(n) && !isNaN(n) ? n : null;
};

/**
 * Checks if the transaction type is valid
 */
const isTransactionType = (type) =>
  typeof type === "string" && ["Deposit", "Withdraw"].includes(type);

/**
 * Validates a transaction object
 */
const validateTransaction = (txn) => {
  if (!txn || typeof txn !== "object") {
    return { ok: false, error: "Invalid transaction object" };
  }

  if (!txn.type) {
    return { ok: false, error: "Missing transaction type" };
  }

  if (!isTransactionType(txn.type)) {
    return { ok: false, error: `Unknown transaction type: ${txn.type}` };
  }

  if (txn.amount === undefined || txn.amount === null) {
    return { ok: false, error: "Missing transaction amount" };
  }

  const amount = toNumber(txn.amount);
  if (amount === null) {
    return { ok: false, error: `Invalid amount: ${txn.amount}` };
  }

  if (amount <= 0) {
    return { ok: false, error: `Amount must be positive: ${amount}` };
  }

  return { ok: true, amount };
};


/**
 * Applies a valid transaction to the account
 */
const applyTransaction = (account, index, transaction) => {
  const validation = validateTransaction(transaction);

  if (!validation.ok) {
    return {
      applied: false,
      reason: validation.error,
      transaction: { ...transaction, index: index + 1 }
    };
  }

  const amount = validation.amount;

  if (transaction.type === "Withdraw" && amount > account.balance) {
    return {
      applied: false,
      reason: `Insufficient balance: required ${amount}, available ${account.balance}`,
      transaction: { ...transaction, index: index + 1 }
    };
  }

  // Apply transaction
  account.balance += transaction.type === "Deposit" ? amount : -amount;

  return {
    applied: true,
    transaction: { ...transaction, amount, index: index + 1 }
  };
};


// ---------- Main System ---------- //

/**
 * Processes all banking transactions for an account
 */
const processBankingTransaction = (input) => {
  const applied = [];
  const rejected = [];
  let account = null;
  let logMessage = "";

  try {
    if (!input || typeof input !== "object") {
      throw new Error("Input must be a valid object");
    }

    const { accountNumber, accountHolder, initialBalance, currency, transactions } = input;

    if (!accountNumber) throw new Error("Missing account number");
    if (!accountHolder) throw new Error("Missing account holder");
    if (initialBalance === undefined || initialBalance === null) throw new Error("Missing initial balance");
    if (!currency) throw new Error("Missing currency");
    if (!Array.isArray(transactions)) throw new Error("Transactions must be an array");

    const startingBalance = toNumber(initialBalance);
    if (startingBalance === null) {
      throw new Error(`Invalid initial balance: ${initialBalance}`);
    }

    // Initialize account
    account = {
      accountNumber,
      accountHolder,
      currency,
      initialBalance: startingBalance,
      balance: startingBalance
    };

    transactions.forEach((txn, i) => {
      const result = applyTransaction(account, i, txn);
      result.applied ? applied.push(result.transaction) : rejected.push(result);
    });

  } catch (err) {
    rejected.push({ error: "System Error", message: err.message });
    logMessage = err.message;
  }

  // ---------- Reporting ---------- //
  console.log("\n========================================");
  console.log("BANKING SYSTEM - SUMMARY REPORT");
  console.log("========================================\n");

  if (account) {
    console.log("📋 ACCOUNT INFORMATION:");
    console.log(`  Holder: ${account.accountHolder}`);
    console.log(`  Number: ${account.accountNumber}`);
    console.log(`  Currency: ${account.currency}`);
    console.log(`  Initial Balance: ${account.initialBalance}`);
    console.log(`  Final Balance: ${account.balance}`);
    console.log("");

    console.log("✅ APPLIED TRANSACTIONS:");
    applied.length
      ? applied.forEach((t) =>
          console.log(`  ${t.index}. ${t.type} → ${t.amount} ${account.currency}`)
        )
      : console.log("  (None)");
    console.log("");

    console.log("❌ REJECTED TRANSACTIONS:");
    rejected.length
      ? rejected.forEach((r) =>
          console.log(
            r.error
              ? `  ${r.error}: ${r.message}`
              : `  ${r.transaction.index}. Reason: ${r.reason}`
          )
        )
      : console.log("  (None)");
    console.log("");

    console.log("📊 STATISTICS:");
    console.log(`  Total: ${applied.length + rejected.length}`);
    console.log(`  Applied: ${applied.length}`);
    console.log(`  Rejected: ${rejected.length}`);
    console.log("");

    logMessage = `Completed: ${applied.length} applied, ${rejected.length} rejected.`;
  } else {
    console.log("⚠️  No account data processed due to error.");
  }

  console.log("📝 AUDIT LOG:");
  console.log("  " + logMessage);
  console.log("========================================\n");
};


// ---------- Test Cases ---------- //

const testCase1 = {
  accountNumber: "ACC001",
  accountHolder: "John Doe",
  initialBalance: 1000,
  currency: "USD",
  transactions: [
    { type: "Deposit", amount: 500 },
    { type: "Withdraw", amount: 200 },
    { type: "Deposit", amount: 300 }
  ]
};

const testCase2 = {
  accountNumber: "ACC002",
  accountHolder: "Jane Smith",
  initialBalance: "2000",
  currency: "EUR",
  transactions: [
    { type: "Deposit", amount: 500 },
    { type: "Withdraw", amount: 3000 },
    { type: "Deposit", amount: -100 },
    { type: "Unknown", amount: 50 },
    { type: "Withdraw" },
    { amount: 200 },
    { type: "Deposit", amount: "invalid" }
  ]
};

const testCase3 = {
  accountNumber: "ACC003",
  accountHolder: "Bob Johnson",
  initialBalance: "500.50",
  currency: "GBP",
  transactions: [
    { type: "Deposit", amount: "250.75" },
    { type: "Withdraw", amount: 0 },
    { type: "Withdraw", amount: 750.25 }
  ]
};

console.log("\n=============== TEST CASE 1 ===============");
processBankingTransaction(testCase1);

console.log("\n=============== TEST CASE 2 ===============");
processBankingTransaction(testCase2);

console.log("\n=============== TEST CASE 3 ===============");
processBankingTransaction(testCase3);
