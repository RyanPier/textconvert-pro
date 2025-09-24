import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { BarChart3, TrendingUp, Eye, Clock } from 'lucide-react'

export default function TextAnalysis({ text, className = '' }) {
  const analysis = useMemo(() => {
    if (!text || text.trim().length === 0) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        averageWordsPerSentence: 0,
        readingTime: 0,
        readabilityScore: 0,
        mostCommonWords: [],
        characterFrequency: {},
        textComplexity: 'Simple'
      }
    }

    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length
    
    const averageWordsPerSentence = sentences > 0 ? Math.round(words / sentences * 10) / 10 : 0
    const readingTime = Math.ceil(words / 200) // Average reading speed: 200 words per minute
    
    // Simple readability score (Flesch Reading Ease approximation)
    const avgSentenceLength = averageWordsPerSentence
    const avgSyllables = words > 0 ? text.split(/[aeiouAEIOU]/).length / words : 0
    const readabilityScore = Math.max(0, Math.min(100, 
      206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllables)
    ))

    // Most common words (excluding common stop words)
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'])
    
    const wordFreq = {}
    text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).forEach(word => {
      if (word.length > 2 && !stopWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      }
    })
    
    const mostCommonWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }))

    // Character frequency for top 5 characters
    const charFreq = {}
    text.toLowerCase().replace(/\s/g, '').split('').forEach(char => {
      if (/[a-z]/.test(char)) {
        charFreq[char] = (charFreq[char] || 0) + 1
      }
    })
    
    const characterFrequency = Object.entries(charFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .reduce((obj, [char, count]) => {
        obj[char] = count
        return obj
      }, {})

    // Text complexity based on average sentence length and word length
    const avgWordLength = charactersNoSpaces / words || 0
    let textComplexity = 'Simple'
    if (avgSentenceLength > 20 || avgWordLength > 6) {
      textComplexity = 'Complex'
    } else if (avgSentenceLength > 15 || avgWordLength > 5) {
      textComplexity = 'Moderate'
    }

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      averageWordsPerSentence,
      readingTime,
      readabilityScore: Math.round(readabilityScore),
      mostCommonWords,
      characterFrequency,
      textComplexity,
      avgWordLength: Math.round(avgWordLength * 10) / 10
    }
  }, [text])

  const getReadabilityLevel = (score) => {
    if (score >= 90) return { level: 'Very Easy', color: 'bg-green-500' }
    if (score >= 80) return { level: 'Easy', color: 'bg-green-400' }
    if (score >= 70) return { level: 'Fairly Easy', color: 'bg-yellow-400' }
    if (score >= 60) return { level: 'Standard', color: 'bg-orange-400' }
    if (score >= 50) return { level: 'Fairly Difficult', color: 'bg-orange-500' }
    if (score >= 30) return { level: 'Difficult', color: 'bg-red-400' }
    return { level: 'Very Difficult', color: 'bg-red-500' }
  }

  const readability = getReadabilityLevel(analysis.readabilityScore)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>Text Analysis</span>
        </CardTitle>
        <CardDescription>
          Detailed statistics and insights about your text
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Characters</span>
              <span className="font-medium">{analysis.characters.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Characters (no spaces)</span>
              <span className="font-medium">{analysis.charactersNoSpaces.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Words</span>
              <span className="font-medium">{analysis.words.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sentences</span>
              <span className="font-medium">{analysis.sentences.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Paragraphs</span>
              <span className="font-medium">{analysis.paragraphs.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg. word length</span>
              <span className="font-medium">{analysis.avgWordLength}</span>
            </div>
          </div>
        </div>

        {/* Reading Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Reading Metrics</span>
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Reading Time</span>
              </div>
              <Badge variant="secondary">
                {analysis.readingTime} min{analysis.readingTime !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Readability Score</span>
                <span className="font-medium">{analysis.readabilityScore}/100</span>
              </div>
              <Progress value={analysis.readabilityScore} className="h-2" />
              <div className="flex justify-between items-center">
                <Badge variant="outline" className={`text-white ${readability.color}`}>
                  {readability.level}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Avg. {analysis.averageWordsPerSentence} words/sentence
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Text Complexity */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Complexity Analysis</span>
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Text Complexity</span>
            <Badge variant={
              analysis.textComplexity === 'Simple' ? 'default' :
              analysis.textComplexity === 'Moderate' ? 'secondary' : 'destructive'
            }>
              {analysis.textComplexity}
            </Badge>
          </div>
        </div>

        {/* Most Common Words */}
        {analysis.mostCommonWords.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Most Common Words</h4>
            <div className="space-y-1">
              {analysis.mostCommonWords.map(({ word, count }, index) => (
                <div key={word} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {index + 1}. {word}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Character Frequency */}
        {Object.keys(analysis.characterFrequency).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Character Frequency</h4>
            <div className="space-y-1">
              {Object.entries(analysis.characterFrequency).map(([char, count], index) => (
                <div key={char} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-mono">
                    {index + 1}. '{char}'
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.characters === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Enter text to see detailed analysis</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
