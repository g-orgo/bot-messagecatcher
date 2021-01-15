# THE NICEST README.md FILE YOU'VE SEEN ALL TIME.
Hello!

I've created this bot to show some of my programming skills (job interview issues 😛). This README file will talk about some of the mind/working flow i choose to. TMIJS, Express and Spotify-web-api will need to be installed at your machine with NodeJS. If you haven't download it yet go do it, and then you go through this documentation and don't forget to check if you has already installed the module you're studying!

```
	npm install <YOUR_MODULE>
```


1. [TMIJS](https://github.com/g-orgo/bot-messagecatcher/tree/master#10-tmijs)
	- [1.1 oauth flow](https://github.com/g-orgo/bot-messagecatcher/tree/master#11-oauth-flow)
		* [permissions, scopes](https://github.com/g-orgo/bot-messagecatcher/tree/master#permissions-scopes)
	- [1.2 commands](https://github.com/g-orgo/bot-messagecatcher/tree/master#12-commands)
		* [d.r.y](https://github.com/g-orgo/bot-messagecatcher/tree/master#dry)
		* [staff commands](https://github.com/g-orgo/bot-messagecatcher/tree/master#staff-commands)
		* [cooldown](https://github.com/g-orgo/bot-messagecatcher/tree/master#cooldown)
2. [SPOTIFY API](https://github.com/g-orgo/bot-messagecatcher/tree/master#20-spotify-api)
	- [2.1 authentication](https://github.com/g-orgo/bot-messagecatcher/tree/master#21-authentication)
		* [express](https://github.com/g-orgo/bot-messagecatcher/tree/master#express)
	- [2.2 commands examples](https://github.com/g-orgo/bot-messagecatcher/tree/master#22commands-examples)
3. [THE END](https://github.com/g-orgo/bot-messagecatcher/tree/master#30-the-end)

## 1.0 TMIJS
First i'm gonna show a little about the twitchAPI (aka TMIJS). If you're not familiar to authentication be safe, you can check this [TMI.JS](https://tmijs.com/#example-anonymous-connection) page. They talk about all kinds of authentication flow you can use. Also, i'll try to bring some cool examples.

### 1.1 Oauth flow

For the [oAuth](https://twitchapps.com/tmi/) flow don't forget to change to your bot account, this authorization will give to you _just a few_ permissions, but that's ok. If you want specific permissions you'll need to search a little harder, depending of what you want it will involve some request and response lines of code but i didn't that and honestly you may not use those, so there's no reason to explain this.


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
			// Yes, you need to mantain the "oauth:".
			password: '<YOUR_OAUTH_TOKEN>'
		},

		/* If you see my index.js file you'll notice 
		i opted for use a variable here, but if you're some kind of masochist
		you can declare it line by line too.*/
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

Well... as i mentioned before if you need specific scopes, like ban someone for exemple, you can use Express to get the authenticationURL (like the spotifyAPI use of it). I mean, the only moment i needed more permissions that i already have with this generic oauth token generator (garanted by TMIJS) was when i pretend to create a "mod giver" command, but i left the idea behind so the generic token fits very well to my code.

### 1.2 Commands

For this example i'll take one of my old codes from index.js.

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

### D.R.Y

You know "Don't repeat yourself" programming ideology? I'll explain to you something different but with the same fundament. Whatever your using [chat](https://github.com/tmijs/docs/blob/gh-pages/_posts/v1.4.2/2019-03-03-Events.md#chat) or [message](https://github.com/tmijs/docs/blob/gh-pages/_posts/v1.4.2/2019-03-03-Events.md#message) event __YOU NEED TO USE__ this line at the beginning of it scope:

```js
	if (self) return
```

This will prevent your bot of activate a command by it own calling. For example i have this piece of code from my index.js

```js
	bot.say(chName, `I've found this: ${songArray}. Now you need to retrieve the chosen number just after !sr (example: !sr1 ${s})`)
```

The idea here is that you use "!sr <Artist, Album, Song>" to create a list of 5 items spotify searched for and then you use the same command but with the id of the song you want. Simple, right? Yea! but if i haven't use "dry function" this _example_ should activate the code, even if was the bot who said it. You can also create a variable inside your chat/message scope to messages become easier to catch.

```js

	var messageSensitiveLess = message.toLowerCase();

```

### Staff commands

For the only-staff loop idea i did a very messy code, writing this README file i finally found out this:

```js

	if (user.badges == null || user.badges['broadcaster'] != '1' && user.mod == false){

		// Not staff message.

	}else if(user.badges['moderator'] == '1' || user.badges['broadcaster'] === '1') {

		// Here goes the only staff commands.

	}

```
I used twitchAPI badges system to it! This is the past releases code: 

```js
	if (user.badges == null){

		// Not staff message.

	}else if (user.mod === true || user.badges['broadcaster'] === '1'){
		// Here goes the only staff commands.
		
		
	} else [

		// Not staff message.

	]

```

It works too but has one more line. You might be thinking why i did this ``` if (user.badges == null) ``` when i've already called  ```else```. Like, if someone has no "broadcaster" or even "mod" badge it should not be a staff-member, right? Well... you're right. But, what twitchAPI will shows up if you don't use this first line is that "you can't read 'null'", also if someone has another kind of badge (like i've seen before) it will trigger the staff-member lines, so it's good to force it parameter.

### Cooldown

When i started my cooldown feature i decided that this should work with _time_, so i did it. I teached time to the bot.

```js

function dateTime(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = String(today.getFullYear());
    var hh = String(today.getHours()).padStart(2, '0');
    var min = String(today.getMinutes()).padStart(2, '0');
    var ss = String(today.getSeconds()).padStart(2, '0');
    today = '[ ' + dd + '/' + mm + '/' + yyyy + " | " + hh + ':' + min + ':' + ss + ' ]'
    return today
}
setInterval(dateTime, 1000)

```

But i quickly changed my mind when i found this "set kind" to create it.

```js

	const onCooldown = new Set(); // This go out of any scope.


	if (onCooldown.has(messageSensitiveLess)){

		// On cooldown message.
	
	}else {
		
		// Your stuff.
	
		onCooldown.add(messageSensitiveLess)
		setTimeout(()=>{
			onCooldown.delete(messageSensitiveLess)
		}, 10000) // Here we'll set the time we want in ms.
	}

```

In this case, first of i've tried to add a value like "true" to "onCooldown" set, but it created a problem when multiple commands was on cooldown (i didn't deleted _time_, i leave it to console logs 😋).

## 2.0 SPOTIFY API

This one give me a lot of pain, differently from TMIJS it doesn't has a generic token generator and you're by you own. Actually this is ok, the worst of it is that if you want to learn something about it using nodeJS you'll need to search for people repository cause the documentation doesn't help so much. I mean, the [auth flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow) is very good but i just understand it for real when i searched for it [in](https://www.youtube.com/watch?v=rYDDWVuv-kI&t=1419s) [other](https://www.youtube.com/playlist?list=PLRUD_uiAYejRvQWkS2xjgFW20lRLp4snN) [places](https://www.youtube.com/watch?v=Bk90lT6ne3g&t=235s) (they've different links).

### 2.1 Authentication

Look, i'll be real. This oAuth2 leaves me mad several times. I didn't get that for a __long__ period on this development and i think i can't say i'm secure enough to _teach_ this. But i'll try my best.

First you set the [scopes](https://developer.spotify.com/documentation/general/guides/scopes/) you want to handle. If you're not familiar to it, this is like your acess control wristbands in digital world.

```js

	spotifyscopes = [ 
		'<SCOPE_YOU_WANT_TO_USE>',
	];

```

Then you set the credentials of your aplication at "spotify for developer" > "[dashboard](https://developer.spotify.com/dashboard/applications)"

```js
	var spotifyApi = new SpotifyWebApi({
		clientId: '<CLIENT_ID>',
		clientSecret: '<CLIENT_SECRET>',
		redirectUri: 'http://localhost:8888/callback' 
		});
```



### Express

I choose [express](https://expressjs.com/pt-br/) to do it cause i've already work with this framework and i was following [this](https://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/tutorial/00-get-access-token.js) examples, but i've already seen people doing this requests&response's feature with [request module](https://github.com/request/request).


```js

	exp.get('/login', (req, res) => {
		// This will only works if you haven't authorizate the bot with your account yet.
		res.redirect(spotifyApi.createAuthorizeURL(spotifyscopes));
	});

```

This process is very important for the spotify integration, since you've done it you'll be redirect to "/callback" and there's what we want.

```js
	exp.get('/callback', (req, res) =>{
		const code = req.query.code;

		spotifyApi.authorizationCodeGrant(code).then(data => {
			const access_token = data.body['access_token']
			const refresh_token = data.body['refresh_token'];
			const expires_in = data.body['expires_in']
			
			spotifyApi.setAccessToken(access_token);
			spotifyApi.setRefreshToken(refresh_token);

			console.log(`Spotify token expires in: ${data.body.expires_in}\n`)
			console.log(`Hello, here's your token:\n\n ${access_token}\n\n It will be refreashed in 1hour`)

			res.send('Success! You can now close the window.');

			setInterval(async () => {
				const data = await spotifyApi.refreshAccessToken();
				access_token = data.body['access_token'];
		
				console.log('\n\nThe access token has been refreshed!');
				console.log('access_token:\n\n', access_token);
				spotifyApi.setAccessToken(access_token);
			}, expires_in / 2 * 1000);
		}).catch(function(err){
			console.log(err)
		})
	})
```

I mean, you can do it directly in your main file but i abstracted it to a separated file so i can run them both in different consoles giving a safe integrity to my token life.

### 2.2 Commands examples

With spotifyAPI you can use this generic syntax example:

```js

	(async () => {
		spotifyApi.setAccessToken("<YOUR_TOKEN>");
	
		const me = await spotifyApi.getMe()
	})().catch(e => {
		console.error(e)
	});

```

I'll show one of my commands flow so you can fell what it should looks like

```js


// Command to change sound volume.
if (messageSensitiveLess.includes('!vol')){
	if (user.badges == null || user.badges['broadcaster'] != '1' && user.mod == false){
		bot.say(chName, `@${user.username}, unfortunately (for you) this is a staff-only command.`)
	}else if(user.badges['moderator'] == '1' || user.badges['broadcaster'] === '1') {
		
		var s = messageSensitiveLess.slice(4);
		if (s == "up"){
			(async () => {
				spotifyApi.setAccessToken(spotifyAuthorizationCode);
				var volumePorcent = (await spotifyApi.getMyCurrentPlaybackState()).body.device.volume_percent;
				
				if(volumePorcent > 90){
					bot.say(chName, `Volume's already at 100%`);
				} else [
					await spotifyApi.setVolume(volumePorcent + 10)
				]
			})().catch(e => {
				console.error(e)
			})

			console.log(`\n\n${dateTime()} - ${user.username} increased the volume at "${channel}" channel... OK`);
		}else if (s == "down"){
			(async () => {
				spotifyApi.setAccessToken(spotifyAuthorizationCode);
				var volumePorcent = (await spotifyApi.getMyCurrentPlaybackState()).body.device.volume_percent;
				if(volumePorcent < 10){
					bot.say(chName, `Volume's already muted`);
				} else [
					await spotifyApi.setVolume(volumePorcent - 10)
				]
			})().catch(e => {
				console.error(e)
			})

			console.log(`\n\n${dateTime()} - ${user.username} decreased the volume at "${channel}" channel... OK`);
		}else [
			(async () => {
				spotifyApi.setAccessToken(spotifyAuthorizationCode);
				await spotifyApi.setVolume(parseInt(s));
				bot.say(chName, `Volume was set to ${s}`);
			})().catch(e => {
				console.error(e);
			}),

			console.log(`\n\n${dateTime()} - ${user.username} decreased the volume at "${channel}" channel... OK`)
		];
	};
};

```

For this command i bind "volume_percent" value from the reponse we get using [getMyCurrentPlaybackState](https://developer.spotify.com/documentation/web-api/reference/player/get-information-about-the-users-current-playback/) function in a variable called "volumePorcent" and from this i bend the flow as the requested. As long as you don't want to use all commands by request&reponse lines you'll search for they syntax at [Lin Michael repository](https://github.com/thelinmichael/spotify-web-api-node#more-examples) and study the context of it in [API endpoint reference](https://developer.spotify.com/documentation/web-api/reference/)

## 3.0 THE END

Well, i didn't a lot of features in this bot since the idea behind of it was show my API knowledge. This **(231+71)** lines of code that composes MesssagecatcherBOT are finished. Peace!