{
   "date": "2014-08-02T16:15:51+02:00",
   "draft": true,
   "title": "Ericsson City Index",
   "small_image": "ericsson.jpg",
   "siteurl": "http://www.ericsson.com/thinkingahead/networked_society/city-life/city-index/",
   "subtitle": "Networked society"
}

<h2>tl;dr:</h2>
<ul>
    <li>Project for Ericsson</li>
    <li>Together with DDB</li>
    <li>A business to business/government tool to explain and show off Ericsson's City Index</li>
    <li>Graphs and maps show you how IT-infrastructure affect other aspects of society</li>
</ul>

<h2>Background</h2>
<p>
    Ericsson was looking to renew their City Index tool. They've gathered loads of metrics from about 30 cities around the world and these numbers show how IT-infrastructure relates to other aspects of society such as literacy rate, health and environmental pollution.
</p>
<p>
    Their old site was built on flash, complete with funny noises and animations on hover. The old site was also only marginally interactive, basically just displaying the different scores. Needless to say, it needed some pimpin'. DDB was tasked with said assignment and they wanted to work with us. Being mainly business to business (or at least business to governments) it wasn't the most exciting project we've ever taken on, but it presented some challenges and we got to try out some new frameworks for real.
</p>

<h2>What have we done?(!)</h2>
<p>
    DDB had a lot of features planned for the new site. It started off with a Google Maps populated with a marker for each city that was part of the index. Each city have their own page, where the user can study the different values that city has scored. There are also case studies related to the city.
</p>
<p>
    It was the express wish that there would be an easy to comprehend comparison view. In the end, we did two: One grid view, where two measurements are displayed on the X- and Y-axies respectively and the cities are marked by dots in the grid. And one with columns in which the values for each measurement could be altered to see how the ranking was affected in real time.
</p>
<p>
    We couldn't find a suitable lib to help us with the grid view, so in the end we did it from scratch. Ember.js helped us with updating the city models in the column view, but in hindsight it was a bit too much hassle using that particular framework, despite the kind of cute hamster.
</p>

<h2>Afterwards</h2>
<p>
    The tool was presented internally at Ericsson at an event in Dallas and everyone was pretty pleased. Today we've just gotten charged with the rest of the Ericsson website, as DDB was that happy working with us.
</p>
