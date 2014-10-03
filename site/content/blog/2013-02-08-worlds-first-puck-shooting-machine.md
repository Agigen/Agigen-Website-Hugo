---
title: "World's first web-based puck shooting machine"
permalink: /blog/2013/02/worlds-first-puck-shooting-machine/
date: "2013-02-08"
list_image: "hockeymachine_320.jpg"
categories:
  - Backstage
tags:
  - AppEngine
  - Arduino
  - Javascript
  - python
---
For the Oddset Hockey Games, in cooperation with The Viral Company, Paramecanic and Svenska Spel we built a web application to remote control a machine that shoots hockey pucks at a live goalkeeper.

<!--more-->

<img title="head" alt="" src="/img/blog/posts/2013/02/head.jpg" />

For this campaign, the puck shooting machine resides in a booth at the Oddset Hockey Games, together with a goal and a human goalkeeper. Users can come up to the booth and direct the machine from an iPad, or they can queue up on the web site and wait for their turn to control the machine over the internet. On the web site, users can spectate the shots from thee different angles using three live camera feeds. One user at a time controls the machine; users on location at the booth have a higher queue priority than users on the internet. Each user gets three shots; if they hit the last shot they can continue shooting as long as they hit.

<img title="pic1" alt="" src="/img/blog/posts/2013/02/pic1.jpg" />

To control the machine, we use an embedded Arduino board connected to an on-site server via USB. The on-site server runs a Python/Tornado web server which listens to requests from the web application backend, which is hosted on Google App Engine. The on-site server also handles the cameras; the spectator live feeds are sent directly to [UStream][5], while a separate camera feed for the currently playing user is handled by a [Wowza][6] server (this stream is separate for latency reasons).

<img title="pic2" alt="" src="/img/blog/posts/2013/02/pic2.jpg" />

Since everything is &#8220;live&#8221;, the application makes extensive use of server-to-client pushes using Google App Engine&#8217;s Channel API. This avoids a large amount of traditional polling. When the frontend JavaScript triggers a &#8220;fire&#8221; AJAX request, the backend passes the firing direction to the on-site server, which in turn passes it on to the Arduino, which controls the machine. Meanwhile, the backend also sends a WebSocket push event to all admins currently viewing administration interface, which gives them the choice to flag the shot as a goal or a miss. As soon as the shot status is set, the currently playing user gets a push notification that tells the frontend JavaScript to let them proceed to their next shot.

<img title="pic3" alt="" src="/img/blog/posts/2013/02/pic3.jpg" />

To maneuver the puck shooting machine, the Arduino uses a pair of electrically powered hydraulic jacks. Since these don&#8217;t support reporting their current position, the far ends of the travel range are bounded by limit switches. To figure out where the machine is aiming, the Arduino is first calibrated by running the machine to the far ends of the travel range and measuring how long time that takes, and then it simply has to keep track of how long it runs the hydraulics in order to figure out where it&#8217;s aiming.

The complexity in this application primarily stems from its many layers: the frontend javascript talks to UStream, to the Wowza server and to the App Engine backend. The App Engine backend in turn talks to the on-site server, which talks to the Arduino, which talks to the puck shooting machine. We could have let the frontend JS talk directly to the on-site server, but then we&#8217;d have to do user authentication etc there, so we decided to route the firing controls via the App Engine backend.

A secondary source of complexity are the latency issues: unsurprisingly it turned out that sending a fire control request from the frontend to the puck machine took a lot less time than it took a live camera feed to pass through UStream&#8217;s CDN back to the frontend. Thus we had a problem where the on-site booth attendant could see a shot being fired and flag it as a goal, which would bring up a &#8220;congratulations!&#8221; notification in the user&#8217;s browser, followed several seconds later by the user actually seeing his shot hit in the camera feed. It was clearly necessary to reduce the latency of the camera feed, and the simplest way of doing that was to remove the &#8220;black box&#8221; of UStream&#8217;s CDN and take care of the stream ourselves. This involved editing very large amounts of XML (Wowza is a Java application, so what did you expect) and swearing a lot, but it ended up working well enough.

This has been a really interesting project in several ways. It uses all sorts of technologies from the very highest to the very lowest level: you rarely get to work with embedded systems, servos and hydraulics as a web developer. The latency issues and live streaming stuff has also been a challenge.

<img title="pic4" alt="" src="/img/blog/posts/2013/02/pic4.jpg" />

 [1]: http://www.swehockey.se/Landslag/Herr/Tre-Kronor/OddsetHockeyGames2013/
 [2]: http://theviralcompany.com
 [3]: http://www.paramecanic.se
 [4]: https://svenskaspel.se
 [5]: http://www.ustream.tv
 [6]: http://www.wowza.com/
