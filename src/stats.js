import React from 'react'

export const TableByType = ({stats})=> {
    if(!stats['2020']) return <table>
        <tbody>
        <tr></tr>
        </tbody>
    </table>

    const year = stats['2020']
    // const feb = stats['2020']['1']
    return <table className={'data-table'}>
        <thead>
        <tr>
            <th>month</th>
            <th>day</th>
            <th>pageload</th>
            <th>navlink</th>
        </tr>
        </thead>
        <tbody>
        {Object.keys(year).map(monthIndex => {
            const month = year[monthIndex]
            return Object.keys(month).map(dayIndex => {
                const day = month[dayIndex]
                return <tr key={dayIndex}>
                    <td>{monthIndex}</td>
                    <td>{dayIndex}</td>
                    <td>{day.type.pageload}</td>
                    <td>{day.type.navlink}</td>
                </tr>
            })
        })}
        </tbody>
    </table>
}

export const TableByRegion = ({stats}) => {
    if(!stats['2020']) return <table>
        <tbody>
        <tr></tr>
        </tbody>
    </table>
    const year = stats['2020']
    return <table className={'data-table'}>
        <thead>
            <tr>
                <th>month</th>
                <th>day</th>
                <th>region</th>
                <th>lang</th>
                <th>charset</th>
                <th>referrer</th>
                <th>user agent</th>
            </tr>
        </thead>
        <tbody>
        {Object.keys(year).map(monthIndex => {
            const month = year[monthIndex]
            return Object.keys(month).map(dayIndex => {
                const day = month[dayIndex]
                return <tr key={dayIndex}>
                    <td>{monthIndex}</td>
                    <td>{dayIndex}</td>
                    <td>{topTenRegion(day.region).map(pair => {
                        return <div key={pair[0]}>{pair[0]} = {pair[1]}</div>
                    })}</td>
                    <td>{topTenRegion(day.lang).map(pair => {
                        return <div key={pair[0]}>{pair[0]} = {pair[1]}</div>
                    })}</td>
                    <td>{topTenRegion(day.charset).map(pair => {
                        return <div key={pair[0]}>{pair[0]} = {pair[1]}</div>
                    })}</td>
                    <td>{topTenRegion(day.referrer).map(pair => {
                        return <div key={pair[0]}>{pair[0]}={pair[1]}</div>
                    })}</td>
                    <td>{topTenRegion(day.userAgent).map(pair => {
                        return <div key={pair[0]}>{pair[0]} = {pair[1]}</div>
                    })}</td>
                    <td>{topTenRegion(day.url).map(pair => {
                        return <div key={pair[0]}>{pair[0]} = {pair[1]}</div>
                    })}</td>
                </tr>
            })
        })}
        </tbody>
    </table>
}

function topTenRegion(region) {
    if(!region) return []
    const pairs = Object.keys(region).map(reg => {
        return [reg,region[reg]]
    })
    pairs.sort((a,b)=>b[1]-a[1])
    return pairs.slice(0,10)
}
