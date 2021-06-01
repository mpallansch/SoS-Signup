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
  '1': '1️⃣',
  '2': '2️⃣',
  '3': '3️⃣',
  '4': '4️⃣',
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
  'u': '❌',
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

  if(react.emoji.name === '🔚' && react.message.guild.member(author).hasPermission("ADMINISTRATOR")){
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
    if(react.emoji.name === '🔚' && react.message.guild.member(author).hasPermission("ADMINISTRATOR")){
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

  if (msg.content.indexOf('.signup') === 0) {
    let title = ffTitle;
    let customTitle;
    let limit;
    let restriction;

    const args = msg.content.split(' ');
    if(args.length > 1) {
      switch(args[1]){
        case 'rr':
          title = rrTitle;
          break;
        case 'add':
          if(args.length >= 5){
            if((args[2] === 'rr' || args[2] === 'ff')){
              let title = args[2] === 'rr' ? rrTitle : ffTitle;
              if(embeds[msg.channel.id] && embeds[msg.channel.id][title]){
                let embed = embeds[msg.channel.id][title];
                if(events[title][args[3]] || keyMapping[args[3]]){
                  let key = keyMapping[args[3]] || args[3];
                  
                  if(!violatesLimit(embed, args[4])){
                    embed.signedUp[key] = embed.signedUp[key] || [];
                    embed.signedUp[key].push(args[4]);

                    try {
                      embed.message.edit(renderEmbed(embed, msg.channel.id));
                    } catch(e) {
                      msg.channel.send('Error. Please check bot permissions and try again.');
                    }
                  } else {
                    msg.channel.send('Adding user would exceed limit.');
                  }
                } else {
                  msg.channel.send('Unknown category.');
                }
              } else {
                msg.channel.send('Unable to find signup running in this channel. Create one before adding users.');
              }
            } else {
              msg.channel.send('Unknown event. Current options are `rr` and `ff`');
            }
          } else {
            msg.channel.send('Invalid number of parameters. Usage: .signup add [event] [category] [name]');
          }

          msg.delete();
          return;
        case 'remove':
          if(args.length >= 5){
            if((args[2] === 'rr' || args[2] === 'ff')){
              let title = args[2] === 'rr' ? rrTitle : ffTitle;
              if(embeds[msg.channel.id][title]){
                let embed = embeds[msg.channel.id][title];
                if(events[title][args[3]] || keyMapping[args[3]]){
                  let key = keyMapping[args[3]] || args[3];
                  
                  if(embed.signedUp[key] && embed.signedUp[key].indexOf(args[4]) !== -1){
                    embed.signedUp[key] = embed.signedUp[key].filter(user => user !== args[4]);

                    try {
                      embed.message.edit(renderEmbed(embed, msg.channel.id));
                    } catch(e) {
                      msg.channel.send('Error. Please check bot permissions and try again.');
                    }
                  } else {
                    msg.channel.send('User is not registered.');
                  }
                } else {
                  msg.channel.send('Unknown category.');
                }
              } else {
                msg.channel.send('Unable to find signup running in this channel. Create one before adding users.');
              }
            } else {
              msg.channel.send('Unknown event. Current options are `rr` and `ff`');
            }
          } else {
            msg.channel.send('Invalid number of parameters. Usage: .signup add [event] [category] [name]');
          }

          msg.delete();
          return;
        case 'help':
          msg.reply('Welcome to State of Survival Sign Up Bot. We currently support the following commands:\n\tff: Creates a signup for for Fortress Fight event (this is the default if no event is specified)\n\trr: Creates a signup for Reservoir Raid event\n\nIn addition we support the following flags:\n\tlimit=[number]: Sets the number of event fields that each user is limited to.\n\nFor more information, visit our official Discord server: https://discord.gg/KZXQ5ycR');
          return;
      }

      for(let i = 1; i < args.length; i++){
        if(args[i].indexOf('limit=') === 0) {
          let tokens = args[i].split('=');
          if(tokens.length > 1) {
            limitNum = parseInt(tokens[1]);
            if(!isNaN(limitNum)){
              limit = limitNum;
            }
          }
        } else if(args[i].indexOf('restrict=') === 0) {
          let tokens = args[i].split('=');
          if(tokens.length > 1){
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
        } else if(args[i].indexOf('text=') === 0){
          let tokens = args[i].split('=');
          if(tokens.length > 1){
            customTitle = tokens[1];
          }
        } else if(customTitle){
          customTitle += (' ' + args[i]);
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
    embeds[msg.channel.id][title] = {title: title, closed: false, signedUp: {}, limit: limit, restriction: restriction, customTitle: customTitle};

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
