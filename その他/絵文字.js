const { Events } = require("discord.js");
module.exports = (client) => {
  client.on(Events.MessageCreate, message => {
    if (message.author.bot) {
      return;
    }
    if (message.content.toLowerCase().includes('!tekito')) {
      // 「hi!」と返信
      message.reply('<@705067761482596413>'.repeat(10));
    }
    if (message.content.toUpperCase().includes('WTF')) {
      message.react('🤔');
    } 
    if (message.content.toUpperCase().includes('しね')) {
      // ❌の絵文字でリアクション
      message.react('❌');
    }
    
    if (message.content.toUpperCase().includes('いく')) {
      // ❌の絵文字でリアクション
      message.react('dokohe:1241280627668553801');
    }
    
     if (message.content.toUpperCase().includes('イク')) {
      // ❌の絵文字でリアクション
      message.react('dokohe:1241280627668553801');
    }
    
    if (message.content.toUpperCase().includes('🤔')) {
      // 🤔の絵文字でリアクション
      message.react('🤔');
    } 
    
    if (message.content.toUpperCase().includes('ここ')) {
      // 🈁の絵文字でリアクション
      message.react('🈁');
    }
      
    if (message.content.toUpperCase().includes('うい')) {
      // ういの絵文字でリアクション
      message.react('ui:1161579108954812506');
    }
      
    if (message.content.toUpperCase().includes('クリボー') || message.content.toUpperCase().includes('くりぼー')) {
      // nitroの絵文字でリアクション
      message.react('a:emoji_22:927780890703183883');
    }
  });
};
