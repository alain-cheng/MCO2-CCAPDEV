const mpHeaderLeft = "Review For:";
const errPostEmpty = "OOPS! There are no posts here.";
var currentUser;                 // Store the logged user in json object format
var rating;

/*
     Fills the db with default data that is stored in controller.js fillDB.

     Sometimes you might want to either delete the Prof2Pick database and restart the app
     or comment this function out since it only needs to run once especially when testing
     post liking and course following to prevent it from reverting to default values when 
     the page gets refreshed.
*/
$.get("/fillDB");                

jQuery(function () {
     console.log("Document Loaded");

     // Create working course follow buttons
     var courseFollow = document.getElementById("fr-list");
     courseFollow?.addEventListener('click', followCourse);

     // Temporary: Auto login a user (testing purposes) (delete if you want)
     /*
     $.get("/findUser", {
          filter: {
               username: 'Sarah Parker',
               password: '12345'
          }
     }).then((res) => {
               currentUser = res;  
               console.log('Logged In', res['username']);
               console.log('Following', res['followedCourses']);
               login(currentUser);
     });*/

     /*=====================================================*/
     /*   Main application functions below */
     /*=====================================================*/
     let loggedIn = false;

     /*  */
     function login(user) {
          currentUser = user;
          console.log('Current User is: ', currentUser);
          $('.signed-out-message').hide();
          $("#logged-user").attr("src", user['img']);
          refreshContent(user);
          //loggedIn = true;
     }

    /* Reloads the page content for the user */
     function refreshContent(user) {
          // Reset the Right-bar user info
          $(".lu-info-top").text("");
          $(".lu-info-bottom").text("");
          $("#fr-list").html("");
          $(".lu-info-top").text(user['firstName'] + " " + user['lastName']);
          $(".lu-info-bottom").text(user['degreeCode'] + " | " + user['college']);
          $("#coursepostContainer").html(""); // Clears all posts
          
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
               let following = user['followedCourses'];
               let likedpostCourses = [];                           // Stores the courses from the posts the user has liked
               let setCodes = new Set();                            // Stores college ids without duplicates
               let codes = [];

               // $.get("/findPosts", {                                    // 
               //      filter: { id: user['likedPosts'] }
               // }).then((element) => {
               //      element.forEach(e => {
               //           likedpostCourses.push(e['reviewCourse']);
               //      });
               //      console.log('likedlist', likedpostCourses);
               // });
                                             
               $.get("/findCourses", {                                   // Look for all the colleges the followed courses belong to
                    filter: { coursecode: following }
               }).then((res) => {
                    res.forEach(e => {
                         setCodes.add(e['collegeid']);
                    });

                    setCodes.forEach((e) => {                            // Convert the set into a list object
                         codes.push(e);
                         
                    });

                    $.get("/findCourses", {                              // Use the codes list to grab all courses within the same colleges
                         filter: { collegeid: codes }
                    }).then((suggestCourses) => {
                         //console.log('Courses to suggest:', suggestCourses);
                         displayCourse(suggestCourses);
                    });

                    $.get("/findPosts", {                                // Display posts based on the courses being followed
                         filter: { reviewCourse: following }
                    }).then((posts) => {
                         //console.log("Posts to display:", posts);
                         displayPosts(posts);
                    });
               });
               
          } else if(user['followedCourses'].length == 0) {
               $.get("/findCollege", {                            // Find the college id based on the user's college
                    filter: { collegename: user['college'] }
               }).then((res) => {

                    $.get("/findCourses", {                           // Find all courses with the same collegeid
                         filter: { collegeid: res['id'] }
                    }).then((suggestCourses) => {
                         displayCourse(suggestCourses);
                    });
               });

               $.get("/findPosts", { filter: {} }).then((posts) => {           // Returns every single post in the db
                    displayPosts(posts);
               });
          }
          
          renderSearches();
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

               $(frListElementName).text(e['coursecode']);
               $(frListElementFollow).text(checkFollowing(e['coursecode']));

               $("#fr-list").append(frListElement);
          });
     }

     /* 
          Simply checks if current user is following a given
          course name from the parameter. Returns a string.
     */
     function checkFollowing(course) {
          let followedCourses = [];
          let flag = 0;

          followedCourses = currentUser['followedCourses'];
          followedCourses.forEach(e => {
               if(course.localeCompare(e) == 0) {        // a string compare
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
               //console.log(errPostEmpty)
          } else {
               $('.empty-post-message').hide();
               posts.forEach(e => {
                    displayPost(e);
               });
               // Resets the like button's event handlers.
               addLikeEvents();
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
          $(mpHMTop).text(post['reviewForFN'] + " " + post['reviewForLN']);
          $(mpHMBot).text(post['reviewCourse'] + " | " + post['reviewTerm']);
          $(mpRDesc).text(getStarDesc(post['reviewRating']));
          $(mpRParagraph).text(post['reviewText']);
          $(mpSHImg).attr("src", post['posterPfp']);
          $(mpSHLTop).text(post['posterNameFN']+ " " + post['posterNameLN']);
          $(mpSHLBot).text(post['posterDegCode'] + " | " + post['posterCollege']);
          $(mpLike).attr("id", post['id']);
          
          // Set proper display of post ratings
          switch(post['reviewRating'])
          {
               case 1:
                    // $(mpRStars).css("background-position", "-230px -76px");
                    // $(mpRDesc).css("bottom", "40px");                         // Patch for 1star text being in the wrong position
                    $(mpRStars).text("★");
                    break;
               case 2:
                    // $(mpRStars).css("background-position", "-10px -148px");
                    $(mpRStars).text("★★");
                    break;
               case 3:
                    //$(mpRStars).css("background-position", "-230px -14px");
                    $(mpRStars).text("★★★");
                    break;
               case 4:
                    //$(mpRStars).css("background-position", "-10px -83px");
                    $(mpRStars).text("★★★★");
                    break;
               case 5:
                    //$(mpRStars).css("background-position", "-10px -18px");
                    $(mpRStars).text("★★★★★");
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
          Renders all the options available for the post search feature 
     */
     function renderSearches() {
          $('#filtercourse').html("");
          $('#filtercollege').html("");

          $.get("/findCourses", {filter: {}}).then((courses) => {
               //console.log('courses found:',courses);
               courses.forEach(course => {
                    var option = document.createElement("option");
                    $(option).attr("value", course['coursecode']);
                    $(option).text(course['coursecode']);
                    $('#filtercourse').append(option);
               });
          });

          $.get("/findColleges", {filter: {}}).then((colleges) => {
               //console.log('colleges found:',colleges);
               colleges.forEach(college => {
                    var option = document.createElement("option");
                    $(option).attr("value", college['collegename']);
                    $(option).text(college['collegename']);
                    $('#filtercollege').append(option);
               });
          });
     }
     
     /*
          likes posts from the course posts section
     */
     function like(e) {
          let bgPos = e.target.style.backgroundPosition;
          if(bgPos == "-300px -130px") { // if like button is empty
               console.log('currentUser is', currentUser);
               e.target.style.backgroundPosition = "-230px -130px";
               currentUser.likedPosts.push(e.target.id);
               console.log("Liked " + e.target.id);
               $.get("/likePost", {
                    filter: { username: currentUser['username'] },
                    update: { $addToSet: { likedPosts: e.target.id } }
               });
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
               $.get("/unlikePost", {
                    filter: { username: currentUser['username'] },
                    update: { $pull: { likedPosts: e.target.id } }
               });
          }          
     }

     /* 
          Follows/unfollows courses in the suggestions tab
          Current issue persists where the server lags for 
          some time when spamming follow buttons or pressing
          follow buttons a couple times in short intervals
     */
     function followCourse(e) {
          let target = getEventTarget(e);
          let sibling = target.previousElementSibling;
          let currCourse = $(sibling).text();
          //console.log('followCourse:', currCourse)
          if(target.className.toLowerCase() === "fr-list-element-follow") { //follow
               if(target.innerText.toLowerCase() === "follow") {
                    $(target).text("Following");
                    // Find the course object first in the database, then use that object
                    // to add it into the user's followedCourses.
                    $.get("/findCourse", {
                         filter: { coursecode: currCourse }
                    }).then((follow) => {
                         //console.log('found', follow);
                         $.get("/followCourse", {
                              filter: { username: currentUser['username'] },
                              update: { $addToSet: { followedCourses: follow['coursecode'] }}
                         });

                         // After editting documents from the User schema, the currentUser must be
                         // updated with a new instance of that user to match the database updates.
                         $.get("/findUser", {
                              filter: {
                                   username: currentUser['username'],
                                   password: currentUser['password']
                              }
                         }).then((user) => {
                              currentUser = user;
                              refreshContent(currentUser); 
                         });
                    });
               }
               else if(target.innerText.toLowerCase() === "following") { //unfollow
                    $(target).text("Follow");
                    $.get("/findCourse", {
                         filter: { coursecode: currCourse }
                    }).then((follow) => {
                         //console.log('found', follow);
                         $.get("/followCourse", {
                              filter: { username: currentUser['username'] },
                              update: { $pull: { followedCourses: follow['coursecode'] }}
                         });

                         // After editting documents from the User schema, the currentUser must be
                         // updated with a new instance of that user to match the database updates.
                         $.get("/findUser", {
                              filter: {
                                   username: currentUser['username'],
                                   password: currentUser['password']
                              }
                         }).then((user) => {
                              currentUser = user;
                              refreshContent(currentUser);
                         });
                    });
               }
          }
     }

     /* 
          Returns the target element for an event that has bubbled from the container
     */
     function getEventTarget(e) {
          e = e || window.event;
          return e.target || e.srcElement;
     }

     /* 
          Adds like button event listeners to all the posts in the followed courses tab,
          and sets the like button state if the user has already liked the post previously.
     */
     function addLikeEvents() {
          const likeButtonsCF = document.querySelectorAll("div.mp-subheader-likebutton");
          likeButtonsCF.forEach((e) => {
               e.addEventListener("click", like);
               if(currentUser['likedPosts'].indexOf(e.id) !== -1) {
                    e.style.backgroundPosition = "-230px -130px";
               } else {
                    e.style.backgroundPosition = "-300px -130px";
               }
          });
     }

     /*
          This is for the scroll buttons on the course posts container
     */
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
     //Handles the login thingy
     $(".login").on("click", function () {
          //Check if username exists
          var tempU = $("#uName").val();//Stores username input

          //Check if username exists
          $.get("/findUser", {
               filter: {
                    username: tempU,
               }
          }).then((res) => {
                    currentUser = res;

                    //If username exists
                    if(currentUser)
                    {
                         //Check if password is correct
                         if(currentUser.password == $("#passwordInput").val() && currentUser.password == $("#passwordConfirm").val())
                         {
                              $("#loginResponse").html("Logged in as " + currentUser.firstName + " " + currentUser.lastName);
                              $("#loginResponse").css("color", "var(--green1)");
                              $("#loginResponse").css("display", "block");
                              //Hide response and close popup
                              setTimeout(() => {
                                   $("#loginResponse").css("display", "none");
                                   $("#loginResponse").css("color", "red");
                                   $(".loginContainer").css("visibility", "hidden");
                                   $(".loginContainer").css("display", "none");
                                   $("body >*:not(.loginContainer)").css("filter", "none");
                                   $("body >*:not(.loginContainer)").css("pointer-events", "all");
                                   }, "1600");
                              loggedIn = true; //Confirm login
                              $.get("/login?" + "username=" + currentUser.username);
                         }
                         else
                         {
                              $("#loginResponse").html("Incorrect username/Email or password!");
                              $("#loginResponse").css("display", "block");
                              //Hide response
                              setTimeout(() => {$("#loginResponse").css("display", "none");}, "1600");
                         }
                    }
                    else
                    {
                         $("#loginResponse").html("Username/Email does not exist!");
                         $("#loginResponse").css("display", "block");
                         //Hide response
                         setTimeout(() => {$("#loginResponse").css("display", "none");}, "1600");
                    }

                    //Reveal and update
                    if(loggedIn)
                    {
                         $(".signed-out-message").hide();
                         login(currentUser);
                         $(".rightbar").css("display", "block");
                         $(".mainpage").css("display", "block");
                         $(".navbar-loginregister").html("Log Out");
                         tempU = "";
                    }
          });
     });
     
     $(".navbar-loginregister").on("click", function (e) {
          //Handles log out functions
          if(loggedIn)
          {
               //Hide and revert
               $(".rightbar").css("display", "none");
               $(".mainpage").css("display", "none");
               $(".navbar-loginregister").html("Login/Register");

               //Store name of user temporarily
               let tempName = $(".lu-info-top").text();

               // clear right bar contents
               $("#logged-user").attr("src", "");
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

               //Reset loggedIn
               loggedIn = false;
               //Delete user data
               currentUser = {};

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
     $("button.login-close").on("click", function (e) {
          $(".loginContainer").css("visibility", "hidden");
          $(".loginContainer").css("display", "none");
          $("body >*:not(.loginContainer)").css("filter", "none");
          $("body >*:not(.loginContainer)").css("pointer-events", "all");
     });

     $("#scroll-left").on("click", function () { 
          var container = document.getElementById("coursepostContainer");
          sideScroll(container, "left", 5, 520, 10);
     });

     $("#scroll-right").on("click", function () { 
          var container = document.getElementById("coursepostContainer");
          sideScroll(container, "right", 5, 520, 10);
     });

     $("#see-all").on("click", function () {
          $("#coursepostContainer").html("");
          $.get("/findPosts", { filter: {} }).then((res) => displayPosts(res));
     });

     $("#coursesContainer").hover(function () {
               $("#scroll-container").css("visibility", "visible");
          }, function () {
               $("#scroll-container").css("visibility", "hidden");
          }
     );

     // For Search container
     $('#searchByFilter').click(function () {
          console.log('Course', $('#filtercourse').val());
          console.log('Term', $('#filterterm').val());
          console.log('College', $('#filtercollege').val());
          console.log('Rating', $('#filterrating').val());

          let selectCourse = $('#filtercourse').val();
          let selectTerm = $('#filterterm').val();
          let selectCollege = $('#filtercollege').val();
          let selectRating = $('#filterrating').val();

          $.get("/findPosts", {
               filter: {
                    reviewCourse: selectCourse || {},
                    reviewTerm: selectTerm || {},
                    posterCollege: selectCollege || {},
                    reviewRating: selectRating || {}
               }
          }).then((posts) => {
               console.log('result', posts);
               $("#coursepostContainer").html("");
               displayPosts(posts);
          });
     });

     $('#searchByName').click(function () {
          console.log('clicked');
          // console.log('First', $('#profname2').val());
          // console.log('Last', $('#profLastName2').val());

          $.get("/findPosts", {
               filter: {
                    reviewForFN: $('#profname2').val() || {},
                    reviewForLN: $('#profLastName2').val() || {}
               }
          }).then((posts) => {
               console.log('result', posts);
               $("#coursepostContainer").html("");
               displayPosts(posts);
          });
     });

     // Hovering over Home, Profs, and Courses buttons in the NavBar
     $('.navbar-buttons').on("hover", function() {
          $(this).css("background-color", "rgb(71, 179, 107)");
     }, function (){
               $(this).css("background-color", "");
     });

     // Hovering over Login in the NavBar
     $('.navbar-loginregister').on("hover", function() {
          $(this).css("background-color", "rgb(71, 179, 107)");
     }, function (){
          $(this).css("background-color", "");
     });

     /* User information (i.e., name, degree), number of likes, and date and time of publication are hard-coded for now */
     /* I'll try to find some APIs that can get the current date and time*/
     // function createNewReview(fname, lname, course, term, rating, desc) {

     //      let stars, legend, htmlString, now;
     //      let numStars;

     //      updateData.fname = fname;
     //      updateData.lname = lname;
     //      updateData.course = course;
     //      updateData.term = term;
     //      updateData.rating = rating;
     //      updateData.desc = desc;

     //      switch (rating) {
     //           case '1':
     //                stars = "★";
     //                numStars = 1;
     //                legend = "DO NOT TAKE";
     //                break;
     //           case '2':
     //                stars = "★★";
     //                numStars = 2;
     //                legend = "Poor";
     //                break;
     //           case '3':
     //                stars = "★★★";
     //                numStars = 3;
     //                legend = "Average";
     //                break;
     //           case '4':
     //                stars = "★★★★";
     //                numStars = 4;
     //                legend = "Good";
     //                break;
     //           case '5':
     //                stars = "★★★★★";
     //                numStars = 5;
     //                legend = "Excellent";
     //                break;
     //      }

     //      // create new post object
     //      newPost = new Post(fname, lname, String(desc), course, term, numStars, currentUser, (100000+posts.length+1));
     //      posts.push(newPost);

     //      //Store current date and time in variable
     //      now = new Date();

     //      htmlString = `
     //           <div class="nrSubContainer">
     //                <img src="${users[loggedIn].img}" id="nrUserDP">
     //                <div class="nrUserDetails">${users[loggedIn].firstName} ${users[loggedIn].lastName}</div>
     //                <div class="nrUserDetails">${users[loggedIn].degree}</div>
     //                <div class="nrUserDetails">${users[loggedIn].batch}</div>
     //                <br>
     //                <div class="nrPubInfo">Published on:</div>
     //                <div class="nrPubInfo">${now.toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"})}</div>
     //                <div class="nrPubInfo">${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric"})}</div>
     //           </div>
     //           <div class="divider"></div>
     //           <div class="nrSubContainer2">
     //                <div class="nrHeader">
     //                     <div id="reviewFor">REVIEW FOR: </div>
     //                     <div id="reviewForInfo">${fname} ${lname} | ${course} | ${term}</div>
     //                </div>
     //                <div class="nrRatingContainer">
     //                     <div class="nrStars">${stars}</div>
     //                     <div class="nrLegend">${legend}</div>
     //                </div>
     //                <div class="nrDesc">${desc}</div>
     //                <div class="nrLikeCounter">0 likes</div>
                    
     //           </div>
     //      `;


     //      $(".newReviewContainer").css("display", "flex"); // reveals the (initially) hidden newReviewContainer div
     //      return htmlString;
     // }

     $('.rate').click(function() {
          rating = $('input[name="rate"]:checked').val();
          console.log(rating);
          switch(rating) {
               case '5':
                    $('#reviewLegend').html("Excellent");
                    break;
               case '4':
                    $('#reviewLegend').html("Good");
                    break;
               case '3':
                    $('#reviewLegend').html("Average");
                    break;
               case '2':
                    $('#reviewLegend').html("Poor");
                    break;
               case '1':
                    $('#reviewLegend').html("DO NOT TAKE");
                    break;
          }
     });

     //Submit review checking for missing inputs and storing valid inputs into variables
     $(".reviewSubmit").click(function () {
          //Storing the inputs into vars
          var fNameInput = $("#profname").val();
          var lNameInput = $("#profLastName").val();
          var courseInput = $("#profcourse").val();
          var aTermInput = $("#acadterm").val();
          var descInput = $("#reviewbody").val();

          //Used for input checking
          var errState = 0;
          $("#reviewStatus").html("");

          //Checking for missing inputs
          if(fNameInput == "")
          {
               if(errState == 0)
                    errState = 1;
               else
                    errState = 420;
          }
          if(lNameInput == "")
          {
               if(errState == 0)
                    errState = 2;
               else
                    errState = 420;
          }
          if(courseInput == "")
          {
               if(errState == 0)
                    errState = 3;
               else
                    errState = 420;
          }
          if(aTermInput == "")
          {
               if(errState == 0)
                    errState = 4;
               else
                    errState = 420;
          }
          if(rating == undefined)
          {
               if(errState == 0)
                    errState = 5;
               else
                    errState = 420;
          }
          if(descInput == "")
          {
               if(errState == 0)
                    errState = 6;
               else
                    errState = 420;
          }
          //Printing errState
          switch(errState)
          {
               case 1:
                    $("#reviewStatus").html("No first name inputted!");
                    $("#reviewStatus").css("color", "red");
                    $("#reviewStatus").css("display", "block");
                    break;
               case 2:
                    $("#reviewStatus").html("No last name inputted!");
                    $("#reviewStatus").css("color", "red");
                    $("#reviewStatus").css("display", "block");
                    break;
               case 3:
                    $("#reviewStatus").html("No course inputted!");
                    $("#reviewStatus").css("color", "red");
                    $("#reviewStatus").css("display", "block");
                    break;
               case 4:
                    $("#reviewStatus").html("No academic term inputted!");
                    $("#reviewStatus").css("color", "red");
                    $("#reviewStatus").css("display", "block");
                    break;
               case 5:
                    $("#reviewStatus").html("No rating selected!");
                    $("#reviewStatus").css("color", "red");
                    $("#reviewStatus").css("display", "block");
                    break;
               case 6:
                    $("#reviewStatus").html("No description inputted!");
                    $("#reviewStatus").css("color", "red");
                    $("#reviewStatus").css("display", "block");
                    break;
               case 420:
                    $("#reviewStatus").html("Multiple missing inputs!");
                    $("#reviewStatus").css("color", "red");
                    $("#reviewStatus").css("display", "block");
                    break;
               case 0:
                    $("#reviewStatus").html("Review successfully submitted!");
                    $("#reviewStatus").css("color", "green");
                    $("#reviewStatus").css("display", "block");
                    break;
          }

          //Hide response
          setTimeout(() => {$("#reviewStatus").css("display", "none");}, "1600");

          //Submit review
          if(errState == 0)
          {
               //Console output for now... Store data later
               console.log("First Name: " + fNameInput);
               console.log("Last Name: " + lNameInput);
               console.log("Course: " + courseInput);
               console.log("Academic Term: " + aTermInput);
               console.log("Rating: " + rating);
               console.log("Description: " + descInput);

               
               $(".new-review-headline").html("YOU CREATED A NEW REVIEW!")
               $("#edit-review").html('<button class="edit-review">CLICK HERE TO EDIT</button>')
               // Call createNewReview to update the newReviewContainer div
               //$(".newReviewContainer").html(createNewReview(fNameInput, lNameInput, courseInput, aTermInput, rating, descInput))
               $.get("/findPosts", {filter: {}}).then((res) => {
                    var idNum = 1200 + res.length + 1;
                    $.get("/addPost", {
                         id: idNum,
                         reviewForFN: fNameInput,
                         reviewForLN: lNameInput,
                         reviewCourse: courseInput,
                         reviewTerm: aTermInput,
                         reviewRating: rating,
                         reviewText: descInput,
                         posterNameFN: currentUser['firstName'],
                         posterNameLN: currentUser['lastName'],
                         posterPfp: "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg",
                         posterDegCode: currentUser['degreeCode'],
                         posterCollege: currentUser['college'],
                         likesNum: 0
                    }).then((res) => {
                         console.log('Add post result', res);
                    });
               });

               //Reset inputs
               $("#profname").val("");
               $("#profLastName").val("");
               $("#profcourse").val("");
               $("#acadterm").val("");
               $("input:radio[name='rate']:checked")[0].checked = false;
               rating = undefined;
               $('#reviewLegend').html("Rating");
               $("#reviewbody").val("");
          }

          //Reset errState
          var errState = 0;
          // update page of user
          refreshContent(currentUser);
     });

     /* courses.html functions */

     // Hovering over the college name buttons in courses.html (i.e. School of Economics, College of Science)
     $('.courseButton').on("hover", function() {
          $(this).css("opacity", "75%");
     }, function (){
          $(this).css("opacity", "100%");
     });

     // Hovering over the contents of a table of courses
     $("#course-table tr").on("hover", function() {
          $(this).css("background-color", "var(--gray2)");
     }, function (){
          $(this).css("background-color", "var(--white1)");
     });
     
});