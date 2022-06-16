const mpHeaderLeft = "Review For:";
const errPostEmpty = "OOPS! There are no posts here.";

var currentUser;                 // Store the logged in user

jQuery(function () {
    console.log("Document Loaded");

    /*=====================================================*/
    /*   Sample for getting a document from the db
    /*=====================================================*/
    $.get("/findCourse", {
        college: 'CCS'
    }).then((res) => {              // retrieve response data
        var collegeSample = res;    
        console.log('Sample Object:', collegeSample);
        console.log('Object Name:', collegeSample['name']);
        console.log('Object ID:', collegeSample['college']);
    });
    /*=====================================================*/



    // Create working course follow buttons
    // var courseFollow = document.getElementById("fr-list");
    // courseFollow?.addEventListener('click', followCourse);



    // Temporary: Auto login a user (testing purposes)
    $.get("/findUser", {
          username: 'Sarah',
          password: 'user2'
    }).then((res) => {
          currentUser = res;  // dis a local scope
          console.log('Logged In', res['username']);
          console.log('Following', res['followedCourses']);
          login(currentUser);
    });


    /*=====================================================*/
    /*   Main application functions below
    /*=====================================================*/

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
          console.log('Current User is: ', currentUser);
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
               If  User   is   following    atleast   1   course ->
               Suggest courses  based  on  the   followed  courses-
               that belong to the same College.

               Else if  the  User is  not  following  any course ->
               Suggest courses  based  on the  college of the user.

               Similar rules apply above in displaying posts except
               that every single post is displayed available in the
               db if the user is not following any courses.

               courseSuggestions(), which accepts a list of course
               objects   to  be  displayed  will  be  called,  and 
               displayPosts() which accepts a list of post objects 
               to be displayed.
          */
          if(user['followedCourses'].length > 0) {
               courseSuggestions(user['followedCourses']);
          } else if(user['followedCourses'].length == 0) {
               let suggest = [];                                 // will be storing course objects

               $.get("/findCourses", {                           // Find all courses with the same `collegeid`
                    college: user['college'].name
               }).then((res) => {
                    //console.log('Courses found: ', res);
                    for(var i = 0; i < res.length; i++) {
                         suggest.push(res[i]);
                    }
                    courseSuggestions(suggest);
               });

               $.get("/findPosts", {}).then((res) => {           // Returns every single post in the db
                    displayPosts(res);
               });
          }
          
          $("#coursepostContainer").html("");                    // Clears all posts

          /*
               If the user is not  following any course,
               it should display  all  posts   available
               in the database regardless  of the user's
               college.

               Otherwise, display  posts  based  on  the
               courses    the    user    is    following

               Uses displayPosts()  that accepts  a list 
               of  post   objects   to   be   displayed.
          */
          // if(user.followedCourses.length == 0)
          //     displayPosts(posts);
          // else if(user.followedCourses.length > 0) {
          //     let currPosts = [];
          //     for(var i = 0; i < user.followedCourses.length; i++) {
          //         for(var j = 0; j < posts.length; j++) {
          //             if(user.followedCourses[i].name == posts[j].course)
          //                 currPosts.push(posts[j]);
          //         }
          //     }
          //     displayPosts(currPosts);
          // }

          // Resets the like button's event handlers
          // addLikeEvents();
     }

     /* 
        A function that accepts a list of course objects
        meant to be shown in the suggestions bar.
     */
     function courseSuggestions(courseList) {
          /* 
               We will need to determine which colleges 
               the courses in the list belong to
          */
          // var collegecodes = [];                                      // Used to store unique college ids from the courseList parameter
          // var flag = 0;
          
          // collegecodes.push(courseList[0].collegeid);                 // Push the first element
          
          /*
               All courses from the courseList must be checked
               which colleges they are coming from.
               The college ids will then be stored in a list 
               without duplicates.

               After the college ids have been compiled,
               all courses that belong from the compiled college
               ids must be displayed through displayCourse().
          */
          // if(courseList.length > 1) {
          //      for(var i = 1; i < courseList.length; i++) {
          //           flag = 1;
          //           for(var j = 0; j < collegecodes.length; j++) {
          //                if(collegecodes[j] == courseList[i].collegeid)
          //                     flag = 0;
          //           }
          //           if(flag != 0)
          //                collegecodes.push(courseList[i].collegeid);
          //      }

          //      for(var x = 0; x < collegecodes.length; x++) {
          //           for(var y = 0; y < courses.length; y++) {
          //                if(courses[y].collegeid == collegecodes[x])
          //                     displayCourse(courses[y].name);
          //           }
          //      }
          // }
          // else {
          //      for(var l = 0; l < courses.length; l++) {
          //           if(courses[l].collegeid == collegecodes[0])
          //                displayCourse(courses[l].name);
          //      }
          // }
     }

    /*
        Accepts a list of post objects meant to be displayed.
        If there are no posts to be displayed, a message must
        be  displayed  indicating  no  posts  are  available.

        This function  is   tied   with   displayPost(),  the
        singular     version       of       this      method.
    */
     function displayPosts(posts) {
          // if(posts.length == 0) {
          //      var message = document.createElement("div");
          //      $(message).addClass("empty-post-message");
          //      $(message).text(errPostEmpty);
          //      $("#coursepostContainer").append(message);
          //      console.log(errPostEmpty)
          // }
          // else {
          //      console.log("Posts available")
          //      for(var i = 0; i < posts.length; i++)
          //           displayPost(posts[i]); 
          // }
     }

    /*
        Accepts  a   post  object   to   be   displayed.
        This function creates all the necessary elements
        making up a post, and appends the assembled post
        into the post  container   #coursepostContainer.
    */
     function displayPost(post) {
          // Creating post elements
          var mainpost = document.createElement("div");
               var mpHeader = document.createElement("div");
                    var mpHLeft = document.createElement("div");
                    var mpHMid = document.createElement("div");
                         var mpHMTop = document.createElement("div");
                         var mpHMBot = document.createElement("div");
               var mpReview = document.createElement("div");
                    var mpRStars = document.createElement("div");
                    var mpRDesc = document.createElement("div");
               var mpReviewBox = document.createElement("div");
                    var mpReviewText = document.createElement("div");
                         var mpRParagraph = document.createElement("p");
               var mpSubHeader = document.createElement("div");
                    var mpSHImg = document.createElement("img");
                    var mpSHLeft = document.createElement("div");
                         var mpSHLTop = document.createElement("div");
                         var mpSHLBot = document.createElement("div");
                    var mpLike = document.createElement("div");

          // Add classes
          $(mainpost).addClass("mainpost");
          $(mpHeader).addClass("mp-header");
          $(mpHLeft).addClass("mp-header-left");
          $(mpHMid).addClass("mp-header-middle");
          $(mpHMTop).addClass("mp-header-middle-top");
          $(mpHMBot).addClass("mp-header-middle-bottom");
          $(mpReview).addClass("mp-review");
          $(mpRStars).addClass("mp-review-stars");
          $(mpRDesc).addClass("mp-rev-description");
          $(mpReviewBox).addClass("mp-review-box");
          $(mpReviewText).addClass("mp-review-text");
          $(mpSubHeader).addClass("mp-subheader");
          $(mpSHImg).addClass("mp-subheader-pic");
          $(mpSHLeft).addClass("mp-subheader-left");
          $(mpSHLTop).addClass("mp-subheader-left-top");
          $(mpSHLBot).addClass("mp-subheader-left-bottom");
          $(mpLike).addClass("mp-subheader-likebutton");

          // Append
          $(mainpost).append(mpHeader);
          $(mpHeader).append(mpHLeft);
          $(mpHeader).append(mpHMid);
          $(mpHMid).append(mpHMTop);
          $(mpHMid).append(mpHMBot);
          $(mainpost).append(mpReview);
          $(mpReview).append(mpRStars);
          $(mpReview).append(mpRDesc);
          $(mainpost).append(mpReviewBox);
          $(mpReviewBox).append(mpReviewText);
          $(mpReviewText).append(mpRParagraph);
          $(mainpost).append(mpSubHeader);
          $(mpSubHeader).append(mpSHImg);
          $(mpSubHeader).append(mpSHLeft);
          $(mpSHLeft).append(mpSHLTop);
          $(mpSHLeft).append(mpSHLBot);
          $(mpSubHeader).append(mpLike);

          // Set post content
          $(mpHLeft).text(mpHeaderLeft);
          $(mpHMTop).text(post.profFName + " " + post.profLName);
          $(mpHMBot).text(post.course + " | Term " + post.term);
          $(mpRDesc).text(getStarDesc(post.stars));
          $(mpRParagraph).text(post.text);
          $(mpSHImg).attr("src", post.owner.img);
          $(mpSHLTop).text(post.owner.firstName + " " + post.owner.lastName);
          $(mpSHLBot).text(post.owner.degree + " | " + post.owner.college);
          $(mpLike).attr("id", post.id);
          
          // Set proper display of post ratings
          // switch(post.stars)
          // {
          //      case 1:
          //           $(mpRStars).css("background-position", "-230px -76px");
          //           $(mpRDesc).css("bottom", "40px");                         // Patch for 1star text being in the wrong position
          //           break;
          //      case 2:
          //           $(mpRStars).css("background-position", "-10px -148px");
          //           break;
          //      case 3:
          //           $(mpRStars).css("background-position", "-230px -14px");
          //           break;
          //      case 4:
          //           $(mpRStars).css("background-position", "-10px -83px");
          //           break;
          //      case 5:
          //           $(mpRStars).css("background-position", "-10px -18px");
          //           break;
          // }
          // // Display mainpost to post container
          // $("#coursepostContainer").append(mainpost);
     }

});