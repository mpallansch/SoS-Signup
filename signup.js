const fs = require('fs');
const config = require('./constants/config.js');
const Discord = require('discord.js');
const client = new Discord.Client();

const embeds = {};
const events = {
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
};

const renderDescription = (signedUp, closed) => {
  let description = 'Status: ' + (closed ? 'Closed' : 'Running') + '\n\n';
  Object.keys(events).forEach((key) => {
    description += key + ': ' + events[key];
    if(signedUp[key] && signedUp[key].length > 0){
      description += '​\n```\n';
      signedUp[key].forEach((user) => {
        description += user + '\n';
      });
      description += '```\n'
    } else { 
      description += '\n```\n​                                   \n```\n'
    }
  });
  return description;
};
 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageReactionAdd', (react, author) => {
  let channel = react.message.channel.id;
  if(!author.bot && embeds[channel]){
    if(react.emoji.name === '🔚' && react.message.guild.member(author).hasPermission("ADMINISTRATOR")){
      embeds[channel].closed = true;
    } else if(events[react.emoji.name] && !embeds[channel].closed) {
      embeds[channel].signedUp[react.emoji.name] = embeds[channel].signedUp[react.emoji.name] || [];
      embeds[channel].signedUp[react.emoji.name].push(react.message.guild.member(author).displayName);
    }

    embeds[channel].message.edit(new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setDescription(renderDescription(embeds[channel].signedUp, embeds[channel].closed)));
  }
});

client.on('messageReactionRemove', (react, author) => {
  let channel = react.message.channel.id;
  let nickname = react.message.guild.member(author).displayName;
  if(!author.bot && embeds[channel] && embeds[channel].signedUp[react.emoji.name]){
    if(react.emoji.name === '🔚' && react.message.guild.member(author).hasPermission("ADMINISTRATOR")){
      embeds[channel].closed = false;
    } else if(events[react.emoji.name] && !embeds[channel].closed) {
      embeds[channel].signedUp[react.emoji.name] = embeds[channel].signedUp[react.emoji.name].filter(user => user !== nickname);
    }
    
    embeds[channel].message.edit(new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setDescription(renderDescription(embeds[channel].signedUp, embeds[channel].closed)));
  }
});
 
client.on('message', msg => {

  let log = (msg.channel.guild ? msg.channel.guild.name : 'PM') + ' | ' + msg.channel.name + ' | ' + msg.author.username + ': ' + msg.content;
  if (msg.attachments.size > 0) {
    log += '\n\tAttachments:';
    if (msg.attachments.every((attachment) => { log += '\n\t\t' + attachment.url; })){
        //no op
    }
  }
  log += '\n'
  fs.appendFile('logs/' + new Date().toLocaleDateString('en-US').replace(/\//g, '-') + '.txt', log, function(){
    //no op
  });

  if (msg.content.indexOf('.signup') === 0) {
    const signup = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setDescription(renderDescription({}, false));
   
    msg.channel.send(signup).then((msgRef) => {
      embeds[msg.channel.id] = {closed: false, message: msgRef, signedUp: {}};

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
    });
  }
});
 
client.login(config.loginToken);