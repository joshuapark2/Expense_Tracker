$(document).ready(function() {
    $('#transactionTable').hide();
    $('#transactionForm').hide();
    let authToken;

    // If there is authToken in cookies, skip to loading transactions
    if (document.cookie.split(';').some((item) => item.trim().startsWith('authToken='))) {
        authToken = document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        loadTransactions(authToken);
    }

    $('#loginForm').on('submit', function(event) {
        event.preventDefault();

        var email = $('#email').val();
        var password = $('#password').val();

        $.ajax({
            url: 'proxy.php',
            type: 'POST',
            data: JSON.stringify({
                command: 'Authenticate',
                params: {
                    partnerUserID: email,
                    partnerUserSecret: password
                }
            }),
            success: function(data) {
                if (!data.email || !data.accountID || data.email != email) {
                    alert('Invalid username or password');
                    return;
                }

                authToken = data.authToken;
                document.cookie = "authToken=" + authToken + "; path=/";
                loadTransactions(authToken);
            },
            contentType: 'application/json'
        });
    });

    function loadTransactions(authToken) {
        $.ajax({
            url: 'proxy.php',
            type: 'POST',
            data: JSON.stringify({
                command: 'Get',
                params: {
                    authToken: authToken,
                    returnValueList: 'transactionList'
                }
            }),
            success: function(data) {
                if (data.error) {
                    alert('Error: ' + data.error);
                    return;
                }

                $('#loginContent').hide();
                $('#transactionTable').show();
                $('#transactionForm').show();

                if (Array.isArray(data.transactionList)) {
                    data.transactionList.forEach(function(transaction) {
                        var row = '<tr><td>' + transaction.created + '</td><td>' 
                                + transaction.merchant + '</td><td>' 
                                + (transaction.amount / 100).toFixed(2) + '</td></tr>';
                        $('#transactionTableBody').append(row);
                    });
                }

                console.log('success');
            },
            contentType: 'application/json'
        });
    }

    $('#createTransactionForm').on('submit', function(event) {
        event.preventDefault();

        var date = $('#transactionDate').val();
        var merchant = $('#merchantName').val();
        var amount = $('#transactionAmount').val() * 100;

        // checking if merchant is only alphabetic
        if (!/^[a-zA-Z\s]+$/.test(merchant)) {
            alert('Merchant name can only contain letters');
            return;
        }

        // checking if date is valid
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            alert('Invalid date');
            return;
        }

        $.ajax({
            url: 'proxy.php',
            type: 'POST',
            data: JSON.stringify({
                command: 'CreateTransaction',
                params: {
                    authToken: authToken,
                    created: date,
                    amount: amount,
                    merchant: merchant
                }
            }),
            success: function(data) {
                if (data.error) {
                    alert('Error: ' + data.error);
                    return;
                }

                var row = '<tr><td>' + date + '</td><td>' 
                        + merchant + '</td><td>' 
                        + (amount / 100).toFixed(2) + '</td></tr>';
                $('#transactionTableBody').prepend(row);
                $('#transactionDate').val('');
                $('#merchantName').val('');
                $('#transactionAmount').val('');
            },
            contentType: 'application/json'
        });
    });
});
