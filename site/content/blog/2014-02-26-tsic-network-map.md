---
title: TSIC Network Map
permalink: /blog/2014/02/tsic-network-map/
date: "2014-02-26"
list_image: "tsic_320.jpg"
categories:
  - Work
---
Through the agency Hilanders we were put on the job to build the backend and frontend of TeliaSoneras Network Map &#8211; a whirlpool of connections, IPX landlines and to show the strength and capabailites of the TeliaSonera IC network.
<!--more-->

<img src="/img/blog/posts/2014/02/tsic2.jpg" >


For eons in the past, TeliaSonera showed their gigantic network on nothing other than an old Flash-based animated map. Simple drag & drop and no admin but a huge, un-organized XML file. That had to change. The best approach would be to implement a solid, all-device-friendly map with a strong API &#8211; so that&#8217;s what we did, and of course we did it with Google Maps. By changing colours and style of the inherited Google Maps stylesheet through JSON we could replicate the TeliaSonera brand into Google Maps, all while building a fancy UI to also go seamlessly with the map in the background.

# Frontend

<img alt="tsicmap" src="/img/blog/posts/2014/02/tsicmap.png" />

Coming from a very 3D-esque map in the past, TeliaSonera now wanted (understandably) a new, fresh looking flat design. By working with concepts from Hilanders and the wishes of TeliaSonera we came up with the final design that can be seen live on <http://www.teliasoneraicmap.com/>.

# Backend

The backend was made with Google App Engine, and we won&#8217;t lie &#8211; it was quite the hassle to get all the different points to connect properly through a massive network of Metro points, sub-metro points, normal points&#8230; alot of points.

The Google Maps API helped alot with different functions already available for drawing lines across the map and placing images ontop of certain cordinates &#8211; an API we&#8217;re well accustomed to by now.

&nbsp;

The site is currently live at <http://www.teliasoneraicmap.com/>. Check it out!
