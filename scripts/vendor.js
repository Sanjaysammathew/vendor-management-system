const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

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

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const response = await fetch(
        `http://localhost:3000/vendorDetails?userId=${loggedInUser.id}`
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

    const check = await fetch(`${API}?gstNumber=${loggedInUser.gstNumber}`);
const existing = await check.json();

if (existing.length > 0) {
    Swal.fire({
        icon: "warning",
        title: "Already Added",
        text: "Vendor details already exist."
    });
    return;
}

        const vendorData = {
              userId: loggedInUser.id, 
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

document.addEventListener('DOMContentLoaded', () => {
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