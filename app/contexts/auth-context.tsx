import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import CONSTANTS from '@/common/constants';
import { User } from '@/types';
import {
  getCurrentTabForBi,
  getSeasonStartTime,
  isBrowser,
  localStorage,
} from '@/common/utils';
const checkAllowance = (path: string) => {
  if (path.includes('verify') || path.includes('login')) return true;
  return false;
};

type AuthContextType = {
  user: User | null;
  step: TAuthStep;
  setStep: React.Dispatch<React.SetStateAction<TAuthStep>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userStakedNftIds: bigint[];
  setUserStakedNftIds: React.Dispatch<React.SetStateAction<bigint[]>>;
  userStakedNftIdData: bigint[];
  setUserStakedNftIdData: React.Dispatch<React.SetStateAction<bigint[]>>;
  showLogin: boolean;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
  initialSearchParamsRef: React.MutableRefObject<URLSearchParams>;
  authData: any;
  setAuthData: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  socialData: any;
  setSocialData: React.Dispatch<React.SetStateAction<any>>;
  fetchSocialData: () => any;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
};

export type TAuthStep =
  | 'login'
  | 'signup'
  | 'verify'
  | 'connect'
  | 'signup-link'
  | 'flagged'
  | 'unsupported';

const AuthContext = createContext({} as AuthContextType);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useLocalStorageState<User | null>(
    biConstants.BI_LOCAL_STORAGE_KEYS.USER_PROFILE,
    {
      defaultValue: null,
    },
  );
  const [userStakedNftIds, setUserStakedNftIds] = useState<bigint[]>([]);
  const [userStakedNftIdData, setUserStakedNftIdData] = useState<any[]>([]);
  const [step, setStep] = useState<TAuthStep>('login');
  const [authData, setAuthData] = useState<any>({});
  const [email, setEmail] = useState<string>('');

  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [socialData, setSocialData] = useState<any>({});
  const loc = useLocation();

  const [metaMaskWallets, setMetaMaskWallets] = useLocalStorageState(
    // can be removed
    CONSTANTS.LOCAL_STORAGE_KEYS.METAMASK_WALLET_ADDRESS,
    {
      defaultValue: [],
    },
  );
  const initialSearchParamsRef = useRef(
    new URLSearchParams(isBrowser() ? window.location.search : ''),
  );

  const fetchSocialData = useCallback(async () => {
    if (!user?.appUser.user.id) return;
    try {
      const data = await getSocialData(user?.appUser.user.id);
      localStorage.setItem('SOCIAL_DATA', JSON.stringify(data));
      setSocialData(data);
      return data;
    } catch (e) {
      console.error('Error in fetchSocialData \n', e);
    }
  }, [user]);

  // SETS USER WHEN ACTIVE USER IS DETECTED
  useEffect(() => {
    const url = loc?.pathname;
    const searchParams = new URLSearchParams(
      isBrowser() ? window.location.search : '',
    );

    if (!user && !checkAllowance(url)) {
      console.info(
        '%c auth redirection to /login',
        CONSTANTS.LOG_STYLES.REDIRECTION,
      );
      Sentry.setUser(null);
      // navigate(`/login/?${searchParams.toString()}`);
      // return;
    }

    Sentry.setUser({ id: user?.appUser?.user?.id });
    if (
      user &&
      !user.appUser.user.email &&
      !url.includes('verify') &&
      !url.includes('login')
    ) {
      console.info(
        '%c auth redirection to /signup',
        CONSTANTS.LOG_STYLES.REDIRECTION,
      );
      navigate(`/signup/?${searchParams.toString()}`);
    }
  }, [user, loc.pathname]);

  useEffect(() => {
    if (user) {
      fetchSocialData();
    }
    // eslint-disable-next-line
  }, [user]);

  // BI view events for login/sign up flows
  useEffect(() => {
    if (showLogin) {
      switch (step) {
        case 'login':
          loginBiEvents.view({
            str_field1: 'login_screen',
            str_field3: getCurrentTabForBi(),
            int_field0: getSeasonStartTime(),
          });
          break;
        case 'signup':
          break;
        default:
          break;
      }
    }
  }, [step, showLogin]);

  const memoizedValue = useMemo(
    () => ({
      user,
      step,
      setUser,
      setStep,
      userStakedNftIds,
      setUserStakedNftIds,
      userStakedNftIdData,
      setUserStakedNftIdData,
      authData,
      showLogin,
      isLoading,
      socialData,
      setAuthData,
      setShowLogin,
      setIsLoading,
      setSocialData,
      fetchSocialData,
      metaMaskWallets,
      setMetaMaskWallets,
      initialSearchParamsRef,
      email,
      setEmail,
    }),
    [
      user,
      step,
      setUser,
      setStep,
      userStakedNftIds,
      setUserStakedNftIds,
      userStakedNftIdData,
      setUserStakedNftIdData,
      authData,
      isLoading,
      showLogin,
      socialData,
      setAuthData,
      setIsLoading,
      setShowLogin,
      setSocialData,
      fetchSocialData,
      metaMaskWallets,
      setMetaMaskWallets,
      initialSearchParamsRef,
      email,
      setEmail,
    ],
  );

  // IF NO USER REDIRECT TO LOGIN PAGE
  // to be uncommented when want to ensure user should not leave login page if not authorised
  // if (!active && !user) return <RingLoader />;

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
export { AuthContext };
export const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
