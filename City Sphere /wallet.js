document.addEventListener('DOMContentLoaded', function() {
    // Initialize wallet data from localStorage or set defaults
    let walletData = JSON.parse(localStorage.getItem('walletData')) || {
        balance: 0,
        transactions: []
    };

    // Update wallet data in localStorage
    function updateWalletData() {
        localStorage.setItem('walletData', JSON.stringify(walletData));
        updateDisplay();
    }

    // Update the display
    function updateDisplay() {
        document.getElementById('currentBalance').textContent = walletData.balance.toFixed(2);
        updateTransactionList();
    }

    // Show modal
    window.showAddMoneyModal = function() {
        document.getElementById('addMoneyModal').style.display = 'block';
    };

    window.showWithdrawModal = function() {
        document.getElementById('withdrawModal').style.display = 'block';
    };

    window.showTransferModal = function() {
        document.getElementById('transferModal').style.display = 'block';
    };

    // Close modal
    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
    };

    // Select payment method
    window.selectPaymentMethod = function(element, method) {
        // Remove selected class from all payment methods
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('selected');
        });
        // Add selected class to clicked element
        element.classList.add('selected');
    };

    window.selectWithdrawMethod = function(element, method) {
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('selected');
        });
        element.classList.add('selected');
    };

    // Add money to wallet
    window.addMoney = function() {
        const amount = parseFloat(document.getElementById('addAmount').value);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        const selectedMethod = document.querySelector('.payment-method.selected');
        if (!selectedMethod) {
            alert('Please select a payment method');
            return;
        }

        // Add transaction
        const transaction = {
            id: Date.now(),
            type: 'credit',
            amount: amount,
            date: new Date().toISOString(),
            description: 'Added money to wallet',
            method: selectedMethod.querySelector('p').textContent
        };

        walletData.balance += amount;
        walletData.transactions.unshift(transaction);
        updateWalletData();

        // Close modal and reset form
        closeModal('addMoneyModal');
        document.getElementById('addAmount').value = '';
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('selected');
        });

        alert('Money added successfully!');
    };

    // Withdraw money from wallet
    window.withdrawMoney = function() {
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (amount > walletData.balance) {
            alert('Insufficient balance');
            return;
        }

        const selectedMethod = document.querySelector('#withdrawModal .payment-method.selected');
        if (!selectedMethod) {
            alert('Please select a withdrawal method');
            return;
        }

        // Add transaction
        const transaction = {
            id: Date.now(),
            type: 'debit',
            amount: amount,
            date: new Date().toISOString(),
            description: 'Withdrawn from wallet',
            method: selectedMethod.querySelector('p').textContent
        };

        walletData.balance -= amount;
        walletData.transactions.unshift(transaction);
        updateWalletData();

        // Close modal and reset form
        closeModal('withdrawModal');
        document.getElementById('withdrawAmount').value = '';
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('selected');
        });

        alert('Money withdrawn successfully!');
    };

    // Transfer money to another user
    window.transferMoney = function() {
        const recipientId = document.getElementById('recipientId').value;
        const amount = parseFloat(document.getElementById('transferAmount').value);

        if (!recipientId) {
            alert('Please enter recipient ID');
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (amount > walletData.balance) {
            alert('Insufficient balance');
            return;
        }

        // Add transaction
        const transaction = {
            id: Date.now(),
            type: 'debit',
            amount: amount,
            date: new Date().toISOString(),
            description: `Transferred to ${recipientId}`,
            method: 'Wallet Transfer'
        };

        walletData.balance -= amount;
        walletData.transactions.unshift(transaction);
        updateWalletData();

        // Close modal and reset form
        closeModal('transferModal');
        document.getElementById('recipientId').value = '';
        document.getElementById('transferAmount').value = '';

        alert('Money transferred successfully!');
    };

    // Filter transactions
    window.filterTransactions = function(type) {
        // Update active filter button
        document.querySelectorAll('.filter-button').forEach(button => {
            button.classList.remove('active');
        });
        event.target.classList.add('active');

        updateTransactionList(type);
    };

    // Update transaction list
    function updateTransactionList(filter = 'all') {
        const transactionList = document.getElementById('transactionList');
        transactionList.innerHTML = '';

        const filteredTransactions = walletData.transactions.filter(transaction => {
            if (filter === 'all') return true;
            return transaction.type === filter;
        });

        filteredTransactions.forEach(transaction => {
            const li = document.createElement('li');
            li.className = 'transaction-item';
            
            const isCredit = transaction.type === 'credit';
            const amountClass = isCredit ? 'credit-amount' : 'debit-amount';
            const amountPrefix = isCredit ? '+' : '-';
            const iconClass = isCredit ? 'credit' : 'debit';
            const icon = isCredit ? 'fa-plus' : 'fa-minus';

            li.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-icon ${iconClass}">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="transaction-details">
                        <div class="transaction-title">${transaction.description}</div>
                        <div class="transaction-date">${formatDate(transaction.date)}</div>
                        <div class="transaction-method">${transaction.method}</div>
                    </div>
                </div>
                <div class="transaction-amount ${amountClass}">
                    ${amountPrefix}₹${transaction.amount.toFixed(2)}
                </div>
            `;

            transactionList.appendChild(li);
        });

        if (filteredTransactions.length === 0) {
            transactionList.innerHTML = '<li class="transaction-item">No transactions found</li>';
        }
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Close modals when clicking outside
    window.onclick = function(event) {
        const modals = document.getElementsByClassName('modal');
        for (let modal of modals) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        }
    };

    // Initialize display
    updateDisplay();
});
