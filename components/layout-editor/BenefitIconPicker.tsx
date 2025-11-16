'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Check, ChevronsUpDown } from 'lucide-react'
import { 
  Dumbbell, Battery, HeartPulse, Zap, Brain, Shield, Leaf, Target, Activity,
  Sparkles, Star, Award, TrendingUp, ThumbsUp, Check as CheckIcon, Users, Globe,
  MessageCircle, Heart, Flame, Droplet, Sun, Moon, Clock, Timer, Calendar,
  Package, ShoppingCart, CreditCard, Gift, Tag, DollarSign, Percent, TrendingDown,
  BarChart, PieChart, LineChart, Activity as ActivityIcon, Smile, Frown, Meh,
  Eye, EyeOff, Lock, Unlock, Key, Shield as ShieldIcon, AlertTriangle, Info,
  CheckCircle, XCircle, HelpCircle, Plus, Minus, X, ChevronRight, ChevronLeft,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, RefreshCw, Repeat, RotateCw,
  Download, Upload, Share, Send, Mail, Phone, MapPin, Navigation, Compass,
  Home, Building, Store, Coffee, Utensils, Pizza, Wine, ShoppingBag,
  Laptop, Smartphone, Tablet, Monitor, Cpu, HardDrive, Database, Server,
  Wifi, Bluetooth, Cast, Radio, Video, Camera, Image, Film, Music,
  Headphones, Mic, Volume2, Bell, BellOff, Bookmark, Flag, Archive,
  Trash, Edit, FilePlus, FileText, Folder, FolderOpen, Save, Printer,
  Search, Filter, Settings, Tool, Wrench, Sliders, ToggleLeft, Power,
  Zap as ZapIcon, CloudLightning, Cloud, CloudRain, CloudSnow, Wind,
  Thermometer, Umbrella, Sunrise, Sunset, Maximize, Minimize, Move, Copy
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BenefitIconPickerProps {
  currentIcon: string
  benefitNumber: number
  onIconChange: (icon: string) => void
}

const AVAILABLE_ICONS = [
  // Fitness & Health
  { key: 'dumbbell', icon: Dumbbell, label: 'Dumbbell', category: 'Fitness' },
  { key: 'activity', icon: Activity, label: 'Activity', category: 'Fitness' },
  { key: 'heart-pulse', icon: HeartPulse, label: 'Heart Pulse', category: 'Health' },
  { key: 'heart', icon: Heart, label: 'Heart', category: 'Health' },
  { key: 'brain', icon: Brain, label: 'Brain', category: 'Health' },
  { key: 'target', icon: Target, label: 'Target', category: 'Fitness' },
  { key: 'flame', icon: Flame, label: 'Flame', category: 'Fitness' },
  
  // Energy & Power
  { key: 'battery', icon: Battery, label: 'Battery', category: 'Energy' },
  { key: 'zap', icon: Zap, label: 'Zap', category: 'Energy' },
  { key: 'sun', icon: Sun, label: 'Sun', category: 'Energy' },
  { key: 'sparkles', icon: Sparkles, label: 'Sparkles', category: 'Energy' },
  { key: 'cloud-lightning', icon: CloudLightning, label: 'Lightning', category: 'Energy' },
  
  // Protection & Safety
  { key: 'shield', icon: Shield, label: 'Shield', category: 'Protection' },
  { key: 'lock', icon: Lock, label: 'Lock', category: 'Protection' },
  { key: 'umbrella', icon: Umbrella, label: 'Umbrella', category: 'Protection' },
  
  // Nature & Organic
  { key: 'leaf', icon: Leaf, label: 'Leaf', category: 'Nature' },
  { key: 'droplet', icon: Droplet, label: 'Droplet', category: 'Nature' },
  { key: 'cloud', icon: Cloud, label: 'Cloud', category: 'Nature' },
  { key: 'wind', icon: Wind, label: 'Wind', category: 'Nature' },
  { key: 'sunrise', icon: Sunrise, label: 'Sunrise', category: 'Nature' },
  { key: 'moon', icon: Moon, label: 'Moon', category: 'Nature' },
  
  // Success & Achievement
  { key: 'award', icon: Award, label: 'Award', category: 'Success' },
  { key: 'star', icon: Star, label: 'Star', category: 'Success' },
  { key: 'trending-up', icon: TrendingUp, label: 'Trending Up', category: 'Success' },
  { key: 'thumbs-up', icon: ThumbsUp, label: 'Thumbs Up', category: 'Success' },
  { key: 'check-circle', icon: CheckCircle, label: 'Check Circle', category: 'Success' },
  
  // Time & Speed
  { key: 'clock', icon: Clock, label: 'Clock', category: 'Time' },
  { key: 'timer', icon: Timer, label: 'Timer', category: 'Time' },
  { key: 'calendar', icon: Calendar, label: 'Calendar', category: 'Time' },
  { key: 'refresh', icon: RefreshCw, label: 'Refresh', category: 'Time' },
  
  // Social & Community
  { key: 'users', icon: Users, label: 'Users', category: 'Social' },
  { key: 'globe', icon: Globe, label: 'Globe', category: 'Social' },
  { key: 'message-circle', icon: MessageCircle, label: 'Message', category: 'Social' },
  { key: 'share', icon: Share, label: 'Share', category: 'Social' },
  
  // Commerce & Money
  { key: 'shopping-cart', icon: ShoppingCart, label: 'Shopping Cart', category: 'Commerce' },
  { key: 'package', icon: Package, label: 'Package', category: 'Commerce' },
  { key: 'gift', icon: Gift, label: 'Gift', category: 'Commerce' },
  { key: 'tag', icon: Tag, label: 'Tag', category: 'Commerce' },
  { key: 'dollar-sign', icon: DollarSign, label: 'Dollar', category: 'Commerce' },
  { key: 'percent', icon: Percent, label: 'Percent', category: 'Commerce' },
  
  // Analytics & Data
  { key: 'bar-chart', icon: BarChart, label: 'Bar Chart', category: 'Analytics' },
  { key: 'pie-chart', icon: PieChart, label: 'Pie Chart', category: 'Analytics' },
  { key: 'line-chart', icon: LineChart, label: 'Line Chart', category: 'Analytics' },
  { key: 'trending-down', icon: TrendingDown, label: 'Trending Down', category: 'Analytics' },
  
  // Emotions
  { key: 'smile', icon: Smile, label: 'Smile', category: 'Emotion' },
  { key: 'frown', icon: Frown, label: 'Frown', category: 'Emotion' },
  { key: 'meh', icon: Meh, label: 'Meh', category: 'Emotion' },
  
  // Communication
  { key: 'mail', icon: Mail, label: 'Mail', category: 'Communication' },
  { key: 'phone', icon: Phone, label: 'Phone', category: 'Communication' },
  { key: 'send', icon: Send, label: 'Send', category: 'Communication' },
  
  // Location
  { key: 'map-pin', icon: MapPin, label: 'Map Pin', category: 'Location' },
  { key: 'navigation', icon: Navigation, label: 'Navigation', category: 'Location' },
  { key: 'compass', icon: Compass, label: 'Compass', category: 'Location' },
  { key: 'home', icon: Home, label: 'Home', category: 'Location' },
  
  // Food & Drink
  { key: 'coffee', icon: Coffee, label: 'Coffee', category: 'Food' },
  { key: 'utensils', icon: Utensils, label: 'Utensils', category: 'Food' },
  { key: 'pizza', icon: Pizza, label: 'Pizza', category: 'Food' },
  { key: 'wine', icon: Wine, label: 'Wine', category: 'Food' },
  
  // Technology
  { key: 'laptop', icon: Laptop, label: 'Laptop', category: 'Technology' },
  { key: 'smartphone', icon: Smartphone, label: 'Smartphone', category: 'Technology' },
  { key: 'wifi', icon: Wifi, label: 'WiFi', category: 'Technology' },
  { key: 'database', icon: Database, label: 'Database', category: 'Technology' },
  
  // Media
  { key: 'camera', icon: Camera, label: 'Camera', category: 'Media' },
  { key: 'video', icon: Video, label: 'Video', category: 'Media' },
  { key: 'music', icon: Music, label: 'Music', category: 'Media' },
  { key: 'headphones', icon: Headphones, label: 'Headphones', category: 'Media' },
  
  // Alerts
  { key: 'info', icon: Info, label: 'Info', category: 'Alert' },
  { key: 'alert-triangle', icon: AlertTriangle, label: 'Alert', category: 'Alert' },
  { key: 'help-circle', icon: HelpCircle, label: 'Help', category: 'Alert' },
  
  // UI Elements
  { key: 'check', icon: CheckIcon, label: 'Check', category: 'UI' },
  { key: 'x-circle', icon: XCircle, label: 'X Circle', category: 'UI' },
  { key: 'arrow-right', icon: ArrowRight, label: 'Arrow Right', category: 'UI' },
  { key: 'bookmark', icon: Bookmark, label: 'Bookmark', category: 'UI' },
  { key: 'flag', icon: Flag, label: 'Flag', category: 'UI' },
  { key: 'bell', icon: Bell, label: 'Bell', category: 'UI' },
  { key: 'search', icon: Search, label: 'Search', category: 'UI' },
  { key: 'settings', icon: Settings, label: 'Settings', category: 'UI' },
]

export function BenefitIconPicker({ currentIcon, benefitNumber, onIconChange }: BenefitIconPickerProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const currentIconData = AVAILABLE_ICONS.find(i => i.key === currentIcon) || AVAILABLE_ICONS[0]
  const CurrentIcon = currentIconData.icon

  const filteredIcons = AVAILABLE_ICONS.filter(icon => 
    icon.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    icon.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-9 justify-between"
        >
          <div className="flex items-center gap-2">
            <CurrentIcon className="h-4 w-4" />
            <span className="text-sm">{currentIconData.label}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="p-2 border-b">
          <Input
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <ScrollArea className="h-[300px]">
          <div className="p-2">
            {filteredIcons.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No icons found.
              </div>
            ) : (
              <div className="space-y-1">
                {filteredIcons.map(({ key, icon: Icon, label, category }) => (
                  <Button
                    key={key}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start font-normal",
                      currentIcon === key && "bg-accent"
                    )}
                    onClick={() => {
                      onIconChange(key)
                      setOpen(false)
                      setSearchQuery('')
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span className="flex-1 text-left">{label}</span>
                    <span className="text-xs text-muted-foreground">{category}</span>
                    {currentIcon === key && (
                      <Check className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

