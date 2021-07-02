/**
 * `core/user` data store: dismissed items
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import invariant from 'invariant';

/**
 * Internal dependencies
 */
import API from 'googlesitekit-api';
import Data from 'googlesitekit-data';
import { STORE_NAME } from './constants';
import { createFetchStore } from '../../data/create-fetch-store';
import { createValidatedAction } from '../../data/utils';
const { getRegistry } = Data.commonActions;

const fetchGetDismissedItemsStore = createFetchStore( {
	baseName: 'getDismissedItems',
	controlCallback: () => API.get( 'core', 'user', 'dismissed-items', {}, { useCache: false } ),
	reducerCallback: ( state, dismissedItems ) => ( { ...state, dismissedItems } ),
} );

const fetchDismissItemStore = createFetchStore( {
	baseName: 'dismissItem',
	controlCallback: ( { slug } ) => API.set( 'core', 'user', 'dismiss-item', { slug } ),
	reducerCallback: ( state, dismissedItems ) => ( { ...state, dismissedItems } ),
	argsToParams: ( slug ) => ( { slug } ),
	validateParams: ( { slug } = {} ) => {
		invariant( slug, 'slug is required.' );
	},
} );

const baseInitialState = {
	dismissedItems: undefined,
};

const baseActions = {
	/**
	 * Dismisses the given item by slug.
	 *
	 * @since n.e.x.t
	 *
	 * @param {string} slug Item slug to dismiss.
	 * @return {Object} Generator instance.
	 */
	dismissItem: createValidatedAction(
		( slug ) => {
			invariant( slug, 'A tour slug is required to dismiss a tour.' );
		},
		function* ( slug ) {
			return yield fetchDismissItemStore.actions.fetchDismissItem( slug );
		},
	),
};

const baseResolvers = {
	*getDismissedItems() {
		const { select } = yield getRegistry();
		if ( ! select( STORE_NAME ).getDismissedFeatureTourSlugs() ) {
			yield fetchGetDismissedItemsStore.actions.fetchGetDismissedItems();
		}
	},
};

const baseSelectors = {
	/**
	 * Gets the list of dismissed items.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} state Data store's state.
	 * @return {(string[]|undefined)} Array of dismissed items, `undefined` if not resolved yet.
	 */
	getDismissedItems( state ) {
		return state.dismissedItems;
	},
};

export const {
	actions,
	controls,
	initialState,
	reducer,
	resolvers,
	selectors,
} = Data.combineStores(
	{
		initialState: baseInitialState,
		actions: baseActions,
		resolvers: baseResolvers,
		selectors: baseSelectors,
	},
	fetchDismissItemStore,
	fetchGetDismissedItemsStore,
);

export default {
	actions,
	controls,
	initialState,
	reducer,
	resolvers,
	selectors,
};
