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

export const ChartC3 = ({stats}) => {
    let chart = useRef();
    useEffect(()=> {
        if (chart.current) {
            console.log(Object.keys(stats).length)
            if(Object.keys(stats).length > 0) {
                let flat_days = flatten(stats);
                // let days = Object.keys(stats['2020']['2'])
                let days_list = ['date']
                let totals = ['totals']
                flat_days.forEach((dp,i)=>{
                    console.log('day is',dp)
                    let data = dp.data
                    days_list.push(`${dp.year}-${dp.month}-${dp.day}`)
                    totals.push(sum_pairs(to_pairs(data.lang)))
                })
                let chart = c3.generate({
                    bindto:'#chart',
                    data: {
                        x:'date',
                        columns: [
                            days_list,
                            totals,
                        ]
                    },
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
                })
            }
        }
    })
    return <div id="chart" ref={chart}/>
}
