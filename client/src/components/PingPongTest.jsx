import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

const PingPongTest = () => {
  const [pingResults, setPingResults] = useState([])
  const [isPinging, setIsPinging] = useState(false)
  const [stats, setStats] = useState({
    totalPings: 0,
    successfulPings: 0,
    averageResponseTime: 0,
    lastResponseTime: 0
  })

  const pingBackend = async () => {
    setIsPinging(true)
    const startTime = Date.now()
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ping`)
      const data = await response.json()
      const responseTime = Date.now() - startTime
      
      const result = {
        id: Date.now(),
        success: data.success,
        responseTime,
        timestamp: new Date().toLocaleTimeString(),
        data: data.data
      }
      
      setPingResults(prev => [result, ...prev.slice(0, 9)]) // Garder seulement les 10 derniers
      
      // Mettre à jour les statistiques
      setStats(prev => {
        const newTotal = prev.totalPings + 1
        const newSuccessful = prev.successfulPings + (data.success ? 1 : 0)
        const newAverage = data.success 
          ? ((prev.averageResponseTime * prev.successfulPings) + responseTime) / newSuccessful
          : prev.averageResponseTime
        
        return {
          totalPings: newTotal,
          successfulPings: newSuccessful,
          averageResponseTime: Math.round(newAverage),
          lastResponseTime: responseTime
        }
      })
      
    } catch (error) {
      const result = {
        id: Date.now(),
        success: false,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toLocaleTimeString(),
        error: error.message
      }
      
      setPingResults(prev => [result, ...prev.slice(0, 9)])
    } finally {
      setIsPinging(false)
    }
  }

  const clearResults = () => {
    setPingResults([])
    setStats({
      totalPings: 0,
      successfulPings: 0,
      averageResponseTime: 0,
      lastResponseTime: 0
    })
  }

  // Ping automatique toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(pingBackend, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-blue-500" />
            Test Ping-Pong Backend
          </h2>
          
          <div className="flex space-x-2">
            <motion.button
              onClick={pingBackend}
              disabled={isPinging}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPinging ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Activity className="w-4 h-4 mr-2" />
              )}
              Ping Now
            </motion.button>
            
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalPings}</div>
            <div className="text-sm text-blue-800">Total Pings</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.successfulPings}</div>
            <div className="text-sm text-green-800">Successful</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.averageResponseTime}ms</div>
            <div className="text-sm text-yellow-800">Avg Response</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.lastResponseTime}ms</div>
            <div className="text-sm text-purple-800">Last Response</div>
          </div>
        </div>

        {/* Résultats des pings */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Pings</h3>
          
          {pingResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pings yet. Click "Ping Now" to start testing.
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {pingResults.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg border-l-4 ${
                    result.success 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      )}
                      
                      <div>
                        <div className="font-medium">
                          {result.success ? 'Success' : 'Failed'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {result.timestamp} • {result.responseTime}ms
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {result.responseTime}ms
                      </div>
                      {result.error && (
                        <div className="text-xs text-red-600">
                          {result.error}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {result.data && (
                    <div className="mt-2 text-xs text-gray-600">
                      <div>Server: {result.data.status}</div>
                      <div>Uptime: {Math.round(result.data.uptime)}s</div>
                      <div>Environment: {result.data.environment}</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PingPongTest
