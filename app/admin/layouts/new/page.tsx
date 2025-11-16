'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Copy, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { LayoutTemplateInput } from '@/types/layout-template'

const STARTER_TEMPLATES = [
  { key: 'bottleList', name: 'Bottle List', category: 'product' },
  { key: 'comparison', name: 'Comparison', category: 'comparison' },
  { key: 'testimonial', name: 'Testimonial', category: 'testimonial' },
  { key: 'bigStat', name: 'Big Stat', category: 'stats' },
  { key: 'socialProof', name: 'Social Proof', category: 'social-proof' },
]

const BLANK_SPEC = {
  canvas: { width: 1080, height: 1080 },
  elements: {
    background: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: 1080,
      height: 1080,
      backgroundColor: 'bg',
      zIndex: 0
    }
  }
}

export default function NewLayoutPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [creating, setCreating] = useState(false)

  // Form state
  const [key, setKey] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('product')
  const [startingPoint, setStartingPoint] = useState<'blank' | 'duplicate'>('blank')
  const [templateToDuplicate, setTemplateToDuplicate] = useState('bottleList')

  function validateStep1() {
    if (!key || !name || !category) {
      toast.error('Please fill in all required fields')
      return false
    }
    
    // Validate key format (alphanumeric, no spaces)
    if (!/^[a-zA-Z0-9_]+$/.test(key)) {
      toast.error('Key must be alphanumeric (underscores allowed, no spaces)')
      return false
    }
    
    return true
  }

  async function handleCreate() {
    try {
      setCreating(true)
      
      let spec = BLANK_SPEC
      let copyTemplate = undefined
      
      // If duplicating, fetch the template
      if (startingPoint === 'duplicate') {
        const res = await fetch(`/api/admin/layouts/${templateToDuplicate}`)
        if (res.ok) {
          const template = await res.json()
          spec = template.spec
          copyTemplate = template.copyTemplate
        }
      }
      
      const newLayout: LayoutTemplateInput = {
        key,
        name,
        description,
        category: category as any,
        enabled: true,
        spec,
        copyTemplate
      }
      
      const res = await fetch('/api/admin/layouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLayout)
      })
      
      if (res.ok) {
        toast.success('Layout created successfully!')
        router.push(`/admin/layouts/${key}`)
      } else {
        const error = await res.json()
        toast.error(error.error || 'Failed to create layout')
      }
    } catch (error) {
      console.error('Failed to create layout:', error)
      toast.error('Failed to create layout')
    } finally {
      setCreating(false)
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Create New Layout"
        description="Add a new master layout template"
        breadcrumbs={[
          { label: 'Layouts', href: '/admin/layouts' },
          { label: 'New Layout' }
        ]}
        action={
          <Button variant="outline" onClick={() => router.push('/admin/layouts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        }
      />

      <div className="max-w-3xl space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  s === step
                    ? 'border-primary bg-primary text-primary-foreground'
                    : s < step
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-muted bg-muted text-muted-foreground'
                }`}
              >
                {s < step ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-0.5 ${s < step ? 'bg-green-500' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Basic Information</CardTitle>
              <CardDescription>
                Define the layout's name, key, and category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key">
                  Layout Key <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="e.g., myCustomLayout"
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier (alphanumeric, underscores allowed, no spaces)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Display Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., My Custom Layout"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this layout is used for..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="testimonial">Testimonial</SelectItem>
                    <SelectItem value="comparison">Comparison</SelectItem>
                    <SelectItem value="stats">Stats</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="social-proof">Social Proof</SelectItem>
                    <SelectItem value="timeline">Timeline</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => validateStep1() && setStep(2)}>
                  Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Starting Point */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Starting Point</CardTitle>
              <CardDescription>
                Choose whether to start from scratch or duplicate an existing layout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={startingPoint} onValueChange={(v) => setStartingPoint(v as any)}>
                <div className="space-y-4">
                  {/* Blank Canvas */}
                  <div
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer ${
                      startingPoint === 'blank' ? 'border-primary bg-primary/5' : 'border-muted'
                    }`}
                    onClick={() => setStartingPoint('blank')}
                  >
                    <RadioGroupItem value="blank" id="blank" />
                    <div className="flex-1">
                      <Label htmlFor="blank" className="cursor-pointer font-medium">
                        <Plus className="h-4 w-4 inline mr-2" />
                        Start from Blank Canvas
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Create a new layout from scratch with just a background element
                      </p>
                    </div>
                  </div>

                  {/* Duplicate Existing */}
                  <div
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer ${
                      startingPoint === 'duplicate' ? 'border-primary bg-primary/5' : 'border-muted'
                    }`}
                    onClick={() => setStartingPoint('duplicate')}
                  >
                    <RadioGroupItem value="duplicate" id="duplicate" />
                    <div className="flex-1">
                      <Label htmlFor="duplicate" className="cursor-pointer font-medium">
                        <Copy className="h-4 w-4 inline mr-2" />
                        Duplicate Existing Layout
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Start with a copy of an existing layout and customize it
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>

              {startingPoint === 'duplicate' && (
                <div className="space-y-2 ml-9">
                  <Label>Select Template to Duplicate</Label>
                  <Select value={templateToDuplicate} onValueChange={setTemplateToDuplicate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STARTER_TEMPLATES.map((template) => (
                        <SelectItem key={template.key} value={template.key}>
                          {template.name} ({template.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review & Create */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Review & Create</CardTitle>
              <CardDescription>
                Review your layout configuration before creating
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                  <span className="font-medium">Key:</span>
                  <span className="font-mono">{key}</span>
                  
                  <span className="font-medium">Name:</span>
                  <span>{name}</span>
                  
                  <span className="font-medium">Category:</span>
                  <span className="capitalize">{category}</span>
                  
                  {description && (
                    <>
                      <span className="font-medium">Description:</span>
                      <span>{description}</span>
                    </>
                  )}
                  
                  <span className="font-medium">Starting from:</span>
                  <span>
                    {startingPoint === 'blank' 
                      ? 'Blank canvas' 
                      : `Duplicate of ${STARTER_TEMPLATES.find(t => t.key === templateToDuplicate)?.name}`
                    }
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Next steps after creation:</strong> You'll be taken to the layout editor 
                  where you can customize the specification, add elements, and configure copy fields. 
                  SKU-level customizations will use the existing visual editor.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleCreate} disabled={creating}>
                  <Check className="h-4 w-4 mr-2" />
                  {creating ? 'Creating...' : 'Create Layout'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}

