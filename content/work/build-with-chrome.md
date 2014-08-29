{
   "date": "2014-08-02T16:15:51+02:00",
   "title": "Build with Chrome",
   "featured": 1
}

<h2>tl;dr:</h2>
<ul>
    <li>Awesome Google + LEGO project</li>
    <li>Build whatever you want with LEGO, wherever you want in the world</li>
    <li>Using:</li>
    <ul>
        <li>Google Maps</li>
        <li>Google+</li>
        <li>HTML5</li>
        <li>SCSS</li>
        <li>Tons of Javascript</li>
        <li>Our own awesome translation tool</li>
        <li>Python</li>
    </ul>
</ul>

<h2>Background</h2>

<p>
    By now, Build with Chrome is one our longest running projects. It started in early 2012 when LEGO celebrated 50 years in the land down under, and our partners in crime over at North Kingdom tasked us with making Australia into LEGO-bricks. Said and done, in June that same year, (mainly) Aussies started littering their continent with fantastic LEGO creations and it was a pretty sweet feeling watching the intricate buildings and crazy creatures.
</p>

<p>
    A year later it was go again; BWC was going global, the experience was getting a few new features and the designs were updated. Once again we worked closely with North Kingdom who came up with a concept of a game mode, where the goal was to become a Master Builder. BWC v2 was released as promotion both for the webGL capacities in Google Chrome as well as the new LEGO the Movie feature film.
</p>


<h2>What have we done?(!)</h2>

<p>
    The application is loosely divided into four different sections: Build mode, Explore mode, Academy mode and CMS for the LEGO people to keep an eye on all the creations.
</p>

<h3>Explore mode</h3>
<p>
    Entering the Explore mode the user is shown a view of their current geographic location, populated with markers to indicate where people have built their LEGO-structures. Using a zoom control, the user can zoom in on any geographic spot to view the creations in webGL 3D. We used Google Maps' API to present the world, where each tile of from the API equaled one baseplate - the unit each user is given upon entering Build mode. Users can either specifically select a base plate in 3D mode, or get one randomly assigned based on their geographical location. We did HTML-templates, javascript, CSS and API integrations.
</p>

<p>
    The application uses Google+ authentication so users who sign in can view builds created by people in their circles and revisit builds they've liked using the +1 feature.
</p>

<h3>Build mode</h3>
<p>
    In Build mode the user is presented with their chosen baseplate on which they are free to create whatever they want with a bunch of LEGO-bricks in different shapes and colours. We were responsible for the UI; rotating bricks, changing colour and brick types, saving and publishing. We worked closely with programmers at NK who did the actual webGL code, while we created HTML-templates, CSS and AJAX API calls to save peoples builds.
</p>

<h3>Academy mode</h3>
<p>
    Academy consists of a series of challenges of increasing difficulty. The user is to follow a set of instructions (much as in a building with regular LEGO), learning a number of different building techniques, eventually gaining the title of Master builder.
</p>

<h3>CMS</h3>
<p>
    LEGO needed to be able to remove inappropriate content, which is why we created a flagging system accessible from Explore mode. In the CMS the moderators can review all builds created, and work through the ones that have been flagged by users of the application. There is also some statistics and a whole section to translate the whole application to an unlimited number of languages (currently the application is available in 27 languages).
</p>

<h2>Afterwards</h2>
<p>This project cannot be called anything other than a success; at the time of writing there are 678 394 different builds in the Build with Chrome world and the site has had literally millions of visitors.</p>
<p>We learned lots.</p>
<p>As the grande finale of the project we all went to the cinemas and saw LEGO the Movie.</p>
