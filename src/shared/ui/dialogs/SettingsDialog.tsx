import { X, Globe, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { LanguageDialog } from './LanguageDialog';
import { useLanguage } from '../../../contexts/LanguageContext';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { language, setLanguage, t } = useLanguage();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);

  const getLanguageDisplayName = (code: string) => {
    return code === 'fa' ? t.persian : t.english;
  };

  const handleLanguageSelect = (newLanguage: string) => {
    setLanguage(newLanguage as 'fa' | 'en');
  };

  if (!open) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }}
        onClick={() => onOpenChange(false)}
      >
        {/* Dialog content */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '20px',
            maxWidth: '360px',
            width: '100%',
            margin: '0 16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            textAlign: 'center',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Close icon button */}
        <button
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            transition: 'background-color 0.2s'
          }}
          onClick={() => onOpenChange(false)}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <X size={24} color="#374151" />
        </button>

        {/* Title */}
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#1e3a8a' }}>
          {t.settings}
        </h2>
        
        {/* Settings rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'right' }}>
          {/* Language row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={20} color="#1e3a8a" />
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                {t.language}
              </span>
            </div>
            <button
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                background: 'linear-gradient(to bottom right, #4ade80, #16a34a)',
                color: 'white',
                fontSize: '13px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                minHeight: '32px'
              }}
              onClick={(e) => {
                e.stopPropagation();
                setLanguageDialogOpen(true);
              }}
            >
              {getLanguageDisplayName(language)}
            </button>
          </div>

          {/* Sound row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Volume2 size={20} color="#1e3a8a" />
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                {t.sound}
              </span>
            </div>
            {/* Toggle button */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{
                width: '48px',
                height: '28px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.3s',
                backgroundColor: soundEnabled ? '#4ade80' : '#d1d5db'
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: '4px',
                  transition: 'transform 0.3s',
                  transform: soundEnabled ? 'translateX(-24px)' : 'translateX(-4px)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}
              />
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Language Dialog */}
      <LanguageDialog
        open={languageDialogOpen}
        onOpenChange={setLanguageDialogOpen}
        currentLanguage={language}
        onLanguageSelect={handleLanguageSelect}
      />
    </>
  );
}

