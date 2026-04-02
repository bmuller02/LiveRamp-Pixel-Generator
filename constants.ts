import { AdServerDefinition, ConnectAdvertiser, ConnectAdServer } from './types';

export const BASE_URL_TEMPLATE = `https://di.rlcdn.com/{{ID}}.gif?pdata=`;
export const PARAMETER_DELIMITER = ",";

export const FALLBACK_ERROR = "No available option for your value specified. Please reach out to the Platform Solutions team.";

export const HARD_CODE_PARTNER_KEY = 'HARD_CODE';

export const CONNECT_ADVERTISERS: ConnectAdvertiser[] = [
  { displayName: 'A&E', pixelName: 'aen' },
  { displayName: 'AMC', pixelName: 'amc' },
  { displayName: 'BET', pixelName: 'bet' },
  { displayName: 'Bleecker Street Films', pixelName: 'bleeckerstreet' },
  { displayName: 'Blue Triton Brands', pixelName: 'bluetriton' },
  { displayName: 'Capital One', pixelName: 'capone' },
  { displayName: 'Care.com', pixelName: 'care' },
  { displayName: 'CBS', pixelName: 'cbs' },
  { displayName: 'CBS Networks', pixelName: 'cbsnetworks' },
  { displayName: 'Chobani', pixelName: 'chobani' },
  { displayName: "Dave's Hot Chicken", pixelName: 'daveshotchicken' },
  { displayName: 'Glanbia', pixelName: 'glanbia' },
  { displayName: 'Goddard', pixelName: 'goddard' },
  { displayName: 'Golden Corral', pixelName: 'goldencorral' },
  { displayName: 'History', pixelName: 'history' },
  { displayName: 'Impossible Foods', pixelName: 'impossiblefoods' },
  { displayName: 'Kensington Tours', pixelName: 'kensingtontours' },
  { displayName: 'Kohls', pixelName: 'kohls' },
  { displayName: 'Kori Krill Oil', pixelName: 'korikrill' },
  { displayName: 'La Colombe', pixelName: 'lacolombe' },
  { displayName: 'Lifetime', pixelName: 'lifetime' },
  { displayName: 'Lionsgate', pixelName: 'liongate' },
  { displayName: 'Natrol', pixelName: 'natrol' },
  { displayName: 'NFL', pixelName: 'nfl' },
  { displayName: 'Noom', pixelName: 'noom' },
  { displayName: 'Paramount Plus', pixelName: 'paramountplus' },
  { displayName: 'Peloton', pixelName: 'peloton' },
  { displayName: 'Poshmark', pixelName: 'poshmark' },
  { displayName: 'Prestige (Medtech)', pixelName: 'medtech' },
  { displayName: 'Regeneron', pixelName: 'regeneron' },
  { displayName: 'Safelite', pixelName: 'safelite' },
  { displayName: 'Showtime', pixelName: 'showtime' },
  { displayName: 'Sport Clips', pixelName: 'sportclips' },
  { displayName: 'Starkist', pixelName: 'starkist' },
  { displayName: 'Starz', pixelName: 'starz' },
  { displayName: 'Tropical Smoothie Cafe', pixelName: 'tropicalsmoothie' },
  { displayName: 'Wegmans', pixelName: 'wegmans' },
  { displayName: 'WeightWatchers', pixelName: 'weightwatchers' },
];

export const CONNECT_AD_SERVERS: ConnectAdServer[] = [
  {
    key: 'CM360',
    displayName: 'CM360',
    template: '-dcm.hrzn-nxt.com/pxl?cachebuster=%n&advertiser_id=%eadv!&campaign_id=%ebuy!&site_id=%esid!&placement_id=%epid!&creative_id=%ecid!&ad_id=%eaid!&opt_out=FALSE',
  },
  {
    key: 'INNOVID',
    displayName: 'Innovid',
    template: '-innovid.hrzn-nxt.com/pxl?cachebuster=[timestamp]&timestamp=[timestamp]&advertiser_id={iv_advertiserid}&campaign_id={iv_campaignid}&publisher_id={iv_publisherid}&placement_id={iv_placementid}&creative_id={iv_creativeid}&ad_id={iv_adid}&dma={iv_geo_dma}&zip={iv_geo_zip}&device_id={ivc_deviceid_raw}&opt_out=FALSE',
  },
  {
    key: 'EXTREME_REACH',
    displayName: 'Extreme Reach',
    template: '-extremereach.hrzn-nxt.com/pxl?cachebuster={{cachebuster}}&timestamp={{timestamp}}&advertiser_id={{er_advertiser_id}}&campaign_id={{er_mediaplan_id}}&publisher_id={{er_vendor_id}}&placement_id={{er_placement_group_id}}&creative_id={{er_creative_id}}&ad_id={{er_isci}}&dma={{erpt_dma}}&user_ip={{erpt_ip}}&device_type={{erpt_device}}&device_id={{erpt_deviceid}}&opt_out={{erpt_opt}}&referrer_url={{er_referrer}}&us_privacy={{US_PRIVACY}}',
  },
  {
    key: 'FLASHTALKING',
    displayName: 'Flashtalking',
    template: "-flashtalking.hrzn-nxt.com/pxl?cachebuster=[%FT_TIMESTAMP%]&timestamp=[%FT_TIMESTAMP%]&advertiser_id=1638&campaign_id=[%campaignID%]&publisher_id=[%siteID%]&placement_id=[%placementID%]&creative_id=[%creativeID%]&ad_id=[%FT_CONFID%]&dma=[%FT_DMA%]&zip=[%FT_POSTAL%]&device_id=[%EL:param['ft_id']%]&opt_out=[%FT_US_PRIVACY%]",
  },
  {
    key: 'THE_TRADE_DESK',
    displayName: 'The Trade Desk',
    template: '-ttd.hrzn-nxt.com/pxl?cachebuster=%%TTD_CACHEBUSTER%%&advertiser_id=%%TTD_ADVERTISERID%%&campaign_id=%%TTD_CAMPAIGNID%%&publisher_id=%%TTD_PARTNERID%%&placement_id=%%TTD_ADGROUPID%%&creative_id=%%TTD_CREATIVEID%%',
  },
  {
    key: 'AMAZON',
    displayName: 'Amazon',
    template: '-amzn.hrzn-nxt.com/pxl?timestamp=${timestamp!}&advertiser_id={%advertiser_cfid}&campaign_id={%campaign_cfid}&campaign=[[CS_ENC_CAMPAIGN_NAME]]&site=[[CS_ENC_SITE_NAME]]&creative_id={%creative_cfid}&creative=[[CS_ENC_CREATIVE_NAME]]&ad_id={%ad_cfid}&device_type=[[CS_ENC_DEVICE_TYPE]]',
  },
];

export const AD_SERVERS: Record<string, AdServerDefinition> = {
  [HARD_CODE_PARTNER_KEY]: {
    name: "N/A (Hardcode)",
    macros: {
      advertiserID: "",
      campaignID: "",
      siteID: "",
      placementID: "",
      creativeID: "",
    },
  },
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