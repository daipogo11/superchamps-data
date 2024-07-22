import moment from 'moment-timezone';

import { biConstants } from '@/bi/bi-constants';

import CONSTANTS from './constants';

export const isBrowser = () => typeof window !== 'undefined';

export const isSafari = () => {
  if (isBrowser()) {
    const ua = window?.navigator?.userAgent.toLowerCase();
    return (
      ua.includes('safari') && !ua.includes('chrome') && !ua.includes('crios')
    );
  }
};

export const localStorage =
  typeof window !== 'undefined'
    ? window.localStorage
    : {
        setItem: () => undefined,
        getItem: () => undefined,
        removeItem: () => undefined,
      };

export const numToTwoDigits = (num: number) => {
  return num.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
};

const utils = {
  /** @description shorten wallet address */
  shortenAddress: (address = '') => {
    // todo memoize this
    if (!address) address = '-';
    return address.length > 11
      ? `${address.substring(0, 6)}...${address.substring(
          address.length - 4,
          address.length,
        )}`
      : address;
  },

  sortNfts: (nfts: any[]): Array<any> => {
    const sortedNfts = [
      ...nfts.filter((nft) => nft.nft?.generation === 0),
      ...nfts.filter((nft) => nft.nft?.generation !== 0),
    ];
    return sortedNfts;
  },

  sortGames: (games: any[]): Array<any> => {
    return games.length
      ? games.sort((a, b) => {
          const aLength = a.nfts?.length + a.mintPass?.length;
          const bLength = b.nfts?.length + b.mintPass?.length;
          if (bLength === aLength) {
            return a?.appId.localeCompare(b?.appId);
          } else {
            return bLength - aLength;
          }
        })
      : [];
  },

  logoutUser: () => {
    if (isBrowser()) {
      localStorage.removeItem(
        CONSTANTS.LOCAL_STORAGE_KEYS.NAVIGATE_POPUP_COUNTER,
      );
      localStorage.removeItem(biConstants.BI_LOCAL_STORAGE_KEYS.USER_PROFILE);
      localStorage.removeItem(
        CONSTANTS.LOCAL_STORAGE_KEYS.METAMASK_WALLET_ADDRESS,
      );
      localStorage.removeItem(
        biConstants.BI_LOCAL_STORAGE_KEYS.DEFAULT_BI_EVENT,
      );
    }
  },

  /** get human readable game name from app ID */
  getGameName: (appId: string) => {
    switch (appId) {
      case 'onjoyride.solitireblitz':
        return 'Solitaire Blitz';
      case 'onjoyride.battlechamps':
        return 'Battle Champs';
      case 'onjoyride.tennischamps':
        return 'Tennis Champs';
      case 'onjoyride.dartsblitz':
        return 'Darts Blitz';
      default:
        return '';
    }
  },

  /**
   * Converts seconds to days, hours, minutes, seconds
   * @param secs {number}
   * @returns Object
   */
  secondsToTime: (secs: number) => {
    secs = Number(secs);
    const days = numToTwoDigits(Math.floor(secs / (3600 * 24)));
    const hours = numToTwoDigits(Math.floor((secs % (3600 * 24)) / 3600));
    const minutes = numToTwoDigits(Math.floor((secs % 3600) / 60));
    const seconds = numToTwoDigits(Math.floor(secs % 60));
    return { days, hours, minutes, seconds };
  },

  middleEllipsis: (str: string | undefined, length?: number) => {
    let newStr = str || '';
    const requiredLength = length ? length / 2 : 4;
    if (newStr?.length <= requiredLength) {
      return newStr;
    }

    newStr =
      newStr.slice(0, requiredLength) +
      '...' +
      newStr.slice(newStr.length - requiredLength, newStr.length);
    return newStr;
  },

  el: (id: string) => document.getElementById(id),

  timeout: (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};

export const numberFormat = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const getCurrentTabForBi = () => {
  if (isBrowser()) {
    const path = window.location.pathname;
    if (path.startsWith('/quests') || path.startsWith('/login')) {
      return 'season_tab';
    } else if (path.startsWith('/seasons')) {
      return 'home_tab';
    } else if (path.startsWith('/store') || path.startsWith('/shop')) {
      return 'shop_tab';
    } else {
      return 'season_tab';
    }
  } else {
    return 'season_tab';
  }
};

export const getSeasonStartTime = () => {
  if (isBrowser()) {
    let quests: any = localStorage.getItem('QUESTS');
    if (quests) {
      quests = JSON.parse(quests);
      if (quests?.data?.seasonChallengeDTOList) {
        const seasons = quests.data.seasonChallengeDTOList;
        const now = moment().unix();
        const activeSeason = seasons.find((s: any) => {
          const preSeasonTime = moment(
            (s.startAt - s.extraTimeBeforeStart) * 1000,
          ).unix();
          const submittingStartTime = moment(
            (s.startAt + s.duration + s.rewardsCollectionBuffer) * 1000,
          ).unix();

          // season between before start time till submitting start time is active
          return now > preSeasonTime && now < submittingStartTime;
        });
        return activeSeason?.startAt || -1;
      }
    } else {
      return -1;
    }
  } else {
    return -1;
  }
};
export default utils;

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const goToLink = (url: string) => {
  if (isBrowser()) {
    window.open(url, '_blank');
  }
};

/**
 * Function to convert UUID to a number by taking mode
 * @param uuid - string
 * @param divisor - number
 * @returns number
 */
export const uuidToMode = (uuid: string, divisor: number): number => {
  // Remove dashes from the UUID
  const cleanUUID = uuid.replace(/-/g, '');
  // Convert the clean UUID to a big integer
  const bigIntUUID = BigInt('0x' + cleanUUID);
  // Calculate the mode
  return Number(bigIntUUID % BigInt(divisor));
};

export const getBrowserLanguage = () => {
  if (!isBrowser()) return '';
  if (navigator.languages !== undefined) return navigator.languages[0];
  return navigator.language;
};
