const CONSTANTS = {
  JRX_APP_ID: 'onjoyride.champswebCrypt',
  JRX_TC_APP_ID: 'onjoyride.tennischamps',
  OTP_LENGTH: 6,
  NEW_USER_WITHDRAW_DISABLE_DURATION: 432000000, // 5 days in millisecond
  DISABLE_MARKETPLACE: false,
  LOCAL_STORAGE_KEYS: {
    METAMASK_WALLET_ADDRESS: 'METAMASK_WALLET_ADDRESS',
    NAVIGATE_POPUP_COUNTER: 'NAVIGATE_POPUP_COUNTER',
    /** array of user IDs */
    MM_CONNECTION_REWARD_USER_IDS: 'MM_CONNECTION_REWARD_USER_IDS',
    // IS user applied for VIP benefits
    VIP_BENEFITS_APPLIED: 'VIP_BENIFITS_APPLIED',
  },
  URL_SEARCH_PARAMS: {
    // nothing here yet
  },
  RECAPTCHA_KEY: '6LfN4sYhAAAAAGKURVFoY2lDHGXXyIBXOVhVlyon',
  BUTTON_CLICK_DEBOUNCE_INTERVAL: 1000,
  DEFAULT_ESTIMATE_INTERVAL: 13000,

  IS_DOWNTIME: false,

  LOG_STYLES: {
    REDIRECTION: 'background: #222; color: #bada55',
  },

  END_OF_TABLE_TEXT: 'end of table',
  END_OF_TABLE_EMPTY_TEXT: 'Nothing to show here!',
  COLEECTIBLES_TRAITS: (nft: any) => {
    return {
      Bling: nft
        ? nft.nft?.traits.find((a) => a.name === 'Bling')?.value || ''
        : '',
      Feels: nft
        ? nft.nft?.traits.find((a) => a.name === 'Feels')?.value || ''
        : '',
      Character: nft
        ? nft.nft?.traits.find((a) => a.name === 'Character')?.value || ''
        : '',
      Mood: nft
        ? nft.nft?.traits.find((a) => a.name === 'Mood')?.value || ''
        : '',
      Moves: nft
        ? nft.nft?.traits.find((a) => a.name === 'Moves')?.value || ''
        : '',
      Racket: nft
        ? nft.nft?.traits.find((a) => a.name === 'Racket')?.value || ''
        : '',
      Style: nft
        ? nft.nft?.traits.find((a) => a.name === 'Style')?.value || ''
        : '',
    };
  },
  IS_DEPOSIT_DISABLED: true,
};

export enum EChallengType {
  DAILY = 'daily',
  SEASON = 'season',
  LIFETIME = 'lifetime',
}

export default CONSTANTS;
