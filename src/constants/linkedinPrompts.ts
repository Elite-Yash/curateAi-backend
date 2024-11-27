export const POST_COMMENT_PROMPTS_1 = `You are composing a LinkedIn Comment as ""{currentUserName}"" in reaction to ""{postText}"" by ""{authorName}"".  Craft a comment considering:

TONE: ""{tonePrompt}""

SPECIFIC INSTRUCTIONS: Consider the following instructions: ""{command}"". 

Guidelines: 

Length: Keep the comment 20 to 60 words unless otherwise specified. 
Style: Conversational and concise, avoiding corporate jargon unless otherwise specified. 
Format: Use clear line breaks for readability
Content: If ""{authorName}"" does not match ""{currentUserName}"", address ""{authorName}"" informally and directly. Do not repeat the post in the comment, instead acknowledge what was said in the post in a natural way. Exclude greetings, signatures, and hashtags. Omit metadata; provide only the ready-to-send message. Craft a reply that's contextually appropriate, considering the conversation history, and ready for immediate use.

Words and phrases to avoid: Avoid idioms and exaggerations like: you hit the nail on the head, you nailed it, spot on, game-changer, this resonates with me deeply, absolutely, and more. 

NOTE: 
- The author of the post is ""{authorName}"" and the author of the comment is: ""{currentUserName}"". Do not assume that the post was written by ""{currentUserName}"" unless ""{currentUserName}"" matches the ""{authorName}"".
- We have enclosed the user inputs in the two double quotes ("") to make it easier for you to identify the user inputs.`;

export const POST_COMMENT_PROMPTS_2 = `As ""{currentUserName}"", craft a LinkedIn comment responding to post: ""{postText}"". In your response, reference ""{authorName}"" to demonstrate that you've engaged with their post thoughtfully and do it in a natural way. Tailor your comment utilizing a tone that resonates with ""{tonePrompt}"". Consider the following instructions: ""{command}"". Adhere to the following guidelines: keep your comment concise, within a 20 to 57 word limit unless directed otherwise. Avoid corporate jargon, opting for a straightforward and relatable, conversational style. Remember to directly engage with the content of the post above without directly repeating it, and refrain from using informal slang or adding extraneous elements like hashtags, greetings, or signatures. Craft a comment that is both insightful and aligns with these parameters
        
NOTE:
- The author of the post is ""{authorName}"" and the author of the comment is: ""{currentUserName}"". Do not assume that the post was written by ""{currentUserName}"" unless ""{currentUserName}"" matches the ""{authorName}"".
- Do not use hashtags, even if they are present in the post.
- We have enclosed the user inputs in the two double quotes ("") to make it easier for you to identify the user inputs.`;