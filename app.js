
const express = require('express');
const {Configuration, OpenAIApi} = require("openai")
require('dotenv').config()
const gptConfiguration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(gptConfiguration)
const app = express();




const sampleAnswer1 = " I am sad because my husband left me. It’s stressing me out because I don’t have enough money.";
async function validateOneSentence( answer) {
    //const prompt = "'" + answer + "'" + "\n" + "If above answer has only one sentence, please write '1'. If not, please write '2'";
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
    // const completion = await openai.createCompletion({
    //     model : "gpt-3.5-turbo-0301",
    //     prompt : prompt1
    // });
    //console.log(completion.data);
    return (completion.data.choices[0].message.content)
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
        //res.json({asking: "Topic", answer: "Please describe your problem clearly and concisely in 1 sentence. "})
        //return;
        const returnAnswer = "Please describe your problem clearly and concisely in 1 sentence. ";
        res.send(returnAnswer); return;
    }
    const triggers = await validateOneTrigger(answer);
    console.log(triggers);
    if(triggers[0] != '1'){
        //res.json({asking: "Topic", answer: triggers + "\n Which is the worst part for you?"});
        //return;
        const returnAnswer = triggers + "\n Which is the worst part for you?";
        res.send(returnAnswer); return;
    }
    const returnAnswer = "When you think '" + answer + "' what emotion do you feel right now? \n(Please use 1 word only)";
    //res.json({asking: "Emotion", answer: "When you think '" + answer + "' what emotion do you feel right now? (Please use 1 word only)"}); return;
    res.send(returnAnswer); return;
})
app.listen(process.env.DEV_PORT, () => console.log('Express'));