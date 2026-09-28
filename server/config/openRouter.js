const extractJSON = require("../utlis/extractJson");
const dotenv = require("dotenv");
dotenv.config();

const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions"
const model = "deepseek/deepseek-chat"
// console.log(openRouterUrl)


const genarateResponse = async (prompt) => {

    console.log("working")
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
            'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
            'X-OpenRouter-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: "system", content: "must return ans in json formate" },
            {
                role: 'user',
                content: prompt,
            },
            ],
            temperature: 0.2,
            max_tokens: 4000
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err)
    }
    const data = await res.json()
    console.log(data)
    const response = data.choices[0].message.content
    // console.log(response)
    const jsonres = await extractJSON(response)
    // console.log("josn came here ")
    console.log(jsonres)
    return jsonres

}

// genarateResponse("return  a working calculator website html code i need just code part no other text ok  ");

module.exports = genarateResponse;