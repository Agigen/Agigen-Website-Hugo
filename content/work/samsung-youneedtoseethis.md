{
   "date": "2014-08-04T12:06:09+02:00",
   "title": "Samsung",
   "subtitle": "You need to see this app",
   "weight": 0,
   "featured": 1
}

<h2>tl;dr:</h2>
<ul>
    <li>Promote Samsung's Tab S</li>
    <li>Zoom, pan and interact with gigalpixel photograph and find all the details</li>
    <li>Using:</li>
    <ul>
        <li>AngularJS</li>
        <li>inuit.css</li>
        <li>HTML5</li>
        <li>Python</li>
    </ul>
</ul>

<h2>Background</h2>
<p>
    Early summer 2014 we got a call from our relative new partner Wenderfalck asking us if we wanted to collaborate on a project for Samsung. We said yes (of course) and together we created this technically challenging application to promote the new tablet Tab S.
</p>

<h2>What have we done?(!)</h2>
<p>
    The application is a game where the player is presented with a gigapixel photograph in which they can pan and zoom in a "google mapsy" kind of way. The player is then presented with a hundred items (one at a time) located somewhere in the picture, and the goal is to find them all in the shortest time possible. If an item is particularly hard and the user doesn't find it within 90 seconds, the user has an option to display a hint as to what area the item is in. At any time the user can enter their name to the high score, and their result is updated as they find more items.
</p>

<p>
    We did the whole technical solution using python, HTML, scss and of course a whole lot of javascript. We chose the angular framework and also took advantage of inuit.css. We had to rack our brains for all our combined image managing knowledge; each photograph in the application had a file size of several gigs; the largest around 15, making them impossible to save in any normal file format. We needed to tile the pictures at several different zoom levels for use in the application, so we manually had to divide them into pieces small enough to save as JPGs, and then run scripts on those files to divide them into tiles of 512x512px. It took a lot of time running those scripts!
</p>

<h2>Afterwards</h2>
<p>
    Client happy; we're happy. We're actually rather impressed with ourselves for creating something that works so well in just a few short weeks. So impressed and content with the result that we've put our image solution (tiling, zooming, panning, etc) up on our GitHub for all you guys out there who don't want to do this from scratch. We hope it'll be of some use!
</p>
