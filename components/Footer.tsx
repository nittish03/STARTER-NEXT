'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Sphere, Box, Dodecahedron, Torus, Stars, Ring, Cylinder, Plane, Cloud } from '@react-three/drei';
import { 
  Mail, Phone, MapPin, Facebook, Twitter, Instagram, 
  Linkedin, Github, Youtube, ArrowUp, Heart, Send, ChevronRight,
  Sparkles, Zap, Globe, Rocket, Crown, Shield, Atom, Layers, Cpu
} from 'lucide-react';
import { cn } from "@/lib/util";
import * as THREE from 'three';

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
  color: string;
}

interface FooterSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  links: Array<{
    name: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

// Enhanced 3D Floating Network Visualization with Vivid Purple Theme
const NetworkVisualization = ({ theme }: { theme: string }) => {
  const networkRef = useRef<THREE.Group>(null);
  const nodesCount = 25;
  
  useFrame((state) => {
    if (networkRef.current) {
      networkRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      networkRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.position.y += Math.sin(state.clock.elapsedTime + index) * 0.01;
          child.rotation.z = Math.sin(state.clock.elapsedTime + index * 0.5) * 0.2;
        }
      });
    }
  });

  return (
    <group ref={networkRef}>
      {[...Array(nodesCount)].map((_, i) => {
        const angle = (i / nodesCount) * Math.PI * 2;
        const radius = 8 + Math.random() * 6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 8;
        
        return (
          <Float
            key={i}
            speed={1 + Math.random()}
            rotationIntensity={0.5}
            floatIntensity={1}
          >
            <Sphere 
              args={[0.2 + Math.random() * 0.3]} 
              position={[x, y, z]}
            >
              <meshStandardMaterial 
                color={i % 4 === 0 ? "#D86DFC" : i % 4 === 1 ? "#6DE1FC" : i % 4 === 2 ? "#FCD68D" : "#4A4A59"}
                emissive={i % 4 === 0 ? "#D86DFC" : i % 4 === 1 ? "#6DE1FC" : i % 4 === 2 ? "#FCD68D" : "#4A4A59"}
                emissiveIntensity={theme === 'dark' ? 0.5 : 0.3}
                transparent
                opacity={theme === 'dark' ? 0.9 : 0.7}
              />
            </Sphere>
            
            {/* Connection lines with vivid purple theme */}
            {i < nodesCount - 1 && (
              <mesh position={[x / 2, y / 2, z / 2]}>
                <cylinderGeometry args={[0.02, 0.02, radius / 4]} />
                <meshStandardMaterial 
                  color="#D86DFC" 
                  transparent 
                  opacity={theme === 'dark' ? 0.3 : 0.2}
                />
              </mesh>
            )}
          </Float>
        );
      })}
    </group>
  );
};

// Enhanced 3D Social Media Icons with Vivid Purple Theme
const Social3DIcon = ({ 
  position, 
  icon, 
  color, 
  theme 
}: { 
  position: [number, number, number], 
  icon: string, 
  color: string, 
  theme: string 
}) => {
  const iconRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (iconRef.current) {
      iconRef.current.rotation.y += 0.02;
      iconRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      <Dodecahedron ref={iconRef} args={[0.8]} position={position}>
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={theme === 'dark' ? 0.4 : 0.2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={theme === 'dark' ? 0.9 : 0.8}
        />
      </Dodecahedron>
      
      {/* Orbital Ring with vivid purple accent */}
      <Ring args={[1.2, 1.4, 16]} position={position} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color="#D86DFC" 
          transparent 
          opacity={theme === 'dark' ? 0.4 : 0.2}
        />
      </Ring>
    </Float>
  );
};

// Enhanced Magnetic Interactive Element with Vivid Purple Theme
interface MagneticElementProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  theme?: string;
  style?: React.CSSProperties;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
}

