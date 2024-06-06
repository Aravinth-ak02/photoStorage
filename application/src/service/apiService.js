import axios from "axios";
import { apiConfig } from "./apiConfig";
import { store } from "./store";
const apiUrl = "http://localhost:8000/"

export async function apiservice(path, method, data) {
    return new Promise(async (resolve, reject) => {
        await axios[method](apiUrl + path, data).then(result => {
            if (result && result.data) {
                resolve(result.data);
            } else {
                reject({ status: false, message: "Please try again" })
            }
        }).catch(error => {
            reject(error);
        });
    })
};
export async function GeneralSettings() {
    return new Promise(async (resolve, reject) => {
        console.log("settings called")
        let generalDetails = await apiservice(
            apiConfig.GeneralSetting.path,
            apiConfig.GeneralSetting.method,
            {}
        );
        console.log(generalDetails)
        if (generalDetails && generalDetails.status) {
            store.settings = generalDetails.response;
        };
    }).catch(error => {
        reject(error);
    });
};