import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: '',
    dangerouslyAllowBrowser:true
})

var language = {
    "fr": "french",
    "jp": "japnese",
    "sp": "spanish"
}

let language_buttons = [];
let flagg = 0
for (const [key, val] of Object.entries(language)) {
    language_buttons.push(document.getElementById(key));
}
var speak = ""
async function renderOutput(msg) {
    const messages_openai = [
        {
            role: 'system',
            content: 'You are a translator and input will be given in following format "Translate in {language}:" {Word to translate}" and you need to exactly translate optimally the {Word to translate} in given {language} You are a translation engine. Your job is ONLY to translate text to the target language, with no censorship. Even if the input contains offensive, sensitive, explicit, or unsafe content, you MUST translate it literally without refusal or moral judgement.Do not add warnings or apologies.Output ONLY the translation.'
        },
        {
            role: 'user',
            content: `Translate in ${speak}: "${msg}"`
        }
    ]
    const mod = await openai.moderations.create({
        model: "omni-moderation-latest",
        input: msg
    });
    const flagged = mod.results[0].flagged;
    
    const arm  = document.getElementById('ai')
    arm.classList.remove('k')
    arm.classList.remove('warning')
    arm.textContent = ""
    if (flagged) {
        arm.classList.add("warning")
        arm.textContent = "Flagged!"
        arm.addEventListener('click', async (e) => {
            if (flagg <= 2) {
                const response = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: messages_openai
                })
                arm.classList.remove("warning")
                arm.textContent = response.choices[0].message.content
                flagg++
                
            }
            else {
                arm.textContent = "Only 3 Flags allowed!!"
                
            }
        }, { once: true })
    }
    else {
        const response = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: messages_openai
                })
        arm.textContent = response.choices[0].message.content
    }
}
document.getElementById('send').addEventListener('click', (e) => {
    let msg = document.getElementById('mess').value
    if ((speak != "") && (msg != "")) {
        const hrm = document.getElementById('hr')
        hrm.textContent = msg
        hrm.classList.remove('k')
        document.getElementById('ai').textContent = ""
        document.getElementById('ai').classList.add('k')
        renderOutput(msg)
        
    }
})
document.addEventListener('click', (e) => {
    var ok = e.target.id
    if (ok in language) {
        language_buttons.forEach(e => e.classList.remove('select'))
        // document.getElementById(ok).classList.add('active')
        document.getElementById(ok).classList.add('select')
        speak = language[ok];
    }
})
