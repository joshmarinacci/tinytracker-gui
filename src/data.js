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
    console.log("stats for ",key,stats)
    return stats
}

export function process(arr) {
    console.log("processing",arr)
    return {
        alltime: {
            byType:processByField(arr,'type'),
            byUrl:processByField(arr,'url'),
            byUserAgent:processByField(arr,'userAgent'),
            byReferrer:processByField(arr,'referrer'),
            byRegion:processByField(arr,'region'),
            byLanguage:processByField(arr,'lang'),
            byCharset:processByField(arr,'charset'),
        }
    }
}
