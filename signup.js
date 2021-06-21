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
titles.push('Custom');
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
  'u': '❌',
  1: '1️⃣',
  2: '2️⃣',
  3: '3️⃣',
  4: '4️⃣',
  5: '5️⃣',
  6: '6️⃣',
  7: '7️⃣',
  8: '8️⃣',
  9: '9️⃣',
  10: '🔟'
};
const reverseKeyMapping = {
  '1️⃣': 0,
  '2️⃣': 1,
  '3️⃣': 2,
  '4️⃣': 3,
  '5️⃣': 4,
  '6️⃣': 5,
  '7️⃣': 6,
  '8️⃣': 7,
  '9️⃣': 8,
  '🔟': 9
};
const customKeys = ['🇦','🇧','🇨','🇩','🇪','🇫','🇬','🇭','🇮','🇯','🇰','🇱','🇲','🇳','🇴','🇵','🇶','🇷','🇸','🇹','🇺','🇻','🇼','🇽','🇾','🇿','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];

const expireCheckInterval = 2000;
const commandExpiry = 30000;
const responseExpiry = 60000;

let embeds = {};
let roleEmbeds = {};
let customLimits = {};
let conversations = {};
let messageQueue = [];

const removeEmbed = (channel, title) => {
  delete embeds[channel][title];
  if(Object.keys(embeds[channel]) === 0){
    delete embeds[channel];
  }

  try {
    fs.unlinkSync(`${config.dbEmbedsPath}${config.dbPrefix}${channel}-${title}.json`);
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
    (embed.restriction || Object.keys(embed.customCategories || events[embed.title])).forEach((key) => {
      description += key + ': ' + (embed.customCategories || events[embed.title])[key] + ((embed.title !== 'Trap Time' && keyLimitMapping[key]) ? (' ' + (embed.signedUp[key] ? embed.signedUp[key].length : 0) + '/' + keyLimitMapping[key]) : '');
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
      fs.writeFileSync(`${config.dbEmbedsPath}${config.dbPrefix}${channel}-${embed.title}.json`, JSON.stringify(dbEmbed), {flag: 'w'});
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

const renderEmbedInitial = (embed, channel) => {
  const signup = renderEmbed(embed, channel.id);
   
  try {
    channel.send(signup).then((msgRef) => {
      embed.message = msgRef;

      fs.writeFileSync(`${config.dbEmbedsPath}${config.dbPrefix}${channel.id}-${embed.title}.json`, JSON.stringify(embed), {flag: 'w'});

      let tokens = embed.restriction || Object.keys(embed.customCategories || events[embed.title]);
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
};

const replyConversation = (message, conversation, text) => {
  if(conversation.currentMessage){
    conversation.currentMessage.delete();
  }

  try {
    message.reply(text).then((msgRef) => {
      conversation.currentMessage = msgRef;

      message.delete();
    });
  } catch(e) {

  }
};

const violatesCustomLimit = (embed, alliance, category) => {
  if(!embed || embed.title !== 'Fortress Fight' || !embed.customLimit) {
    return false;
  }

  let limitName = 'bunkerLimit';

  let currentValues = {bunkerLimit: 0, facilityLimit: 0};
  Object.keys(events['Fortress Fight']).forEach((key, index) => {
    if(embed.signedUp[key] && embed.signedUp[key].indexOf(alliance) !== -1){
      if(index < 12) {
        currentValues.bunkerLimit++;
      } else {
        currentValues.facilityLimit++;
      }
    }
    if(key === category && index >= 12){
      limitName = 'facilityLimit';
    }
  });

  let violation = false;

  embed.customLimit.forEach((limit) => {
    if(limit.roles.indexOf(alliance) !== -1){
      if(limit[limitName] <= currentValues[limitName]){
        violation = true;
      }
    }
  });

  return violation;
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

  if(customKeys.indexOf(key) !== -1 && embeds[channelId]['Custom']){
    possibilities.push(embeds[channelId]['Custom']);
  }

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

const sendRoleEmbed = (originalEmbed, channel, user, roles, category, action) => {
  let embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setDescription('SoS Signup Alliance Select | <@' + user + '>')
    .setTitle('You have multiple possible alliance roles. Please select from the list below.');

    roles.forEach((role, i) => {
      embed.addField(keyMapping[(i + 1)], role, true);
    });

  try {
    channel.send(embed).then((msgRef) => {
      roleEmbeds[msgRef.id] = {originalEmbed, roles, user, category, action, selected: []};
      let promises = roles.map((r, i) => msgRef.react(keyMapping[(i + 1)]));
      promises.push(msgRef.react('✅'));
    
      Promise.all(promises)
        .catch(() => console.error('One of the emojis failed to react.'));
    });
  } catch(e) {
    console.log('Message failed to send');
  }
};

const getReactionInfo = async (react, author, action) => {
  if (react.message.partial) await react.message.fetch();

  let channel = react.message.channel;

  if(author.bot || !embeds[channel.id]){
    return {};
  }

  let member = await react.message.guild.members.fetch(author);
  let nickname = member.displayName;
  let role;

  if(roleEmbeds[react.message.id]){
    return {nickname, member, channel, embed: {id: react.message.id, type: 'role', info: roleEmbeds[react.message.id]}};
  }

  let embed;
  for(var i = 0; i < titles.length; i++){
    if(embeds[channel.id][titles[i]] && embeds[channel.id][titles[i]].message.id === react.message.id){
      embed = embeds[channel.id][titles[i]];
      break;
    }
  }
  if(!embed){
    return {};
  }

  if(react.emoji.name !== '🔚' && embed.role){
    if(!member.roles.cache){
      await react.message.guild.roles.fetch();
    }

    if(member.roles.cache) {
      let roles = member.roles.cache
      .filter(r => {if(r.name.length === 3 && (action !== 'remove' || embed.signedUp[react.emoji.name].indexOf(r.name) !== -1)) return true})
      .map(r => r.name).slice(0,10);

      if(roles.length > 1){
        sendRoleEmbed(embed, channel, member, roles, react.emoji.name, action);
        return {};
      } else if(roles.length === 1) {
        role = roles[0];
      }
    }
  }

  return {member, role, nickname, embed, channel};
};

const addToCategory = (embed, toAdd, category, channel, author, isAdmin) => {
  if(category === '🔚' && (author.id === embed.author || isAdmin)){
    embed.closed = true;

    try {
      embed.message.edit(renderEmbed(embed, channel.id)).then(() => {
        
      });
    } catch(e) {
      sendMessage(channel, 'Error. Please check bot permissions and try again.');
    }
  } else if((embed.customCategories || events[embed.title])[category] && !embed.closed) {
    if(violatesUserLimit(embed, toAdd)){
      sendMessage(channel, '<@' + author.id  + '> You have exceeded your signup limit');
      return;
    }
    if(violatesCategoryLimit(embed, category)){
      sendMessage(channel, 'Category has reached the limit.');
      return;
    }
    if(violatesCustomLimit(embed, toAdd, category)){
      sendMessage(channel, 'Alliance cap has been reached.');
      return;
    }

    embed.signedUp[category] = embed.signedUp[category] || [];
    embed.signedUp[category].push(toAdd);
    try {
      embed.message.edit(renderEmbed(embed, channel.id));
    } catch(e) {
      sendMessage(channel, 'Error. Please check bot permissions and try again.');
    }
  }
};

const removeFromCategory = (embed, toRemove, category, channel, author, isAdmin) => {
  if(embed.signedUp[category]){
    if(category === '🔚' && (author.id === embed.author || isAdmin)){
      embed.closed = false;
    } else if((embed.customCategories || events[embed.title])[category] && !embed.closed) {
      embed.signedUp[category] = embed.signedUp[category].filter(user => user !== toRemove);
    }
    
    try {
      embed.message.edit(renderEmbed(embed, channel.id));
    } catch(e) {
      sendMessage(channel, 'Error. Please check bot permissions and try again.');
    }
  }
};
 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  fs.readdirSync(config.dbLimitsPath).forEach(fileName => {
    if(fileName.indexOf(config.dbPrefix) === 0){
      let dbLimit = fs.readFileSync(`${config.dbLimitsPath}${fileName}`);
      try {
        let limit = JSON.parse(dbLimit);
        let tokens = fileName.split('.')[0].split('-');
        if(tokens.length > 2) {
          customLimits[tokens[1]] = customLimits[tokens[1]] || {};
          customLimits[tokens[1]][tokens[2]] = limit;
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

  fs.readdirSync(config.dbEmbedsPath).forEach(fileName => {
    if(fileName.indexOf(config.dbPrefix) === 0){
      let dbEmbed = fs.readFileSync(`${config.dbEmbedsPath}${fileName}`);
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
  const { role, embed, member, nickname, channel } = await getReactionInfo(react, author, 'add');

  if(!embed) {
    return;
  }

  if(embed.type === 'role') {
    if(react.emoji.name === '✅'){
      roleEmbeds[embed.id].selected.forEach((selectedRole) => {
        if(embed.info.action === 'add'){
          addToCategory(embed.info.originalEmbed, selectedRole,  embed.info.category, channel, author, member.hasPermission("ADMINISTRATOR"));
        } else {
          removeFromCategory(embed.info.originalEmbed, selectedRole,  embed.info.category, channel, author, member.hasPermission("ADMINISTRATOR"));
        }
      });
      delete roleEmbeds[embed.id];
      react.message.delete();
    } else {
      roleEmbeds[embed.id].selected.push(embed.info.roles[reverseKeyMapping[react.emoji.name]]);
    }
  } else {
    addToCategory(embed, (role || nickname), react.emoji.name, channel, author, member.hasPermission("ADMINISTRATOR"));
  }
});

client.on('messageReactionRemove', async (react, author) => {
  const { role, embed, member, nickname, channel } = await getReactionInfo(react, author, 'remove');

  if(!embed) {
    return;
  }

  removeFromCategory(embed, (role || nickname), react.emoji.name, channel, author, member.hasPermission("ADMINISTRATOR"));
});
 
client.on('message', async (msg) => {
  const args = (msg.content && msg.content.length > 0 ) ? msg.content.split(' ') : [''];

  if(conversations[msg.channel.id] && conversations[msg.channel.id][msg.author.id]) {
    let conversation = conversations[msg.channel.id][msg.author.id];
    if(conversation.state === 'role'){
      conversation.limits.push({roles: msg.content.split(',')});
      conversation.state = 'bunkers';
      replyConversation(msg, conversation, 'How many bunkers should they be limited to?');
    } else if(conversation.state === 'bunkers'){
      let bunkerLimit = parseInt(msg.content);
      if(isNaN(bunkerLimit)){
        replyConversation(msg, conversation, 'Please enter a valid number');
      } else {
        conversation.limits[conversation.limits.length - 1].bunkerLimit = bunkerLimit;
        conversation.state = 'facilities';
        replyConversation(msg, conversation, 'How many facilities should they be limited to?');
      }
    } else if(conversation.state === 'facilities'){
      let facilityLimit = parseInt(msg.content);
      if(isNaN(facilityLimit)){
        replyConversation(msg, conversation, 'Please enter a valid number');
      } else {
        conversation.limits[conversation.limits.length - 1].facilityLimit = facilityLimit;
        conversation.state = 'more';
        replyConversation(msg, conversation, 'Any more roles?');
      }
    } else if(conversation.state === 'more') {
      if(msg.content.toLowerCase() === 'yes' || msg.content.toLowerCase() === 'y'){
        conversation.state = 'role';
        replyConversation(msg, conversation, 'What role(s) would you like to limit? If typing plain text, type the role exactly how it is displayed.');
      } else {
        conversation.state = 'save';
        replyConversation(msg, conversation, 'Would you like to save this limitation?');
      }
    } else if(conversation.state === 'save'){
      if(msg.content.toLowerCase() === 'yes' || msg.content.toLowerCase() === 'y'){
        conversation.state = 'id';
        replyConversation(msg, conversation, 'What would you like to save it as?');
      } else {
        conversation.embed.customLimit = conversation.limits;

        renderEmbedInitial(conversation.embed, msg.channel);

        msg.delete();

        delete conversations[msg.channel.id][msg.author.id];
        if(Object.keys(conversations[msg.channel.id]).length === 0){
          delete conversations[msg.channel.id];
        }
      }
    } else if(conversation.state === 'id'){
      customLimits[msg.channel.id] = customLimits[msg.channel.id] || {};
      customLimits[msg.channel.id][encodeURIComponent(msg.content)] = conversation.limits;

      fs.writeFileSync(`${config.dbLimitsPath}${config.dbPrefix}${msg.channel.id}-${encodeURIComponent(msg.content)}.json`, JSON.stringify(conversation.limits), {flag: 'w'});
      
      sendMessage(msg.channel, 'Saved as "' + msg.content  + '". To view your alliance caps, type `.caps`');

      msg.delete();

      delete conversations[msg.channel.id][msg.author.id];
      if(Object.keys(conversations[msg.channel.id]).length === 0){
        delete conversations[msg.channel.id];
      }
    }
  } else if(args[0].toLowerCase() === '.caps') {
    if(args.length > 2 && args[1] === 'remove') {
      if(customLimits[msg.channel.id] && customLimits[msg.channel.id][encodeURIComponent(args[2])]){
        delete customLimits[msg.channel.id][encodeURIComponent(args[2])];
        if(Object.keys(customLimits[msg.channel.id]).length === 0){
          delete customLimits[msg.channel.id];
        }
        fs.unlinkSync(`${config.dbLimitsPath}${config.dbPrefix}${msg.channel.id}-${encodeURIComponent(args[2])}.json`);


        sendMessage(msg.channel, 'Deleted alliance cap with id: ' + args[2]);
      } else {
        sendMessage(msg.channel, 'Unable to find alliance cap in this channel with id: ' + args[2]);
      }
    } else {
      if(customLimits[msg.channel.id]){
        let embed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Alliance caps in this channel');

          Object.keys(customLimits[msg.channel.id]).forEach((key) => {
            embed.addField('Key', key, false);
            customLimits[msg.channel.id][key].forEach((limit) => {
              embed.addField('Roles: ' + limit.roles.join(', '), '`Bunkers: ' + limit.bunkerLimit + ' | Facilities: ' + limit.facilityLimit + '`', true);
            });
            embed.addField('\u200b\n', '\u200b', false);
          });

        try {
          msg.channel.send(embed).then((msgRef) => {
            messageQueue.push({message: msgRef, expires: Date.now() + commandExpiry});
          });
        } catch(e) {
          console.log(e);
          console.log('Message failed to send');
        }
      } else {
        sendMessage(msg.channel, 'There are no alliance caps saved to this channel.');
      }
    }

    messageQueue.push({message: msg, expires: Date.now() + commandExpiry});
  } else if (args[0].toLowerCase() === '.add' || args[0].toLowerCase() === '.remove'){
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
                if(!violatesCustomLimit(embed, name, key)){
                  embed.signedUp[key] = embed.signedUp[key] || [];
                  embed.signedUp[key].push(nickname || name);
                } else {
                  sendMessage(msg.channel, 'Adding would exceed alliance cap.');
                }
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
    let role = false;
    let lastFound;
    let customCategories;
    let customTitle;
    let customLimit;
    let limit;
    let restriction;

    if(args.length > 1 && typeof args[1] === 'string') {
      if(titleMapping[args[1].toLowerCase()]){
        title = titleMapping[args[1].toLowerCase()];
      } else if(args[1].toLowerCase().indexOf('custom=') === 0 && args[1].length > 7) {
        title = 'Custom';
        lastFound = 'customCategory';
        customCategories = args[1].split('=')[1].split(',');
      } else {
        msg.reply('Welcome to State of Survival Sign Up Bot. We currently support the following commands:\n\tff: Fortress Fight (this is the default if no event is specified)\n\trr: Reservoir Raid\n\tsvs: State vs. State\n\tcc: Capital Clash\n\ttt: Trap Time\n\nIn addition we support the following flags:\n\tlimit=[number]: Sets the number of event fields that each user is limited to.\n\trestrict=[categories, comma separated]: Restricts the signup to certain categories\n\ttext=[Header text]: Specifies text that should be shown in the header of the signup\n\nFor more information, visit our official Discord server: https://discord.gg/zcY9DsdKp9');
        return;
      }

      for(let i = 2; i < args.length; i++){
        if(args[i].toLowerCase().indexOf('limit=') === 0) {
          let tokens = args[i].split('=');
          lastFound = undefined;
          if(tokens.length > 1) {
            limitNum = parseInt(tokens[1]);
            if(!isNaN(limitNum)){
              limit = limitNum;
            }
          }
        } else if(args[i].toLowerCase().indexOf('role=') === 0){
          let tokens = args[i].split('=');
          lastFound = undefined;
          if(tokens.length > 1 && tokens[1] === 'true'){
            role = true;
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
        } else if(args[i].toLowerCase() === ('cap') && title === 'Fortress Fight') {
          conversations[msg.channel.id] = conversations[msg.channel.id] || {};
          conversations[msg.channel.id][msg.author.id] = {limits: [], state: 'role'};
        } else if(lastFound === 'customCategory'){
          let tokens = args[i].split(',');
          customCategories[customCategories.length - 1] = customCategories[customCategories.length - 1] + ' ' + tokens[0];
          if(tokens.length > 1){
            customCategories.push(tokens[1]);
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
        } else if(customLimits[msg.channel.id] && customLimits[msg.channel.id][encodeURIComponent(args[i])]){
          customLimit = customLimits[msg.channel.id][encodeURIComponent(args[i])];
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

    if(customCategories){
      let customCategoriesObj = {};

      customCategories.forEach((cat, index) => {
        customCategoriesObj[customKeys[index]] = cat;
      });

      customCategories = customCategoriesObj;
    }

    embeds[msg.channel.id] = embeds[msg.channel.id] || {};
    embeds[msg.channel.id][title] = {created: Date.now(), title: title, customLimit, customCategories, role: (title === 'Fortress Fight' || role), closed: false, signedUp: {}, limit: limit, restriction: restriction, customTitle: customTitle, author: msg.author.id};

    if(conversations[msg.channel.id] && conversations[msg.channel.id][msg.author.id]){
      conversations[msg.channel.id][msg.author.id].embed = embeds[msg.channel.id][title];
      replyConversation(msg, conversations[msg.channel.id][msg.author.id], 'What role(s) would you like to limit? If typing plain text, type the role exactly how it is displayed.');
    } else {
      renderEmbedInitial(embeds[msg.channel.id][title], msg.channel);
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
