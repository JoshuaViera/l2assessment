import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

function HistoryPage() {
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState('all')
  const [expandedIndex, setExpandedIndex] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem('triageHistory') || '[]')
    setHistory(savedHistory)
  }

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.setItem('triageHistory', '[]')
      setHistory([])
    }
  }

  const deleteMessage = (index) => {
    if (window.confirm('Delete this message from history?')) {
      const updatedHistory = history.filter((_, i) => i !== index)
      localStorage.setItem('triageHistory', JSON.stringify(updatedHistory))
      setHistory(updatedHistory)
      setExpandedIndex(null)
    }
  }

  const sortedHistory = [...history].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp)
  })
  
  const filteredHistory = filter === 'all' 
    ? sortedHistory 
    : sortedHistory.filter(item => item.category === filter)

  const categories = [...new Set(history.map(item => item.category))]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
              <p className="text-gray-600">View and manage past message analyses</p>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold"
              >
                Clear All
              </button>
            )}
          </div>

          {history.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({history.length})
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    filter === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category} ({history.filter(h => h.category === category).length})
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredHistory.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-xl text-gray-600 mb-2">No history yet</div>
            <p className="text-gray-500 mb-6">
              Analyzed messages will appear here
            </p>
            <a
              href="/analyze"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Analyze a Message
            </a>
          </div>
        )}

        <div className="space-y-4">
          {filteredHistory.map((item, index) => {
            const originalIndex = history.findIndex(h => h.timestamp === item.timestamp)
            
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                    <button
                      onClick={() => deleteMessage(originalIndex)}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                    <div className="text-sm font-semibold text-gray-600 mb-1">Message</div>
                    <div className="text-gray-800">{item.message}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Category</div>
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {item.category}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Urgency</div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        item.urgency === 'High' ? 'bg-red-200 text-red-900' :
                        item.urgency === 'Medium' ? 'bg-yellow-200 text-yellow-900' :
                        'bg-green-200 text-green-900'
                      }`}>
                        {item.urgency}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Action</div>
                      <div className="text-sm text-gray-700 font-medium">
                        {item.recommendedAction}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                  >
                    {expandedIndex === index ? 'Hide' : 'Show'} AI Reasoning
                  </button>
                </div>

                {expandedIndex === index && (
                  <div className="border-t border-gray-200 p-5 bg-gray-50">
                    <div className="text-xs font-semibold text-gray-600 mb-2">AI Reasoning</div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="prose prose-sm max-w-none text-gray-700">
                        <ReactMarkdown>
                          {item.reasoning}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default HistoryPage