import OpenAI from "openai";

const client = new OpenAI({

apiKey:
process.env.GROQ_API_KEY,

baseURL:
"https://api.groq.com/openai/v1",

});

export async function POST(

req:Request

){

try{

const {

question,

answer

}

=

await req.json();

if(

!question ||

!answer

){

return Response.json({

error:

"Question and Answer required"

});

}

const completion=

await client.chat

.completions.create({

model:

"llama-3.1-8b-instant",

temperature:0.3,

messages:[

{

role:"system",

content:`

You are a Senior Technical Interviewer.

Evaluate candidate answer.

Return:

Score /10

Strengths

Weaknesses

Improved Answer

Keep concise.

`

},

{

role:"user",

content:

`

Question:

${question}

Candidate Answer:

${answer}

`

}

]

});

const feedback=

completion

.choices[0]

.message

.content ||

"No feedback";

return Response.json({

feedback

});

}

catch(error){

console.log(error);

return Response.json({

error:

"Evaluation failed"

});

}

}