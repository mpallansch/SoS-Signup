const fs = require('fs');
const config = require('./constants/config.js');
const Discord = require('discord.js');
const client = new Discord.Client({"partials": ['CHANNEL', 'MESSAGE', 'REACTION', 'USER']});
const process = require('process');

process.on('uncaughtException', function(err){
  console.log(err);
});

const titleMapping = {
  'ff': 'Fortress Fight',
  'rr': 'Reservoir Raid',
  'svs': 'State VS State',
  'cc': 'Capital Clash',
  'tt': 'Trap Time',
};
const titles = Object.keys(titleMapping).map(key => titleMapping[key]);
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
    '🚩': 'Reservist',
    '❌': 'Unavailable'
  },
  'State VS State': {
    '🇦': '8-9 UTC',
    '🇧': '9-10 UTC',
    '🇨': '10-11 UTC',
    '🇩': '11-12 UTC',
    '🇪': '12-13 UTC',
    '🇫': '13-14 UTC',
    '🇬': '14-15 UTC',
    '🇭': '15-16 UTC',
    '🇮': '16-17 UTC',
    '🇯': '17-18 UTC',
    '🇰': '18-19 UTC',
    '🇱': '19-20 UTC',
    '🇲': '20-21 UTC',
    '🇳': '21-22 UTC',
    '🇴': '22-23 UTC'
  },
  'Capital Clash': {
    '🇦': '10-11 UTC',
    '🇧': '11-12 UTC',
    '🇨': '12-13 UTC',
    '🇩': '13-14 UTC',
    '🇪': '14-15 UTC',
    '🇫': '15-16 UTC',
    '🇬': '16-17 UTC',
    '🇭': '17-18 UTC',
    '🇮': '18-19 UTC',
    '🇯': '19-20 UTC',
    '🇰': '20-21 UTC',
    '🇱': '21-22 UTC'
  },
  'Trap Time': {
    '✅': 'Available',
    '❌': 'Unavailable'
  }
};
const keyLimitMapping = {
  '✅': 30,
  '🚩': 10,
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
  'M': '🇲',
  'N': '🇳',
  'O': '🇴',
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
  'm': '🇲',
  'n': '🇳',
  'o': '🇴',
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
  'X': '❌',
  'P': '✅',
  'R': '🚩',
  'U': '❌',
  'v': '✅',
  'x': '❌',
  'p': '✅',
  'r': '🚩',
  'u': '❌'
};

const expireCheckInterval = 2000;
const commandExpiry = 30000;
const responseExpiry = 60000;

let messageQueue = [];

const removeEmbed = (channel, title) => {
  delete embeds[channel][title];
  if(Object.keys(embeds[channel]) === 0){
    delete embeds[channel];
  }

  try {
    fs.unlinkSync(`${config.dbPath}${config.dbPrefix}${channel}-${title}.json`);
  } catch (e) {
    console.log(`Error removing database file ${channel}-${title}.json`, e);
  }
};

