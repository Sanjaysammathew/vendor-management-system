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

//to check all fileds are completed
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

        let cards = document.getElementById("vendorCards")

        vendors.forEach(vendor => {

            cards .innerHTML+=`
                <div class="col-12 col-md-6">
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
                                <p class="text-muted mb-0">
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

                        <div class="card-footer bg-white border-0 d-flex gap-2">

                            <button
                                class="btn flex-fill"
                                onclick="editVendor(${vendor.id})" id="editTask">
                                <i class="bi bi-pencil-square me-1"></i>
                                Update
                            </button>

                            <button
                                class="btn btn-outline-danger flex-fill"
                                onclick="deleteVendor(${vendor.id})" id="deleteTask">
                                <i class="bi bi-trash me-1"></i>
                                Delete
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


document.addEventListener('DOMContentLoaded', () => {
    loadVendorCards()
    loadVendorProfile()
    const buttons = document.querySelectorAll('#button-container .btn');
    const restoreBtn = document.getElementById('restoreBtn');

  
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });


    if (restoreBtn) {
        restoreBtn.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
        });
    }
});