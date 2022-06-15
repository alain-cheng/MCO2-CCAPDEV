const errPostEmpty = "OOPS! There are no posts here.";
var currentUser;

$(document).ready(function () {

    function fadeWrap() {
        let scrollPos = window.pageYOffset || document.documentElement.scrollLeft;
        if(scrollPos > 300) {
            $("#scroll-left").show();
        }
        else {
            $("#scroll-left").hide();
        }
    }

    /*  */
    function login(user) {
        currentUser = user;
        // set profile picture
        $("#logged-user").attr("src", user.img);
        
        refreshContent(user);
    }

    /* Reloads the page content for the user */
    function refreshContent(user) {
        $(".lu-info-top").text("");                                         // Clear Right-bar user info
        $(".lu-info-bottom").text("");
        $(".lu-info-top").text(user.firstName + " " + user.lastName);       // Set Right-bar user info 
        $(".lu-info-bottom").text(user.degree + " | " + user.college);
        $("#fr-list").html("");                                             // Clear Suggestions

        /*
            If  User  is  following  atleast  1  course ->
            Suggest courses based on the followed courses-
            that    belong    to    the    same   College.

            Else if the User is not following any course ->
            Suggest courses based on the college of the user.
        */
        // if(user.followedCourses.length > 0)                                 
        //      courseSuggestions(user.followedCourses);
        // else if(user.followedCourses.length == 0) {
        //      let suggest = [];                                              // Used to store course suggestions
             
        //      let collegename = user.college;                                // Get the user's college
        //      let ccode;                                                     // Stores the college's id

        //      for(var i = 0; i < colleges.length; i++) {                     // Find the college's id
        //           if(colleges[i].name == collegename) {                     
        //                ccode = colleges[i].code;
        //                break;
        //           }
        //      }

        //      courses.forEach(e => {                                         // Find all courses with the same college id tag
        //           if(e.collegeid == ccode) {
        //                suggest.push(e);
        //           } 
        //      });
        //      courseSuggestions(suggest);
        // }
             
        // $("#coursepostContainer").html("");                                 // Clears all posts

        // /*
        //     If the user is not following any course,
        //     it should display  all  posts  available
        //     in the database regardless of the user's
        //     college.

        //     Otherwise, display  posts  based  on  the
        //     courses    the    user    is    following
        // */
        // if(user.followedCourses.length == 0)
        //      displayPosts(posts);
        // else if(user.followedCourses.length > 0) {                          
        //      let currPosts = [];
        //      for(var i = 0; i < user.followedCourses.length; i++) {
        //           for(var j = 0; j < posts.length; j++) {
        //                if(user.followedCourses[i].name == posts[j].course)
        //                     currPosts.push(posts[j]);
        //           }
        //      }
        //      displayPosts(currPosts);
        // }  

        // addLikeEvents();                                                    // Resets the like button's event handlers
   }

});