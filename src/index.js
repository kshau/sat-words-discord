require("dotenv").config();
const {fetch} = require("undici");

const {WEBHOOK_URL} = process.env;

async function getWords() {

    const wordsURL = "https://raw.githubusercontent.com/lrojas94/SAT-Words/master/Freevocabulary%20Wordlist/freevocabulary_words.json";

    const res = await fetch(wordsURL);
    const json = await res.json();

    return json;
}

async function sendWord(wordData) {

    const {word, definition} = wordData;

    const embed = { 
        color: 16562691,
        fields: [
            {
                name: "Word", 
                value: `\`${word}\``, 
            },  
            {
                name: "Definiton", 
                value: `\`${definition}\``
            }
        ]
    }

    await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: "@everyone", 
            embeds: [embed]
        }),
    })

}

async function sendRandomWord(wordList) {
    const selectedWord = wordList[Math.floor(Math.random() * wordList.length)];
    await sendWord(selectedWord);
}

getWords().then(wordList => {
    
    setInterval(async () => {

        const now = new Date();
    
        const hr = now.getHours();
        const min = now.getMinutes();
    
        if (min == 32 && hr % 2 == 0 && hr > 7 && hr < 23) {
            await sendRandomWord(wordList);
        }
    
    }, 60000)
    
    console.log("Words started!");
})