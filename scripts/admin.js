const API="http://localhost:3000/vendorDetails"

document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    loadVendors()
      $('#userProfile').on('show.bs.offcanvas', function () {
      

    if (currentUser) {
      $("#dropdownUsername").text(currentUser.organizationName  || "User");
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

        $("#navUsername").text(currentUser.organizationName)
  
    const buttons = document.querySelectorAll("#button-container .btn");
    buttons.forEach(button => {

        button.addEventListener("click", function () {

       
            buttons.forEach(btn => btn.classList.remove("active"));

            this.classList.add("active");

        });

    });

});




async function loadVendors(){

    try{
  
      const response =await fetch(`${API}?isDeleted=false`)
    const data= await response.json()

    data.sort((a,b)=> new Date(b.updatedAt)-new Date(a.updatedAt))

    displayVendorCards(data);  
    countStat(data)
    console.log(data)        
    }  catch(err){
        console.log(err);
    }

}

function displayVendorCards(data){
    const table=document.getElementById("vendorTableBody")
    table.innerHTML="";

    const card=document.getElementById("noRecord")
    card.innerHTML=""

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

    data.forEach(task =>{
        table.innerHTML+=`
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
            ${task.status}
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

async function loadVendorByStatus(status) {

    try {

         const response = await fetch(
    `${API}?isDeleted=false&status=${status}`
);

        const vendors = await response.json();

        displayVendorCards(vendors);

    } catch (err) {
        console.log(err);
    }
}

$(".gradient-all").click(function () {
    loadVendors();
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

async function viewVendor(id) {

    try {

        const response = await fetch(`${API}/${id}`);
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

        let badge = "";

        if (vendor.status === "approved") {

            badge =
            `<span class="status-pill status-approved">
                Approved
            </span>`;

        }
        else if (vendor.status === "pending") {

            badge =
            `<span class="status-pill status-pending">
                Pending
            </span>`;

        }
        else {

            badge =
            `<span class="status-pill status-rejected">
                Rejected
            </span>`;

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

            $("#viewRemarks").text(
                vendor.remarks || "No Remarks"
            );

        }

        const modal = new bootstrap.Modal(
            document.getElementById("viewVendorModal")
        );

        modal.show();

    } catch (err) {

        console.log(err);

    }

}

let currentVendorId = null;
let currentAction = "";

$("#approveBtn").click(function(){

    currentVendorId = $(this).data("id");

    currentAction = "approved";

    $("#remarksTitle").text("Approve Vendor");

    $("#remarksInput").val("");

});

$("#rejectBtn").click(function(){

    currentVendorId = $(this).data("id");

    currentAction = "rejected";

    $("#remarksTitle").text("Reject Vendor");

    $("#remarksInput").val("");

});

$("#submitRemarksBtn").click(async function(){

    const remarks = $("#remarksInput").val().trim();

    if(remarks === ""){

        Swal.fire(
            "Required",
            "Please enter remarks.",
            "warning"
        );

        return;
    }

    await fetch(`${API}/${currentVendorId}`,{

        method:"PATCH",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            status:currentAction,
            remarks:remarks,
            updatedAt:new Date().toISOString()

        })

    });

    bootstrap.Modal
        .getInstance(document.getElementById("remarksModal"))
        .hide();

    bootstrap.Modal
        .getInstance(document.getElementById("viewVendorModal"))
        .hide();

    loadVendors();

    Swal.fire(
        "Success",
        `Vendor ${currentAction} successfully.`,
        "success"
    );

});

async function applyFilters() {

    const searchText = $("#searchVendor").val().toLowerCase().trim();
    const fromDate = $("#fromDate").val();
    const toDate = $("#toDate").val();

    const response = await fetch(
        `${API}?isDeleted=false`
    );

    let vendors = await response.json();

    if (searchText) {
        vendors = vendors.filter(vendor =>
            vendor.vendorType
                .toLowerCase()
                .includes(searchText)
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

    displayVendorCards(vendors);
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

function countStat(data){

    const total = data.length;
    const completed = data.filter(v => v.status === "approved").length;
    const pending = data.filter(v => v.status === "pending").length;
    const rejected = data.filter(v => v.status === "rejected").length;

    $("#totalCount").text(total);
    $("#completedCount").text(completed);
    $("#pendingCount").text(pending);
    $("#rejectedCount").text(rejected);

    $("#totalProgress").css("width","100%");
    $("#completedProgress").css("width",(completed/total)*100 + "%");
    $("#pendingProgress").css("width",(pending/total)*100 + "%");
    $("#rejectedProgress").css("width",(rejected/total)*100 + "%");
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