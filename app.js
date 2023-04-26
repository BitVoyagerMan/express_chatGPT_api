
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
    const prompt = "'" + answer + "'" + "\n" + "If above answer has only one sentence, please write '1'. If not, please write '2'";
    const prompt1 = "'" + answer + "'" + "\n" + "How many sentences does above answer have? Please separate sentences with dot.";
    
    
    console.log(prompt1)
    const completion = await openai.createCompletion({
        model : "text-davinci-003",
        prompt : prompt1
    });
    //console.log(completion.data.choices[0].text)
    return (completion.data.choices[0].text)
}
app.use(express.json())
app.get('/', (req, res) => {
    return res.send('Hello world');
});
app.post('/sendTopic', async (req, res) => {
    //console.log(req.body)
    const answer = req.body.answer;
    console.log(req.body.answer);
    const numberOfSentences = await validateOneSentence(answer)
    console.log(numberOfSentences)
    if(numberOfSentences != 1) {
        res.json({asking: "Topic", answer: "Please describe your problem clearly and concisely in 1 sentence. "})
    } else{
        res.json({asking: "Emotion"});
    }
})
app.listen(process.env.DEV_PORT, () => console.log('Express'));