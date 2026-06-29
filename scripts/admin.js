import { VENDOR_API } from "./config.js";

let allVendors = [];
let currentPage = 1;
const rowsPerPage = 5;

document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

    loadVendors();

    console.log(allVendors.length, document.getElementById("pagination"));

    $('#userProfile').on('show.bs.offcanvas', function () {
        if (currentUser) {
            $("#dropdownUsername").text(currentUser.organizationName || "User");
            $("#profileDesignation").text(currentUser.role || "N/A");
            $("#profileEmpId").text(currentUser.employeeId || currentUser.id || "N/A");
            $("#profileEmail").text(currentUser.email || "N/A");
            $("#profileDept").text(currentUser.department || "N/A");
            $("#profileRole").text(currentUser.role || "N/A");
            $("#profileGender").text(currentUser.gender || "N/A");
            $("#profileDob").text(currentUser.dateOfBirth || "N/A");
        } else {
            console.warn("Failed loading profiles: 'currentUser' was missing from localStorage.");
        }
    });

    if (currentUser) {
        $("#navUsername").text(currentUser.organizationName);
    }

    const buttons = document.querySelectorAll("#button-container .btn");
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            buttons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
        });
    });

});


async function loadVendors() {
    try {
        const response = await fetch(`${ VENDOR_API }?isDeleted=false`)
        const data = await response.json()

        data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

        allVendors = data;
        countStat(data);

        currentPage = 1;
        displayPage(currentPage);

    } catch (err) {
        console.log(err);
    }
}


function displayVendorCards(data) {
    const table = document.getElementById("vendorTableBody")
    table.innerHTML = "";

    const card = document.getElementById("noRecord")
    card.innerHTML = ""

    const tableContainer = document.querySelector(".table-responsive");

    if (data.length === 0) {
        tableContainer.style.display = "none";

        card.innerHTML = `
            <div class="col-12 ms-auto">
                <div class="text-center py-5">
                    <i class="bi bi-search fs-1 text-secondary"></i>
                    <h4 class="mt-3">No Records Found</h4>
                    <p class="text-muted">
                        No vendors match your search or filter.
                    </p>
                </div>
            </div>
        `;
        return;
    }

    tableContainer.style.display = "block";

    data.forEach(task => {
        table.innerHTML += `
        <tr>
    <td>${task.gstNumber}</td>
    <td>${task.vendorType}</td>
    <td>${task.licenseNumber}</td>

    <td>
        <span class="badge ${
            task.status === "approved"
                ? "bg-success"
                : task.status === "rejected"
                ? "bg-danger"
                : "bg-warning text-dark"
        }">
            ${capitalize(task.status)}
        </span>
    </td>

    <td>${new Date(task.createdAt).toLocaleDateString()}</td>

    <td>
        <button
            class="btn btn-sm btn-primary rounded-pill"
            onclick="viewVendor('${task.id}')"
            data-bs-toggle="tooltip"
            title="View Vendor">
            <i class="bi bi-eye"></i>
        </button>
    </td>
</tr>
        `
    })
}


function displayPage(page) {
    currentPage = page;

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const paginatedData = allVendors.slice(start, end);

    displayVendorCards(paginatedData);
    createPagination();
}

window.displayPage = displayPage;


function createPagination() {
    const totalPages = Math.ceil(allVendors.length / rowsPerPage);

    let html = "";

    if (totalPages <= 1) {
        $("#pagination").html("");
        return;
    }

    html += `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="event.preventDefault(); displayPage(${currentPage - 1})">
                Previous
            </a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
        <li class="page-item ${currentPage === i ? "active" : ""}">
            <a class="page-link" href="#" onclick="event.preventDefault(); displayPage(${i})">
                ${i}
            </a>
        </li>
        `;
    }

    html += `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="event.preventDefault(); displayPage(${currentPage + 1})">
                Next
            </a>
        </li>
    `;

    $("#pagination").html(html);
}


async function loadVendorByStatus(status) {
    try {
        const response = await fetch(
            `${ VENDOR_API }?isDeleted=false&status=${status}`
        );

        const vendors = await response.json();

        allVendors = vendors;
        currentPage = 1;
        displayPage(currentPage);

    } catch (err) {
        console.log(err);
    }
}

$(".gradient-all").click(function () {
    loadVendors();
    scrollToTable();
});

$(".gradient-completed").click(function () {
    loadVendorByStatus("approved");
    scrollToTable();
});

$(".gradient-pending").click(function () {
    loadVendorByStatus("pending");
    scrollToTable();
});

$(".gradient-rejected").click(function () {
    loadVendorByStatus("rejected");
    scrollToTable();
});

