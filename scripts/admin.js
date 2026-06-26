document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll("#button-container .btn");

    buttons.forEach(button => {

        button.addEventListener("click", function () {

       
            buttons.forEach(btn => btn.classList.remove("active"));

            this.classList.add("active");

        });

    });

});


$("#totalProgress").css("width", "100%");

$("#completedProgress").css("width", (completed / total) * 100 + "%");

$("#pendingProgress").css("width", (pending / total) * 100 + "%");

$("#rejectedProgress").css("width", (rejected / total) * 100 + "%");