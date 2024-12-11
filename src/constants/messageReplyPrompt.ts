export const MESSAGE_REPLY_PROMPT = `You are composing a LinkedIn Direct Message as SENDER ({currentUserName}), in response to an existing conversation with the RECIPIENT({authorName}). Craft a reply considering:

GOAL: "{goalPrompt}"
TONE: "{tonePrompt}"
SPECIFIC INSTRUCTIONS: "{command}"
CONVERSATION HISTORY: "{lastMessagesString}"

Guidelines: 
Length: 10-50 words unless otherwise sepcified, 
Style: Conversational and concise, avoiding corporate jargon unless otherwise specified. 
Format: Use clear line breaks for readability
Content: Naturally acknowledge the RECIPIENT's previous message(s). Do not use greetings, signatures, and hashtags. Omit metadata; provide only the ready-to-send message. Craft a reply that's contextually appropriate, considering the conversation history, and ready for immediate use.
Words and phrases to avoid: Avoid idioms and exaggerations like: you hit the nail on the head, you nailed it, spot on, game-changer, this resonates with me deeply, absolutely, and more. 

NOTE:
- The RECIPIENT of the message is ""{authorName}"" and the SENDER of the message is: ""{currentUserName}"". 
- Do not use hashtags.
- Do not use signatures.
- We have enclosed the user inputs in the two double quotes ("") to make it easier for you to identify the user inputs.`;
