import { PixelState, isMediaPixel, isSitePixel, HardcodeRow } from './types';
import { BASE_URL_TEMPLATE, PARAMETER_DELIMITER, FALLBACK_ERROR, AMAZON_ADAPTER_URL } from './constants';

/**
 * Injects the LiveRamp ID and constructs the final URL string.
 */
const buildBaseUrl = (liveRampId: string) => {
  return BASE_URL_TEMPLATE.replace('{{ID}}', liveRampId || '[ID]');
};

const buildMediaParams = (macros: {
  advertiserID: string;
  campaignID: string;
  siteID: string;
  placementID: string;
  creativeID: string;
}) => {
  return [
    'media=media',
    `advertiserID=${macros.advertiserID}`,
    `campaignID=${macros.campaignID}`,
    `siteID=${macros.siteID}`,
    `placementID=${macros.placementID}`,
    `creativeID=${macros.creativeID}`,
  ];
};

const buildSiteParams = (state: PixelState) => {
  if (!isSitePixel(state)) return [];
  const params = ['site=site', `eventtype=${state.eventType}`, `eventname=${state.eventName}`];
  if (state.eventValue) {
    params.push(`eventvalue=${state.eventValue}`);
  }
  return params;
};

const buildPixelUrl = (liveRampId: string, params: string[]) => {
  return `${buildBaseUrl(liveRampId)}${params.join(PARAMETER_DELIMITER)}`;
};

export const generatePixelString = (state: PixelState): string => {
  if (!state.liveRampId || state.liveRampId.length !== 6 || !/^\d+$/.test(state.liveRampId)) {
    // While the UI should prevent this, we add a safeguard here or return the template
    // For this utility, we assume validation happens upstream or we return a malformed string safe for preview
  }

  let params: string[] = [];

  if (isMediaPixel(state)) {
    if (state.selectedPartner === 'Amazon') {
      return AMAZON_ADAPTER_URL;
    }

    params = buildMediaParams(state.macros);
  } else if (isSitePixel(state)) {
    params = buildSiteParams(state);
  } else {
    return FALLBACK_ERROR;
  }

  return `<img src="${buildPixelUrl(state.liveRampId, params)}"/>`;
};

export const generateHardcodePixelRows = (liveRampId: string, rows: HardcodeRow[]) => {
  return rows.map((row) => {
    const params = buildMediaParams({
      advertiserID: row.advertiserID,
      campaignID: row.campaignID,
      siteID: row.siteID,
      placementID: row.placementID,
      creativeID: row.creativeID,
    });
    return `<img src="${buildPixelUrl(liveRampId, params)}"/>`;
  });
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

export const generateHardcodeFileName = (advertiserName: string): string => {
  const date = new Date().toISOString().split('T')[0];
  const sanitizedAdvertiser = advertiserName.replace(/[^a-zA-Z0-9-_]/g, '');
  return `Horizon-LiveRamp-Pixel_MEDIA_Hardcode_${sanitizedAdvertiser}_${date}.xlsx`;
};

export const generateConnectFileName = (advertiserPixelName: string, adServerDisplayName: string): string => {
  return `ConnectPixel_hmi-${advertiserPixelName}_${adServerDisplayName}.txt`;
};