import React, {useEffect, useState} from 'react'
import './App.css'
import {AuthModuleSingleton, LOGIN} from './auth.js'

const AUTH_URL = 'http://vr.josh.earth:3965/github'
const DATA_URL = 'http://vr.josh.earth:3965/data.json'

const auth = new AuthModuleSingleton()

function App() {
  const [loggedin, setLoggedin] = useState(auth.isLoggedIn())
  const login = () => auth.login(AUTH_URL)
  const logout = () => auth.logout()
  useEffect(()=>{
    const cb = () => setLoggedin(auth.isLoggedIn())
    auth.on(LOGIN,cb)
    return ()=>auth.off(LOGIN,cb)
  })

  const loadData = () => {
    auth.fetch(DATA_URL,{method:'GET'})
        .then(d => d.json())
        .then(data=>{
      console.log('got the data',data)
    })
  }
  let button = <button onClick={login}>login</button>
  if(loggedin) button = <button onClick={logout}>log out</button>
  return (
    <div>
      {button}
      <button onClick={loadData}>data</button>
    </div>
  );
}

export default App;
