import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

function getURLParameter(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

let id = getURLParameter('id');


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App id={id || "benefit"} />
  </React.StrictMode>,
)
