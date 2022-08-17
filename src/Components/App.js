import {useState} from 'react'
import Canvas from "./Canvas";

import './App.css'

function App() {

  const [config, setConfig] = useState({})
    
  return (
    <>
      <Canvas configProps={{...config}}/>
      <div className="input__wrapper">
          <input type="text" placeholder='dotsCounts' value={config.dotsCounts} onChange={(e)=>setConfig({...config, dotsCounts: e.target.value})}/>
          <input type="text" placeholder='dotRadius' value={config.dotRadius} onChange={(e)=>setConfig({...config, dotRadius: e.target.value})}/>
          <input type="text" placeholder='maxSpeed' value={config.maxSpeed} onChange={(e)=>setConfig({...config, maxSpeed: e.target.value})}/>
          <input type="text" placeholder='maxLineLength (-1 for off)' value={config.maxLineLength} onChange={(e)=>{
            if(e.target.value == '' || e.target.value == 0)
              return
            setConfig({...config, maxLineLength: e.target.value})
          }}/>
          <input type="text" placeholder='dotOpacitySpeed' value={config.dotOpacitySpeed} onChange={(e)=>setConfig({...config, dotOpacitySpeed: e.target.value})}/>
          <input type="text" placeholder='mouseRepulsion (true/false)' value={config.mouseRepulsion} onChange={(e)=>setConfig({...config, mouseRepulsion: e.target.value})}/>
          <input type="text" placeholder='repulsionRadius' value={config.mouseRadius} onChange={(e)=>setConfig({...config, mouseRadius: e.target.value})}/>
      </div>
    </>
  );
}

export default App;
