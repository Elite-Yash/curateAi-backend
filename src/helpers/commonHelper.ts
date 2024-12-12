import * as crypto from 'crypto';

export const extractLinkedInArticleDetails = (articleText: string) => {
    const titleEndIndex = articleText.indexOf('\n');
    const articleTitle = articleText.substring(0, titleEndIndex);

    const authorStartIndex = titleEndIndex + 1;
    const authorEndIndex = articleText.indexOf('\n', authorStartIndex);
    const author = articleText.substring(authorStartIndex, authorEndIndex).trim();

    const descriptionStartIndex = articleText.indexOf('\n', authorEndIndex + 1) + 1;
    const description = articleText.substring(descriptionStartIndex).trim();

    return {
        articleTitle,
        author,
        description
    };
}



export const generateVerificationToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};


export const sendSuccessResponse = (message: any, data?: any) => {
    return {
        success: true,
        message,
        data: (data) ? data : {},
    };
}

export const sendErrorResponse = (message: any, data?: any) => {
    return {
        success: false,
        message,
        data: (data) ? data : {},
    };
}