import db from '../models/db.js';
import path from 'path';
import { Post } from '../models/schemas.js';
import { User } from '../models/schemas.js';

const controller = {

    /*
        Use this to display the home page by sending an HTTP Get request.
        This should display home.js 
    */
    getHome: (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>DLSU | Prof To Pick</title>
                <script src="https://code.jquery.com/jquery-3.4.1.min.js" type="text/javascript"></script>
                <script type="text/javascript" src="/js/main.js"></script>
                <link rel="stylesheet" href="/css/main.css">
            </head>
            <body>
                <p> This is the Home page </p>
            </body>
            </html>
        `);
        //res.sendFile('main.html');
        res.end();
    },

    getCourses: (req, res) => {

    },

    getProfs: (req, res) => {

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