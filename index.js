// Calling up TMI and Spotify api.
const twitchApi = require('tmi.js');
const SpotifyWebApi = require('spotify-web-api-node');

// I'm creating this section of variables to make channel bind and other functions easier.
const chName = 'caruso323';
const socialMediaInfo = {
    'instagram': '@opaidoverde',
    'youtube': 'Caruso',
    'youtube_link': 'https://www.youtube.com/channel/UCnB05Yjc_yeElNk_8pVMD0A',
};

const commandsInfo = [
    ' !instagram (ou !ig)',
    ' !youtube (ou !yt)',
    ' !sr < música, artista, album >'
];

// Telling to messagecatcherbot what "time" is.
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
setInterval(dateTime, 1000) //This will refresh the time second after second.

// Create a scope to eventually set any cooldown time to the command.
const onCooldown = new Set();

/* Setting debug state on and the channels list. 
    Also doing the authentication for tmiAPI */
const settings = {
    options:{
        clientId: 'lo87k57nqlfqg1m8xt27w4zsbbssmm',
    },
    connection:{
        reconnect: true
    },
    identity:{
        username: 'messagecatcherbot',
        password: 'oauth:lk749h7as68w4bnpgw1e4ac7wzzxo2'
    },
    channels: [
        chName,
    ]
};

// Actually creating the bot and connecting it. 
const bot = new twitchApi.client(settings);
bot.connect().catch(function(err){
    console.log(err)
})
//Setting up spotifyAPI variable and token.
var spotifyApi = new SpotifyWebApi();
var spotifyAuthorizationCode = "BQA3DgAycVAh5AAYic2_89w99FY-bYUkCLsDQyM3AYwVvqoIR7bQ9FcTrhicYS_4NeYn18tEjwnaDiIya37rPp3r4TXVcxKYhL35oiwKBPxYAGFlMDLivhAFrMaz9j1ivrS-OEelhCJTjT-FFjTRvmrqwk18kBRhLe6Y1Rlrjg63XWl8eJQeTg-zgKm5lwkAXA10E76NV7umIv6X2Vw8Elr9btBeQGb28yoYojkDLD8nX7o2fAphnOujtkpKs_gv9E86HWaS7OQKNZi41j_n5e1d"

// Send a message when connected.
bot.on('connected', (adress, port) => {
    console.log(`\n\n${dateTime()} - MessageCatcher bot is now on.. OK`);  
});

