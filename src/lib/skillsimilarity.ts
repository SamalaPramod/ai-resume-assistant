import {

getEmbedding,

cosineSimilarity

}

from "./semantic";

export async function
skillSimilarity(

resumeSkills:string[],

jdSkills:string[]

){

const results=[];

for(

const jdSkill

of jdSkills

){

const jdEmbedding=

await getEmbedding(

jdSkill

);

let bestScore=0;

let bestMatch=

"Missing";

for(

const resumeSkill

of resumeSkills

){

const resumeEmbedding=

await getEmbedding(

resumeSkill

);

const similarity=

cosineSimilarity(

resumeEmbedding,

jdEmbedding

)

if(

similarity>

bestScore

){

bestScore=

similarity;

bestMatch=

resumeSkill;

}

}

results.push({

jdSkill,

bestMatch,

score:

Math.round(

bestScore*100

),

status:

bestScore>0.8

?

"Matched"

:

bestScore>0.55

?

"Partial"

:

"Missing"

});

}

return results;

}