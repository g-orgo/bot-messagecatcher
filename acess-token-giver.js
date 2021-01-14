const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');

// First you'll set the scopes you want to change/handle
spotifyscopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
];

// Setting up spotify and express variables.
var spotifyApi = new SpotifyWebApi({
    clientId: '1ad304bde0594efc8d660937c4018167',
    clientSecret: '4380dfbc0cea436aa134687cb8699d73',
    redirectUri: 'http://localhost:8888/callback'
});

const exp = express();

exp.get('/login', (req, res) => {
    // This will only works if you haven't authorizate the bot with your account yet.
    res.redirect(spotifyApi.createAuthorizeURL(spotifyscopes));
});

exp.listen(8888, () =>
  console.log(
    'Access -> http://localhost:8888/login in your browser to generate the auth code.'
  )
);

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
            const access_token = data.body['access_token'];
    
            console.log('\n\nThe access token has been refreshed!');
            console.log('access_token:\n\n', access_token);
            spotifyApi.setAccessToken(access_token);
          }, expires_in / 2 * 1000);
    }).catch(function(err){
        console.log(err)
    })
})