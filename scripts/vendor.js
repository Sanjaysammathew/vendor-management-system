const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const API="http://localhost:3000/vendorDetails"

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

     
    const vendorType = $("#vendor-type").val().trim();
    const description = $("#desc").val().trim();
    const address = $("#address").val().trim();
    const licenseNumber=$("#license").val().trim()

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



    if (!isValid) return;

        const vendorData = {
        organizationName: loggedInUser.organizationName,
        email: loggedInUser.email,
        gstNumber: loggedInUser.gstNumber,
        licenseNumber:licenseNumber ,
        phone: phone,
        vendorType:vendorType,
        description:description,
        address: address,
        isDeleted:false,
        status:"pending",
        remarks:"",
        createdAt:new Date().toISOString(),
        updatedAt:new Date().toISOString()
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

    try {

        const response = await fetch(`${API}/${id}`);
        const vendor = await response.json();

        $("#editId").val(vendor.id);
        $("#editGST").val(vendor.gstNumber);
        $("#editLicense").val(vendor.licenseNumber);
        $("#editVendorType").val(vendor.vendorType);
        $("#editDesc").val(vendor.description);

        $("#editCreatedAt").val(
            new Date(vendor.createdAt).toLocaleDateString()
        );

    } catch (err) {
        console.log(err);
    }

}

// update Task

$("#updateBtn").click(async function () {

    const id = $("#editId").val();

    const response = await fetch(`${API}/${id}`);
    const vendor = await response.json();

    const license = $("#editLicense").val().trim();
const vendorType = $("#editVendorType").val().trim();
const description = $("#editDesc").val().trim();

if (license === "" || vendorType === "" || description === "") {
    Swal.fire({
        icon: "warning",
        title: "Required",
        text: "All fields are required."
    });
    return;
}

    const updatedVendor = {

        ...vendor,

        licenseNumber: license,
        vendorType: vendorType,
        description: description,

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
                    <div class="col-12 col-md-6 col-lg-4">
                    <div class="card border-0 shadow-sm rounded-4 h-100">

                        <div class="card-header d-flex justify-content-between align-items-center">

                            <h5 class="fw-bold mb-0">
                                <i class="bi bi-building text-success me-2"></i>
                                ${vendor.vendorType}
                            </h5>

                             <span class="badge ${getBadgeClass(vendor.status)} px-3 py-2">
                                        ${vendor.status}
                                       </span>

                        </div>

                        <div class="card-body">

                            <div class="mb-3">
                                <strong>Description</strong>
                                <p class=" description-text text-muted mb-0">
                                    ${vendor.description}
                                </p>
                            </div>

                            <div class="row">

                                <div class="col-6 mb-3">
                                    <small class="text-muted">GST Number</small>
                                    <div class="fw-semibold">
                                        ${vendor.gstNumber}
                                    </div>
                                </div>

                                <div class="col-6 mb-3">
                                    <small class="text-muted">License No</small>
                                    <div class="fw-semibold">
                                        ${vendor.licenseNumber}
                                    </div>
                                </div>

                                <div class="col-6 mb-3">
                                    <small class="text-muted">Created At</small>
                                    <div class="fw-semibold">
                                        ${new Date(vendor.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div class="col-6 mb-3">
                                    <small class="text-muted">Remarks</small>
                                    <div class="fw-semibold text-secondary">
                                        ${vendor.remarks || "-"}
                                    </div>
                                </div>

                            </div>

                        </div>

                            <button
                                class="btn btn-success w-100   "
                                onclick="restoreVendor('${vendor.id}')">
                                Restore
                            </button>

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
<div class="col-lg-4 col-md-6 mb-4">

<div class="card vendor-card border-0 shadow h-100">

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
            ${vendor.status}
        </span>

    </div>

    <div class="card-body">

        <div class="row g-2">

            <div class="col-6">
                <div class="mini-card">
                    <i class="bi bi-receipt-cutoff text-primary fs-4"></i>
                    <small>GST Number</small>
                    <div class="fw-semibold">${vendor.gstNumber}</div>
                </div>
            </div>

            <div class="col-6">
                <div class="mini-card">
                    <i class="bi bi-patch-check-fill text-success fs-4"></i>
                    <small>License</small>
                    <div class="fw-semibold">${vendor.licenseNumber}</div>
                </div>
            </div>

            <div class="col-12">
                <div class="mini-card">
                    <i class="bi bi-card-text text-warning fs-4"></i>
                    <small>Description</small>
                    <p class="mb-0 mt-1">
                        ${vendor.description}
                    </p>
                </div>
            </div>

            <div class="col-12">
                <div class="mini-card">
                    <i class="bi bi-chat-square-dots-fill text-danger fs-4"></i>
                    <small>Remarks</small>
                    <p class="mb-0 mt-1">
                        ${vendor.remarks || "-"}
                    </p>
                </div>
            </div>

        </div>

    </div>

    <div class="card-footer bg-white border-0 d-flex gap-2">

   ${vendor.status !== "approved" ? `
<div class="card-footer bg-white border-0 d-flex gap-2">

    <button
        class="btn btn-primary flex-fill rounded-pill"
        data-bs-toggle="modal"
        data-bs-target="#editModal"
        onclick="editVendor('${vendor.id}')">

        <i class="bi ${vendor.status === "rejected" ? "bi-arrow-clockwise" : "bi-pencil-square"} me-1"></i>
        ${vendor.status === "rejected" ? "Reapply" : "Update"}

    </button>

    <button
        class="btn btn-outline-danger flex-fill rounded-pill"
        onclick="deleteVendor('${vendor.id}')">

        <i class="bi bi-trash3 me-1"></i>
        Delete

    </button>

</div>
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
    loadVendorCards();
});

$(".gradient-pending").click(function () {
    loadVendorByStatus("pending");
});

$(".gradient-completed").click(function () {
    loadVendorByStatus("approved");
});

$(".gradient-rejected").click(function () {
    loadVendorByStatus("rejected");
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

    const response = await fetch(
        `${API}?gstNumber=${loggedInUser.gstNumber}`
    );

    const vendor = (await response.json())[0];

    $("#profileEditId").val(vendor.id);
    $("#editOrg").val(vendor.organizationName);
    $("#editEmail").val(vendor.email);
    $("#editGSTProfile").val(vendor.gstNumber);
    $("#editPhone").val(vendor.phone);
    $("#editLicenseProfile").val(vendor.licenseNumber);
    $("#editAddressProfile").val(vendor.address);
});

$("#updateProfileBtn").click(async function () {

    const id = $("#profileEditId").val();

    const response = await fetch(`${API}/${id}`);
    const vendor = await response.json();

    const phone = $("#editPhone").val().trim();
    const address = $("#editAddressProfile").val().trim();

    if (phone === "" || address === "") {
        Swal.fire({
            icon: "warning",
            title: "Required",
            text: "Phone Number and Address are required."
        });
        return;
    }

    const updatedVendor = {

        ...vendor,

        phone: phone,
        address: address,

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
        title: "Profile Updated Successfully"
    });

    bootstrap.Modal.getInstance(
        document.getElementById("profileEditModal")
    ).hide();

    loadVendorProfile();   // Refresh offcanvas details
    loadVendorCards();     // Refresh cards if needed

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