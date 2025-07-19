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
  Zap,
  Shield,
  Globe,
  Smartphone
} from 'lucide-react';
import { cn } from "@/lib/util";
import * as THREE from 'three';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Enhanced 3D Floating Particles Component with Mobile Optimization
const FloatingParticles = ({ theme, isMobile }: { theme: string, isMobile: boolean }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = isMobile ? 25 : 50; // Reduced for mobile performance

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    for (let i = 0; i < particleCount; i++) {
      const matrix = new THREE.Matrix4();
      const x = Math.sin(time + i * 0.1) * (isMobile ? 5 : 10);
      const y = Math.cos(time + i * 0.2) * (isMobile ? 2.5 : 5);
      const z = Math.sin(time + i * 0.3) * (isMobile ? 1.5 : 3);
      
      matrix.setPosition(x, y, z);
      matrix.scale(new THREE.Vector3(0.1, 0.1, 0.1));
      meshRef.current.setMatrixAt(i, matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[0.1]} />
      <meshStandardMaterial 
        color="#8b5cf6" 
        emissive="#8b5cf6" 
        emissiveIntensity={theme === 'dark' ? 0.5 : 0.3}
        transparent
        opacity={theme === 'dark' ? 0.8 : 0.6}
      />
    </instancedMesh>
  );
};

// Enhanced 3D Logo Component with Theme Support
const Logo3D = ({ isHovered, theme }: { isHovered: boolean, theme: string }) => {
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
          emissiveIntensity={theme === 'dark' ? 0.3 : 0.2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={theme === 'dark' ? 0.9 : 0.8}
        />
      </Dodecahedron>
      <Text
        position={[0, 0, 1.2]}
        fontSize={0.5}
        color={theme === 'dark' ? "#ffffff" : "#111827"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={theme === 'dark' ? "#8b5cf6" : "#7c3aed"}
      >
        N
      </Text>
    </Float>
  );
};

// Enhanced Holographic Button Component with Theme and Responsive Support
interface HolographicButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  theme: string;
  isMobile?: boolean;
}

const HolographicButton = ({ 
  children, 
  isActive, 
  onClick, 
  icon: Icon,
  theme,
  isMobile = false
}: HolographicButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative perspective-1000 w-full sm:w-auto"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      whileHover={!isMobile ? { 
        rotateY: 5,
        rotateX: -5,
        scale: 1.05,
        z: 50
      } : {}}
      whileTap={{ scale: 0.95 }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.button
        onClick={onClick}
        className={cn(
          "relative flex items-center justify-center sm:justify-start space-x-2 w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-sm font-medium transition-all duration-300 overflow-hidden",
          "backdrop-blur-sm border",
          theme === 'dark' ? "border-white/20" : "border-gray-300/30",
          isActive
            ? "bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white shadow-2xl"
            : theme === 'dark'
              ? "bg-white/10 text-gray-300 hover:bg-white/20"
              : "bg-black/5 text-gray-700 hover:bg-black/10"
        )}
        style={{
          boxShadow: isHovered 
            ? theme === 'dark'
              ? '0 0 30px rgba(139, 92, 246, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.1)'
              : '0 0 25px rgba(139, 92, 246, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.05)'
            : theme === 'dark'
              ? '0 4px 15px rgba(0, 0, 0, 0.1)'
              : '0 4px 15px rgba(0, 0, 0, 0.05)',
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
        
        {/* Theme-aware holographic effect */}
        <motion.div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-transparent to-transparent",
            theme === 'dark' ? "via-white/30" : "via-black/20"
          )}
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
            className="flex-shrink-0"
          >
            <Icon className="w-4 h-4 sm:w-4 sm:h-4 relative z-10" />
          </motion.div>
        )}
        
        {/* Text */}
        <motion.span 
          className="relative z-10 text-center sm:text-left"
          animate={{
            y: isHovered ? -2 : 0,
          }}
        >
          {children}
        </motion.span>
        
        {/* Theme-aware particle effects */}
        <AnimatePresence>
          {isHovered && !isMobile && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "absolute w-1 h-1 rounded-full",
                    theme === 'dark' ? "bg-white" : "bg-purple-600"
                  )}
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

