/* Prints the Homepage */
/*
    <div class="header-logo">
            <img src="public/LOGO.png" alt="DLSU PROF TO PICK LOGO">
        </div>
        
        <div class="navbar">
            <div class="navbar-contents">
                <a href="index.html"><button class="navbar-buttons">Home</button></a>
                <a href="pages/profs.html" target="_blank"><button class="navbar-buttons">Profs</button></a>
                <a href="pages/courses.html" target="_blank"><button class="navbar-buttons">Courses</button></a>
                <button class="navbar-loginregister">Login/Register</button>
            </div>
        </div>
*/

const load = {
    page: () => {
        $('body').append(`
            <div class="header-logo">
            <img src="public/LOGO.png" alt="DLSU PROF TO PICK LOGO">
            </div>
            
            <div class="navbar">
            <div class="navbar-contents">
                <a href="index.html"><button class="navbar-buttons">Home</button></a>
                <a href="pages/profs.html" target="_blank"><button class="navbar-buttons">Profs</button></a>
                <a href="pages/courses.html" target="_blank"><button class="navbar-buttons">Courses</button></a>
                <button class="navbar-loginregister">Login/Register</button>
            </div>
            </div>
        `);
    }
}

export default load;
