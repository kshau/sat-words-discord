require("dotenv").config();
const {fetch} = require("undici");

const {WEBHOOK_URL} = process.env;

async function getWords() {

    const wordsURL = "https://raw.githubusercontent.com/lrojas94/SAT-Words/master/Freevocabulary%20Wordlist/freevocabulary_words.json";

    const res = await fetch(wordsURL);
    var json = await res.json();

    for (var i = 0; i <= json.length - 1; i++) {
        if (!json[i].definition.endsWith(".")) {
            json.splice(i, 1);
        }
    }

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
                name: "Definition", 
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
            content: `${word} @everyone`, 
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

        const estOffset = -5;
        const estDate = new Date(now.getTime() + estOffset * 60 * 60 * 1000);
    
        const estHour = estDate.getUTCHours();
        const estMinute = estDate.getUTCMinutes();
    
        if (estHour == 9 && estMinute == 0) {
            await sendRandomWord(wordList);
        }
    
    }, 60000)
    
    console.log("Words started!");
})
