const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const API="http://localhost:3000/vendorDetails"
const USER_API = "http://localhost:3000/users";

$("#orgName").val(loggedInUser.organizationName);
$("#gst").val(loggedInUser.gstNumber);
$("#addEmail").val(loggedInUser.email);

$("#navUsername").text(loggedInUser.organizationName);
$("#dropdownUsername").text(loggedInUser.organizationName);

$("#profileOrg").text(loggedInUser.organizationName);
$("#profileEmail").text(loggedInUser.email);
$("#profileGST").text(loggedInUser.gstNumber);

// off canvas details like phone number
async function loadVendorProfile() {

       const response = await fetch(
        `${API}?gstNumber=${loggedInUser.gstNumber}`
    );

    const vendor = await response.json();

    if(vendor.length > 0){

        const details = vendor[0];

        $("#profileNumber").text(details.phone);
        $("#profileLicense").text(details.licenseNumber);
        $("#profileAddress").text(details.address);

    }else{

        $("#profileNumber").text("-");
        $("#profileLicense").text("-");
        $("#profileAddress").text("-");
    
    }

}
 
//phone number regex
const phoneRegex = /^[6-9]\d{9}$/;

$("#number").on("input", function () {

    const phone = $(this).val().trim();

    if (phone === "") {
        $("#error-phone").text("Phone number is required");
    }
    else if (!phoneRegex.test(phone)) {
        $("#error-phone").text("Enter a valid 10-digit phone number");
    }
    else {
        $("#error-phone").text("");
    }

});

//to check all fileds are completed and post details to db
$("#saveBtn").click(async function () {

    let isValid = true;

const vendorType = capitalizeFirst($("#vendor-type").val().trim());
const description = capitalizeFirst($("#desc").val().trim());
const address = capitalizeFirst($("#address").val().trim());
const licenseNumber = capitalizeFirst($("#license").val().trim());
const contactPerson = capitalizeFirst($("#contactPerson").val().trim());
const contactDesignation = capitalizeFirst($("#contactDesignation").val().trim());

    // Phone
    const phone = $("#number").val().trim();

    if (phone === "") {
        $("#error-phone").text("Phone number is required");
        isValid = false;
    }

    // Vendor Type
    if ($("#vendor-type").val().trim() === "") {
        $("#error-vendor").text("You have to complete the details");
        isValid = false;
    } else {
        $("#error-vendor").text("");
    }

    // Description
    if ($("#desc").val().trim() === "") {
        $("#error-desc").text("You have to complete the details");
        isValid = false;
    } else {
        $("#error-desc").text("");
    }

    // Address
    if ($("#address").val().trim() === "") {
        $("#error-address").text("You have to complete the details");
        isValid = false;
    } else {
        $("#error-address").text("");
    }

    if (contactPerson === "") {
    $("#error-contactPerson").text("Contact Person is required");
    isValid = false;
} else {
    $("#error-contactPerson").text("");
}

if (contactDesignation === "") {
    $("#error-contactDesignation").text("Designation is required");
    isValid = false;
} else {
    $("#error-contactDesignation").text("");
}

if (licenseNumber === "") {
    $("#error-license").text("License Number is required");
    isValid = false;
} else {
    $("#error-license").text("");
}



    if (!isValid) return;

    const response = await fetch(`${API}?licenseNumber=${licenseNumber}`);
const vendor = await response.json();

if (vendor.length) {
    $("#error-license").text("License Number already exists");
    return;
}

      const vendorData = {
    organizationName: loggedInUser.organizationName,
    email: loggedInUser.email,
    gstNumber: loggedInUser.gstNumber,

    licenseNumber: licenseNumber,
    phone: phone,

    contactPerson: contactPerson,
    contactDesignation: contactDesignation,

    vendorType: vendorType,
    description: description,
    address: address,

    isDeleted: false,
    status: "pending",
    remarks: "",

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

    try {

        const response = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(vendorData)
        });

        if (!response.ok) {
            throw new Error("Failed to save");
        }

        Swal.fire({
            icon: "success",
            title: "Success",
            text: "Vendor details added successfully"
        });

        $("#detailsForm")[0].reset();
        bootstrap.Modal.getInstance(document.getElementById("addModal")).hide();
         loadVendorCards()

    } catch (error) {

        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong"
        });


        console.log(error);
    }

});

