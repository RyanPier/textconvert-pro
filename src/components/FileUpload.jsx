import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Upload, FileText, X, Download } from 'lucide-react'

export default function FileUpload({ onTextLoaded, className = '' }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [processing, setProcessing] = useState(false)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileInput = useCallback((e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }, [])

  const handleFiles = async (files) => {
    setProcessing(true)
    const textFiles = files.filter(file => 
      file.type === 'text/plain' || 
      file.name.endsWith('.txt') || 
      file.name.endsWith('.md') ||
      file.name.endsWith('.csv')
    )

    if (textFiles.length === 0) {
      alert('Please upload text files (.txt, .md, .csv)')
      setProcessing(false)
      return
    }

    const processedFiles = []
    
    for (const file of textFiles) {
      try {
        const text = await readFileAsText(file)
        const fileData = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          content: text,
          timestamp: new Date().toLocaleTimeString()
        }
        processedFiles.push(fileData)
      } catch (error) {
        console.error('Error reading file:', error)
      }
    }

    setUploadedFiles(prev => [...prev, ...processedFiles])
    setProcessing(false)

    // Load the first file's content into the main text area
    if (processedFiles.length > 0) {
      onTextLoaded(processedFiles[0].content)
    }
  }

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(e)
      reader.readAsText(file)
    })
  }

  const loadFileContent = (file) => {
    onTextLoaded(file.content)
  }

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const downloadProcessedFiles = () => {
    if (uploadedFiles.length === 0) return

    const combinedContent = uploadedFiles.map(file => 
      `=== ${file.name} ===\n${file.content}\n\n`
    ).join('')

    const blob = new Blob([combinedContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'processed-files.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>File Upload</span>
        </CardTitle>
        <CardDescription>
          Upload text files (.txt, .md, .csv) for batch processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <motion.div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${dragActive 
              ? 'border-primary bg-primary/10' 
              : 'border-border hover:border-primary/50'
            }
            ${processing ? 'opacity-50 pointer-events-none' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            type="file"
            multiple
            accept=".txt,.md,.csv,text/plain"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={processing}
          />
          
          <div className="space-y-2">
            <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {processing ? 'Processing files...' : 'Drop files here or click to browse'}
              </p>
              <p className="text-xs text-muted-foreground">
                Supports .txt, .md, .csv files
              </p>
            </div>
          </div>
        </motion.div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadProcessedFiles}
                className="text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Download All
              </Button>
            </div>
            
            <div className="max-h-48 overflow-y-auto space-y-2">
              {uploadedFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{file.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadFileContent(file)}
                      className="text-xs"
                    >
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-xs text-destructive hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Tips */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Tips:</strong> Upload multiple files for batch processing. 
            Click "Load" to use a file's content in the main converter. 
            Use "Download All" to save processed results.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
