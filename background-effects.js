/**
 * Background Effects Controller
 * Handles all background-related visual effects including texture generation,
 * subtle animations, and dynamic visual enhancements
 */

class BackgroundEffects {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.isInitialized = false;
    
    // Configuration - Balanced: slightly larger, tasteful, non-distracting
    this.config = {
      particles: {
        count: 32,
        maxSize: 3.5,
        minSize: 1.5,
        speed: 0.3,
        opacity: 0.5,
        colors: ['#374151', '#4b5563', '#6b7280'],
        shapes: ['circle'],
        connectDistance: 110,
        lineOpacity: 0.12
      },
      texture: {
        intensity: 0.015,
        frequency: 0.9,
        octaves: 2
      },
      gradientShift: {
        enabled: true,
        speed: 0.0008,
        intensity: 0.1
      }
    };
    
    this.init();
  }
  
  init() {
    if (this.isInitialized) return;
    
    this.createCanvas();
    this.generateTexture();
    this.createParticles();
    this.setupEventListeners();
    this.startAnimation();
    
    this.isInitialized = true;
    console.log('Background effects initialized');
  }
  
  createCanvas() {
    // Create canvas for background effects
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'background-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
        opacity: 0.7;
    `;
    
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    
    this.resizeCanvas();
  }
  
  resizeCanvas() {
    if (!this.canvas) return;
    
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this.ctx.scale(dpr, dpr);
  }
  
  generateTexture() {
    // Create noise texture programmatically
    const textureCanvas = document.createElement('canvas');
    const textureCtx = textureCanvas.getContext('2d');
    textureCanvas.width = 200;
    textureCanvas.height = 200;
    
    const imageData = textureCtx.createImageData(200, 200);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = this.generateNoise(
        (i / 4) % 200, 
        Math.floor((i / 4) / 200)
      );
      const value = Math.floor(noise * 255);
      
      data[i] = value;     // Red
      data[i + 1] = value; // Green
      data[i + 2] = value; // Blue
      data[i + 3] = Math.floor(this.config.texture.intensity * 255); // Alpha
    }
    
    textureCtx.putImageData(imageData, 0, 0);
    
    // Apply texture to body
    const textureDataUrl = textureCanvas.toDataURL();
    document.body.style.backgroundImage += `, url(${textureDataUrl})`;
  }
  
  generateNoise(x, y) {
    // Simple noise function
    let value = 0;
    let amplitude = 1;
    let frequency = this.config.texture.frequency;
    
    for (let i = 0; i < this.config.texture.octaves; i++) {
      value += this.noise(x * frequency, y * frequency) * amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }
    
    return Math.abs(value);
  }
  
  noise(x, y) {
    // Simple pseudo-random noise
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return (n - Math.floor(n)) * 2 - 1;
  }
  
  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.config.particles.count; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * (this.config.particles.maxSize - this.config.particles.minSize) + this.config.particles.minSize,
        speedX: (Math.random() - 0.5) * this.config.particles.speed,
        speedY: (Math.random() - 0.5) * this.config.particles.speed,
        opacity: Math.random() * this.config.particles.opacity,
        life: Math.random() * 100,
        color: this.config.particles.colors[Math.floor(Math.random() * this.config.particles.colors.length)],
        shape: this.config.particles.shapes[Math.floor(Math.random() * this.config.particles.shapes.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        baseOpacity: Math.random() * this.config.particles.opacity * 0.8 + this.config.particles.opacity * 0.2
      });
    }
  }
  
  updateParticles() {
    // Update particles and remove expired burst particles
    this.particles = this.particles.filter(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.life += 0.5;
      particle.rotation += particle.rotationSpeed;
      particle.pulsePhase += 0.03;
      
      // Handle burst particles differently
      if (particle.isBurst) {
        particle.burstLife--;
        particle.opacity *= 0.98; // Slower fade out
        particle.speedX *= 0.97;  // Slower deceleration
        particle.speedY *= 0.97;
        particle.speedY += 0.1;   // Add gravity effect
        return particle.burstLife > 0; // Remove when expired
      }
      
      // Wrap around screen edges with smooth transition
      if (particle.x < -10) particle.x = window.innerWidth + 10;
      if (particle.x > window.innerWidth + 10) particle.x = -10;
      if (particle.y < -10) particle.y = window.innerHeight + 10;
      if (particle.y > window.innerHeight + 10) particle.y = -10;
      
  // Gentle pulsing effect (reduced amplitude to avoid distraction)
  const pulse = (Math.sin(particle.pulsePhase) + 1) * 0.5;
  particle.opacity = particle.baseOpacity + (pulse * particle.baseOpacity * 0.25);
      
      // Gentle floating motion
      particle.speedY += Math.sin(particle.life * 0.01) * 0.001;
      particle.speedX += Math.cos(particle.life * 0.008) * 0.0008;
      
      // Apply gentle damping to prevent runaway speeds
      particle.speedX *= 0.999;
      particle.speedY *= 0.999;
      
      return true; // Keep regular particles
    });
    
    // Maintain minimum particle count by adding new ones if needed
    while (this.particles.filter(p => !p.isBurst).length < this.config.particles.count) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * (this.config.particles.maxSize - this.config.particles.minSize) + this.config.particles.minSize,
        speedX: (Math.random() - 0.5) * this.config.particles.speed,
        speedY: (Math.random() - 0.5) * this.config.particles.speed,
        opacity: Math.random() * this.config.particles.opacity,
        life: Math.random() * 100,
        color: this.config.particles.colors[Math.floor(Math.random() * this.config.particles.colors.length)],
        shape: this.config.particles.shapes[Math.floor(Math.random() * this.config.particles.shapes.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        baseOpacity: Math.random() * this.config.particles.opacity * 0.8 + this.config.particles.opacity * 0.2
      });
    }
  }
  
  drawParticles() {
    if (!this.ctx) return;
    
    // Draw connection lines first (behind particles)
    this.drawConnections();
    
    // Draw particles
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = particle.color;
      
      // Move to particle position and apply rotation
      this.ctx.translate(particle.x, particle.y);
      this.ctx.rotate(particle.rotation);
      
      // Draw different shapes
      this.ctx.beginPath();
      switch (particle.shape) {
        case 'circle':
          this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          break;
        case 'square':
          this.ctx.rect(-particle.size, -particle.size, particle.size * 2, particle.size * 2);
          break;
        case 'triangle':
          this.ctx.moveTo(0, -particle.size);
          this.ctx.lineTo(-particle.size * 0.866, particle.size * 0.5);
          this.ctx.lineTo(particle.size * 0.866, particle.size * 0.5);
          this.ctx.closePath();
          break;
      }
      this.ctx.fill();
      
      // Simple particle without glow for performance
      this.ctx.fill();
      
      this.ctx.restore();
    });
  }
  
  drawConnections() {
    if (!this.ctx) return;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const particle1 = this.particles[i];
        const particle2 = this.particles[j];
        
        const dx = particle1.x - particle2.x;
        const dy = particle1.y - particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.particles.connectDistance) {
          const opacity = (1 - distance / this.config.particles.connectDistance) * this.config.particles.lineOpacity;
          
          this.ctx.save();
          this.ctx.globalAlpha = opacity;
          this.ctx.strokeStyle = '#4b5563';
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(particle1.x, particle1.y);
          this.ctx.lineTo(particle2.x, particle2.y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }
  }
  
  animate() {
    if (!this.ctx) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Update and draw particles
    this.updateParticles();
    this.drawParticles();
    
    // Continue animation
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  startAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.animate();
  }
  
  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles(); // Recreate particles for new dimensions
    });
    
    // Handle visibility change for performance
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAnimation();
      } else {
        this.startAnimation();
      }
    });
    
    // Enhanced mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Enhanced particle interaction with mouse
      this.particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 110) {
          // Gentle attraction force (slightly extended radius)
          const force = (110 - distance) / 110 * 0.002;
          particle.speedX += dx * force;
          particle.speedY += dy * force;
          
          // Subtle opacity increase near mouse
          const proximityEffect = (110 - distance) / 110;
          particle.opacity = Math.min(particle.baseOpacity * (1 + proximityEffect * 0.6), 0.65);
        }
        
        // Reset rotation speed gradually
        particle.rotationSpeed *= 0.95;
      });
    });
    
    // Add subtle click interaction
    document.addEventListener('click', (e) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      
      // Create minimal burst particles
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const speed = 1 + Math.random() * 2;
        
        this.particles.push({
          x: clickX,
          y: clickY,
          size: Math.random() * 1.5 + 1,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          opacity: 0.5,
          life: 0,
          color: this.config.particles.colors[Math.floor(Math.random() * this.config.particles.colors.length)],
          shape: 'circle',
          rotation: 0,
          rotationSpeed: 0,
          pulsePhase: Math.random() * Math.PI * 2,
          baseOpacity: 0.5,
          isBurst: true,
          burstLife: 60 // frames to live
        });
      }
    });
  }
  
  // Method to adjust effect intensity
  setIntensity(intensity) {
    intensity = Math.max(0, Math.min(1, intensity));
    this.config.particles.opacity = 0.5 * intensity;
    this.config.particles.lineOpacity = 0.12 * intensity;
    this.config.texture.intensity = 0.015 * intensity;
    
    if (this.canvas) {
      this.canvas.style.opacity = 0.7 * intensity;
    }
    
    // Update existing particles' base opacity
    this.particles.forEach(particle => {
      if (!particle.isBurst) {
        particle.baseOpacity = Math.random() * this.config.particles.opacity * 0.8 + this.config.particles.opacity * 0.2;
      }
    });
  }
  
  // Method to toggle effects on/off
  toggle(enabled = null) {
    const isEnabled = enabled !== null ? enabled : this.canvas.style.display !== 'none';
    
    if (this.canvas) {
      this.canvas.style.display = isEnabled ? 'block' : 'none';
    }
    
    if (isEnabled) {
      this.startAnimation();
    } else {
      this.stopAnimation();
    }
  }
  
  destroy() {
    this.stopAnimation();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.isInitialized = false;
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    window.backgroundEffects = new BackgroundEffects();
    
    // Expose control methods to console for easy customization
    window.bgEffectsControl = {
      setIntensity: (level) => window.backgroundEffects.setIntensity(level),
      toggle: (enabled) => window.backgroundEffects.toggle(enabled),
      getConfig: () => window.backgroundEffects.config,
      setParticleCount: (count) => {
        window.backgroundEffects.config.particles.count = count;
        window.backgroundEffects.createParticles();
      }
    };
    
    console.log('Background effects initialized! Use window.bgEffectsControl for customization.');
  } else {
    console.log('Background effects disabled due to user preference for reduced motion');
  }
});

// Export for manual control if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BackgroundEffects;
}