const mpHeaderLeft = "Review For:";
const errPostEmpty = "OOPS! There are no posts here.";

var currentUser;                 // Store the logged user in json object format

jQuery(function () {
     console.log("Document Loaded");

     /*=====================================================*/
     /*   Sample for getting a document from the db */
     /*=====================================================*/
     $.get("/findCourse", {
          filter: { college: 'CCS' }
     }).then((res) => {              // retrieve response data
          var collegeSample = res;
          console.log('Sample Object:', collegeSample);
          console.log('Object Name:', collegeSample['name']);
          console.log('Object ID:', collegeSample['college']);
     });
     /*=====================================================*/

     // Create working course follow buttons
     var courseFollow = document.getElementById("fr-list");
     courseFollow?.addEventListener('click', followCourse);

     // Temporary: Auto login a user (testing purposes)
     $.get("/findUser", {
          filter: {
               username: 'HDavis',
               password: 'user1'
          }
     }).then((res) => {
               currentUser = res;  
               console.log('Logged In', res['username']);
               console.log('Following', res['followedCourses']);
               login(currentUser);
     });

     /*=====================================================*/
     /*   Main application functions below */
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
          $('.signed-out-message').hide();
          $("#logged-user").attr("src", user['img']);
          refreshContent(user);
     }

    /* Reloads the page content for the user */
     function refreshContent(user) {
          // Reset the Right-bar user info
          $(".lu-info-top").text("");
          $(".lu-info-bottom").text("");
          $("#fr-list").html("");
          $(".lu-info-top").text(user['firstName'] + " " + user['lastName']);
          $(".lu-info-bottom").text(user['degree'] + " | " + user['college'].name);
          
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
               //courseSuggestions(user['followedCourses']);
               let following = user['followedCourses'];
               let setCodes = new Set();                            // Stores college ids without duplicates
               let codes = [];
               let courses = [];
               
               following.forEach(e => {
                    courses.push(e['name']);
               });

               //console.log('User is following', courses);

               for(var i = 0; i < user['followedCourses'].length; i++) {
                    setCodes.add(user['followedCourses'][i].college);
               }

               setCodes.forEach((element) => {                      // Place all elements of the Set into an array
                    codes.push(element);
               });

               $.get("/findCourses", {
                    filter: { college: codes }
               }).then((res) => {
                    //console.log('Courses to suggest:', res);
                    courseSuggestions(res);
               });

               $.get("/findPosts", {
                    filter: { course: courses }
               }).then((posts) => {
                    //console.log("findPosts result:", posts);
                    displayPosts(posts);
               });
               
          } else if(user['followedCourses'].length == 0) {
               let suggest = [];                                 // will be storing course objects

               $.get("/findCourses", {                           // Find all courses with the same `college`
                    filter: { college: user['college'].name }
               }).then((res) => {
                    console.log('Courses found: ', res);
                    for(var i = 0; i < res.length; i++) {
                         suggest.push(res[i]);
                    }
                    courseSuggestions(suggest);
               });

               $.get("/findPosts", { filter: {} }).then((posts) => {           // Returns every single post in the db
                    console.log('findPosts result:', posts);
                    displayPosts(posts);
               });
          }
          
          $("#coursepostContainer").html("");                    // Clears all posts

          // Resets the like button's event handlers.
          addLikeEvents();
     }

     /* 
        A function that accepts a list of course objects
        meant to be shown in the suggestions bar.
        This function takes all possible courses from the
        database and passes the objects received onto
        displayCourse()
     */
     function courseSuggestions(courseList) {
          //console.log('courseSuggestions received:', courseList);
          let setCodes = new Set();
          let codes = [];

          /*
                    All course suggestions that will be displayed are
                    related to the current followed courses' colleges.

                    However if courseList is empty, then take the current
                    user's college and base recommendations of off that.
          */
          courseList.forEach(e => {
               setCodes.add(e['college']);
          });

          setCodes.forEach(e => {
               codes.push(e);
          });

          if(courseList.length > 0){
               $.get("/findCourses", {
                    filter: { college: codes }
               }).then((suggestions) => {
                    console.log('Courses to Suggest: ', suggestions);
                    displayCourse(suggestions)
               });
          } else {
               $.get("/findCourses", {
                    filter: { college: currentUser['college'].id }
               }).then((suggestions) => {
                    console.log('Courses to Suggest: ', suggestions);
                    displayCourse(suggestions)
               });
          }
     }

     /*
          This function displays the courses to suggest on the side-bar
          of the homepage by accepting a list of course objects. 
     */
     function displayCourse(courses) {
          //console.log('displayCourse received:', courses);

          courses.forEach(e => {
               let frListElement = document.createElement("div");
               let frListElementName = document.createElement("div");
               let frListElementFollow = document.createElement("div");

               $(frListElement).addClass("fr-list-element");
               $(frListElementName).addClass("fr-list-element-name");
               $(frListElementFollow).addClass("fr-list-element-follow");

               $(frListElement).append(frListElementName);
               $(frListElement).append(frListElementFollow);

               $(frListElementName).text(e['name']);
               $(frListElementFollow).text(checkFollowing(e['name']));

               $("#fr-list").append(frListElement);
          });
     }

     /* 
          Simply checks if current user is following a given
          course name from the parameter. Returns a string.
     */
     function checkFollowing(coursename) {
          let followedCourses = [];
          let flag = 0;

          followedCourses = currentUser['followedCourses'];
          followedCourses.forEach(e => {
               if(coursename.localeCompare(e['name']) == 0) {
                    flag = 1;
               }
          });
          
          if(flag == 1) return "Following";
          else return "Follow";
     }

    /*
        Accepts a list of post objects meant to be displayed.
        If there are no posts to be displayed, a message must
        be  displayed  indicating  no  posts  are  available.

        This function  is   tied   with   displayPost(),  the
        singular form of this method.
    */
     function displayPosts(posts) {
          //console.log('displayPosts received:', posts);

          if(posts.length == 0) {
               var message = document.createElement("div");
               $(message).addClass("empty-post-message");
               $(message).text(errPostEmpty);
               $("#coursepostContainer").append(message);
               console.log(errPostEmpty)
          } else {
               posts.forEach(e => {
                    displayPost(e);
               });
          }
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
          $(mpHMTop).text(post['profFName'] + " " + post['profLName']);
          $(mpHMBot).text(post['course'] + " | Term " + post['term']);
          $(mpRDesc).text(getStarDesc(post['stars']));
          $(mpRParagraph).text(post['text']);
          $(mpSHImg).attr("src", post['owner'].img);
          $(mpSHLTop).text(post['owner'].firstName + " " + post['owner'].lastName);
          $(mpSHLBot).text(post['owner'].degree + " | " + post['owner'].college);
          $(mpLike).attr("id", post['id']);
          
          // Set proper display of post ratings
          switch(post.stars)
          {
               case 1:
                    $(mpRStars).css("background-position", "-230px -76px");
                    $(mpRDesc).css("bottom", "40px");                         // Patch for 1star text being in the wrong position
                    break;
               case 2:
                    $(mpRStars).css("background-position", "-10px -148px");
                    break;
               case 3:
                    $(mpRStars).css("background-position", "-230px -14px");
                    break;
               case 4:
                    $(mpRStars).css("background-position", "-10px -83px");
                    break;
               case 5:
                    $(mpRStars).css("background-position", "-10px -18px");
                    break;
          }
          // Display mainpost to post container
          $("#coursepostContainer").append(mainpost);
     }

     /*
          Translates star ratings (in numeric form [1-5]) and returns a String
     */
     function getStarDesc(rate) {
          switch(rate) {
               case 1: return "DO NOT TAKE";
               case 2: return "Poor";
               case 3: return "Average";
               case 4: return "Good";
               case 5: return "Excellent";
               default: return "Error";
          }
     }
     
     /*
          likes posts from the course posts section
     */
     function like(e) {
          let bgPos = e.target.style.backgroundPosition;
          if(bgPos == "-300px -130px") { // if like button is empty
               e.target.style.backgroundPosition = "-230px -130px";
               currentUser.likedPosts.push(e.target.id);
               console.log("Liked " + e.target.id);
          } 
          else { // if like button is color red
               e.target.style.backgroundPosition = "-300px -130px";
               for(var i = 0; i < currentUser.likedPosts.length; i++) {
                    if(currentUser.likedPosts[i] == e.target.id) {
                         currentUser.likedPosts.splice(i, 1);
                         break;
                    }  
               }
               console.log("Removed Like for " + e.target.id);
          }          
     }

     /* 
          Follows/unfollows courses in the suggestions tab
     */
     function followCourse(e) {
          let target = getEventTarget(e);
          let sibling = target.previousElementSibling;
          let currCourse = $(sibling).text();
          console.log('followCourse:', currCourse)
          if(target.className.toLowerCase() === "fr-list-element-follow") { //follow
               if(target.innerText.toLowerCase() === "follow") {
                    $(target).text("Following");
                    // add that course to the currentUsers' followedCourses
                    $.get("/findCourses", {
                         filter: { name: currCourse }
                    }).then((res) => {
                         console.log('found', res);
                         res.forEach(e => {
                              $.get("/followCourse", {
                                   filter: {}
                              }).then((res) => {
                                   
                              });
                         });
                         
                    });

                    // for(var i = 0; i < courses.length; i++) {
                    //      if(courses[i].name == currCourse) {
                    //           currentUser.followedCourses.push(courses[i]);
                    //           break;
                    //      }
                    // }
               }
               else if(target.innerText.toLowerCase() === "following") { //unfollow
                    $(target).text("Follow");
                    // loop tru currentUser's followedCourses and remove that course
                    for(var i = 0; i < currentUser.followedCourses.length; i++) {
                         if(currentUser.followedCourses[i].name == currCourse) {
                              currentUser.followedCourses.splice(i, 1);
                              break;
                         }
                    }
               }
          }
          refreshContent(currentUser);
     }

     /* 
          Returns the target element for an event that has bubbled from the container
     */
     function getEventTarget(e) {
          e = e || window.event;
          return e.target || e.srcElement;
     }

     /* 
          Adds like button event listeners to all the posts in the followed courses tab 
     */
     function addLikeEvents() {
          const likeButtonsCF = document.querySelectorAll("d.mp-subheader-likebutton");
          //console.log('likeButton:', likeButtonsCF);
          likeButtonsCF.forEach((e) => {
               console.log('addLikeEvents:', e);
               e.addEventListener("click", like);
               if(currentUser['likedPosts'].indexOf(e.id) !== -1) {
                    e.style.backgroundPosition = "-230px -130px";
               } else {
                    e.style.backgroundPosition = "-300px -130px";
               }
          });
     }

     function sideScroll(e, direction, speed, distance, step) {
          let scrollAmount = 0;
          let slideTimer = setInterval(function(){
               if(direction == "left") {
                    e.scrollLeft -= step;
               } 
               else {
                    e.scrollLeft += step;
               }
               scrollAmount += step;
               if(scrollAmount >= distance) {
                    window.clearInterval(slideTimer);
               }
          }, speed);
     }

     /*========================================================*/
     /* HOVER/CLICK EVENTS */
     /*========================================================*/
     $(".navbar-loginregister").click(function (e) {
          //Handles log out functions
          if(loggedIn != -1)
          {
               //Hide and revert
               $(".rightbar").css("display", "none");
               $(".reviewContainer").css("display", "none");
               $(".coursesContainer").css("display", "none");
               $(".searchContainer").css("left", "142px");
               $(".navbar-loginregister").html("Login/Register");

               // clear right bar contents
               $("#logged-user").attr("src", "./public/empty-profile-pic.jpeg");
               $(".lu-info-top").text("");
               $(".lu-info-bottom").text("");

               // clear suggested courses
               $("#fr-list").html("");

               // clear followed course contents
               $("#coursepostContainer").html("");

               // reset the like button event handlers
               addLikeEvents();

               //Reset inputs
               $("#uName").val("");
               $("#passwordInput").val("");
               $("#passwordConfirm").val("");

               //Hide and Delete reviews
               $(".newReviewContainer").css("display", "none");
               $(".newReviewContainer").html("");

               //Store name of user temporarily
               let tempName = users[loggedIn].firstName + " " + users[loggedIn].lastName;

               //Reset loggedIn
               loggedIn = -1;

               //Re-open login window with a logout declaration
               $(".loginContainer").css("visibility", "visible");
               $(".loginContainer").css("display", "block");
               $("body >*:not(.loginContainer)").css("filter", "blur(2.5px)");
               $("body >*:not(.loginContainer)").css("pointer-events", "none");
               $("#loginResponse").html(tempName + " logged out!");
               $("#loginResponse").css("color", "var(--green1)");
               $("#loginResponse").css("display", "block");
               setTimeout(() => {
                    $("#loginResponse").css("display", "none");
                    $("#loginResponse").css("color", "red");
                    $("#loginResponse").html("");
                    }, "1600");

               //erase tempName data
               tempName = "";
          }
          else
          {
               $(".loginContainer").css("visibility", "visible");
               $(".loginContainer").css("display", "block");
               $("body >*:not(.loginContainer)").css("filter", "blur(2.5px)");
               $("body >*:not(.loginContainer)").css("pointer-events", "none");
          }  
     });

     /* closes the login pop up */
     $("button.login-close").click(function (e) {
          $(".loginContainer").css("visibility", "hidden");
          $(".loginContainer").css("display", "none");
          $("body >*:not(.loginContainer)").css("filter", "none");
          $("body >*:not(.loginContainer)").css("pointer-events", "all");
     });

     $("#scroll-left").click(function () { 
          var container = document.getElementById("coursepostContainer");
          sideScroll(container, "left", 5, 520, 10);
     });

     $("#scroll-right").click(function () { 
          var container = document.getElementById("coursepostContainer");
          sideScroll(container, "right", 5, 520, 10);
     });

     $("#see-all").click(function () {
          $("#coursepostContainer").html("");
          $.get("/findPosts", { filter: {} }).then((res) => displayPosts(res));
     });

     $("#coursesContainer").hover(function () {
               $("#scroll-container").css("visibility", "visible");
          }, function () {
               $("#scroll-container").css("visibility", "hidden");
          }
     );

});