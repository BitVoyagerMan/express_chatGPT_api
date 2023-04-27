
const express = require('express');
const {Configuration, OpenAIApi} = require("openai")
require('dotenv').config()
const gptConfiguration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(gptConfiguration)
const app = express();

async function validateOneSentence( answer) {
    const prompt1 ={
        role: 'user',
        content: "How many sentences are there in '" + answer + "'? If one sentence, please write '1'."
    };
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo-0301',
        messages: [prompt1]
    })
    
    return (completion.data.choices[0].message.content)
}

async function validateOneTrigger( answer) {
    const prompt1 = {
        role: 'user',
        content: "How many triggers are there in '" + answer + "'? If one trigger, please write only '1'. If two or more triggers, please write every full trigger sentence."
    };
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo-0301',
        messages: [prompt1]
    })
    return (completion.data.choices[0].message.coxxczxcntent)
}

async function validateOne( answer) {
    const prompt1 = {
        role: 'user',
        content: "How many triggers are there in '" + answer + "'? If one trigger, please write only '1'. If two or more triggers, please write every full trigger sentence."
    };
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo-0301',
        messages: [prompt1]
    })
    return (completion.data.choices[0].message.content)
}
async function validateAbstract( answer) {
    const prompt1 = {
        role: 'user',
        content: "'" + answer + "' \n Is this topic abstract? If yes, please write '1'"
    };
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo-0301',
        messages: [prompt1]
    })
    console.log(completion.data.choices[0].message.content);
    return (completion.data.choices[0].message.content);
}
app.use(express.json())
app.get('/', (req, res) => {
    return res.send('Hello world');
});
app.post('/sendTopic', async (req, res) => {
    const answer = req.body.answer;
    const numberOfSentences = await validateOneSentence(answer)
    console.log(numberOfSentences)
    if(numberOfSentences != 1) {
        const returnAnswer = "Please describe your problem clearly and concisely in 1 sentence. ";
        res.send(returnAnswer); return;
    }
    const isAbstract = await validateAbstract(answer);
    console.log(isAbstract);
    if(isAbstract[0] == '1'){
        const returnAnswer = "Your description is too abstract. Please remember one particular experience when this problem happened, and tell me something about it.";
        res.send(returnAnswer); return;
    }
    const triggers = await validateOneTrigger(answer);
    console.log(triggers);
    
    if(triggers[0] != '1'){
        const returnAnswer = triggers + "\n Which is the worst part for you?";
        res.send(returnAnswer); return;
    }
    const returnAnswer = "When you think '" + answer + "' what emotion do you feel right now? \n(Please use 1 word only)";
    res.send(returnAnswer); return;
})
app.listen(process.env.DEV_PORT, () => console.log('Express'));