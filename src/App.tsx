import { useState } from 'react'
import Header from './components/Header'

import DownloadLicense from './pages/DownloadLicense';
import PushLicense from './pages/PushLicense';
import MainContainer from './components/MainContainer';


import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
      <MainContainer>
        <DownloadLicense/>
          <hr />   
        <PushLicense/>
      </MainContainer>

    </>
  )
}

export default App
