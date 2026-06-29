````markdown
# 🚀 VendorFlow

<p align="center">
  <img src="assets/svg/logo.svg" width="180" alt="VendorFlow Logo">
</p>

<h2 align="center">Vendor Management System</h2>

<p align="center">
A modern web-based Vendor Management System that streamlines vendor registration, verification, approval, and management through a centralized workflow.
</p>

<p align="center">

![HTML5](https://img.shields.io/badge/HTML5-orange?style=for-the-badge&logo=html5)
![CSS3](https://img.shields.io/badge/CSS3-blue?style=for-the-badge&logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-yellow?style=for-the-badge&logo=javascript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple?style=for-the-badge&logo=bootstrap)
![jQuery](https://img.shields.io/badge/jQuery-blue?style=for-the-badge&logo=jquery)
![JSON Server](https://img.shields.io/badge/JSON--Server-green?style=for-the-badge)

</p>

---

# 📖 Overview

VendorFlow is a Vendor Management System developed using **HTML, CSS, JavaScript, Bootstrap, jQuery, and JSON Server**.

The application enables organizations and government departments to efficiently manage vendor registrations through a structured approval workflow. Vendors can register, submit business information, monitor approval status, and update pending applications, while administrators can review, approve, reject, restore, and manage vendor records from a centralized dashboard.

---

# ✨ Features

## 👤 Vendor Module

- Register Account
- Secure Login
- Submit Vendor Details
- View Vendor Profile
- Update Pending Applications
- Track Approval Status

---

## 🛡️ Admin Module

- Admin Login
- Dashboard
- View Vendor Applications
- View Vendor Details
- Approve Vendors
- Reject Vendors with Remarks
- Restore Rejected Vendors
- Delete Pending Applications

---

# 📸 Application Preview

## 🏠 Home Page

![Home](assets/screenshots/home.png)

---

## 🔐 Login Page

![Login](assets/screenshots/login.png)

---

## 📝 Register Page

![Register](assets/screenshots/register.png)

---

## 👤 Vendor Dashboard

![Vendor Dashboard](assets/screenshots/vendor-dashboard.png)

---

## 🛡️ Admin Dashboard

![Admin Dashboard](assets/screenshots/admin-dashboard.png)

---

## 📄 Vendor Details

![Vendor Details](assets/screenshots/vendor-details.png)

---

## ✅ Approval Modal

![Approval Modal](assets/screenshots/approval-modal.png)

---

# 🔄 System Workflow

```text
Vendor Registration
        │
        ▼
Vendor Login
        │
        ▼
Submit Vendor Details
        │
        ▼
JSON Server
        │
        ▼
Admin Dashboard
        │
   ┌────┴────┐
   ▼         ▼
Approve   Reject
        │
        ▼
Vendor Status Updated
```

---

# 🛠️ Technology Stack

### Frontend

- HTML5
- CSS3
- Bootstrap 5
- JavaScript (ES6)
- jQuery

### Backend

- JSON Server

### Database

- db.json

### Tools

- Visual Studio Code
- Git
- GitHub
- Bootstrap Icons
- SweetAlert2
- Local Storage

---

# 📂 Project Structure

```text
VendorFlow/
│
├── assets/
│   ├── images/
│   ├── icons/
│   ├── screenshots/
│   └── svg/
│
├── config/
│   └── config.js
│
├── css/
│   ├── style.css
│   ├── admin.css
│   └── vendor.css
│
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── admin.js
│   ├── vendor.js
│   └── validation.js
│
├── json/
│   └── db.json
│
├── index.html
├── login.html
├── register.html
├── vendor.html
├── admin.html
│
└── README.md
```

---

# 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/yourusername/VendorFlow.git
```

### Navigate to Project

```bash
cd VendorFlow
```

### Install JSON Server

```bash
npm install -g json-server
```

### Start Server

```bash
json-server --watch json/db.json --port 3000
```

### Run the Application

Open **index.html** using **Live Server**.

---

# 📌 Core Modules

### Vendor

- Registration
- Authentication
- Vendor Profile
- Vendor Details
- Status Tracking
- Update Application

---

### Administrator

- Dashboard
- Vendor Management
- Vendor Approval
- Reject with Remarks
- Restore Vendors
- Delete Pending Applications

---

# 🚀 Future Enhancements

- JWT Authentication
- Role-Based Access Control
- Email Notifications
- Document Upload
- Dashboard Analytics
- Export Reports (PDF & Excel)
- MySQL Integration
- MongoDB Integration
- REST API with Node.js & Express
- Audit Logs

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future improvements.

---
````
