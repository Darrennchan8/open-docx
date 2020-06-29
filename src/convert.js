const singleLoadListeners = {};

chrome.tabs.onUpdated.addListener((tabId, info) => {
    if (typeof singleLoadListeners[tabId] == 'function' && info.status == 'complete') {
        singleLoadListeners[tabId]();
        delete singleLoadListeners[tabId];
    }
});

const getPrimaryUrl = url => `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`

const getSecondaryUrl = url => `https://word-view.officeapps.live.com/wv/WordViewer/request.pdf?WOPIsrc=${
    encodeURIComponent(`http://us6-view-wopi.wopi.live.net:808/oh/wopi/files/@/wFileId?wFileId=${
        encodeURIComponent(url)
    }`)
}&type=printpdf`;

const createTab = (url, active=true) => {
    return new Promise(resolve => chrome.tabs.create({ url, active }, resolve));
};

const onLoad = tabId => {
    return new Promise(resolve => singleLoadListeners[tabId] = resolve);
};

const navigateTab = (tabId, url) => {
    return new Promise(resolve => chrome.tabs.update(tabId, { url }, resolve));
};

const focusTab = tabId => {
    return new Promise(resolve => chrome.tabs.update(tabId, { active: true }, resolve));
};

const closeTab = tabId => {
    return new Promise(resolve => chrome.tabs.remove(tabId, resolve));
};

const sleep = millis => {
    return new Promise(resolve => setTimeout(resolve, millis));
};

const isStillLoading = tabId => {
    return new Promise(resolve => {
        chrome.tabs.executeScript(tabId, {
            code: `document.body.textContent.includes('InProgress')`
        }, resolve);
    });
};

module.exports = async srcUrl => {
    const primaryTab = await createTab(getPrimaryUrl(srcUrl));
    await onLoad(primaryTab.id);
    const secondaryTab = await createTab('about:blank', false);
    do {
        await sleep(250);
        await navigateTab(secondaryTab.id, getSecondaryUrl(srcUrl));
        await onLoad(secondaryTab.id);
    } while (await isStillLoading(secondaryTab.id));
    await closeTab(primaryTab.id);
    await focusTab(secondaryTab.id);
};