const MagneticElement = ({ 
  children, 
  className = "",
  strength = 0.3,
  theme = 'dark',
  ...props 
}: MagneticElementProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setMousePosition({
        x: (e.clientX - centerX) * strength,
        y: (e.clientY - centerY) * strength,
      });
    }
  };
  
  return (
    <motion.div
      ref={elementRef}
      className={className}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface HolographicLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  delay?: number;
  theme?: string;
}

// Enhanced Holographic Link Component with Vivid Purple Theme
const HolographicLink = ({ 
  href, 
  children, 
  icon: Icon, 
  delay = 0, 
  theme = 'dark' 
}: HolographicLinkProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, rotateY: -15 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, type: "spring" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <Link
        href={href}
        className={cn(
          "group relative flex items-center transition-all duration-300 p-3 rounded-xl overflow-hidden",
          theme === 'dark' 
            ? "text-gray-100 hover:text-violet-400" 
            : "text-slate-800 hover:text-violet-600"
        )}
      >
        {/* Enhanced Holographic Background with vivid purple */}
        <motion.div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-cyan-400/10",
            theme === 'light' && "from-violet-600/5 via-fuchsia-600/5 to-cyan-400/5"
          )}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
            rotateY: isHovered ? 5 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Animated chevron */}
        <motion.div
          animate={{
            x: isHovered ? 8 : 0,
            rotate: isHovered ? 90 : 0,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.4 }}
        >
          <ChevronRight className="w-4 h-4 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </motion.div>
        
        {/* Icon */}
        {Icon && (
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.2 : 1,
              y: isHovered ? -2 : 0,
            }}
            transition={{ duration: 0.6 }}
            className="mr-3"
          >
            <Icon className="w-4 h-4" />
          </motion.div>
        )}
        
        {/* Text with vivid purple glow */}
        <motion.span
          animate={{
            x: isHovered ? 8 : 0,
            textShadow: isHovered 
              ? theme === 'dark' 
                ? '0 0 10px rgba(216, 109, 252, 0.6)' 
                : '0 0 10px rgba(216, 109, 252, 0.4)'
              : '0 0 0px transparent',
          }}
          transition={{ duration: 0.3 }}
          className="relative z-10 font-medium"
        >
          {children}
        </motion.span>
        
        {/* Enhanced Particle Effects with vivid purple */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "absolute w-1 h-1 rounded-full",
                    theme === 'dark' ? "bg-violet-400" : "bg-violet-600"
                  )}
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0,
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 120}%`,
                    y: `${50 + (Math.random() - 0.5) * 120}%`,
                    scale: [0, 1.5, 0],
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
        
        {/* Glowing Border Effect with vivid purple */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-transparent"
          animate={{
            borderColor: isHovered 
              ? theme === 'dark'
                ? 'rgba(216, 109, 252, 0.3)'
                : 'rgba(216, 109, 252, 0.2)'
              : 'transparent',
          }}
          transition={{ duration: 0.3 }}
        />
      </Link>
    </motion.div>
  );
};

const Footer = () => {
  const [mounted, setMounted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isNewsletterHovered, setIsNewsletterHovered] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [2, -2]);
  const rotateY = useTransform(mouseX, [-300, 300], [-2, 2]);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setNewsletterEmail('');
    }
  };

  const footerSections = [
    {
      title: "Product",
      icon: Rocket,
      links: [
        { name: "Features", href: "/features", icon: Sparkles },
        { name: "Pricing", href: "/pricing", icon: Crown },
        { name: "API", href: "/api", icon: Cpu },
        { name: "Documentation", href: "/docs", icon: Layers },
        { name: "Integrations", href: "/integrations", icon: Atom }
      ]
    },
    {
      title: "Company",
      icon: Crown,
      links: [
        { name: "About Us", href: "/about", icon: Heart },
        { name: "Careers", href: "/careers", icon: Zap },
        { name: "Press", href: "/press", icon: Globe },
        { name: "Partners", href: "/partners", icon: Shield },
        { name: "Contact", href: "/contact", icon: Mail }
      ]
    },
    {
      title: "Resources",
      icon: Globe,
      links: [
        { name: "Blog", href: "/blog", icon: Sparkles },
        { name: "Help Center", href: "/help", icon: Heart },
        { name: "Community", href: "/community", icon: Zap },
        { name: "Events", href: "/events", icon: Crown },
        { name: "Status", href: "/status", icon: Shield }
      ]
    },
    {
      title: "Legal",
      icon: Shield,
      links: [
        { name: "Privacy Policy", href: "/privacy", icon: Shield },
        { name: "Terms of Service", href: "/terms", icon: Layers },
        { name: "Cookie Policy", href: "/cookies", icon: Heart },
        { name: "GDPR", href: "/gdpr", icon: Globe },
        { name: "Security", href: "/security", icon: Zap }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook", color: "#1877F2" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter", color: "#1DA1F2" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram", color: "#E4405F" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn", color: "#0A66C2" },
    { icon: Github, href: "https://github.com", label: "GitHub", color: theme === 'dark' ? "#ffffff" : "#24292e" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube", color: "#FF0000" }
  ];

  // Enhanced Loading state with vivid purple theme
  if (!mounted) {
    return (
      <footer className={cn(
        "relative overflow-hidden transition-colors duration-500",
        theme === 'dark' 
          ? "bg-slate-900 text-white" 
          : "bg-gray-50 text-black"
      )}>
        <div className="relative z-10">
          <div className={cn(
            "border-b",
            theme === 'dark' ? "border-slate-800" : "border-gray-200"
          )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center">
                <div className={cn(
                  "h-8 rounded-lg w-64 mx-auto mb-4 animate-pulse",
                  theme === 'dark' 
                    ? "bg-gradient-to-r from-slate-800 to-slate-700" 
                    : "bg-gradient-to-r from-gray-200 to-gray-100"
                )}></div>
                <div className={cn(
                  "h-4 rounded w-96 mx-auto mb-8 animate-pulse",
                  theme === 'dark' 
                    ? "bg-gradient-to-r from-slate-800 to-slate-700" 
                    : "bg-gradient-to-r from-gray-200 to-gray-100"
                )}></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <motion.footer
      ref={footerRef}
      className={cn(
        "relative overflow-hidden transition-all duration-500 transform-gpu",
        theme === 'dark' 
          ? "bg-gradient-to-br from-slate-900 via-indigo-950/30 to-black text-white" 
          : "bg-gradient-to-br from-gray-50 via-violet-50/30 to-white text-black"
      )}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Enhanced 3D Background Canvas with Vivid Purple Theme */}
      <div className="absolute inset-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={theme === 'dark' ? 0.4 : 0.6} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#D86DFC" />
            
            <Stars
              radius={100}
              depth={50}
              count={theme === 'dark' ? 5000 : 3000}
              factor={4}
              saturation={0}
              fade={true}
              speed={0.5}
            />
            
            <NetworkVisualization theme={theme || 'dark'} />
            
            {/* Floating Footer Elements with vivid purple */}
            <Float speed={1} rotationIntensity={0.3} floatIntensity={1}>
              <Text
                position={[-12, 6, -8]}
                fontSize={1.2}
                color={theme === 'dark' ? "#D86DFC" : "#6B21A8"}
                anchorX="center"
                anchorY="middle"
                rotation={[0, 0.3, 0]}
                outlineWidth={0.02}
                outlineColor={theme === 'dark' ? "#ffffff" : "#000000"}
              >
                CONNECT
              </Text>
            </Float>
            
            <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
              <Ring args={[2, 2.5, 32]} position={[12, -4, -6]} rotation={[0.5, 0, 0]}>
                <meshStandardMaterial 
                  color="#6DE1FC" 
                  transparent 
                  opacity={theme === 'dark' ? 0.4 : 0.3} 
                />
              </Ring>
            </Float>
            
            {/* Enhanced 3D Social Icons with vivid purple theme */}
            {socialLinks.map((social, index) => (
              <Social3DIcon
                key={social.label}
                position={[
                  Math.cos(index * Math.PI / 3) * 15,
                  Math.sin(index * Math.PI / 3) * 8,
                  -12
                ]}
                icon={social.label}
                color={social.color}
                theme={theme || 'dark'}
              />
            ))}
          </Suspense>
        </Canvas>
      </div>

      {/* Enhanced Animated Background Elements with vivid purple */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className={cn(
            "absolute -top-4 -right-4 w-96 h-96 rounded-full blur-3xl",
            theme === 'dark' 
              ? "bg-violet-500/10" 
              : "bg-violet-500/5"
          )}
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className={cn(
            "absolute -bottom-8 -left-4 w-96 h-96 rounded-full blur-3xl",
            theme === 'dark' 
              ? "bg-cyan-500/10" 
              : "bg-cyan-500/5"
          )}
        />
      </div>

      <div className="relative z-10">
        
        {/* Enhanced Newsletter Section with Vivid Purple Theme */}
        <div className={cn(
          "border-b backdrop-blur-sm",
          theme === 'dark' 
            ? "border-white/10" 
            : "border-gray-200/50"
        )}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 50, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring" }}
                style={{ transformStyle: 'preserve-3d' }}
                onMouseEnter={() => setIsNewsletterHovered(true)}
                onMouseLeave={() => setIsNewsletterHovered(false)}
              >
                {/* Enhanced Icon Badge with vivid purple */}
                <motion.div
                  className={cn(
                    "inline-flex items-center space-x-3 px-8 py-4 rounded-full backdrop-blur-md border mb-8",
                    theme === 'dark' 
                      ? "bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border-white/20" 
                      : "bg-gradient-to-r from-violet-100/80 to-fuchsia-100/80 border-violet-200/50"
                  )}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: theme === 'dark'
                      ? '0 0 30px rgba(216, 109, 252, 0.4)'
                      : '0 0 20px rgba(216, 109, 252, 0.2)',
                    rotateY: 5,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className={cn(
                      "w-6 h-6",
                      theme === 'dark' ? "text-violet-400" : "text-violet-600"
                    )} />
                  </motion.div>
                  <span className={cn(
                    "text-lg font-bold",
                    theme === 'dark' ? "text-violet-300" : "text-violet-700"
                  )}>
                    Newsletter
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className={cn(
                      "w-5 h-5",
                      theme === 'dark' ? "text-yellow-400" : "text-yellow-600"
                    )} />
                  </motion.div>
                </motion.div>

                <motion.h3 
                  className={cn(
                    "text-5xl sm:text-6xl font-bold mb-8",
                    theme === 'dark' ? "text-white" : "text-black"
                  )}
                  animate={{
                    textShadow: isNewsletterHovered
                      ? theme === 'dark'
                        ? [
                            '0 0 20px rgba(216, 109, 252, 0.6)',
                            '0 0 40px rgba(109, 225, 252, 0.6)',
                            '0 0 20px rgba(216, 109, 252, 0.6)'
                          ]
                        : [
                            '0 0 15px rgba(216, 109, 252, 0.4)',
                            '0 0 30px rgba(109, 225, 252, 0.4)',
                            '0 0 15px rgba(216, 109, 252, 0.4)'
                          ]
                      : '0 0 0px transparent'
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  Stay in the 
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent"> Loop</span>
                </motion.h3>
                
                <motion.p 
                  className={cn(
                    "text-xl mb-12 max-w-4xl mx-auto leading-relaxed",
                    theme === 'dark' ? "text-gray-10" : "text-slate-800"
                  )}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Get exclusive updates, insider tips, and cutting-edge content delivered to your inbox. 
                  Join 50,000+ innovators already transforming their future.
                </motion.p>
                
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
                  <MagneticElement className="relative flex-1 w-full" strength={0.2} theme={theme}>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="Enter your email"
                        className={cn(
                          "w-full px-8 py-5 backdrop-blur-md border rounded-2xl font-medium text-lg placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300",
                          theme === 'dark' 
                            ? "bg-slate-800 border-slate-700/30 text-white placeholder-gray-100" 
                            : "bg-slate-200 border-gray-100 text-black placeholder-slate-100"
                        )}
                        style={{
                          boxShadow: theme === 'dark' 
                            ? 'inset 0 2px 10px rgba(0, 0, 0, 0.1)' 
                            : 'inset 0 2px 10px rgba(0, 0, 0, 0.05)',
                        }}
                      />
                      <motion.div
                        className="absolute right-6 top-1/2 transform -translate-y-1/2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        <Mail className={cn(
                          "w-6 h-6",
                          theme === 'dark' ? "text-gray-100" : "text-slate-800"
                        )} />
                      </motion.div>
                    </motion.div>
                  </MagneticElement>
                  
                  <MagneticElement strength={0.3} theme={theme}>
                    <motion.button
                      type="submit"
                      className="flex items-center px-10 py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-bold text-white text-lg shadow-2xl relative overflow-hidden"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: '0 25px 50px rgba(216, 109, 252, 0.4)',
                        rotateY: 5,
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {/* Enhanced Holographic overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '200%' }}
                        transition={{ duration: 0.8 }}
                      />
                      
                      <AnimatePresence mode="wait">
                        {isSubscribed ? (
                          <motion.div
                            key="success"
                            initial={{ scale: 0, rotateY: -180 }}
                            animate={{ scale: 1, rotateY: 0 }}
                            exit={{ scale: 0, rotateY: 180 }}
                            className="flex items-center"
                            transition={{ type: "spring" }}
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              <Sparkles className="w-6 h-6 mr-3" />
                            </motion.div>
                            Subscribed!
                          </motion.div>
                        ) : (
                          <motion.div
                            key="subscribe"
                            initial={{ scale: 1 }}
                            className="flex items-center"
                          >
                            <Send className="w-6 h-6 mr-3" />
                            Subscribe
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </MagneticElement>
                </form>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Footer Content with Vivid Purple Theme */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16">
            
            {/* Enhanced Company Info with vivid purple 3D Effects */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 50, rotateY: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring" }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Enhanced Logo with Vivid Purple Theme */}
                <MagneticElement className="flex items-center space-x-4 mb-10" strength={0.2} theme={theme}>
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.1, rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <motion.span 
                        className="text-white font-bold text-3xl"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      >
                        N
                      </motion.span>
                    </div>
                    
                    {/* Enhanced Orbital rings with vivid purple theme */}
                    <motion.div
                      className={cn(
                        "absolute -inset-2 border-2 rounded-3xl",
                        theme === 'dark' 
                          ? "border-violet-400/30" 
                          : "border-violet-400/20"
                      )}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className={cn(
                        "absolute -inset-4 border rounded-3xl",
                        theme === 'dark' 
                          ? "border-fuchsia-400/20" 
                          : "border-fuchsia-400/15"
                      )}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className={cn(
                      "text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                      theme === 'dark' 
                        ? "from-white via-violet-200 to-fuchsia-200" 
                        : "from-black via-violet-600 to-fuchsia-600"
                    )}>
                      NeoApp
                    </span>
                  </motion.div>
                </MagneticElement>

                <motion.p 
                  className={cn(
                    "mb-10 leading-relaxed text-xl",
                    theme === 'dark' ? "text-gray-100" : "text-slate-800"
                  )}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Building the future of digital experiences. Join thousands of companies transforming their business with our revolutionary platform.
                </motion.p>

                {/* Enhanced Contact Info with Vivid Purple Theme */}
                <div className="space-y-6">
                  {[
                    { icon: Mail, text: "hello@neoapp.com", href: "mailto:hello@neoapp.com" },
                    { icon: Phone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
                    { icon: MapPin, text: "San Francisco, CA", href: "#" }
                  ].map((contact, index) => (
                    <motion.a
                      key={index}
                      href={contact.href}
                      className={cn(
                        "flex items-center space-x-4 transition-all duration-300 p-4 rounded-2xl group relative overflow-hidden",
                        theme === 'dark' 
                          ? "text-gray-200 hover:text-violet-400 hover:bg-white" 
                          : "text-slate-800 hover:text-violet-600 hover:bg-gray-100"
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.02,
                        x: 10,
                        rotateY: 2,
                      }}
                    >
                      {/* Holographic background with vivid purple */}
                      <motion.div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-r from-violet-600/5 via-fuchsia-600/5 to-cyan-400/5 opacity-0 group-hover:opacity-100",
                          theme === 'light' && "from-violet-600/3 via-fuchsia-600/3 to-cyan-400/3"
                        )}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <motion.div
                        className={cn(
                          "p-3 rounded-xl bg-gradient-to-r",
                          theme === 'dark' 
                            ? "from-violet-600/20 to-fuchsia-600/20" 
                            : "from-violet-100/80 to-fuchsia-100/80"
                        )}
                        whileHover={{ 
                          rotate: 360,
                          scale: 1.1
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <contact.icon className="w-6 h-6" />
                      </motion.div>
                      <span className="font-semibold text-lg relative z-10">{contact.text}</span>
                      
                      {/* Enhanced Hover particles with vivid purple */}
                      <AnimatePresence>
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={cn(
                              "absolute w-1 h-1 rounded-full opacity-0 group-hover:opacity-100",
                              theme === 'dark' ? "bg-violet-400" : "bg-violet-600"
                            )}
                            animate={{
                              x: [0, Math.random() * 60 - 30],
                              y: [0, Math.random() * 60 - 30],
                              scale: [0, 1.5, 0],
                            }}
                            transition={{
                              duration: 1.2,
                              delay: i * 0.1,
                              ease: "easeOut"
                            }}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Enhanced Footer Links Sections with Vivid Purple Theme */}
            {footerSections.map((section, sectionIndex) => {
              const SectionIcon = section.icon;
              
              return (
                <div key={section.title} className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, y: 50, rotateX: -20 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      duration: 0.8, 
                      delay: sectionIndex * 0.1,
                      type: "spring" 
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Enhanced Section Header with vivid purple */}
                    <motion.div 
                      className="flex items-center space-x-4 mb-10"
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                    >
                      <motion.div
                        className={cn(
                          "p-3 rounded-xl bg-gradient-to-r",
                          theme === 'dark' 
                            ? "from-violet-600/20 to-fuchsia-600/20" 
                            : "from-violet-100/80 to-fuchsia-100/80"
                        )}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        <SectionIcon className={cn(
                          "w-6 h-6",
                          theme === 'dark' ? "text-violet-400" : "text-violet-600"
                        )} />
                      </motion.div>
                      <h4 className={cn(
                        "text-2xl font-bold",
                        theme === 'dark' ? "text-white" : "text-black"
                      )}>
                        {section.title}
                      </h4>
                    </motion.div>
                    
                    <ul className="space-y-4">
                      {section.links.map((link, linkIndex) => (
                        <HolographicLink
                          key={link.name}
                          href={link.href}
                          icon={link.icon}
                          delay={sectionIndex * 0.1 + linkIndex * 0.05}
                          theme={theme}
                        >
                          {link.name}
                        </HolographicLink>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Bottom Section with Vivid Purple Theme */}
        <div className={cn(
          "border-t backdrop-blur-sm",
          theme === 'dark' 
            ? "border-white/10" 
            : "border-gray-200/50"
        )}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              
              {/* Enhanced Copyright with Vivid Purple Theme */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className={cn(
                  "flex items-center space-x-3 text-lg",
                  theme === 'dark' ? "text-gray-200" : "text-slate-800"
                )}
              >
                <span>© 2025 NeoApp. Made with</span>
                <motion.div
                  animate={{ 
                    scale: [1, 1.4, 1],
                    rotate: [0, 15, -15, 0]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Heart className="w-6 h-6 text-red-500 fill-current" />
                </motion.div>
                <span>in San Francisco</span>
              </motion.div>

              {/* Enhanced Social Links with Vivid Purple Theme */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center space-x-5"
              >
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.div
                      key={social.label}
                      initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      <MagneticElement strength={0.4} theme={theme}>
                        <motion.a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "relative block p-5 backdrop-blur-md rounded-3xl shadow-lg transition-all duration-300 overflow-hidden group",
                            theme === 'dark' 
                              ? "bg-white/10 text-gray-200" 
                              : "bg-white text-slate-800"
                          )}
                          whileHover={{ 
                            scale: 1.15, 
                            y: -8,
                            rotateY: 10,
                            boxShadow: theme === 'dark'
                              ? '0 25px 50px rgba(0, 0, 0, 0.3)'
                              : '0 25px 50px rgba(0, 0, 0, 0.15)',
                          }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={social.label}
                        >
                          {/* Enhanced Animated background with vivid purple accents */}
                          <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100"
                            style={{
                              background: `linear-gradient(135deg, ${social.color}${theme === 'dark' ? '20' : '15'} 0%, ${social.color}${theme === 'dark' ? '10' : '08'} 100%)`
                            }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          {/* Icon with enhanced animation */}
                          <motion.div
                            whileHover={{ 
                              rotate: 360,
                              scale: 1.2
                            }}
                            transition={{ duration: 0.6 }}
                            className="relative z-10"
                          >
                            <Icon className="w-7 h-7" />
                          </motion.div>
                          
                          {/* Enhanced Orbital ring with vivid purple */}
                          <motion.div
                            className={cn(
                              "absolute inset-0 border-2 rounded-3xl opacity-0 group-hover:opacity-100",
                              theme === 'dark' ? "border-violet-400/30" : "border-violet-400/20"
                            )}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          />
                          
                          {/* Enhanced Hover particles with vivid purple */}
                          <AnimatePresence>
                            {[...Array(6)].map((_, i) => (
                              <motion.div
                                key={i}
                                className={cn(
                                  "absolute w-1 h-1 rounded-full opacity-0 group-hover:opacity-100",
                                  theme === 'dark' ? "bg-violet-400" : "bg-violet-600"
                                )}
                                animate={{
                                  x: [0, Math.cos(i * Math.PI / 3) * 40],
                                  y: [0, Math.sin(i * Math.PI / 3) * 40],
                                  scale: [0, 1.5, 0],
                                }}
                                transition={{
                                  duration: 1.8,
                                  delay: i * 0.1,
                                  ease: "easeOut"
                                }}
                                style={{
                                  left: '50%',
                                  top: '50%',
                                }}
                              />
                            ))}
                          </AnimatePresence>
                        </motion.a>
                      </MagneticElement>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Enhanced Back to Top Button with Vivid Purple Theme */}
              <MagneticElement strength={0.5} theme={theme}>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ 
                    scale: 1.15, 
                    y: -8,
                    boxShadow: "0 30px 60px rgba(216, 109, 252, 0.4)",
                    rotateY: 15
                  }}
                  whileTap={{ scale: 0.85 }}
                  onClick={scrollToTop}
                  className="relative p-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl text-white shadow-2xl overflow-hidden group"
                  aria-label="Back to top"
                >
                  {/* Enhanced Holographic overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 1 }}
                  />
                  
                  {/* Icon with enhanced animation */}
                  <motion.div
                    whileHover={{ y: -5, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                  >
                    <ArrowUp className="w-8 h-8" />
                  </motion.div>
                  
                  {/* Enhanced Rocket trail effect */}
                  <AnimatePresence>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-6 bg-white/60 rounded-full opacity-0 group-hover:opacity-100"
                        animate={{
                          y: [0, 25],
                          opacity: [0.8, 0],
                          scale: [1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.1,
                          ease: "easeOut",
                          repeat: Infinity
                        }}
                        style={{
                          left: `${40 + i * 5}%`,
                          bottom: '-15px',
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </motion.button>
              </MagneticElement>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
