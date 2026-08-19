import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, Rss, Mail, MapPin, Phone, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-20" role="contentinfo">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" aria-label="VELORA Home">
              <span className="font-serif text-3xl font-light tracking-[0.3em] text-white">VELORA</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-stone-400 max-w-xs">
              A curated destination for premium fashion, beauty, and lifestyle. Discover pieces that define your style.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a href="#" aria-label="Instagram" className="text-stone-400 hover:text-white transition-colors"><Heart size={20} /></a>
              <a href="#" aria-label="Facebook" className="text-stone-400 hover:text-white transition-colors"><Share2 size={20} /></a>
              <a href="#" aria-label="Newsletter" className="text-stone-400 hover:text-white transition-colors"><Rss size={20} /></a>
              <a href="#" aria-label="Contact" className="text-stone-400 hover:text-white transition-colors"><Mail size={20} /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-sans font-medium tracking-widest uppercase text-xs mb-4">Shop</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/fashion', label: "Women's Fashion" },
                { to: '/fashion?gender=men', label: "Men's Fashion" },
                { to: '/beauty', label: 'Beauty & Skincare' },
                { to: '/shop?category=makeup', label: 'Makeup' },
                { to: '/shop?category=accessories', label: 'Accessories' },
                { to: '/new-arrivals', label: 'New Arrivals' },
                { to: '/offers', label: 'Sale & Offers' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-sans font-medium tracking-widest uppercase text-xs mb-4">Help</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '#', label: 'Shipping & Returns' },
                { to: '#', label: 'Size Guide' },
                { to: '#', label: 'Track My Order' },
                { to: '#', label: 'FAQs' },
                { to: '#', label: 'Privacy Policy' },
                { to: '#', label: 'Terms & Conditions' },
                { to: '#', label: 'Cookie Policy' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-sans font-medium tracking-widest uppercase text-xs mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-stone-500" />
                <span>12 Mayfair Lane, London W1K 2NP</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="flex-shrink-0 text-stone-500" />
                <span>+44 20 7946 0321</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="flex-shrink-0 text-stone-500" />
                <a href="mailto:hello@velora.com" className="hover:text-white transition-colors">hello@velora.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} VELORA. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Secure Payments</span>
            <div className="flex items-center gap-2">
              {['VISA', 'MC', 'AMEX', 'PayPal'].map(p => (
                <span key={p} className="border border-stone-700 rounded px-1.5 py-0.5 text-[10px] font-medium text-stone-400">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
