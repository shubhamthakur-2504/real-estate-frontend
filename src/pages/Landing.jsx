import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Building2, Users, TrendingUp, Shield, Zap, MapPin, ArrowRight, Star, MessageSquare, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/utils/authStore'
import { useState, useEffect } from 'react'

export function Landing() {
  const { user } = useAuthStore()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Real estate images - house exteriors and interiors
  const heroImages = [
    'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3935333/pexels-photo-3935333.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
  ]

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Building2,
      title: 'Browse Properties',
      description: 'Explore thousands of residential, commercial, and land properties with detailed information and images',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Users,
      title: 'Connect with Agents',
      description: 'Get matched with experienced real estate agents who understand your needs and budget',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Access real-time market trends, price analytics, and property value predictions',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'All transactions are verified and secured with our trusted verification system',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Zap,
      title: 'Fast Process',
      description: 'Quick property discovery, lead assignment, and agent communication all in one place',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: MapPin,
      title: 'Location Services',
      description: 'Find properties in your desired location with neighborhood insights and directions',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ]

  const benefits = [
    'Browse 100+ verified properties',
    'Connect with professional agents',
    'Save favorite properties to wishlist',
    '24/7 customer support',
    'Secure payment gateway',
    'Transparent pricing',
  ]

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Property Buyer',
      message: 'Found my dream home in just 2 weeks. The platform made the process incredibly smooth!',
      avatar: '👨‍💼',
    },
    {
      name: 'Priya Sharma',
      role: 'Real Estate Agent',
      message: 'As an agent, this platform has doubled my leads quality. Highly recommended!',
      avatar: '👩‍💼',
    },
    {
      name: 'Amit Patel',
      role: 'Property Seller',
      message: 'Sold my property at the best price within 3 months. Great experience!',
      avatar: '👨‍💻',
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">RealEstate Hub</span>
          </div>
          <div className="flex gap-4">
            {user ? (
              <>
                <Link to={user.role === 'buyer' ? '/buyer/properties' : '/dashboard'}>
                  <Button variant="outline">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Find Your Perfect Property
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Connect with trusted agents, explore verified properties, and make informed real estate decisions all in one platform.
            </p>
            <div className="flex gap-4 pt-4">
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 flex items-center gap-2">
                  Get Started <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="text-lg px-8 py-3">
                  Already a Member?
                </Button>
              </Link>
            </div>
            <div className="flex gap-8 pt-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>1000+ Properties</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>500+ Agents</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>10K+ Users</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-2xl">
            <div className="relative h-96 bg-gray-200 dark:bg-gray-800">
              {/* Image Carousel */}
              {heroImages.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`Property ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              
              {/* Dot Indicators */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                {heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition ${
                      idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need for a seamless real estate experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
                >
                  <div className={`${feature.bgColor} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-lg overflow-hidden shadow-2xl order-2 md:order-1">
            <img
              src={heroImages[(currentImageIndex + 1) % heroImages.length]}
              alt="Real estate property"
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              From property discovery to agent connection, we've simplified the entire real estate journey.
            </p>
            <div className="grid gap-4 pt-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Join thousands of satisfied buyers, sellers, and agents
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  &ldquo;{testimonial.message}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community of buyers, sellers, and agents today
          </p>
          <Link to="/register">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3 font-semibold">
              Start Exploring Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-6 h-6 text-blue-600" />
                <span className="text-white font-bold">RealEstate Hub</span>
              </div>
              <p className="text-sm">Your trusted platform for buying, selling, and renting properties.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-sm">
              © {new Date().getFullYear()} RealEstate Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
