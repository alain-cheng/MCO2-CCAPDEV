import path from 'path';
import { fileURLToPath } from 'url';

import db from '../models/db.js';
import collection from '../models/schemas.js';
import { User , Course, College, Post, Profs} from '../models/schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const controller = {

    /*
        Use this to display the home.html page by sending an HTTP GET.
    */
    getHome: (req, res) => {
        res.sendFile('pages/home.html', {root: __dirname});
    },

    /*
        Use this to display the courses.html page by sending an HTTP GET.
        Not to be confused with findCourses function.
    */
    getCourses: (req, res) => {
        res.sendFile('pages/courses.html', {root: __dirname});
    },

    /*
        Use this to display the profs.html page by sending an HTTP GET.
    */
    getProfs: (req, res) => {
        res.sendFile('pages/profs.html', {root: __dirname});
    },

    /*
        Use this when a new user registers into the application.
    */
    addUser: (req, res) => {
        // db.insertOne(collection['users'], req.query['document'], (callback) => {
        //     console.log(callback);
        // });

        collection['users'].create({
            firstName: req.query['firstName'],
            lastName: req.query['lastName'],
            degree: req.query['degree'],
            degreeCode: req.query['degreeCode'],
            college: req.query['college'],
            batch: req.query['batch'],
            username: req.query['username'],
            password: req.query['password'],
            img: "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg",
            followedCourses: [],
            likedPosts: []
        });
    },

    /*
        Use when submitting a post review.
    */
    addPost: (req, res) => {
        // db.insertOne(collection['posts'], req.query['data'], (result) => {
        //     //console.log('result:', result);
        // });

        collection['posts'].create({
            id: req.query['id'],
            reviewForFN: req.query['reviewForFN'],
            reviewForLN: req.query['reviewForLN'],
            reviewCourse: req.query['reviewCourse'],
            reviewTerm: req.query['reviewTerm'],
            reviewRating: req.query['reviewRating'],
            reviewText: req.query['reviewText'],
            posterNameFN: req.query['posterNameFN'],
            posterNameLN: req.query['posterNameLN'],
            posterPfp: req.query['posterPfp'],
            posterDegCode: req.query['posterDegCode'],
            posterCollege: req.query['posterCollege'],
            likesNum: req.query['likesNum']
        }).then(res => {
            console.log('post result', res);
        }).catch(err => {
            console.log('error on post', err);
        });
    },

    updatePost: (req, res) => {
        db.updateOne(collection['posts'], req.query['filter'], req.query['update'], (result) => {
            //console.log('result:', result);
        });
    },

    /*
        Use when user presses the follow button on a course.
        Use HTTP GET method.
    */
    followCourse: (req, res) => {
        db.updateOne(collection['users'], req.query['filter'], req.query['update'], (result) => {
            //console.log('result:', result);
        });
    },

    /*
        Use when user presses the like button on a post
        Use HTTP GET method
    */
    likePost: (req, res) => {
        db.updateOne(collection['users'], req.query['filter'], req.query['update'], (result) => {
             //console.log('result:', result);
        });

        let postid = req.query['update']['$addToSet']['likedPosts'];
        console.log(postid)

        db.updateOne(collection['posts'], {
            id: postid
        }, {
            $inc: { likesNum: 1 }
        }, (result) => {
        
        });
    },

    unlikePost: (req, res) => {
        db.updateOne(collection['users'], req.query['filter'], req.query['update'], (result) => {
            //console.log('result:', result);
       });

       let postid = req.query['update']['$pull']['likedPosts'];
       console.log(postid)

        db.updateOne(collection['posts'], {
            id: postid
        }, {
            $inc: { likesNum: -1 }
        }, (result) => {
            
        });
    },

    /*
        @param req - request object; this is where the URL passed from main.js through the FETCH API is going to be stored
        @param res - response object; this is what getCourseTable is eventually going to give back to main.js
        @ let id - the ID of the 'event' from main.js is going to be queried and stored here
        @ let table - HTML code for the first portion of the course table in String format
        @ let newRow - where new rows of the 'table' String will be stored; its value will always change via a for-loop
        @ let courses - where all of the course documents from the database will be stored
    */

    getCourseTable: (req, res) => {
        console.log("GET: /getCourseTable");
        let id = req.query.collegeid;
        let table = 
                `   <br>
                    <table id="course-table">
                    <th colspan="2">COURSE NAME</th>
                    <th>Units</th>
                `;
        let newRow;
        let courses;

        /* We use the find() function of MongoDB to get all of the courses recorded in the database
            @param {collegeid:{$eq:id}} - "get all courses with the 'collegeid' equal to 'id'"
                                            - The collegeid field in the Courses database tells you what college it belongs to
                                                1 - CLA
                                                2 - COS
                                                3 - GCOE
                                                4- RVCOB
                                                5- SOE
                                                6 - BAGCED
                                                7 - CCS
                                                8 - GE subject
            @param "coursename coursecode units collegeid" - this is the "projection" parameter; this tells mongodb what parts of the courses documents that we want
            @param function(err, result) - the callback function; this is where all of the processing is going to happen
        */
        Course.find({collegeid:{$eq:id}}, "coursename coursecode units collegeid", function(err, result){
            if (err) {
                console.error(err);
            }
            else {
                courses = result;
                console.log("Courses gathered: ");
                console.log("---------------------");
                console.log(courses);
                console.log("---------------------");

                // a new table row (<tr> ... </tr) HTML string is going to be written and concatenated to the main 'table' string for every iteration of the for-loop
                for(let i = 0; i < courses.length; i++){
                    //id='${courses[i].collegeid}' name='${courses[i].coursecode}
                    newRow = 
                    `  
                        <tr class='${courses[i].coursecode}${courses[i].collegeid}'>
                            <td width="108">${courses[i].coursecode}</td>
                            <td width="402">${courses[i].coursename}</td>
                            <td style="text-align: center;" width="114">${courses[i].units}</td>
                        </tr>
                    `;
                    table = table.concat(newRow);
                }
                table = table.concat("</table>"); // once all the rows are written, the "</table" string is concatenated to end the table
                console.log(table);

                res.status(200).send({
                    message: table //getCourseTable sends back the 'table' string to main.js along with a status code of 200 (OK)
                });
            }
        });
    },

    /*
        @param req - request object; this is where the URL passed from main.js through the FETCH API is going to be stored
        @param res - response object; this is what getCourseTable is eventually going to give back to main.js
        @let code - the course code gathered from the URL sent by main.js
        @let reviewsContainer - HTML string of the first portion of the course reviews
        @let newMainPost - where HTML strings of new mainpost divs will be stored
        @let reviews - where Post documents from the database will be stored
        @let stars - the number of stars of a certain review post; this is going to come from the database
        @let starsString - the actual star characters; note that "<meta charset="UTF-8">" is needed in courses.html to make it appear in the webpage (it's already there, don't worry)
        @let starsLegend - the meaning of the number of star characters (i.e., "Excellent", "DO NOT TAKE")
        In terms of how it works, this function is nearly identical to getCourseTable. The only difference is that a switch case is executed for each for-loop iteration to determine
        the number of star characters and star legend to be printed on the webpage.
    */

    getCourseReviews: (req, res) => {
        console.log("GET: /getCourseReviews");
        let code = req.query.coursecode;
        let reviewsContainer = 
        `
            <div class="coursePostContainer">
        `
        let newMainPost;
        let reviews;
        let stars
        let starsString;
        let starsLegend;
        let sendBack;

        Post.find({reviewCourse:{$eq:code}}, function(err, result){
            if(err){
                console.error(err);
            }
            else {
                reviews = result;
                console.log(`Reviews gathered for ${code}`);
                console.log("---------------------");
                console.log(reviews);
                console.log("---------------------");

                if(Object.entries(reviews).length === 0){
                    console.log("no reviews");
                    sendBack = `No reviews were found for ${code}`;
                }
                else {
                    console.log("review found");
                    for(let i = 0; i < reviews.length; i++){
                        stars = reviews[i].reviewRating;
                        switch (stars) {
                            case 1:
                                    starsString = "★";
                                    starsLegend = "DO NOT TAKE";
                                    break;
                            case 2:
                                    starsString = "★★";
                                    starsLegend = "Poor";
                                    break;
                            case 3:
                                    starsString = "★★★";
                                    starsLegend = "Average";
                                    break;
                            case 4:
                                    starsString = "★★★★";
                                    starsLegend = "Good";
                                    break;
                            case 5:
                                    starsString = "★★★★★";
                                    starsLegend = "Excellent";
                                    break;
                        }
    
                        newMainPost = 
                        `
                        <div class="mainpost">
                            <div class="mp-header">
                                <div class="mp-header-left">
                                    Review For:
                                </div>
                                <div class="mp-header-middle">
                                    <div class="mp-header-middle-top">${reviews[i].reviewForFN} ${reviews[i].reviewForLN}</div>
                                    <div class="mp-header-middle-bottom">${reviews[i].reviewCourse} | ${reviews[i].reviewTerm}</div>
                                </div>
                            </div>
                            <div class="mp-review">
                                <div class="mp-review-stars">
                                    ${starsString}
                                </div>
                                <div class="mp-rev-description">
                                    ${starsLegend}
                                </div>
                            </div>
                            <div class="mp-review-box">
                                ${reviews[i].reviewText}
                            </div>
                            <div class="mp-subheader">
                                <img class="mp-subheader-pic" src="${reviews[i].posterPfp}" alt="pic">
                                <div class="mp-subheader-left">
                                    <div class="mp-subheader-left-top">
                                        ${reviews[i].posterNameFN} ${reviews[i].posterNameLN}
                                    </div>
                                    <div class="mp-subheader-left-bottom">
                                        ${reviews[i].posterDegCode} | ${reviews[i].posterCollege}
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                        reviewsContainer = reviewsContainer.concat(newMainPost);
                    }
                    reviewsContainer = reviewsContainer.concat("</div>"); // "</div>" is concatenated to end the div
                    console.log(reviewsContainer);
                    sendBack = reviewsContainer;
                }

                res.status(200).send({
                    message: sendBack //sends the reviewsContainer string to main.js along with a status code of 200 (OK)
                });
            }
        });
    },

    getProfProfiles: (req, res) => {
        console.log("GET: /getProfProfiles");
        let id = req.query.collegeid;
        let profsList = "";
        let newProfRow ="";
        let containers = "";
        let newProfContainer = "";
        let index = 0;
        let profs;
        let rowCount;
        let documentsCount;
        let documentsLeft;
        let documentsToProc;
        let count;

        Profs.find({collegeid:{$eq:id}}, function(err, result){
            if(err) {
                console.error(err);
            }
            else {
                profs = result;
                documentsCount = profs.length;
                rowCount = Math.floor(documentsCount/4)
                console.log("Prof profiles gathered");
                console.log("---------------------");
                console.log("Number of gathered documents: " + documentsCount);
                console.log("Number of rows to be produced: " + rowCount);
                console.log(profs);
                console.log("---------------------");

                for(let i = 0; i < documentsCount; i++) {
                    console.log("value of i: " + i)
                    if((i%4) == 0) {
                        if(i >= 4) {
                            console.log("   block 1")
                            newProfRow = newProfRow.concat(containers);
                            newProfRow = newProfRow.concat("</div>");
                            newProfRow = newProfRow.concat(`                            <div class="prof-row">`);
                            containers = "";
                        }
                        else {
                            console.log("   block 2")
                            newProfRow = newProfRow.concat(`                            <div class="prof-row">`);
                        }
                    }
                    
                    newProfContainer = 
                        `
                            <!-- ##### ${i} #### -->
                            <div class="prof-container">
                                <div class="prof-image-container">
                                    <img class="prof-image" src="${profs[i].img}" alt="profpic">
                                    <div class="image-overlay" id="${profs[i].firstName} ${profs[i].lastName}">
                                        <div class="overlay-text">See Reviews</div>
                                    </div>
                                </div>
                                
                                
                                <div class="prof-namebar">${profs[i].firstName} ${profs[i].lastName}</div>
                                <div class="prof-info">${profs[i].position}</div>
                                <div class="prof-info">${profs[i].department}</div>

                                <div class="prof-creds">${profs[i].degree}</div>
                                <div class="prof-creds">${profs[i].college} (${profs[i].gradYear})</div>
                                <div class="prof-creds">Teaching Experience - ${profs[i].expYears} years</div>

                                <div class="prof-rating-container">${profs[i].avgRating}</div>
                            </div>
                            <!-- #################### -->
                        `;
                    containers = containers.concat(newProfContainer);
                }
                newProfRow = newProfRow.concat(containers);
                newProfRow = newProfRow.concat("</div>");
                console.log(newProfRow);

                res.status(200).send({
                    message: newProfRow
                });

            }
        });
    },

    getProfReviews: (req, res) => {
        console.log("GET: /getProfReviews");
        let fname = req.query.fname;
        let lname = req.query.lname;
        let reviewsContainer = 
        `
            <div class="coursePostContainer">
        `
        let newMainPost;
        let reviews;
        let stars
        let starsString;
        let starsLegend;
        let sendBack;

        Post.find({reviewForFN:{$eq:fname}, reviewForLN:{$eq:lname}}, function(err, result){
            if(err){
                console.error(err);
            }
            else {
                reviews = result;
                console.log(`Reviews gathered for ${fname} ${lname}`);
                console.log("---------------------");
                console.log(reviews);
                console.log("---------------------");

                if(Object.entries(reviews).length === 0){
                    console.log("no reviews");
                    sendBack = `No reviews were found for ${fname} ${lname}`;
                }
                else {
                    console.log("reviews found");
                    for(let i = 0; i < reviews.length; i++){
                        stars = reviews[i].reviewRating;
                        switch (stars) {
                            case 1:
                                    starsString = "★";
                                    starsLegend = "DO NOT TAKE";
                                    break;
                            case 2:
                                    starsString = "★★";
                                    starsLegend = "Poor";
                                    break;
                            case 3:
                                    starsString = "★★★";
                                    starsLegend = "Average";
                                    break;
                            case 4:
                                    starsString = "★★★★";
                                    starsLegend = "Good";
                                    break;
                            case 5:
                                    starsString = "★★★★★";
                                    starsLegend = "Excellent";
                                    break;
                        }
    
                        newMainPost = 
                        `
                        <div class="mainpost">
                            <div class="mp-header">
                                <div class="mp-header-left">
                                    Review For:
                                </div>
                                <div class="mp-header-middle">
                                    <div class="mp-header-middle-top">${reviews[i].reviewForFN} ${reviews[i].reviewForLN}</div>
                                    <div class="mp-header-middle-bottom">${reviews[i].reviewCourse} | ${reviews[i].reviewTerm}</div>
                                </div>
                            </div>
                            <div class="mp-review">
                                <div class="mp-review-stars">
                                    ${starsString}
                                </div>
                                <div class="mp-rev-description">
                                    ${starsLegend}
                                </div>
                            </div>
                            <div class="mp-review-box">
                                ${reviews[i].reviewText}
                            </div>
                            <div class="mp-subheader">
                                <img class="mp-subheader-pic" src="${reviews[i].posterPfp}" alt="pic">
                                <div class="mp-subheader-left">
                                    <div class="mp-subheader-left-top">
                                        ${reviews[i].posterNameFN} ${reviews[i].posterNameLN}
                                    </div>
                                    <div class="mp-subheader-left-bottom">
                                        ${reviews[i].posterDegCode} | ${reviews[i].posterCollege}
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                        reviewsContainer = reviewsContainer.concat(newMainPost);
                    }
                    reviewsContainer = reviewsContainer.concat("</div>"); // "</div>" is concatenated to end the div
                    console.log(reviewsContainer);
                    sendBack = reviewsContainer;

                }

                res.status(200).send({
                    message: sendBack
                });
            }
        });
    },

    /*=====================================================*/
    /*   Functions below to retrieve and manipulate documents from the db.
    /*   Responds with document objects.
    /*   Use HTTP GET requests for funcs below.
    /*=====================================================*/

    /* Use to find a course */
    findCourse: (req, res) => {
        db.findOne(collection['courses'], req.query['filter'], req.query['projection'], (result) => {
            //console.log("findCourse result", result);
            res.send(result);                           // Sends the course document found as a response                    
        });
    },

    /* Plural version of findCourse */
    findCourses: (req, res) => {
        db.findMany(collection['courses'], req.query['filter'], req.query['projection'], (result) => {
            //console.log("findCourses result", result);
            res.send(result);
        });
    },

    /* Find a college */
    findCollege: (req, res) => {
        db.findOne(collection['colleges'], req.query['filter'], req.query['projection'], (result) => {
            //console.log("findCollege result", result);
            res.send(result);
        });
    },

    /* Find colleges */
    findColleges: (req, res) => {
        db.findMany(collection['colleges'], req.query['filter'], req.query['projection'], (result) => {
            //console.log("findColleges result", result);
            res.send(result);
        });
    },

    /* 
        Find a user; Use this for logging in.
    */
    findUser: (req, res) => {
        db.findOne(collection['users'], req.query['filter'], req.query['projection'], (result) => {
            //console.log("findUser result", result);
            res.send(result);
        });
    },

    /* Find multiple users*/
    findUsers: (req, res) => {
        db.findMany(collection['users'], req.query['filter'], req.query['projection'], (result) => {
            //console.log("findUsers result", result);
            res.send(result);
        });
    },
    
    /* Find a post */
    findPost: (req, res) => {
        db.findOne(collection['posts'], req.query['filter'], req.query['projection'], (result) => {
            //console.log("findPost result", result);
            res.send(result);
        });
    },

    findPosts: (req, res) => {
        db.findMany(collection['posts'], req.query['filter'], req.query['projection'], (result) => {
            //console.log("findPosts result", result);
            res.send(result);
        });
    },

    login: (req, res) => {
        var params = new URLSearchParams(req.url.substring("/login?".length));
        console.log(params.get("username"));
    },

    
    // fillDB: (req, res) => {
    //     // NOTE: for some reason, the console.logs of all code below don't work for some reason but the data is added to the database when you check MongoDBCompass
    //     /* TODO */
    //     //Async communication with DB
    //     fillDB();
    //     async function fillDB()
    //     {
    //         //Relocated to server.js
    //     }
    // }
}

export default controller;