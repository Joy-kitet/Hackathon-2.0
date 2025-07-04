"use client"

import { useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  RefreshCcw,
  Leaf,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Search,
  Shield,
  ChevronRight,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { WasteAnalyzer } from "@/components/waste-analyzer"
import { DancingBin } from "@/components/dancing-bin"
import { LoginRequiredModal } from "@/components/login-required-modal"
import { useAuth } from "@/hooks/use-auth"

export default function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false)
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false)
  const { user, signOut, loading } = useAuth()
  const year = new Date().getFullYear();

  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
    setIsLoginRequiredOpen(false)
  }

  const handleAnalyzeClick = () => {
    if (user) {
      setIsAnalyzerOpen(true)
    } else {
      setIsLoginRequiredOpen(true)
    }
  }

  const services = [
    {
      icon: <Search className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Smart Waste Analysis",
      description: "AI-powered analysis of any waste item with disposal recommendations and recycling information.",
      features: ["Instant waste identification", "Health risk assessment", "Proper disposal methods"],
    },
    {
      icon: <DollarSign className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Waste-to-Wealth Ideas",
      description: "Discover innovative ways to turn your waste into income-generating opportunities.",
      features: ["Income generation ideas", "Local market insights", "Step-by-step guides"],
    },
    {
      icon: <Leaf className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Green Economy Education",
      description: "Learn sustainable practices and contribute to environmental conservation efforts.",
      features: ["Sustainability education", "Environmental impact tracking", "Community initiatives"],
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <DancingBin />
          <p className="text-gray-600 mt-4">Loading RecycloHub...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
            >
              <div className="bg-green-600 p-1.5 sm:p-2 rounded-lg">
                <RefreshCcw className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">RecycloHub</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <a href="#services" className="text-gray-600 hover:text-green-600 transition-colors text-sm lg:text-base">
                Services
              </a>
              <a href="#about" className="text-gray-600 hover:text-green-600 transition-colors text-sm lg:text-base">
                About
              </a>
              <a href="#contact" className="text-gray-600 hover:text-green-600 transition-colors text-sm lg:text-base">
                Contact
              </a>
              {!user ? (
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" onClick={() => openAuth("login")}>
                    Login
                  </Button>
                  <Button size="sm" onClick={() => openAuth("register")} className="bg-green-600 hover:bg-green-700">
                    Sign Up
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">{user.email}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 py-4"
            >
              <div className="flex flex-col space-y-4">
                <a
                  href="#services"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </a>
                <a
                  href="#about"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </a>
                <a
                  href="#contact"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
                {!user ? (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                    <Button variant="ghost" onClick={() => openAuth("login")}>
                      Login
                    </Button>
                    <Button onClick={() => openAuth("register")} className="bg-green-600 hover:bg-green-700">
                      Sign Up
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 px-3">
                      <User className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <Button variant="outline" onClick={signOut} className="w-full bg-transparent">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14 sm:pt-16">
        <motion.div
          style={{ y }}
          className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-4 sm:mb-6 bg-green-100 text-green-800 border-green-200 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
              <Leaf className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              AI-Powered Waste Management
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              Transform{" "}
              <span className="text-green-600 relative">
                Waste
                <motion.div
                  className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-green-200 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>{" "}
              into <span className="text-blue-600">Wealth</span>
            </h1>

            <p className="text-base sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Discover intelligent waste management solutions, learn proper disposal methods, and unlock income
              opportunities from your waste materials.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full shadow-lg w-full sm:w-auto"
                  onClick={handleAnalyzeClick}
                >
                  {user ? "Start Analyzing Waste" : "Login to Analyze Waste"}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full border-2 border-gray-300 hover:border-green-600 hover:text-green-600 bg-white w-full sm:w-auto"
                  onClick={() => openAuth("register")}
                >
                  Join Community
                </Button>
              </motion.div>
            </div>

            {/* Login Status Indicator */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center space-x-2 text-sm text-green-600"
              >
                <User className="h-4 w-4" />
                <span>Welcome back, {user.email}!</span>
              </motion.div>
            )}
          </motion.div>

          {/* Dancing Bin */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="mt-8 sm:mt-12"
          >
            <DancingBin />
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-20 left-4 sm:left-10 opacity-20"
        >
          <RefreshCcw className="h-8 w-8 sm:h-16 sm:w-16 text-green-600" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-20 right-4 sm:right-10 opacity-20"
        >
          <Leaf className="h-10 w-10 sm:h-20 sm:w-20 text-blue-600" />
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Our Core Services</h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Comprehensive waste management solutions powered by artificial intelligence
            </p>
          </motion.div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardHeader className="text-center pb-3 sm:pb-4">
                    <div className="mx-auto mb-3 sm:mb-4 p-2 sm:p-3 bg-green-100 rounded-full w-fit">
                      <div className="text-green-600">{service.icon}</div>
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">{service.title}</CardTitle>
                    <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-xs sm:text-sm text-gray-600">
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">About RecycloHub</h2>
              <p className="text-sm sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                RecycloHub is an innovative AI-driven platform dedicated to transforming how communities approach waste
                management. We believe that every piece of waste has potential value, and our mission is to help
                individuals and communities unlock that potential.
              </p>
              <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Through advanced artificial intelligence and comprehensive waste analysis, we provide actionable
                insights that promote environmental sustainability while creating economic opportunities for our users.
              </p>

              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1 sm:mb-2">10K+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Waste Items Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1 sm:mb-2">500+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Wealth Ideas Generated</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-6 sm:p-8 h-64 sm:h-96 flex items-center justify-center">
                <div className="text-center">
                  <Shield className="h-16 w-16 sm:h-24 sm:w-24 text-green-600 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Trusted & Secure</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Your data is protected with enterprise-grade security
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Get in Touch</h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Have questions or suggestions? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Send us a Message</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Fill out the form below and we'll get back to you soon.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input placeholder="First Name" className="text-sm sm:text-base" />
                    <Input placeholder="Last Name" className="text-sm sm:text-base" />
                  </div>
                  <Input placeholder="Email Address" type="email" className="text-sm sm:text-base" />
                  <Input placeholder="Subject" className="text-sm sm:text-base" />
                  <Textarea placeholder="Your Message" rows={4} className="text-sm sm:text-base" />
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base">
                    Send Message
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 sm:space-y-8"
            >
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Contact Information</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    <span className="text-sm sm:text-base text-gray-600">wastemanagementeducation@RecycloHub.co.ke</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    <span className="text-sm sm:text-base text-gray-600">+254799040981</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    <span className="text-sm sm:text-base text-gray-600">Nairobi, Kenya</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Office Hours</h3>
                <div className="space-y-2 text-sm sm:text-base text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className="bg-green-600 p-1.5 sm:p-2 rounded-lg">
                  <RefreshCcw className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold">RecycloHub</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Transforming waste management through AI-powered solutions for a sustainable future.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Services</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Waste Analysis
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Wealth Generation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Education
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Connect</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>
              &copy; {year} RecycloHub. All rights reserved. Empowering communities through sustainable waste management.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      <LoginRequiredModal
        isOpen={isLoginRequiredOpen}
        onClose={() => setIsLoginRequiredOpen(false)}
        onLogin={() => openAuth("login")}
        onRegister={() => openAuth("register")}
      />

      <WasteAnalyzer isOpen={isAnalyzerOpen} onClose={() => setIsAnalyzerOpen(false)} />
    </div>
  )
}