const renderEmbed = (embed, channel) => {
  let newEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle((embed.customTitle || (embed.title + ' Signup')) + ' | Status: ' + (embed.closed ? 'Closed' : 'Running'));

  if(embed.title !== 'State VS State' && embed.title !== 'Capital Clash'){
    let description = '';
    (embed.restriction || Object.keys(events[embed.title])).forEach((key) => {
      description += key + ': ' + events[embed.title][key] + ((embed.title !== 'Trap Time' && keyLimitMapping[key]) ? (' ' + (embed.signedUp[key] ? embed.signedUp[key].length : 0) + '/' + keyLimitMapping[key]) : '');
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

    newEmbed.setDescription(description);
  } else {
    (embed.restriction || Object.keys(events[embed.title])).forEach((key, index) => {
      let inline = embed.title === 'Capital Clash' ? true : (index >= 2 && index <= 13);

      let fieldValue = '';
      if(embed.signedUp[key] && embed.signedUp[key].length > 0){
        fieldValue += '```\n';
        embed.signedUp[key].forEach((user) => {
          fieldValue += user + '\n';
        });
        fieldValue += '```';
      } else { 
        fieldValue += '```\n​                  ' + (inline ? '' : '                 ') + '\n```';
      }

      newEmbed.addField(
        key + ': ' + events[embed.title][key] + ((embed.title !== 'Trap Time' && keyLimitMapping[key]) ? (' ' + (embed.signedUp[key] ? embed.signedUp[key].length : 0) + '/' + keyLimitMapping[key]) : ''),
        fieldValue, 
        inline
      );
    });
  }

  return newEmbed;
};

const violatesCategoryLimit = (embed, key) => {
  if(embed.title !== 'Trap Time' && keyLimitMapping[key] && embed.signedUp[key] && embed.signedUp[key].length === keyLimitMapping[key]){
    return true;
  }
  return false;
};

const violatesUserLimit = (embed, nickname) => {
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

const sendMessage = (channel, message, expiresAfter = responseExpiry) => {
  if(channel && channel.send){
    channel.send(message).then((msg) => {
      messageQueue.push({message: msg, expires: Date.now() + expiresAfter});
    }).catch(() => {
      console.log('Error sending message');
    });
  }
};

const getEmbedFromKey = (channelId, key) => {
  let possibilities = [];

  Object.keys(events).forEach(eventKey => {
    if(events[eventKey][key] && embeds[channelId][eventKey]){
      possibilities.push(embeds[channelId][eventKey]);
    }
  });

  if(possibilities.length > 0){
    let current = possibilities[0];

    for(let i = 1; i < possibilities.length; i++){
      if(!current.created && possibilities[i].created || current.created < possibilities[i].created){
        current = possibilities[i];
      }
    }

    return current;
  }
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
  for(var i = 0; i < titles.length; i++){
    if(embeds[channel][titles[i]] && embeds[channel][titles[i]].message.id === react.message.id){
      embed = embeds[channel][titles[i]];
      break;
    }
  }
  if(!embed){
    return;
  }

  if(react.emoji.name === '🔚' && (author.id === embed.author || member.hasPermission("ADMINISTRATOR"))){
    embed.closed = true;

    try {
      embed.message.edit(renderEmbed(embed, channel)).then(() => {
        
      });
    } catch(e) {
      sendMessage(react.message.channel, 'Error. Please check bot permissions and try again.');
    }
  } else if(events[embed.title][react.emoji.name] && !embed.closed) {
    if(violatesUserLimit(embed, nickname)){
      sendMessage(react.message.channel, '<@' + author.id  + '> You have exceeded your signup limit');
      return;
    }
    if(violatesCategoryLimit(embed, react.emoji.name)){
      sendMessage(react.message.channel, 'Category has reached the limit.');
      return;
    }

    embed.signedUp[react.emoji.name] = embed.signedUp[react.emoji.name] || [];
    embed.signedUp[react.emoji.name].push(nickname);
    try {
      embed.message.edit(renderEmbed(embed, channel));
    } catch(e) {
      sendMessage(react.message.channel, 'Error. Please check bot permissions and try again.');
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
  for(var i = 0; i < titles.length; i++){
    if(embeds[channel][titles[i]] && embeds[channel][titles[i]].message.id === react.message.id){
      embed = embeds[channel][titles[i]];
      break;
    }
  }
  if(!embed){
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
      sendMessage(react.message.channel, 'Error. Please check bot permissions and try again.');
    }
  }
});
 
client.on('message', async (msg) => {
  const args = (msg.content && msg.content.length > 0 ) ? msg.content.split(' ') : [''];

  if (args[0].toLowerCase() === '.add' || args[0].toLowerCase() === '.remove'){
    if(args.length >= 3){
      let key = keyMapping[args[args.length - 1]] || keyMapping[args[args.length - 1].toLowerCase()] || args[args.length - 1];
      let embed = getEmbedFromKey(msg.channel.id, key);

      if(embed){
        let allNames = '';
        for(var i = 1; i < args.length - 1; i++){
          allNames += args[i] + ' ';
        }
        let allNamesArray = allNames.split(',');
        for(var i = 0; i < allNamesArray.length; i++){
          let name = allNamesArray[i].trim();

          let member, nickname;
          if(name.indexOf('<@') === 0 && name.indexOf('>') === (name.length - 1)){
            member = await msg.guild.members.fetch(name.substring(2, name.length - 1).replace(/\!/g,''));
            nickname = member.displayName;
          }

          if(args[0] === '.add'){
            if(!violatesUserLimit(embed, name)){
              if(!violatesCategoryLimit(embed, key)){
                embed.signedUp[key] = embed.signedUp[key] || [];
                embed.signedUp[key].push(nickname || name);
              } else {
                sendMessage(msg.channel, 'Adding user would exceed category limit.');
              }
            } else {
              sendMessage(msg.channel, 'Adding user would exceed limit.');
            }
          } else {
            if(embed.signedUp[key] && embed.signedUp[key].indexOf(nickname || name) !== -1){
              embed.signedUp[key] = embed.signedUp[key].filter(user => user !== (nickname || name));
            } else {
              sendMessage(msg.channel, 'User is not registered.');
            }
          }
        }
        
        try {
          embed.message.edit(renderEmbed(embed, msg.channel.id));
        } catch(e) {
          console.log(e);
          sendMessage(msg.channel, 'Error. Please check bot permissions and try again.');
        }
      } else {
        sendMessage(msg.channel, 'Unable to find signup running in this channel with provided category ' + key);
      }
    } else {
      sendMessage(msg.channel, 'Invalid number of parameters. Usage: ' + args[0] + ' [name] [category]');
    }

    messageQueue.push({message: msg, expires: Date.now() + commandExpiry});
  } else if (args[0].toLowerCase() === '.signup') {
    let title = titles[0];
    let lastFound;
    let customTitle;
    let limit;
    let restriction;

    if(args.length > 1 && typeof args[1] === 'string') {
      if(titleMapping[args[1].toLowerCase()]){
        title = titleMapping[args[1].toLowerCase()];
      } else {
        msg.reply('Welcome to State of Survival Sign Up Bot. We currently support the following commands:\n\tff: Fortress Fight (this is the default if no event is specified)\n\trr: Reservoir Raid\n\tsvs: State vs. State\n\tcc: Capital Clash\n\ttt: Trap Time\n\nIn addition we support the following flags:\n\tlimit=[number]: Sets the number of event fields that each user is limited to.\n\trestrict=[categories, comma separated]: Restricts the signup to certain categories\n\ttext=[Header text]: Specifies text that should be shown in the header of the signup\n\nFor more information, visit our official Discord server: https://discord.gg/zcY9DsdKp9');
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
          sendMessage(msg.channel, 'Error. Please check bot permissions and try again');
        }
      }
    }

    embeds[msg.channel.id] = embeds[msg.channel.id] || {};
    embeds[msg.channel.id][title] = {created: Date.now(), title: title, closed: false, signedUp: {}, limit: limit, restriction: restriction, customTitle: customTitle, author: msg.author.id};

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
      sendMessage(msg.channel, 'Error. Please check bot permissions and try again.');
    }

    messageQueue.push({message: msg, expires: Date.now() + commandExpiry});
  }
});

setInterval(() => {
  for(var i = 0; i < messageQueue.length; i++){
    if(messageQueue[i].expires <= Date.now()){
      let message = messageQueue[i].message;

      messageQueue.splice(i, 1);

      message.delete();
    }
  }
}, expireCheckInterval);
 
client.login(config.loginToken);
