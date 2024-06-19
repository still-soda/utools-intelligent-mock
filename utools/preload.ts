import { Recording } from "../src/store/gloablDataStore";

let accessToken = <string | null> null;
const SYMBOL_ID = 'im-230220-544912';

function getApiData() {
    const appId = utools.dbStorage.getItem('appId');
    const appSecret = utools.dbStorage.getItem('appSecret');
    if (!appId || !appSecret) {
        return null;
    }
    return {
        appId,
        appSecret
    }
}

function getAccessToken() {
    if (accessToken) {
        return accessToken;
    }

    const apiData = getApiData();
    if (!apiData) {
        return null;
    }
    
    const { appId, appSecret } = apiData;

    const data = {
        grant_type: 'client_credentials',
        client_id: appId,
        client_secret: appSecret
    };
    const entries = Object.entries(data);
    
    const url = 
        'https://aip.baidubce.com/oauth/2.0/token?' +
         entries.map(([k, v]) => `${k}=${v}`)
                .join('&');

    return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                return res.json();
            })
            .then(data => {
                return accessToken = <string> data.access_token;
            })
            .catch(err => {
                console.error('[preload.ts] getAccessToken() : ' + err);
                return accessToken = null;
            });
}

window.data = {
    getApiData,

    async requestApi({ data, count }) {
        const accessToken = await getAccessToken();
        if (!accessToken) 
            return '[ERR]获取AccessToken失败，请确保您的网络连接正常，\
                    AccessKey和SecretKey正确且未被禁用。';
        const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/yi_34b_chat?\
                     access_token=${accessToken}`;

        const prompt = 
            '#请你扮演我的JSON mock生成助理；#生成的数据最外层是一个Array；\
             #我的提示将会遵循以下格式：\
             [format]: 数据结构（每条数据的描述格式为："数据名称"<数据格式>(数据描述)）[count]: 需要生成mock的数量；\
             #请你务必将产生的JSON mock包含在[BEGIN][END]块中；\
             #你的回答只需要给出[BEGIN][END]的部分即可，不需要其他的回答。\
             现在请你根据以下提示生成：[target]:{' 
            + 
            data.map(i => `"${i.name}"<${i.type}>(${i.desc})`)
                .join('') 
            +
            `}[count]:${count}`;

        const requestBody = {
            messages: [{
                role: 'user',
                content: prompt
            }]
        };
        
        const res = await 
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
            .then(res => {
                return res.json();
            })
            .then(data => {
                return <string>data.result;
            })
            .catch(err => {
                return `[BEGIN][ERR]错误：${err}[END]`;
            });
        
        console.log(res);

        function matchRegex(str: string, regex: RegExp) {
            if (!str) {
                return null;
            }
            const matches = Array.from(str.matchAll(regex));
            return matches.length > 0 ? matches[0][1] : null;
        }

        return matchRegex(res, /\[BEGIN\]([\s\S]*?)\[END\]/g)
            || matchRegex(res, /```json([\s\S]*?)```/g)
            || 'empty';
    },
    setApiData({ appId, appSecret }) {
        utools.dbStorage.setItem('appId', appId);
        utools.dbStorage.setItem('appSecret', appSecret);
    },
    getRecordings() {
        const id = SYMBOL_ID + 'recordingKeys';

        const recordingKeys = utools.dbStorage.getItem(id);
        if (!recordingKeys) {
            utools.dbStorage.setItem(id, []);
        }

        const keys = recordingKeys as string[];
        
        return keys
            .map(key => {
                const recording: Recording = utools.dbStorage.getItem(key);
                return recording ?? null;
            })
            .filter(recording => {
                recording
            }) as Recording[];
    },
    setRecordings(...recordings: Recording[]) {
        const id = SYMBOL_ID + 'recordingKeys';

        const keys: string[] = utools.dbStorage.getItem(id) ?? [];

        recordings.forEach(item => {
            keys.includes(item.id) && keys.push(item.id);
        });

        utools.dbStorage.setItem(id, keys);     
        
        function deepCopy(obj: Recording) {
            return JSON.parse(JSON.stringify(obj));
        }
        
        recordings.forEach(recording => {
            utools.dbStorage.setItem(
                recording.id, 
                deepCopy(recording)
            );
        });
    },
    removeRecording(id: string) {
        const recordingKeys = utools.dbStorage.getItem('recordingKeys');
        if (!recordingKeys) {
            return;
        }

        const keys = <string[]> recordingKeys;
        const index = keys.indexOf(id);
        if (index > -1) {
            keys.splice(index, 1);
        }
        
        utools.dbStorage.setItem('recordingKeys', keys);
        utools.dbStorage.removeItem(id);
    },
}