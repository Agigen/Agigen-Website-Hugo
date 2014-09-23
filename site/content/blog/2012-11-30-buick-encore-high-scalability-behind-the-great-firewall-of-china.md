---
title: 'Buick Encore: high scalability behind the Great Firewall of China'
permalink: /blog/2012/11/buick-encore-high-scalability-behind-the-great-firewall-of-china/
date: "2012-11-30"
list_image: "buickencore_320.jpg"
categories:
  - Backstage
tags:
  - mongodb
  - python
  - tornado
---

Buick Encore is a mobile augmented reality game, and we created the serverside part running on a Python stack behind the Great Firewall of China.

<!--more-->


Buick Encore is a mobile augmented reality game, created by us, Monterosa and Ogilvy Shanghai; we were responsible for the server-side backend part of the game, while Monterosa developed the iPhone and Android apps and Ogilvy was responsible for the game design and overall project management.

<img src="/img/blog/posts/2012/11/BuickEncore.jpg" >


The game idea revolves around a virtual car which is placed somewhere in a big Chinese city. Using their smartphone, the players can see an approximate location of this car, as well as the positions of other players, on a standard map. When they get close enough to the car, its exact location appears, they rotate their phone to portrait mode and an augmented reality view which shows the car blended into the real world appears. They can now &#8220;get in&#8221; the car and &#8220;drive it&#8221; for up to three minutes; at any time while they&#8217;re &#8220;driving&#8221; they can &#8220;get out&#8221; of the car and leave it at their current location. The purpose of the game is to find the car and then hide it; at the end of the gaming day, whoever managed to hide the car for the longest period of time wins.



[Hide & Seek presentation video][3] from [saschaengel_china works][4] on [Vimeo][5].

User login can be done either with [Sina Weibo][6] (a Chinese social media platform) or just a regular e-mail address, and the backend can send push notifications to users using [Urban Airship&#8217;s][7] excellent service.

On the server side, we had to keep track of a rather large amount of real-time data, since both the car&#8217;s position and the position of each individual player are updated quite frequently and retained for a relatively long period of time. Each datapoint is rather small, but there are a lot of them per player and they accumulate quickly. Normally, this kind of application with frequent updates and frequent requests for updates from the clients would be very well suited to hosting on Google App Engine. In this case, however, we chose to not use App Engine, primarily because Google does not have a data center in China, and latencies to anything outside the Great Firewall are terrible. The customer was also worried about the potential for getting the application suddenly blocked. Hence, we rolled our own solution.

After some experiments with various technologies (such as REDIS, twisted.web and gevent), our server side backend ended up being written in Python, using:

Tornado&#8217;s ioloop<br>
MongoDB, using the asyncmongo Python API<br>
memcache<br>
nginx as a frontend<br>
Stingray for load balancing<br>
Twitter Bootstrap for the admin interface

Since the customer was extremely worried about latency and scalability, we did quite extensive performance tests at an early stage to get a general idea of how much raw performance we could possibly squeeze out of a single server. Based on this we ended up ditching many of Tornado&#8217;s conveniences and wrote our own simplistic request handling framework. For interacting with MongoDB, we chose the asyncmongo module in order to avoid blocking our Tornado threads on I/O.

The entire application is hosted on a set of virtual machines at [Datapipe&#8217;s][8] Shanghai datacenter. We evaluated several hosting solutions before choosing Datapipe; the customer requirement that all machines must be hosted inside mainland China disqualified many options, and in the end Datapipe&#8217;s convenient cloud solution and English-speaking customer service won out.

Since this technology stack (referred to by a certain hosting salesperson we spoke to as &#8220;the hipster stack&#8221;) was mostly unfamiliar to us before this project, we had a lot of interesting lessons to learn, the most important one being that creating web application backends using a completely callback-driven framework is sort of a pain and requires some careful design and planning in order to avoid a massive mess of spaghetti function calls. Most of us haven&#8217;t done much serious functional programming since the university courses in it, so this provided a handy refresher course involving things like partials, closures and other such fun.

<img title="Buick Encore admin interface" alt="" src="/img/blog/posts/2012/11/buick1.jpg" />The Buick encore admin interface

Working with MongoDB in particular has been an interesting experience. It&#8217;s certainly very fast and ended up working quite well for our purposes, but we don&#8217;t think we&#8217;d choose it again for the next project, since it&#8217;s simply too tedious to work with. It&#8217;s certainly not all bad, but there are a number of small grating issues that makes it feel very rough to handle, at least to someone used to the NDB API of Google&#8217;s High Replication Datastore. A lot of this is related to the API we used to interact with the database: I feel a callback-driven async model is much harder to work with than the futures-based model the NDB API uses, but this also has to do with the fact that on App Engine it&#8217;s not a problem to block a thread for a few hundred milliseconds since other threads can use the same instance while you&#8217;re waiting. However, MongoDB itself also has quite a few minor irritations, particularly related to the generally hairy query syntax.

Tornado on the other hand has generally been pretty smooth to work with. It&#8217;s quite easy to roll your own request handling stuff based on its powerful ioloop functionality, but even if you don&#8217;t want to do that, the request handlers it ships with are well designed and polished. Our old friends nginx and memcache are nothing new, of course; there&#8217;s a reason we keep using them everywhere.

More about the project:
[Monterosa&#8217;s case page][9]
[Monterosa press release][10]

 [1]: http://monterosa.se
 [2]: http://www.ogilvy.com/
 [3]: http://vimeo.com/49539651
 [4]: http://vimeo.com/user8087696
 [5]: http://vimeo.com
 [6]: http://www.weibo.com/
 [7]: http://urbanairship.com/
 [8]: http://www.datapipe.com/
 [9]: http://monterosa.se/work/buick-hide-and-seek/
 [10]: http://www.mynewsdesk.com/sg/pressroom/monterosa/pressrelease/view/buick-plays-hide-seek-in-china-800454
