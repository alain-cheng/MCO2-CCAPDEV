import 'dotenv/config';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import exphbs from 'express-handlebars';

import { connectToMongo } from './db/conn.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();


app.use(express.static(__dirname + '/public'));    // set /public as our static folder

app.engine('hbs', exphbs.engine({                  // set handlebars as the view engine
    extname: 'hbs'
}));
app.set("view engine", 'hbs');                     // set default extension as .hbs
app.set('views', './views');                       // set director for views
app.set("view cache", false);                      // disable caching