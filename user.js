const axios = require("axios")
const credentials = require("./.credentials.json")

axios.get(" https://api.github.com/user", {
    headers: {
        Authorization: `token ${credentials.access_token}`
    }
})
.then(({ data }) => console.log(data))