'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Sphere, Box, Dodecahedron, Torus } from '@react-three/drei';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Search, 
  User, 
  Bell, 
  Moon, 
  Sun,
  Home,
  Info,
  Settings,
  Mail,
  Sparkles,
  Zap
} from 'lucide-react';
import { cn } from "@/lib/util";
import * as THREE from 'three';

// 3D Floating Particles Component
const FloatingParticles = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = 50;

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    for (let i = 0; i < particleCount; i++) {
      const matrix = new THREE.Matrix4();
      const x = Math.sin(time + i * 0.1) * 10;
      const y = Math.cos(time + i * 0.2) * 5;
      const z = Math.sin(time + i * 0.3) * 3;
      
      matrix.setPosition(x, y, z);
      matrix.scale(new THREE.Vector3(0.1, 0.1, 0.1));
      meshRef.current.setMatrixAt(i, matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[0.1]} />
      <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} />
    </instancedMesh>
  );
};

// 3D Logo Component
const Logo3D = ({ isHovered }: { isHovered: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      <Dodecahedron 
        ref={meshRef}
        args={[1]} 
        scale={isHovered ? 1.2 : 1}
      >
        <meshStandardMaterial 
          color="#8b5cf6" 
          emissive="#8b5cf6" 
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.8}
        />
      </Dodecahedron>
      <Text
        position={[0, 0, 1.2]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        A
      </Text>
    </Float>
  );
};

