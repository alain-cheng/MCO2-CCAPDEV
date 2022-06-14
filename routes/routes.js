import { Router } from 'express';
import controller from '../controllers/controller.js';

const routes = Router();

routes.get('/', controller.getHome);
routes.get('/home', controller.getHome);
routes.get('/courses', controller.getCourses);
routes.get('/profs', controller.getProfs);
routes.get('/addPost', controller.addPost);
routes.get('/addCourse', controller.addCourse);
routes.get('/removeCourse', controller.removeCourse);

export default routes;