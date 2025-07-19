'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { ArrowRight, Play, Star, Check, Zap, Shield, Users, Smartphone, Globe, BarChart3, Sparkles, Rocket, Crown, Award, TrendingUp, Database, Code, Layers, Target, Lightbulb, Infinity } from 'lucide-react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, useScroll, useInView, useSpring } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Sphere, Box, Dodecahedron, Torus, OrbitControls, Stars, Cloud, Ring, Cylinder } from '@react-three/drei';
import { useTheme } from 'next-themes';
import * as THREE from 'three';


// 3D Background Components
const FloatingGeometry = ({ theme }) => {
  const group = useRef();
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      group.current.rotation.y = state.clock.elapsedTime * 0.1;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Dodecahedron args={[1.5]} position={[-4, 2, -2]}>
          <meshStandardMaterial 
            color="#8b5cf6" 
            emissive="#8b5cf6" 
            emissiveIntensity={theme === 'dark' ? 0.4 : 0.2} 
            transparent
            opacity={theme === 'dark' ? 0.9 : 0.7}
          />
        </Dodecahedron>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
        <Torus args={[1, 0.4, 16, 32]} position={[4, -1, -1]} rotation={[0.5, 0, 0]}>
          <meshStandardMaterial 
            color="#ec4899" 
            emissive="#ec4899" 
            emissiveIntensity={theme === 'dark' ? 0.3 : 0.2}
            transparent
            opacity={theme === 'dark' ? 0.8 : 0.6}
          />
        </Torus>
      </Float>
      
      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.8}>
        <Box args={[1.2, 1.2, 1.2]} position={[0, 3, -3]}>
          <meshStandardMaterial 
            color="#06b6d4" 
            emissive="#06b6d4" 
            emissiveIntensity={theme === 'dark' ? 0.3 : 0.2}
            transparent
            opacity={theme === 'dark' ? 0.8 : 0.6}
          />
        </Box>
      </Float>
    </group>
  );
};



