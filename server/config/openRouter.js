// fetch('https://openrouter.ai/api/v1/chat/completions', {
//   method: 'POST',
//   headers: {
//     Authorization: 'Bearer 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',
//     'HTTP-Referer': '<YOUR_SITE_URL>',
//     'X-Title': '<YOUR_SITE_NAME>',
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     model: 'openai/gpt-4o',
//     messages: [
//       {
//         role: 'user',
//         content: 'What is the meaning of life?',
//       },
//     ],
//   }),
// });}


const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions"
const model = "deepseek/deepseek-chat"
// console.log(openRouterUrl)


const genarateResponse = async (prompt) => {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer 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',
            'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
            'X-OpenRouter-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: "system", content: "must return ans in json formate" },
            {
                role: 'user',
                content: 'What is the meaning of life?',
            },
            ],
            temperature: 0.2
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err)
    }
    console.log(await res.text())
}

genarateResponse();


