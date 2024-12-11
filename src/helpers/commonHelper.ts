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
