const { Telegraf, inlineKeyboard, Markup, session } = require('telegraf');
const process = require("nodemon");

const userList = [
    {
    userId:1,
    userName: 'Vasili',
    count: 0
    },
    {
        userId:3,
        userName: 'Max',
        count: 0
    },
    {
        userId:5,
        userName: 'Oleg',
        count: 0
    },
    {
        userId:55,
        userName: 'Nik',
        count: 0
    },
    {
        userId:34,
        userName: 'Igor',
        count: 0
    },
    {
        userId:67,
        userName: 'NoName',
        count: 0
    },{
        userId:1231,
        userName: 'YYUUI',
        count: 0
    },{
        userId:13456,
        userName: 'asdasfdsg',
        count: 0
    },
    {
        userId:166,
        userName: 'nooojdfh',
        count: 0
    },

];
const spam = ['шарий', 'чаплыга', 'міха', 'миха', 'чаплига', 'шарій', "шарія", "шария", "зрада"];
const goodWords = ['чай', 'кава', 'кофе', 'пиво', "пивко","півко", "пивку"]

const randomNum = arr =>  Math.floor( Math.random() * arr.length)

const createKeyBoard = async (ctx)=>{
    try {
       await ctx.replyWithHTML('Побавимось?', Markup.inlineKeyboard([
            Markup.button.callback('Так', 'btn_yes'),
            Markup.button.callback('Hi', 'btn_no')
        ]))

    }catch (e) {
        console.log(e)
    }
}
const whoIsGay =  (arr=[])=>{
    if (!arr && !arr.length)return;
    const random = randomNum(arr)
    const gay =  userList[random].userName

   return gay;
}
const chatMembers = async (context)=>{
    await context.replyWithHTML(`Привіт мій солоденький ${context.message.from.username ? context.message.from.username : context.message.from.first_name }`);
    // await createKeyBoard(context)
}
const checkForSpam = (msg)=>{
    console.log(msg.message.text.length);
    if (!msg.message.text.length) {
        console.log('empty')
        return '';
    }
    const text = msg.message.text
    if (text) {
            text.split(' ')
    }

    for (let i = 0; i < words.length; i++){
        const isSpam = spam.includes(text[i].toLowerCase());
        const isMatch = goodWords.includes(text[i].toLowerCase());
        if (isMatch){
            switch (text[i].toLowerCase()) {
                case "чай":
                case 'кава':
                case 'каву':
                   return  msg.replyWithPoll( "Ви можете вибрати місце зустрічі:", ['Терем', "Кофеїн", "Топольок", "Сільмаг", "Наташа", "Амік"], {
                                // open_period: true,
                                is_anonymous: false,
                                allows_multiple_answers: true
                            });

                case'пиво':
                case"пивко":
                case"пивку":
                case"півко":
                   return  msg.replyWithPoll( "Солоденькі ви хочете сьогодні провести гарно вечір?", ['Так', 'Ні', 'Під каблуком'], {
                        // open_period: 10,
                        is_anonymous: false,
                        allows_multiple_answers: true
                    });

          }
        }
        if (isSpam){
            return Promise.all([
                msg.sendMessage("Ще раз побачу це лайно в цьому чаті сядеш на пляшку"),
                msg.replyWithPhoto({
                source: './img/bottle.jpeg'
            })
            ])
        }
   }
}

const addAction = (name, src=false, text)=>{
bot.action(name, async (ctx)=>{
    try{
        await ctx.answerCbQuery()
        if (src){
        // await ctx.replyWithHTML(text)
        await ctx.replyWithVideo({
            source: src,
            caption: text
        })
        }
    }catch (e) {
        console.log(e)
    }
})
}
const bot = new Telegraf('749417127:AAGnKBOk3QWi73zSE1ERLPFF7LWFIv7H0Rc', {polling:true});

bot.start(ctx => chatMembers(ctx) );

bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('text', msg => checkForSpam(msg));
// bot.hears(['чай', "кава"], ctx => {
//     ctx.reply('Мої солоденькі Ви можете випити чай тут:')
// });

bot.launch();
addAction('btn_no', '', 'Сідай на бутилку гімно')
addAction('btn_yes', '', `Раз Два Три Підар сьогодні ти ${whoIsGay(userList)}`)

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));