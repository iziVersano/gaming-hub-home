import { useState, useEffect, useCallback } from 'react';
import {
  Accessibility, X, ChevronDown, ChevronUp,
  Type, Palette, Monitor, Focus, Settings, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/hooks/I18nContext';

// Types for accessibility settings
interface AccessibilitySettings {
  textSize: number; // 0 = normal, positive = larger, negative = smaller
  highContrast: boolean;
  invertColors: boolean;
  grayscale: boolean;
  highlightLinks: boolean;
  highlightHeadings: boolean;
  focusHighlight: boolean;
  disableAnimations: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  textSize: 0,
  highContrast: false,
  invertColors: false,
  grayscale: false,
  highlightLinks: false,
  highlightHeadings: false,
  focusHighlight: false,
  disableAnimations: false,
};

const STORAGE_KEY = 'accessibility-settings';

// Accordion section component
interface AccordionSectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  id: string;
}

const AccordionSection = ({ title, icon, isExpanded, onToggle, children, id }: AccordionSectionProps) => (
  <div className="border-b border-gray-700 last:border-b-0">
    <button
      id={`${id}-header`}
      aria-expanded={isExpanded}
      aria-controls={`${id}-panel`}
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
    >
      <span className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{title}</span>
      </span>
      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
    </button>
    <div
      id={`${id}-panel`}
      role="region"
      aria-labelledby={`${id}-header`}
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <div className="px-4 py-3 bg-gray-900">{children}</div>
    </div>
  </div>
);

// Control button component
interface ControlButtonProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
}

const ControlButton = ({ label, isActive, onClick, className }: ControlButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "px-3 py-2 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
      isActive 
        ? "bg-blue-600 text-white" 
        : "bg-gray-700 text-gray-200 hover:bg-gray-600",
      className
    )}
    aria-pressed={isActive}
  >
    {label}
  </button>
);

