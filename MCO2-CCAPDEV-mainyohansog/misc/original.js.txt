// @ts-nocheck
var User = function(firstName, lastName, degree, college, batch, username, password, img) {
    this.firstName = firstName;
    this.lastName  = lastName;
    this.degree    = degree;
    this.college   = college;
    this.batch     = batch;
    this.username  = username;
    this.password  = password;
    this.img       = String(img);
    this.followedCourses = [] // save course objects
    this.likedPosts = []; // save post ids
}


var Post = function(profFName, profLName, text, course, term, stars, owner, id) {
     this.profFName = profFName;
     this.profLName = profLName;
     this.text      = String(text);
     this.course    = course;
     this.term      = term;
     this.stars     = stars; // saves the number of stars
     this.owner     = owner; // a user object
     this.id        = id; // 6 digit id
}

var College = function(name, code) {
     this.name = name;
     this.code = code;
}

var Course = function(name, collegeid) {
     this.name = name;
     this.collegeid = collegeid;
}

const mpHeaderLeft = "Review For:";

var users = []; // all users
var posts = []; // all posts
var colleges = []; // all colleges
var courses = []; // all courses

var errPostEmpty = "OOPS! There are no posts here."

var currentUser;

var updateData = {
fname: "", 
lname: "", 
course: "", 
term: "", 
rating: "", 
desc: ""
}

