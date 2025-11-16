import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { BOTTLE_LIST_SPEC } from '@/lib/layouts/specs/bottle-list-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition, combineTransforms } from '@/lib/layout-utils'
import { 
  Dumbbell, Battery, HeartPulse, Zap, Brain, Shield, Leaf, Target, Activity,
  Sparkles, Star, Award, TrendingUp, ThumbsUp, Check, Users, Globe,
  MessageCircle, Heart, Flame, Droplet, Sun, Moon, Clock, Timer, Calendar,
  Package, ShoppingCart, CreditCard, Gift, Tag, DollarSign, Percent, TrendingDown,
  BarChart, PieChart, LineChart, Smile, Frown, Meh,
  Eye, EyeOff, Lock, Unlock, Key, AlertTriangle, Info,
  CheckCircle, XCircle, HelpCircle, Plus, Minus, X, ChevronRight, ChevronLeft,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, RefreshCw, Repeat, RotateCw,
  Download, Upload, Share, Send, Mail, Phone, MapPin, Navigation, Compass,
  Home, Building, Store, Coffee, Utensils, Pizza, Wine, ShoppingBag,
  Laptop, Smartphone, Tablet, Monitor, Cpu, HardDrive, Database, Server,
  Wifi, Bluetooth, Cast, Radio, Video, Camera, Image, Film, Music,
  Headphones, Mic, Volume2, Bell, BellOff, Bookmark, Flag, Archive,
  Trash, Edit, FilePlus, FileText, Folder, FolderOpen, Save, Printer,
  Search, Filter, Settings, Tool, Wrench, Sliders, ToggleLeft, Power,
  CloudLightning, Cloud, CloudRain, CloudSnow, Wind,
  Thermometer, Umbrella, Sunrise, Sunset, Maximize, Minimize, Move, Copy
} from 'lucide-react'

interface BottleListLayoutProps {
  brand: Brand
  sku: SKU
}

// Icon component mappings - expanded list matching the picker
const BENEFIT_ICONS: Record<string, any> = {
  // Fitness & Health
  'dumbbell': Dumbbell,
  'activity': Activity,
  'heart-pulse': HeartPulse,
  'heart': Heart,
  'brain': Brain,
  'target': Target,
  'flame': Flame,
  
  // Energy & Power
  'battery': Battery,
  'zap': Zap,
  'sun': Sun,
  'sparkles': Sparkles,
  'cloud-lightning': CloudLightning,
  
  // Protection & Safety
  'shield': Shield,
  'lock': Lock,
  'umbrella': Umbrella,
  
  // Nature & Organic
  'leaf': Leaf,
  'droplet': Droplet,
  'cloud': Cloud,
  'wind': Wind,
  'sunrise': Sunrise,
  'moon': Moon,
  
  // Success & Achievement
  'award': Award,
  'star': Star,
  'trending-up': TrendingUp,
  'thumbs-up': ThumbsUp,
  'check-circle': CheckCircle,
  
  // Time & Speed
  'clock': Clock,
  'timer': Timer,
  'calendar': Calendar,
  'refresh': RefreshCw,
  
  // Social & Community
  'users': Users,
  'globe': Globe,
  'message-circle': MessageCircle,
  'share': Share,
  
  // Commerce & Money
  'shopping-cart': ShoppingCart,
  'package': Package,
  'gift': Gift,
  'tag': Tag,
  'dollar-sign': DollarSign,
  'percent': Percent,
  
  // Analytics & Data
  'bar-chart': BarChart,
  'pie-chart': PieChart,
  'line-chart': LineChart,
  'trending-down': TrendingDown,
  
  // Emotions
  'smile': Smile,
  'frown': Frown,
  'meh': Meh,
  
  // Communication
  'mail': Mail,
  'phone': Phone,
  'send': Send,
  
  // Location
  'map-pin': MapPin,
  'navigation': Navigation,
  'compass': Compass,
  'home': Home,
  
  // Food & Drink
  'coffee': Coffee,
  'utensils': Utensils,
  'pizza': Pizza,
  'wine': Wine,
  
  // Technology
  'laptop': Laptop,
  'smartphone': Smartphone,
  'wifi': Wifi,
  'database': Database,
  
  // Media
  'camera': Camera,
  'video': Video,
  'music': Music,
  'headphones': Headphones,
  
  // Alerts
  'info': Info,
  'alert-triangle': AlertTriangle,
  'help-circle': HelpCircle,
  
  // UI Elements
  'check': Check,
  'x-circle': XCircle,
  'arrow-right': ArrowRight,
  'bookmark': Bookmark,
  'flag': Flag,
  'bell': Bell,
  'search': Search,
  'settings': Settings,
}

