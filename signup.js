const fs = require('fs');
const config = require('./constants/config.js');
const Discord = require('discord.js');
const client = new Discord.Client({"partials": ['CHANNEL', 'MESSAGE', 'REACTION', 'USER']});
const process = require('process');

process.on('uncaughtException', function(err){
  console.log(err);
});

const ffTitle = 'Fortress Fight';
const rrTitle = 'Reservoir Raid';
const embeds = {};
const events = {
  'Fortress Fight': {
    '🇦': 'Bunker 1',
    '🇧': 'Bunker 2',
    '🇨': 'Bunker 3',
    '🇩': 'Bunker 4',
    '🇪': 'Bunker 5',
    '🇫': 'Bunker 6',
    '🇬': 'Bunker 7',
    '🇭': 'Bunker 8',
    '🇮': 'Bunker 9',
    '🇯': 'Bunker 10',
    '🇰': 'Bunker 11',
    '🇱': 'Bunker 12',
    '1️⃣': 'Facility 1',
    '2️⃣': 'Facility 2',
    '3️⃣': 'Facility 3',
    '4️⃣': 'Facility 4'
  },
  'Reservoir Raid': {
    '✅': 'Participant',
    '⭕': 'Reservist',
    '❌': 'Unavailable'
  }
};
const keyToTitleMapping = {
  'A': 'Fortress Fight',
  'B': 'Fortress Fight',
  'C': 'Fortress Fight',
  'D': 'Fortress Fight',
  'E': 'Fortress Fight',
  'F': 'Fortress Fight',
  'G': 'Fortress Fight',
  'H': 'Fortress Fight',
  'I': 'Fortress Fight',
  'J': 'Fortress Fight',
  'K': 'Fortress Fight',
  'L': 'Fortress Fight',
  'a': 'Fortress Fight',
  'b': 'Fortress Fight',
  'c': 'Fortress Fight',
  'd': 'Fortress Fight',
  'e': 'Fortress Fight',
  'f': 'Fortress Fight',
  'g': 'Fortress Fight',
  'h': 'Fortress Fight',
  'i': 'Fortress Fight',
  'j': 'Fortress Fight',
  'k': 'Fortress Fight',
  'l': 'Fortress Fight',
  'B1': 'Fortress Fight',
  'B2': 'Fortress Fight',
  'B3': 'Fortress Fight',
  'B4': 'Fortress Fight',
  'B5': 'Fortress Fight',
  'B6': 'Fortress Fight',
  'B7': 'Fortress Fight',
  'B8': 'Fortress Fight',
  'B9': 'Fortress Fight',
  'B10': 'Fortress Fight',
  'B11': 'Fortress Fight',
  'B12': 'Fortress Fight',
  'b1': 'Fortress Fight',
  'b2': 'Fortress Fight',
  'b3': 'Fortress Fight',
  'b4': 'Fortress Fight',
  'b5': 'Fortress Fight',
  'b6': 'Fortress Fight',
  'b7': 'Fortress Fight',
  'b8': 'Fortress Fight',
  'b9': 'Fortress Fight',
  'b10': 'Fortress Fight',
  'b11': 'Fortress Fight',
  'b12': 'Fortress Fight',
  'f1': 'Fortress Fight',
  'f2': 'Fortress Fight',
  'f3': 'Fortress Fight',
  'f4': 'Fortress Fight',
  'F1': 'Fortress Fight',
  'F2': 'Fortress Fight',
  'F3': 'Fortress Fight',
  'F4': 'Fortress Fight',
  '1': 'Fortress Fight',
  '2': 'Fortress Fight',
  '3': 'Fortress Fight',
  '4': 'Fortress Fight',
  'V': 'Reservoir Raid',
  'O': 'Reservoir Raid',
  'X': 'Reservoir Raid',
  'P': 'Reservoir Raid',
  'R': 'Reservoir Raid',
  'U': 'Reservoir Raid',
  'v': 'Reservoir Raid',
  'o': 'Reservoir Raid',
  'x': 'Reservoir Raid',
  'p': 'Reservoir Raid',
  'r': 'Reservoir Raid',
  'u': 'Reservoir Raid'

};
const keyMapping = {
  'A': '🇦',
  'B': '🇧',
  'C': '🇨',
  'D': '🇩',
  'E': '🇪',
  'F': '🇫',
  'G': '🇬',
  'H': '🇭',
  'I': '🇮',
  'J': '🇯',
  'K': '🇰',
  'L': '🇱',
  'a': '🇦',
  'b': '🇧',
  'c': '🇨',
  'd': '🇩',
  'e': '🇪',
  'f': '🇫',
  'g': '🇬',
  'h': '🇭',
  'i': '🇮',
  'j': '🇯',
  'k': '🇰',
  'l': '🇱',
  'B1': '🇦',
  'B2': '🇧',
  'B3': '🇨',
  'B4': '🇩',
  'B5': '🇪',
  'B6': '🇫',
  'B7': '🇬',
  'B8': '🇭',
  'B9': '🇮',
  'B10': '🇯',
  'B11': '🇰',
  'B12': '🇱',
  'b1': '🇦',
  'b2': '🇧',
  'b3': '🇨',
  'b4': '🇩',
  'b5': '🇪',
  'b6': '🇫',
  'b7': '🇬',
  'b8': '🇭',
  'b9': '🇮',
  'b10': '🇯',
  'b11': '🇰',
  'b12': '🇱',
  '1': '1️⃣',
  '2': '2️⃣',
  '3': '3️⃣',
  '4': '4️⃣',
  'f1': '1️⃣',
  'f2': '2️⃣',
  'f3': '3️⃣',
  'f4': '4️⃣',
  'F1': '1️⃣',
  'F2': '2️⃣',
  'F3': '3️⃣',
  'F4': '4️⃣',
  'V': '✅',
  'O': '⭕',
  'X': '❌',
  'P': '✅',
  'R': '⭕',
  'U': '❌',
  'v': '✅',
  'o': '⭕',
  'x': '❌',
  'p': '✅',
  'r': '⭕',
  'u': '❌'
};

