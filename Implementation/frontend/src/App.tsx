import { useState } from 'react'
import Header from './components/layout/Header'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const handleMenuClick = () => {
    console.log('Menu clicked!')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header title="Admin Dashboard" onMenuClick={handleMenuClick} />
      
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Header Component Preview</h1>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Features:</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Responsive design with mobile menu button</li>
              <li>• Search functionality</li>
              <li>• User avatar placeholder</li>
              <li>• Dark theme styling</li>
              <li>• Gluu logo integration</li>
            </ul>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Test Counter:</h2>
            <button 
              onClick={() => setCount((count) => count + 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Count is {count}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
