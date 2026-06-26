const API="http://localhost:3000/vendorDetails"

document.addEventListener("DOMContentLoaded", () => {
    
    loadVendors()
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
                : task.status === "Rejected"
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

function countStat(data){

    const total = data.length;
    const completed = data.filter(v => v.status === "approved").length;
    const pending = data.filter(v => v.status === "pending").length;
    const rejected = data.filter(v => v.status === "Rejected").length;

    $("#totalCount").text(total);
    $("#completedCount").text(completed);
    $("#pendingCount").text(pending);
    $("#rejectedCount").text(rejected);

    $("#totalProgress").css("width","100%");
    $("#completedProgress").css("width",(completed/total)*100 + "%");
    $("#pendingProgress").css("width",(pending/total)*100 + "%");
    $("#rejectedProgress").css("width",(rejected/total)*100 + "%");
}