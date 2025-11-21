const API_BASE_URL = "http://localhost:8080/api";

document.addEventListener("DOMContentLoaded", function () {
  // User Management Elements
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const createUserBtn = document.getElementById("createUserBtn");
  const loadUsersBtn = document.getElementById("loadUsersBtn");
  const usersList = document.getElementById("usersList");

  // Chat Elements
  const chatButton = document.getElementById("chatButton");
  const chatModal = document.getElementById("chatModal");
  const closeButton = document.querySelector(".close");
  const sendButton = document.getElementById("sendButton");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  // ========== User Management Functions ==========

  // Create User
  createUserBtn.addEventListener("click", async function () {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();

    if (!firstName || !lastName) {
      alert("Please enter both first and last name");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      if (response.ok) {
        const user = await response.json();
        alert(`User created successfully! ID: ${user.id}`);
        firstNameInput.value = "";
        lastNameInput.value = "";
        loadUsers(); // Reload the users list
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to create user"}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert(
        "Failed to connect to backend. Make sure the server is running on port 8080."
      );
    }
  });

  // Load Users
  loadUsersBtn.addEventListener("click", loadUsers);

  async function loadUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);

      if (response.ok) {
        const users = await response.json();
        displayUsers(users);
      } else {
        usersList.innerHTML = '<p class="error">Failed to load users</p>';
      }
    } catch (error) {
      console.error("Error loading users:", error);
      usersList.innerHTML =
        '<p class="error">Failed to connect to backend. Make sure the server is running on port 8080.</p>';
    }
  }

  function displayUsers(users) {
    if (users.length === 0) {
      usersList.innerHTML = "<p>No users found. Create one above!</p>";
      return;
    }

    let html = '<div class="users-grid">';
    users.forEach((user) => {
      html += `
        <div class="user-card" data-id="${user.id}">
          <div class="user-info">
            <strong>${user.firstName} ${user.lastName}</strong>
            <span class="user-id">ID: ${user.id}</span>
          </div>
          <div class="user-actions">
            <button class="btn-edit" onclick="editUser(${user.id}, '${user.firstName}', '${user.lastName}')">Edit</button>
            <button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>
          </div>
        </div>
      `;
    });
    html += "</div>";
    usersList.innerHTML = html;
  }

  // Make functions global for inline onclick handlers
  window.editUser = async function (id, firstName, lastName) {
    const newFirstName = prompt("Enter new first name:", firstName);
    const newLastName = prompt("Enter new last name:", lastName);

    if (newFirstName && newLastName) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: newFirstName,
            lastName: newLastName,
          }),
        });

        if (response.ok) {
          alert("User updated successfully!");
          loadUsers();
        } else {
          alert("Failed to update user");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to connect to backend");
      }
    }
  };

  window.deleteUser = async function (id) {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("User deleted successfully!");
          loadUsers();
        } else {
          alert("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to connect to backend");
      }
    }
  };

  // ========== Chat Functions ==========

  // Open modal when chat button is clicked
  chatButton.addEventListener("click", function () {
    chatModal.classList.add("active");
    chatInput.focus();
  });

  // Close modal when close button is clicked
  closeButton.addEventListener("click", function () {
    chatModal.classList.remove("active");
  });

  // Close modal when clicking outside the modal content
  chatModal.addEventListener("click", function (event) {
    if (event.target === chatModal) {
      chatModal.classList.remove("active");
    }
  });

  // Send message function
  function sendMessage() {
    const message = chatInput.value.trim();

    if (message === "") {
      return;
    }

    // Add user message to chat
    addMessage(message, "user");

    // Clear input
    chatInput.value = "";

    // Simulate AI response
    setTimeout(function () {
      const aiResponse =
        "AI chat integration coming soon! Currently, you can manage users via the main interface.";
      addMessage(aiResponse, "ai");
    }, 500);
  }

  // Add message to chat window
  function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Send message on button click
  sendButton.addEventListener("click", sendMessage);

  // Send message on Enter key press
  chatInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  // Load users on page load
  loadUsers();
});
