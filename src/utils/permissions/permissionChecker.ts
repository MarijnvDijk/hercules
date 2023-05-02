import { Permissions } from "../../consts"

export const checkPermission = async (permission: Permissions): Promise<boolean> => {
    return new Promise(async (resolve, _) => {
        if (permission === Permissions.GEOLOCATION) {
            let res = await checkGeolocationPermission();
            resolve(res);
        }
    });
}

const checkGeolocationPermission = (): Promise<boolean> => {
    return new Promise((resolve, _) => {
        navigator.permissions
        .query({ name: "geolocation" })
        .then(({ state }: { state: string }) => {
            resolve(state === "granted");
        });
    });
} 