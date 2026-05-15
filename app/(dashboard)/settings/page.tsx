'use client';

import { Bell, CheckCircle2, Mail, Save, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NotificationSettings, useAppContext } from '../../context/AppContext';

type SettingItem = {
  key: keyof NotificationSettings;
  title: string;
  description: string;
};

const settingItems: SettingItem[] = [
  {
    key: 'money_received',
    title: 'Money received',
    description: 'Notify me when another QORAPP user sends money to my wallet.',
  },
  {
    key: 'money_sent',
    title: 'Money sent',
    description: 'Notify me when a transfer from my wallet is completed.',
  },
  {
    key: 'sales',
    title: 'Sales',
    description: 'Notify me when a sale is recorded.',
  },
  {
    key: 'expenses',
    title: 'Expenses',
    description: 'Notify me when an expense is recorded.',
  },
  {
    key: 'inventory',
    title: 'Inventory',
    description: 'Notify me when stock is added or updated.',
  },
];

export default function SettingsScreen() {
  const { user, notificationSettings, updateNotificationSettings } = useAppContext();
  const [settings, setSettings] = useState<NotificationSettings>(notificationSettings);
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettings(notificationSettings);
  }, [notificationSettings]);

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setStatus('');
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setStatus('Saving settings...');

    const result = await updateNotificationSettings(settings);
    if (result.error) {
      setStatus(result.error);
      setIsSaving(false);
      return;
    }

    setStatus('Settings saved.');
    setIsSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-pesa-navy tracking-tight">Settings</h1>
        <p className="text-neutral-500 font-medium mt-1">Manage account preferences and dashboard notifications.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <div className="rounded-3xl md:rounded-[2rem] bg-pesa-navy p-5 sm:p-6 text-white shadow-xl">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-duma-green">
            <SlidersHorizontal size={26} />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-bold">Account</p>
          <h2 className="mt-2 text-2xl font-black">{user?.businessName || 'My Business'}</h2>
          <div className="mt-6 space-y-3 text-sm font-semibold text-slate-300">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-duma-green" />
              <span className="truncate">{user?.email || 'No email loaded'}</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-duma-green" />
              <span>Reference: {user?.refCode || 'Pending'}</span>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 rounded-3xl md:rounded-[2rem] bg-white border border-gray-100 shadow-sm p-4 sm:p-6">
          <div className="mb-6 flex items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-pesa-navy">Notification Settings</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">Choose which dashboard events create notifications.</p>
            </div>
            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-duma-green/10 text-duma-green">
              <Bell size={22} />
            </div>
          </div>

          <div className="space-y-4">
            {settingItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleSetting(item.key)}
                className="w-full rounded-2xl border border-gray-100 bg-slate-50/60 p-4 text-left transition hover:border-duma-green/40 hover:bg-green-50/40"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-black text-pesa-navy">{item.title}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{item.description}</p>
                  </div>
                  <span className={`relative h-7 w-12 rounded-full transition ${settings[item.key] ? 'bg-duma-green' : 'bg-slate-300'}`}>
                    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${settings[item.key] ? 'left-6' : 'left-1'}`} />
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-500">{status}</p>
            <button
              type="button"
              onClick={saveSettings}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-duma-green px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-60"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
