# AutoSitemap
Prototype for auto generating an xml sitemap in node, written in Node and Express.

# Installation
Run 'npm install'

# Running the app
Run 'node server.js'
In a browser navigate to 'http://localhost:8888/sitemap?url=https://www.gocardless.com/'.

# Notes
The idea of the app is to get all a tags in the html document requested. Then take the next link and get all of the
links from that document.

The site map will also include static assets from each url and will return them in the url as per the Google recommended
way https://support.google.com/webmasters/answer/178636?hl=en

To help with the issue between http://www and http:// the app will look to see if there is a 'canonical' address in the
html document header. If there is no canonical then it will use the url provided.

To reduce the clutter of having duplicate pages in different languages, the app checks the 'alternate' links in the
header and doesn't add those to the address to scrape.

# Problems
At the moment the app is limited to 100 pages. I couldn't quite figure out a way to limit this more dynamically. If I
had more time then I would have the site map to be multi-tiered. I've seen some WordPress sites do this. So the top
level would be authors, posts and comments. Click through on each section for all authors, posts etc.

I've also had to code out any references that start with '/cdn-cgi'. This was followed by a #[guid] or something
similar. Each page load would there for place a unique '/cdn-cgi' in the object meaning it constantly just checked that
page. I could of removed the #[guid] from the string but '/cdn-cgi' didn't seem to add much value anyway.
