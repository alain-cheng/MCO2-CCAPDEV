$(document).ready(function () {
    /*
        @param event - the button (of class .courseButton) that was clicked by the user saved as an HTML element
        @let buttonId - stores the ID of the 'event'
        This function is called when the buttons of class .courseButton in courses.html are clicked.
        The FETCH API is used to redirect to the /getCourseTable URL. Going to this URL automatically calls the getCourseTable
        function in controller.js. The buttonID is also included in the URL as it will be queried by getCourseTable later. At this
        point, go to getCourseTable function in controller.js.
    */
    $(".courseButton").on("click", function(event) {
        let buttonID = event.target.id;
    fetch(`/getCourseTable?collegeid=${buttonID}`)
    .then(res => res.json()) // this is the res that came from controller.js (returned as a resolved promise)
        .then(res => {
                let college; // the switch case determines what _TABLE will be modified with the HTML string from controller.js
                switch (buttonID) {
                    case "1": college = "CLA";
                        break;
                    case "2": college = "COS";
                        break;
                    case "3": college = "GCOE";
                        break;
                    case "4": college = "RVCOB";
                        break;
                    case "5": college = "SOE";
                        break;
                    case "6": college = "BAGCED";
                        break;
                    case "7": college = "CCS";
                        break;
                    case "8": college = "GE";
                        break;
                }
                $(`#${college}_TABLE`).html(res.message);
        });    
    });

    /*
        @param event - the button (of class .courseButton) that was clicked by the user saved as an HTML element
        @let buttonId - stores the ID of the 'event'
        @let buttonName -stores the name of the 'event'
        The function before this one dynamically creates buttons for each course to allow the user to view reviews for a specific course.
        This function is called when one of those dynamically created buttons is clicked. Notice that the first line is different compared
        to the function above and that's because dynamically created buttons apparently have to undergo "event delegation" to work.
        https://stackoverflow.com/questions/34896106/attach-event-to-dynamic-elements-in-javascript
    */
    $(document).on("click", ".courseCodeBtn",function(event) { // this is different compared to "$(".courseButton").click(function(event)" above
        let buttonID = event.target.id;
        let buttonName = event.target.name;
        fetch(`/getCourseReviews?collegeid=${buttonID}&coursecode=${buttonName}`)
        .then(res => res.json())
                .then(res => {
                let college;
                switch (buttonID) {  // the switch case determines what _COURSE_REVIEWS will be modified with the HTML string from controller.js
                    case "1": college = "CLA";
                        break;
                    case "2": college = "COS";
                        break;
                    case "3": college = "GCOE";
                        break;
                    case "4": college = "RVCOB";
                        break;
                    case "5": college = "SOE";
                        break;
                    case "6": college = "BAGCED";
                        break;
                    case "7": college = "CCS";
                        break;
                    case "8": college = "GE";
                        break;
                }
                $(`#${college}_COURSE_REVIEWS`).html(res.message);
        });    
    });
});