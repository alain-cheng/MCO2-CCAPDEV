# MCO2-CCAPDEV
Back-end development for DLSU Prof To Pick.

## Heroku Deployment
https://dlsuprof2pick.herokuapp.com/

## Modules Installed
- **dotenv**
- **express**
- **express-handlebars**
- **mongodb**
- **mongoose**
- **path**
- **url**

## Project Folders
- [`controllers`](controllers) - Contains the functions to retrieve and manipulate database contents, and functions in displaying web pages.
- [`misc`](misc) - Contains dev notes.
- [`models`](models) - Contains database functions and schemas, don't need to edit this section much.
- [`pages`](controllers/pages) - **Replacement** for hbs /view folder, Javascript files that will print out page contents to the document.
- [`public`](public) - random text.
- [`routes`](routes) - Handles navigation bar routing and post functions routing.
- *views* - Meant to contain .hbs files, use **[pages](pages)** instead.
