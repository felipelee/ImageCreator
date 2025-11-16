'use client'

import { useState, useCallback } from 'react'
import { Upload, X, FileImage } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface FilePreview {
  file: File
  preview: string
  progress: number
  error?: string
}

interface DragDropZoneProps {
  onFilesSelected: (files: File[]) => Promise<void>
  accept?: string
  maxFiles?: number
  maxSizeMB?: number
  className?: string
}

export function DragDropZone({
  onFilesSelected,
  accept = 'image/*',
  maxFiles = 10,
  maxSizeMB = 10,
  className
}: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<FilePreview[]>([])
  const [uploading, setUploading] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList)
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    const validFiles = filesArray
      .slice(0, maxFiles)
      .filter(file => {
        if (file.size > maxSizeBytes) {
          console.warn(`File ${file.name} is too large (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
          return false
        }
        return true
      })

    const previews: FilePreview[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0
    }))

    setFiles(prev => [...prev, ...previews])
  }, [maxFiles, maxSizeMB])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles)
    }
  }, [processFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles)
    }
  }, [processFiles])

  const removeFile = useCallback((index: number) => {
    setFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }, [])

  const handleUpload = useCallback(async () => {
    if (files.length === 0) return

    setUploading(true)
    try {
      const filesToUpload = files.map(f => f.file)
      await onFilesSelected(filesToUpload)
      
      // Clear files after successful upload
      files.forEach(f => URL.revokeObjectURL(f.preview))
      setFiles([])
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }, [files, onFilesSelected])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        )}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className={cn(
          "h-12 w-12 mx-auto mb-4 transition-colors",
          isDragging ? "text-primary" : "text-muted-foreground"
        )} />
        <p className="text-lg font-medium mb-2">
          {isDragging ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          or click to browse (max {maxFiles} files, {maxSizeMB}MB each)
        </p>
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple
          max={maxFiles}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </p>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              size="sm"
            >
              {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {files.map((filePreview, index) => (
              <div
                key={index}
                className="relative border rounded-lg overflow-hidden group"
              >
                <div className="aspect-square bg-muted flex items-center justify-center">
                  {filePreview.file.type.startsWith('image/') ? (
                    <img
                      src={filePreview.preview}
                      alt={filePreview.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileImage className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="p-2 bg-background">
                  <p className="text-xs font-medium truncate">
                    {filePreview.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(filePreview.file.size / 1024).toFixed(1)} KB
                  </p>
                  
                  {filePreview.progress > 0 && filePreview.progress < 100 && (
                    <Progress value={filePreview.progress} className="h-1 mt-1" />
                  )}
                  
                  {filePreview.error && (
                    <p className="text-xs text-destructive mt-1">{filePreview.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

