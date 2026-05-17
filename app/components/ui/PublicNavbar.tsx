'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Briefcase,
  Building2,
  ChevronDown,
  FileCheck,
  Landmark,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Package,
  Phone,
  QrCode,
  Receipt,
  Rocket,
  Scissors,
  ShieldCheck,
  Sprout,
  Store,
  Utensils,
  Users,
  Wallet,
  X,
  ChartLine,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import CountrySelector from './CountrySelector';

const iconSize = 17;

type SimpleMenuItem = { title?: string; subtitle?: string; href?: string; icon?: React.ElementType; divider?: boolean };

const simpleMenus: { about: SimpleMenuItem[]; merchants: SimpleMenuItem[]; contact: SimpleMenuItem[] } = {
  about: [
    { title: 'Our Story', subtitle: 'How QORAPP was founded', href: '/public-pages/about#our-story', icon: Building2 },
    { title: 'Our Team', subtitle: 'Meet the people behind QORAPP', href: '/public-pages/about#our-team', icon: Users },
  ],
  merchants: [
    { title: 'Retail Shops', subtitle: 'Point-of-sale for daily commerce', href: '/public-pages/industries#retail-shops', icon: Store },
    { title: 'Restaurants & Bars', subtitle: 'Bills, shifts & cost tracking', href: '/public-pages/industries#restaurants-bars', icon: Utensils },
    { title: 'Services & Salons', subtitle: 'Bookings & recurring payments', href: '/public-pages/industries#salons-barbershops', icon: Scissors },
    { title: 'MSMEs', subtitle: 'Built for growing businesses', href: '/public-pages/industries#mini-markets', icon: Sprout },
  ],
  contact: [
    { title: 'Send a Message', subtitle: 'hello@qorapp.com', href: '/public-pages/contact', icon: Mail },
    { title: 'Call Support', subtitle: 'Global support lines', href: '/public-pages/contact', icon: Phone },
    { title: 'Regional Offices', subtitle: 'Support across active markets', href: '/public-pages/contact', icon: MapPin },
    { divider: true },
    { title: 'Live Chat', subtitle: 'Available during business hours', href: '/public-pages/contact', icon: MessageCircle },
  ],
};

const solutionsMenus = [
  {
    label: 'Payments',
    items: [
      { title: 'QR / USSD Payments', subtitle: 'Accept mobile money instantly', href: '/public-pages/qr-ussd', icon: QrCode },
      { title: 'Digital Wallet', subtitle: 'Store & transfer funds securely', href: '/login?service=wallet', icon: Wallet },
      { title: 'Fast Settlements', subtitle: 'Funds in your account quickly', href: '/public-pages/qr-ussd', icon: Landmark },
    ],
  },
  {
    label: 'Business Tools',
    items: [
      { title: 'Inventory Management', subtitle: 'Real-time stock tracking', href: '/public-pages/inventory', icon: Package },
      { title: 'Business Analytics', subtitle: 'Daily & weekly reports', href: '/public-pages/analytics', icon: ChartLine },
      { title: 'Expense Tracking', subtitle: 'Monitor costs & margins', href: '/public-pages/expenses', icon: Receipt },
      { title: 'Compliance Tools', subtitle: 'Market-ready reporting', href: '/compliance', icon: FileCheck },
    ],
  },
];

function DropdownItem({
  href,
  title,
  subtitle,
  icon: Icon,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}) {
  return (
    <Link className="qorapp-dd-item" href={href}>
      <span className="qorapp-dd-icon">
        <Icon size={iconSize} />
      </span>
      <span>
        <span className="qorapp-dd-title">{title}</span>
        <span className="qorapp-dd-sub">{subtitle}</span>
      </span>
    </Link>
  );
}

function DesktopSimpleDropdown({ items }: { items: SimpleMenuItem[] }) {
  return (
    <div className="qorapp-dropdown">
      {items.map((item, index) => {
        if (item.divider) {
          return <div key={`divider-${index}`} className="qorapp-dd-divider" />;
        }

        return (
          <DropdownItem
            key={`${item.title}-${index}`}
            href={item.href as string}
            title={item.title as string}
            subtitle={item.subtitle as string}
            icon={item.icon as React.ElementType}
          />
        );
      })}
    </div>
  );
}

