async function linksResubmission() {
    try {
        const { URLs } = await new Promise((resolve, reject) => {
            chrome.storage.sync.get("URLs", (data) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(data);
                }
            });
        });

        if (!URLs || !URLs.includes("http")) {
            alert("Please, insert at least one link.");
            return;
        }

        const urlList = URLs.split("\n");
        const submittedLinks = [];
        const failedLinks = [];

        async function removeUrlJs(index, urlList, nextButton = false) {
            if (index < urlList.length) {
                console.log(index);
                if (!nextButton) {
                    document.querySelector('.RveJvd.snByac').click();
                }

                setTimeout(async function () {
                    const urlBarLabelIndex = 0;
                    const urlBarIndex = 0;
                    const urlBarTextboxIndex = 1;
                    const urlBarLabel = document.querySelectorAll('.Ufn6O.PPB5Hf')[urlBarLabelIndex];
                    if (urlBarLabel) {
                        const urlBar = urlBarLabel.childNodes[urlBarIndex].childNodes[urlBarTextboxIndex];
                        if (urlBar) {
                            urlBar.value = urlList[index];
                        }
                    }

                    setTimeout(async function () {
                        const nextButton = document.querySelectorAll('.RDPZE');
                        const nextButtonSpan = 2;
                        for (let j = 0; j < nextButton.length; j++) {
                            if (nextButton[j].childNodes[nextButtonSpan]) {
                                nextButton[j].removeAttribute('aria-disabled');
                                nextButton[j].setAttribute('tabindex', 0);
                                nextButton[j].childNodes[nextButtonSpan].click();
                            }
                        }

                        setTimeout(async function () {
                            let submitButtonFound = false;

                            const submitButton = document.querySelectorAll('.CwaK9 .RveJvd.snByac');
                            for (let k = 0; k < submitButton.length; k++) {
                                if (submitButton[k].childNodes[0] && (submitButton[k].childNodes[0].textContent).toLowerCase() == 'submit request') {
                                    submitButton[k].click();
                                    submitButtonFound = true;
                                }
                            }

                            if (!submitButtonFound) {
                                failedLinks.push(urlList[index]);
                                console.log('Failed');
                                const closeButton = document.querySelectorAll('.CwaK9 .RveJvd.snByac');
                                for (let k = 0; k < closeButton.length; k++) {
                                    if (closeButton[k].childNodes[0] && (closeButton[k].childNodes[0].textContent).toLowerCase() == 'close') {
                                        closeButton[k].click();
                                    }
                                }
                                setTimeout(function () {
                                    removeUrlJs((index + 1), urlList, true);
                                }, 500);
                            } else {
                                submittedLinks.push(urlList[index]);
                                console.log("Submitted");
                                time = setInterval(function () {
                                    if (document.querySelectorAll('.Mh0NNb.VcC8Fc').length > 0) {
                                        const submittedText = 0;
                                        if (document.querySelectorAll('.Mh0NNb.VcC8Fc')[0].childNodes[0].childNodes[0].textContent.toLowerCase() == 'request submitted') {
                                            clearInterval(time);
                                            time = setInterval(function () {
                                                if (document.querySelector('.RveJvd.snByac')) {
                                                    setTimeout(function () {
                                                        removeUrlJs((index + 1), urlList);
                                                    }, 400);
                                                    clearInterval(time);
                                                }
                                            }, 500);
                                        }
                                    }
                                }, 500);
                            }
                        }, 500);
                    }, 400);
                }, 100);
            } else {
                alert(`Total submitted: ${submittedLinks.length}\nTotal failed: ${failedLinks.length}\nThe file with all the links was downloaded!`);
                const submittedLinksFormatted = submittedLinks.join('\n');
                const failedLinksFormatted = failedLinks.join('\n');
                const txtContent = `Submitted links: \n${submittedLinksFormatted}\n\nFailed links: \n${failedLinksFormatted}`
                const encodedUri = encodeURI(`data:text/plain;charset=utf-8,${txtContent}`);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', 'results.txt');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        await removeUrlJs(0, urlList);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

linksResubmission();