async function loadVendorCards() {

    try {

        const response = await fetch(
            `${API}?gstNumber=${loggedInUser.gstNumber}&isDeleted=false`
        );

        const vendors = await response.json();

        vendors.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

       displayVendorCards(vendors)
        countStat(vendors);

        console.log(vendors)


    } catch (err) {
        console.log(err);
    }
}


//edit task
async function editVendor(id) {

    const response = await fetch(`${API}/${id}`);
    const vendor = await response.json();

    console.log("Vendor ID:", id);

    $("#editId").val(vendor.id);

   $("#editOrganization").val(vendor.organizationName);
$("#editEmail").val(vendor.email);
$("#editGST").val(vendor.gstNumber);

$("#editLicense").val(vendor.licenseNumber);
$("#editPhone").val(vendor.phone);
$("#editVendorType").val(vendor.vendorType);
$("#editContactPerson").val(vendor.contactPerson);
$("#editContactDesignation").val(vendor.contactDesignation);
$("#editDesc").val(vendor.description);
$("#editAddress").val(vendor.address);

$("#editCreatedAt").val(
    new Date(vendor.createdAt).toLocaleDateString()
);
}

// update Task

$("#updateBtn").click(async function () {

    const id = $("#editId").val();

    const response = await fetch(`${API}/${id}`);
    const vendor = await response.json();

 const license = $("#editLicense").val().trim();
const phone = $("#editPhone").val().trim();
const vendorType = $("#editVendorType").val().trim();
const contactPerson = $("#editContactPerson").val().trim();
const contactDesignation = $("#editContactDesignation").val().trim();
const description = $("#editDesc").val().trim();
const address = $("#editAddress").val().trim();

if (
    license === "" ||
    phone === "" ||
    vendorType === "" ||
    contactPerson === "" ||
    contactDesignation === "" ||
    description === "" ||
    address === ""
) {
    Swal.fire({
        icon: "warning",
        title: "Required",
        text: "All fields are required."
    });

    return;
}

// Check duplicate license number
const checkResponse = await fetch(`${API}?licenseNumber=${license}`);

const vendors = await checkResponse.json();

const duplicateVendor = vendors.find(v => v.id !== id);

if (duplicateVendor) {

    Swal.fire({
        icon: "warning",
        title: "Duplicate License Number",
        text: "License Number already exists."
    });

    return;
}

const updatedLicense = capitalizeFirst($("#editLicense").val().trim());
const updatedPhone = $("#editPhone").val().trim();
const updatedVendorType = capitalizeFirst($("#editVendorType").val().trim());
const updatedContactPerson = capitalizeFirst($("#editContactPerson").val().trim());
const updatedDesignation = capitalizeFirst($("#editContactDesignation").val().trim());
const updatedDescription = capitalizeFirst($("#editDesc").val().trim());
const updatedAddress = capitalizeFirst($("#editAddress").val().trim());

if (
    vendor.licenseNumber === updatedLicense &&
    vendor.phone === updatedPhone &&
    vendor.vendorType === updatedVendorType &&
    vendor.contactPerson === updatedContactPerson &&
    vendor.contactDesignation === updatedDesignation &&
    vendor.description === updatedDescription &&
    vendor.address === updatedAddress
) {
    Swal.fire({
        icon: "info",
        title: "No Changes Detected",
        text: "Please modify at least one field before updating."
    });

    return;
}

  const updatedVendor = {
    ...vendor,

    licenseNumber: capitalizeFirst($("#editLicense").val().trim()),
    phone: $("#editPhone").val().trim(),
    vendorType: capitalizeFirst($("#editVendorType").val().trim()),
    contactPerson: capitalizeFirst($("#editContactPerson").val().trim()),
    contactDesignation: capitalizeFirst($("#editContactDesignation").val().trim()),
    description: capitalizeFirst($("#editDesc").val().trim()),
    address: capitalizeFirst($("#editAddress").val().trim()),
    status: vendor.status === "rejected" ? "pending" : vendor.status,
    remarks: vendor.status === "rejected" ? "" : vendor.remarks,
    updatedAt: new Date().toISOString()
};

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedVendor)
    });

    Swal.fire({
        icon: "success",
        title: "Updated Successfully"
    });

    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();

    loadVendorCards();

});

