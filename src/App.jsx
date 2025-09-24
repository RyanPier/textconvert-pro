import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import KeyboardShortcuts from './components/KeyboardShortcuts.jsx'
import FileUpload from './components/FileUpload.jsx'
import TextAnalysis from './components/TextAnalysis.jsx'
import { 
  Copy, 
  Download, 
  Trash2, 
  Moon, 
  Sun, 
  Type, 
  Hash, 
  Wand2,
  History,
  Settings,
  FileText,
  Zap,
  Upload,
  BarChart3
} from 'lucide-react'
import './App.css'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [conversionHistory, setConversionHistory] = useState([])
  const [stats, setStats] = useState({ characters: 0, words: 0, lines: 0 })

  // Text conversion functions
  const textConversions = {
    sentenceCase: (text) => text.toLowerCase().replace(/(^\w|\.\s+\w)/g, (match) => match.toUpperCase()),
    lowerCase: (text) => text.toLowerCase(),
    upperCase: (text) => text.toUpperCase(),
    titleCase: (text) => text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
    camelCase: (text) => text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, ''),
    pascalCase: (text) => text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, ''),
    snakeCase: (text) => text.toLowerCase().replace(/\s+/g, '_'),
    kebabCase: (text) => text.toLowerCase().replace(/\s+/g, '-'),
    alternatingCase: (text) => text.split('').map((char, index) => 
      index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join(''),
    inverseCase: (text) => text.split('').map((char, index) => 
      index % 2 === 1 ? char.toLowerCase() : char.toUpperCase()).join(''),
    reverseText: (text) => text.split('').reverse().join(''),
    capitalizedCase: (text) => text.replace(/\b\w/g, (char) => char.toUpperCase())
  }

  // Number formatting functions
  const numberConversions = {
    commaToPeriod: (text) => text.replace(/(\d),(\d)/g, '$1.$2'),
    periodToComma: (text) => text.replace(/(\d)\.(\d)/g, '$1,$2'),
    addThousandSeparators: (text) => text.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    removeSeparators: (text) => text.replace(/[,\s]/g, '')
  }

  // Special conversions
  const specialConversions = {
    removeSpaces: (text) => text.replace(/\s/g, ''),
    removeLineBreaks: (text) => text.replace(/\n/g, ''),
    removeExtraSpaces: (text) => text.replace(/\s+/g, ' '),
    trimWhitespace: (text) => text.trim()
  }

  // Calculate text statistics
  useEffect(() => {
    const characters = inputText.length
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0
    const lines = inputText.split('\n').length
    setStats({ characters, words, lines })
  }, [inputText])

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Handle text conversion
  const handleConversion = useCallback((conversionType, conversionFunction) => {
    if (!inputText.trim()) return
    
    const result = conversionFunction(inputText)
    setOutputText(result)
    
    // Add to history
    const historyEntry = {
      id: Date.now(),
      input: inputText,
      output: result,
      type: conversionType,
      timestamp: new Date().toLocaleTimeString()
    }
    setConversionHistory(prev => [historyEntry, ...prev.slice(0, 9)]) // Keep last 10
  }, [inputText])

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (outputText) {
      await navigator.clipboard.writeText(outputText)
      // Could add toast notification here
    }
  }

  // Download text
  const downloadText = () => {
    if (outputText) {
      const blob = new Blob([outputText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'converted-text.txt'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  // Clear all
  const clearAll = () => {
    setInputText('')
    setOutputText('')
  }

  // Handle keyboard shortcuts
  const handleShortcutAction = useCallback((action) => {
    switch (action) {
      case 'copy':
        copyToClipboard()
        break
      case 'download':
        downloadText()
        break
      case 'clear':
        clearAll()
        break
      default:
        // Handle text conversion shortcuts
        if (textConversions[action]) {
          handleConversion(action, textConversions[action])
        }
        break
    }
  }, [inputText, outputText])

  // Handle file upload
  const handleFileUpload = useCallback((text) => {
    setInputText(text)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Type className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white">TextConvert Pro</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className="text-white hover:bg-white/20"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
          <p className="text-white/80 text-lg">
            Advanced text case converter and formatter with enhanced features
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Input Text</span>
                </CardTitle>
                <CardDescription>
                  Enter your text below to convert it to different formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter your text here... Try typing 'Hello World! This is a TEST of the text converter. It should handle 1,234.56 numbers too.'"
                  className="w-full h-40 p-4 border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
                
                {/* Text Statistics */}
                <div className="flex space-x-6 text-sm text-muted-foreground">
                  <span>Characters: {stats.characters}</span>
                  <span>Words: {stats.words}</span>
                  <span>Lines: {stats.lines}</span>
                </div>

                {/* Conversion Tabs */}
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="text" className="flex items-center space-x-2">
                      <Type className="w-4 h-4" />
                      <span>Text Case</span>
                    </TabsTrigger>
                    <TabsTrigger value="numbers" className="flex items-center space-x-2">
                      <Hash className="w-4 h-4" />
                      <span>Numbers</span>
                    </TabsTrigger>
                    <TabsTrigger value="special" className="flex items-center space-x-2">
                      <Wand2 className="w-4 h-4" />
                      <span>Special</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Text Case Conversions */}
                  <TabsContent value="text" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(textConversions).map(([key, func]) => (
                        <Button
                          key={key}
                          variant="outline"
                          size="sm"
                          onClick={() => handleConversion(key, func)}
                          className="text-left justify-start"
                        >
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Number Formatting */}
                  <TabsContent value="numbers" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(numberConversions).map(([key, func]) => (
                        <Button
                          key={key}
                          variant="outline"
                          size="sm"
                          onClick={() => handleConversion(key, func)}
                          className="text-left justify-start"
                        >
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Special Conversions */}
                  <TabsContent value="special" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(specialConversions).map(([key, func]) => (
                        <Button
                          key={key}
                          variant="outline"
                          size="sm"
                          onClick={() => handleConversion(key, func)}
                          className="text-left justify-start"
                        >
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Output Section */}
                <div className="space-y-4">
                  <label className="text-sm font-medium">Converted Text:</label>
                  <textarea
                    value={outputText}
                    readOnly
                    placeholder="Your converted text will appear here..."
                    className="w-full h-32 p-4 border border-border rounded-lg bg-muted resize-none"
                  />
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button onClick={copyToClipboard} disabled={!outputText} size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={downloadText} disabled={!outputText} size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={clearAll} size="sm" variant="outline">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleConversion('upperCase', textConversions.upperCase)}
                >
                  UPPERCASE
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleConversion('lowerCase', textConversions.lowerCase)}
                >
                  lowercase
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleConversion('titleCase', textConversions.titleCase)}
                >
                  Title Case
                </Button>
              </CardContent>
            </Card>

            {/* File Upload */}
            <FileUpload onTextLoaded={handleFileUpload} />

            {/* Text Analysis */}
            <TextAnalysis text={inputText} />

            {/* Conversion History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-5 h-5" />
                  <span>Recent Conversions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {conversionHistory.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {conversionHistory.map((entry) => (
                      <div key={entry.id} className="p-2 border border-border rounded text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {entry.type}
                          </Badge>
                          <span className="text-muted-foreground">{entry.timestamp}</span>
                        </div>
                        <div className="text-muted-foreground truncate">
                          {entry.input.substring(0, 30)}...
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No conversions yet</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-white/60"
        >
          <p>© 2025 TextConvert Pro. Built with React, Tailwind CSS, and ❤️</p>
        </motion.footer>
      </div>

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts onConversion={handleShortcutAction} />
    </div>
  )
}

export default App
