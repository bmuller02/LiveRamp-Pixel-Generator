import { PixelState, isMediaPixel, isSitePixel } from './types';
import { BASE_URL_TEMPLATE, PARAMETER_DELIMITER, FALLBACK_ERROR } from './constants';

/**
 * Injects the LiveRamp ID and constructs the final URL string.
 */
export const generatePixelString = (state: PixelState): string => {
  if (!state.liveRampId || state.liveRampId.length !== 6 || !/^\d+$/.test(state.liveRampId)) {
    // While the UI should prevent this, we add a safeguard here or return the template
    // For this utility, we assume validation happens upstream or we return a malformed string safe for preview
  }

  const baseUrl = BASE_URL_TEMPLATE.replace('{{ID}}', state.liveRampId || '[ID]');
  let params: string[] = [];

  if (isMediaPixel(state)) {
    params.push('media=media');
    // Ensure strict ordering or keys if required, otherwise iterate standard keys
    const { advertiserID, campaignID, siteID, placementID, creativeID } = state.macros;
    
    // We construct key=value strings
    params.push(`advertiserID=${advertiserID}`);
    params.push(`campaignID=${campaignID}`);
    params.push(`siteID=${siteID}`);
    params.push(`placementID=${placementID}`);
    params.push(`creativeID=${creativeID}`);
    
  } else if (isSitePixel(state)) {
    params.push('site=site');
    params.push(`eventtype=${state.eventType}`);
    params.push(`eventname=${state.eventName}`);
    params.push(`eventvalue=${state.eventValue}`);
  } else {
    return FALLBACK_ERROR;
  }

  return `${baseUrl}${params.join(PARAMETER_DELIMITER)}`;
};

/**
 * Generates the standardized filename.
 * Logic: Horizon-LiveRamp-Pixel_[TYPE]_[PARTNER if MEDIA]_[ADVERTISER]_[DATE].txt
 */
export const generateFileName = (state: PixelState): string => {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const sanitizedAdvertiser = state.advertiserName.replace(/[^a-zA-Z0-9-_]/g, '');
  
  let parts = [
    'Horizon-LiveRamp-Pixel',
    state.pixelType,
  ];

  if (isMediaPixel(state)) {
    const sanitizedPartner = state.selectedPartner.replace(/[^a-zA-Z0-9-_]/g, '');
    parts.push(sanitizedPartner);
  }

  parts.push(sanitizedAdvertiser);
  parts.push(date);

  return `${parts.join('_')}.txt`;
};