import React, {useEffect, useState} from 'react'
import './App.css'
import {AuthModuleSingleton, LOGIN} from './auth.js'
import {process} from "./data.js"
import ndjsonStream from 'can-ndjson-stream';
import {StatsTable2, TableByRegion, TableByType, TableByUrl} from './stats.js'
import {ChartC3} from './chart.js'

const AUTH_URL = 'https://joshmarinacci-tinytracker.glitch.me/github'
// const DATA_URL = 'https://joshmarinacci-tinytracker.glitch.me/data.jsonline'
const DATA_URL = 'https://joshmarinacci-tinytracker.glitch.me/stats.json'
// const AUTH_URL = 'http://localhost:3965/github'
// const DATA_URL = 'http://localhost:3965/data.jsonline'

const auth = new AuthModuleSingleton()

const StatsTable = ({stats,field,range})=>{
    if(!stats) return <div>no stats yet</div>
    if(!stats.alltime) return <div>no urls yet</div>
    return <table className={'data-table'}>
        <thead>
        <tr>
            <th>{field}</th>
            <th>count</th>
        </tr>
        </thead>
        <tbody>
        {stats[range][field].map((s,i) => {
            return <tr key={i}><td>{s.key}</td><td>{s.count}</td></tr>
        })}
        </tbody>
    </table>
}

console.log("loading")

/*
	• External links clicked total
	• External links clicked, top 10
	• Panels clicked total
	• Page loaded total

*/


const HBox = ({children})=>{
  return <div>{children}</div>
}

const LoginButton = ({loggedIn, setLoggedIn, auth}) => {
    useEffect(()=>{
        const cb = () => setLoggedIn(auth.isLoggedIn())
        auth.on(LOGIN,cb)
        return ()=>auth.off(LOGIN,cb)
    })
    if(loggedIn) {
        return <button onClick={()=>auth.logout()}>logout</button>
    } else {
        return <button onClick={()=>auth.login(AUTH_URL)}>login</button>
    }
}

const LoadDataButton = ({setStats})=>{
    const [loadCount, setLoadCount] = useState(0)
    const loadData = () => {
        auth.fetch(DATA_URL,{method:'GET'})
            .then(res => res.json())
            .then(stats => {
                console.log("got the stats",stats)
                setStats(stats)
            })
    }
    return <HBox>
        <button onClick={loadData}>load</button>
        <label>{loadCount} records</label>
    </HBox>
}

const ToggleButton = ({onClick,children,value,selected}) => {
    return <button style={{
        backgroundColor:(value===selected)?'aqua':'#ccc',
        border:'1px solid #333',
    }} onClick={onClick}>{children}</button>
}

function App() {
    const [loggedIn, setLoggedIn] = useState(auth.isLoggedIn())
    const [stats, setStats] = useState({})
    const [field, setField] = useState("type")
    // const [range, setRange] = useState('alltime')
    const [filter, setFilter] = useState("all-regions")

  return (
    <div>
      <HBox>
        <LoginButton loggedIn={loggedIn} setLoggedIn={setLoggedIn} auth={auth}/>
        <LoadDataButton setStats={setStats} />
      </HBox>
        <HBox>
            <button onClick={()=> setFilter("top5-regions")}>top five regions</button>
        </HBox>
        <ChartC3 stats={stats} filter={filter}/>
        {/*<HBox>*/}
            {/*<ToggleButton onClick={()=>setRange('alltime')} value={'alltime'} selected={range}>all time</ToggleButton>*/}
            {/*<ToggleButton onClick={()=>setRange('hrs1')} value={'hrs1'} selected={range}>last hour</ToggleButton>*/}
            {/*<ToggleButton onClick={()=>setRange('hrs24')} value={'hrs24'} selected={range}>last 24 hrs</ToggleButton>*/}
            {/*<ToggleButton onClick={()=>setRange('days7')} value={'days7'} selected={range}>last 7 days</ToggleButton>*/}
        {/*</HBox>*/}
      {/*<HBox>*/}
      {/*    <ToggleButton onClick={()=>setField('type')} value={'type'} selected={field}>by type</ToggleButton>*/}
      {/*    <ToggleButton onClick={()=>setField('url')} value={'url'} selected={field}>by url</ToggleButton>*/}
      {/*    <ToggleButton onClick={()=>setField('byReferrer')} value={'byReferrer'} selected={field}>by referrer</ToggleButton>*/}
      {/*    <ToggleButton onClick={()=>setField('byUserAgent')} value={'byUserAgent'} selected={field}>by userAgent</ToggleButton>*/}
      {/*    <ToggleButton onClick={()=>setField('byRegion')} value={'byRegion'} selected={field}>by region</ToggleButton>*/}
      {/*    <ToggleButton onClick={()=>setField('byLanguage')} value={'byLanguage'} selected={field}>by language</ToggleButton>*/}
      {/*    <ToggleButton onClick={()=>setField('byCharset')} value={'byCharsetl'} selected={field}>by charset</ToggleButton>*/}
      {/*</HBox>*/}
      {/*<StatsTable stats={stats} field={field} range={range}/>*/}
      {/*<TableByType stats={stats}/>*/}
      <TableByRegion stats={stats}/>
    </div>
  );
}

export default App;
