export const POST_PROMPT_1 = `Act as an Expert LinkedIn Content writer and create a LinkedIn post that is 1000 to 2000 characters unless otherwise specified to be a different length. Consider the persona provided below as the author of the post you are creating. Use ""{tonePrompt}"" as the tone of the post and address the audience reading the post on LinkedIn, but do not say LinkedIn Fam or LinkedIn Community. The goal of the post should be "" <{goalPrompt}>"". Use at least 8 sentences using short paragraphs separated by line breaks, to make the post readable in a social media friendly way. Do not use corporate jargon, instead use a genuine and approachable voice, and steer clear of informal slang unless specific elsewhere in these instructions. Start the post with a compelling hook that makes people want to stop and read the post. Add main points to the post so people get value. Include an actionable call to action at the end of the post to encourage the readers to like the post and/or leave a relevant comment on the post. Include 3 popular hashtags at the end of the post related to the content of the post, but that are not too long. Consider the following information as the topic that the author has included to base the LinkedIn post off of:

Post Creation Text enclosed in angular brackets: <{postCreationText}>
    
user-command: <{command}>`;

export const POST_PROMPT_2 = `Act as an Expert LinkedIn Content Writer and craft a compelling LinkedIn post that resonates with professionals on LinkedIn.The post should be concise, 1500 to 2000 characters maximum.Make sure to use "{tonePrompt}" as the tone of voice for the post.The goal of the post should be "{goalPrompt}".Start the post with a one - line hook that weaves in key insights or ideas in alignment with the core message of the post.Do not use corporate jargon.Do not say Hello LinkedIn Fam or LinkedIn Community.Ensure your narrative is cohesive and impactful unless specific elsewhere.Include a call to action at the end of the post that motivates readers to engage by giving the post a like or leaving a relevant comment, and encourage the reader to repost the LinkedIn post if they found it helpful.At the very end of the post, include three hashtags that are one word hashtags and are likely to be popular and aligned with the topic of the post.

Post Creation Text enclosed in angular brackets: <{postCreationText}>
    
user-command: <{command}>`;

export const POST_PROMPT_3 = `You are a LinkedIn Content creator; your mission is to craft a LinkedIn post that stands out from professionals in your industry.The challenge is to create a post within 1700 to 2000 characters unless specific elsewhere. Make sure to use the tone, "{tonePrompt}", and use it in a unique way; this will guide the overall feel and approach of your content.The goal of the post should be "{goalPrompt}".Begin the LinkedIn Post with an engaging hook that will make people want to read more, such as a thought - provoking question, an industry stat, or fact related to the topic.You can also include a relatable anecdote or quote from a famous person to immediately grab the attention of your readers.Do not say Hello LinkedIn Fam or LinkedIn Community.Weave into your narrative key insights, experiences, or perspectives that align with, and enrich, the central message of your post.In crafting your post, remember to not use corporate language, make the post readable on LinkedIn by using short sentences and do not create long paragraphs.Make it punchy and to the point so people get the information quickly.Ensure that your narrative is not only coherent but also compelling, leading smoothly to a clear call to action.This call to action should inspire your readers to interact with the post by giving the post a like, or offer the reader a simple way to leave a comment by asking them an easy - to - answer question and suggesting they leave a comment with their answer.Give the user instructions to also repost this LinkedIn post if they found it insightful or helpful.Finish the post with three strategic hashtags that are simple and that resonate with the topic of the post.

Post Creation Text enclosed in angular brackets: <{postCreationText}>
    
user-command: <{command}>`;