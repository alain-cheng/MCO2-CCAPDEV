import path from 'path';
import { fileURLToPath } from 'url';

import db from '../models/db.js';
import { Post } from '../models/schemas.js';
import { User } from '../models/schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const controller = {

    /*
        Use this to display the home page by sending an HTTP Get request.
    */
    getHome: (req, res) => {
        res.sendFile('pages/home.html', {root: __dirname});
    },

    /*
        Use this to display the courses page by sending an HTTP Get request.
    */
    getCourses: (req, res) => {
        res.sendFile('pages/courses.html', {root: __dirname});
    },

    /*
        Use this to display the profs page by sending an HTTP Get request.
    */
    getProfs: (req, res) => {
        res.sendFile('pages/profs.html', {root: __dirname});
    },

    /*
        Use this when a new user registers into the application
    */
    addUser: (req, res) => {

    },

    addPost: (req, res) => {

    },

    addCourse: (req, res) => {

    },

    removeCourse: (req, res) => {

    }
}

export default controller;