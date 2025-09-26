import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  Download,
  ExternalLink,
  Zap,
  Database,
  Cloud,
  Globe,
  Shield,
  TrendingUp,
  Users,
  Clock,
  Check,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  Settings
} from 'lucide-react';
import React, { useState } from 'react';

import ParscadeButton from '@/shared/components/brand/ParscadeButton';
import ParscadeCard from '@/shared/components/brand/ParscadeCard';
import ParscadeStatusBadge from '@/shared/components/brand/ParscadeStatusBadge';

interface Integration {
  id: string;
  name: string;
  provider: string;
  category: 'database' | 'crm' | 'productivity' | 'finance' | 'analytics' | 'security';
  description: string;
  rating: number;
  downloads: number;
  price: 'free' | 'premium' | 'enterprise';
  featured: boolean;
  verified: boolean;
  tags: string[];
  lastUpdated: string;
  icon: string;
  screenshots: string[];
}

const IntegrationMarketplacePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'installed' | 'featured' | 'categories'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const integrations: Integration[] = [
    {
      id: '1',
      name: 'Salesforce CRM',
      provider: 'Salesforce Inc.',
      category: 'crm',
      description: 'Sync customer data, leads, and opportunities with advanced field mapping',
      rating: 4.8,
      downloads: 15420,
      price: 'free',
      featured: true,
      verified: true,
      tags: ['CRM', 'Sales', 'Automation'],
      lastUpdated: '2 days ago',
      icon: '🔥',
      screenshots: []
    },
    {
      id: '2',
      name: 'Google Workspace',
      provider: 'Google LLC',
      category: 'productivity',
      description: 'Connect with Gmail, Drive, Sheets, and Calendar for seamless workflow',
      rating: 4.9,
      downloads: 23150,
      price: 'free',
      featured: true,
      verified: true,
      tags: ['Productivity', 'Email', 'Cloud'],
      lastUpdated: '1 week ago',
      icon: '🚀',
      screenshots: []
    },
    {
      id: '3',
      name: 'QuickBooks Enterprise',
      provider: 'Intuit Inc.',
      category: 'finance',
      description: 'Advanced financial data processing with real-time reconciliation',
      rating: 4.6,
      downloads: 8940,
      price: 'premium',
      featured: false,
      verified: true,
      tags: ['Accounting', 'Finance', 'ERP'],
      lastUpdated: '3 days ago',
      icon: '💰',
      screenshots: []
    },
    {
      id: '4',
      name: 'Tableau Analytics',
      provider: 'Tableau Software',
      category: 'analytics',
      description: 'Enterprise-grade data visualization and business intelligence',
      rating: 4.7,
      downloads: 12800,
      price: 'enterprise',
      featured: true,
      verified: true,
      tags: ['Analytics', 'BI', 'Visualization'],
      lastUpdated: '5 days ago',
      icon: '📊',
      screenshots: []
    },
    {
      id: '5',
      name: 'MongoDB Atlas',
      provider: 'MongoDB Inc.',
      category: 'database',
      description: 'Cloud database integration with automatic scaling and backup',
      rating: 4.5,
      downloads: 6750,
      price: 'free',
      featured: false,
      verified: true,
      tags: ['Database', 'NoSQL', 'Cloud'],
      lastUpdated: '1 week ago',
      icon: '🍃',
      screenshots: []
    },
    {
      id: '6',
      name: 'Okta Identity',
      provider: 'Okta Inc.',
      category: 'security',
      description: 'Enterprise identity management and single sign-on integration',
      rating: 4.4,
      downloads: 4320,
      price: 'enterprise',
      featured: false,
      verified: true,
      tags: ['Security', 'SSO', 'Identity'],
      lastUpdated: '4 days ago',
      icon: '🔐',
      screenshots: []
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: 124, icon: Globe },
    { id: 'crm', name: 'CRM & Sales', count: 23, icon: Users },
    { id: 'database', name: 'Databases', count: 18, icon: Database },
    { id: 'productivity', name: 'Productivity', count: 31, icon: Zap },
    { id: 'finance', name: 'Finance & ERP', count: 15, icon: TrendingUp },
    { id: 'analytics', name: 'Analytics & BI', count: 22, icon: TrendingUp },
    { id: 'security', name: 'Security', count: 15, icon: Shield }
  ];

  const getPriceColor = (price: string) => {
    switch (price) {
      case 'free': return 'text-emerald-400';
      case 'premium': return 'text-blue-400';
      case 'enterprise': return 'text-purple-400';
      default: return 'text-slate-400';
    }
  };

  const getPriceLabel = (price: string) => {
    switch (price) {
      case 'free': return 'Free';
      case 'premium': return 'Premium';
      case 'enterprise': return 'Enterprise';
      default: return 'Unknown';
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Integration Marketplace</h1>
          <p className="text-slate-400 mt-1">Discover and install powerful integrations to extend your workflow</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <ParscadeButton variant="outline">
            <BookOpen className="w-4 h-4 mr-2" />
            Documentation
          </ParscadeButton>
          <ParscadeButton variant="primary">
            <ExternalLink className="w-4 h-4 mr-2" />
            Developer Portal
          </ParscadeButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: 'browse', label: 'Browse All', icon: Search },
          { id: 'featured', label: 'Featured', icon: Sparkles },
          { id: 'installed', label: 'Installed', icon: Download },
          { id: 'categories', label: 'Categories', icon: Filter }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-blue-600/20 text-blue-400 shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      {activeTab === 'browse' && (
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Featured Section */}
      {activeTab === 'featured' && (
        <div className="space-y-6">
          <ParscadeCard className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Editor's Choice</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {integrations.filter(i => i.featured).slice(0, 2).map((integration) => (
                <motion.div
                  key={integration.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{integration.icon}</div>
                      <div>
                        <h4 className="font-semibold text-white">{integration.name}</h4>
                        <p className="text-sm text-slate-400">{integration.provider}</p>
                      </div>
                    </div>
                    <Award className="w-5 h-5 text-yellow-400" />
                  </div>
                  <p className="text-slate-300 mb-4">{integration.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-white">{integration.rating}</span>
                      </div>
                      <span className="text-sm text-slate-400">{integration.downloads.toLocaleString()} installs</span>
                    </div>
                    <ParscadeButton size="sm">Install</ParscadeButton>
                  </div>
                </motion.div>
              ))}
            </div>
          </ParscadeCard>
        </div>
      )}

      {/* Browse/All Integrations */}
      {(activeTab === 'browse' || activeTab === 'featured') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {activeTab === 'featured' ? 'More Featured Integrations' : 'All Integrations'}
            </h3>
            <span className="text-sm text-slate-400">{filteredIntegrations.length} results</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ParscadeCard className="p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-white">{integration.name}</h4>
                          {integration.verified && (
                            <Check className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                        <p className="text-sm text-slate-400">{integration.provider}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${getPriceColor(integration.price)}`}>
                      {getPriceLabel(integration.price)}
                    </span>
                  </div>

                  <p className="text-slate-300 mb-4 text-sm">{integration.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {integration.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{integration.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{integration.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{integration.lastUpdated}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <ParscadeButton variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Details
                    </ParscadeButton>
                    <ParscadeButton size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      Install
                    </ParscadeButton>
                  </div>
                </ParscadeCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Categories View */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.filter(c => c.id !== 'all').map((category) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setActiveTab('browse');
                  }}
                >
                  <ParscadeCard className="p-6 hover:border-blue-500/50 transition-all">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{category.name}</h3>
                        <p className="text-sm text-slate-400">{category.count} integrations</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-400">
                        Popular integrations in {category.name.toLowerCase()}
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </ParscadeCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Installed Integrations */}
      {activeTab === 'installed' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Installed Integrations</h3>
            <ParscadeButton variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Manage All
            </ParscadeButton>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.slice(0, 4).map((integration) => (
              <ParscadeCard key={integration.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{integration.icon}</div>
                    <div>
                      <h4 className="font-semibold text-white">{integration.name}</h4>
                      <p className="text-sm text-slate-400">Last sync: 2 hours ago</p>
                    </div>
                  </div>
                  <ParscadeStatusBadge status="active" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    Processing 1,247 records/day
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </ParscadeCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationMarketplacePage;