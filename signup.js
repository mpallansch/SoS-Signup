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
    embed.signedUp[react.emoji.name] = embed.signedUp[react.emoji.name] || [];
    embed.signedUp[react.emoji.name].push(react.message.guild.member(author).displayName);
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
console.log(msg.content);
  if (msg.content.indexOf('.signup') === 0) {
    let title = ffTitle;

    const args = msg.content.split(' ');
    if(args.length > 1 && args[1].toLowerCase() === 'rr') {
      title = rrTitle;
    } 

    embeds[msg.channel.id] = embeds[msg.channel.id] || {};
    embeds[msg.channel.id][title] = {title: title, closed: false, signedUp: {}};

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