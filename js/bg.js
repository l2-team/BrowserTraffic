var banner = `.o88b. db   db d8888b.  .d88b.  .88b  d88. d88888b 
d8P  Y8 88   88 88  \`8D .8P  Y8. 88'YbdP\`88 88'     
8P      88ooo88 88oobY' 88    88 88  88  88 88ooooo 
8b      88~~~88 88\`8b   88    88 88  88  88 88~~~~~ 
Y8b  d8 88   88 88 \`88. \`8b  d8' 88  88  88 88.     
\`Y88P' YP   YP 88   YD  \`Y88P'  YP  YP  YP Y88888P `
console.log(banner)

var saveList = {

}

var URLWhiteList = [
    "www.stx-keyun.com"
]

var is_exist_white_list = (url) => {
    var a =  document.createElement('a'); 
    a.href = url;
    var target = a.host
    if(URLWhiteList.indexOf(target) > -1) {
        return true
    }
    return false
}


var save = (item) => {

    if(!is_exist_white_list(item.url)){
        return
    }

    // 如果存在，进行新的item创建
    if(saveList[item.requestId] == undefined) {
        saveList[item.requestId] = {}
    }

    saveList[item.requestId]['url'] = item.url

    if(item['requestHeaders'] != undefined) {
        saveList[item.requestId]['requestHeaders'] = item.requestHeaders
    }else if(item['requestBody'] != undefined) {
        saveList[item.requestId]['requestBody'] = item.requestBody
    }
}

// 获取请求正文
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        save(details)
    },
    {"urls": ["<all_urls>"]},
    ["blocking", "requestBody", "extraHeaders"]
)


// 获取请求头
chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        save(details)
    },
    {"urls": ["<all_urls>"]},
    ["blocking", "requestHeaders"]
)

setInterval(() => {
    console.log("send data to server...")
    console.log(saveList)
    console.log(Object.keys(saveList).length)
    saveList = {}
}, 5000)