const token = '7277427654:AAF-oIPDtit8lRJNmVx2CxlzZ0LvCBHu1gw';
const telegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')

const bot = new telegramApi(token, {polling: true});

const chats ={}



const startGame = async (chatID) => {
    await bot.sendMessage(chatID, 'Я загадаю цифру от 0 до 9, попробуй угадать')
    const randomNum = Math.floor(Math.random() * 10)
    chats[chatID] = randomNum;
    await bot.sendMessage(chatID, 'Загадал, отгадывай', gameOptions);
}
const start = () =>{
    bot.setMyCommands([
        {command: '/start', description:'начальное приветствие'},
        {command: '/info', description:'Получить информацию о пользователе'},
        {command: '/game', description:'Игра угадай цифру'}
    ])
    
    bot.on('message',  async msg => {
        const text = msg.text;
        const chatID = msg.chat.id;
        if (text === '/start'){
            await bot.sendSticker(chatID, 'https://tlgrm.ru/_/stickers/422/93d/42293d5f-7cd5-49f6-a8fd-939f71b06a83/1.webp')
            return bot.sendMessage(chatID, `Добро пожаловать`)
        }
        if(text === '/info'){
            return bot.sendMessage(chatID, `Тебя зовут ${msg.from.first_name}`)
        }
        if (text === '/game'){
           return startGame(chatID);
        }
        return bot.sendMessage(chatID, 'Не понял, Поробуй ещё раз');
        
    })

    bot.on('callback_query', async msg =>{
        const data = msg.data;
        const chatID = msg.message.chat.id;
        if(data === '/again') {
           return startGame(chatID)
        }
        if(data === chats[chatID]){
            return await bot.sendMessage(chatID, `Поздравляю, вы отгадали цифру ${chats[chatID]}`, againOptions)
        } else{
            return await bot.sendMessage(chatID, `Не верно, я загадывал цифру ${chats[chatID]}`, againOptions)
            
        }
        
    })
}

start()
