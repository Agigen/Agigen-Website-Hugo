---
title: Build with Chrome behind the scenes
permalink: /blog/2012/06/build-with-chrome-behind-the-scenes/
date: "2012-06-26"
list_image: "bwc_backstage_320.jpg"
categories:
  - Backstage
---

We helped build this cool WebGL LEGO®/Google Maps thing, so I thought I&#8217;d talk for a bit about it.

<!--more-->

<img src="/img/blog/posts/2012/06/build.png" >

<img title="agigen-blog-header" alt="" src="/img/blog/posts/2012/06/agigen-blog-header1.png" />

What some other sites had to say about our project: <a title="Engadget" href="http://www.engadget.com/2012/06/26/lego-and-google-chrome-build-australia/" target="_blank">Engadget</a>, <a title="The Verge" href="http://www.theverge.com/2012/6/26/3117910/google-lego-simulator-build-with-chrome" target="_blank">The Verge</a>, <a title="Gizmodo" href="http://gizmodo.com/5921316/you-can-now-build-virtual-lego-in-chrome" target="_blank">Gizmodo</a>, <a title="Wired.co.uk" href="http://www.wired.co.uk/news/archive/2012-06/26/build-with-chrome-lego" target="_blank">Wired.co.uk</a>, <a title="Mashable" href="http://mashable.com/2012/06/26/google-lego-build/" target="_blank">Mashable</a>, <a title="DailyTech" href="http://www.dailytech.com/Google+Adds+8+Trillion+Virtual+Lego+Bricks+to+Chrome/article25029.htm" target="_blank">DailyTech</a>, <a title="The Next Web" href="http://thenextweb.com/shareables/2012/06/26/kiss-goodbye-to-your-productivity-google-just-brought-8-trillion-lego-blocks-to-chrome/" target="_blank">The Next Web</a>.

# Background

[Build with Chrome][1] is basically a Google Chrome and WebGL tech demo. The basic premise is to let users build whatever LEGO structures they want in a full 3D environment, using a baseplate that occupies a Google Maps tile. If you haven&#8217;t tried playing with it yet, go do so right now; at least for me, it turns out that playing with LEGO bricks is just as fun now as when I was 10 years old.

We got involved in the project as a subcontractor to [North Kingdom][2]. We&#8217;ve done some pretty cool stuff with them in the past; check out our cases.

<img class="size-full wp-image-54" title="Build with Chrome prototype" alt="" src="/img/blog/posts/2012/06/agigen-blog-prototype.png" />
Early prototype of the builder mode

# The application

We were responsible for the backend system, implementing North Kingdom&#8217;s front end designs, and hooking up various components to each other, while North Kingdom and freelancer [Mikael Emtinger][3] handled design work and WebGL programming (mostly done via [GLOW.js][4]).

The application structure is pretty simple: it consists of a handful of static HTML pages, a small RESTful API written in Python, and a humongous amount of JavaScript. There is no meaningful server-side generation of HTML templates going on; the entire thing is basically a JS application that uses AJAX requests to store and retrieve persistent data from the server. It&#8217;s hosted on Google App Engine for two reasons; scalability and simplicity. It&#8217;s really easy to build extremely scalable applications on the App Engine infrastructure, and it takes basically no effort at all to get going with a new project (which is very important when deadlines are looming). Pretty much the entire application was built in slightly over a month by about six full-time developers (three at Agigen, two at North Kingdom and one freelance).

# Lessons learned

Since one of the requirements was to use Google Maps tiles as baseplates, one of the first problems we had to solve was how to LEGO-ify a Google Maps image. In an early stage of the project, the plan was to LEGO-ify the entire map, and much time was spent discussing and testing how to make a LEGO-ified map look good and load quickly enough to make the experience decent for the user. The plan was eventually mostly scrapped, and it was decided to only make the 3D exploration mode (which you get if you zoom in far enough) LEGO-ified. We ended up with a very simple implementation that scales down each 256&#215;256 pixel Google Maps tile to 32&#215;32 (using nearest-neighbor sampling) and then reduces the color depth to a fixed 13-color palette. Fortunately for us, you can use the [Python Imaging Library (PIL)][5] on App Engine now, so this was pretty painless to do.

We also tossed around the idea of using topographical height data from the Google Maps API&#8217;s in order to make the baseplates &#8220;hilly&#8221;, but that plan was also scrapped; mostly for timing reasons, but also because the height data wasn&#8217;t really in a high enough resolution to make it interesting.

<img class="size-full wp-image-55" title="Builder with Chrome" alt="" src="/img/blog/posts/2012/06/agigen-blog-builder.png" />
Builder mode as it looks today


The next problem was to find a decent way to automatically give users free plots to build on in some semi-predictable manner. Sounds easy enough, but it gets more complicated when you have many users who want to build in the same area. Checking if a plot is free or not in a race-condition-safe manner is a somewhat expensive operation (requiring a database read), so you can&#8217;t do too many checks in a single request, or the user experience will be terrible. After some experimentation and poking around we found an old simple trick that suited us: each baseplate (map tile) is assigned an integer X/Y coordinate pair (counted from the northwestern corner of the map). The coordinate pair is bitwise interleaved to form a single number (called a Morton code), which is stored in memcache (with database backup), so it&#8217;s easy to increment or decrement atomically, forming a [Z-order curve][6]. Using a single number as a coordinate made it much easier and faster to look for free plots while keeping the assignment transaction safe.

We have also learned more about Google Maps (and more importantly what you cannot do with Google Maps) than we ever wanted to know. Among other things, it turns out that Google Maps ground overlays are really interesting creatures when they get so big that the curvature of the earth starts to matter; most of us have worked as web developers for our entire careers, which meant our math knowledge was severely rusty and not really up to the task of projecting flat images from onto the surface of an ellipsoid or deprojecting spheroid surface segments to flat images. We ended up scrapping that code path for other reasons, though.

# &#8220;Interesting&#8221; numbers

• Number of different coordinate systems used internally: 5 (latitude/longitude in WGS84 datum, Google Maps tile coordinates, Google Maps tile coordinates with the Y axis inverted, Morton code coordinates, &#8220;Spherical Mercator&#8221; metric coordinates (EPSG:3857))
• JS to Python code lines ratio: ~4.8:1 (~16550 lines of JS, 3400 lines of Python; both excluding third-party libraries other than GLOW)
• Number of real LEGO kits built during the development process: 4 (including the Death Star, see photo below)
• Number of dragons in the codebase: 3

Google&#8217;s official post about the project:<br>
<a title="http://google-au.blogspot.se/2012/06/build-bringing-lego-bricks-to-chrome.html" href="http://google-au.blogspot.se/2012/06/build-bringing-lego-bricks-to-chrome.html" target="_blank">http://google-au.blogspot.se/2012/06/build-bringing-lego-bricks-to-chrome.html</a>

<img class="size-full wp-image-63" title="Build with Chrome" alt="" src="/img/blog/posts/2012/06/agigen-blog-lego-irl.png" />
Research for the project (or just an excuse to build cool LEGO stuff)


 [1]: http://buildwithchrome.com/
 [2]: http://www.northkingdom.com/
 [3]: https://github.com/empaempa
 [4]: https://github.com/empaempa/GLOW
 [5]: http://www.pythonware.com/products/pil/
 [6]: http://en.wikipedia.org/wiki/Z-order_curve
