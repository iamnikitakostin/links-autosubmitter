const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", click);


let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
})


function click() {
    const URLs = document.querySelector("#links").value;
    chrome.storage.sync.set({
        URLs: URLs
    });

    chrome.scripting.executeScript({
        target: {
            tabId: tab.id
        },
        files: ["linksresubmission.js"]
    }, () => {
        console.log("Executed successfully.");
    });
}