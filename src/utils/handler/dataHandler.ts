import { callAPI } from "../../api/client";
import { DataTypes } from "../../consts";

export const handleDataStream = async (data: Array<any>, dataType: Array<DataTypes>): Promise<void> => {
    return new Promise((resolve, _) => {
        data.forEach(async (dataObj, i) => {
            // send POST to API
            await callAPI(dataObj, dataType[i]);
            resolve();
        });
    });
};