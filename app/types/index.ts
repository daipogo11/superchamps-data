import { EChallengType } from "@/common/constants";

export enum QUEST_TYPE {
    INVITE = 'invite',
    INVITE_GAIN = 'inviteAndGainPoints',
    KYC = 'kyc',
    SOUL_BOUND_NFT = 'soulBoundNft',
    COLLECT_CHAMNP = 'collectChamp',
    VALIDATE = 'validate',
    SPECIAL_EVENTS = 'SpecialEvents',
    CONNECT_DISCORD = 'discordVerifyRole',
    DISCORD_VERIFY_MULTIPLE_ROLES = 'discordVerifyMultipleRoles',
    TWITTER_RETWEET = 'twitterRetweet',
    TWITTER_FOLLOW = 'twitterFollowUser',
    TWITTER_LIKE = 'twitterLikeTweet',
    TWITTER_REQUOTE = 'twitterRequoteTweet',
    TWITTER_TWEET_METRICS = 'twitterTweetMetrics',
    SOCIAL_ACTIVITY = 'completeSocialActivity',
    BL_APP = 'Bullet_League_App',
    RR_APP = 'Racket_Rampage_App',
    STAKE_NFT = 'stakeNft',
  }

export type TSeason = {
  id: number;
  appId: string;
  currency: string;
  duration: number;
  extraTimeAfterEnd: number;
  seasonChallengeName: string;
  extraTimeBeforeStart: number;
  startAt: number;
  nextStartAt: number;
  rewardsCollectionBuffer: number;
  seasonChallengeStatus: string;
  seasonChallengeList: TTask[];
  dailyChallengeList: Array<TTask[]>;
  lifetimeChallengeList: TTask[];
};

export type TTask = {
  id: number;
  challengeName: string;
  challengeType: string;
  challengeDescription: string;
  challengeRedirection: QUEST_TYPE | string;
  challengeKey: {
    challengeTask: string;
  };
  challengeLevelsList: {
    id: number;
    levelNo: number;
    parameter: number;
    giftbox: string;
    rewardsList: {
      dailyRewardType: string;
      amount: number;
      currencyCode: string;
      currencyType: string;
      duration: number;
      reward: any;
    }[];
  }[];
  challengeSecondaryKey: {
    roleId: string;
    guildId: string;
    challengeTask: string;
    maxPoints: number;
    maxProgression: number;
    progressionForLevel: number;
    shouldHoldSoulBoundNft: boolean;
    socialHandle: string;
    socialActivityType: string;
    orderedRoleIdsList: string[];
    maxClaimableUsers: number;
  };
  challengesUiMetaData: {
    ctaText: string;
    priority: number;
    iconUrl?: string;
    caption?: string;
    infoPopup?: string;
    sectionName: string;
    placementName: string;
    enableMultipleCTALinks?: boolean;
    enableAddingReferralCodeInCTALink?: boolean;
    ctaLinks?: string;
    pointsPerDay?: number; // only added for Staked NFTs quest from FE
    discordRoles?: string[];
    labels?: string[];
  };
  eventName: string;
  placementPriority: number;
  startAt?: number;
  duration?: number;
  extraTimeBeforeStart?: number;
  extraTimeAfterEnd?: number;
  category?: EChallengType;
  userProgression?: TQuestProgression;
};

export type TQuestProgression = {
  parameterProgressValue: number;
  eventName: string;
  lastCompletedLevel: number;
  lastRedeemedLevel: number;
  challengeComplete: boolean;
  pointsEarned: number;
  totalUserClaimed: number;
  maxPoints: number;
};

export type TUserProgression = {
  userId: string;
  seasonChallengeName: string;
  seasonId: number;
  appId: string;
  currency: string;
  totalCp: number;
  lastSeasonTotalCp: number;
  challengeMultiplierData: {
    perNftMultiplierPercentage: number;
  };
  nftMultiplierPercentage: number;
  dailyChallengeList: TQuestProgression[][];
  seasonChallengeList: TQuestProgression[];
  lifetimeChallengeList: TQuestProgression[];
  headStartPoints?: {
    nftPoints: number;
    holdingTimePoints: number;
    totalNft: number;
  };
  refereeHeadStartPoints?: number;
  thirdPartyHeadStartPoints?: {
    userId: string;
    rewardData: {
      Neo?: number;
    };
    totalPoints: number;
  };
  // globalTotalPoints: number;
  // lastCompletedMilestone: number;
  // lastRedeemedMilestone: number;
  // unclaimedMilestones: null,
  // claimedMilestonesData: {
  //   claimedRegularMilestones: null;
  //   claimedPremiumMilestones: null;
  // };
  // battlePassStatus: number;
  // kickOffQuestsList: [];
  // kickOffCompleted: boolean;
  // dailyQuestsUnlocked: boolean;
  // seasonUnlocked: boolean;
  // seasonQuestUnlockLevel: number;
  // dailyQuestUnlockLevel: number;
};

export type TSocialDataVerificationResponse = {
  id: number;
  userId: string;
  twitterId: string;
  discordId: string;
  kycStatus: string;
};

export enum EDiscordVerificationTaskType {
  VERIFY_ROLE = 'VERIFY_ROLE',
}

export enum SeasonStateEnum {
  PRE_SEASON = 'PRE_SEASON',
  IN_SEASON = 'IN_SEASON',
  BUFFER_TIME = 'BUFFER_TIME',
  SUBMITTING = 'SUBMITTING',
  CLAIM_WINDOW = 'CLAIM_WINDOW',
}

export enum ETwitterTaskType {
  ACCOUNT_FOLLOW = 'ACCOUNT_FOLLOW',
  TWEET_LIKE = 'TWEET_LIKE',
  TWEET_RETWEET = 'TWEET_RETWEET',
  TWEET_REQUOTE = 'TWEET_REQUOTE',
  TWEET_METRICS_DATA = 'TWEET_METRICS_DATA',
}

export type TLastSeasonData = {
  blockchainContractId: number;
  seasonName: string;
  seasonContractStatus: string;
};

export type TClaimData = {
  blockchainContractId: number | null;
  seasonName: string | null;
  seasonContractStatus: string | null;
  poolAmount?: number;
  claimEndTime?: number;
  claimAmount?: number;
};

export type TStakeModal = {
  show: boolean;
  type: 'stake' | 'unstake';
};
