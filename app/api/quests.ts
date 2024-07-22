import CONSTANTS from '@/common/constants';
import utils, { localStorage } from '@/common/utils';
import {
  TLastSeasonData,
  TSocialDataVerificationResponse,
} from '@/types';

import { httpClient } from './http-client';

export const generateRandomText = (length: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let randomText = '';

  for (let i = 0; i < length; i++) {
    const randomCharacter =
      characters[Math.floor(Math.random() * characters.length)];
    randomText += randomCharacter;
  }

  return randomText;
};

/**
 * Generates code verifier for twitter and discord connect
 * @returns code verifier
 */
const generateCodeVerifier = () => {
  const base64URLEncode = (str: string) => {
    // eslint-disable-next-line
    return str
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };
  const token = generateRandomText(64);
  return base64URLEncode(token);
};
console.log('generateCodeVerifier', generateCodeVerifier());

export const getDataVersions = async () => {
  const prodHost = 'https://content.superchamps.com';
  try {
    const { data } = await httpClient.get(
      `${prodHost}/unclassified/apps/${CONSTANTS.JRX_APP_ID}/dataVersions`,
    );
    return data;
  } catch (e) {
    console.error('Error in getDataVersions\n', e);
  }
};

export const getQuestsApi = async (
  currentVersion: number,
  newVersion: number,
) => {
  const prodHost = 'https://content.superchamps.com';
  const refVersion = newVersion;
  const q = `currentVersion=${currentVersion}&refVersion=${refVersion}&appId=${CONSTANTS.JRX_APP_ID}&platform=WEB`;
  const { data } = await httpClient.get(
    `${prodHost}/gamechallenge/countryCode/US/getChallenges?${q}`,
  );

  // set new version to localStorage
  if (data) {
    localStorage.setItem('QUESTS', JSON.stringify(data));
    localStorage.setItem('QUESTS_DATA_VERSION', data.version);
  }

  return data;
};

export const newQuestsDataVersion = async () => {
  try {
    const versions: any = await getDataVersions();
    if (
      versions.staticDataVersions.CHALLENGES !==
        parseInt(localStorage.getItem('QUESTS_DATA_VERSION') || '', 10) ||
      !localStorage.getItem('QUESTS')
    ) {
      return versions.staticDataVersions.CHALLENGES;
    }
    return false;
  } catch (e) {
    console.error('Error in getQuests\n', e);
  }
};

function injectJsonIntoNestedArray(target: any, source: any, keyPath: any[]) {
  let targetArray = target;
  for (let i = 0; i < keyPath.length - 1; i++) {
    targetArray = targetArray[keyPath[i]];
    if (!targetArray) {
      console.error(
        `The key path '${keyPath.slice(0, i + 1).join('.')}' does not exist.`,
      );
      return;
    }
  }
  if (!Array.isArray(targetArray[keyPath[keyPath.length - 1]])) {
    console.error(`The key '${keyPath.join('.')}' does not contain an array.`);
    return;
  }
  targetArray[keyPath[keyPath.length - 1]].push(source);
}

function getJsonObject(target: any, keyPath: any[]) {
  let targetArray = target;
  for (let i = 0; i < keyPath.length - 1; i++) {
    targetArray = targetArray[keyPath[i]];
    if (!targetArray) {
      console.error(
        `The key path '${keyPath.slice(0, i + 1).join('.')}' does not exist.`,
      );
      return null;
    }
  }
  return targetArray[keyPath[keyPath.length - 1]];
}