// Holographic Button Component
const HolographicButton = ({ 
  children, 
  isActive, 
  onClick, 
  icon: Icon 
}: { 
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
  icon?: any;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        rotateY: 5,
        rotateX: -5,
        scale: 1.05,
        z: 50
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.button
        onClick={onClick}
        className={cn(
          "relative flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden",
          "backdrop-blur-sm border border-white/20",
          isActive
            ? "bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white shadow-2xl"
            : "bg-white/10 dark:bg-gray-800/10 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/20"
        )}
        style={{
          boxShadow: isHovered 
            ? '0 0 30px rgba(139, 92, 246, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.1)'
            : '0 4px 15px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0"
          animate={{
            opacity: isHovered ? 0.8 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Holographic effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '200%' } : { x: '-100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        
        {/* Icon with 3D rotation */}
        {Icon && (
          <motion.div
            animate={{
              rotateY: isHovered ? 360 : 0,
            }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="w-4 h-4 relative z-10" />
          </motion.div>
        )}
        
        {/* Text */}
        <motion.span 
          className="relative z-10"
          animate={{
            y: isHovered ? -2 : 0,
          }}
        >
          {children}
        </motion.span>
        
        {/* Particle effects */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0,
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};


// Main Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const navbarRef = useRef<HTMLElement>(null);
  
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Services', href: '/services', icon: Settings },
    { name: 'Products', href: '/products', icon: Search },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (navbarRef.current) {
        const rect = navbarRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const isActive = (href: string) => pathname === href;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed w-full z-50 top-0">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="hidden md:flex space-x-8">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <motion.nav
      ref={navbarRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={cn(
        "fixed w-full z-50 top-0 transition-all duration-500 transform-gpu",
        isScrolled 
          ? "bg-white/20 dark:bg-gray-900/20 backdrop-blur-2xl border-b border-white/30 dark:border-gray-700/30 shadow-2xl" 
          : "bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20"
      )}
    >
      {/* 3D Background Canvas */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <FloatingParticles />
        </Canvas>
      </div>

      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'linear-gradient(45deg, #8b5cf6, #ec4899)',
            'linear-gradient(90deg, #ec4899, #06b6d4)',
            'linear-gradient(135deg, #06b6d4, #8b5cf6)',
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-20">
          
          {/* Enhanced 3D Logo */}
          <motion.div
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            whileHover={{ 
              scale: 1.1,
              rotateY: 10,
              z: 30
            }}
            whileTap={{ scale: 0.9 }}
            className="perspective-1000"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Link href="/" className="flex items-center space-x-4">
              <div className="relative w-12 h-12">
                <Canvas>
                  <ambientLight intensity={0.6} />
                  <pointLight position={[5, 5, 5]} />
                  <Logo3D isHovered={logoHovered} />
                </Canvas>
                
                {/* Holographic ring effect */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-500/50"
                  animate={{
                    rotate: 360,
                    scale: logoHovered ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                    scale: { duration: 0.5 }
                  }}
                />
                
                {/* Particle burst effect */}
                <AnimatePresence>
                  {logoHovered && (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-purple-400 rounded-full"
                          initial={{
                            x: '50%',
                            y: '50%',
                            scale: 0,
                          }}
                          animate={{
                            x: `${50 + Math.cos(i * Math.PI / 4) * 100}%`,
                            y: `${50 + Math.sin(i * Math.PI / 4) * 100}%`,
                            scale: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </div>
              
              <motion.div
                animate={{
                  color: logoHovered ? '#8b5cf6' : theme === 'dark' ? '#ffffff' : '#111827',
                  textShadow: logoHovered ? '0 0 20px rgba(139, 92, 246, 0.5)' : '0 0 0px transparent',
                }}
              >
                <span className="text-2xl font-bold transition-all duration-300">
                  NeoApp
                </span>
              </motion.div>
            </Link>
          </motion.div>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Link href={item.href}>
                  <HolographicButton
                    isActive={isActive(item.href)}
                    icon={item.icon}
                  >
                    {item.name}
                  </HolographicButton>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Right side actions */}
          <div className="flex items-center space-x-3">
            
            {/* Futuristic Search Button */}
            <motion.button
              whileHover={{ 
                scale: 1.1,
                rotateY: 180,
                boxShadow: '0 0 25px rgba(139, 92, 246, 0.6)'
              }}
              whileTap={{ scale: 0.9 }}
              className="relative p-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-white/20 text-gray-700 dark:text-gray-300 hover:text-purple-400 transition-all duration-300"
            >
              <Search className="w-5 h-5" />
              <motion.div
                className="absolute inset-0 rounded-xl bg-purple-500/20"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            {/* Spectacular Theme Toggle */}
            <motion.button
              whileHover={{ 
                scale: 1.1,
                rotateY: 360,
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.8)'
              }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="relative p-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 text-gray-700 dark:text-gray-300 hover:text-purple-400 transition-all duration-300 overflow-hidden"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -30, opacity: 0, rotateX: -90 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  exit={{ y: 30, opacity: 0, rotateX: 90 }}
                  transition={{ duration: 0.4, type: "spring" }}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </motion.div>
              </AnimatePresence>
              
              {/* Orbital rings */}
              <motion.div
                className="absolute inset-0 border-2 border-yellow-400/50 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-1 border border-blue-400/50 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </motion.button>

            {/* Notifications with pulse effect */}
            <motion.button
              whileHover={{ 
                scale: 1.1,
                rotateZ: 15,
                boxShadow: '0 0 25px rgba(139, 92, 246, 0.6)'
              }}
              whileTap={{ scale: 0.9 }}
              className="relative p-3 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-white/20 text-gray-700 dark:text-gray-300 hover:text-purple-400 transition-all duration-300"
            >
              <Bell className="w-5 h-5" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.button>

            {/* Enhanced User Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: '0 0 25px rgba(139, 92, 246, 0.6)'
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-white/20 text-gray-700 dark:text-gray-300 hover:text-purple-400 transition-all duration-300"
              >
                <motion.div
                  animate={{ rotateY: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <User className="w-5 h-5" />
                </motion.div>
                <motion.div
                  animate={{ rotateZ: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ 
                      opacity: 0, 
                      scale: 0.8, 
                      y: -20,
                      rotateX: -90
                    }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      rotateX: 0
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.8, 
                      y: -20,
                      rotateX: -90
                    }}
                    transition={{ 
                      duration: 0.4,
                      type: "spring",
                      stiffness: 200
                    }}
                    className="absolute right-0 mt-3 w-56 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
                    style={{
                      transformStyle: 'preserve-3d',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 30px rgba(139, 92, 246, 0.2)'
                    }}
                  >
                    <div className="py-2">
                      {['Profile', 'Settings', 'Billing'].map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={`/${item.toLowerCase()}`}
                            className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50/80 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 relative overflow-hidden group"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"
                              initial={{ x: '-100%' }}
                              whileHover={{ x: '100%' }}
                              transition={{ duration: 0.5 }}
                            />
                            <span className="relative z-10">{item}</span>
                          </Link>
                        </motion.div>
                      ))}
                      <hr className="my-2 border-gray-200/50 dark:border-gray-700/50" />
                      <motion.button 
                        className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 relative overflow-hidden group"
                        whileHover={{ x: 5 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.5 }}
                        />
                        <span className="relative z-10">Sign out</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button with morphing animation */}
            <motion.button
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 0 25px rgba(139, 92, 246, 0.6)'
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-white/20 text-gray-700 dark:text-gray-300 hover:text-purple-400 transition-all duration-300"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isMenuOpen ? 'close' : 'open'}
                  initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3, type: "spring" }}
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ 
                opacity: 0, 
                height: 0,
                rotateX: -90
              }}
              animate={{ 
                opacity: 1, 
                height: "auto",
                rotateX: 0
              }}
              exit={{ 
                opacity: 0, 
                height: 0,
                rotateX: -90
              }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
              className="md:hidden border-t border-white/20 dark:border-gray-700/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl mt-2 rounded-b-2xl overflow-hidden"
              style={{ 
                transformStyle: 'preserve-3d',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="px-4 pt-4 pb-6 space-y-2">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ 
                        opacity: 0, 
                        x: -50,
                        rotateY: -90
                      }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        rotateY: 0
                      }}
                      transition={{ 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-4 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 relative overflow-hidden group",
                          isActive(item.href)
                            ? "text-purple-600 dark:text-purple-400 bg-purple-50/80 dark:bg-purple-900/20"
                            : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        
                        <motion.div
                          whileHover={{ rotateY: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className="w-5 h-5 relative z-10" />
                        </motion.div>
                        
                        <motion.span 
                          className="relative z-10"
                          whileHover={{ x: 5 }}
                        >
                          {item.name}
                        </motion.span>
                        
                        {isActive(item.href) && (
                          <motion.div
                            className="absolute right-4 w-2 h-2 bg-purple-500 rounded-full"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [1, 0.5, 1]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
