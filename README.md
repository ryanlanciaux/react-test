react-test
==========

Testing out React based on their examples and documentation. Tossed the Marvel API into the mix as well :) Some of this is totally junk code for testing. 


##Getting things setup

1. Clone this project
1. Get a [Marvel API Key](http://developer.marvel.com/)
1. Add [Localtest.me](http://readme.localtest.me/) or some other version of localhost to valid Marvel referrers (Under "My Developer Account" on the [developer.marvel.com website](http://developer.marvel.com).)
1. Create `/scripts/key.js` and add something like `window.key = "yourkeyhere";`
1. Run the site on some type of local webserver. I generally use http-server (`npm install -g http-server`);


This basically just lets you search for heroes / villains and add them to your team. You can then remove them from your team. That's about it... 