export default function PublicNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const isActive = (paths: string[]) => paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  const desktopItems = [
    { label: 'Home', href: '/', active: isActive(['/']) && pathname === '/' },
    { label: 'About Us', href: '/public-pages/about', dropdown: simpleMenus.about, active: isActive(['/public-pages/about']) },
    { label: 'Solutions', href: '/public-pages/qr-ussd', mega: true, active: isActive(['/public-pages', '/compliance']) },
    { label: 'For Merchants', href: '/public-pages/industries', dropdown: simpleMenus.merchants, active: isActive(['/public-pages/industries']) },
    { label: 'Investors', href: '/pricing', active: isActive(['/pricing']) },
    { label: 'Contact', href: '/public-pages/contact', dropdown: simpleMenus.contact, active: isActive(['/public-pages/contact']) },
  ];

  const mobileSections = [
    {
      label: 'About Us',
      items: simpleMenus.about.filter((item) => !item.divider),
    },
    {
      label: 'Solutions',
      items: solutionsMenus.flatMap((group) => group.items),
    },
    {
      label: 'For Merchants',
      items: simpleMenus.merchants,
    },
    {
      label: 'Contact',
      items: simpleMenus.contact.filter((item) => !item.divider),
    },
  ];

  return (
    <nav className="qorapp-public-nav">
      <div className="qorapp-public-nav-inner">
        <Link href="/" className="qorapp-logo" aria-label="QORAPP home" onClick={() => setIsOpen(false)}>
          <span className="qorapp-logo-mark" aria-hidden="true" />
          <span className="qorapp-logo-text">QORAPP</span>
        </Link>

        <div className="qorapp-nav-links">
          {desktopItems.map((item) => (
            <div key={item.label} className="qorapp-nav-wrap">
              <Link className={`qorapp-nav-item ${item.active ? 'is-active' : ''}`} href={item.href}>
                {item.label}
                {(item.dropdown || item.mega) && <ChevronDown className="qorapp-nav-chevron" />}
              </Link>

              {item.dropdown && <DesktopSimpleDropdown items={item.dropdown} />}

              {item.mega && (
                <div className="qorapp-dropdown is-mega">
                  {solutionsMenus.map((group) => (
                    <div key={group.label} className="qorapp-mega-col">
                      <div className="qorapp-mega-label">{group.label}</div>
                      {group.items.map((subItem) => (
                        <DropdownItem key={subItem.title} {...subItem} />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="qorapp-nav-cta">
          <CountrySelector />
          <Link href="/login" className="qorapp-btn qorapp-btn-ghost">
            Log In
          </Link>
          <Link href="/login?register=true" className="qorapp-btn qorapp-btn-primary">
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="qorapp-mobile-toggle"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="qorapp-mobile-panel"
          >
            <div className="qorapp-mobile-panel-inner">
              <Link className="qorapp-mobile-link" href="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>

              {mobileSections.map((section) => (
                <div key={section.label}>
                  <button
                    type="button"
                    className="qorapp-mobile-section-button"
                    onClick={() => setOpenSection(openSection === section.label ? null : section.label)}
                  >
                    <span>{section.label}</span>
                    <ChevronDown size={18} className={openSection === section.label ? 'rotate-180' : ''} />
                  </button>

                  <AnimatePresence>
                    {openSection === section.label && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="qorapp-mobile-submenu"
                      >
                        {section.items.map((item) => (
                          <Link
                            key={item.title as string}
                            href={item.href as string}
                            onClick={() => setIsOpen(false)}
                          >
                            {item.title as string}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <Link className="qorapp-mobile-link" href="/pricing" onClick={() => setIsOpen(false)}>
                Investors
              </Link>

              <CountrySelector mobile />

              <div className="qorapp-mobile-actions">
                <Link href="/login" className="qorapp-btn qorapp-btn-ghost" onClick={() => setIsOpen(false)}>
                  Log In
                </Link>
                <Link
                  href="/login?register=true"
                  className="qorapp-btn qorapp-btn-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <Rocket size={18} />
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
