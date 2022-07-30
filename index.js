const axios = require("axios")
const open = require("open")
const fs = require("fs")

const sleep = (second) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), (second * 1000))
    })
}

const getAccessToken = async (intervalToTryGetAccess, deviceCode) => {
        const { data } = await axios.post("https://github.com/login/oauth/access_token",
            {
                client_id: "dced5f555fcb3efed714",
                device_code: deviceCode,
                grant_type: "urn:ietf:params:oauth:grant-type:device_code"
            },
            {
                headers: {
                    "accept": "application/json"
                }
            }
        )

        if (data.error) {
            if (data.error == "slow_down") {
                intervalToTryGetAccess = data.interval
            }
    
            await sleep(intervalToTryGetAccess)
            console.log("TRY GET ACCESS TOKEN AGAIN")
            await getAccessToken(intervalToTryGetAccess, deviceCode)
        } else {
            fs.writeFileSync(".credentials.json", JSON.stringify(data))
            console.log("USER AUTHENTICATED WITH SUCCESS USING DEVICE FLOW")
        }
}

axios.post(
    "https://github.com/login/device/code?client_id=dced5f555fcb3efed714&scope=user",
    {},
    {
        headers: {
            "accept": "application/json"
        }
    }
)
    .then(async ({ data }) => {
        open(`${data.verification_uri}?user_code=${data.user_code}`)
        await getAccessToken(data.interval, data.device_code)
    })