export function BottleListLayout({ brand, sku }: BottleListLayoutProps) {
  if (!brand || !sku) return null
  
  const spec = BOTTLE_LIST_SPEC
  const colors = brand.colors || { bg: '#F9F7F2', accent: '#323429', textSecondary: '#6C6C6C' }
  const fonts = brand.fonts || { family: 'Inter' }
  
  // Get colors with override support
  const backgroundColor = getFieldColorValue(brand, sku, 'bottleList', 'Background Color', 'bg')
  const headlineColor = getFieldColorValue(brand, sku, 'bottleList', 'Headline', 'accent')
  const titleColor = getFieldColorValue(brand, sku, 'bottleList', 'Benefit 1 Title', 'accent')
  const descriptionColor = getFieldColorValue(brand, sku, 'bottleList', 'Benefit 1 Description', 'textSecondary')
  const iconColor = getFieldColorValue(brand, sku, 'bottleList', 'Benefit 1 Title', 'accent')

  // Get icon choices from SKU data (with fallback defaults)
  const benefit1Icon = sku.copy.bottle?.benefit1_icon || 'dumbbell'
  const benefit2Icon = sku.copy.bottle?.benefit2_icon || 'battery'
  const benefit3Icon = sku.copy.bottle?.benefit3_icon || 'heart-pulse'

  const benefits = [
    {
      icon: benefit1Icon,
      title: sku.copy.bottle?.benefit1 || 'Stronger muscles',
      description: sku.copy.bottle?.benefit1_detail || 'SUPPORTS MUSCLE PROTEIN SYNTHESIS AND LEAN MUSCLE REPAIR'
    },
    {
      icon: benefit2Icon,
      title: sku.copy.bottle?.benefit2 || 'Faster recovery',
      description: sku.copy.bottle?.benefit2_detail || 'SUPPORTS MUSCLE STRENGTH RECOVERY BETWEEN WORKOUTS'
    },
    {
      icon: benefit3Icon,
      title: sku.copy.bottle?.benefit3 || 'Healthy aging',
      description: sku.copy.bottle?.benefit3_detail || 'HELPS MAINTAIN NAD+ LEVELS TO SUPPORT LONG-TERM MUSCLE FUNCTION'
    }
  ]

  // Resolve positions with overrides
  const headlinePos = resolveElementPosition('bottleList', 'headline', spec.elements.headline, sku.positionOverrides)
  const productImagePos = resolveElementPosition('bottleList', 'productImage', spec.elements.productImage, sku.positionOverrides)
  
  const benefit1Pos = resolveElementPosition('bottleList', 'benefit1', {
    top: 432,
    left: 487,
    x: 487,
    y: 432,
    width: 500,
    height: 150,
    zIndex: 30
  }, sku.positionOverrides)
  
  const benefit2Pos = resolveElementPosition('bottleList', 'benefit2', {
    top: 632,
    left: 487,
    x: 487,
    y: 632,
    width: 500,
    height: 150,
    zIndex: 30
  }, sku.positionOverrides)
  
  const benefit3Pos = resolveElementPosition('bottleList', 'benefit3', {
    top: 832,
    left: 487,
    x: 487,
    y: 832,
    width: 500,
    height: 150,
    zIndex: 30
  }, sku.positionOverrides)

  // Render a single benefit with icon
  const renderBenefit = (benefit: typeof benefits[0], pos: any) => {
    const IconComponent = BENEFIT_ICONS[benefit.icon as keyof typeof BENEFIT_ICONS]
    
    return (
      <div
        style={{
          position: 'absolute',
          top: pos.top,
          left: pos.left,
          width: pos.width,
          height: pos.height,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: spec.elements.benefitStyle.container.gap,
          zIndex: pos.zIndex ?? 30,
          transform: combineTransforms(undefined, pos.rotation)
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: spec.elements.benefitStyle.icon.size,
            height: spec.elements.benefitStyle.icon.size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {IconComponent && (
            <IconComponent
              size={spec.elements.benefitStyle.icon.fontSize}
              style={{
                color: iconColor,
                strokeWidth: 1.5
              }}
            />
          )}
        </div>

        {/* Text Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spec.elements.benefitStyle.description.gap
          }}
        >
          {/* Title */}
          <p
            style={{
              fontFamily: fonts.family,
              fontSize: spec.elements.benefitStyle.title.fontSize,
              fontWeight: spec.elements.benefitStyle.title.fontWeight,
              lineHeight: spec.elements.benefitStyle.title.lineHeight,
              letterSpacing: `${spec.elements.benefitStyle.title.letterSpacing}px`,
              color: titleColor,
              width: spec.elements.benefitStyle.title.width,
              height: spec.elements.benefitStyle.title.height,
              margin: 0,
              padding: 0
            }}
          >
            {benefit.title}
          </p>

          {/* Description */}
          <p
            style={{
              fontFamily: fonts.family,
              fontSize: spec.elements.benefitStyle.description.fontSize,
              fontWeight: spec.elements.benefitStyle.description.fontWeight,
              lineHeight: spec.elements.benefitStyle.description.lineHeight,
              letterSpacing: `${spec.elements.benefitStyle.description.letterSpacing}px`,
              textTransform: spec.elements.benefitStyle.description.textTransform,
              color: descriptionColor,
              width: spec.elements.benefitStyle.description.width,
              margin: 0,
              padding: 0,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {benefit.description}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        width: `${spec.canvas.width}px`,
        height: `${spec.canvas.height}px`,
        backgroundColor: backgroundColor,
        overflow: 'hidden',
        fontFamily: fonts.family
      }}
    >
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.background.top,
          left: spec.elements.background.left,
          width: spec.elements.background.width,
          height: spec.elements.background.height,
          backgroundColor: backgroundColor,
          zIndex: spec.elements.background.zIndex
        }}
      />

      {/* Product Image (Hand holding product) */}
      {(sku.images.lifestyleA || true) && (
        <img
          src={sku.images.lifestyleA || '/placeholder-image.svg'}
          alt="Product"
          style={{
            position: 'absolute',
            top: productImagePos.top,
            left: productImagePos.left,
            width: productImagePos.width,
            height: productImagePos.height,
            transform: combineTransforms(
              productImagePos.rotation ? `rotate(${productImagePos.rotation}deg)` : undefined
            ),
            transformOrigin: 'top left',
            objectFit: 'cover',
            objectPosition: '76% 50%',
            zIndex: productImagePos.zIndex ?? spec.elements.productImage.zIndex,
            opacity: sku.images.lifestyleA ? 1 : 0.3
            }}
          />
      )}

      {/* Headline */}
      <p
        style={{
          position: 'absolute',
          top: headlinePos.top,
          left: headlinePos.left,
          width: headlinePos.width,
          height: headlinePos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.headline.fontSize,
          fontWeight: spec.elements.headline.fontWeight,
          lineHeight: spec.elements.headline.lineHeight,
          letterSpacing: `${spec.elements.headline.letterSpacing}px`,
          color: headlineColor,
          textAlign: spec.elements.headline.textAlign,
          zIndex: headlinePos.zIndex ?? spec.elements.headline.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, headlinePos.rotation)
        }}
      >
        {sku.copy.bottle?.headline || 'Stronger, Longer'}
      </p>

      {/* Individual Benefits - Each with position overrides */}
      {renderBenefit(benefits[0], benefit1Pos)}
      {renderBenefit(benefits[1], benefit2Pos)}
      {renderBenefit(benefits[2], benefit3Pos)}
    </div>
  )
}

