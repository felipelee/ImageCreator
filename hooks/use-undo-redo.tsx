import { useState, useCallback } from 'react'

interface UseUndoRedoOptions<T> {
  maxHistory?: number
  onStateChange?: (state: T) => void
}

export function useUndoRedo<T>(initialState: T, options: UseUndoRedoOptions<T> = {}) {
  const { maxHistory = 50, onStateChange } = options
  
  const [history, setHistory] = useState<T[]>([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentState = history[currentIndex]
  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  const pushState = useCallback((newState: T) => {
    setHistory((prev) => {
      // Remove any future states if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1)
      // Add new state
      newHistory.push(newState)
      // Limit history size
      if (newHistory.length > maxHistory) {
        newHistory.shift()
        return newHistory
      }
      return newHistory
    })
    setCurrentIndex((prev) => {
      const newIndex = Math.min(prev + 1, maxHistory - 1)
      return newIndex
    })
    
    if (onStateChange) {
      onStateChange(newState)
    }
  }, [currentIndex, maxHistory, onStateChange])

  const undo = useCallback(() => {
    if (!canUndo) return
    
    const newIndex = currentIndex - 1
    setCurrentIndex(newIndex)
    
    if (onStateChange) {
      onStateChange(history[newIndex])
    }
  }, [canUndo, currentIndex, history, onStateChange])

  const redo = useCallback(() => {
    if (!canRedo) return
    
    const newIndex = currentIndex + 1
    setCurrentIndex(newIndex)
    
    if (onStateChange) {
      onStateChange(history[newIndex])
    }
  }, [canRedo, currentIndex, history, onStateChange])

  const reset = useCallback((newInitialState?: T) => {
    const state = newInitialState ?? initialState
    setHistory([state])
    setCurrentIndex(0)
    
    if (onStateChange) {
      onStateChange(state)
    }
  }, [initialState, onStateChange])

  const clearHistory = useCallback(() => {
    setHistory([currentState])
    setCurrentIndex(0)
  }, [currentState])

  return {
    state: currentState,
    pushState,
    undo,
    redo,
    reset,
    clearHistory,
    canUndo,
    canRedo,
    historyLength: history.length,
    currentIndex
  }
}