const ParticleField = ({ theme }) => {
  const points = useRef();
  const particleCount = 1000;
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    
    const color = new THREE.Color();
    color.setHSL(Math.random() * 0.3 + 0.7, 0.8, theme === 'dark' ? 0.7 : 0.5);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  
  useFrame((state) => {
    if (points.current) {
      const time = state.clock.elapsedTime;
      const positions = points.current.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(time + i * 0.01) * 0.01;
        positions[i * 3] += Math.cos(time + i * 0.005) * 0.005;
      }
      
      points.current.geometry.attributes.position.needsUpdate = true;
      points.current.rotation.y = time * 0.05;
    }
  });
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={theme === 'dark' ? 0.8 : 0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Magnetic Button Component
const MagneticButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  icon: Icon, 
  className = '',
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  const { theme } = useTheme();
  
  const handleMouseMove = (e) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setMousePosition({
        x: (e.clientX - centerX) * 0.3,
        y: (e.clientY - centerY) * 0.3,
      });
    }
  };
  
  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden rounded-2xl font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 transform-gpu perspective-1000 ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        rotateX: mousePosition.y * 0.1,
        rotateY: mousePosition.x * 0.1,
        scale: isHovered ? 1.05 : 1,
      }}
      whileHover={{
        boxShadow: variant === 'primary' 
          ? theme === 'dark'
            ? '0 25px 50px rgba(139, 92, 246, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)'
            : '0 25px 50px rgba(139, 92, 246, 0.3), 0 0 40px rgba(236, 72, 153, 0.2)'
          : theme === 'dark'
            ? '0 20px 40px rgba(255, 255, 255, 0.1)'
            : '0 20px 40px rgba(0, 0, 0, 0.1)',
        z: 50,
      }}
      whileTap={{ scale: 0.95 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      onClick={onClick}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      {...props}
    >
      {/* Animated Background */}
      <motion.div
        className={`absolute inset-0 ${
          variant === 'primary'
            ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600'
            : theme === 'dark'
              ? 'bg-gradient-to-r from-gray-700 to-gray-800'
              : 'bg-gradient-to-r from-gray-100 to-gray-200'
        }`}
        animate={{
          backgroundPosition: isHovered ? '200% 0%' : '0% 0%',
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      
      {/* Holographic Effect */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r from-transparent ${
          theme === 'dark' ? 'via-white/30' : 'via-black/20'
        } to-transparent`}
        initial={{ x: '-100%', skewX: -15 }}
        animate={isHovered ? { x: '200%' } : { x: '-100%' }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      
      {/* Glass Effect */}
      <div className={`absolute inset-0 ${
        theme === 'dark' ? 'bg-white/10' : 'bg-black/5'
      } backdrop-blur-sm border ${
        theme === 'dark' ? 'border-white/20' : 'border-black/10'
      } rounded-2xl`} />
      
      {/* Content */}
      <span className={`relative z-10 flex items-center justify-center space-x-2 ${
        variant === 'primary' 
          ? 'text-white' 
          : theme === 'dark' 
            ? 'text-white' 
            : 'text-gray-900'
      }`}>
        {Icon && (
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        )}
        <span>{children}</span>
      </span>
      
      {/* Particle Effects */}
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 ${
                  theme === 'dark' ? 'bg-white' : 'bg-purple-600'
                } rounded-full`}
                initial={{ x: '50%', y: '50%', scale: 0 }}
                animate={{
                  x: `${50 + Math.cos(i * Math.PI / 6) * 150}%`,
                  y: `${50 + Math.sin(i * Math.PI / 6) * 150}%`,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeOut",
                  delay: i * 0.05,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Enhanced Feature Card
const FeatureCard = ({ feature, index, theme }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);
  
  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    }
  };
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 100, rotateX: -30 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2,
        type: "spring",
        stiffness: 100 
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className="group relative h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`relative p-6 sm:p-8 rounded-3xl backdrop-blur-xl border overflow-hidden cursor-pointer h-full ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-white/20' 
            : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/50'
        }`}
        whileHover={{
          scale: 1.05,
          z: 50,
          boxShadow: theme === 'dark'
            ? '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(139, 92, 246, 0.4)'
            : '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 30px rgba(139, 92, 246, 0.2)',
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Animated Background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0`}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Icon Container */}
        <motion.div
          className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6 overflow-hidden`}
          animate={{
            rotateY: isHovered ? 180 : 0,
            scale: isHovered ? 1.1 : 1,
            y: isHovered ? -5 : 0,
          }}
          transition={{ duration: 0.6 }}
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: isHovered ? '0 15px 30px rgba(0, 0, 0, 0.2)' : '0 5px 15px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ transform: 'rotateY(180deg)' }}>
            {feature.icon}
          </div>
          
          {/* Orbital Ring */}
          <motion.div
            className="absolute inset-0 border-2 border-white/30 rounded-2xl"
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 2, ease: "linear" }}
          />
        </motion.div>
        
        {/* Content */}
        <motion.div
          animate={{ y: isHovered ? -5 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className={`text-xl sm:text-2xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {feature.title}
          </h3>
          <p className={`leading-relaxed text-sm sm:text-base ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {feature.description}
          </p>
        </motion.div>
        
        {/* Hover Particles */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-purple-400 rounded-full"
                  initial={{ x: '50%', y: '50%', scale: 0 }}
                  animate={{
                    x: `${50 + Math.random() * 100 - 50}%`,
                    y: `${50 + Math.random() * 100 - 50}%`,
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
      </motion.div>
    </motion.div>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  
  useEffect(() => {
    setMounted(true);
    setIsVisible(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-purple-900/30 to-black' 
          : 'bg-gradient-to-br from-slate-50 via-purple-100/50 to-white'
      }`}>
        
        {/* 3D Background Canvas */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ y: y1, opacity }}
        >
          <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={theme === 'dark' ? 0.4 : 0.6} />
              <pointLight position={[10, 10, 10]} intensity={0.8} />
              <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />
              
              <Stars
                radius={100}
                depth={50}
                count={theme === 'dark' ? 5000 : 3000}
                factor={4}
                saturation={0}
                fade={true}
                speed={1}
              />
              
              <FloatingGeometry theme={theme} />
              <ParticleField theme={theme} />
              
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
                autoRotate
                autoRotateSpeed={0.1}
              />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className={`absolute -top-4 -right-4 w-48 sm:w-72 h-48 sm:h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${
              theme === 'dark' ? 'bg-purple-600' : 'bg-purple-500'
            }`}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className={`absolute -bottom-8 -left-4 w-48 sm:w-72 h-48 sm:h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${
              theme === 'dark' ? 'bg-yellow-600' : 'bg-yellow-500'
            }`}
            animate={{
              x: [0, -50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 h-48 sm:h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${
              theme === 'dark' ? 'bg-pink-600' : 'bg-pink-500'
            }`}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />
        </div>

        {/* Hero Content */}
        <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center">
              
              {/* Social Proof Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20, rotateX: 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
                className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-lg border mb-6 sm:mb-8 ${
                  theme === 'dark' 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-white/60 border-gray-300/30'
                }`}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                </motion.div>
                <span className={`text-xs sm:text-sm font-medium ${
                  theme === 'dark' ? 'text-white/90' : 'text-gray-800/90'
                }`}>
                  Trusted by 10,000+ companies worldwide
                </span>
                <motion.div
                  className="ml-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-pink-500" />
                </motion.div>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 50, rotateX: -30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50, rotateX: 0 }}
                transition={{ duration: 1, delay: 0.3, type: "spring" }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <h1 className={`text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6 sm:mb-8 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <motion.span
                    className="inline-block"
                    animate={{ 
                      y: [0, -10, 0],
                      textShadow: theme === 'dark' 
                        ? [
                          '0 0 20px rgba(255,255,255,0.5)',
                          '0 0 40px rgba(139,92,246,0.8)',
                          '0 0 20px rgba(255,255,255,0.5)'
                        ]
                        : [
                          '0 0 20px rgba(0,0,0,0.3)',
                          '0 0 40px rgba(139,92,246,0.6)',
                          '0 0 20px rgba(0,0,0,0.3)'
                        ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Transform Your
                  </motion.span>
                  <br />
                  <motion.span 
                    className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent inline-block"
                    animate={{ 
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    style={{ backgroundSize: '200% 200%' }}
                  >
                    Business
                  </motion.span>
                  <br />
                  <motion.span
                    className="inline-block"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  >
                    Into Something
                  </motion.span>
                  <br />
                  <motion.span 
                    className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent inline-block"
                    animate={{ 
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      rotateX: [0, 5, 0],
                    }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                    style={{ backgroundSize: '300% 300%' }}
                  >
                    Extraordinary
                  </motion.span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 30, rotateX: -20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30, rotateX: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className={`text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-5xl mx-auto leading-relaxed px-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
                style={{ textShadow: theme === 'dark' ? '0 2px 10px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.1)' }}
              >
                The only platform you need to scale from startup to enterprise. 
                Join thousands of companies already accelerating their growth with our revolutionary solution.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4"
              >
                <MagneticButton
                  variant="primary"
                  icon={Rocket}
                  className="w-full sm:w-auto text-white"
                >
                  Start Free Trial
                </MagneticButton>
                
                <MagneticButton
                  variant="secondary"
                  icon={Play}
                  className={`w-full sm:w-auto border-2 ${
                    theme === 'dark' 
                      ? 'border-white/30 text-white bg-white/10 hover:bg-white/20' 
                      : 'border-gray-300/30 text-gray-900 bg-gray-100/50 hover:bg-gray-200/50'
                  }`}
                >
                  Watch Demo
                </MagneticButton>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 1 }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 px-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {[
                  { icon: Shield, text: "Enterprise Security" },
                  { icon: Zap, text: "99.9% Uptime" },
                  { icon: Users, text: "24/7 Support" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-xl backdrop-blur-md border text-sm sm:text-base ${
                      theme === 'dark' 
                        ? 'bg-white/5 border-white/10' 
                        : 'bg-white/30 border-gray-300/20'
                    }`}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)',
                      boxShadow: theme === 'dark' 
                        ? '0 10px 25px rgba(0, 0, 0, 0.2)' 
                        : '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
                    >
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.div>
                    <span className="font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <FeaturesSection />
      <SocialProofSection />
      <PricingSection />
      <FinalCTASection />
    </div>
  );
};

// Enhanced Features Section
const FeaturesSection = () => {
  const { theme } = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  const features = [
    {
      icon: <Zap className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: "Lightning Fast Performance",
      description: "Experience 10x faster processing with our quantum-optimized architecture and edge computing technology",
      color: "from-yellow-400 via-orange-500 to-red-500"
    },
    {
      icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: "Military-Grade Security",
      description: "SOC 2 Type II compliant with quantum encryption, zero-trust architecture, and real-time threat detection",
      color: "from-blue-400 via-cyan-500 to-teal-500"
    },
    {
      icon: <Users className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: "Seamless Collaboration",
      description: "AI-powered team sync with real-time collaboration, smart notifications, and intuitive workflow automation",
      color: "from-purple-400 via-pink-500 to-rose-500"
    },
    {
      icon: <Database className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: "Intelligent Analytics",
      description: "Advanced AI-driven insights with predictive modeling, real-time dashboards, and automated reporting",
      color: "from-green-400 via-emerald-500 to-teal-500"
    },
    {
      icon: <Globe className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: "Global Scalability",
      description: "Deploy across 50+ regions with auto-scaling infrastructure and 99.99% uptime guarantee",
      color: "from-indigo-400 via-purple-500 to-pink-500"
    },
    {
      icon: <Code className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: "Developer-First API",
      description: "RESTful APIs with GraphQL support, comprehensive SDKs, and extensive documentation for rapid integration",
      color: "from-rose-400 via-pink-500 to-purple-500"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className={`py-16 sm:py-24 lg:py-32 relative overflow-hidden transition-colors duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}
    >
      
      {/* 3D Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <Canvas>
          <Suspense fallback={null}>
            <ambientLight intensity={theme === 'dark' ? 0.3 : 0.5} />
            <pointLight position={[5, 5, 5]} />
            
            <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
              <Ring args={[3, 3.5, 32]} position={[-10, 4, -8]} rotation={[0.5, 0, 0]}>
                <meshStandardMaterial color="#8b5cf6" transparent opacity={0.3} />
              </Ring>
            </Float>
            
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
              <Cylinder args={[1, 1.5, 2]} position={[10, -2, -5]}>
                <meshStandardMaterial color="#ec4899" transparent opacity={0.2} />
              </Cylinder>
            </Float>
          </Suspense>
        </Canvas>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-12 sm:mb-20"
        >
          <motion.div
            className={`inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full border mb-4 sm:mb-6 ${
              theme === 'dark'
                ? 'bg-purple-900/30 border-purple-700/50'
                : 'bg-purple-100 border-purple-200'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <Crown className={`w-4 h-4 sm:w-5 sm:h-5 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`} />
            <span className={`text-xs sm:text-sm font-semibold ${
              theme === 'dark' ? 'text-purple-300' : 'text-purple-800'
            }`}>
              Premium Features
            </span>
          </motion.div>
          
          <motion.h2 
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Everything You Need to 
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"> Dominate</span>
          </motion.h2>
          
          <motion.p 
            className={`text-lg sm:text-xl max-w-4xl mx-auto transition-colors ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            Cutting-edge features engineered for the future, available today
          </motion.p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} theme={theme} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Social Proof Section
const SocialProofSection = () => {
  const { theme } = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  const testimonials = [
    {
      quote: "This platform didn't just transform our operation – it revolutionized our entire industry approach. We achieved 500% growth in 8 months.",
      author: "Sarah Chen",
      role: "CEO, TechCorp",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1f8?w=100&h=100&fit=crop&crop=face",
      company: "TechCorp",
      rating: 5
    },
    {
      quote: "The ROI exceeded all expectations. This is the most intelligent business decision we've ever made. Simply phenomenal.",
      author: "Michael Rodriguez",
      role: "Founder, StartupX",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      company: "StartupX",
      rating: 5
    },
    {
      quote: "Unmatched performance and innovation. Our productivity increased by 400% while reducing costs by 60%. Game-changing.",
      author: "Emily Johnson",
      role: "CTO, InnovateLab",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      company: "InnovateLab",
      rating: 5
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className={`py-16 sm:py-24 lg:py-32 relative overflow-hidden transition-colors duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-black' 
          : 'bg-gradient-to-br from-gray-100 via-purple-50/30 to-white'
      }`}
    >
      
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-20">
        <Canvas>
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <Stars radius={150} depth={50} count={3000} factor={4} />
            
            {[...Array(6)].map((_, i) => (
              <Float
                key={i}
                speed={1 + i * 0.2}
                rotationIntensity={0.5}
                floatIntensity={1}
              >
                <Sphere 
                  args={[0.5]} 
                  position={[
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10
                  ]}
                >
                  <meshStandardMaterial 
                    color={i % 2 === 0 ? "#8b5cf6" : "#ec4899"} 
                    transparent 
                    opacity={0.3}
                    emissive={i % 2 === 0 ? "#8b5cf6" : "#ec4899"}
                    emissiveIntensity={0.2}
                  />
                </Sphere>
              </Float>
            ))}
          </Suspense>
        </Canvas>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-20"
        >
          <motion.h2 
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
            animate={{
              textShadow: theme === 'dark' 
                ? [
                  '0 0 20px rgba(139, 92, 246, 0.5)',
                  '0 0 40px rgba(236, 72, 153, 0.5)',
                  '0 0 20px rgba(139, 92, 246, 0.5)'
                ]
                : [
                  '0 0 15px rgba(139, 92, 246, 0.3)',
                  '0 0 30px rgba(236, 72, 153, 0.3)',
                  '0 0 15px rgba(139, 92, 246, 0.3)'
                ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Loved by Industry 
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Leaders</span>
          </motion.h2>
          <motion.p 
            className={`text-lg sm:text-xl ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            Join the revolution that's transforming businesses worldwide
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                boxShadow: theme === 'dark' 
                  ? '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(139, 92, 246, 0.4)'
                  : '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 30px rgba(139, 92, 246, 0.2)'
              }}
              className={`group p-6 sm:p-8 rounded-3xl backdrop-blur-xl border relative overflow-hidden cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-white/60 border-gray-200/50'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Holographic Effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent, rgba(236, 72, 153, 0.1))`
                }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Rating Stars */}
              <motion.div 
                className="flex items-center mb-4 sm:mb-6"
                initial={{ x: -20 }}
                animate={isInView ? { x: 0 } : {}}
                transition={{ delay: index * 0.2 + 0.3 }}
              >
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: index * 0.2 + 0.4 + i * 0.1 }}
                  >
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-current" />
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Quote */}
              <motion.blockquote 
                className={`mb-6 italic text-base sm:text-lg leading-relaxed relative z-10 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: index * 0.2 + 0.5 }}
              >
                "{testimonial.quote}"
              </motion.blockquote>
              
              {/* Author Info */}
              <motion.div 
                className="flex items-center relative z-10"
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: index * 0.2 + 0.6 }}
              >
                <motion.img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mr-4 border-2 border-white/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <div>
                  <div className={`font-bold text-lg sm:text-xl ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {testimonial.author}
                  </div>
                  <div className={`text-sm sm:text-base ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {testimonial.role}
                  </div>
                  <div className={`text-xs sm:text-sm font-semibold ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`}>
                    {testimonial.company}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Company Logos */}
        <motion.div 
          className={`pt-8 sm:pt-12 border-t ${
            theme === 'dark' ? 'border-white/20' : 'border-gray-200/50'
          }`}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.p 
            className={`text-center mb-8 sm:mb-12 text-base sm:text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
            animate={{ 
              textShadow: theme === 'dark' 
                ? ['0 0 10px rgba(255,255,255,0.3)', '0 0 20px rgba(255,255,255,0.1)', '0 0 10px rgba(255,255,255,0.3)']
                : ['0 0 10px rgba(0,0,0,0.2)', '0 0 20px rgba(0,0,0,0.1)', '0 0 10px rgba(0,0,0,0.2)']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Trusted by industry giants and innovative startups alike
          </motion.p>
          
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12">
            {['Microsoft', 'Google', 'Amazon', 'Netflix', 'Spotify', 'Airbnb'].map((company, index) => (
              <motion.div
                key={index}
                className={`text-lg sm:text-2xl lg:text-3xl font-bold cursor-pointer relative transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'text-white/20 hover:text-white/80' 
                    : 'text-gray-400/60 hover:text-gray-800'
                }`}
                whileHover={{ 
                  scale: 1.2, 
                  textShadow: theme === 'dark' 
                    ? '0 0 20px rgba(255, 255, 255, 0.8)' 
                    : '0 0 20px rgba(0, 0, 0, 0.6)',
                  rotateY: 10
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 + 1 }}
              >
                {company}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/30 to-purple-600/0"
                  whileHover={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Enhanced Pricing Section
const PricingSection = () => {
  const { theme } = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [selectedPlan, setSelectedPlan] = useState(1);
  
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 5 team members",
        "10GB storage",
        "Basic analytics",
        "Email support",
        "Mobile app access"
      ],
      popular: false,
      buttonText: "Start Free Trial",
      buttonStyle: "secondary",
      color: "from-blue-500 to-cyan-500",
      icon: <Rocket className="w-6 h-6 sm:w-8 sm:h-8" />
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Best for growing businesses",
      features: [
        "Up to 25 team members",
        "100GB storage",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "API access",
        "Advanced security",
        "Team collaboration tools"
      ],
      popular: true,
      buttonText: "Get Started",
      buttonStyle: "primary",
      color: "from-purple-500 to-pink-500",
      icon: <Crown className="w-6 h-6 sm:w-8 sm:h-8" />
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited team members",
        "Unlimited storage",
        "Custom analytics",
        "24/7 phone support",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee",
        "White-label options",
        "Advanced compliance"
      ],
      popular: false,
      buttonText: "Contact Sales",
      buttonStyle: "secondary",
      color: "from-emerald-500 to-teal-500",
      icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className={`py-16 sm:py-24 lg:py-32 relative overflow-hidden transition-colors duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
          : 'bg-gradient-to-br from-gray-50 via-white to-purple-50'
      }`}
    >
      
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-30">
        <Canvas>
          <Suspense fallback={null}>
            <ambientLight intensity={theme === 'dark' ? 0.4 : 0.6} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />
            
            <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
              <Text
                position={[-8, 3, -5]}
                fontSize={1.5}
                color={theme === 'dark' ? "#8b5cf6" : "#7c3aed"}
                anchorX="center"
                anchorY="middle"
                rotation={[0, 0.3, 0]}
              >
                $
              </Text>
            </Float>
          </Suspense>
        </Canvas>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-12 sm:mb-20"
        >
          <motion.div
            className={`inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full border mb-4 sm:mb-6 ${
              theme === 'dark'
                ? 'bg-purple-900/30 border-purple-700/50'
                : 'bg-purple-100 border-purple-200'
            }`}
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Zap className={`w-4 h-4 sm:w-5 sm:h-5 ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`} />
            </motion.div>
            <span className={`text-xs sm:text-sm font-semibold ${
              theme === 'dark' ? 'text-purple-300' : 'text-purple-800'
            }`}>
              Flexible Pricing
            </span>
          </motion.div>
          
          <motion.h2 
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
            animate={{
              textShadow: theme === 'dark' 
                ? [
                  '0 0 20px rgba(139, 92, 246, 0.3)',
                  '0 0 40px rgba(236, 72, 153, 0.3)',
                  '0 0 20px rgba(139, 92, 246, 0.3)'
                ]
                : [
                  '0 0 15px rgba(139, 92, 246, 0.2)',
                  '0 0 30px rgba(236, 72, 153, 0.2)',
                  '0 0 15px rgba(139, 92, 246, 0.2)'
                ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Simple, Transparent
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"> Pricing</span>
          </motion.h2>
          
          <motion.p 
            className={`text-lg sm:text-xl transition-colors max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            No hidden fees. No surprises. Scale as you grow with confidence.
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateY: -20 }}
              animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              className={`relative group cursor-pointer ${
                plan.popular ? 'lg:scale-105 lg:-translate-y-4' : ''
              }`}
              onClick={() => setSelectedPlan(index)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div
                className={`relative p-6 sm:p-8 rounded-3xl backdrop-blur-xl border-2 overflow-hidden h-full ${
                  plan.popular 
                    ? theme === 'dark'
                      ? 'border-purple-500 bg-gray-800/80' 
                      : 'border-purple-500 bg-white/80'
                    : theme === 'dark'
                      ? 'border-gray-700/30 bg-gray-800/60'
                      : 'border-gray-200/50 bg-white/60'
                } ${selectedPlan === index ? 'ring-4 ring-purple-400/50' : ''}`}
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  boxShadow: theme === 'dark' 
                    ? '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(139, 92, 246, 0.4)'
                    : '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 30px rgba(139, 92, 246, 0.2)',
                  z: 30
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.2 + 0.5, type: "spring" }}
                  >
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Most Popular
                      </motion.span>
                    </div>
                  </motion.div>
                )}

                {/* Plan Icon */}
                <motion.div
                  className={`inline-flex p-3 sm:p-4 rounded-2xl bg-gradient-to-r ${plan.color} text-white mb-4 sm:mb-6`}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 10,
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)'
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {plan.icon}
                </motion.div>

                {/* Plan Details */}
                <div className="text-center mb-6 sm:mb-8">
                  <motion.h3 
                    className={`text-xl sm:text-2xl font-bold mb-2 transition-colors ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                    animate={{ scale: selectedPlan === index ? 1.05 : 1 }}
                  >
                    {plan.name}
                  </motion.h3>
                  <motion.p 
                    className={`mb-4 sm:mb-6 transition-colors text-sm sm:text-base ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: index * 0.2 + 0.3 }}
                  >
                    {plan.description}
                  </motion.p>
                  
                  <motion.div 
                    className="mb-4 sm:mb-6"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.span 
                      className={`text-4xl sm:text-6xl font-bold transition-colors ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                      animate={{
                        textShadow: plan.popular 
                          ? theme === 'dark'
                            ? ['0 0 20px rgba(139, 92, 246, 0.5)', '0 0 0px transparent', '0 0 20px rgba(139, 92, 246, 0.5)']
                            : ['0 0 15px rgba(139, 92, 246, 0.3)', '0 0 0px transparent', '0 0 15px rgba(139, 92, 246, 0.3)']
                          : '0 0 0px transparent'
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {plan.price}
                    </motion.span>
                    <span className={`text-lg sm:text-xl transition-colors ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {plan.period}
                    </span>
                  </motion.div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      className={`flex items-center transition-colors text-sm sm:text-base ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.2 + featureIndex * 0.1 + 0.5 }}
                      whileHover={{ x: 5, scale: 1.02 }}
                    >
                      <motion.div
                        className="mr-3 flex-shrink-0"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      </motion.div>
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <MagneticButton
                  variant={plan.buttonStyle}
                  className={`w-full ${
                    plan.buttonStyle === 'primary' 
                      ? 'text-white' 
                      : theme === 'dark'
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                  icon={plan.buttonStyle === 'primary' ? Zap : ArrowRight}
                >
                  {plan.buttonText}
                </MagneticButton>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.p 
            className={`transition-colors mb-4 text-sm sm:text-base ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            Need a custom solution? 
            <motion.a 
              href="#contact" 
              className={`font-semibold ml-2 transition-colors ${
                theme === 'dark' 
                  ? 'text-purple-400 hover:text-purple-300' 
                  : 'text-purple-600 hover:text-purple-700'
              }`}
              whileHover={{ 
                scale: 1.1,
                textShadow: theme === 'dark' 
                  ? '0 0 10px rgba(139, 92, 246, 0.5)' 
                  : '0 0 10px rgba(139, 92, 246, 0.3)'
              }}
            >
              Contact our sales team
            </motion.a>
          </motion.p>
          
          <motion.div 
            className={`flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
          >
            {[
              { icon: Check, text: "14-day free trial" },
              { icon: Shield, text: "No setup fees" },
              { icon: Zap, text: "Cancel anytime" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2"
                whileHover={{ 
                  scale: 1.1, 
                  color: theme === 'dark' ? '#8b5cf6' : '#7c3aed'
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <item.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Enhanced Final CTA Section
const FinalCTASection = () => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  
  return (
    <section 
      ref={sectionRef}
      className={`py-16 sm:py-24 lg:py-32 relative overflow-hidden transition-colors duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900' 
          : 'bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />
            
            <Stars
              radius={200}
              depth={100}
              count={8000}
              factor={6}
              saturation={0}
              fade={true}
              speed={1}
            />
            
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
              <Torus args={[3, 0.8, 16, 32]} position={[-10, 5, -8]} rotation={[0.5, 0, 0]}>
                <meshStandardMaterial 
                  color="#8b5cf6" 
                  emissive="#8b5cf6" 
                  emissiveIntensity={0.3}
                  transparent
                  opacity={0.6}
                />
              </Torus>
            </Float>
          </Suspense>
        </Canvas>
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          
          {/* Badge */}
          <motion.div
            className="inline-flex items-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-xl border border-white/30 mb-6 sm:mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)',
              rotate: 2
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            </motion.div>
            <span className="text-base sm:text-lg font-bold text-white">
              Limited Time Offer
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            </motion.div>
          </motion.div>

          {/* Main Headline */}
<motion.h2 
  className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight text-white"
  initial={{ opacity: 0, y: 30 }}
  animate={isInView ? { 
    opacity: 1, 
    y: 0,
    textShadow: [
      '0 0 20px rgba(255, 255, 255, 0.5)',
      '0 0 40px rgba(139, 92, 246, 0.8)',
      '0 0 60px rgba(236, 72, 153, 0.6)',
      '0 0 40px rgba(139, 92, 246, 0.8)',
      '0 0 20px rgba(255, 255, 255, 0.5)'
    ]
  } : {}}
  transition={{ 
    opacity: { delay: 0.5, duration: 0.8 },
    y: { delay: 0.5, duration: 0.8 },
    textShadow: { duration: 4, repeat: Infinity }
  }}
>
  Ready to 
  <motion.span 
    className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
    animate={{
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    }}
    transition={{ duration: 3, repeat: Infinity }}
    style={{ backgroundSize: '200% 200%' }}
  >
    Revolutionize
  </motion.span>
  <br />
  Your Business?
</motion.h2>


          {/* Subheadline */}
          <motion.p 
            className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Join over 10,000 companies that have already transformed their operations. 
            Start your journey to extraordinary growth today – no credit card required.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <MagneticButton
              variant="primary"
              icon={Rocket}
              className="w-full sm:w-auto text-white text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #06b6d4 100%)',
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)',
              }}
            >
              Start Your Free Trial
            </MagneticButton>
            
            <MagneticButton
              variant="secondary"
              icon={Play}
              className="w-full sm:w-auto border-2 border-white/40 text-white bg-white/10 hover:bg-white/20 text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-6 rounded-2xl backdrop-blur-md"
            >
              Schedule a Demo
            </MagneticButton>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-gray-400 mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            {[
              { icon: Check, text: "14-day free trial" },
              { icon: Shield, text: "No setup fees" },
              { icon: Zap, text: "Cancel anytime" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2 p-2 sm:p-3 rounded-lg bg-white/5 backdrop-blur-sm text-sm sm:text-base"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Urgency Banner */}
          <motion.div
            className="inline-flex items-center space-x-3 sm:space-x-4 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-red-600/80 to-orange-600/80 backdrop-blur-xl border border-white/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.3, type: "spring" }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)'
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
            </motion.div>
            <span className="text-white font-semibold text-sm sm:text-base">
              🔥 Special Launch Pricing - Save 50% This Week Only!
            </span>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingPage;
