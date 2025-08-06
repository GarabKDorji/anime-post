import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes, Link } from 'react-router-dom'
import Home from './pages/Home'
import Create from './pages/Create'
import Detail from './pages/Detail'
import Edit from './pages/edit'
function App() {
  const [input,setInput] = useState("")
  return(
    <div className="container">
      <nav>
        <ul>
          <li className='nav-logo'>
            ANIME ZONE
          </li>
           <li>
            <input type="text" value={input} onChange={(e)=>{setInput(e.target.value)}} placeholder="Search posts..."/>
          </li>
            <li className='nav-links'>
                <Link to ='/'>Home</Link>
                <Link to ='/create'>Create a Post</Link>
          </li>
        </ul>
      </nav>

      <div className='content'>
        <Routes>
          <Route path='/' element = {<Home input= {input} />}/>
          <Route path='/create' element = {<Create/>}/>
          <Route path='/edit/:id' element = {<Edit/>}/>
          <Route path='/post/:id' element= {<Detail/>}/>
          <Route path ='' element = ''/>
        </Routes>
      </div>
    </div>
  )
}

export default App