// Main Navbar Component with Full Responsiveness
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
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
    
    // Detect device type
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (navbarRef.current && !isMobile) {
        const rect = navbarRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkDevice);
    };
  }, [mouseX, mouseY, isMobile]);

  const isActive = (href: string) => pathname === href;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // Enhanced loading state with theme support
  if (!mounted) {
    return (
      <nav className={cn(
        "backdrop-blur-md border-b fixed w-full z-50 top-0 transition-colors duration-500",
        theme === 'dark' 
          ? "bg-gray-900/80 border-gray-700" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className={cn(
            "w-24 sm:w-32 h-6 sm:h-8 rounded animate-pulse",
            theme === 'dark' ? "bg-gray-700" : "bg-gray-200"
          )}></div>
          <div className="hidden md:flex space-x-4 lg:space-x-8">
            {[1,2,3,4,5].map(i => (
              <div 
                key={i} 
                className={cn(
                  "w-12 lg:w-16 h-4 rounded animate-pulse",
                  theme === 'dark' ? "bg-gray-700" : "bg-gray-200"
                )}
              ></div>
            ))}
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {[1,2,3].map(i => (
              <div 
                key={i}
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded animate-pulse",
                  theme === 'dark' ? "bg-gray-700" : "bg-gray-200"
                )}
              ></div>
            ))}
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
      style={!isMobile ? {
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      } : {}}
      className={cn(
        "fixed w-full z-50 top-0 transition-all duration-500 transform-gpu",
        isScrolled 
          ? theme === 'dark'
            ? "bg-gray-900/30 backdrop-blur-2xl border-b border-gray-700/30 shadow-2xl" 
            : "bg-white/40 backdrop-blur-2xl border-b border-gray-300/30 shadow-2xl"
          : theme === 'dark'
            ? "bg-gray-900/20 backdrop-blur-xl border-b border-gray-700/20"
            : "bg-white/30 backdrop-blur-xl border-b border-gray-300/20"
      )}
    >
      {/* Enhanced 3D Background Canvas with Mobile Optimization */}
      {!isMobile && (
        <div className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          <Canvas>
            <ambientLight intensity={theme === 'dark' ? 0.5 : 0.7} />
            <pointLight position={[10, 10, 10]} intensity={theme === 'dark' ? 1 : 0.8} />
            <FloatingParticles theme={theme || 'dark'} isMobile={isMobile} />
          </Canvas>
        </div>
      )}

      {/* Enhanced animated gradient background with theme support */}
      <motion.div
        className={cn(
          "absolute inset-0",
          theme === 'dark' ? "opacity-20" : "opacity-10"
        )}
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
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Enhanced 3D Logo with Responsive Design */}
          <motion.div
            onMouseEnter={() => !isMobile && setLogoHovered(true)}
            onMouseLeave={() => !isMobile && setLogoHovered(false)}
            whileHover={!isMobile ? { 
              scale: 1.1,
              rotateY: 10,
              z: 30
            } : { scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="perspective-1000 flex-shrink-0"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Link href="/" className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative w-8 h-8 sm:w-12 sm:h-12">
                {!isMobile ? (
                  <Canvas>
                    <ambientLight intensity={theme === 'dark' ? 0.6 : 0.8} />
                    <pointLight position={[5, 5, 5]} />
                    <Logo3D isHovered={logoHovered} theme={theme || 'dark'} />
                  </Canvas>
                ) : (
                  // Fallback 2D logo for mobile
                  <div className={cn(
                    "w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-white text-sm sm:text-xl bg-gradient-to-r from-purple-600 to-pink-600",
                    logoHovered && "shadow-lg"
                  )}>
                    N
                  </div>
                )}
                
                {/* Enhanced holographic ring effect with theme support */}
                <motion.div
                  className={cn(
                    "absolute inset-0 rounded-full border-2",
                    theme === 'dark' ? "border-purple-500/50" : "border-purple-600/60"
                  )}
                  animate={{
                    rotate: 360,
                    scale: logoHovered ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                    scale: { duration: 0.5 }
                  }}
                />
                
                {/* Enhanced particle burst effect with theme support */}
                <AnimatePresence>
                  {logoHovered && !isMobile && (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={cn(
                            "absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
                            theme === 'dark' ? "bg-purple-400" : "bg-purple-600"
                          )}
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
                  color: logoHovered 
                    ? '#8b5cf6' 
                    : theme === 'dark' ? '#ffffff' : '#111827',
                  textShadow: logoHovered 
                    ? theme === 'dark'
                      ? '0 0 20px rgba(139, 92, 246, 0.5)' 
                      : '0 0 15px rgba(139, 92, 246, 0.4)'
                    : '0 0 0px transparent',
                }}
                className="hidden sm:block"
              >
                <span className="text-lg sm:text-2xl font-bold transition-all duration-300">
                  NeoApp
                </span>
              </motion.div>
            </Link>
          </motion.div>

          {/* Enhanced Desktop Navigation with Theme Support */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
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
                    theme={theme || 'dark'}
                  >
                    {item.name}
                  </HolographicButton>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Right side actions with Theme and Responsive Support */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            
            {/* Enhanced Search Button with Theme Support */}
            <motion.button
              whileHover={!isMobile ? { 
                scale: 1.1,
                rotateY: 180,
                boxShadow: theme === 'dark'
                  ? '0 0 25px rgba(139, 92, 246, 0.6)'
                  : '0 0 20px rgba(139, 92, 246, 0.4)'
              } : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border transition-all duration-300",
                theme === 'dark' 
                  ? "border-white/20 text-gray-300 hover:text-purple-400" 
                  : "border-gray-300/30 text-gray-700 hover:text-purple-600"
              )}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              {!isMobile && (
                <motion.div
                  className={cn(
                    "absolute inset-0 rounded-lg sm:rounded-xl",
                    theme === 'dark' ? "bg-purple-500/20" : "bg-purple-500/15"
                  )}
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>

            {/* Enhanced Theme Toggle with Responsive Design */}
            <motion.button
              whileHover={!isMobile ? { 
                scale: 1.1,
                rotateY: 360,
                boxShadow: theme === 'dark'
                  ? '0 0 30px rgba(139, 92, 246, 0.8)'
                  : '0 0 25px rgba(139, 92, 246, 0.5)'
              } : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={cn(
                "relative p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-yellow-500/20 to-blue-500/20 backdrop-blur-sm border transition-all duration-300 overflow-hidden",
                theme === 'dark' 
                  ? "border-white/20 text-gray-300 hover:text-purple-400" 
                  : "border-gray-300/30 text-gray-700 hover:text-purple-600"
              )}
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
                    <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </motion.div>
              </AnimatePresence>
              
              {/* Enhanced orbital rings with theme support - Hidden on mobile */}
              {!isMobile && (
                <>
                  <motion.div
                    className={cn(
                      "absolute inset-0 border-2 rounded-lg sm:rounded-xl",
                      theme === 'dark' ? "border-yellow-400/50" : "border-yellow-500/60"
                    )}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className={cn(
                      "absolute inset-1 border rounded-lg sm:rounded-xl",
                      theme === 'dark' ? "border-blue-400/50" : "border-blue-500/60"
                    )}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                </>
              )}
            </motion.button>

            {/* Enhanced Notifications with Theme Support - Hidden on small mobile */}
            <motion.button
              whileHover={!isMobile ? { 
                scale: 1.1,
                rotateZ: 15,
                boxShadow: theme === 'dark'
                  ? '0 0 25px rgba(139, 92, 246, 0.6)'
                  : '0 0 20px rgba(139, 92, 246, 0.4)'
              } : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm border transition-all duration-300 hidden xs:block",
                theme === 'dark' 
                  ? "border-white/20 text-gray-300 hover:text-purple-400" 
                  : "border-gray-300/30 text-gray-700 hover:text-purple-600"
              )}
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"
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

            {/* Enhanced User Menu with Theme Support - Hidden on mobile, shown on tablet+ */}
            <div className="relative hidden md:block">
              <motion.button
                whileHover={!isMobile ? { 
                  scale: 1.1,
                  boxShadow: theme === 'dark'
                    ? '0 0 25px rgba(139, 92, 246, 0.6)'
                    : '0 0 20px rgba(139, 92, 246, 0.4)'
                } : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={cn(
                  "flex items-center space-x-1 sm:space-x-2 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border transition-all duration-300",
                  theme === 'dark' 
                    ? "border-white/20 text-gray-300 hover:text-purple-400" 
                    : "border-gray-300/30 text-gray-700 hover:text-purple-600"
                )}
              >
                <motion.div
                  animate={{ rotateY: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
                <motion.div
                  animate={{ rotateZ: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="hidden sm:block"
                >
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
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
                    className={cn(
                      "absolute right-0 mt-2 sm:mt-3 w-48 sm:w-56 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border overflow-hidden",
                      theme === 'dark' 
                        ? "bg-gray-800/90 border-gray-700/30" 
                        : "bg-white/90 border-gray-300/30"
                    )}
                    style={{
                      transformStyle: 'preserve-3d',
                      boxShadow: theme === 'dark'
                        ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(139, 92, 246, 0.2)'
                        : '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 30px rgba(139, 92, 246, 0.1)'
                    }}
                  >
                    <div className="py-1 sm:py-2">
                      {['Profile', 'Settings', 'Billing'].map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={`/${item.toLowerCase()}`}
                            className={cn(
                              "block px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm transition-all duration-200 relative overflow-hidden group",
                              theme === 'dark' 
                                ? "text-gray-300 hover:bg-purple-900/20 hover:text-purple-400" 
                                : "text-gray-700 hover:bg-purple-50/80 hover:text-purple-600"
                            )}
                            onClick={closeMenu}
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
                      <hr className={cn(
                        "my-1 sm:my-2",
                        theme === 'dark' ? "border-gray-700/50" : "border-gray-200/50"
                      )} />
                      <motion.button 
                        className={cn(
                          "block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-600 transition-all duration-200 relative overflow-hidden group",
                          theme === 'dark' 
                            ? "hover:bg-red-900/20" 
                            : "hover:bg-red-50/80"
                        )}
                        whileHover={{ x: 5 }}
                        onClick={closeMenu}
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

            {/* Enhanced Mobile menu button with Theme Support */}
            <motion.button
              whileHover={!isMobile ? { 
                scale: 1.1,
                boxShadow: theme === 'dark'
                  ? '0 0 25px rgba(139, 92, 246, 0.6)'
                  : '0 0 20px rgba(139, 92, 246, 0.4)'
              } : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "lg:hidden p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border transition-all duration-300",
                theme === 'dark' 
                  ? "border-white/20 text-gray-300 hover:text-purple-400" 
                  : "border-gray-300/30 text-gray-700 hover:text-purple-600"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isMenuOpen ? 'close' : 'open'}
                  initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3, type: "spring" }}
                >
                  {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation with Full Responsiveness */}
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
              className={cn(
                "lg:hidden border-t backdrop-blur-xl mt-2 rounded-b-xl sm:rounded-b-2xl overflow-hidden",
                theme === 'dark' 
                  ? "border-gray-700/20 bg-gray-900/90" 
                  : "border-gray-300/30 bg-white/90"
              )}
              style={{ 
                transformStyle: 'preserve-3d',
                boxShadow: theme === 'dark' 
                  ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                  : '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-4 sm:pb-6 space-y-1 sm:space-y-2">
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
                          "flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-3 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-300 relative overflow-hidden group",
                          isActive(item.href)
                            ? theme === 'dark'
                              ? "text-purple-400 bg-purple-900/20"
                              : "text-purple-600 bg-purple-50/80"
                            : theme === 'dark'
                              ? "text-gray-300 hover:text-purple-400 hover:bg-purple-900/10"
                              : "text-gray-700 hover:text-purple-600 hover:bg-purple-50/50"
                        )}
                        onClick={closeMenu}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        
                        <motion.div
                          whileHover={!isMobile ? { rotateY: 360 } : {}}
                          transition={{ duration: 0.6 }}
                          className="flex-shrink-0"
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                        </motion.div>
                        
                        <motion.span 
                          className="relative z-10 flex-1"
                          whileHover={!isMobile ? { x: 5 } : {}}
                        >
                          {item.name}
                        </motion.span>
                        
                        {isActive(item.href) && (
                          <motion.div
                            className="absolute right-3 sm:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"
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
                
                {/* Mobile-only User Menu */}
                <div className="block md:hidden pt-2 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div className="space-y-1">
                    {['Profile', 'Settings', 'Billing'].map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navigationItems.length + index) * 0.1 }}
                      >
                        <Link
                          href={`/${item.toLowerCase()}`}
                          className={cn(
                            "flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-300",
                            theme === 'dark'
                              ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                              : "text-gray-600 hover:text-gray-700 hover:bg-gray-100/50"
                          )}
                          onClick={closeMenu}
                        >
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span>{item}</span>
                        </Link>
                      </motion.div>
                    ))}
                    <motion.button
                      className={cn(
                        "flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-300 w-full text-left text-red-600",
                        theme === 'dark'
                          ? "hover:bg-red-900/20"
                          : "hover:bg-red-50/80"
                      )}
                      onClick={closeMenu}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navigationItems.length + 3) * 0.1 }}
                    >
                      <X className="w-4 h-4 flex-shrink-0" />
                      <span>Sign out</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