$(document).ready(function () {
var currPosts = []; // posts only user should see based on follows or searches

// generate 5 sample users
var user1 = new User("Harley", "Davis", "BSCS", "College of Computer Studies", "ID 120", "HDavis", "user1", "./public/user1.jpg");
var user2 = new User("Sarah", "Parker", "BSCS", "College of Computer Studies", "ID 119", "Sarah", "user2", "./public/user2.jpg");
var user3 = new User("Amy", "Bougainvillea", "BSCS", "College of Computer Studies", "ID 120", "Amivillea", "user3", "./public/user3.jpg");
var user4 = new User("Lance", "Mendoza", "BSCS", "College of Computer Studies", "ID 120", "LanDoza", "user4", "./public/user4.jpg");
var user5 = new User("Francis", "Brown", "BSCS", "College of Computer Studies", "ID 119", "Francy", "user5", "./public/user5.jpg");
// and 1 user not from CCS
var user6 = new User("Mad", "Scientist", "BSBC", "College of Science", "ID 118", "MaddoScientisto", "user6", "./public/empty-profile-pic.jpeg");
users.push(user1, user2, user3, user4, user5, user6);

// generate 5 sample posts owned by user2 to user5
var post1 = new Post("Porter", "Newman", "Prof is entertaining, also grades high, strongly recommend!", "CCPROG", 2, 5, user2, 100001);
var post2 = new Post("Henry", "Ford", "Very good lectures, always late tho but still recommend", "CCDSTRU", 1, 4, user3, 100002);
var post3 = new Post("Farah", "Boeing", "Their internet is slow lol, but alright overall", "CCPROG2", 2, 3, user3, 100003);
var post4 = new Post("Jack", "Frost", "Gives a lot of assignments, but good prof, thats my only complaint", "CCPROG", 1, 4, user4, 100004);
var post5 = new Post("Whitney", "Spencer", "I honestly don't know what to say, Im shocked beyond disbelief, just don't take them thats all just take my word for it...Im going to need therapy after this", "CSINTSY", 3, 2, user5, 100005);
// and 2 sample posts owned by user6 not from CCS
var post6 = new Post("Albert", "Einstein", "The chem laboratory blew up because of them but they teach great", "KEMPSY1", 1, 5, user6, 100006);
var post7 = new Post("Isaac", "Newton", "Why do apples keep falling on their head it doesn't make sense", "KEMPRN1", 1, 4, user6, 100007);
posts.push(post1, post2, post3, post4, post5, post6, post7);

var college1 = new College("College of Computer Studies", "CCS");
var college2 = new College("College of Science", "COS");
colleges.push(college1, college2);

// define 5 sample courses
var course1 = new Course("CCPROG", "CCS");
var course2 = new Course("CCPROG2", "CCS");
var course3 = new Course("CCDSTRU", "CCS");
var course4 = new Course("CSINTSY", "CCS");
var course5 = new Course("CCAPDEV", "CCS");
// and 2 sample courses not on CCS
var course6 = new Course("KEMPSY1", "COS");
var course7 = new Course("KEMPRN1", "COS");
courses.push(course1, course2, course3, course4, course5, course6, course7);

//user1 is following CCPROG and CSINTSY
user1.followedCourses.push(course1, course4);

// add an event handler to #fr-list when clicked
const courseFollow = document.getElementById("fr-list");
courseFollow.addEventListener("click", followCourse);

$("#coursepostContaner").scroll(fadeWrap);

/*========================================================*/
/* FUNCTIONS OF index.js */
/*========================================================*/

function fadeWrap() {
let scrollPos = window.pageYOffset || document.documentElement.scrollLeft;
if(scrollPos > 300) {
    $("#scroll-left").show();
}
else {
    $("#scroll-left").hide();
}
}

let rating;

// hide the login container
$(".loginContainer").css("visibility", "hidden");

/* Creates a pop up when clicking login/register */
function login(user) {
currentUser = user;
// set profile picture
$("#logged-user").attr("src", user.img);

refreshContent(user);
}

// page refresh
function refreshContent(user) {
// clear right bar contents
$(".lu-info-top").text("");
$(".lu-info-bottom").text("");

// set logged user contents
$(".lu-info-top").text(user.firstName + " " + user.lastName);
$(".lu-info-bottom").text(user.degree + " | " + user.college);

// clear suggested courses
$("#fr-list").html("");

// if user is following atleast 1 course, suggest courses based on followed courses that belong in the same college
if(user.followedCourses.length > 0)
    courseSuggestions(user.followedCourses);
// else suggest courses that are on the same college as the user
else if(user.followedCourses.length == 0) {
    // create an array
    let suggest = [];
    // get the college of the user and suggest courses based off of that
    let collegename = user.college;
    let ccode;
    for(var i = 0; i < colleges.length; i++) {
         if(colleges[i].name == collegename) {
              ccode = colleges[i].code;
              break;
         }
    }

    courses.forEach(e => {
         if(e.collegeid == ccode) {
              suggest.push(e);
         } 
    });
    courseSuggestions(suggest);
}
    
// clear followed course contents
$("#coursepostContainer").html("");
// if user is not following any courses, display all posts
if(user.followedCourses.length == 0) 
    displayPosts(posts);
// else display posts based on what courses being followed
else if(user.followedCourses.length > 0) {
    let currPosts = [];
    for(var i = 0; i < user.followedCourses.length; i++) {
         for(var j = 0; j < posts.length; j++) {
              if(user.followedCourses[i].name == posts[j].course)
                   //displayPost(posts[j]);
                   currPosts.push(posts[j]);
         }
    }
    displayPosts(currPosts);
}  

// reset the like button event handlers
addLikeEvents();
}

// Accepts an array of courses
function courseSuggestions(courseList) {
// determine first which colleges the courses in the list are from
var collegecodes = [];
var flag = 0;
var currPosts = [];

// save first element
collegecodes.push(courseList[0].collegeid);
// console.log(collegecodes[0]);

if(courseList.length > 1) {
    for(var i = 1; i < courseList.length; i++) { // collect all college codes first without duplicates
         flag = 1;
         for(var j = 0; j < collegecodes.length; j++) {
              if(collegecodes[j] == courseList[i].collegeid)
                   flag = 0;
         }
         if(flag != 0)
              collegecodes.push(courseList[i].collegeid);
    }

    for(var x = 0; x < collegecodes.length; x++) { // save all courses with the same college code
         for(var y = 0; y < courses.length; y++) {
              if(courses[y].collegeid == collegecodes[x])
                   displayCourse(courses[y].name);
         }
    }
}
else {
    for(var l = 0; l < courses.length; l++) {
         if(courses[l].collegeid == collegecodes[0]) // save all courses with the same collegeid
              displayCourse(courses[l].name);
    }
}
}

// Creates elements and appends the coursename to the display on the side bar
// Accepts the name of the course (String)
function displayCourse(coursename) {
var frListElement = document.createElement("div");
    var frListElementName = document.createElement("div");
    var frListElementFollow = document.createElement("div");

$(frListElement).addClass("fr-list-element");
$(frListElementName).addClass("fr-list-element-name");
$(frListElementFollow).addClass("fr-list-element-follow");

$(frListElement).append(frListElementName);
$(frListElement).append(frListElementFollow);

$(frListElementName).text(coursename);
$(frListElementFollow).text(checkFollowing(coursename));

$("#fr-list").append(frListElement);
}

// Checks if current user is following a course
// Returns a string
function checkFollowing(coursename) {
let flag = 0;
for(var i = 0; i < currentUser.followedCourses.length; i++) {
    if(currentUser.followedCourses[i].name == coursename)
         flag = 1;
}

if(flag == 1)
    return "Following";
else
    return "Follow";
}

// displays all posts given a list of post objects
function displayPosts(posts) {
//if array is empty, post a message
if(posts.length == 0) {
    var message = document.createElement("div");
    $(message).addClass("empty-post-message");
    $(message).text(errPostEmpty);
    $("#coursepostContainer").append(message);
    console.log(errPostEmpty)
}
else {
    console.log("Posts available")
    for(var i = 0; i < posts.length; i++)
         displayPost(posts[i]); 
}

}

// Will display a post in the Followed Courses box (singular)
// accepts a post object
function displayPost(post) {
// Create post elements
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

// Set Post Content
$(mpHLeft).text(mpHeaderLeft);
$(mpHMTop).text(post.profFName + " " + post.profLName);
$(mpHMBot).text(post.course + " | Term " + post.term);
$(mpRDesc).text(getStarDesc(post.stars));
$(mpRParagraph).text(post.text);
$(mpSHImg).attr("src", post.owner.img);
$(mpSHLTop).text(post.owner.firstName + " " + post.owner.lastName);
$(mpSHLBot).text(post.owner.degree + " | " + post.owner.college);
$(mpLike).attr("id", post.id);

//Changing the amount of stars in the post
switch(post.stars)
{
    case 1:
         $(mpRStars).css("background-position", "-230px -76px");
         $(mpRDesc).css("bottom", "40px"); //Patch for 1star text being in the wrong position
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

// place created elements to main post parent container
$("#coursepostContainer").append(mainpost);
}

// Translates star ratings and returns a String
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

// likes posts from the courses you follow section
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

// follows/unfollows courses in the suggestions tab
function followCourse(e) {
let target = getEventTarget(e);
let sibling = target.previousElementSibling;
let currCourse = $(sibling).text();
if(target.className.toLowerCase() === "fr-list-element-follow") { //follow
    // do something
    if(target.innerText.toLowerCase() === "follow") {
         $(target).text("Following");
         // add that course to the currentUsers' followedCourses
         for(var i = 0; i < courses.length; i++) {
              if(courses[i].name == currCourse) {
                   currentUser.followedCourses.push(courses[i]);
                   break;
              }
         }
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

// Returns the target element for an event that has bubbled from the container
function getEventTarget(e) {
e = e || window.event;
return e.target || e.srcElement;
}

/* User information (i.e., name, degree), number of likes, and date and time of publication are hard-coded for now */
/* I'll try to find some APIs that can get the current date and time*/
function createNewReview(fname, lname, course, term, rating, desc) {

let stars, legend, htmlString, now;
let numStars;

updateData.fname = fname;
updateData.lname = lname;
updateData.course = course;
updateData.term = term;
updateData.rating = rating;
updateData.desc = desc;

switch (rating) {
    case '1':
         stars = "★";
         numStars = 1;
         legend = "DO NOT TAKE";
         break;
    case '2':
         stars = "★★";
         numStars = 2;
         legend = "Poor";
         break;
    case '3':
         stars = "★★★";
         numStars = 3;
         legend = "Average";
         break;
    case '4':
         stars = "★★★★";
         numStars = 4;
         legend = "Good";
         break;
    case '5':
         stars = "★★★★★";
         numStars = 5;
         legend = "Excellent";
         break;
}

// create new post object
newPost = new Post(fname, lname, String(desc), course, term, numStars, currentUser, (100000+posts.length+1));
posts.push(newPost);

//Store current date and time in variable
now = new Date();

htmlString = `
    <div class="nrSubContainer">

         <img src="${users[loggedIn].img}" id="nrUserDP">
         <div class="nrUserDetails">${users[loggedIn].firstName} ${users[loggedIn].lastName}</div>
         <div class="nrUserDetails">${users[loggedIn].degree}</div>
         <div class="nrUserDetails">${users[loggedIn].batch}</div>

         <br>

         <div class="nrPubInfo">Published on:</div>
         <div class="nrPubInfo">${now.toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"})}</div>
         <div class="nrPubInfo">${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric"})}</div>
    </div>

    <div class="divider"></div>

    <div class="nrSubContainer2">

         <div class="nrHeader">
              <div id="reviewFor">REVIEW FOR: </div>
              <div id="reviewForInfo">${fname} ${lname} | ${course} | ${term}</div>
         </div>

         <div class="nrRatingContainer">
              <div class="nrStars">${stars}</div>
              <div class="nrLegend">${legend}</div>
         </div>

         <div class="nrDesc">${desc}</div>
         <div class="nrLikeCounter">0 likes</div>
         
    </div>
`;


$(".newReviewContainer").css("display", "flex"); // reveals the (initially) hidden newReviewContainer div
return htmlString;
}

function updateReview () {
$(".newReviewContainer").css("display", "none");

$("#profname").val(updateData.fname);
$("#profLastName").val(updateData.lname);
$("#profcourse").val(updateData.course);
$("#acadterm").val(updateData.term);
$("#reviewbody").val(updateData.desc);

}

// adds like button event listeners to all the posts in the followed courses tab
function addLikeEvents() {
const likeButtonsCF = document.querySelectorAll("div.mp-subheader-likebutton");
likeButtonsCF.forEach((e) => {
    e.addEventListener("click", like);
    // sets the like button if the user has already liked the post or not.
    if(currentUser.likedPosts.indexOf(e.id) !== -1) {
         e.style.backgroundPosition = "-230px -130px";
    }
    else {
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

$('.navbar-buttons').hover(function() {
$(this).css("background-color", "rgb(71, 179, 107)");
}, function (){
$(this).css("background-color", "");
});

$('.navbar-loginregister').hover(function() {
$(this).css("background-color", "rgb(71, 179, 107)");
}, function (){
$(this).css("background-color", "");
});

$('.reviewSubmit').hover(function() {
$(this).css("opacity", "50%");
}, function (){
$(this).css("opacity", "100%");
});

$('.edit-review').hover(function() {
$(this).css("opacity", "50%");
}, function (){
$(this).css("opacity", "100%");
});

$('.searchButton').hover(function() {
$(this).css("opacity", "50%");
}, function (){
$(this).css("opacity", "100%");
});

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
    $(".newReviewContainer").html(createNewReview(fNameInput, lNameInput, courseInput, aTermInput, rating, descInput))

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

$(".edit-review").click(function () {
console.log("Edit review button clicked")
updateReview();
});

// Display all posts regardless if you are following it or not upon clicking.
$("#see-all").click(function () {
$("#coursepostContainer").html("");
displayPosts(posts);
});

$("#scroll-left").click(function () { 
var container = document.getElementById("coursepostContainer");
sideScroll(container, "left", 5, 520, 10);
});

$("#scroll-right").click(function () { 
var container = document.getElementById("coursepostContainer");
sideScroll(container, "right", 5, 520, 10);
});

$("#coursesContainer").hover(function () {
    $("#scroll-container").css("visibility", "visible");
}, function () {
    $("#scroll-container").css("visibility", "hidden");
}
);

//Variable to determine if the user is logged in, -1 if not, and index number corresponding to the user data otherwise
var loggedIn = -1;

//Handles the login thingy
$(".login").click(function () {
//Check if username exists
var temp = -1; //Temp storage of index
var x;//Loop var
var tempU = $("#uName").val();//Stores username input

//Check if username exists
for(x = 0; x < users.length; x++)
{
    if(users[x].username == tempU)
    {
         temp = x;
         break;
    }
}

//If username exists
if(temp != -1)
{
    //Check if password is correct
    if(users[temp].password == $("#passwordInput").val() && users[temp].password == $("#passwordConfirm").val())
    {
         $("#loginResponse").html("Logged in as " + users[temp].firstName + " " + users[temp].lastName);
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
         loggedIn = temp; //Confirm login
         temp = -1;
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
if(loggedIn != -1)
{
    $(".signed-out-message").hide();
    login(users[loggedIn]);
    $(".rightbar").css("display", "block");
    $(".reviewContainer").css("display", "block");
    $(".coursesContainer").css("display", "block");
    $(".searchContainer").css("left", "0px");
    $(".navbar-loginregister").html("Log Out");
}
});
});