const stakedNftQuestPoints = 200;
const stakedNftDurationQuestPoints = 10;
const nftHodlSeasonData = {
  id: 10002,
  challengeType: 'regular',
  challengeName: 'HEAD START HERO',
  challengeDescription: 'Hold Genesis NFTs for more than a year',
  challengeKey: {
    challengeTask: 'headStartHodler',
    cashFlag: 'all',
    tournamentNameId: null,
    secondaryScoreIndex: null,
    gameModeOnly: false,
    secondaryParameter: '3b5UMF',
    characterType: 'BOTH',
    version: 'V1',
    tournamentType: 'all',
  },
  challengeSecondaryKey: {
    challengeTask: 'headStartHodler',
    maxProgression: 0,
    progressionForLevel: 1.0,
    maxPoints: 0,
    pointsToGainForInvite: 0,
    broadcastSourceAppIds: null,
    playStyles: null,
    champRarities: null,
    socialHandle: null,
    shouldHoldSoulBoundNft: false,
    tweetMetricFlag: null,
    tweetContent: null,
  },
  eventName: 'V1_headStartHodler_all_all_all_all_false_3b5UMF_BOTH',
  heroChallenge: false,
  challengeRedirection: 'https://opensea.io/collection/tennis-champs-genesis',
  challengeLevelsList: [
    {
      id: 72924,
      levelNo: 1,
      parameter: 1,
      giftbox: 'none',
      rewardsList: [
        {
          dailyRewardType: 'CPPoints',
          amount: 750,
          currencyCode: 'CHAMP',
          currencyType: '',
          duration: 0,
          reward: null,
        },
      ],
      adsRewards: null,
    },
  ],
  jsonLogicFilters: '',
  placementPriority: 8,
  extraTimeBeforeStart: 0,
  challengesUiMetaData: {
    infoPopup:
      'The referred user must earn 70 points in order for you to receive your points',
    ctaText: 'OPENSEA',
    placementName: 'genesis',
    sectionName: 'seasonal',
    priority: 8,
    iconUrl: 'https://assets.onjoyride.com/onjoyride.champswebCrypt/nft.png',
    caption: 'year',
  },
};
const nftOwnerSeasonData = {
  id: 10001,
  challengeType: 'regular',
  challengeName: 'GENESIS NFT OWNERS',
  challengeDescription: 'Own a Genesis NFT',
  challengeKey: {
    challengeTask: 'headStart',
    cashFlag: 'all',
    tournamentNameId: null,
    secondaryScoreIndex: null,
    gameModeOnly: false,
    secondaryParameter: '9xwmEA',
    characterType: 'BOTH',
    version: 'V1',
    tournamentType: 'all',
  },
  challengeSecondaryKey: {
    challengeTask: 'headStart',
    maxProgression: 0,
    progressionForLevel: 1.0,
    maxPoints: 0,
    pointsToGainForInvite: 0,
    broadcastSourceAppIds: null,
    playStyles: null,
    champRarities: null,
    socialHandle: null,
    shouldHoldSoulBoundNft: false,
    tweetMetricFlag: null,
    tweetContent: null,
  },
  eventName: 'V1_headStart_all_all_all_all_false_9xwmEA_BOTH',
  heroChallenge: false,
  challengeRedirection: 'https://opensea.io/collection/tennis-champs-genesis',
  challengeLevelsList: [
    {
      id: 72923,
      levelNo: 1,
      parameter: 1,
      giftbox: 'none',
      rewardsList: [
        {
          dailyRewardType: 'CPPoints',
          amount: 2000,
          currencyCode: 'CHAMP',
          currencyType: '',
          duration: 0,
          reward: null,
        },
      ],
      adsRewards: null,
    },
  ],
  jsonLogicFilters: '',
  placementPriority: 7,
  startAt: -1,
  extraTimeBeforeStart: 0,
  challengesUiMetaData: {
    infoPopup:
      'The referred user must earn 70 points in order for you to receive your points',
    ctaText: 'OPENSEA',
    placementName: 'genesis',
    sectionName: 'seasonal',
    priority: 7,
    iconUrl: 'https://assets.onjoyride.com/onjoyride.champswebCrypt/nft.png',
    caption: 'NFT',
  },
};