//delete task

async function deleteVendor(id) {

    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You can restore it later.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete"
    });

    if (!result.isConfirmed) return;

    try {

        const response = await fetch(`${API}/${id}`);
        const vendor = await response.json();

        const updatedVendor = {
            ...vendor,
            isDeleted: true,
            updatedAt: new Date().toISOString()
        };

        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedVendor)
        });

        Swal.fire({
            icon: "success",
            title: "Deleted Successfully"
        });

        loadVendorCards();

    } catch (err) {
        console.log(err);
    }

}
 //load deleted task 
async function loadDeletedCards() {

    try {

        const response = await fetch(
            `${API}?gstNumber=${loggedInUser.gstNumber}&isDeleted=true`
        );

        const vendors = await response.json();

        const cards = document.getElementById("vendorCards");
        cards.innerHTML = "";

            if (vendors.length === 0) {
        cards.innerHTML = `
            <div class="col-12">
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

        vendors.forEach(vendor => {

         cards.innerHTML += `
<div class="col-lg-4 col-md-6 mb-4">

    <div class="card vendor-card border-0 shadow h-100">

        <!-- Header -->
        <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">

            <div>
                <h5 class="fw-bold mb-1">
                    <i class="bi bi-building-fill text-primary me-2"></i>
                    ${vendor.vendorType}
                </h5>

                <small class="text-muted">
                    <i class="bi bi-calendar3 me-1"></i>
                    ${new Date(vendor.createdAt).toLocaleDateString()}
                </small>
            </div>

            <span class="badge rounded-pill ${getBadgeClass(vendor.status)} px-3 py-2">
                  ${capitalize(vendor.status)}
            </span>

        </div>

        <!-- Body -->
        <div class="card-body">

            <!-- GST & License -->
            <div class="row g-3 mb-4">

                <div class="col-6">
                    <div class="p-3 bg-light rounded-3 border h-100">
                        <small class="text-muted d-block">
                            GST Number
                        </small>

                        <div class="fw-bold mt-1">
                            ${vendor.gstNumber}
                        </div>
                    </div>
                </div>

                <div class="col-6">
                    <div class="p-3 bg-light rounded-3 border h-100">
                        <small class="text-muted d-block">
                            License Number
                        </small>

                        <div class="fw-bold mt-1">
                            ${vendor.licenseNumber}
                        </div>
                    </div>
                </div>

            </div>

            <!-- Description -->
            <div class="mb-4">

                <small class="text-muted fw-semibold">
                    Description
                </small>

                <p class="fs-6 mt-2 mb-0">
                    ${vendor.description}
                </p>

            </div>

            <!-- Remarks -->
            <div>

                <small class="text-muted fw-semibold">
                    Remarks
                </small>

                <p class="fs-6 mt-2 mb-0">
                    ${vendor.remarks || "-"}
                </p>

            </div>

        </div>

        <!-- Footer -->
        <div class="card-footer bg-white border-0">

            <div class="d-flex justify-content-center gap-3">

                <!-- View -->
                <button
                    class="btn btn-outline-info flex-fill"
                    data-bs-toggle="modal"
                    data-bs-target="#viewModal"
                    onclick="viewVendor('${vendor.id}')">

                    <i class="bi bi-eye-fill me-1"></i>
                    View

                </button>

                <!-- Restore -->
                <button
                    class="btn btn-success flex-fill"
                    onclick="restoreVendor('${vendor.id}')">

                    <i class="bi bi-arrow-counterclockwise me-1"></i>
                    Restore

                </button>

            </div>

        </div>

    </div>

</div>
`;
        });

    } catch (err) {
        console.log(err);
    }
}

//if click restore button it shows the deleted task

$("#restoreBtn").click(function () {
    loadDeletedCards();
});

//function to restore the task 
async function restoreVendor(id) {

    const response = await fetch(`${API}/${id}`);
    const vendor = await response.json();

    vendor.isDeleted = false;
    vendor.updatedAt = new Date().toISOString();

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(vendor)
    });

    Swal.fire({
        icon: "success",
        title: "Vendor Restored"
    });

    loadDeletedCards(); // Refresh deleted list
}

// if we clcik all it go to normal page

$(".gradient-all").click(function () {
    loadVendorCards();
});



function displayVendorCards(vendors) {

     let cards = document.getElementById("vendorCards")
        cards.innerHTML = "";

            if (vendors.length === 0) {
        cards.innerHTML = `
            <div class="col-12">
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

        vendors.forEach(vendor => {

        cards.innerHTML += `
<div class="col-xl-4 col-lg-6 col-12 mb-4">

    <div class="card vendor-card border-0 shadow h-100">

        <!-- Header -->
        <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">

            <div>
                <h5 class="fw-bold mb-1">
                    <i class="bi bi-building-fill text-primary me-2"></i>
                    ${vendor.vendorType}
                </h5>

                <small class="text-muted">
                    <i class="bi bi-calendar3 me-1"></i>
                    ${new Date(vendor.createdAt).toLocaleDateString()}
                </small>
            </div>

            <span class="badge rounded-pill ${getBadgeClass(vendor.status)} px-3 py-2">
                  ${capitalize(vendor.status)}
            </span>

        </div>

        <!-- Body -->
        <div class="card-body">

            <!-- GST & License -->
            <div class="row g-3 mb-4">

                <div class="col-6">
                    <div class="p-3 bg-light rounded-3 border h-100">
                        <small class="text-muted d-block">
                        <i class="bi bi-receipt-cutoff me-2 text-primary"></i>
                            GST Number
                        </small>

                        <div class="fw-bold mt-1">
                            ${vendor.gstNumber}
                        </div>
                    </div>
                </div>

                <div class="col-6">
                    <div class="p-3 bg-light rounded-3 border h-100">
                        <small class="text-muted d-block">
                        <i class="bi bi-award-fill me-2 text-primary"></i>
                            License Number
                        </small>

                        <div class="fw-bold mt-1">
                            ${vendor.licenseNumber}
                        </div>
                    </div>
                </div>

            </div>

            <!-- Description -->
            <div class="mb-4">

                <small class="text-muted fw-semibold">
                    Description
                </small>

                <p class=" fs-6 mt-2 mb-0">
                    ${vendor.description}
                </p>

            </div>

            <!-- Remarks -->
            <div>

                <small class="text-muted fw-semibold">
                    Remarks
                </small>

                <p class="fs-6 mt-2 mb-0">
                    ${vendor.remarks || "-"}
                </p>

            </div>

        </div>

        <!-- Footer -->
     <div class="card-footer bg-white border-0">

    <div class="d-flex justify-content-center gap-3">

        <!-- View -->
        <button
            class="btn btn-outline-info flex-fill"
            data-bs-toggle="modal"
            data-bs-target="#viewModal"
            onclick="viewVendor('${vendor.id}')">

            <i class="bi bi-eye-fill me-1"></i>
            View
        </button>

        ${vendor.status !== "approved" ? `

        <!-- Update -->
        <button
            class="btn flex-fill"
            id="editTask"
            data-bs-toggle="modal"
            data-bs-target="#editModal"
            onclick="editVendor('${vendor.id}')">

            <i class="bi ${vendor.status === "rejected" ? "bi-arrow-clockwise" : "bi-pencil-square"} me-1"></i>
            ${vendor.status === "rejected" ? "Reapply" : "Update"}
        </button>

        <!-- Delete -->
        <button
            class="btn btn-outline-danger flex-fill"
            onclick="deleteVendor('${vendor.id}')">

            <i class="bi bi-trash3 me-1"></i>
            Delete

        </button>

        ` : ""}

    </div>

</div>  
`;

        });

}

async function loadVendorByStatus(status) {

    try {

        const response = await fetch(
            `${API}?gstNumber=${loggedInUser.gstNumber}&isDeleted=false&status=${status}`
        );

        const vendors = await response.json();

        displayVendorCards(vendors);

    } catch (err) {
        console.log(err);
    }
}

$(".gradient-all").click(function () {

    showVendorRecords();

    loadVendorCards();

    document.getElementById("vendorSection").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});

$(".gradient-pending").click(function () {
    showVendorRecords();
    loadVendorByStatus("pending");

    document.getElementById("vendorSection").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

$(".gradient-completed").click(function () {
    showVendorRecords();
    loadVendorByStatus("approved");

    document.getElementById("vendorSection").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

$(".gradient-rejected").click(function () {
    showVendorRecords();
    loadVendorByStatus("rejected");

    document.getElementById("vendorSection").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

function getBadgeClass(status) {

    switch (status.toLowerCase()) {

        case "approved":
            return "bg-success";

        case "pending":
            return "bg-warning text-dark";

        case "rejected":
            return "bg-danger";

        default:
            return "bg-secondary";
    }

}


async function applyFilters() {

    const searchText = $("#taskSearch").val().toLowerCase().trim();
    const fromDate = $("#fromDate").val();
    const toDate = $("#toDate").val();

    const response = await fetch(
        `${API}?gstNumber=${loggedInUser.gstNumber}&isDeleted=false`
    );

    let vendors = await response.json();

    // Search by Vendor Type
    if (searchText) {
        vendors = vendors.filter(vendor =>
            vendor.vendorType.toLowerCase().includes(searchText)
        );
    }

    // From Date
    if (fromDate) {
        vendors = vendors.filter(vendor =>
            vendor.createdAt.split("T")[0] >= fromDate
        );
    }

    // To Date
    if (toDate) {
        vendors = vendors.filter(vendor =>
            vendor.createdAt.split("T")[0] <= toDate
        );
    }

    displayVendorCards(vendors);
}


$("#taskSearch").on("input", applyFilters);

$("#fromDate").on("change", applyFilters);

$("#toDate").on("change", applyFilters);

$("#clearFiltersBtn").click(function () {

    $("#taskSearch").val("");
    $("#fromDate").val("");
    $("#toDate").val("");

    loadVendorCards();
});

async function viewVendor(id){

    const response = await fetch(`${API}/${id}`);
    const vendor = await response.json();

   $("#viewOrganization").text(vendor.organizationName || "-");
$("#viewEmail").text(vendor.email || "-");
$("#viewGST").text(vendor.gstNumber || "-");
$("#viewLicense").text(vendor.licenseNumber || "-");
$("#viewPhone").text(vendor.phone || "-");
$("#viewVendorType").text(vendor.vendorType || "-");
$("#viewContactPerson").text(vendor.contactPerson || "-");
$("#viewDesignation").text(vendor.contactDesignation || "-");
$("#viewDescription").text(vendor.description || "-");
$("#viewAddress").text(vendor.address || "-");
$("#viewRemarks").text(vendor.remarks || "No remarks available");

    $("#viewCreated").text(
        new Date(vendor.createdAt).toLocaleDateString()
    );

    $("#viewUpdated").text(
        new Date(vendor.updatedAt).toLocaleDateString()
    );

    $("#viewDescription").text(vendor.description);
    $("#viewAddress").text(vendor.address);
    $("#viewRemarks").text(vendor.remarks || "No remarks available");

    $("#viewStatus").html(
        `<span class="badge ${getBadgeClass(vendor.status)} px-3 py-2">
            ${vendor.status}
        </span>`
    );

    if (vendor.status.toLowerCase() === "approved") {

    $("#viewUpdateBtn").hide();
    $("#viewDeleteBtn").hide();

} else {

    $("#viewUpdateBtn").show();
    $("#viewDeleteBtn").show();

}

    $("#viewUpdateBtn")
        .off("click")
        .on("click",function(){

            bootstrap.Modal.getInstance(
                document.getElementById("viewModal")
            ).hide();

            editVendor(id);

            new bootstrap.Modal(
                document.getElementById("editModal")
            ).show();

        });

    $("#viewDeleteBtn")
        .off("click")
        .on("click",function(){

            bootstrap.Modal.getInstance(
                document.getElementById("viewModal")
            ).hide();

            deleteVendor(id);

        });

}

function countStat(vendors) {

    const activeVendors = vendors.filter(
        vendor => !vendor.isDeleted
    );

    const total = activeVendors.length;

    const completed = activeVendors.filter(
        vendor => vendor.status.toLowerCase() === "approved"
    ).length;

    const pending = activeVendors.filter(
        vendor => vendor.status.toLowerCase() === "pending"
    ).length;

    const rejected = activeVendors.filter(
        vendor => vendor.status.toLowerCase() === "rejected"
    ).length;

    document.getElementById("totalCount").textContent = total;
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("pendingCount").textContent = pending;
    document.getElementById("rejectedCount").textContent = rejected;
}

$("#editProfileBtn").click(async function () {

    try {

           const response = await fetch(
            `${USER_API}?email=${loggedInUser.email}`
        );

        const vendors = await response.json();

        if (!vendors.length) {
            Swal.fire({
                icon: "error",
                title: "Profile not found"
            });
            return;
        }

        const vendor = vendors[0];

        $("#profileEditId").val(vendor.id);
        $("#editOrg").val(vendor.organizationName);
        $("#editEmailOrg").val(vendor.email);
        $("#editGSTProfile").val(vendor.gstNumber);

          const modal = new bootstrap.Modal(
                document.getElementById("profileEditModal")
            );

            modal.show();
    

    } catch (err) {

        console.log(err);

        Swal.fire({
            icon: "error",
            title: "Unable to load profile"
        });

    }

});

$("#updateProfileBtn").click(async function () {

    const id = $("#profileEditId").val();

    const organization = $("#editOrg").val().trim();
    const email = $("#editEmailOrg").val().trim();
    const gst = $("#editGSTProfile").val().trim();

    if (!organization || !email || !gst) {

        Swal.fire({
            icon: "warning",
            title: "All fields are required"
        });

        return;
    }

    try {

        const response = await fetch(`${USER_API}/${id}`);
        const vendor = await response.json();

        const updatedVendor = {

            ...vendor,

            organizationName: organization,
            email: email,
            gstNumber: gst,

            updatedAt: new Date().toISOString()

        };

        await fetch(`${USER_API}/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(updatedVendor)

        });

        // Update Local Storage
        const updatedUser = {

            ...loggedInUser,

            organizationName: organization,
            email: email,
            gstNumber: gst

        };

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(updatedUser)
        );

        // Update UI immediately
        $("#dropdownUsername").text(organization);
        $("#navUsername").text(organization);

        $("#profileOrg").text(organization);
        $("#profileEmail").text(email);
        $("#profileGST").text(gst);

        bootstrap.Modal.getInstance(
            document.getElementById("profileEditModal")
        ).hide();

        Swal.fire({
            icon: "success",
            title: "Profile Updated"
        });

    } catch (err) {

        console.log(err);

        Swal.fire({
            icon: "error",
            title: "Update Failed"
        });

    }

});

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
        showConfirmButton: false
    });

    setTimeout(() => {
        window.location.href = "../pages/index.html";
    }, 1500);

});

document.addEventListener('DOMContentLoaded', () => {
    loadVendorCards()
    loadVendorProfile()
    const buttons = document.querySelectorAll('#button-container .btn');
    const restoreBtn = document.getElementById('restoreBtn');

  
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            restoreBtn.classList.remove('active'); //
            button.classList.add('active');
        });
    });


if (restoreBtn) {
    restoreBtn.addEventListener("click", () => {

        buttons.forEach(btn => btn.classList.remove("active"));

        restoreBtn.classList.add("active");

        loadDeletedCards();
    });
}
});


$("#fromDate, #toDate").on("keydown paste", function (e) {
    e.preventDefault();
});

$("#restoreBtn").click(function () {

    loadDeletedCards();

    document.getElementById("vendorSection").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    $("#recordTitle").text("Deleted Records");
});

function showVendorRecords() {

    $("#recordTitle").text("Vendor Records");

    $("#restoreBtn").removeClass("active");

    $("#button-container .btn").removeClass("active");
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

$("#totalCard").click(function () {

    showVendorRecords();
    loadVendorCards();

    document.getElementById("vendorSection").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});

$("#completedCard").click(function () {

    showVendorRecords();
    loadVendorByStatus("approved");

    document.getElementById("vendorSection").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});

$("#pendingCard").click(function () {

    showVendorRecords();
    loadVendorByStatus("pending");

    document.getElementById("vendorSection").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});

$("#rejectedCard").click(function () {

    showVendorRecords();
    loadVendorByStatus("rejected");

    document.getElementById("vendorSection").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});

function capitalizeFirst(text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}