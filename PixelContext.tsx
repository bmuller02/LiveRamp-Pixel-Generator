import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { PixelState, PixelStateMedia, PixelStateSite } from './types';
import { AD_SERVERS } from './constants';

// Internal state for the wizard (looser than the strict PixelState)
interface WizardState {
  step: number;
  liveRampId: string;
  pixelType: 'MEDIA' | 'SITE' | null;
  mediaPartner: string; // Key in AD_SERVERS
  siteEvent: {
    type: string;
    name: string;
    value: string;
  };
  advertiserName: string;
}

interface PixelContextType {
  state: WizardState;
  setLiveRampId: (id: string) => void;
  setPixelType: (type: 'MEDIA' | 'SITE') => void;
  setMediaPartner: (partner: string) => void;
  setSiteEvent: (field: 'type' | 'name' | 'value', value: string) => void;
  setAdvertiserName: (name: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  canAdvance: boolean;
  getConstructedState: () => PixelState | null;
}

const PixelContext = createContext<PixelContextType | undefined>(undefined);

export const PixelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WizardState>({
    step: 1,
    liveRampId: '',
    pixelType: null,
    mediaPartner: '',
    siteEvent: {
      type: 'view',
      name: '{{pagename macro}}',
      value: '',
    },
    advertiserName: '',
  });

  const setLiveRampId = (id: string) => setState(prev => ({ ...prev, liveRampId: id }));
  const setPixelType = (type: 'MEDIA' | 'SITE') => setState(prev => ({ ...prev, pixelType: type }));
  const setMediaPartner = (partner: string) => setState(prev => ({ ...prev, mediaPartner: partner }));
  const setSiteEvent = (field: 'type' | 'name' | 'value', value: string) => {
    setState(prev => ({
      ...prev,
      siteEvent: { ...prev.siteEvent, [field]: value }
    }));
  };
  const setAdvertiserName = (name: string) => setState(prev => ({ ...prev, advertiserName: name }));

  const nextStep = () => setState(prev => ({ ...prev, step: prev.step + 1 }));
  const prevStep = () => setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));

  // Validation Logic to unblock "Next"
  const canAdvance = useMemo(() => {
    if (state.step === 1) {
      // Must be exactly 6 digits
      return /^\d{6}$/.test(state.liveRampId);
    }
    if (state.step === 2) {
      return state.pixelType !== null;
    }
    if (state.step === 3) {
      if (state.pixelType === 'MEDIA') {
        // Strict check: Media Partner must exist in AD_SERVERS
        return state.mediaPartner !== '' && !!AD_SERVERS[state.mediaPartner];
      }
      if (state.pixelType === 'SITE') {
        return state.siteEvent.type !== '' && state.siteEvent.name !== '';
      }
      return false;
    }
    if (state.step === 4) {
      return state.advertiserName.trim().length > 0;
    }
    return true; // Step 5 is review
  }, [state]);

  // Transform Wizard State into Phase 1 PixelState
  const getConstructedState = (): PixelState | null => {
    // Basic validation before constructing
    if (!state.liveRampId || !state.pixelType || !state.advertiserName) return null;

    const common = {
      liveRampId: state.liveRampId,
      advertiserName: state.advertiserName,
    };

    if (state.pixelType === 'MEDIA') {
      const partnerDef = AD_SERVERS[state.mediaPartner];
      if (!partnerDef) return null; // Incomplete

      const pixelState: PixelStateMedia = {
        ...common,
        pixelType: 'MEDIA',
        selectedPartner: partnerDef.name,
        macros: partnerDef.macros,
      };
      return pixelState;
    } else {
      const pixelState: PixelStateSite = {
        ...common,
        pixelType: 'SITE',
        eventType: state.siteEvent.type,
        eventName: state.siteEvent.name,
        eventValue: state.siteEvent.value,
      };
      return pixelState;
    }
  };

  return (
    <PixelContext.Provider
      value={{
        state,
        setLiveRampId,
        setPixelType,
        setMediaPartner,
        setSiteEvent,
        setAdvertiserName,
        nextStep,
        prevStep,
        canAdvance,
        getConstructedState
      }}
    >
      {children}
    </PixelContext.Provider>
  );
};

export const usePixelStore = () => {
  const context = useContext(PixelContext);
  if (!context) {
    throw new Error('usePixelStore must be used within a PixelProvider');
  }
  return context;
};