import BottomSheet from '@/components/elements/BottomSheet';
import BottomSheetContents from '@/components/layouts/BottomSheetContents';
import { DataPersistKeys, useDataPersist } from '@/hooks';
import useColorScheme from '@/hooks/useColorScheme';
import Provider from '@/providers';
import { fetchUser } from '@/services';
import { useAppSlice } from '@/slices';
import { colors, loadFonts, loadImages } from '@/theme';
import { User } from '@/types';
import { Slot, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Fragment, useEffect, useState } from 'react';

// keep the splash screen visible while complete fetching resources
SplashScreen.preventAutoHideAsync();

function Router() {
  const router = useRouter();
  const { isDark } = useColorScheme();
  const { dispatch, setUser, setLoggedIn } = useAppSlice();
  const { setPersistData, getPersistData } = useDataPersist();
  const [isOpen, setOpen] = useState(false);

  /**
   * preload assets and user info
   */
  useEffect(() => {
    async function preload() {
      try {
        // preload assets
        await Promise.all([loadImages(), loadFonts()]);

        // fetch & store user data to store (fake promise function to simulate async function)
        const user = await fetchUser();
        dispatch(setUser(user));
        dispatch(setLoggedIn(!!user));
        if (user) setPersistData<User>(DataPersistKeys.USER, user);

        // hide splash screen
        SplashScreen.hideAsync();
        setOpen(true);
      } catch {
        // if preload failed, try to get user data from persistent storage
        getPersistData<User>(DataPersistKeys.USER)
          .then(user => {
            if (user) dispatch(setUser(user));
            dispatch(setLoggedIn(!!user));
          })
          .finally(() => {
            // hide splash screen
            SplashScreen.hideAsync();

            // show bottom sheet
            setOpen(true);
          });
      }
    }
    preload();
  }, []);

  // navigate to app
  useEffect(() => {
    router.push('/(main)/home');
  }, [router]);

  return (
    <Fragment>
      <Slot />
      <StatusBar style="light" />
      <BottomSheet
        isOpen={isOpen}
        initialOpen
        backgroundStyle={isDark && { backgroundColor: colors.common.black }}>
        <BottomSheetContents onClose={() => setOpen(false)} />
      </BottomSheet>
    </Fragment>
  );
}

export default function RootLayout() {
  return (
    <Provider>
      <Router />
    </Provider>
  );
}
