import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, X, Send, Bot, Sparkles, Phone,
  ExternalLink, ChevronRight, Volume2, VolumeX, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../api';

// Mini 3D Avatar inside Chat Header / Launcher
function VyenkyHeadModel() {
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (headRef.current) {
      // Gentle floating and subtle curious head tilt
      headRef.current.position.y = Math.sin(t * 2) * 0.08;
      headRef.current.rotation.y = Math.sin(t * 0.8) * 0.2;
      headRef.current.rotation.z = Math.cos(t * 1.2) * 0.05;
    }

    // Natural blinking: eyes scale down briefly every ~3.5 seconds
    const blinkCycle = t % 3.5;
    const isBlinking = blinkCycle > 3.35;
    const eyeScaleY = isBlinking ? 0.1 : 1.0;
    if (leftEyeRef.current) leftEyeRef.current.scale.y = eyeScaleY;
    if (rightEyeRef.current) rightEyeRef.current.scale.y = eyeScaleY;
  });

  return (
    <group ref={headRef} position={[0, -0.2, 0]}>
      {/* Head */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color="#E8A76C" roughness={0.5} />
      </mesh>

      {/* Stylized hair/ears */}
      <mesh position={[-0.85, 0.6, -0.2]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#6B4226" />
      </mesh>
      <mesh position={[0.85, 0.6, -0.2]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#6B4226" />
      </mesh>

      {/* Eyes */}
      <mesh ref={leftEyeRef} position={[-0.28, 0.12, 0.8]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#1F2421" roughness={0.1} />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.28, 0.12, 0.8]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#1F2421" roughness={0.1} />
      </mesh>

      {/* Eye highlights */}
      <mesh position={[-0.25, 0.16, 0.9]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.31, 0.16, 0.9]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* Gentle smiling mouth */}
      <mesh position={[0, -0.28, 0.82]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.2, 0.035, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#8B3A3A" />
      </mesh>

      {/* Traditional Kurta Collar and Sage Green Scarf */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.65, 0.95, 0.8, 16]} />
        <meshStandardMaterial color="#FDFBF7" />
      </mesh>
      {/* Sage Scarf */}
      <mesh position={[0, -0.7, 0.35]}>
        <torusGeometry args={[0.55, 0.12, 8, 16]} />
        <meshStandardMaterial color="#52796F" roughness={0.6} />
      </mesh>
    </group>
  );
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedRoute?: string;
  actionLabel?: string;
}

export const VyenkyChatbot: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const greetings = {
    en: "Namaste! I'm Vyenky, your virtual guide to SBBM Social Foundation and Vyenkatesh Ashram. How may I help you today?",
    hi: "नमस्ते! मैं वेनकी हूँ, SBBM सोशल फाउंडेशन और व्यंकटेश आश्रम में आपका वर्चुअल सहायक। मैं आपकी क्या मदद कर सकता हूँ?",
    mr: "नमस्कार! मी वेन्की, SBBM सोशल फाउंडेशन आणि व्यंकटेश आश्रमातील तुमचा व्हर्च्युअल सहाय्यक आहे. मी तुम्हाला कशी मदत करू शकतो?"
  };

  const initialQuickReplies = {
    en: ['Admission Process', 'Ashram Address & Phone', 'Go-Seva Kendra', 'How to Donate', 'Volunteer with us'],
    hi: ['प्रवेश प्रक्रिया', 'आश्रम का पता और फोन', 'गो-सेवा केंद्र', 'दान कैसे करें', 'स्वयंसेवक बनें'],
    mr: ['प्रवेश प्रक्रिया', 'आश्रमाचा पत्ता व फोन', 'गो-सेवा केंद्र', 'देणगी कशी द्यावी', 'स्वयंसेवक व्हा']
  };

  // Initialize or change language
  useEffect(() => {
    setMessages([
      {
        id: 'msg_welcome',
        sender: 'bot',
        text: greetings[language],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
    setQuickReplies(initialQuickReplies[language]);
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text || text.trim() === '') return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await apiRequest<{
        success: boolean;
        reply: string;
        quickReplies?: string[];
        suggestedRoute?: string;
        actionLabel?: string;
      }>('/vyenky/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text, language }),
      });

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedRoute: response.suggestedRoute,
        actionLabel: response.actionLabel,
      };

      setMessages((prev) => [...prev, botMsg]);
      if (response.quickReplies && response.quickReplies.length > 0) {
        setQuickReplies(response.quickReplies);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: language === 'hi'
            ? 'क्षमा करें, वर्तमान में सेवा उपलब्ध नहीं है। कृपया +91 98908 98081 पर सीधे संपर्क करें।'
            : language === 'mr'
            ? 'माफ करा, सध्या सेवा अनुपलब्ध आहे. कृपया थेट +91 98908 98081 वर संपर्क साधा.'
            : 'Apologies, we could not process that right now. Please call our official ashram line directly at +91 98908 98081.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedRoute: '/contact',
          actionLabel: 'Contact Directory',
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (route: string) => {
    navigate(route);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Chat Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="relative group flex items-center space-x-3 bg-gradient-to-r from-foundation-forest to-foundation-forestLight text-foundation-ivory p-2 md:pr-5 rounded-full shadow-2xl border-2 border-foundation-gold/60 focus:outline-none focus:ring-4 focus:ring-foundation-gold/40"
          id="vyenky-chat-launcher"
          aria-label="Open Vyenky 3D Assistant"
        >
          {/* Avatar Icon Circle with mini 3D head */}
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-foundation-sandstone/30 overflow-hidden relative border-2 border-foundation-gold flex items-center justify-center shadow-inner">
            <Canvas camera={{ position: [0, 0, 2.4], fov: 45 }}>
              <ambientLight intensity={1.2} />
              <directionalLight position={[2, 4, 3]} intensity={1.5} />
              <VyenkyHeadModel />
            </Canvas>
          </div>

          <div className="hidden md:flex flex-col text-left">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-sm text-foundation-gold">Vyenky (वेन्की)</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-xs text-foundation-sandstone">3D Guide • How can I help?</span>
          </div>

          {/* Unread / Active badge */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foundation-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-foundation-gold" />
            </span>
          )}
        </motion.button>
      </div>

      {/* Expandable Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 md:right-8 w-[92vw] sm:w-[420px] h-[580px] max-h-[82vh] bg-foundation-ivory rounded-3xl shadow-2xl border border-foundation-borderMuted z-50 flex flex-col overflow-hidden"
          >
            {/* Header with 3D Canvas character avatar & Language switch */}
            <div className="bg-gradient-to-r from-foundation-forestDark via-foundation-forest to-foundation-forestLight text-foundation-ivory p-4 flex items-center justify-between border-b border-foundation-gold/30">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-foundation-sandstone/20 overflow-hidden border-2 border-foundation-gold flex items-center justify-center">
                  <Canvas camera={{ position: [0, 0, 2.4], fov: 45 }}>
                    <ambientLight intensity={1.2} />
                    <directionalLight position={[2, 4, 3]} intensity={1.5} />
                    <VyenkyHeadModel />
                  </Canvas>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-display font-bold text-base text-foundation-sandstone">
                      Vyenky Assistant
                    </h3>
                    <span className="text-[10px] bg-foundation-gold/20 text-foundation-gold px-1.5 py-0.5 rounded-full font-semibold">
                      3D AI
                    </span>
                  </div>
                  <p className="text-xs text-foundation-sageLight">
                    Grounded in Verified Ashram Information
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close Assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Language Switcher Bar */}
            <div className="bg-foundation-warmGray px-4 py-2 flex items-center justify-between border-b border-foundation-borderMuted text-xs">
              <div className="flex items-center space-x-1 text-foundation-sage">
                <Globe className="w-3.5 h-3.5" />
                <span className="font-medium">Language:</span>
              </div>
              <div className="flex space-x-1">
                {(['en', 'hi', 'mr'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                      language === lang
                        ? 'bg-foundation-forest text-foundation-ivory shadow-sm'
                        : 'text-foundation-charcoal/70 hover:bg-black/5'
                    }`}
                  >
                    {lang === 'en' && 'English'}
                    {lang === 'hi' && 'हिंदी'}
                    {lang === 'mr' && 'मराठी'}
                  </button>
                ))}
              </div>
            </div>

            {/* Helpline Banner */}
            <div className="bg-emerald-50 px-4 py-1.5 border-b border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800">
              <span className="flex items-center space-x-1">
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>Direct Helpline: <strong>+91 98908 98081</strong></span>
              </span>
              <a
                href="tel:+919890898081"
                className="text-emerald-700 font-bold hover:underline"
              >
                Call
              </a>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-foundation-ivory parchment-pattern">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs md:text-sm leading-relaxed shadow-sm whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-foundation-forest text-foundation-ivory rounded-tr-none'
                        : 'bg-white text-foundation-charcoal border border-foundation-borderMuted rounded-tl-none'
                    }`}
                  >
                    {msg.text}

                    {/* Action navigation button if provided */}
                    {msg.suggestedRoute && (
                      <div className="mt-2.5 pt-2 border-t border-foundation-sandstone/40">
                        <button
                          onClick={() => handleActionClick(msg.suggestedRoute!)}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-foundation-forestLight hover:text-foundation-forest hover:underline"
                        >
                          <span>{msg.actionLabel || 'View Page'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 text-stone-500 text-xs italic p-2 bg-white/70 rounded-xl max-w-xs">
                  <div className="w-2 h-2 rounded-full bg-foundation-sage animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-foundation-sage animate-bounce delay-150" />
                  <div className="w-2 h-2 rounded-full bg-foundation-sage animate-bounce delay-300" />
                  <span>Vyenky is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply Chips */}
            {quickReplies.length > 0 && (
              <div className="p-2 bg-foundation-warmGray/60 border-t border-foundation-borderMuted flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {quickReplies.map((qr, idx) => (
                  <button
                    key={`qr-${idx}`}
                    onClick={() => handleSendMessage(qr)}
                    className="px-2.5 py-1 bg-white hover:bg-foundation-sandstone/30 border border-foundation-borderMuted rounded-full text-[11px] text-foundation-forestDark font-medium transition-colors"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-foundation-borderMuted flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'पूछें (जैसे: प्रवेश, पता, गो-सेवा)...'
                    : language === 'mr'
                    ? 'विचारा (उदा. प्रवेश, पत्ता, गो-सेवा)...'
                    : 'Ask about admission, location, Go-Seva...'
                }
                className="flex-1 bg-foundation-warmGray border border-foundation-borderMuted rounded-full px-4 py-2 text-xs md:text-sm text-foundation-charcoal focus:outline-none focus:ring-2 focus:ring-foundation-forest"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 bg-foundation-forest hover:bg-foundation-forestLight disabled:opacity-40 text-foundation-ivory rounded-full shadow-md transition-all flex items-center justify-center"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
