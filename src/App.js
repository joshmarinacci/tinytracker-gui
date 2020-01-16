import React, {useEffect, useState} from 'react'
import './App.css'
import {AuthModuleSingleton, LOGIN} from './auth.js'
import {process} from "./data.js"
import ndjsonStream from 'can-ndjson-stream';

const AUTH_URL = 'https://joshmarinacci-tinytracker.glitch.me/github'
const DATA_URL = 'https://joshmarinacci-tinytracker.glitch.me/data.jsonline'
// const AUTH_URL = 'http://localhost:3965/github'
// const DATA_URL = 'http://localhost:3965/data.jsonline'

const auth = new AuthModuleSingleton()

const StatsTable = ({stats,field})=>{
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
    {stats.alltime[field].map((s,i) => {
      return <tr key={i}><td>{s.key}</td><td>{s.count}</td></tr>
    })}
    </tbody>
  </table>
}

/*
	• External links clicked total
	• External links clicked, top 10
	• Panels clicked total
	• Page loaded total

 */


const HBox = ({children})=>{
  return <div>{children}</div>
}

function App() {
  const [loggedin, setLoggedin] = useState(auth.isLoggedIn())
  const login = () => auth.login(AUTH_URL)
  const logout = () => auth.logout()
  const [stats, setStats] = useState({})
  const [field, setField] = useState("byUrl")
  const [loadCount, setLoadCount] = useState(0)
  useEffect(()=>{
    const cb = () => setLoggedin(auth.isLoggedIn())
    auth.on(LOGIN,cb)
    return ()=>auth.off(LOGIN,cb)
  })

  const loadData = () => {
    auth.fetch(DATA_URL,{method:'GET'})
        .then(resp=>ndjsonStream(resp.body))
        .then(stream => {
          const reader = stream.getReader()
          const arr = []
          let count = 0
          const read = (res) => {
            if(res.done) return arr
            arr.push(res.value)
            count++
            if(count%10 === 0) setLoadCount(count)
            return reader.read().then(read)
          }
          return reader.read().then(read)
        })
        .then(arr=>process(arr))
        .then(stats => setStats(stats))
  }
  let button = <button onClick={login}>login</button>
  if(loggedin) button = <button onClick={logout}>log out</button>
  return (
    <div>
      <HBox>
        {button}
        <button onClick={loadData}>load</button>
        <label>{loadCount} records</label>
      </HBox>
      <HBox>
        <button onClick={()=>setField('byUrl')}>by url</button>
        <button onClick={()=>setField('byReferrer')}>by referrer</button>
        <button onClick={()=>setField('byUserAgent')}>by userAgent</button>
      </HBox>
      <StatsTable stats={stats} field={field}/>
    </div>
  );
}

export default App;
