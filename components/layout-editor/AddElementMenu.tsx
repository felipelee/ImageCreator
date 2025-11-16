'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Plus, Type, Tag, Image as ImageIcon, Square } from 'lucide-react'
import { CustomElementType } from '@/types/custom-element'

interface AddElementMenuProps {
  onAddElement: (type: CustomElementType) => void
}

export function AddElementMenu({ onAddElement }: AddElementMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Plus className="h-4 w-4 mr-2" />
          Add Element
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs">Insert Element</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onAddElement('text')}
          className="cursor-pointer"
        >
          <Type className="h-4 w-4 mr-2" />
          <div>
            <div className="text-sm font-medium">Text</div>
            <div className="text-xs text-muted-foreground">Add custom text</div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => onAddElement('badge')}
          className="cursor-pointer"
        >
          <Tag className="h-4 w-4 mr-2" />
          <div>
            <div className="text-sm font-medium">Badge</div>
            <div className="text-xs text-muted-foreground">Add pill badge</div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => onAddElement('image')}
          className="cursor-pointer"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          <div>
            <div className="text-sm font-medium">Image</div>
            <div className="text-xs text-muted-foreground">Add image</div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => onAddElement('shape')}
          className="cursor-pointer"
        >
          <Square className="h-4 w-4 mr-2" />
          <div>
            <div className="text-sm font-medium">Shape</div>
            <div className="text-xs text-muted-foreground">Add rectangle</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

