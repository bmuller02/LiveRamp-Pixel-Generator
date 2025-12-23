export type PixelType = 'MEDIA' | 'SITE';

export interface AdServerMacroConfig {
  advertiserID: string;
  campaignID: string;
  siteID: string;
  placementID: string;
  creativeID: string;
}

export interface AdServerDefinition {
  name: string;
  macros: AdServerMacroConfig;
}

export interface PixelStateCommon {
  liveRampId: string; // Must be exactly 6 digits
  advertiserName: string;
}

export interface PixelStateMedia extends PixelStateCommon {
  pixelType: 'MEDIA';
  selectedPartner: string;
  macros: AdServerMacroConfig;
}

export interface PixelStateSite extends PixelStateCommon {
  pixelType: 'SITE';
  eventType: 'view' | 'click' | string;
  eventName: 'pagename' | 'buttontext' | string;
  eventValue: string;
}

export type PixelState = PixelStateMedia | PixelStateSite;

// Utility type guard
export const isMediaPixel = (state: PixelState): state is PixelStateMedia => {
  return state.pixelType === 'MEDIA';
};

export const isSitePixel = (state: PixelState): state is PixelStateSite => {
  return state.pixelType === 'SITE';
};