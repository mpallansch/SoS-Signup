const fs = require('fs');
const config = require('./constants/config.js');
const Discord = require('discord.js');
const client = new Discord.Client();

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

const renderEmbed = (embed) => {
  let description = '';
  Object.keys(events[embed.title]).forEach((key) => {
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
  
  return new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(embed.title + ' Signup | Status: ' + (embed.closed ? 'Closed' : 'Running'))
      .setDescription(description);
};
 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageReactionAdd', (react, author) => {
  let channel = react.message.channel.id;
  let nickname = react.message.guild.member(author).displayName;
  if(author.bot || !embeds[channel]){
    return;
  }

  let embed;
  let ffEmbed = embeds[channel][ffTitle];
  let rrEmbed = embeds[channel][rrTitle];
  if(ffEmbed.message.id === react.message.id){
    embed = ffEmbed;
  } else if(rrEmbed.message.id === react.message.id) {
    embed = rrEmbed;
  } else {
    return;
  }

  if(react.emoji.name === '🔚' && react.message.guild.member(author).hasPermission("ADMINISTRATOR")){
    embed.closed = true;

    embed.message.edit(renderEmbed(embed)).then(() => {
      delete embeds[channel][embed.title];
      if(!embeds[channel][rrTitle] && !embeds[ffTitle]){
        delete embeds[channel];
      }
    });
  } else if(events[embed.title][react.emoji.name] && !embed.closed) {
    if(embed.limit){
      let currentSignups = 0;
      Object.keys(embed.signedUp).forEach((symbol) => {
        if(embed.signedUp[symbol].indexOf(nickname) !== -1) {
          currentSignups++;
        }
      });

      if(currentSignups >= embed.limit){
        react.message.channel.send('<@' + author.id  + '> You have exceeded your signup limit');
        return;
      }
    }

    embed.signedUp[react.emoji.name] = embed.signedUp[react.emoji.name] || [];
    embed.signedUp[react.emoji.name].push(nickname);
    embed.message.edit(renderEmbed(embed));
  }
});

client.on('messageReactionRemove', (react, author) => {
  let channel = react.message.channel.id;
  let nickname = react.message.guild.member(author).displayName;
  if(author.bot || !embeds[channel]){
    return;
  }

  let embed;
  let ffEmbed = embeds[channel][ffTitle];
  let rrEmbed = embeds[channel][rrTitle];
  if(ffEmbed.message.id === react.message.id){
    embed = ffEmbed;
  } else if(rrEmbed.message.id === react.message.id) {
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
    
    embed.message.edit(renderEmbed(embed));
  }
});
 
client.on('message', msg => {

  if (msg.content.indexOf('.signup') === 0) {
    let title = ffTitle;
    let limit;

    const args = msg.content.split(' ');
    if(args.length > 1) {
      switch(args[1]){
        case 'rr':
          title = rrTitle;
          break;
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
        }
      }
    } 

    embeds[msg.channel.id] = embeds[msg.channel.id] || {};
    embeds[msg.channel.id][title] = {title: title, closed: false, signedUp: {}, limit: limit};

    const signup = renderEmbed(embeds[msg.channel.id][title]);
   
    msg.channel.send(signup).then((msgRef) => {
      embeds[msg.channel.id][title].message = msgRef

      if(title === ffTitle) {
        Promise.all([
          msgRef.react('🇦'),
          msgRef.react('🇧'),
          msgRef.react('🇨'),
          msgRef.react('🇩'),
          msgRef.react('🇪'),
          msgRef.react('🇫'),
          msgRef.react('🇬'),
          msgRef.react('🇭'),
          msgRef.react('🇮'),
          msgRef.react('🇯'),
          msgRef.react('🇰'),
          msgRef.react('🇱'),
          msgRef.react('1️⃣'),
          msgRef.react('2️⃣'),
          msgRef.react('3️⃣'),
          msgRef.react('4️⃣'),
          msgRef.react('🔚')
        ])
        .catch(() => console.error('One of the emojis failed to react.'));
      } else {
        Promise.all([
          msgRef.react('✅'),
          msgRef.react('⭕'),
          msgRef.react('❌'),
          msgRef.react('🔚')
        ])
        .catch(() => console.error('One of the emojis failed to react.'));
      }
    });
  }
});
 
client.login(config.loginToken);