const removeEmbed = (channel, title) => {
  delete embeds[channel][title];
  if(!embeds[channel][rrTitle] && !embeds[ffTitle]){
    delete embeds[channel];
  }

  try {
    fs.unlinkSync(`${config.dbPath}${config.dbPrefix}${channel}-${title}.json`);
  } catch (e) {
    console.log(`Error removing database file ${channel}-${title}.json`, e);
  }
};

const renderEmbed = (embed, channel) => {
  let description = '';
  (embed.restriction || Object.keys(events[embed.title])).forEach((key) => {
    description += key + ': ' + events[embed.title][key];
    if(embed.signedUp[key] && embed.signedUp[key].length > 0){
      description += '​\n```\n';
      embed.signedUp[key].forEach((user) => {
        description += user + '\n';
      });
      description += '```\n';
    } else { 
      description += '\n```\n​                                   \n```\n';
    }
  });

  if(embed.closed){
    removeEmbed(channel, embed.title);
  } else {
    let dbEmbed = {...embed};
    dbEmbed.message = dbEmbed.message ? dbEmbed.message.id : undefined;
    fs.writeFileSync(`${config.dbPath}${config.dbPrefix}${channel}-${embed.title}.json`, JSON.stringify(dbEmbed), {flag: 'w'});
  }
  
  return new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle((embed.customTitle || (embed.title + ' Signup')) + ' | Status: ' + (embed.closed ? 'Closed' : 'Running'))
    .setDescription(description);
};

const violatesLimit = (embed, nickname) => {
  if(embed.limit){
    let currentSignups = 0;
    Object.keys(embed.signedUp).forEach((symbol) => {
      if(embed.signedUp[symbol].indexOf(nickname) !== -1) {
        currentSignups++;
      }
    });

    if(currentSignups >= embed.limit){
      return true;
    }
  }
  return false;
};
 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  fs.readdirSync(config.dbPath).forEach(fileName => {
    if(fileName.indexOf(config.dbPrefix) === 0){
      let dbEmbed = fs.readFileSync(`${config.dbPath}${fileName}`);
      try {
        let embed = JSON.parse(dbEmbed);
        let tokens = fileName.split('.')[0].split('-');
        if(tokens.length > 2) {
          embeds[tokens[1]] = embeds[tokens[1]] || {};
          embeds[tokens[1]][tokens[2]] = embed;

          console.log('Fetching channel ', tokens[1]);
          client.channels.fetch(tokens[1]).then((channel) => {
            if(channel){
              channel.messages.fetch(embed.message).then((message) => {
                embed.message = message;
              }).catch((err) => {
                console.log('Error fetching message: ', err);

                removeEmbed(tokens[1], tokens[2]);
              });
            } else {
              console.log('Unable to fetch channel from previous message');
            }
          }).catch((err) => {
            console.log('Error fetching message: ', err);

            removeEmbed(tokens[1], tokens[2]);
          });
        } else {
          console.log('Extraneous file: ' + fileName);
        }
      } catch(e) {
        console.log('Corrupted file: ' + fileName, e);
      }
    } else {
      console.log('Extraneous file: ' + fileName);
    }
  });
});

