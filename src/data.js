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

function calculateLimit(range) {
    if(range === 'hrs1') return 1000*60*60
    if(range === 'hrs24') return 1000*60*60*24
    if(range === 'days7') return 1000*60*60*24*7
    if(range === 'alltime') return 1000*60*60*24*30*12 //1 year
    return 0
}

function processRange(arr, range) {
    const limit = Date.now() - calculateLimit(range)
    arr = arr.filter(entry => (entry.date > limit))
    return {
        byType:processByField(arr,'type'),
        byUrl:processByField(arr,'url'),
        byUserAgent:processByField(arr,'userAgent'),
        byReferrer:processByField(arr,'referrer'),
        byRegion:processByField(arr,'region'),
        byLanguage:processByField(arr,'lang'),
        byCharset:processByField(arr,'charset'),
    }
}

export function process(arr) {
    console.log("processing",arr)
    return {
        alltime: processRange(arr,'alltime'),
        hrs1:    processRange(arr,'hrs1'),
        hrs24:   processRange(arr,'hrs24'),
        days7:   processRange(arr,'days7'),
    }
}
