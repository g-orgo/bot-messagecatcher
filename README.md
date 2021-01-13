# THE NICEST README.md FILE YOU'VE SEEN ALL TIME.
Hello!

I've created this bot to show some of my programming skills (job interview issues 😛). This README file will talk about some of the mind/working flow i choose to. TMIJS, Express and Spotify-web-api will need to be installed at your machine with NodeJS. If you haven't download it yet go do it and then you run this at your console.


Simple as it seems, go through this documentation and don't forget to check if you has already installed the module you're studying!

```
	npm install <YOUR_MODULE>
```


1. [TMIJS](https://github.com/g-orgo/bot-messagecatcher/tree/master#tmijs)
	- [oauth flow](https://github.com/g-orgo/bot-messagecatcher/tree/master#oauth-flow)
		* [permissions, scopes](https://github.com/g-orgo/bot-messagecatcher/tree/master#permissions-scopes)
	- [simple command](https://github.com/g-orgo/bot-messagecatcher/tree/master#simple-command)



## TMIJS
First i'm gonna show a little about the twitchAPI (aka TMIJS). If you're not familiar to authentication be safe, you can check this [TMI.JS](https://tmijs.com/#example-anonymous-connection) page. They talk about all kinds of authentication flow you can use. Also, i'll try to bring some cool examples.

### Oauth flow

You'll need the [oAuth](https://twitchapps.com/tmi/) code of your bot account, this authorization will give to you _just a few_ permissions for your bot account. If you want specific permissions you'll need to search a little harder, depending of what you want it will involve some request and response lines of code but i didn't and honestly you may not use those, so there's no reason to me to explain this.


This is the oauth flow:
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

You can use an anonymous connection too:

```js
	const tmi = require('tmi.js');

	const client = new tmi.Client({
		connection: {
			secure: true,
			reconnect: true
		},
		channels: ['<YOUR_CHANNEL_NAME>'] 
	});

	client.connect();
```

But i've never try this, so i don't know what kind of permissions it has.

### Permissions, scopes

Well, as i mentioned before if you need specific scopes, like ban someone for exemple, you can use Express to get the authenticationURL (like the spotifyAPI use of it). I mean, the only moment i needed more permissions that i already have with this generic oauth token generator (garanted by TMIJS) was when i pretend to create a "mod giver" command, but i left the idea behind so the generic token fits very well to my code.

### Simple command

For this example i'll take one of my old codes from ```index.js```.

```js

	bot.on('connected', (adress, port) => {
		console.log(`\n\n${dateTime()} - MessageCatcher bot is now on.. OK`);  
		bot.say(chName, `Hello!`)
	});

```

As you can see it's quite simple to understand the syntax of the bot. Here we are seeing the [connected](https://github.com/tmijs/docs/blob/gh-pages/_posts/v1.4.2/2019-03-03-Events.md#connected) event.

```js

	bot.say(<YOUR_CHANNEL_NAME>, `Hello!`)

```

At [say](https://github.com/tmijs/docs/blob/gh-pages/_posts/v1.4.2/2019-03-03-Commands.md#say) command has something smart you can do with your bot, i strong recommend you to use a variable to set the channel instead of insert it line by line cause if you want to use it in another channel this _trick_ will handle this situations very well. Change a variable and then is all good.