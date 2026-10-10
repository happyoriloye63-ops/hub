
// ======================================
// SIGNUP
// ======================================

const signupForm = document.querySelector("#signupForm");


if (signupForm) {

    signupForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const fullname =
            document.getElementById("fullname").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirm-password").value;


        // Check passwords

        if (password !== confirmPassword) {

            alert("❌ Passwords do not match!");

            return;

        }


        // Check password length

        if (password.length < 6) {

            alert(
                "❌ Password must be at least 6 characters!"
            );

            return;

        }


        try {

            const response = await fetch(
                "http://localhost:5000/auth/signup",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        fullname: fullname,
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert("❌ " + data.message);

                return;

            }


            alert(
                "🎉 Account created successfully!"
            );


            window.location.href = "login.html";


        } catch (error) {

            console.error(error);

            alert(
                "❌ Cannot connect to StudentHub server."
            );

        }

    });

}


// ======================================
// LOGIN
// ======================================

const loginForm = document.querySelector("#loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        try {

            const response = await fetch(
                "http://localhost:5000/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert("❌ " + data.message);

                return;

            }


            // Save login token

            localStorage.setItem(
                "studenthubToken",
                data.token
            );


            // Save student information

            localStorage.setItem(
                "studenthubStudent",
                JSON.stringify(data.student)
            );


            alert("✅ Login successful!");


            // Go to dashboard

            window.location.href = "dashboard.html";


        } catch (error) {

            console.error(error);

            alert(
                "❌ Cannot connect to StudentHub server."
            );

        }

    });

}