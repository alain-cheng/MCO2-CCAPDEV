/* 
    You can use this file for the exclusive functionalities of the profs.html page like displaying
    all professors from the database.

    If you plan on using this file, you might want to include to import the main.js script from
    the profs.html for the css stylings written in the script, which should look something like this:

    <head>
        <script type="text/javascript" src="/js/main.js"></script>
        <script type="text/javascript" src="/js/profs.js"></script>
    </head>
*/
$(document).ready(function () {
    // place functions in here

    $.get("/findProf", {
        filter: {
             firstName: 'Nicole',
             lastName: 'Zefanya',
        }
   }).then((user) => {
        currentUser = user;
        login(currentUser);
   });

   console.log()
});


