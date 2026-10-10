// ======================================
// STUDENT DASHBOARD
// ======================================

// Get the logged-in student's token
const token = localStorage.getItem("studenthubToken");

// Get saved student information
const savedStudent =
    localStorage.getItem("studenthubStudent");


// If the student is not logged in
if (!token) {
    window.location.href = "login.html";
}


// Show the student's name
if (savedStudent) {

    const student = JSON.parse(savedStudent);

    document.getElementById("studentName").textContent =
        student.fullname;
}


// ======================================
// LOGOUT
// ======================================

const logoutBtn =
    document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {

    // Remove login information
    localStorage.removeItem("studenthubToken");
    localStorage.removeItem("studenthubStudent");

    // Go back to login
    window.location.href = "login.html";
});