const sourceStakeNftSeasonData = {
  id: 10000,
  challengeType: 'regular',
  challengeName: "STAKE 'N QUAKE",
  challengeDescription: 'Stake a Genesis NFT',
  challengeKey: {
    challengeTask: 'stakeNft',
    cashFlag: 'all',
    tournamentNameId: null,
    secondaryScoreIndex: null,
    gameModeOnly: false,
    secondaryParameter: 'b64Sig',
    characterType: 'BOTH',
    version: 'V1',
    tournamentType: 'all',
  },
  challengeSecondaryKey: {
    challengeTask: 'twitterRetweet',
    maxProgression: 0,
    progressionForLevel: 1.0,
    maxPoints: 0,
    pointsToGainForInvite: 0,
    playStyles: null,
    champRarities: null,
    socialHandle: null,
    shouldHoldSoulBoundNft: false,
    tweetMetricFlag: null,
    tweetContent: null,
  },
  eventName: 'V1_Staking_all_all_all_all_false_b64Sig_BOTH',
  heroChallenge: false,
  challengeRedirection: '#',
  challengeLevelsList: [
    {
      id: 100000,
      levelNo: 1,
      parameter: 1,
      giftbox: 'none',
      rewardsList: [
        {
          dailyRewardType: 'CPPoints',
          amount: 200,
          currencyCode: 'CHAMP',
          currencyType: '',
          duration: 0,
          reward: null,
        },
      ],
      adsRewards: null,
    },
  ],
  jsonLogicFilters: '',
  placementPriority: 30,
  extraTimeBeforeStart: 0,
  challengesUiMetaData: {
    infoPopup:
      'The referred user must earn 70 points in order for you to receive your points',
    ctaText: 'STAKE',
    placementName: 'genesis',
    sectionName: 'seasonal',
    priority: 30,
    iconUrl: 'https://assets.onjoyride.com/onjoyride.champswebCrypt/nft.png',
    caption: 'NFT',
    pointsPerDay: stakedNftDurationQuestPoints,
  },
};
export const getQuests = async (userUtmSource: string) => {
  const newVersion = await newQuestsDataVersion();
  let data;

  if (newVersion) {
    data = await getQuestsApi(
      parseInt(localStorage.getItem('QUESTS_DATA_VERSION') || '', 0),
      newVersion,
    );
  } else {
    data = JSON.parse(localStorage.getItem('QUESTS') || '');
  }

  // Inject sourceJson into the nested array at the specified key path
  const targetKeyPath = [
    'data',
    'seasonChallengeDTOList',
    0,
    'seasonChallengeList',
  ];
  injectJsonIntoNestedArray(data, sourceStakeNftSeasonData, targetKeyPath);
  const target = getJsonObject(data, targetKeyPath);
  if (target !== null) {
    if (Array.isArray(target)) {
      let hasHodlerQuest = false;
      let hasNftOwnerQuest = false;
      target.forEach((challenge) => {
        if (challenge['eventName'].includes('_headStartHodler_')) {
          hasHodlerQuest = true;
        }
        if (challenge['eventName'].includes('_headStart_')) {
          hasNftOwnerQuest = true;
        }
        if (userUtmSource?.toLowerCase() === 'pixelmon') {
          try {
            if (
              challenge['id']?.toString() === '43556' ||
              challenge['id']?.toString() === '44092' ||
              challenge['id']?.toString() === '44093'
            ) {
              challenge['challengesUiMetaData']['placementName'] = 'seasonal';
            }
          } catch (e) {
            //DO NOTHING
          }
        }
      });
      if (!hasHodlerQuest) {
        injectJsonIntoNestedArray(data, nftHodlSeasonData, targetKeyPath);
      }
      if (!hasNftOwnerQuest) {
        injectJsonIntoNestedArray(data, nftOwnerSeasonData, targetKeyPath);
      }
    }
  }

  return data;
};

export const sourceStakeNftPoints = {
  parameterProgressValue: 1.0,
  eventName: 'V1_Staking_all_all_all_all_false_b64Sig_BOTH',
  lastCompletedLevel: 1,
  lastRedeemedLevel: 1,
  challengeComplete: false,
  pointsEarned: 0.0,
  maxPoints: 0.0,
};
export const sourceNftOwnerPoints = {
  parameterProgressValue: 1.0,
  eventName: 'V1_headStart_all_all_all_all_false_9xwmEA_BOTH',
  lastCompletedLevel: 1,
  lastRedeemedLevel: 1,
  challengeComplete: false,
  pointsEarned: 0.0,
  maxPoints: 0.0,
};
export const sourceNftHodlPoints = {
  parameterProgressValue: 1.0,
  eventName: 'V1_headStartHodler_all_all_all_all_false_3b5UMF_BOTH',
  lastCompletedLevel: 1,
  lastRedeemedLevel: 1,
  challengeComplete: false,
  pointsEarned: 0.0,
  maxPoints: 0.0,
};

export const updateDailyLoginQuest = async (userId: string) => {
  await httpClient.post(
    `/gamechallenge/apps/${CONSTANTS.JRX_APP_ID}/users/${userId}/countryIso/US/updateChallengeEvent`,
    {
      platform: 'Web',
      primaryEvent: 'gameLoad',
      appId: CONSTANTS.JRX_APP_ID,
    },
  );
};

