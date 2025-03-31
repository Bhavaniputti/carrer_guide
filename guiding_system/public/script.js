async function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
      const response = await fetch("/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
          const errorData = await response.json(); // Ensure response can be parsed
          throw new Error(errorData.error || "Registration failed");
      }

      const data = await response.json();
      alert(data.message);
      window.location.href = "login.html";
  } catch (error) {
      alert("Error: " + error.message);
  }
}

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value; // Fixed Typo

  try {
      const response = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      console.log("Login Success:", data); // Debugging

      alert(data.message);
      localStorage.setItem("userEmail", email);

      if (data.token) {
          localStorage.setItem("authToken", data.token); // Store token if provided
      }

      window.location.href = "dashboard.html";
  } catch (error) {
      alert("Error: " + error.message);
  }
}

// Function to handle logout
function logout() {
  alert("Logging out...");
  window.location.href = "index.html";
}

// Event listener for the year selection form
document.addEventListener("DOMContentLoaded", () => {
  const yearForm = document.getElementById("yearForm");
  const learningContent = document.getElementById("learningContent");
  const continueButton = document.createElement("button");

  continueButton.innerText = "Continue";
  continueButton.style.display = "none";
  continueButton.classList.add("continue-button");
  document.body.appendChild(continueButton); // Append to body or desired container

  if (yearForm) {
      yearForm.addEventListener("submit", function(event) {
          event.preventDefault();
          const year = document.getElementById("year").value;
          const learningPaths = {
              "1": "In 1st Year: Learn Programming Fundamentals - Python, Java, Data Structures & Algorithms.",
              "2": "In 2nd Year: Learn Web Development (HTML, CSS, JS), Databases, and OOP concepts.",
              "3": "In 3rd Year: Choose specialization - Machine Learning, Full Stack Development, etc.",
              "4": "In 4th Year: Work on advanced projects, internships, and job preparation."
          };

          if (year && learningPaths[year]) {
              learningContent.innerHTML = `<p>${learningPaths[year]}</p>`;
              learningContent.style.display = "block";
          }
      });
  }

  // Attach logout functionality to the logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
  }
});