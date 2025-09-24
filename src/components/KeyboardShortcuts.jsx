import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Keyboard, X } from 'lucide-react'

export default function KeyboardShortcuts({ onConversion, isVisible, onClose }) {
  const [showShortcuts, setShowShortcuts] = useState(false)

  const shortcuts = [
    { key: 'Ctrl+U', action: 'upperCase', description: 'Convert to UPPERCASE' },
    { key: 'Ctrl+L', action: 'lowerCase', description: 'Convert to lowercase' },
    { key: 'Ctrl+T', action: 'titleCase', description: 'Convert to Title Case' },
    { key: 'Ctrl+C', action: 'camelCase', description: 'Convert to camelCase' },
    { key: 'Ctrl+P', action: 'pascalCase', description: 'Convert to PascalCase' },
    { key: 'Ctrl+S', action: 'snakeCase', description: 'Convert to snake_case' },
    { key: 'Ctrl+K', action: 'kebabCase', description: 'Convert to kebab-case' },
    { key: 'Ctrl+R', action: 'reverseText', description: 'Reverse text' },
    { key: 'Ctrl+Shift+C', action: 'copy', description: 'Copy result to clipboard' },
    { key: 'Ctrl+Shift+D', action: 'download', description: 'Download as text file' },
    { key: 'Ctrl+Shift+X', action: 'clear', description: 'Clear all text' },
    { key: '?', action: 'help', description: 'Show/hide shortcuts' }
  ]

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
        return
      }

      // Show/hide shortcuts with '?' key
      if (e.key === '?' && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault()
        setShowShortcuts(!showShortcuts)
        return
      }

      // Handle conversion shortcuts
      if (e.ctrlKey && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'u':
            e.preventDefault()
            onConversion('upperCase')
            break
          case 'l':
            e.preventDefault()
            onConversion('lowerCase')
            break
          case 't':
            e.preventDefault()
            onConversion('titleCase')
            break
          case 'c':
            e.preventDefault()
            onConversion('camelCase')
            break
          case 'p':
            e.preventDefault()
            onConversion('pascalCase')
            break
          case 's':
            e.preventDefault()
            onConversion('snakeCase')
            break
          case 'k':
            e.preventDefault()
            onConversion('kebabCase')
            break
          case 'r':
            e.preventDefault()
            onConversion('reverseText')
            break
        }
      }

      // Handle action shortcuts
      if (e.ctrlKey && e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'c':
            e.preventDefault()
            onConversion('copy')
            break
          case 'd':
            e.preventDefault()
            onConversion('download')
            break
          case 'x':
            e.preventDefault()
            onConversion('clear')
            break
        }
      }

      // Close shortcuts panel with Escape
      if (e.key === 'Escape') {
        setShowShortcuts(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onConversion, showShortcuts])

  return (
    <>
      {/* Keyboard shortcuts trigger button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowShortcuts(!showShortcuts)}
        className="fixed bottom-4 left-4 z-50 bg-background/80 backdrop-blur-sm border"
        title="Keyboard Shortcuts (?)"
      >
        <Keyboard className="w-4 h-4" />
      </Button>

      {/* Shortcuts panel */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Keyboard className="w-5 h-5" />
                      <span>Keyboard Shortcuts</span>
                    </CardTitle>
                    <CardDescription>
                      Use these shortcuts to quickly convert text
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowShortcuts(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shortcuts.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{shortcut.description}</p>
                        </div>
                        <Badge variant="secondary" className="ml-2 font-mono text-xs">
                          {shortcut.key}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Tip:</strong> Press <Badge variant="outline" className="mx-1">?</Badge> 
                      to toggle this panel, or <Badge variant="outline" className="mx-1">Esc</Badge> to close it.
                      Shortcuts work when not typing in text areas.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