export const getUsersQuestsProgression = async (
  userId: string,
  stakedNftIdCount: number,
  userStakedNftIdData: bigint[],
) => {
  try {
    const { data } = await httpClient.get(
      `/gamechallenge/apps/${CONSTANTS.JRX_APP_ID}/users/${userId}/countryIso/US/getUserChallengeData`,
    );
    const currentDate = new Date();
    // Get the current epoch time in milliseconds
    const currentEpoch = Math.floor(currentDate.getTime() / 1000);
    sourceStakeNftPoints.pointsEarned = stakedNftIdCount * stakedNftQuestPoints;
    userStakedNftIdData.forEach((stakedTime) => {
      const duration = BigInt(currentEpoch) - stakedTime;
      const countDay = 86400;
      const days = Math.floor(Number(duration / BigInt(countDay)));
      sourceStakeNftPoints.pointsEarned += days * stakedNftDurationQuestPoints;
    });
    const targetKeyPath = ['seasonChallengeList'];
    injectJsonIntoNestedArray(data, sourceStakeNftPoints, targetKeyPath);

    const target = getJsonObject(data, targetKeyPath);
    if (target !== null) {
      if (Array.isArray(target)) {
        let hasHodlerQuest = false;
        let hasNftOwnerQuest = false;
        target.forEach((challenge) => {
          if (challenge['eventName'].includes('_headStartHodler_')) {
            hasHodlerQuest = true;
          }
          if (challenge['eventName'].includes('_headStart_')) {
            hasNftOwnerQuest = true;
          }
        });
        if (!hasHodlerQuest) {
          sourceNftHodlPoints.pointsEarned = Number(
            data['headStartPoints']['holdingTimePoints'],
          );
          injectJsonIntoNestedArray(data, sourceNftHodlPoints, targetKeyPath);
        }
        if (!hasNftOwnerQuest) {
          sourceNftOwnerPoints.pointsEarned = Number(
            data['headStartPoints']['nftPoints'],
          );
          injectJsonIntoNestedArray(data, sourceNftOwnerPoints, targetKeyPath);
        }
        if (hasHodlerQuest && hasNftOwnerQuest) {
          data['totalCp'] = data['totalCp'] + sourceStakeNftPoints.pointsEarned;
        } else {
          data['lastSeasonTotalCp'] =
            data['lastSeasonTotalCp'] +
            sourceStakeNftPoints.pointsEarned +
            sourceNftHodlPoints.pointsEarned +
            sourceNftOwnerPoints.pointsEarned;
        }
      }
    }
    // console.log('🚀 ~ user progression data along with injection:', data);
    return data;
  } catch (e) {
    console.error('Error in getUsersQuestsProgression\n', e);
  }
};

export const validateAndUpdateReferralCode = async (
  userId: string,
  paylaod: {
    nftId: string;
    referralCode: string;
  },
) => {
  try {
    /**
     * Hack for Dacheng(username) and randomnameian(referralCode)
     * https://app.superchamps.com/seasons/?r=Dacheng
     * https://app.superchamps.com/seasons/?r=randomnameian
     */
    const referralCodeParam =
      paylaod.referralCode === 'Dacheng'
        ? 'randomnameian'
        : paylaod.referralCode;
    const url = `/user-management/users/${userId}/apps/${CONSTANTS.JRX_APP_ID}/updateReferralCode`;
    const { data } = await httpClient.post(url, {
      nftId: paylaod.nftId,
      referralCode: referralCodeParam,
      platform: 'WEB',
    });
    return data;
  } catch (e) {
    console.error('Error in validateAndUpdateReferralCode\n', e);
  }
};

export const getSocialData = async (
  userId: string,
): Promise<TSocialDataVerificationResponse | undefined> => {
  try {
    const url = `/unclassified/apps/${CONSTANTS.JRX_APP_ID}/user/${userId}/socialData`;
    const { data } = await httpClient.get(url);
    return data;
  } catch (e) {
    console.error('Error in getSocialData\n', e);
  }
};

export const getLastSeasonData = async (
  userId: string,
): Promise<TLastSeasonData> => {
  try {
    const url = `/gamechallenge/apps/${CONSTANTS.JRX_APP_ID}/users/${userId}/lastSeasonData`;
    const { data } = await httpClient.get(url);
    return data;
  } catch (e) {
    console.error('Error in getLastSeasonData\n', e);
    throw e;
  }
};

export const getReferralCount = async (userId: string) => {
  try {
    const url = `/user-management/users/${userId}/referralCount`;
    const { data } = await httpClient.get(url);
    return data;
  } catch (e) {
    console.error('Error in getReferralCount\n', e);
    throw e;
  }
};
