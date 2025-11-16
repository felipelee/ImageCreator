import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { INGREDIENT_BENEFITS_SPEC } from '@/lib/layouts/specs/ingredient-benefits-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition, combineTransforms } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'
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
  Search, Filter, Settings, Wrench, Sliders, ToggleLeft, Power,
  CloudLightning, Cloud, CloudRain, CloudSnow, Wind,
  Thermometer, Umbrella, Sunrise, Sunset, Maximize, Minimize, Move, Copy,
  FlaskRound
} from 'lucide-react'

interface IngredientBenefitsLayoutProps {
  brand: Brand
  sku: SKU
}

// Icon mappings for benefits
const BENEFIT_ICONS: Record<string, any> = {
  'dumbbell': Dumbbell,
  'activity': Activity,
  'heart-pulse': HeartPulse,
  'heart': Heart,
  'brain': Brain,
  'target': Target,
  'flame': Flame,
  'flask': FlaskRound,
  'thermometer': Thermometer,
  'battery': Battery,
  'zap': Zap,
  'sun': Sun,
  'sparkles': Sparkles,
  'cloud-lightning': CloudLightning,
  'power': Power,
  'shield': Shield,
  'lock': Lock,
  'unlock': Unlock,
  'key': Key,
  'umbrella': Umbrella,
  'leaf': Leaf,
  'droplet': Droplet,
  'cloud': Cloud,
  'cloud-rain': CloudRain,
  'cloud-snow': CloudSnow,
  'wind': Wind,
  'sunrise': Sunrise,
  'sunset': Sunset,
  'moon': Moon,
  'award': Award,
  'star': Star,
  'trending-up': TrendingUp,
  'thumbs-up': ThumbsUp,
  'check-circle': CheckCircle,
  'clock': Clock,
  'timer': Timer,
  'calendar': Calendar,
  'refresh': RefreshCw,
  'repeat': Repeat,
  'rotate-cw': RotateCw,
  'users': Users,
  'globe': Globe,
  'message-circle': MessageCircle,
  'share': Share,
  'shopping-cart': ShoppingCart,
  'shopping-bag': ShoppingBag,
  'package': Package,
  'gift': Gift,
  'tag': Tag,
  'dollar-sign': DollarSign,
  'percent': Percent,
  'credit-card': CreditCard,
  'bar-chart': BarChart,
  'pie-chart': PieChart,
  'line-chart': LineChart,
  'trending-down': TrendingDown,
  'smile': Smile,
  'frown': Frown,
  'meh': Meh,
  'eye': Eye,
  'eye-off': EyeOff,
  'mail': Mail,
  'phone': Phone,
  'send': Send,
  'mic': Mic,
  'volume': Volume2,
  'map-pin': MapPin,
  'navigation': Navigation,
  'compass': Compass,
  'home': Home,
  'building': Building,
  'store': Store,
  'coffee': Coffee,
  'utensils': Utensils,
  'pizza': Pizza,
  'wine': Wine,
  'laptop': Laptop,
  'smartphone': Smartphone,
  'tablet': Tablet,
  'monitor': Monitor,
  'cpu': Cpu,
  'hard-drive': HardDrive,
  'database': Database,
  'server': Server,
  'wifi': Wifi,
  'bluetooth': Bluetooth,
  'cast': Cast,
  'radio': Radio,
  'camera': Camera,
  'video': Video,
  'music': Music,
  'headphones': Headphones,
  'image': Image,
  'film': Film,
  'info': Info,
  'alert-triangle': AlertTriangle,
  'help-circle': HelpCircle,
  'bell': Bell,
  'bell-off': BellOff,
  'file-text': FileText,
  'file-plus': FilePlus,
  'folder': Folder,
  'folder-open': FolderOpen,
  'save': Save,
  'archive': Archive,
  'trash': Trash,
  'download': Download,
  'upload': Upload,
  'printer': Printer,
  'check': Check,
  'x-circle': XCircle,
  'x': X,
  'plus': Plus,
  'minus': Minus,
  'bookmark': Bookmark,
  'flag': Flag,
  'search': Search,
  'filter': Filter,
  'settings': Settings,
  'wrench': Wrench,
  'sliders': Sliders,
  'toggle-left': ToggleLeft,
  'edit': Edit,
  'copy': Copy,
  'move': Move,
  'maximize': Maximize,
  'minimize': Minimize,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
}

