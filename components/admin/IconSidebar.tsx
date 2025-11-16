'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Settings, Moon, Sun, Layout } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function IconSidebar() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()

  const navItems = [
    { icon: Home, label: 'All Brands', href: '/', active: pathname === '/' },
    { icon: Layout, label: 'Layouts', href: '/admin/layouts', active: pathname?.startsWith('/admin/layouts') },
    { icon: Settings, label: 'Settings', href: '/settings', active: pathname === '/settings' },
  ]

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen w-16 flex-col items-center border-r bg-background py-4 gap-4">
        {/* Logo */}
        <Link href="/" className="mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
              <path d="M12 12l8-4.5" />
              <path d="M12 12v9" />
              <path d="M12 12L4 7.5" />
            </svg>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link href={item.href}>
                  <Button
                    variant={item.active ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-10 w-10"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* Theme Toggle at Bottom */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-10 w-10"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Toggle theme</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

