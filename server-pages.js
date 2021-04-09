const config = require('./constants/config.js');
const Discord = require('discord.js');
const client = new Discord.Client();
 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

  if (msg.content.indexOf('.signup') === 0) {

    const args = msg.content.split(' ');
    if(args.length > 1) {
      switch(args[1]){
        case 'rules':
          msg.channel.send(new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Discord Rules')
            .setDescription(`- Do not talk down, bully, or harass any other members.
- Do not use homophobic, racist, sexist, political, religion, etc. comments.
- Do not spam the same comments over and over again.
- No spam in any channels.
- No NSFW content
- Keep channel talk appropriate and in the right channels.
- Don't ask about/for personal info.
- No abuse tagging.
            
Let's keep this a safe space to talk and on topic.`)
          );
          break;
        case 'welcome':
            msg.channel.send(`__**Welcome to SoS Signup Support discord!**__
*You should have received a private message from @[MEE6] when you joined. Please take your time to read that message and all that follows below:*
            
- Please read the server's rules in #rules before continuing.
- The instructions for how @SoS Signup is used can be found in #instructions.
- Any bugs that you find on the bot can be reported in #bug-reports
- Suggestions for the additions to the bot can be entered in #enhancement-requests.
- All updates and their release dates can be found in #changelog.
- Keep all public chat in #general.
            
Additionally, if you're trying to get into contact with a @mod or @admin, please be patient and we will get a response to you as soon as we can. 
            
Thank you!`);
            break;
        case 'instructions':
          msg.channel.send(new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Instructions')
            .setDescription(`To add the bot to your server, use the following link: https://discord.com/api/oauth2/authorize?client_id=807841006921318421&permissions=92224&scope=bot

            To invoke the bot, use the prefix .signup
            
            While the signup is running, any user who uses one of the set reactions for a field on the message will have their server nickname added to the list. The admin of the server can close the signup by using the \'end\' react (users can still react, but the list of names will not change).`)
            .addFields(
              { name: 'Currently, the following commands can be added after the prefix:', value: '\u200B' },
              { name: '`ff`: Fortress Fight', value: 'Includes fields for Bunkers 1 - 12 and Facilities 1 - 4' },
              { name: '`rr`: Reservoir Raid', value: 'Includes fields for Participant, Reservist, and Unavailable' },
              { name: '\u200B', value: '\u200B' },
              { name: 'Additionally, the following optional parameters can be added to the end of a command:', value: '\u200B'},
              { name: '`limit=[num]`', value: 'Enforces a limit on the number of fields that a single user can sign up for'},
              { name: '\u200B', value: '\u200B' }
            )
            .setImage('https://cdn.discordapp.com/attachments/829116210070159400/829918928578281502/Screen_Shot_2021-04-08_at_11.21.08_PM.png')
            .setFooter('v0.0.2')
          );
          break;
      }
    }  
  }
});
 
client.login(config.loginToken);