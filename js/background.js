// on badge click, send arguments to window._internalLoad
let currentStatus = "OFF";



chrome.action.onClicked.addListener(function(tab) {
    chrome.storage.sync.get(["autoChangeOnBadgeClick"], function (items) {
        if (items.autoChangeOnBadgeClick === true) {
            if (currentStatus === "OFF") {
                chrome.action.setBadgeText({text: "ON", tabId: tab.id});
                chrome.action.setBadgeBackgroundColor({color: "#009900", tabId: tab.id});
                currentStatus = "ON";
            } else if (currentStatus === "ON") {
                chrome.action.setBadgeText({text: "", tabId: tab.id});
                chrome.action.setBadgeBackgroundColor({color: "#990000", tabId: tab.id});
                currentStatus = "OFF";
            }

            chrome.storage.sync.get(["autoChangeOnBadgeClick"], function(items) {
                if (items.autoChangeOnBadgeClick === true) {
                    chrome.scripting.executeScript({
                        target: {tabId: tab.id},
                        func: (status) => {
                            window.__SIGNAL = status === "ON" ? "sendSignalON" : "sendSignalOFF";
                        },
                        args: [
                            currentStatus
                        ]
                    })
                    chrome.scripting.executeScript({
                        target: {tabId: tab.id},
                        func: (status) => {
                            window.__DO_NOT_RUN_INTERNAL_LOAD = status !== "ON";
                        },
                        args: [currentStatus]
                    })

                    chrome.scripting.executeScript({
                        target: {tabId: tab.id},
                        files: ['js/replace_images.js']
                    }).catch((error) => {
                        console.error("Script injection failed: ", error);
                    });

                }
            });
        };
    });
});
// on installed -> redirect to configuration
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        chrome.tabs.create({url: chrome.runtime.getURL("options/options.html")});
    }
});