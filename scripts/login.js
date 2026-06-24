const API = "http://localhost:3000/users";

const emailRegex = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const nameRegex = /^[A-Za-z0-9#@ ]+$/;

function setError(input, errorDiv, message) {
    $("#" + errorDiv).text(message);
    $(input).addClass("is-invalid").removeClass("is-valid");
}

function clearError(input, errorDiv) {
    $("#" + errorDiv).text("");
    $(input).addClass("is-valid").removeClass("is-invalid");
}

// Organization Validation
function validateName() {
    const value = $("#org").val().trim();

    if (value === "") {
        setError("#org", "error-loginName", "Organization Name is required");
        return false;
    }

    if (value.length < 3) {
        setError("#org", "error-loginName", "Minimum 3 characters required");
        return false;
    }

    if (!nameRegex.test(value)) {
        setError(
            "#org",
            "error-loginName",
            "Only letters, numbers, # and @ are allowed"
        );
        return false;
    }

    clearError("#org", "error-loginName");
    return true;
}

// Email Validation
function validateEmail() {
    const value = $("#email").val().trim();

    if (value === "") {
        setError("#email", "error-loginEmail", "Email is required");
        return false;
    }

    if (!emailRegex.test(value)) {
        setError("#email", "error-loginEmail", "Invalid Email Address");
        return false;
    }

    clearError("#email", "error-loginEmail");
    return true;
}

// Password Validation
function validatePassword() {
    const value = $("#regPassword").val().trim();

    if (value === "") {
        setError("#regPassword", "error-loginPass", "Password is required");
        return false;
    }

    if (!passRegex.test(value)) {
        setError(
            "#regPassword",
            "error-loginPass",
            "Password must contain 8+ chars, uppercase, lowercase, number and special character"
        );
        return false;
    }

    clearError("#regPassword", "error-loginPass");
    return true;
}

// Confirm Password Validation
function validateConfirmPassword() {
    const password = $("#regPassword").val();
    const confirmPassword = $("#confirmPassword").val();

    if (confirmPassword === "") {
        setError(
            "#confirmPassword",
            "error-login-Confirmpass",
            "Confirm Password is required"
        );
        return false;
    }

    if (password !== confirmPassword) {
        setError(
            "#confirmPassword",
            "error-login-Confirmpass",
            "Passwords do not match"
        );
        return false;
    }

    clearError("#confirmPassword", "error-login-Confirmpass");
    return true;
}

// GST Validation
function validateGST() {
    const gst = $("#gst").val().trim().toUpperCase();

    if (gst === "") {
        setError("#gst", "error-loginGst", "GST Number is required");
        return false;
    }

    if (!gstRegex.test(gst)) {
        setError("#gst", "error-loginGst", "Enter a valid GST Number");
        return false;
    }

    clearError("#gst", "error-loginGst");
    return true;
}

// Real-time Validation Events
$("#org").on("input", validateName);

$("#email").on("input", validateEmail);

$("#regPassword").on("input", function () {
    validatePassword();
    validateConfirmPassword();
});

$("#confirmPassword").on("input", validateConfirmPassword);

$("#gst").on("input", validateGST);

async function registerUser() {
    try {
        if (
            !validateName() ||
            !validateEmail() ||
            !validatePassword() ||
            !validateConfirmPassword() ||
            !validateGST()
        ) {
            return;
        }
const email = $("#email").val().trim();
const gstNumber = $("#gst").val().trim().toUpperCase();

const emailRes = await fetch(`${API}?email=${email}`);
const emailUsers = await emailRes.json();

if (emailUsers.length > 0) {
    Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Email already registered"
    });
    return;
}

const gstRes = await fetch(`${API}?gstNumber=${gstNumber}`);
const gstUsers = await gstRes.json();

if (gstUsers.length > 0) {
    Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "GST Number already registered"
    });
    return;
}

        const user = {
    organizationName: $("#org").val().trim(),
    email: $("#email").val().trim(),
    password: $("#regPassword").val(),
    gstNumber: $("#gst").val().trim().toUpperCase(),
    role: "user" 
};

        await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Registration Successful",
            timer: 2000,
            showConfirmButton: true
        });

        $("#org").val("");
        $("#email").val("");
        $("#regPassword").val("");
        $("#confirmPassword").val("");
        $("#gst").val("");

        $(".form-control")
            .removeClass("is-valid is-invalid");

        $(".text-danger").text("");

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!"
        });

        console.error(error);
    }
}

$("#register").on("click", registerUser);

function validateLoginEmail() {
    const value = $("#loginEmail").val().trim();

    if (value === "") {
        setError(
            "#loginEmail",
            "error-loginEmail",
            "Email is required"
        );
        return false;
    }

    if (!emailRegex.test(value)) {
        setError(
            "#loginEmail",
            "error-loginEmail",
            "Invalid Email Address"
        );
        return false;
    }

    clearError("#loginEmail", "error-loginEmail");
    return true;
}

$("#loginEmail").on("input", validateLoginEmail);

async function loginUser() {
    try {

        const email = $("#loginEmail").val().trim();
        const password = $("#password").val().trim();

        if (email === "" || password === "") {
            Swal.fire({
                icon: "warning",
                title: "Required",
                text: "Please enter Email and Password"
            });
            return;
        }

        const response = await fetch(`${API}?email=${email}`);
        const users = await response.json();

        if (users.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: "Email not found"
            });
            return;
        }

        const user = users[0];

        if (user.password !== password) {
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: "Incorrect Password"
            });
            return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify(user));

        Swal.fire({
            icon: "success",
            title: "Welcome",
            text: `${user.organizationName}`,
            timer: 1500,
            showConfirmButton: false
        }).then(() => {

            if (user.role === "admin") {
                window.location.href = "../pages/admin.html";
            } else {
                window.location.href = "../pages/vendor.html";
            }

        });

    } catch (error) {
        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong"
        });
    }
}

$("#login").on("click", loginUser);