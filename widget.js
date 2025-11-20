document.addEventListener("DOMContentLoaded", function () {
  const chatButton = document.getElementById("chatButton");
  const chatModal = document.getElementById("chatModal");
  const closeButton = document.querySelector(".close");
  const sendButton = document.getElementById("sendButton");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

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

    // Simulate AI response (replace with actual API call later)
    setTimeout(function () {
      const aiResponse =
        "This is a simulated AI response. Connect to your backend API for real responses.";
      addMessage(aiResponse, "ai");
    }, 1000);
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
});
