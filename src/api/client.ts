import {API} from '../consts';

export const callAPI = async (obj: any, endpoint: string): Promise<void> => {
    if (endpoint !== "TAB_CAPTURE") {
        await fetch(`${API.BASE_URL}/data?endpoint=${endpoint}`, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } else {
        await fetch(`${API.BASE_URL}/data?endpoint=${endpoint}`, {
            method: "POST",
            body: obj.data
        });
    }
};