client.on('messageReactionAdd', async (react, author) => {
  if (react.message.partial) await react.message.fetch();

  let channel = react.message.channel.id;

  if(author.bot || !embeds[channel]){
    return;
  }

  let member = await react.message.guild.members.fetch(author);
  let nickname = member.displayName;

  let embed;
  let ffEmbed = embeds[channel][ffTitle];
  let rrEmbed = embeds[channel][rrTitle];
  if(ffEmbed && ffEmbed.message.id === react.message.id){
    embed = ffEmbed;
  } else if(rrEmbed && rrEmbed.message.id === react.message.id) {
    embed = rrEmbed;
  } else {
    return;
  }

  if(react.emoji.name === '🔚' && (author.id === embed.author || member.hasPermission("ADMINISTRATOR"))){
    embed.closed = true;

    try {
      embed.message.edit(renderEmbed(embed, channel)).then(() => {
        
      });
    } catch(e) {
      react.message.channel.send('Error. Please check bot permissions and try again.');
    }
  } else if(events[embed.title][react.emoji.name] && !embed.closed) {
    if(violatesLimit(embed, nickname)){
      react.message.channel.send('<@' + author.id  + '> You have exceeded your signup limit');
      return;
    }

    embed.signedUp[react.emoji.name] = embed.signedUp[react.emoji.name] || [];
    embed.signedUp[react.emoji.name].push(nickname);
    try {
      embed.message.edit(renderEmbed(embed, channel));
    } catch(e) {
      react.message.channel.send('Error. Please check bot permissions and try again.');
    }
  }
});

client.on('messageReactionRemove', async (react, author) => {
  if (react.message.partial) await react.message.fetch();
  let channel = react.message.channel.id;

  if(author.bot || !embeds[channel]){
    return;
  }

  let member = await react.message.guild.members.fetch(author);
  let nickname = member.displayName;

  let embed;
  let ffEmbed = embeds[channel][ffTitle];
  let rrEmbed = embeds[channel][rrTitle];
  if(ffEmbed && ffEmbed.message.id === react.message.id){
    embed = ffEmbed;
  } else if(rrEmbed && rrEmbed.message.id === react.message.id) {
    embed = rrEmbed;
  } else {
    return;
  }

  if(embed.signedUp[react.emoji.name]){
    if(react.emoji.name === '🔚' && (author.id === embed.author || member.hasPermission("ADMINISTRATOR"))){
      embed.closed = false;
    } else if(events[embed.title][react.emoji.name] && !embed.closed) {
      embed.signedUp[react.emoji.name] = embed.signedUp[react.emoji.name].filter(user => user !== nickname);
    }
    
    try {
      embed.message.edit(renderEmbed(embed, channel));
    } catch(e) {
      react.message.channel.send('Error. Please check bot permissions and try again.');
    }
  }
});
 
