// Calling up TMI and Spotify api.
const twitchApi = require('tmi.js');
const spotifyApi = require('spotify-web-api-node');

// I'm creating this section of variables to make channel bind and other functions easier.
const chName = 'caruso323';
const socialMediaInfo = {
                                        'instagram': '@opaidoverde',
                                        'youtube': 'Caruso',
                                        'youtube_link': 'https://www.youtube.com/channel/UCnB05Yjc_yeElNk_8pVMD0A',
};

/* 
const chName = 'renauzin';
const socialMediaInfo = {
                                        'instagram': '@renauzin',
                                        'youtube': 'Ainda não tem',
                                        'youtube_link': 'É, não tem ainda.',
};
 */
const commandsInfo = [
    ' !cls (ou clear | tempo de recarga: 10s)', 
    ' !instagram(ou ig)', 
    ' !youtube(ou yt)',
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
setInterval(dateTime, 1000)

//This will create a scope to eventually set any cooldown time to the command.
const onCooldown = new Set();

/* Setting debug state on and the channels list. 
    Also doing the authentication for tmiAPI */
const settings = {
    options:{
        clientId: 'messagecatcherbot',
        debug: true
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

var spotifySettings = new spotifyApi({
    clientId: '1ad304bde0594efc8d660937c4018167',
    clientSecret: '4380dfbc0cea436aa134687cb8699d73',
    redirectUri: 'http://localhost/'
  });

 //Actually creating the bot and connecting it. 
const bot = new twitchApi.client(settings);
bot.connect();

// Send a message when connected.
bot.on('connected', (adress, port) => {
    bot.action(chName, 'Inicializando sistema...');
    console.log(`${dateTime()} - Connected to ${adress}, port ${port}... OK`);
});


//ONLY CHAT COMMANDS
bot.on('chat', (channel, user, message, self) =>{
    //It turns all kind of alternatives for "message" understandable.
    var messageSensitiveLess = message.toLowerCase();

    if (messageSensitiveLess === '!cls' || messageSensitiveLess === '!clear'){
        // Cooldown loop
        if (onCooldown.has('true')){
            bot.say(chName, `Comando em tempo de recarga, aguarde uns segundos antes de tentar novamente.`)
        } else {
            // Doing a permission's loop for only staff commands.
            if (user.badges === null) {
                bot.say(chName, `@${user.username}, infelizmente este é um comando de uso restrito.`);
            } else if (user.mod === true || user.badges['broadcaster'] === '1'){
                // Here goes the only staff commands.
                clearChat();
                bot.say(chName, `Chat limpo. ;)`)
            } else [
                bot.say(chName, `@${user.username}, infelizmente este é um comando de uso restrito.`)
            ]
            
            onCooldown.add('true')
            setTimeout(()=>{
                onCooldown.delete('true')
            }, 10000) // Here we'll set the time we want to the command in ms.
        };
    
        function clearChat(){
            // It cleans chat messages.
            bot.clear(chName);
            console.log(`${dateTime()} - Chat was cleared by: ${user.username}. At "${channel}" channel... OK`)
        };
    }
});

//ALL KIND O' MESSAGE COMMANDS
bot.on('message', (channel, userstate, message, self) =>{
    //It turns all kind of alternatives for "message" understandable.
    var message = message.toLowerCase();

    // A social media function, when someone send a message with social media names it returns my link or identification on it.
    if (message === '!instagram' || message === '!ig') {
        bot.say(chName, `O instagram dele é: ${socialMediaInfo['instagram']}.`);
        console.log(`${dateTime()} - A social media(instagram) message was send at ${channel} to @${userstate.username}... OK`);
    } else if (message === '!youtube' || message === '!yt'){
        bot.say(chName, `O canal no youtube dele é "${socialMediaInfo['youtube']}", mas você pode acessar clicando aqui 👇 ${socialMediaInfo['youtube_link']}`);
        console.log(`${dateTime()} - A social media(youtube) message was send at ${channel} to @${userstate.username}... OK`);
    };

    // Command to computerize ganks (debug reasons only).
    if (message.includes('gank') || message.includes('raid')) {
        console.log(`${dateTime()} - You've receive a gank/raid at: "${channel} channel".`);
    };

    if (message === '!help' || message === '!ajuda' || message === '!commands' || message === '!comandos'){
        bot.say(chName, `Estes são os comandos que eu tenho até o momento: ${commandsInfo}`);
        console.log(`${dateTime()} - Someone's asking for some help at "${channel} channel".`);
    };
});