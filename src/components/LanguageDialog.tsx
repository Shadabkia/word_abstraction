import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLanguage: string;
  onLanguageSelect: (language: string) => void;
}

export function LanguageDialog({ open, onOpenChange, currentLanguage, onLanguageSelect }: LanguageDialogProps) {
  const { t } = useLanguage();
  
  if (!open) return null;

  const languages = [
    { code: 'fa', name: t.persian },
    { code: 'en', name: t.english }
  ];

  const handleLanguageClick = (languageCode: string) => {
    onLanguageSelect(languageCode);
    onOpenChange(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100000,
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
          borderRadius: '24px',
          padding: '24px',
          maxWidth: '360px',
          width: '100%',
          margin: '0 24px',
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
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#1e3a8a' }}>
          {t.selectLanguage}
        </h2>
        
        {/* Language list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageClick(language.code)}
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: currentLanguage === language.code
                  ? 'linear-gradient(to bottom right, #4ade80, #16a34a)'
                  : '#f9fafb',
                color: currentLanguage === language.code ? 'white' : '#374151',
                fontSize: '16px',
                fontWeight: 'bold',
                border: currentLanguage === language.code ? 'none' : '2px solid #e5e7eb',
                cursor: 'pointer',
                boxShadow: currentLanguage === language.code 
                  ? '0 4px 6px rgba(0, 0, 0, 0.1)'
                  : 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (currentLanguage !== language.code) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }
              }}
              onMouseLeave={(e) => {
                if (currentLanguage !== language.code) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }
              }}
            >
              {language.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

