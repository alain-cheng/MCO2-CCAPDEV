/* 
    You can use this file for the exclusive functionalities of the profs.html page like displaying
    all professors from the database.
    If you plan on using this file, you might want to include to import the main.js script from
    the profs.html for the css stylings written in the script, which should look something like this:
    <head>
        <script type="text/javascript" src="/js/main.js"></script>
        <script type="text/javascript" src="/js/profs.js"></script>
    </head>
*/
$(document).ready(function () {
    // place functions in here
    
    /* 
        I think its better nalang to use /findProfs instead, tas having the filter like this: ( filter: {} ),  <-- make sure findProfs is using db.findMany() btw
        This returns a promise of a list of profs that contains every single prof from our db. Can access this
        inside the .then method.
        
        ^ you could try printing out the output using the console.log if you're not sure what to do with it ^^ 
        -- alain
    */

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
