import { Router } from 'express';
import controller from '../controllers/controller.js';

const routes = Router();

routes.get('/', controller.getHome);
routes.get('/home', controller.getHome);
routes.get('/courses', controller.getCourses);
routes.get('/profs', controller.getProfs);
routes.get('/addPost', controller.addPost);

routes.get('/addUser', controller.addUser);
routes.get('/updatePost', controller.updatePost);
routes.get('/followCourse', controller.followCourse);
routes.get('/likePost', controller.likePost);
routes.get('/unlikePost', controller.unlikePost);
routes.get('/getCourseTable', controller.getCourseTable);
routes.get('/getCourseReviews', controller.getCourseReviews);
routes.get('/getProfProfiles', controller.getProfProfiles);
routes.get('/getProfReviews', controller.getProfReviews);

routes.get('/findCourse', controller.findCourse);
routes.get('/findCourses', controller.findCourses);
routes.get('/findCollege', controller.findCollege);
routes.get('/findColleges', controller.findColleges);
routes.get('/findUser', controller.findUser);
routes.get('/findUsers', controller.findUsers);
routes.get('/findPost', controller.findPost);
routes.get('/findPosts', controller.findPosts);
//routes.get('/findProf', controller.findProf);
//routes.get('/findProfs', controller.findProfs);

routes.get('/fillDB', controller.fillDB);
routes.get('/login', controller.login);

export default routes;
