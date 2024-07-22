import moment from 'moment-timezone';
import React, {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  getQuests,
  getUsersQuestsProgression,
  updateDailyLoginQuest,
} from '@/api/quests';
import utils from '@/common/utils';
import {
  TTask,
  TSeason,
  TStakeModal,
  SeasonStateEnum,
  TUserProgression,
} from '@/types';

import { useAuth } from './auth-context';

export interface ISuperChampsContext {
  season: TSeason | undefined;
  setSeason: Dispatch<SetStateAction<TSeason | undefined>>;
  seasonState: SeasonStateEnum | undefined;
  setSeasonState: Dispatch<SetStateAction<SeasonStateEnum | undefined>>;
  getSeasonState: () => void;
  isSeasonLoading: boolean;
  setIsSeasonLoading: Dispatch<SetStateAction<boolean>>;
  userProgression: TUserProgression | undefined;
  setUserProgression: Dispatch<SetStateAction<TUserProgression | undefined>>;
  getUserQuestsData: () => void;
  completedQuestsCount: (dayIndex: number) => {
    daily: number;
    seasonal: number;
  };
  twitterMetricTask: TTask | null;
  setTwitterMetricTask: Dispatch<SetStateAction<TTask | null>>;
  stakeModal: TStakeModal;
  setStakeModal: Dispatch<SetStateAction<TStakeModal>>;
  showStakingRewards: boolean;
  setShowStakingRewards: Dispatch<SetStateAction<boolean>>;
  currentQuest: MutableRefObject<TTask | null>;
  thirdPartyPoints: number | undefined;
  setThirdPartyPoints: Dispatch<SetStateAction<number | undefined>>;
  userUtmSource: string;
  setUserUtmSource: Dispatch<SetStateAction<string>>;
}
const SuperChampsContext = createContext({} as ISuperChampsContext);

const SuperChampsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, userStakedNftIds, userStakedNftIdData } = useAuth();
  const [season, setSeason] = useState<TSeason | undefined>();
  const [stakeModal, setStakeModal] = useState<TStakeModal>({
    show: false,
    type: 'stake',
  });
  const [showStakingRewards, setShowStakingRewards] = useState<boolean>(false);
  const [seasonState, setSeasonState] = useState<SeasonStateEnum>();
  const [isSeasonLoading, setIsSeasonLoading] = useState(true);
  const [userProgression, setUserProgression] = useState<
    TUserProgression | undefined
  >();
  const [userUtmSource, setUserUtmSource] = useState<string>('organic');

  const [twitterMetricTask, setTwitterMetricTask] = useState<TTask | null>(
    null,
  );
  const currentQuest = useRef<TTask | null>(null);
  const [thirdPartyPoints, setThirdPartyPoints] = useState<number | undefined>(
    undefined,
  );

  /**
   * Gets active season from all the seasons
   * @param seasons {TSeason[]} - all seasons
   */
  const getActiveSeason = (seasons: TSeason[]): TSeason | undefined => {
    const now = moment().unix();
    const activeSeason = seasons.find((s) => {
      const preSeasonTime = moment(
        (s.startAt - s.extraTimeBeforeStart) * 1000,
      ).unix();
      const submittingStartTime = moment(
        (s.startAt + s.duration + s.rewardsCollectionBuffer) * 1000,
      ).unix();

      // season between before start time till submitting start time is active
      return now > preSeasonTime && now < submittingStartTime;
    });
    return activeSeason;
  };

  const getSeasonState = useCallback(() => {
    if (season) {
      const start = moment(season.startAt * 1000).unix();
      const end = moment((season.startAt + season.duration) * 1000).unix();
      // rewardsCollectionBuffer
      const preSeasonTime = moment(
        (season.startAt - season.extraTimeBeforeStart) * 1000,
      ).unix();
      const submittingStartTime = moment(
        (season.startAt + season.duration + season.rewardsCollectionBuffer) *
          1000,
      ).unix();
      const now = moment().unix();
      if (now >= preSeasonTime && now < start) {
        setSeasonState(SeasonStateEnum.PRE_SEASON);
      } else if (now >= start && now <= end) {
        setSeasonState(SeasonStateEnum.IN_SEASON);
      } else if (now >= end && now < submittingStartTime) {
        setSeasonState(SeasonStateEnum.BUFFER_TIME);
      } else if (now >= submittingStartTime) {
        // once season comes to this state, it won't be visible as its not
        // considered as active (kind of a waste state as of now)
        setSeasonState(SeasonStateEnum.SUBMITTING);
      }
    }
  }, [season]);

  const getUserQuestsData = useCallback(async () => {
    if (user) {
      const data: TUserProgression = await getUsersQuestsProgression(
        user.appUser.user.id,
        userStakedNftIds.length,
        userStakedNftIdData,
      );
      if (data && thirdPartyPoints) {
        //console.log('thirdPartyPoints', thirdPartyPoints);
        data.totalCp += thirdPartyPoints;
        if (data.thirdPartyHeadStartPoints) {
          data.thirdPartyHeadStartPoints.totalPoints = thirdPartyPoints;
        } else {
          data.thirdPartyHeadStartPoints = {
            userId: '',
            totalPoints: thirdPartyPoints,
            rewardData: {},
          };
        }
      }
      setUserProgression(data);
    }
    return null;
  }, [user, userStakedNftIds]);

  const updateDailyLoginQuests = useCallback(async () => {
    if (user) {
      await updateDailyLoginQuest(user.appUser.user.id);
    }
    return null;
  }, [user]);

  const refreshQuests = async () => {
    const loader = utils.el('quests-loader');
    if (loader) {
      loader.classList.add('show');
    }
    setIsSeasonLoading(true);
    try {
      const data = await getQuests(userUtmSource);
      // TODO: loop through and get active season and not null
      // (which can only be in PRE_SEASON/IN_SEASON/SUBMITTING states)
      const seasonData: TSeason | undefined = getActiveSeason(
        data.data.seasonChallengeDTOList,
      );
      // const seasonData: TSeason | undefined = undefined;
      if (seasonData) {
        setSeason(seasonData);
      }
    } catch (e) {
      console.error('Error in refreshQuests\n', e);
    }
    setIsSeasonLoading(false);
    if (loader) {
      loader.classList.remove('show');
    }
  };

  const completedQuestsCount = useCallback(
    (dayIndex: number) => {
      const seasonal: number =
        userProgression?.seasonChallengeList.filter((q) => q.challengeComplete)
          .length || 0;
      const daily: number =
        userProgression?.dailyChallengeList[dayIndex]?.filter(
          (q) => q.challengeComplete,
        ).length || 0;
      return { daily, seasonal };
    },
    [userProgression],
  );

  useEffect(() => {
    console.log('refreshQuests');
    refreshQuests();
    // eslint-disable-next-line
  }, [userUtmSource]);

  useEffect(() => {
    try {
      const utmDetailsVal = JSON.parse(
        localStorage.getItem('UTM_DETAILS') ||
          '{}',
      );
      if (utmDetailsVal && utmDetailsVal['utm_source']) {
        setUserUtmSource(utmDetailsVal['utm_source']);
      }
    } catch (e) {
      //DO NOTHING
    }
  }, []);

  useEffect(() => {
    getSeasonState();
    // eslint-disable-next-line
  }, [season]);

  useEffect(() => {
    getUserQuestsData();
    // eslint-disable-next-line
  }, [user, userStakedNftIds]);

  useEffect(() => {
    updateDailyLoginQuests();
  }, [user]);

  // resetting season details and refecthing the quests on reaching submitting state
  useEffect(() => {
    if (seasonState === SeasonStateEnum.SUBMITTING) {
      setSeason(undefined);
      setSeasonState(undefined);
      refreshQuests();
    }
    // eslint-disable-next-line
  }, [seasonState]);

  const memoizedValue = useMemo(
    () => ({
      season,
      setSeason,
      seasonState,
      setSeasonState,
      isSeasonLoading,
      setIsSeasonLoading,
      getSeasonState,
      userProgression,
      setUserProgression,
      getUserQuestsData,
      completedQuestsCount,
      twitterMetricTask,
      setTwitterMetricTask,
      stakeModal,
      setStakeModal,
      showStakingRewards,
      setShowStakingRewards,
      currentQuest,
      thirdPartyPoints,
      setThirdPartyPoints,
      userUtmSource,
      setUserUtmSource,
    }),
    [
      season,
      setSeason,
      seasonState,
      setSeasonState,
      isSeasonLoading,
      setIsSeasonLoading,
      getSeasonState,
      userProgression,
      setUserProgression,
      getUserQuestsData,
      completedQuestsCount,
      twitterMetricTask,
      setTwitterMetricTask,
      stakeModal,
      setStakeModal,
      showStakingRewards,
      setShowStakingRewards,
      currentQuest,
      thirdPartyPoints,
      setThirdPartyPoints,
      userUtmSource,
      setUserUtmSource,
    ],
  );

  return (
    <SuperChampsContext.Provider value={memoizedValue}>
      {children}
    </SuperChampsContext.Provider>
  );
};

export const useSuperChampsContext = () => useContext(SuperChampsContext);
export default SuperChampsProvider;
export { SuperChampsContext };
