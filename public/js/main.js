const errPostEmpty = "OOPS! There are no posts here.";
var currentUser;

jQuery(function () {
    console.log("Document Loaded");

    /******************************************************
        Sample for getting a document from the db
    *******************************************************/
    let collegeSample; 
    $.get("/findCourse", {
        model: 'colleges',
        id: 'CCS'
    }).then((res) => {
        collegeSample = res;
        console.log('Document Object:', collegeSample);
        console.log('Object Name:', collegeSample['name']);
        console.log('Object ID:', collegeSample['id']);
    });
    ////////////////////////////////////////////////////////

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
        // Reset the Right-bar user info
        $(".lu-info-top").text("");
        $(".lu-info-bottom").text("");
        $("#fr-list").html("");
        $(".lu-info-top").text(user.firstName + " " + user.lastName);
        $(".lu-info-bottom").text(user.degree + " | " + user.college);
        
        /*
            If  User  is  following  atleast  1  course ->
            Suggest courses based on the followed courses-
            that    belong    to    the    same   College.

            Else if the User is not following any course ->
            Suggest courses based on the college of the user.

            courseSuggestions(), which accepts a list of course
            objects to be displayed will be called.
        */
        if(user.followedCourses.length > 0)                                 
             courseSuggestions(user.followedCourses);
        else if(user.followedCourses.length == 0) {
            let suggest = [];
             
            let collegename = user.college;
            let ccode;
            
            // Find the college's id
            for(var i = 0; i < colleges.length; i++) {                     
                if(colleges[i].name == collegename) {                     
                    ccode = colleges[i].code;
                    break;
                }
            }

            // Find all courses with the same college id tag
            courses.forEach(e => {                                         
                if(e.collegeid == ccode) {
                       suggest.push(e);
                } 
            });
            courseSuggestions(suggest);
        }
        
        // Clears all posts
        $("#coursepostContainer").html("");                                 

        /*
            If the user is not following any course,
            it should display  all  posts  available
            in the database regardless of the user's
            college.

            Otherwise, display  posts  based  on  the
            courses    the    user    is    following

            Uses displayPosts() that accepts a list of
            post objects to be displayed.
        */
        if(user.followedCourses.length == 0)
            displayPosts(posts);
        else if(user.followedCourses.length > 0) {
            let currPosts = [];
            for(var i = 0; i < user.followedCourses.length; i++) {
                for(var j = 0; j < posts.length; j++) {
                    if(user.followedCourses[i].name == posts[j].course)
                        currPosts.push(posts[j]);
                }
            }
            displayPosts(currPosts);
        }

        // Resets the like button's event handlers
        // addLikeEvents();
    }

     /* 
        A function that accepts a list of courses objects
        meant to be shown in the suggestions bar.
     */
    function courseSuggestions(courseList) {
        /* 
            We will need to determine which colleges 
            the courses in the list belong to
        */
        var collegecodes = [];                                      // Used to store unique college ids from the courseList parameter
        var flag = 0;
        
        collegecodes.push(courseList[0].collegeid);                 // Push the first element
        
        /*
            All courses from the courseList must be checked
            which colleges they are coming from.
            The college ids will then be stored in a list 
            without duplicates.

            After the college ids have been compiled,
            all courses that belong from the compiled college
            ids must be displayed through displayCourse().
        */
        if(courseList.length > 1) {
             for(var i = 1; i < courseList.length; i++) {
                  flag = 1;
                  for(var j = 0; j < collegecodes.length; j++) {
                       if(collegecodes[j] == courseList[i].collegeid)
                            flag = 0;
                  }
                  if(flag != 0)
                       collegecodes.push(courseList[i].collegeid);
             }

             for(var x = 0; x < collegecodes.length; x++) {
                  for(var y = 0; y < courses.length; y++) {
                       if(courses[y].collegeid == collegecodes[x])
                            displayCourse(courses[y].name);
                  }
             }
        }
        else {
             for(var l = 0; l < courses.length; l++) {
                  if(courses[l].collegeid == collegecodes[0])
                       displayCourse(courses[l].name);
             }
        }
    }

});