client.on('message', msg => {
  const args = (msg.content && msg.content.length > 0 ) ? msg.content.split(' ') : [''];

  if (args[0].toLowerCase() === '.add' || args[0].toLowerCase() === '.remove'){
    if(args.length >= 3){
      let embedTitle = keyToTitleMapping[args[args.length - 1]] || keyToTitleMapping[args[args.length - 1].toLowerCase()];
      if(embedTitle){
        if(embeds[msg.channel.id] && embeds[msg.channel.id][embedTitle]){
          let embed = embeds[msg.channel.id][embedTitle];
          let key = keyMapping[args[args.length - 1]] || keyMapping[args[args.length - 1].toLowerCase()] || args[args.length - 1];
            
          let allNames = '';
          for(var i = 1; i < args.length - 1; i++){
            allNames += args[i] + ' ';
          }
          let allNamesArray = allNames.split(',');
          for(var i = 0; i < allNamesArray.length; i++){
            let name = allNamesArray[i].trim();
            if(args[0] === '.add'){
              if(!violatesLimit(embed, name)){
                embed.signedUp[key] = embed.signedUp[key] || [];
                embed.signedUp[key].push(name);
    
                try {
                  embed.message.edit(renderEmbed(embed, msg.channel.id));
                } catch(e) {
                  msg.channel.send('Error. Please check bot permissions and try again.');
                }
              } else {
                msg.channel.send('Adding user would exceed limit.');
              }
            } else {
              if(embed.signedUp[key] && embed.signedUp[key].indexOf(name) !== -1){
                embed.signedUp[key] = embed.signedUp[key].filter(user => user !== name);

                try {
                  embed.message.edit(renderEmbed(embed, msg.channel.id));
                } catch(e) {
                  msg.channel.send('Error. Please check bot permissions and try again.');
                }
              } else {
                msg.channel.send('User is not registered.');
              }
            }
          }
        } else {
          msg.channel.send('Unable to find signup running in this channel. Create one before adding users.');
        }
      } else {
        msg.channel.send('Unable to map category ' + args[args.length - 1] + ' to an event signup.');
      }
    } else {
      msg.channel.send('Invalid number of parameters. Usage: ' + args[0] + ' [name] [category]');
    }

    msg.delete();
  } else if (args[0].toLowerCase() === '.signup') {
    let title = ffTitle;
    let lastFound;
    let customTitle;
    let limit;
    let restriction;

    if(args.length > 1 && typeof args[1] === 'string') {
      switch(args[1].toLowerCase()){
        case 'rr':
          title = rrTitle;
          break;
        case 'help':
          msg.reply('Welcome to State of Survival Sign Up Bot. We currently support the following commands:\n\tff: Creates a signup for for Fortress Fight event (this is the default if no event is specified)\n\trr: Creates a signup for Reservoir Raid event\n\nIn addition we support the following flags:\n\tlimit=[number]: Sets the number of event fields that each user is limited to.\n\nFor more information, visit our official Discord server: https://discord.gg/KZXQ5ycR');
          return;
      }

      for(let i = 1; i < args.length; i++){
        if(args[i].toLowerCase().indexOf('limit=') === 0) {
          let tokens = args[i].split('=');
          lastFound = undefined;
          if(tokens.length > 1) {
            limitNum = parseInt(tokens[1]);
            if(!isNaN(limitNum)){
              limit = limitNum;
            }
          }
        } else if(args[i].toLowerCase().indexOf('restrict=') === 0) {
          let tokens = args[i].split('=');
          if(tokens.length > 1){
            lastFound = 'restrict';
            tokens = tokens[1].split(',');
            tokens.forEach((token) => {
              if(events[title][token]){
                restriction = restriction || [];
                restriction.push(token);
              } else if(keyMapping[token]){
                restriction = restriction || [];
                restriction.push(keyMapping[token]);
              }
            });
          }
        } else if(args[i].toLowerCase().indexOf('text=') === 0){
          let tokens = args[i].split('=');
          lastFound = 'customTitle';
          if(tokens.length > 1){
            customTitle = tokens[1];
          }
        } else if(lastFound === 'customTitle'){
          customTitle = (customTitle || '') + (' ' + args[i]);
        } else if(lastFound === 'restrict') {
          let key = args[i].replace(/,/g, '');
          if(events[title][key]){
            restriction = restriction || [];
            restriction.push(key);
          } else if(keyMapping[key]){
            restriction = restriction || [];
            restriction.push(keyMapping[key]);
          }
        }
      }
    } 

    embeds[msg.channel.id] = embeds[msg.channel.id] || {};
    if(embeds[msg.channel.id][title]){
      embeds[msg.channel.id][title].closed = true;

      if(embeds[msg.channel.id][title].message && typeof embeds[msg.channel.id][title].message.edit === 'function'){
        try {
          embeds[msg.channel.id][title].message.edit(renderEmbed(embeds[msg.channel.id][title], msg.channel.id));
        } catch(e) {
          msg.channel.send('Error. Please check bot permissions and try again');
        }
      }
    }

    embeds[msg.channel.id] = embeds[msg.channel.id] || {};
    embeds[msg.channel.id][title] = {title: title, closed: false, signedUp: {}, limit: limit, restriction: restriction, customTitle: customTitle, author: msg.author.id};

    const signup = renderEmbed(embeds[msg.channel.id][title], msg.channel.id);
   
    try {
      msg.channel.send(signup).then((msgRef) => {
        embeds[msg.channel.id][title].message = msgRef;

        fs.writeFileSync(`${config.dbPath}${config.dbPrefix}${msg.channel.id}-${title}.json`, JSON.stringify(embeds[msg.channel.id][title]), {flag: 'w'});

        let tokens = restriction || Object.keys(events[title]);
        let promises = [];

        tokens.forEach((token) => {
          promises.push(msgRef.react(token));
        });

        promises.push(msgRef.react('🔚'));

        Promise.all(promises)
          .catch(() => console.error('One of the emojis failed to react.'));
      });
    } catch(e){
      msg.channel.send('Error. Please check bot permissions and try again.');
    }
  }
});
 
client.login(config.loginToken);
