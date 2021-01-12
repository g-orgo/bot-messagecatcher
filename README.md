# THE NICEST README.md FILE YOU'VE SEEN ALL TIME.
Hello!

I've created this bot to show some of my programming skills (job interview issues 😛). This README file will talk about some of the mind/working flow i choose to.


1. TMIJS
* OAUTH FLOW










## TMIJS
First i'm gonna talk a little about the twitchAPI (aka TMIJS). If you're not familiar to authentication be safe, you can check this [TMI.JS](https://tmijs.com/#example-anonymous-connection) page. They speak about all kinds of authentication flow you can use. Also, i'll try to bring some cool examples.

### OAUTH FLOW

```
const tmi = require('tmi.js');

const client = new tmi.Client({ (I prefer to call this "client", bot.)
	options: { debug: true },
	connection: {
		reconnect: true
	},
	identity: {
		username: '<YOUR_BOT_USERNAME>',
		password: '<YOUR_OAUTH_TOKEN>'  (And yes, you need to mantain the "oauth:")
	},
	channels: [ 'my_name' ]  (As you can see at my index.js file i opted for use a variable here, but it fits too)
});

client.connect();
```