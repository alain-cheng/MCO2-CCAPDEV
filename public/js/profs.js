/* 
    You can use this file for the functionalities exclusive only to the profs.html page.
*/
$(document).ready(function () {
    $(".showProfsBtn").on("click", function(event) {
        let buttonID = event.target.id;
        
        fetch(`/getProfProfiles?collegeid=${buttonID}`)
        .then(res => res.json()) // this is the res that came from controller.js (returned as a resolved promise)
            .then(res => {
                    $("#ALL_PROFS_TABLE").html(res.message);
            });  
    });

    $(document).on("click", ".image-overlay",function(event) { 
        console.log("prof image clicked");

        let eventID = event.currentTarget.id;
        let profNames = eventID.trim().split(/\s+/);
        let fname = profNames[0];
        let lname = profNames[1];

        fetch(`/getProfReviews?fname=${fname}&lname=${lname}`)
        .then(res => res.json())
                .then(res => {
                $("#PROF_REVIEWS").html(res.message);
        });  
        
        
    });
});
