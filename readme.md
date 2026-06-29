````markdown
<div align="center">

<img src="assets/svg/logo.svg" width="170">

# VendorFlow

### Vendor Management System

<p>
A modern web-based application for managing vendor registration,
verification, approval, and administration through a centralized workflow.
</p>

<p>

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white">
<img src="https://img.shields.io/badge/jQuery-0769AD?style=flat-square&logo=jquery&logoColor=white">
<img src="https://img.shields.io/badge/JSON_Server-44CC11?style=flat-square">

</p>

</div>

---

## 📖 About

VendorFlow is a **Vendor Management System** built using **HTML5, CSS3, JavaScript, Bootstrap, jQuery, and JSON Server**.

It enables organizations and government departments to efficiently manage vendor registrations through a structured approval workflow.

---

## ✨ Features

<table>

<tr>
<th width="50%">Vendor</th>
<th width="50%">Administrator</th>
</tr>

<tr>

<td>

- Register Account
- Secure Login
- Submit Vendor Details
- View Vendor Profile
- Update Pending Applications
- Track Approval Status

</td>

<td>

- Admin Dashboard
- View Vendor Applications
- View Vendor Details
- Approve Vendors
- Reject with Remarks
- Restore Vendors
- Delete Pending Applications

</td>

</tr>

</table>

---

## 📸 Screenshots

| Home | Vendor Dashboard |
|------|------------------|
| ![](assets/screenshots/home.png) | ![](assets/screenshots/vendor-dashboard.png) |

| Admin Dashboard | Vendor Details |
|-----------------|----------------|
| ![](assets/screenshots/admin-dashboard.png) | ![](assets/screenshots/vendor-details.png) |

| Approval Modal | Register |
|----------------|----------|
| ![](assets/screenshots/approval-modal.png) | ![](assets/screenshots/register.png) |

---

## ⚙ Workflow

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

## 🛠 Technology Stack

| Category | Technologies |
|-----------|--------------|
| Frontend | HTML5 • CSS3 • Bootstrap 5 • JavaScript • jQuery |
| Backend | JSON Server |
| Database | db.json |
| Tools | VS Code • Git • GitHub • Bootstrap Icons • SweetAlert2 |

---

## 📂 Project Structure

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
│   ├── admin.js
│   ├── vendor.js
│   ├── login.js
│   ├── register.js
│   └── script.js
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

## 🚀 Getting Started

```bash
# Clone Repository
git clone https://github.com/yourusername/VendorFlow.git

# Navigate
cd VendorFlow

# Install JSON Server
npm install -g json-server

# Start Server
json-server --watch json/db.json --port 3000
```

Open **index.html** using **Live Server**.

---

## 🚀 Future Enhancements

- JWT Authentication
- Role-Based Access Control
- Email Notifications
- Document Upload
- Dashboard Analytics
- Export PDF & Excel
- MySQL Integration
- MongoDB Integration
- REST API (Node.js & Express)
- Audit Logs

---

<div align="center">

### ⭐ Star this repository if you found it useful!

Made with ❤️ using HTML, CSS, JavaScript, Bootstrap, jQuery & JSON Server.

</div>
````
