<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Check Balance</title>
  <style>
    body {
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(to right, #2196F3, #0D47A1);
    }

    .login-container {
      font-family: 'Lexend Bold', sans-serif;
      background-color: #fff;
      border-radius: 20px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.3), 0 0 60px rgba(0, 0, 0, 0.3);
      animation: glowAnimation 2s infinite alternate;
      overflow: hidden;
      width: 300px;
      padding: 20px;
      text-align: center;
      position: relative;
    }

    @keyframes glowAnimation {
      0% {
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.3), 0 0 60px rgba(0, 0, 0, 0.3);
      }
      100% {
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.6), 0 0 50px rgba(0, 0, 0, 0.6), 0 0 80px rgba(0, 0, 0, 0.6);
      }
    }

    .login-container input {
      width: calc(100% - 22px);
      padding: 10px;
      margin: 8px 0;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 5px;
      outline: none;
      position: relative;
      z-index: 1;
    }

    .login-container button {
      font-family: 'Lexend Bold', sans-serif;
      background-color: #4CAF50;
      color: #fff;
      padding: 12px 15px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      position: relative;
      z-index: 1;
      margin-top: 10px;
    }

    /* Success message style */
    .success-message {
      color: #00C851;
      font-size: 18px;
      margin-top: 20px;
    }

    /* Error message style */
    .error-message {
      display: block;
      color: #ff0000;
      font-size: 12px;
      margin-top: 5px;
    }

    /* Admin panel style */
    .admin-panel {
      display: none;
      margin-top: 20px;
    }

    .admin-panel input, .admin-panel button {
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <h2>Login</h2>
    <form onsubmit="return validateForm(event)">
      <input type="text" id="usernameOrEmail" placeholder="Username or Email" required>
      <input type="password" id="password" placeholder="Password" required>
      <button type="submit">Check Balance</button>
      <span class="error-message" id="login-error"></span>
      <span class="success-message" id="login-success"></span>
    </form>

    <!-- Admin panel -->
    <div class="admin-panel" id="adminPanel">
      <h3>Admin Panel</h3>
      <input type="text" id="newUsername" placeholder="New User" required>
      <input type="password" id="newPassword" placeholder="New Password" required>
      <input type="number" id="newBalance" placeholder="New Balance" required>
      <button onclick="addUser()">Add User</button>
      <input type="text" id="changeUsername" placeholder="Username to Change" required>
      <input type="number" id="changeBalance" placeholder="New Balance" required>
      <button onclick="changeBalance()">Change Balance</button>
    </div>

    <script>
      // MongoDB API endpoint
      const mongoApiEndpoint = 'http://localhost:3000';

      function validateForm(event) {
        event.preventDefault();

        var usernameOrEmailInput = document.getElementById('usernameOrEmail');
        var passwordInput = document.getElementById('password');
        var loginErrorMessage = document.getElementById('login-error');
        var loginSuccessMessage = document.getElementById('login-success');
        var adminPanel = document.getElementById('adminPanel');
        var isValid = true;

        var enteredUsername = usernameOrEmailInput.value.trim();
        var enteredPassword = passwordInput.value.trim();

        validateUserAgainstServer(enteredUsername, enteredPassword, function (user) {
          if (user) {
            loginErrorMessage.textContent = '';
            loginSuccessMessage.textContent = `You have ${user.balance} planetCoins`;

            // Check if the user is the admin ('admin')
            if (enteredUsername === 'admin') {
              // Show the admin panel
              adminPanel.style.display = 'block';
            }
          } else {
            loginErrorMessage.textContent = 'Invalid username or password';
            loginSuccessMessage.textContent = '';
            isValid = false;
          }
        });

        return isValid;
      }

      function validateUserAgainstServer(username, password, callback) {
        fetch(`${mongoApiEndpoint}/validate?username=${username}&password=${password}`)
          .then(response => response.json())
          .then(user => callback(user))
          .catch(error => {
            console.error('Failed to validate user against server:', error);
            callback(null);
          });
      }

      // Admin panel functionality
      function addUser() {
        var newUsernameInput = document.getElementById('newUsername');
        var newPasswordInput = document.getElementById('newPassword');
        var newBalanceInput = document.getElementById('newBalance');
        var adminPanel = document.getElementById('adminPanel');
        var successMessage = document.getElementById('login-success');

        var newUsername = newUsernameInput.value.trim();
        var newPassword = newPasswordInput.value.trim();
        var newBalance = parseInt(newBalanceInput.value);

        // Add user to MongoDB
        addUserToMongoDB(newUsername, newPassword, newBalance);

        console.log('Admin added new user to MongoDB:', newUsername, 'with password:', newPassword, 'and balance:', newBalance);

        successMessage.textContent = 'User added successfully!';

        newUsernameInput.value = '';
        newPasswordInput.value = '';
        newBalanceInput.value = '';

        adminPanel.style.display = 'none';
      }

      // Function to add user to MongoDB
      function addUserToMongoDB(username, password, balance) {
        fetch(`${mongoApiEndpoint}/addUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, balance }),
        })
          .then(response => {
            if (!response.ok) {
              console.error('Failed to add user to MongoDB:', response.statusText);
            }
          })
          .catch(error => {
            console.error('Failed to add user to MongoDB:', error);
          });
      }

      // Function to change user balance in MongoDB
      function changeUserBalanceInMongoDB(username, newBalance) {
        fetch(`${mongoApiEndpoint}/changeBalance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, newBalance }),
        })
          .then(response => {
            if (!response.ok) {
              console.error('Failed to change user balance in MongoDB:', response.statusText);
            }
          })
          .catch(error => {
            console.error('Failed to change user balance in MongoDB:', error);
          });
      }

      // Admin panel functionality to change user balance
      function changeBalance() {
        var changeUsernameInput = document.getElementById('changeUsername');
        var changeBalanceInput = document.getElementById('changeBalance');
        var adminPanel = document.getElementById('adminPanel');
        var successMessage = document.getElementById('login-success');

        var usernameToChange = changeUsernameInput.value.trim();
        var newBalanceValue = parseInt(changeBalanceInput.value);

        // Change user balance in MongoDB
        changeUserBalanceInMongoDB(usernameToChange, newBalanceValue);

        // Display success message
        successMessage.textContent = 'Balance changed successfully!';
      }
    </script>
  </div>
</body>
</html>
