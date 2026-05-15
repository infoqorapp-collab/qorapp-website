'use client';

import { Bell, CheckCheck, CircleDollarSign, Package, Receipt, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext, AppNotification } from '../../context/AppContext';

const notificationIcons: Record<AppNotification['type'], typeof Bell> = {
  money_sent: Send,
  money_received: CircleDollarSign,
  sale_recorded: Receipt,
  expense_recorded: Receipt,
  inventory: Package,
  system: Bell,
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppContext();
  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  const openNotification = async (notification: AppNotification) => {
    await markNotificationRead(notification.id);
    router.push(notification.href || '/dashboard');
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-pesa-navy tracking-tight">Notifications</h1>
          <p className="text-neutral-500 font-medium mt-1">
            {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'You are all caught up.'}
          </p>
        </div>
        <button
          type="button"
          onClick={markAllNotificationsRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm font-black text-pesa-navy shadow-sm transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCheck size={18} />
          Mark all read
        </button>
      </div>

      <div className="rounded-3xl md:rounded-[2rem] bg-white border border-gray-100 shadow-sm overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => {
              const Icon = notificationIcons[notification.type] || Bell;

              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => openNotification(notification)}
                  className={`w-full p-4 sm:p-5 text-left transition hover:bg-slate-50 ${notification.is_read ? 'bg-white' : 'bg-green-50/50'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-2xl p-3 ${notification.is_read ? 'bg-slate-100 text-slate-500' : 'bg-duma-green/10 text-duma-green'}`}>
                      <Icon size={22} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <p className="font-black text-pesa-navy">{notification.title}</p>
                        <span className="shrink-0 text-xs font-bold text-slate-400">
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-slate-600">{notification.message}</p>
                    </div>
                    {!notification.is_read && <span className="mt-2 h-2.5 w-2.5 rounded-full bg-duma-green" />}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Bell size={26} />
            </div>
            <p className="text-lg font-black text-pesa-navy">No notifications yet</p>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Money transfers, sales, expenses, and stock updates will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
