const token = '7277427654:AAF-oIPDtit8lRJNmVx2CxlzZ0LvCBHu1gw';
const telegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');
const sequelize = require('./DB');
const UserModel = require('./models');
const bot = new telegramApi(token, {polling: true});

const chats ={}



const startGame = async (chatID) => {
    await bot.sendMessage(chatID, 'Я загадаю цифру от 0 до 9, попробуй угадать')
    const randomNum = Math.floor(Math.random() * 10)
    chats[chatID] = randomNum;
    await bot.sendMessage(chatID, 'Загадал, отгадывай', gameOptions);
}

const start =  async () =>{


    try{
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('Ошибка подключения к базе данных', e)
    }

    bot.setMyCommands([
        {command: '/start', description:'начальное приветствие'},
        {command: '/info', description:'Получить информацию о пользователе'},
        {command: '/game', description:'Игра угадай цифру'}
    ])
    
    bot.on('message',  async msg => {
        const text = msg.text;
        const chatID = msg.chat.id;

        try{
            if (text === '/start'){
                
                await UserModel.create({chatID})
                await bot.sendSticker(chatID, 'https://tlgrm.ru/_/stickers/422/93d/42293d5f-7cd5-49f6-a8fd-939f71b06a83/1.webp')
                return bot.sendMessage(chatID, `Добро пожаловать`)
            }
            if(text === '/info'){
                const user = await UserModel.findOne({chatID})
                return bot.sendMessage(chatID, `Тебя зовут ${msg.from.first_name}, правильных ответов в игре - ${user.right}, неправильных ответов - ${user.wrong}`)
            }
            if (text === '/game'){
               return startGame(chatID);
            }
            return bot.sendMessage(chatID, 'Не понял, Поробуй ещё раз');
        }catch (e) {
             return bot.sendMessage(chatID, `Непредвиденная ошибка, Кажется вы уже бывали тут ранее, здравствуйте ${msg.from.first_name}`);
        }
        
        
    })

    bot.on('callback_query', async msg =>{
        const data = msg.data;
        const chatID = msg.message.chat.id;
        if(data === '/again') {
           return startGame(chatID)
        }
        const user = await UserModel.findOne({chatID})

        if(data == chats[chatID]){
            user.right += 1;
             await bot.sendMessage(chatID, `Поздравляю, вы отгадали цифру ${chats[chatID]}`, againOptions)
        } else{
            user.wrong += 1;
             await bot.sendMessage(chatID, `Не верно, я загадывал цифру ${chats[chatID]}`, againOptions)
            
        }

        await user.save();
        
    })
}

start()
