# THE NICEST README.md FILE YOU'VE SEEN ALL TIME.
Hello!

I've created this bot to show some of my programming skills (job interview issues 😛). This README file will talk about some of the mind/working flow i choose to. TMIJS, Express and Spotify-web-api will need to be installed at your machine with NodeJS so if you haven't download it and run this at your console.


Ultra simple!
```
npm install <YOUR_MODULE>
```


1. [TMIJS](https://github.com/g-orgo/bot-messagecatcher/tree/master#tmijs)
	* [OAUTH FLOW](https://github.com/g-orgo/bot-messagecatcher/tree/master#oauth-flow)










## TMIJS
First i'm gonna show a little about the twitchAPI (aka TMIJS). If you're not familiar to authentication be safe, you can check this [TMI.JS](https://tmijs.com/#example-anonymous-connection) page. They talk about all kinds of authentication flow you can use. Also, i'll try to bring some cool examples.

### OAUTH FLOW

You'll take your OAUTH code [here](https://twitchapps.com/tmi/) This authorization i'll give just a few permissions on your twitch account. If you want specific permissions you'll need to search a little harder, depending of what you want it will involve some request and response lines of code but i didn't and honestly you may never use those.

```js
const tmi = require('tmi.js');

// I prefer to call this "client", bot.
const client = new tmi.Client({
	options: { debug: true },
	connection: {
		reconnect: true
	},
	identity: {
		username: '<YOUR_BOT_USERNAME>',
		// And yes, you need to mantain the "oauth:".
		password: '<YOUR_OAUTH_TOKEN>'
	},
	// As you can see at my index.js file i opted for use a variable here, but it works too.
	channels: ['<YOUR_CHANNEL_NAME>']  
});

client.connect();
```

You can use a anonymous connection too:

```js
const tmi = require('tmi.js');

const client = new tmi.Client({
	connection: {
		secure: true,
		reconnect: true
	},
	channels: [ 'my_name' ]
});

client.connect();
```

but i've never try this, so i don't know what kind of permissions this has.