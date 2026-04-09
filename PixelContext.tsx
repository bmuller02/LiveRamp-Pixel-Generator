import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { PixelState, PixelStateMedia, PixelStateSite, HardcodeRow, GeneratorType } from './types';
import {
  AD_SERVERS,
  HARD_CODE_PARTNER_KEY,
  CONNECT_AD_SERVERS,
  CONNECT_AMAZON_ADAPTER_KEY,
  AMAZON_ADAPTER_URL,
  LIVERAMP_AMAZON_PARTNER_KEY,
} from './constants';

// Internal state for the wizard (looser than the strict PixelState)
interface WizardState {
  step: number;
  generatorType: GeneratorType | null;
  // LiveRamp fields
  liveRampId: string;
  pixelType: 'MEDIA' | 'SITE' | null;
  mediaPartner: string; // Key in AD_SERVERS
  hardcodeRows: HardcodeRow[];
  siteEvent: {
    type: string;
    name: string;
    value: string;
  };
  advertiserName: string;
  // Connect fields
  connectAdvertiserDisplay: string;
  connectAdvertiserPixel: string;
  connectAdServerKey: string;
  connectAmazonWarningAcknowledged: boolean;
  mediaAmazonWarningAcknowledged: boolean;
}

interface PixelContextType {
  state: WizardState;
  setGeneratorType: (type: GeneratorType) => void;
  setLiveRampId: (id: string) => void;
  setPixelType: (type: 'MEDIA' | 'SITE') => void;
  setMediaPartner: (partner: string) => void;
  acknowledgeMediaAmazonWarning: () => void;
  setHardcodeRows: (rows: HardcodeRow[]) => void;
  setSiteEvent: (field: 'type' | 'name' | 'value', value: string) => void;
  setAdvertiserName: (name: string) => void;
  setConnectAdvertiser: (displayName: string, pixelName: string) => void;
  setConnectAdServer: (key: string) => void;
  acknowledgeConnectAmazonWarning: () => void;
  nextStep: () => void;
  prevStep: () => void;
  canAdvance: boolean;
  getConstructedState: () => PixelState | null;
  getConnectPixelUrl: () => string;
  getTotalSteps: () => number;
}

const PixelContext = createContext<PixelContextType | undefined>(undefined);

