import { biConstants } from '@/bi/bi-constants';
import CONSTANTS from '@/common/constants';
import { CURRENT_ENV_CURRENCY } from '@/common/constants/web3';
import { WithdrawChargesAndVIPStatusRes } from '@/common/types';
import utils, { localStorage, isBrowser } from '@/common/utils';

import packageJson from '../../package.json';

import { httpClient } from './http-client';

const ApiUser = {
  /** @description send OTP on phone during login */
  sendPhoneOtp: async (phone: string, recaptchaToken = '') => {
    try {
      const { data } = await httpClient.post(
        '/user-management/users/sendSignUpOtpOnPhoneWeb',
        {
          phone: phone,
          otpMethod: 'sms',
          locale: 'en',
          appId: CONSTANTS.JRX_APP_ID,
          platform: 'Web',
          signupMedium: 'KIWI_PHONE_OTP',
          otpLength: CONSTANTS.OTP_LENGTH,
          recaptchaToken,
        },
      );
      return data;
    } catch (e) {
      console.error('ApiUser.sendOtp error\n', e.response);
      throw e;
    }
  },

  sendEmailOtp: async (email: string, recaptchaToken = '') => {
    try {
      const { data } = await httpClient.post(
        '/user-management/users/sendSignUpOtpOnEmailWeb',
        {
          phone: email,
          otpMethod: 'mail',
          locale: 'en',
          appId: CONSTANTS.JRX_APP_ID,
          platform: 'Web',
          signupMedium: 'MAIL_OTP',
          otpLength: CONSTANTS.OTP_LENGTH,
          recaptchaToken,
        },
      );
      return data;
    } catch (e) {
      console.error('ApiUser.sendOtp error\n', e.response);
      throw e;
    }
  },

  sendSignUpOtpOnPhoneWeb: async (payload: {
    email: string;
    token: string;
  }) => {
    try {
      const { data } = await httpClient.post(
        '/user-management/users/sendSignUpOtpOnPhoneWeb/v2',
        {
          phone: payload.email,
          otpMethod: 'mail',
          locale: 'en',
          appId: CONSTANTS.JRX_APP_ID,
          platform: 'Web',
          signupMedium: 'MAIL_OTP',
          otpLength: 6,
          recaptchaToken: payload.token,
        },
      );
      return data;
    } catch (e) {
      console.error('ApiUser.sendSignUpOtpOnPhoneWeb error\n', e.response);
      throw e;
    }
  },

  /**
   * @description Create entry for an installed app. Don't use this api if you have deviceId.
   * @param osId full user agent string
   */
  getDeviceId: async (
    idForAdvertiser: string,
    idForVendor: string,
    osId: string,
  ) => {
    try {
      const { data } = await httpClient.post('/user-management/devices', {
        idForAdvertiser,
        idForVendor,
        platform: 'Web',
        osId: 'osId',
        deviceModel: 'browser', // todo set properly based on userAgent
        appId: CONSTANTS.JRX_APP_ID,
        appVersion: packageJson.version,
      });
      return data;
    } catch (e) {
      console.error('getDeviceId error\n', e);
    }
  },

  getReferralUserData: async (referralCode: string) => {
    try {
      const { data } = await httpClient.get(
        '/user-management/referralUserData/' + referralCode,
      );
      return data;
    } catch (e) {
      console.error('getReferralUserData error\n', e);
    }
  },

  getReferralProgramData: async (userId: string) => {
    try {
      const { data } = await httpClient.get(
        '/gamechallenge/users/' + userId + '/referralConfig',
      );
      return data;
    } catch (e) {
      console.error('getReferralProgramData error\n', e);
    }
  },

  /** @description authenticate phone or email OTP */
  authenticateOtp: async (
    deviceId: string,
    countryIsoCode: string,
    phoneNumber: string,
    otp: number,
    email = '',
  ) => {
    try {
      const { data } = await httpClient.post('/user-management/web/users', {
        signupMediumType: email ? 'MAIL_OTP' : 'KIWI_PHONE_OTP',
        signupMediumId: email ? email : phoneNumber,
        signupMediumData: null,
        countryIsoCode: countryIsoCode,
        authToken: otp,
        deviceId: deviceId,
        languageCode: 'en',
        appId: CONSTANTS.JRX_APP_ID,
        // currency: 'INR',
        otpMethod: email ? 'mail' : 'sms',
        bot: false,
      });
      return data;
    } catch (e) {
      console.error('ApiUser.authenticateOtp\n', e);
      throw e;
    }
  },

  authenticateOtpV2: async (payload: {
    email: string;
    otp: string;
    countryCode: string;
  }) => {
    const deviceId =
      JSON.parse(localStorage.getItem('DEVICE_DETAILS') || '')?.device?.id || 0;

    try {
      const { data } = await httpClient.post('/user-management/web/users/v2', {
        signupMediumType: 'MAIL_OTP',
        signupMediumId: payload.email,
        signupMediumData: null,
        countryIsoCode: payload.countryCode,
        authToken: payload.otp,
        deviceId,
        languageCode: 'en',
        appId: CONSTANTS.JRX_APP_ID,
        otpMethod: 'mail',
      });
      return data;
    } catch (e) {
      console.error('ApiUser.authenticateOtp\n', e);
      throw e;
    }
  },

  updateUser: async (userId: string, userObject: any) => {
    try {
      const { data } = await httpClient.patch(
        `/user-management/users/v2/${userId}?platform=Web`,
        userObject,
      );
      const user = JSON.parse(localStorage.getItem('USER_PROFILE') || '{}');
      if (user?.appUser) {
        user.appUser = userObject;
        localStorage.setItem('USER_PROFILE', JSON.stringify(user));
      }
      return data;
    } catch (e) {
      console.error('ApiUser.updateUserDetails\n', e);
      throw e;
    }
  },

  updateName: async (
    countryIsoCode: string,
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
  ) => {
    try {
      const { data } = await httpClient.patch(
        `/user-management/users/${userId}?platform=Web`,
        {
          user: {
            id: userId,
            countryIsoCode: countryIsoCode,
            firstName,
            lastName,
            email,
          },
          appId: CONSTANTS.JRX_APP_ID,
        },
      );
      return data;
    } catch (e) {
      console.error('ApiUser.updateName\n', e);
      throw e;
    }
  },

  authenticateEmail: async (userId: string, email: string, otp: string) => {
    try {
      const data = await httpClient.post(
        `/user-management/users/${userId}/signupDetail`,
        {
          signupMediumType: 'MAIL_OTP',
          signupMediumId: email,
          signupMediumData: 'string',
          authToken: otp,
          otpMethod: 'mail',
        },
      );

      return data;
    } catch (e) {
      console.error('ApiUser.authenticateEmail\n', e);
      throw e;
    }
  },

  logout: async (userId: string) => {
    try {
      const { data } = await httpClient.post(
        `/user-management/users/${userId}/logout`,
        null,
      );
      if (isBrowser()) {
        localStorage.removeItem('USERNAME_UPDATED');
        localStorage.removeItem('REFERRAL_CODE_UPDATED');
        localStorage.removeItem('TWITTER_DETAILS');
        localStorage.removeItem('TWITTER_CODE_VERIFIER');
        localStorage.removeItem('SOCIAL_DATA');
        localStorage.removeItem('QUEST_IN_PROGRESS');
        localStorage.removeItem('METAMASK_WALLET_ADDRESS');
        localStorage.removeItem('HODL_REWARD_SHOWN');
        localStorage.removeItem(biConstants.BI_LOCAL_STORAGE_KEYS.UTM_DETAILS);
      }
      return data;
    } catch (e) {
      console.error('ApiUser.logout\n', e);
      throw e;
    }
  },

  walletSummary: async (userId: string) => {
    try {
      const { data } = await httpClient.get(
        `/wallet/users/${userId}/walletSummary`,
      );
      return data;
    } catch (e) {
      console.error('ApiUser.walletSummary\n', e);
      throw e;
    }
  },

  userBlockchainAddresses: async (userId: string, blockchain: string) => {
    try {
      const { data } = await httpClient.get(
        `/wallet/users/${userId}/userBlockchainAddresses/${blockchain}`,
      );
      return data;
    } catch (e) {
      console.error('ApiUser.userBlockchainAddresses\n', e);
      throw e;
    }
  },

  loginViaBlockchain: async ({
    blockchain,
    address,
    signature,
    nonceTimeStamp,
    deviceId,
  }: {
    blockchain: string;
    address: string;
    signature: string;
    nonceTimeStamp: string;
    deviceId: number;
  }) => {
    try {
      const payload = {
        blockchain,
        appId: CONSTANTS.JRX_APP_ID,
        signature,
        address,
        appVersion: '1.0.0',
        nonceTimeStamp,
        deviceId,
      };
      const { data } = await httpClient.post(
        `/user-management/web/users/viaBlockchain`,
        payload,
      );
      return data;
    } catch (e) {
      console.error('ApiUser.loginViaBlockchain\n', e);
      throw e;
    }
  },

  linkBlockchainAddress: async (
    userId: string,
    blockchain: string,
    address: string,
    signature: string,
    nonceTimeStamp: string | null,
  ) => {
    let uri = `/wallet/users/${userId}/linkBlockchainAddress/${blockchain}/${address}/${signature}`;
    if (nonceTimeStamp) {
      uri = `${uri}?nonceTimeStamp=${nonceTimeStamp}`;
    }
    try {
      const { data } = await httpClient.post(uri, null);
      return data;
    } catch (e) {
      console.error('ApiUser.linkBlockchainAddress\n', e);
      throw e;
    }
  },

  getGameHistory: async (
    userId: string,
    currency: string,
    pageNumber: number,
    pageSize: number,
  ) => {
    try {
      const { data } = await httpClient.get(
        `/wallet/users/${userId}/v2/walletLedger?pn=${pageNumber}&ps=${pageSize}&filterForCurrency=${currency}`,
      );
      return data;
    } catch (e) {
      throw e;
    }
  },
  getTransactionHistory: async (
    userId: string,
    pageNumber: number,
    pageSize: number,
  ) => {
    try {
      let { data } = await httpClient.get(
        `/wallet/users/${userId}/flow/transaction?pn=${pageNumber}&ps=${pageSize}`,
      );
      data = data.map((tx) => {
        const copy = { ...tx };
        if (tx.status === 'Sealed') copy.status = 'Success';
        if (tx.status === 'FINALIZED') copy.status = 'Success';
        return copy;
      });
      return data;
    } catch (e) {
      throw e;
    }
  },
  getNftsForAddress: async (address: string) => {
    try {
      const { data } = await httpClient.get(
        `/wallet/getNftsForAddress/${address}`,
      );
      return data;
    } catch (e) {
      console.error('ApiUser.getNftsForAddress\n', e);
      throw e;
    }
  },

  getRewardOnMmConnection: async (userId: string) => {
    try {
      const data = await httpClient.post(
        `/wallet/apps/${CONSTANTS.JRX_APP_ID}/users/${userId}/metamaskReward`,
        null,
      );
      return data;
    } catch (e) {
      console.error('ApiUser.getRewardOnMmConnection\n', e);
      throw e;
    }
  },

  getMarketplaceListingCount: async (
    appId: string,
    userId: string,
    isStore?: boolean,
  ) => {
    try {
      const store = isStore ? 'true' : 'false';
      // character/apps/{appId}/users/{userId}/listingCount
      const { data } = await httpClient.get(
        `/character/apps/${CONSTANTS.JRX_APP_ID}/listingCount?isJoyrideMarketplace=${store}`,
        {
          params: {
            nftAppId: appId,
          },
        },
      );
      return data;
    } catch (e) {
      console.error('ApiUser.listingCount\n', e);
      throw e;
    }
  },

  getNftForMarketPlace: async (
    appId: string,
    userId: string,
    pageNumber: number,
    pageSize: number,
    isStore?: boolean,
  ) => {
    const store = isStore ? 'true' : 'false';
    try {
      // http://qa.onjoyride.com:9006/character/apps/onjoyride.champswebCrypt/users/60673a18-c143-4812-b9a7-acb7602626a1/marketplace?pn=0&ps=10&nftAppId=onjoyride.tennischamps
      // let data: any = marketPlaceList;
      // old URL: `/character/apps/${CONSTANTS.JRX_APP_ID}/users/${userId}/marketplace?pn=${pageNumber}&ps=${pageSize}&nftAppId=onjoyride.tennischamps`,
      let { data } = await httpClient.get(
        `/character/apps/${CONSTANTS.JRX_APP_ID}/marketplace?pn=${pageNumber}&ps=${pageSize}&nftAppId=onjoyride.tennischamps&isJoyrideMarketplace=${store}`,
        {
          params: {
            nftAppId: appId,
          },
        },
      );
      data = data
        .map((nft) => {
          return {
            ...nft,
            metadata: JSON.parse(nft.nft?.metadata ?? null),
          };
        })
        .map((nft) => {
          return {
            ...nft,
            metadata: {
              ...nft.metadata,
              image: nft.metadata?.image?.replace(
                'ipfs://',
                'https://onjoyride.mypinata.cloud/ipfs/',
              ),
              animation_url:
                nft.metadata && nft.metadata?.animation_url
                  ? nft.metadata.animation_url?.replace(
                      'ipfs://',
                      'https://onjoyride.mypinata.cloud/ipfs/',
                    )
                  : nft.metadata?.animation_url,
            },
          };
        })
        .map((nft) => {
          return {
            ...nft,
            metadata: {
              ...nft.metadata,
              image_url: nft.metadata.image?.replace(
                'ipfs://',
                'https://onjoyride.mypinata.cloud/ipfs/',
              ),
            },
          };
        });
      console.info('processed', data);
      return data;
    } catch (e) {
      console.error('ApiUser.getNftsForUser\n', e);
      throw e;
    }
  },

  buyNftFromMarketPlace: async (
    userId: string,
    body: any,
    currencyCode: string,
  ) => {
    try {
      const { userMarketplaceListingId, platform, buyerListingPrice } = body;
      const { data } = await httpClient.post(
        `/character/apps/${CONSTANTS.JRX_APP_ID}/users/${userId}/buyNftInJM?currency=${currencyCode}`,
        null,
        {
          params: {
            userMarketplaceListingId,
            platform,
            buyerListingPrice,
            nftAppId: body?.appId,
          },
        },
      );
      return data;
    } catch (e) {
      // errModal.openModal();
      console.error('ApiUser.buyNft\n', e);
      throw e;
    }
  },

  updateNftListingOnMarketplace: async (userId, body) => {
    try {
      const { userMarketplaceListingId, platform, price } = body;
      const { data } = await httpClient.post(
        `/character/apps/${CONSTANTS.JRX_APP_ID}/users/${userId}/updateNftListing`,
        null,
        {
          params: {
            userMarketplaceListingId,
            platform,
            price,
            nftAppId: body?.appId,
            currency: 'SLAM',
          },
        },
      );
      return data;
    } catch (e) {
      // errModal.openModal();
      console.error('ApiUser.sellNft\n', e);
      throw e;
    }
  },

  endSaleOnMarketPlace: async (userId, body) => {
    try {
      const { userMarketplaceListingId, platform } = body;
      const { data } = await httpClient.post(
        `/character/apps/${CONSTANTS.JRX_APP_ID}/users/${userId}/delistNft`,
        null,
        {
          params: {
            userMarketplaceListingId,
            platform,
            nftAppId: body?.appId,
          },
        },
      );
      return data;
    } catch (e) {
      // errModal.openModal();
      console.error('ApiUser.delistNft\n', e);
      throw e;
    }
  },

  updateNftSellOnCollectibles: async (userId, body, blockchain) => {
    try {
      const apiVersion = CONSTANTS.DISABLE_MARKETPLACE
        ? 'listNft'
        : 'listNftV1';
      const { currency, platform, price, characterId, characterType } = body;
      const { data } = await httpClient.post(
        `/character/apps/${CONSTANTS.JRX_APP_ID}/users/${userId}/${apiVersion}`,
        {
          currency,
          price,
        },
        {
          params: {
            platform,
            characterId,
            characterType,
            nftAppId: body?.appId,
            blockchain,
          },
        },
      );
      return data;
    } catch (e) {
      // errModal.openModal();
      console.error('ApiUser.sellNft\n', e);
      throw e;
    }
  },

  getNftsForUser: async (userId: string) => {
    try {
      const url = `/character/users/v2/${userId}/fetchNftsForUser?appIds=${CONSTANTS.JRX_APP_ID}&probableHoldingReward=true`;
      let { data } = await httpClient.get(url);
      data = utils.sortNfts(data.userCharacterResponseDtoList);
      // data = utils.sortNfts(data);

      // let url = `/character/users/v2/${userId}/fetchNftsForUser?appIds=${CONSTANTS.JRX_APP_ID}`;
      // if (probableHoldingReward) {
      //   url = url + '&probableHoldingReward=true';
      // }
      // let { data } = await httpClient.get(
      //   `/character/users/v2/${userId}/fetchNftsForUser?appIds=${CONSTANTS.JRX_APP_ID}&probableHoldingReward=true`,
      // );
      // data = utils.sortNfts(data.userCharacterResponseDtoList);

      data = data
        .map((nft) => {
          return {
            ...nft,
            // additionalMetadata: JSON.parse(nft.additionalMetadata),
            metadata: JSON.parse(nft.nft?.metadata ?? null),
          };
        })
        .map((nft) => {
          return {
            ...nft,
            metadata: {
              ...nft.metadata,
              image: nft.metadata?.image?.replace(
                'ipfs://',
                'https://onjoyride.mypinata.cloud/ipfs/',
              ),
              animation_url:
                nft.metadata && nft.metadata?.animation_url
                  ? nft.metadata.animation_url?.replace(
                      'ipfs://',
                      'https://onjoyride.mypinata.cloud/ipfs/',
                    )
                  : nft.metadata?.animation_url,
            },
          };
        })
        .map((nft) => {
          return {
            ...nft,
            metadata: {
              ...nft.metadata,
              image_url: nft.metadata.image?.replace(
                'ipfs://',
                'https://onjoyride.mypinata.cloud/ipfs/',
              ),
            },
          };
        });
      // console.info('processed', data);
      return data;
    } catch (e) {
      console.error('ApiUser.getNftsForUser\n', e);
      throw e;
    }
  },

  getRewardPoints: async (userId) => {
    // "http://jupiter.onjoyride.com:9006/wallet/apps/onjoyride.champswebCrypt/users/0004d6ee-f688-49e9-8f77-abb72fdfb383/staticValue?key=metamask_connection_reward"
    try {
      const { data } = await httpClient.get(
        `/wallet/apps/${CONSTANTS.JRX_APP_ID}/users/${userId}/metamaskReward`,
      );
      const formatedData = JSON.parse(data?.metamask_connection_reward);
      return formatedData;
    } catch (e) {
      console.error('ApiUser.getRewardPoints\n', e);
      throw e;
    }
  },

  /**
   * called after deposit request is submitted through MetaMask
   */
  depositSubmittedToContract: async (
    sourceChainTransactionId: string,
    userId: string,
    amount: number,
    originalAmount: number,
    type: 'CREDIT' | 'DEBIT',
    walletCurrency: string,
    sourceWalletAddress: string,
    receiver: string,
    bridgeTransactionId: string,
    status = 'PENDING',
    // event = 'string',
    currencyPlatform = 'USER_WALLET_DEPOSIT',
  ) => {
    try {
      const { data } = await httpClient.post(
        `/wallet/users/${userId}/flow/transaction`,
        {
          sourceChainTransactionId,
          userId,
          amount,
          originalAmount,
          type,
          walletCurrency,
          sourceWalletAddress,
          receiver,
          bridgeTransactionId,
          status,
          // event,
          currencyPlatform,
        },
      );
      return data;
    } catch (e) {
      console.error('ApiUser.depositSubmittedToContract\n', e);
      throw e;
    }
  },

  /**
   * send email & phone OTPs before transfer
   * @param jwToken
   * @param userId
   * @param amount
   * @param walletCurrency
   * @param destinationWalletAddress
   * @returns
   */
  sendWithdrawOtps: async (
    userId: string,
    amount: number,
    walletCurrency: string,
    destinationWalletAddress: string,
    type?: 'email' | 'sms',
  ) => {
    try {
      const response = await httpClient.post(
        `/wallet/apps/${
          CONSTANTS.JRX_APP_ID
        }/users/${userId}/token/transfer/otp/send${
          type ? `?type=${type}` : ''
        }`,
        {
          originalAmount: amount,
          walletCurrency,
          destinationWalletAddress,
        },
      );
      return response.data;
    } catch (err) {
      console.error('ApiUser.sendWithdrawOtps\n', err);
      throw err;
    }
  },

  /**
   * withdraw from one blockchain to another
   * @param jwToken
   * @param userId
   * @param amount estimated receivable amount
   * @param originalAmount user entered amount
   * @param walletCurrency
   * @param sourceWalletAddress
   * @param destinationWalletAddress
   * @param emailOtp
   * @param smsOtp
   * @param gasFee gas fees
   * @returns
   */
  withdraw: async (
    userId: string,
    amount: number,
    originalAmount: number,
    walletCurrency: string,
    sourceWalletAddress: string,
    destinationWalletAddress: string,
    emailOtp: string,
    smsOtp: string,
    gasFee: number,
    benefitsApplied: boolean,
  ) => {
    try {
      const response = await httpClient.post(
        `/wallet/users/${userId}/token/withdraw`,
        {
          amount,
          originalAmount,
          walletCurrency,
          sourceWalletAddress,
          destinationWalletAddress,
          emailOtp,
          smsOtp,
          gasFee,
          benefitsApplied,
        },
      );
      // .catch(err => {
      //   throw err
      // });
      return response.data;
    } catch (err) {
      console.error('ApiUser.withdraw\n', err);
      throw err;
    }
  },

  /**
   * withdraw processing details
   * @param userId
   * @param walletAddress dstination address
   * @param tokenSymbol
   * @param amount user entered amount
   * @returns
   */
  withdrawProcessingDetails: async (
    userId: string,
    walletAddress: string,
    amount: string,
    signal?: AbortSignal,
  ) => {
    const { data } = await httpClient.post<WithdrawChargesAndVIPStatusRes>(
      `/wallet/token/withdrawChargesAndVIPStatus?userId=${userId}&walletAddress=${walletAddress}&tokenSymbol=${CURRENT_ENV_CURRENCY}&amount=${amount}`,
      {},
      {
        headers: {
          accept: 'application/json',
        },
        signal,
      },
    );

    return data;
  },

  /**
   * @description get details about user ban
   * @param userId
   * @param token
   * @returns
   */
  getActiveUserModerationDetails: async (userId: string) => {
    try {
      const response = await httpClient.get(
        `/user-management/apps/${CONSTANTS.JRX_APP_ID}/users/${userId}/userActiveModerationData`,
        {
          headers: {
            accept: 'application/json',
          },
        },
      );
      return response.data;
    } catch (err) {
      console.error('ApiUser.getActiveUserModerationDetails\n', err);
      throw err;
    }
  },

  claimSlammerReward: async (userId: string, eventId: number) => {
    try {
      const response = await httpClient.post(
        `/character/apps/onjoyride.champswebCrypt/users/${userId}/claimNftHolderReward/${eventId}`,
        {
          headers: {
            accept: 'application/json',
          },
        },
      );
      return response.data;
    } catch (err) {
      console.error('ApiUser.claimSlammerReward\n', err);
      throw err;
    }
  },
};

export default ApiUser;
