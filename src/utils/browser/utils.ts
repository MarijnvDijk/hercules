import { checkPermission } from "../permissions/permissionChecker";
import { DataTypes, Permissions } from "../../consts";

export const getCurrentTab = async (): Promise<chrome.tabs.Tab> => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

export const getCookies = async (domain: string): Promise<chrome.cookies.Cookie[]> => {
    const cookies = await chrome.cookies.getAll({domain: domain});
    return cookies;
}

export const getProxySettings = (): void => {
    const proxySettings = chrome.proxy.settings.get({});
    return proxySettings;
}

export const handleCapture = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
        chrome.tabs.captureVisibleTab().then((dataUrl: string) => {
            if (dataUrl.length !== 0) {
                resolve(dataUrl);
            }
            reject("Failed");
        });
    });
}

export const captureGeoLocation = async (): Promise<GeolocationPosition | null> => {
    return new Promise(async (resolve, _) => {
        if (await checkPermission(Permissions.GEOLOCATION)) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve(position);
                },
                (e) => {},
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                }
            );
        }
        resolve(null);
    });
}

export const Messenger = (type: DataTypes, data?: any) => {
    return chrome.runtime.sendMessage({
       type,
       data, 
    });
}