export const PixelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WizardState>({
    step: 1,
    generatorType: null,
    // LiveRamp fields
    liveRampId: '',
    pixelType: null,
    mediaPartner: '',
    hardcodeRows: [],
    siteEvent: {
      type: '',
      name: '',
      value: '',
    },
    advertiserName: '',
    // Connect fields
    connectAdvertiserDisplay: '',
    connectAdvertiserPixel: '',
    connectAdServerKey: '',
    connectAmazonWarningAcknowledged: false,
    mediaAmazonWarningAcknowledged: false,
  });

  const setGeneratorType = (type: GeneratorType) => setState(prev => ({ ...prev, generatorType: type }));
  const setLiveRampId = (id: string) => setState(prev => ({ ...prev, liveRampId: id }));
  const setPixelType = (type: 'MEDIA' | 'SITE') => setState(prev => ({ ...prev, pixelType: type }));
  const setMediaPartner = (partner: string) => {
    setState(prev => ({
      ...prev,
      mediaPartner: partner,
      mediaAmazonWarningAcknowledged: partner !== LIVERAMP_AMAZON_PARTNER_KEY,
    }));
  };
  const acknowledgeMediaAmazonWarning = () => {
    setState(prev => ({ ...prev, mediaAmazonWarningAcknowledged: true }));
  };
  const setHardcodeRows = (rows: HardcodeRow[]) => setState(prev => ({ ...prev, hardcodeRows: rows }));
  const setSiteEvent = (field: 'type' | 'name' | 'value', value: string) => {
    setState(prev => ({
      ...prev,
      siteEvent: { ...prev.siteEvent, [field]: value }
    }));
  };
  const setAdvertiserName = (name: string) => setState(prev => ({ ...prev, advertiserName: name }));
  const setConnectAdvertiser = (displayName: string, pixelName: string) => {
    setState(prev => ({ ...prev, connectAdvertiserDisplay: displayName, connectAdvertiserPixel: pixelName }));
  };
  const setConnectAdServer = (key: string) => {
    setState(prev => {
      if (prev.connectAdServerKey === key) {
        return {
          ...prev,
          connectAdServerKey: '',
          connectAmazonWarningAcknowledged: false,
        };
      }

      return {
        ...prev,
        connectAdServerKey: key,
        connectAmazonWarningAcknowledged: key !== CONNECT_AMAZON_ADAPTER_KEY,
      };
    });
  };
  const acknowledgeConnectAmazonWarning = () => {
    setState(prev => ({ ...prev, connectAmazonWarningAcknowledged: true }));
  };

  const nextStep = () => setState(prev => ({ ...prev, step: prev.step + 1 }));
  const prevStep = () => setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));

  const getTotalSteps = () => {
    if (state.generatorType === 'CONNECT') return 4;
    return 6; // LiveRamp: 1(type) + 5 original steps
  };

  // Validation Logic to unblock "Next"
  const canAdvance = useMemo(() => {
    // Step 1: Generator type selection
    if (state.step === 1) {
      return state.generatorType !== null;
    }

    if (state.generatorType === 'CONNECT') {
      if (state.step === 2) return state.connectAdvertiserPixel !== '';
      if (state.step === 3) {
        return state.connectAdServerKey !== '' && (
          state.connectAdServerKey !== CONNECT_AMAZON_ADAPTER_KEY || state.connectAmazonWarningAcknowledged
        );
      }
      return true; // Step 4 is review
    }

    // LiveRamp flow (steps shifted by 1)
    if (state.step === 2) {
      return /^\d{6}$/.test(state.liveRampId);
    }
    if (state.step === 3) {
      return state.pixelType !== null;
    }
    if (state.step === 4) {
      if (state.pixelType === 'MEDIA') {
        if (state.mediaPartner === HARD_CODE_PARTNER_KEY) {
          return state.hardcodeRows.length > 0;
        }
        if (state.mediaPartner === LIVERAMP_AMAZON_PARTNER_KEY) {
          return state.mediaAmazonWarningAcknowledged;
        }
        return state.mediaPartner !== '' && !!AD_SERVERS[state.mediaPartner];
      }
      if (state.pixelType === 'SITE') {
        return state.siteEvent.type !== '' && state.siteEvent.name !== '';
      }
      return false;
    }
    if (state.step === 5) {
      return state.advertiserName.trim().length > 0;
    }
    return true; // Step 6 is review
  }, [state]);

  const getConnectPixelUrl = (): string => {
    if (state.connectAdServerKey === CONNECT_AMAZON_ADAPTER_KEY) {
      return AMAZON_ADAPTER_URL;
    }

    const advertiser = state.connectAdvertiserPixel || '{{ADVERTISER}}';
    const adServerDef = CONNECT_AD_SERVERS.find(s => s.key === state.connectAdServerKey);
    if (adServerDef) {
      return `https://hmi-${advertiser}${adServerDef.template}`;
    }
    return `https://hmi-${advertiser}-{{AD SERVER}}.hrzn-nxt.com/pxl?`;
  };

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
        isHardcode: state.mediaPartner === HARD_CODE_PARTNER_KEY,
        hardcodeRows: state.hardcodeRows,
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
        setGeneratorType,
        setLiveRampId,
        setPixelType,
        setMediaPartner,
        acknowledgeMediaAmazonWarning,
        setHardcodeRows,
        setSiteEvent,
        setAdvertiserName,
        setConnectAdvertiser,
        setConnectAdServer,
        acknowledgeConnectAmazonWarning,
        nextStep,
        prevStep,
        canAdvance,
        getConstructedState,
        getConnectPixelUrl,
        getTotalSteps,
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