async function viewVendor(id) {
    try {
        const response = await fetch(`${ VENDOR_API }/${id}`);
        const vendor = await response.json();

        $("#viewOrganization").text(vendor.organizationName);
        $("#viewEmail").text(vendor.email);
        $("#viewPhone").text(vendor.phone);
        $("#viewGST").text(vendor.gstNumber);
        $("#viewLicense").text(vendor.licenseNumber);
        $("#viewVendorType").text(vendor.vendorType);
        $("#viewDescription").text(vendor.description);
        $("#viewCreatedAt").text(
            new Date(vendor.createdAt).toLocaleDateString()
        );
        $("#viewUpdatedAt").text(
    new Date(vendor.updatedAt).toLocaleDateString()
);

        let badge = "";

        if (vendor.status === "approved") {
            badge = `<span class="status-pill status-approved">Approved</span>`;
        }
        else if (vendor.status === "pending") {
            badge = `<span class="status-pill status-pending">Pending</span>`;
        }
        else {
            badge = `<span class="status-pill status-rejected">Rejected</span>`;
        }

        $("#statusBadge").html(badge);

        $("#approveBtn").data("id", vendor.id);
        $("#rejectBtn").data("id", vendor.id);

        if (vendor.status === "pending") {
            $("#actionButtons").show();
            $("#remarksSection").hide();
        } else {
            $("#actionButtons").hide();
            $("#remarksSection").show();
            $("#viewRemarks").text(vendor.remarks || "No Remarks");
        }

        const modal = new bootstrap.Modal(
            document.getElementById("viewVendorModal")
        );

        modal.show();

    } catch (err) {
        console.log(err);
    }
}
window.viewVendor = viewVendor;

let currentVendorId = null;
let currentAction = "";

$("#approveBtn").click(function () {
    currentVendorId = $(this).data("id");
    currentAction = "approved";
    $("#remarksTitle").text("Approve Vendor");
    $("#remarksInput").val("");
});

$("#rejectBtn").click(function () {
    currentVendorId = $(this).data("id");
    currentAction = "rejected";
    $("#remarksTitle").text("Reject Vendor");
    $("#remarksInput").val("");
});

$("#submitRemarksBtn").click(async function () {
     const remarks = $("#remarksInput").val().trim();

const formattedRemarks =
    remarks.charAt(0).toUpperCase() + remarks.slice(1);

    if (remarks === "") {
        Swal.fire("Required", "Please enter remarks.", "warning");
        return;
    }

    await fetch(`${ VENDOR_API }/${currentVendorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            status: currentAction,
            remarks: formattedRemarks,
            updatedAt: new Date().toISOString()
        })
    });

    bootstrap.Modal.getInstance(document.getElementById("remarksModal")).hide();
    bootstrap.Modal.getInstance(document.getElementById("viewVendorModal")).hide();

    loadVendors();

    Swal.fire("Success", `Vendor ${currentAction} successfully.`, "success");
});

async function applyFilters() {
    const searchText = $("#searchVendor").val().toLowerCase().trim();
    const fromDate = $("#fromDate").val();
    const toDate = $("#toDate").val();

    const response = await fetch(`${ VENDOR_API }?isDeleted=false`);
    let vendors = await response.json();

    if (searchText) {
        vendors = vendors.filter(vendor =>
            vendor.vendorType.toLowerCase().includes(searchText)
        );
    }

    if (fromDate) {
        vendors = vendors.filter(vendor =>
            vendor.createdAt.split("T")[0] >= fromDate
        );
    }

    if (toDate) {
        vendors = vendors.filter(vendor =>
            vendor.createdAt.split("T")[0] <= toDate
        );
    }

    allVendors = vendors;
    currentPage = 1;
    displayPage(currentPage);
}

$("#searchVendor").on("input", applyFilters);
$("#fromDate").on("change", applyFilters);
$("#toDate").on("change", applyFilters);

$("#clearFiltersBtn").click(function () {
    $("#searchVendor").val("");
    $("#fromDate").val("");
    $("#toDate").val("");
    loadVendors();
});

function countStat(data) {
    const total = data.length;
    const completed = data.filter(v => v.status === "approved").length;
    const pending = data.filter(v => v.status === "pending").length;
    const rejected = data.filter(v => v.status === "rejected").length;

    $("#totalCount").text(total);
    $("#completedCount").text(completed);
    $("#pendingCount").text(pending);
    $("#rejectedCount").text(rejected);

    $("#totalProgress").css("width", "100%");
    $("#completedProgress").css("width", (completed / total) * 100 + "%");
    $("#pendingProgress").css("width", (pending / total) * 100 + "%");
    $("#rejectedProgress").css("width", (rejected / total) * 100 + "%");
}

$("#logoutBtn").click(async function () {
    const result = await Swal.fire({
        title: "Logout?",
        text: "Are you sure you want to logout?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Logout",
        cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("loggedInUser");

    Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully.",
        timer: 1500,
        showConfirmButton: true
    });

    setTimeout(() => {
        window.location.href = "../pages/index.html";
    }, 1500);
});

$("#fromDate, #toDate").on("keydown paste", function (e) {
    e.preventDefault();
});

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
function scrollToTable() {
    document.getElementById("vendorTableSection").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

$("#totalCard").click(function () {
    loadVendors();
    scrollToTable();
});

$("#completedCard").click(function () {
    loadVendorByStatus("approved");
    scrollToTable();
});

$("#pendingCard").click(function () {
    loadVendorByStatus("pending");
    scrollToTable();
});

$("#rejectedCard").click(function () {
    loadVendorByStatus("rejected");
    scrollToTable();
});