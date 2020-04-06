import React, {useEffect, useRef, useState} from 'react'
import c3 from 'c3/c3.esm.js'
import "c3/c3.css"

const sum_pairs=(arr) => arr.reduce((acc,val)=> acc + val.value,0)


function to_pairs(obj) {
    return Object.keys(obj).map(key => {
        return { key: key, value: obj[key]}
    })
}

function flatten(stats) {
    let arr = []
    Object.keys(stats).forEach(year => {
        Object.keys(stats[year]).forEach(month => {
            Object.keys(stats[year][month]).forEach(day => {
                arr.push({year:parseInt(year),month:parseInt(month)+1,day:parseInt(day), data:stats[year][month][day]})
            })
        })
    })
    return arr
}
const range = (s,e) => {
    let arr = []
    for(let i=s; i<e; i++) {
        arr[i] = i;
    }
    return arr;
}

export const ChartC3 = ({stats, filter}) => {
    let chart = useRef();
    useEffect(()=> {
        if (chart.current) {
            console.log(Object.keys(stats).length)
            if(Object.keys(stats).length > 0) {
                let flat_days = flatten(stats);
                let days_list = ['date']
                let totals = ['totals']
                let config = {
                    bindto:'#chart',
                    axis: {
                        y: {
                            label: "hits per day",
                            min:0,
                        },
                        x: {
                            type:'timeseries',
                            tick: {
                                format:'%m-%d'
                            },
                            label:"day"
                        },

                    }
                }
                if(filter === 'all-regions') {
                    flat_days.forEach((dp, i) => {
                        let data = dp.data
                        days_list.push(`${dp.year}-${dp.month}-${dp.day}`)
                        totals.push(sum_pairs(to_pairs(data.lang)))
                    })
                    config.data = {
                        x:'date',
                        columns: [
                            days_list,
                            totals,
                        ]
                    }
                }
                if (filter === 'top5-regions')   config.data = processTop(10, 'region', flat_days)
                if (filter === 'top10-content')  config.data = processTop(10,'url', flat_days)
                c3.generate(config);
            }
        }
    },[stats,filter])
    return <div id="chart" ref={chart}/>
}

function processTop(count, key, flat_days) {
    let days_list = ['date']
    let ran = range(0,10);
    let tops = ran.map(()=>[])
    flat_days.forEach((dp ,i) => {
        days_list.push(`${dp.year}-${dp.month}-${dp.day}`)
        let data = to_pairs(dp.data[key])
        data.sort((a,b)=> b.value - a.value)
        if(data.length < 10) return;
        if(i === 0) ran.forEach(i=>tops[i].push(data[i].key))
        ran.forEach(i=>tops[i].push(data[i].value))
    })
    return {
        x:'date',
        columns: [ days_list, ...tops ]
    }
}
