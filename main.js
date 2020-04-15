class User {
  constructor(name, lastName) {
    (this.name = name),
      (this.lastName = lastName),
      (this.amount = 0),
      (this.number = this.generateNum()),
      (this.currency = "pln"),
      (this.transactions = []),
      (this.showHistory = false);
  }
  generateNum() {
    let num = "";

    for (let i = 0; i < 26; i++) {
      if (i % 4 === 0) num += " ";
      num += Math.floor(Math.random() * 10);
    }

    num = num.slice(1);

    return num;
  }

  payIn(amount) {
    if (amount < 1) return alert("Min. amount is 1");

    amount = parseFloat(amount);

    this.amount = parseFloat(this.amount);
    this.amount += amount;
    this.amount = this.amount.toFixed(2);

    const date = new Date().toLocaleString();
    this.transactions.push(`Paid in: +${amount}${this.currency}, ${date}`);
  }

  payOut(amount) {
    amount = parseFloat(amount);
    amount = amount + amount * 0.01;
    amount = amount.toFixed(2);
    amount = parseFloat(amount);

    if (this.amount <= amount) return alert("Not enough balance. Try again");

    this.amount -= amount;
    this.amount = this.amount.toFixed(2);

    const date = new Date().toLocaleString();
    this.transactions.push(`Paid out: -${amount}${this.currency}, ${date}`);
  }

  convertCurrency() {
    if (this.currency === "pln") {
      this.amount = (this.amount * 4.31).toFixed(2);
    } else {
      this.amount = (this.amount * 0.23).toFixed(2);
    }

    const date = new Date().toLocaleString();
    this.transactions.push(`Converted to ${this.currency}, ${date}`);
  }

  show() {
    const transactions = this.transactions.map((transaction) => {
      return `<li>${transaction}</li>`;
    });

    return transactions;
  }
}

var vm = new Vue({
  el: ".app",
  data: {
    name: "",
    lastName: "",
    accountList: [],
    showUsers: false,
    searchAccNr: "",
    payInValue: "",
    selectedOption: true,
    accountsAscSorted: false,
    searchLastName: "",
    filteredList: [],
  },
  methods: {
    addUser() {
      if (this.name.length < 3 || this.lastName.length < 3)
        return alert("Wrong input");

      const name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
      const lastName =
        this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1);

      const user = new User(name, lastName);
      this.accountList.push(user);

      this.name = "";
      this.lastName = "";
    },
    handleOption(e) {
      const bool = e.target.value === "true" ? true : false;
      this.selectedOption = bool;
    },
    handleShowUsers() {
      this.filteredList.length = 0;
      this.searchLastName = "";
      this.showUsers = !this.showUsers;
    },
    payIn() {
      if (this.searchAccNr.length < 25 || isNaN(parseFloat(this.searchAccNr)))
        return alert("Wrong account number");
      if (!this.payInValue || this.payInValue < 0)
        return alert("Value has to be greater than 0");

      if (this.selectedOption) {
        this.accountList.map((user) => {
          if (user.number === this.searchAccNr) {
            user.payIn(this.payInValue);
            this.payInValue = 0;
            this.searchAccNr = "";
          }
        });
      } else {
        this.accountList.map((user) => {
          if (user.number === this.searchAccNr) {
            user.payOut(this.payInValue);
            this.payInValue = 0;
            this.searchAccNr = "";
          }
        });
      }
    },
    removeAccount(userToRemove) {
      if (this.filteredList.length) {
        const list2 = this.filteredList.filter(function (user) {
          return user !== userToRemove;
        });

        this.filteredList = list2;
      }

      const list = this.accountList.filter(function (user) {
        return user !== userToRemove;
      });

      this.accountList = list;
    },
    handleCurrency(e, user) {
      user.currency = e.target.value;
      user.convertCurrency();
    },
    showTransactions(user) {
      if (user.amount < 1) return;
      user.showHistory = !user.showHistory;
      user.show();
    },
    sortByLastName() {
      this.accountsAscSorted = !this.accountsAscSorted;
      if (this.accountsAscSorted) {
        this.accountList.sort((a, b) => (a.lastName > b.lastName ? 1 : -1));
      } else {
        this.accountList.sort((a, b) => (a.lastName > b.lastName ? -1 : 1));
      }
    },
    handleSearchByName() {
      if (!this.searchLastName) {
        this.filteredList.length = 0;
        return;
      }

      this.searchLastName = this.searchLastName.toLowerCase();

      this.filteredList = this.accountList.filter((user) =>
        user.lastName.toLowerCase().includes(this.searchLastName)
      );
      this.showUsers = false;
    },
  },
});
