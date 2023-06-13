const { Telegraf, inlineKeyboard, Markup, session } = require('telegraf');
const { Configuration, OpenAIApi} = require('openai')
require('dotenv').config()
// const process = require("nodemon");
const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const openAi = new OpenAIApi(config);
const bot = new Telegraf(process.env.BOT_API_KEY, {polling:true});

const goodWords = ['чай', 'кава', 'кофе', 'пиво', "пивко","півко", "пивку"]
const spam = ['шарий', 'чаплыга', 'міха', 'миха', 'чаплига', 'шарій', "шарія", "шария", "зрада"];
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
// const whoIsGay =  (arr=[])=>{
//     if (!arr && !arr.length)return;
//     const random = randomNum(arr)
//     const gay =  userList[random].userName
//
//    return gay;
// }
const chatMembers = async (context)=>{
    await context.replyWithHTML(`Привіт мій солоденький ${context.message.from.username ? context.message.from.username : context.message.from.first_name }`);
    // await createKeyBoard(context)
}
const checkForSpam = (msg)=>{
    if (!msg.message.text.length) {
        console.log('empty')
        return '';
    }
    const text = msg.message.text

    const words = text.split(' ')
    if (words.length) {
        for (let i = 0; i < words.length; i++){
            const isSpam = spam.includes(words[i].toLowerCase());
            const isMatch = goodWords.includes(words[i].toLowerCase());
            if (isMatch){
                switch (words[i].toLowerCase()) {
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

}

const chatGPT = async (ctx)=>{
    const { message } = ctx.update;
    const prompt = message.text.replace('/bot_start_chat', '').trim();
    console.log('prompt', prompt);
    console.log('msg', ctx.message.text);

    bot.on('message', async ctx =>{
        try {
            const response = await openAi.createCompletion({
                model: "davinci",
                prompt: prompt,
                temperature: 0.9,
                max_tokens: 150,
                top_p: 1,
                frequency_penalty: 0.0,
                presence_penalty: 0.6,
                stop: ["Human:", " AI:"],
            })
            // console.log('response.data.choices', response.data.choices[0]);
            ctx.reply(response.data.choices[0].text);
        }catch (e){
            console.log(e)
            ctx.reply('Sorry, I was unable to process your message at this time.');
        }
    })



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
bot.start(ctx => chatMembers(ctx) );
bot.command('bot_start_chat', ctx => chatGPT(ctx))

bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('text', msg => checkForSpam(msg));

// bot.hears(['чай', "кава"], ctx => {
//     ctx.reply('Мої солоденькі Ви можете випити чай тут:')
// });

bot.launch();
// addAction('btn_no', '', 'Сідай на бутилку гімно')
// addAction('btn_yes', '', `Раз Два Три Підар сьогодні ти ${whoIsGay()}`)

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));