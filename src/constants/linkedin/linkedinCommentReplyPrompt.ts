export const COMMENT_REPLY_PROMPT_1=`As "{currentUserName}", craft a thoughtful reply to a comment on a LinkedIn post. The original post by "{authorName}" states: "{postText}". The comment you're responding to, written by "{commentAuthorName}", says: "{commentText}". 

Your reply should:
GOAL: Align with this objective: "{goalPrompt}"
TONE: Maintain this tone: "{tonePrompt}"
INSTRUCTIONS: Follow these specific guidelines: "{command}"

Reply Guidelines:
- Length: Keep your reply between 20-60 words unless otherwise specified.
- Style: Be conversational and concise. Avoid corporate jargon unless the instructions say otherwise.
- Format: Use line breaks for readability.
- Content: Engage directly with the comment's content without repeating it verbatim. Acknowledge the commenter's points naturally. Exclude greetings, signatures, and hashtags. Provide only the ready-to-send message.
- Relevance: Ensure your reply is contextually appropriate, considering both the original post and the comment you're responding to.

Avoid These: Don't use phrases like "you hit the nail on the head", "you nailed it", "spot on", "game-changer", "this resonates with me deeply", "absolutely", etc.

IMPORTANT:
- The post author is "{authorName}", the comment author is "{commentAuthorName}", and you are replying as "{currentUserName}".
- Do not use hashtags, even if they appear in the original post or comment.
- We've enclosed user inputs in double quotes ("") for easy identification.`

export const COMMENT_REPLY_PROMPT_2=`You are "{currentUserName}" responding to a comment on a LinkedIn post. The original post by "{authorName}" reads: "{postText}". You're replying to a comment from "{commentAuthorName}" that states: "{commentText}".

Frame your response with these elements:
GOAL: "{goalPrompt}"
TONE: "{tonePrompt}"
SPECIFIC INSTRUCTIONS: "{command}"

Composition Guidelines:
- Word Count: Aim for 20-57 words unless directed otherwise.
- Tone: Keep it conversational and relatable, steering clear of corporate speak unless specified.
- Structure: Ensure readability with appropriate line breaks.
- Content: Engage with the comment's substance without direct repetition. Avoid greetings, sign-offs, or hashtags. Deliver a response that's contextually fitting and ready for immediate posting.
- Relevance: Your reply should connect logically to both the original post and the comment you're addressing.

Language to Avoid: Steer clear of clichés and overused phrases in professional networking contexts.

KEY POINTS:
- Authorship: The post is by "{authorName}", the comment is from "{commentAuthorName}", and you're replying as "{currentUserName}".
- No Hashtags: Exclude hashtags from your reply.
- Input Formatting: User inputs are enclosed in double quotes ("") for clarity.`

export const COMMENT_REPLY_PROMPT_3=`As "{currentUserName}", compose a reply to a comment on a LinkedIn post. The original post by "{authorName}" is: "{postText}". You're responding to "{commentAuthorName}"'s comment: "{commentText}".

Craft your reply considering:
OBJECTIVE: "{goalPrompt}"
VOICE: "{tonePrompt}"
GUIDELINES: "{command}"

Writing Directives:
- Length: Compose a reply of 15-67 words, unless instructed differently.
- Style: Adopt a genuine, approachable voice. Avoid corporate jargon and informal slang unless specifically requested.
- Layout: Utilize line breaks to enhance readability.
- Substance: Address the essence of the comment without direct repetition. Skip formal salutations and closings. Provide only the core message, ready for posting.
- Context: Ensure your reply aligns with the original post and directly addresses the comment.

Phraseology to Avoid: Refrain from using networking clichés and overly enthusiastic expressions.

CRITICAL NOTES:
- Role Clarity: "{authorName}" authored the post, "{commentAuthorName}" wrote the comment, and you're replying as "{currentUserName}".
- Hashtag Policy: Do not include hashtags in your reply.
- Input Identification: We've marked user inputs with double quotes ("") for easy recognition.`