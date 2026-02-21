import { AdServerDefinition } from './types';

export const BASE_URL_TEMPLATE = `<img src="https://di.rlcdn.com/{{ID}}.gif?pdata=...`;
export const PARAMETER_DELIMITER = ",";

export const FALLBACK_ERROR = "No available option for your value specified. Please reach out to the Platform Solutions team.";

export const AD_SERVERS: Record<string, AdServerDefinition> = {
  CM360: {
    name: "CM360",
    macros: {
      advertiserID: "%eadv!",
      campaignID: "%ebuy!",
      siteID: "%esid!",
      placementID: "%epid!",
      creativeID: "%ecid!",
    },
  },
  THE_TRADE_DESK: {
    name: "The Trade Desk",
    macros: {
      advertiserID: "%%TTD_ADVERTISERID%%",
      campaignID: "%%TTD_CAMPAIGNID%%",
      siteID: "%%TTD_PARTNERID%%",
      placementID: "%%TTD_ADGROUPID%%",
      creativeID: "%%TTD_CREATIVEID%%",
    },
  },
  INNOVID: {
    name: "Innovid",
    macros: {
      advertiserID: "{iv_advertiserid}",
      campaignID: "{iv_campaignid}",
      siteID: "{iv_publisherid}",
      placementID: "{iv_placementid}",
      creativeID: "{iv_creativeid}",
    },
  },
};

// Helper for fuzzy search or dropdown population
export const AD_SERVER_KEYS = Object.keys(AD_SERVERS);