export function IngredientBenefitsLayout({ brand, sku }: IngredientBenefitsLayoutProps) {
  if (!brand || !sku) return null
  
  const spec = INGREDIENT_BENEFITS_SPEC
  const colors = brand.colors || { bg: '#F9F7F2', text: '#323429', accent: '#E85D4F' }
  const fonts = brand.fonts || { family: 'Inter' }
  
  const bgColor = getFieldColorValue(brand, sku, 'ingredientBenefits', 'Background Color', 'bg')
  const headlineColor = getFieldColorValue(brand, sku, 'ingredientBenefits', 'Headline', 'text')
  const subheadlineColor = getFieldColorValue(brand, sku, 'ingredientBenefits', 'Subheadline', 'text')
  const iconColor = getFieldColorValue(brand, sku, 'ingredientBenefits', 'Benefit Icons', 'accent')
  const labelColor = getFieldColorValue(brand, sku, 'ingredientBenefits', 'Benefit Labels', 'accent')

  const benefits = [
    {
      icon: sku.copy.ingredientBenefits?.benefit1_icon || 'dumbbell',
      label: sku.copy.ingredientBenefits?.benefit1_label || 'Muscle Power'
    },
    {
      icon: sku.copy.ingredientBenefits?.benefit2_icon || 'brain',
      label: sku.copy.ingredientBenefits?.benefit2_label || 'Support Focus'
    },
    {
      icon: sku.copy.ingredientBenefits?.benefit3_icon || 'flask',
      label: sku.copy.ingredientBenefits?.benefit3_label || '3rd Party Tested'
    },
    {
      icon: sku.copy.ingredientBenefits?.benefit4_icon || 'zap',
      label: sku.copy.ingredientBenefits?.benefit4_label || 'Boost Energy'
    },
    {
      icon: sku.copy.ingredientBenefits?.benefit5_icon || 'refresh',
      label: sku.copy.ingredientBenefits?.benefit5_label || 'Recover Faster'
    }
  ]

  // Resolve positions with overrides
  const ingredientImagePos = resolveElementPosition('ingredientBenefits', 'ingredientImage', {
    top: 0,
    left: 0,
    x: 0,
    y: 0,
    width: 540,
    height: 820,
    zIndex: 10
  }, sku.positionOverrides)
  
  const headlinePos = resolveElementPosition('ingredientBenefits', 'headline', {
    top: 240,
    left: 530,
    x: 530,
    y: 240,
    width: 520,
    height: 240,
    zIndex: 20
  }, sku.positionOverrides)
  
  const subheadlinePos = resolveElementPosition('ingredientBenefits', 'subheadline', {
    top: 580,
    left: 530,
    x: 530,
    y: 580,
    width: 520,
    height: 120,
    zIndex: 20
  }, sku.positionOverrides)

  return (
    <div
      style={{
        position: 'relative',
        width: `${spec.canvas.width}px`,
        height: `${spec.canvas.height}px`,
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
          backgroundColor: bgColor,
          zIndex: spec.elements.background.zIndex
        }}
      />

      {/* Ingredient Image */}
      {(sku.images.ingredientA || true) && (
        <div
          style={{
            position: 'absolute',
            top: ingredientImagePos.top,
            left: ingredientImagePos.left,
            width: ingredientImagePos.width,
            height: ingredientImagePos.height,
            overflow: 'hidden',
            zIndex: ingredientImagePos.zIndex ?? 10,
            transform: combineTransforms(undefined, ingredientImagePos.rotation)
          }}
        >
          <img
            src={sku.images.ingredientA || '/placeholder-image.svg'}
            alt="Ingredient"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: sku.images.ingredientA ? 1 : 0.3
            }}
          />
        </div>
      )}

      {/* Headline */}
      <h1
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
          transform: combineTransforms(undefined, headlinePos.rotation),
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        {sku.copy.ingredientBenefits?.headline || 'What could you do with more energy?'}
      </h1>

      {/* Subheadline */}
      <p
        style={{
          position: 'absolute',
          top: subheadlinePos.top,
          left: subheadlinePos.left,
          width: subheadlinePos.width,
          height: subheadlinePos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.subheadline.fontSize,
          fontWeight: spec.elements.subheadline.fontWeight,
          lineHeight: spec.elements.subheadline.lineHeight,
          letterSpacing: `${spec.elements.subheadline.letterSpacing}px`,
          color: subheadlineColor,
          textAlign: spec.elements.subheadline.textAlign,
          zIndex: subheadlinePos.zIndex ?? spec.elements.subheadline.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, subheadlinePos.rotation),
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        {sku.copy.ingredientBenefits?.subheadline || 'Feel your best every day, wherever it takes you.'}
      </p>

      {/* Benefits Row */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.benefitsContainer.top,
          left: spec.elements.benefitsContainer.left,
          width: spec.elements.benefitsContainer.width,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: `${spec.elements.benefitsContainer.gap}px`,
          zIndex: spec.elements.benefitsContainer.zIndex
        }}
      >
        {benefits.map((benefit, index) => {
          const IconComponent = BENEFIT_ICONS[benefit.icon as keyof typeof BENEFIT_ICONS]
          
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: spec.elements.benefitStyle.label.width
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: spec.elements.benefitStyle.icon.size,
                  height: spec.elements.benefitStyle.icon.size,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
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
              
              {/* Label */}
              <p
                style={{
                  fontFamily: fonts.family,
                  fontSize: spec.elements.benefitStyle.label.fontSize,
                  fontWeight: spec.elements.benefitStyle.label.fontWeight,
                  lineHeight: spec.elements.benefitStyle.label.lineHeight,
                  letterSpacing: `${spec.elements.benefitStyle.label.letterSpacing}px`,
                  color: labelColor,
                  textAlign: spec.elements.benefitStyle.label.textAlign,
                  width: spec.elements.benefitStyle.label.width,
                  marginTop: `${spec.elements.benefitStyle.label.marginTop}px`,
                  margin: 0,
                  padding: 0,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {benefit.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* Custom Elements */}
      <CustomElementRenderer
        customElements={sku.customElements?.ingredientBenefits || []}
        brand={brand}
        sku={sku}
        skuContentOverrides={sku.customElementContent || {}}
        isEditMode={false}
      />
    </div>
  )
}

