"use client"

import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Globe, Bell, Shield } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Global Settings</SheetTitle>
          <SheetDescription>
            Manage your preferences and application settings
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Regional Preferences */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
              <Globe size={16} />
              Regional Preferences
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD - US Dollar</SelectItem>
                    <SelectItem value="eur">EUR - Euro</SelectItem>
                    <SelectItem value="cny">CNY - Chinese Yuan</SelectItem>
                    <SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <Separator />

          {/* Notifications */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
              <Bell size={16} />
              Notifications
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about trip updates
                  </p>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your trips
                  </p>
                </div>
                <Switch id="email-notifications" />
              </div>
            </div>
          </section>

          <Separator />

          {/* Privacy */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
              <Shield size={16} />
              Privacy & Security
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="blind-budget">Blind Budgeting</Label>
                  <p className="text-sm text-muted-foreground">
                    Hide individual budgets from other travelers
                  </p>
                </div>
                <Switch id="blind-budget" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="location-sharing">Location Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Share your location with trip companions
                  </p>
                </div>
                <Switch id="location-sharing" />
              </div>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
