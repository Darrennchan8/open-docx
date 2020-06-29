const openConverted = require('./convert');
const CONTEXT_MENU_ID = 'open-docx-action';

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: CONTEXT_MENU_ID,
        title: 'Open as PDF',
        contexts: ['link']
    })
});

chrome.contextMenus.onClicked.addListener(async ({linkUrl}) => {
    await openConverted(linkUrl);
});