const AccessibilityMenu = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error('Failed to parse accessibility settings', e);
      }
    }
  }, []);

  // Save settings to localStorage and apply them
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  // Apply accessibility settings to the document
  const applySettings = useCallback((s: AccessibilitySettings) => {
    const html = document.documentElement;
    const body = document.body;
    
    // Text size
    const baseSize = 16;
    const newSize = baseSize + (s.textSize * 2);
    html.style.fontSize = `${newSize}px`;
    
    // Color filters
    const filters: string[] = [];
    if (s.invertColors) filters.push('invert(1)');
    if (s.grayscale) filters.push('grayscale(1)');
    body.style.filter = filters.length > 0 ? filters.join(' ') : '';
    
    // High contrast
    if (s.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }
    
    // Highlight links
    if (s.highlightLinks) {
      body.classList.add('highlight-links');
    } else {
      body.classList.remove('highlight-links');
    }
    
    // Highlight headings
    if (s.highlightHeadings) {
      body.classList.add('highlight-headings');
    } else {
      body.classList.remove('highlight-headings');
    }
    
    // Focus highlight
    if (s.focusHighlight) {
      body.classList.add('enhanced-focus');
    } else {
      body.classList.remove('enhanced-focus');
    }
    
    // Disable animations
    if (s.disableAnimations) {
      body.classList.add('reduce-motion');
    } else {
      body.classList.remove('reduce-motion');
    }
  }, []);

  // Keyboard handling
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // Update a setting
  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Reset all settings
  const resetAllSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed z-[9998] p-3 rounded-full shadow-lg transition-all duration-300",
          "bg-blue-600 hover:bg-blue-700 text-white",
          "focus:outline-none focus:ring-4 focus:ring-blue-400",
          "left-4 bottom-4 md:left-5 md:bottom-5"
        )}
        aria-label={isOpen ? "Close accessibility menu" : "Open accessibility menu"}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <Accessibility className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Floating panel */}
      <div
        id="accessibility-panel"
        role="dialog"
        aria-label="Accessibility Options"
        aria-modal="false"
        className={cn(
          "fixed z-[9999] bg-gray-800 rounded-lg shadow-2xl",
          "w-80 max-h-[80vh] overflow-hidden",
          "transition-all duration-300 ease-in-out",
          "left-4 bottom-20 md:left-5 md:bottom-20",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Accessibility className="h-5 w-5" aria-hidden="true" />
            {t('a11yMenu.title')}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-gray-400 hover:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t('a11yMenu.closeMenu')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(80vh-60px)]">
          {/* Information & Settings */}
          <AccordionSection
            id="info-settings"
            title={t('a11yMenu.infoSettings')}
            icon={<Info className="h-5 w-5" />}
            isExpanded={expandedSections.has('info-settings')}
            onToggle={() => toggleSection('info-settings')}
          >
            <div className="space-y-3">
              <p className="text-gray-300 text-sm">
                {t('a11yMenu.customizeDescription')}
              </p>
              <button
                onClick={resetAllSettings}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                {t('a11yMenu.resetAll')}
              </button>
            </div>
          </AccordionSection>

          {/* Text Size */}
          <AccordionSection
            id="text-size"
            title={t('a11yMenu.textSize')}
            icon={<Type className="h-5 w-5" />}
            isExpanded={expandedSections.has('text-size')}
            onToggle={() => toggleSection('text-size')}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">{t('a11yMenu.current')}: {settings.textSize > 0 ? '+' : ''}{settings.textSize}</span>
              </div>
              <div className="flex gap-2">
                <ControlButton
                  label="A-"
                  onClick={() => updateSetting('textSize', Math.max(-4, settings.textSize - 1))}
                  className="flex-1"
                />
                <ControlButton
                  label={t('a11yMenu.reset')}
                  onClick={() => updateSetting('textSize', 0)}
                  isActive={settings.textSize === 0}
                  className="flex-1"
                />
                <ControlButton
                  label="A+"
                  onClick={() => updateSetting('textSize', Math.min(4, settings.textSize + 1))}
                  className="flex-1"
                />
              </div>
            </div>
          </AccordionSection>

          {/* Colors */}
          <AccordionSection
            id="colors"
            title={t('a11yMenu.colors')}
            icon={<Palette className="h-5 w-5" />}
            isExpanded={expandedSections.has('colors')}
            onToggle={() => toggleSection('colors')}
          >
            <div className="space-y-2">
              <ControlButton
                label={t('a11yMenu.highContrast')}
                isActive={settings.highContrast}
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className="w-full"
              />
              <ControlButton
                label={t('a11yMenu.invertColors')}
                isActive={settings.invertColors}
                onClick={() => updateSetting('invertColors', !settings.invertColors)}
                className="w-full"
              />
              <ControlButton
                label={t('a11yMenu.grayscale')}
                isActive={settings.grayscale}
                onClick={() => updateSetting('grayscale', !settings.grayscale)}
                className="w-full"
              />
              <ControlButton
                label={t('a11yMenu.resetColors')}
                onClick={() => {
                  updateSetting('highContrast', false);
                  updateSetting('invertColors', false);
                  updateSetting('grayscale', false);
                }}
                className="w-full bg-gray-600"
              />
            </div>
          </AccordionSection>

          {/* Display */}
          <AccordionSection
            id="display"
            title={t('a11yMenu.display')}
            icon={<Monitor className="h-5 w-5" />}
            isExpanded={expandedSections.has('display')}
            onToggle={() => toggleSection('display')}
          >
            <div className="space-y-2">
              <ControlButton
                label={t('a11yMenu.highlightLinks')}
                isActive={settings.highlightLinks}
                onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
                className="w-full"
              />
              <ControlButton
                label={t('a11yMenu.highlightHeadings')}
                isActive={settings.highlightHeadings}
                onClick={() => updateSetting('highlightHeadings', !settings.highlightHeadings)}
                className="w-full"
              />
            </div>
          </AccordionSection>

          {/* Focus Highlight */}
          <AccordionSection
            id="focus"
            title={t('a11yMenu.focusHighlight')}
            icon={<Focus className="h-5 w-5" />}
            isExpanded={expandedSections.has('focus')}
            onToggle={() => toggleSection('focus')}
          >
            <div className="space-y-2">
              <p className="text-gray-300 text-sm mb-2">
                {t('a11yMenu.focusDescription')}
              </p>
              <ControlButton
                label={settings.focusHighlight ? t('a11yMenu.focusOn') : t('a11yMenu.focusOff')}
                isActive={settings.focusHighlight}
                onClick={() => updateSetting('focusHighlight', !settings.focusHighlight)}
                className="w-full"
              />
            </div>
          </AccordionSection>

          {/* Other Options */}
          <AccordionSection
            id="other"
            title={t('a11yMenu.otherOptions')}
            icon={<Settings className="h-5 w-5" />}
            isExpanded={expandedSections.has('other')}
            onToggle={() => toggleSection('other')}
          >
            <div className="space-y-2">
              <ControlButton
                label={settings.disableAnimations ? t('a11yMenu.animationsOff') : t('a11yMenu.animationsOn')}
                isActive={settings.disableAnimations}
                onClick={() => updateSetting('disableAnimations', !settings.disableAnimations)}
                className="w-full"
              />
            </div>
          </AccordionSection>
        </div>
      </div>
    </>
  );
};

export default AccessibilityMenu;

