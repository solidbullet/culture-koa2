const rp = require('request-promise');
const config = require("../config.json")
const request = require('request');
const fs = require('fs');

async function getToken() {

    const curentTime = new Date().getTime()
    let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.APPID}&secret=${config.SECRET}`
    let options = {
        uri: url,
        json: true
    }
    if (!config.access_token || curentTime - config.expires_time > 7000 * 1000) {
        let res = await rp(options)
        const { access_token } = res;
        config.access_token = access_token;
        config.expires_time = curentTime;

        const jsonstr = JSON.stringify(config)

        fs.writeFileSync('./config.json', jsonstr, err => {
            if (err) console.log(err)
        })
        return access_token

    } else return config.access_token
}

async function sendMultipart(cloud_folder,filePath,originalname) {
    let access_token = await getToken()
    let cloudurl = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${config.ENV}&name=upload`;
    let rs = await streamToBuffer(fs.createReadStream(filePath));  //这里其实直接readfilesync 直接就是buff，搞复杂了
    let requestData = {};
    requestData.fileStream =  rs
    requestData.action = 'uploadbybuffer',
    requestData.originalname = originalname,
    requestData.folder = cloud_folder //云存储的文件夹名称
    let options = {
        method: 'POST',
        uri: cloudurl,
        body: requestData,
        json: true // Automatically stringifies the body to JSON
    };
    let res = await rp(options)
    return res;
}

async function uploadArticle(article) {
    let access_token = await getToken()
    let cloudurl = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${config.ENV}&name=savearticle`;

    let options = {
        method: 'POST',
        uri: cloudurl,
        body: article,
        json: true // Automatically stringifies the body to JSON
    };
    let res = await rp(options)
    return res;
}

function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        let buffers = [];
        stream.on('error', reject);
        stream.on('data', (data) => buffers.push(data))
        stream.on('end', () => resolve(Buffer.concat(buffers)))
    });
}

module.exports = {
    getToken: getToken,
    sendMultipart: sendMultipart,
    uploadArticle:uploadArticle
}


