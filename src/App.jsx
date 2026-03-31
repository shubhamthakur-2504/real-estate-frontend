import { BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
       <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Routes will be added here */}
      </Routes>
    </Router>
    </>
  )
}

export default App