// ONLY CHAT COMMANDS
bot.on('chat', (channel, user, message, self) =>{
    if (self) return

    //It turns all kind of alternatives for "message" understandable.
    var messageSensitiveLess = message.toLowerCase();

    // Command to clear screen.
    if (messageSensitiveLess === '!cls' || messageSensitiveLess === '!clear'){
        // Cooldown loop.
        if (onCooldown.has(messageSensitiveLess)){
            bot.say(chName, `Comando em tempo de recarga, aguarde uns segundos antes de tentar novamente.`)
        }else {
            // Doing a permission's loop for only staff commands.
            if (user.badges == null || user.badges['broadcaster'] != '1' && user.mod == false){
                bot.say(chName, `@${user.username}, infelizmente (pra ti) este é um comando de uso restrito.`)
            }else if(user.badges['moderator'] == '1' || user.badges['broadcaster'] === '1'){
                bot.clear(chName); // It cleans chat messages.
                bot.say(chName, `Chat limpo. ;)`)
                console.log(`\n\n${dateTime()} - Chat was cleared by: ${user.username}. At "${channel}" channel... OK`)

                onCooldown.add(messageSensitiveLess)
                setTimeout(()=>{
                    onCooldown.delete(messageSensitiveLess)
                }, 10000)
            };
        };
    };

    // Command to pause/resume music.
    if (messageSensitiveLess === '!music_p' || messageSensitiveLess === '!play'){
        if (onCooldown.has(messageSensitiveLess)){
            bot.say(chName, `Comando em tempo de recarga, aguarde uns segundos antes de tentar novamente.`)
        }else {
            if (user.badges == null || user.badges['broadcaster'] != '1' && user.mod == false){
                bot.say(chName, `@${user.username}, infelizmente (pra ti) este é um comando de uso restrito.`)
            }else if(user.badges['moderator'] == '1' || user.badges['broadcaster'] === '1') {
            
                (async () => {
                    spotifyApi.setAccessToken(spotifyAuthorizationCode);
                    const playingState = await spotifyApi.getMyCurrentPlaybackState();
                    if(playingState.body.is_playing == false){ 
                        await spotifyApi.play();
                    }else[
                        await spotifyApi.pause()
                    ]
                })().catch(e => {
                    console.error(e)
                });
                console.log(`\n\n${dateTime()} - ${user.username} stopped/resume the music at "${channel}" channel... OK`);
            
                onCooldown.add(messageSensitiveLess)
                setTimeout(()=>{
                    onCooldown.delete(messageSensitiveLess)
                }, 3000);
            };
        };
    };

    // Command to change sound volume.
    if (messageSensitiveLess.includes('!vol')){
        if (user.badges == null || user.badges['broadcaster'] != '1' && user.mod == false){
            bot.say(chName, `@${user.username}, infelizmente (pra ti) este é um comando de uso restrito.`)
        }else if(user.badges['moderator'] == '1' || user.badges['broadcaster'] === '1') {
            var s = messageSensitiveLess.slice(4);
        
            if (s == "up"){
                (async () => {
                    spotifyApi.setAccessToken(spotifyAuthorizationCode);
                    var volumePorcent = (await spotifyApi.getMyCurrentPlaybackState()).body.device.volume_percent;
                    
                    if(volumePorcent > 90){
                        bot.say(chName, `O volume da música já está em 100%`);
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
                        bot.say(chName, `O volume da música foi retirado`);
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
                    bot.say(chName, `O volume da música foi definido para ${s}`);
                })().catch(e => {
                    console.error(e);
                }),
                console.log(`\n\n${dateTime()} - ${user.username} decreased the volume at "${channel}" channel... OK`)
            ];
        };
    };

    if(messageSensitiveLess.includes('!sr')){
        var s = messageSensitiveLess.slice(4);

        if (messageSensitiveLess.slice(3,4) == " "){
            (async () => {
                spotifyApi.setAccessToken(spotifyAuthorizationCode);

                var songArray = []
                var count = 0
                const songList = await (await (spotifyApi.searchTracks(s))).body.tracks.items
    
                while (songArray.length < 5){
                    songArray.push(` [${count+1}]${songList[count].name} - ${songList[count].artists[0].name}`)
                    ++count
                }
    
                bot.say(chName, `Achei isso no spotify: ${songArray}. Agora tu acrescenta o número escolhido depois do !sr (exemplo: !sr1 ${s})`)
            })().catch(e => {
                console.error(e)
            })
        }else {
            var sInt = parseInt(messageSensitiveLess.slice(3,4));
            (async () => {
                spotifyApi.setAccessToken(spotifyAuthorizationCode);
                
                const songRequested = await (await (spotifyApi.searchTracks(s))).body.tracks.items[sInt-1]
                await spotifyApi.addToQueue([songRequested.uri])

                console.log(`\n\n${dateTime()} - ${user.username} requested a song (${songRequested.name} - ${songRequested.artists[0].name}) at "${channel}" channel... OK`)
                bot.say(chName, `Prontinho. ${songRequested.name} - ${songRequested.artists[0].name} foi adicionada à fila de reprodução!`)
            })().catch(e => {
                console.error(e)
            });
        };
    };

    if (messageSensitiveLess === '!instagram' || messageSensitiveLess === '!ig') {

        bot.say(chName, `O instagram dele é: ${socialMediaInfo['instagram']}.`);
        console.log(`\n\n${dateTime()} - A social media(instagram) message was send at ${channel} to @${userstate.username}... OK`);
    } else if (messageSensitiveLess === '!youtube' || messageSensitiveLess === '!yt'){

        bot.say(chName, `O canal no youtube dele é "${socialMediaInfo['youtube']}", mas você pode acessar clicando aqui 👇 ${socialMediaInfo['youtube_link']}`);
        console.log(`\n\n${dateTime()} - A social media(youtube) message was send at ${channel} to @${userstate.username}... OK`);
    };

    // Command to computerize ganks (debug reasons only).
    if (messageSensitiveLess.includes('gank') || messageSensitiveLess.includes('raid')) {

        console.log(`\n\n${dateTime()} - You've receive a gank/raid at: "${channel} channel".`);
    };

    if (messageSensitiveLess === '!help' || messageSensitiveLess === '!ajuda' || messageSensitiveLess === '!commands' || messageSensitiveLess === '!comandos'){

        bot.say(chName, `Estes são os comandos que eu tenho até o momento: ${commandsInfo}`);
        console.log(`\n\n${dateTime()} - Someone's asking for some help at "${channel} channel".`);
    };
});