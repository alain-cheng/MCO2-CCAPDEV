import path from 'path';
import { fileURLToPath } from 'url';

import db from '../models/db.js';
import collection from '../models/schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const controller = {

    /*
        Use this to display the home page by sending an HTTP GET.
    */
    getHome: (req, res) => {
        res.sendFile('pages/home.html', {root: __dirname});
    },

    /*
        Use this to display the courses page by sending an HTTP GET.
    */
    getCourses: (req, res) => {
        res.sendFile('pages/courses.html', {root: __dirname});
    },

    /*
        Use this to display the profs page by sending an HTTP GET.
    */
    getProfs: (req, res) => {
        res.sendFile('pages/profs.html', {root: __dirname});
    },

    /*
        Use this when a new user registers into the application.
        Use HTTP POST method.
    */
    addUser: (req, res) => {

    },

    /*
        Use when submitting a post review.
        Use HTTP POST method 
    */
    addPost: (req, res) => {

    },

    followCourse: (req, res) => {

    },

    unfollowCourse: (req, res) => {

    },

    likePost: (req, res) => {

    },

    unlikePost: (req, res) => {

    },

    /*=====================================================*/
    /*   Functions below to retrieve documents from the db.
    /*   Responds with document objects.
    /*   Use HTTP GET requests for funcs below.
    /*=====================================================*/

    /* Use to find a course; Uses collegeid to find*/
    findCourse: (req, res) => {
        db.findOne(collection['courses'], {
            collegeid: req.query['collegeid']
        }, null, (result) => {
            console.log("findCourse result", result);
            res.send(result);                           // Sends the course document found as a response                    
        });
    },

    /* Plural version of findCourse; Uses collegeid to find */
    findCourses: (req, res) => {
        db.findMany(collection['courses'], {
            collegeid: req.query['collegeid']
        }, null, (result) => {
            console.log("findCourses result", result);
            res.send(result);
        });
    },

    /* Find a college; Uses id to find */
    findCollege: (req, res) => {
        db.findOne(collection['colleges'], {
            id: req.query['id']
        }, null, (result) => {
            console.log("findCollege result", result);
            res.send(result);
        });
    },

    /* Find colleges; Uses id to find */
    findColleges: (req, res) => {
        db.findMany(collection['colleges'], {
            id: req.query['id']
        }, null, (result) => {
            console.log("findColleges result", result);
            res.send(result);
        });
    },

    /* Find a user; Uses username to find */
    findUser: (req, res) => {
        db.findOne(collection['users'], {
            username: req.query['username']
        }, null, (result) => {
            console.log("findUser result", result);
            res.send(result);
        });
    },

    /* Find users; Uses username to find */
    findUsers: (req, res) => {
        db.findMany(collection['users'], {
            username: req.query['username']
        }, null, (result) => {
            console.log("findUsers result", result);
            res.send(result);
        });
    },
    
    /* Find a post; Uses id to find */
    findPost: (req, res) => {
        db.findOne(collection['posts'], {
            id: req.query['id']
        }, null, (result) => {
            console.log("findPost result", result);
            res.send(result);
        });
    },

    findPosts: (req, res) => {
        db.findOne(collection['posts'], {
            id: req.query['id']
        }, null, (result) => {
            console.log("findPosts result", result);
            res.send(result);
        });
    }
}

export default controller;