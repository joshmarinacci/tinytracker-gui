function count(hash, url) {
    if(!hash[url]) hash[url] = 0
    hash[url] += 1
}

function o2a(byUrl) {
    return Object.keys(byUrl).map(key=>{
        return {
            key:key,
            count:byUrl[key]
        }
    })
}

function processByField(arr, key) {
    const hash = {}
    arr.forEach(event => {
        count(hash,event[key])
    })
    const stats = o2a(hash)
    stats.sort((a,b)=>b.count-a.count)
    return stats
}

export function process(arr) {
    return {
        alltime: {
            byUrl:processByField(arr,'url'),
            byUserAgent:processByField(arr,'userAgent'),
            byReferrer:processByField(arr,'referrer'),
        }
    }
}
