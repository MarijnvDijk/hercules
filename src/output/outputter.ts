const output = (info: {requestMethod: string, url: string, uri: string, contentType: string,
    usernameField: string, passwordField: string}) => 
    ["Hydra v9.4 (c) 2022 by van Hauser/THC & Rick Astley - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).",
    "Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2023-05-05 16:47:39",
    "[DATA] max 16 tasks per 1 server, overall 16 tasks, 17000 login tries (l:17/p:1000), ~1063 tries per task",
    `[DATA] attacking ${info.requestMethod === "POST" ? "http-post-form" : "http-get-form"}://${info.url}${info.uri}:${info.contentType === "application/json" ? 
    "{"+info.usernameField+"\\:^USER^&"+info.passwordField+"\\:^PASS^}" : info.usernameField+"=^USER^&"+info.passwordField+"=^PASS^"}:invalid`,
    "[STATUS] 316.00 tries/min, 316 tries in 00:01h, 16684 to do in 00:53h, 16 active"];

async function start() {
    try {
        const info = localStorage.getItem("output");
        if (info != null) {
            const infoObj = JSON.parse(info);
            const toAppend = output(infoObj);
            const elements = toAppend.map((output) => {
                return `<p>${output}</p>`;
            });
            const outputElement = document.getElementsByClassName("output")[0];
            for (let i = 0; i < elements.length - 1; i++) {
                setTimeout(() => {
                    outputElement.insertAdjacentHTML('beforeend', elements[i])
                }, 4000 * (i+1));
            }
            setTimeout(() => {
                outputElement.insertAdjacentHTML('beforeend',elements[elements.length-1]);
            }, 60 * 1000);
        }
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

start();