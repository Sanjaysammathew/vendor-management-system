````markdown
# 🚀 VendorFlow - Vendor Management System

## 📖 Overview

**VendorFlow** is a web-based **Vendor Management System** developed using **HTML, CSS, JavaScript, jQuery, Bootstrap, and JSON Server**.

The application helps organizations and government departments streamline vendor registration and approval through a centralized platform. Vendors can register, submit their business details, monitor approval status, and update pending applications, while administrators can efficiently review, approve, reject, restore, and manage vendor records.

---

# 📑 Table of Contents

- Overview
- Features
- Workflow
- Technology Stack
- Project Structure
- Screenshots
- Installation
- Future Enhancements
- Conclusion

---

# ✨ Features

## 👤 Vendor Module

| Feature | Description |
|---------|-------------|
| Registration & Login | Secure vendor authentication |
| Vendor Registration | Submit vendor details |
| Vendor Dashboard | Manage vendor profile |
| Update Vendor | Edit pending applications |
| View Vendor Details | View complete vendor information |
| Status Tracking | Track application approval status |

---

## 🛡️ Admin Module

| Feature | Description |
|---------|-------------|
| Admin Login | Secure administrator access |
| Dashboard | View all vendor applications |
| View Vendor Details | View complete vendor profile |
| Approve Vendors | Approve vendor applications |
| Reject Vendors | Reject applications with remarks |
| Restore Vendors | Restore rejected applications |
| Delete Pending Vendors | Delete pending vendor requests |

---

# 🔄 Workflow

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
Stored in JSON Server
        │
        ▼
Admin Reviews Application
        │
   ┌────┴────┐
   ▼         ▼
Approve   Reject
   │         │
   └────┬────┘
        ▼
Vendor Status Updated
```

---

# 🛠️ Technology Stack

## Frontend

- HTML5
- CSS3
- Bootstrap 5
- JavaScript (ES6)
- jQuery

## Backend (Mock)

- JSON Server

## Database

- db.json

## Tools

- VS Code
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
│
├── json/
│   └── db.json
│
├── screenshots/
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

# 📸 Screenshots

### Home Page

![Home](./assests/Screenshot/Home%20page.png)

### Vendor Dashboard

![Vendor Dashboard](./assests/Screenshot/User%20Dashboard.png)

### Admin Dashboard

![Admin Dashboard](./assests/Screenshot/Admin%20Dashboard.png)

### Vendor Details

![Vendor Details](./assests/Screenshot/View%20Details.png)

### Add Details Modal

![Approval Modal](./assests/Screenshot/Records.png)

---

# 🚀 Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Sanjaysammathew/vendor-management-system.git
```

### 2️⃣ Navigate to Project

```bash
cd VendorFlow
```

### 3️⃣ Install JSON Server

```bash
npm install -g json-server
```

### 4️⃣ Start JSON Server

```bash
json-server --watch json/db.json --port 3000
```

### 5️⃣ Run Project

Open:

```text
index.html
```

using **Live Server** or any local web server.

---

# 🎯 Key Functionalities

## Vendor

- Register Account
- Login
- Submit Vendor Details
- View Vendor Profile
- Update Pending Applications
- Track Approval Status

---

## Administrator

- Login
- View Vendor Applications
- View Vendor Details
- Approve Vendor Applications
- Reject Vendor Applications
- Restore Rejected Vendors
- Delete Pending Applications
- Manage Vendor Records

---

# 🚀 Future Enhancements

- Email Notifications
- Document Upload
- Role-Based Access Control
- Dashboard Analytics
- Export Reports (Excel/PDF)
- MySQL Integration
- MongoDB Integration
- JWT Authentication
- REST API using Node.js & Express
- Audit Logs
- Vendor Performance Reports

---

# 🏆 Conclusion

**VendorFlow** provides a simple and efficient solution for managing vendor registration and approval workflows. With dedicated dashboards for vendors and administrators, the system ensures transparency, simplifies verification, and improves vendor management.

The project demonstrates the practical implementation of **CRUD operations, vendor approval workflows, status tracking, form validation, Local Storage authentication, JSON Server integration, and responsive user interface development** using modern web technologies.
````
