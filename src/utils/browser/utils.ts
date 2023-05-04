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
            console.log("we got perms")
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
        console.log("no perms :(")
        resolve(null);
    });
}

export const getClipboard = (): string | undefined => {
    return window.getSelection()?.toString();
}

export const Messenger = (type: DataTypes, data?: any) => {
    return chrome.runtime.sendMessage({
       type,
       data, 
    });
}

export const trimDomain = (url: string): string | null => {
    if (url.includes("https://") && !url.includes("https://localhost")) {
        const trimmed = url.split("https://")[1].split("/")[0].split(".");
        return `${trimmed[trimmed.length-2]}.${trimmed[trimmed.length-1]}`;
    } else if (url.includes("http://") && !url.includes("http://localhost")) {
        const trimmed = url.split("http://")[1].split("/")[0].split(".");
        return `${trimmed[trimmed.length-2]}.${trimmed[trimmed.length-1]}`;
    }
    return null;
};