import React from 'react';
import { makeSharedStateHook } from 'make-shared-state-hook';

export const useIsLoggedIn = makeSharedStateHook(React, false);
export const useUsername = makeSharedStateHook(React, null);
export const useEmail = makeSharedStateHook(React, null);
export const useUserLocation = makeSharedStateHook(React, null);
export const useToken = makeSharedStateHook(React, null);
export const useSub = makeSharedStateHook(React, null);
