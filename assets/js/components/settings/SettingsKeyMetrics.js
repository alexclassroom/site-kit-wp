/**
 * SetupModule component.
 *
 * Site Kit by Google, Copyright 2023 Google LLC
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
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Switch } from 'googlesitekit-components';
import Data from 'googlesitekit-data';
import { CORE_USER } from '../../googlesitekit/datastore/user/constants';
import { CORE_WIDGETS } from '../../googlesitekit/widgets/datastore/constants';

const { useSelect, useDispatch } = Data;

export default function SettingsKeyMetrics() {
	const keyMetricsWidgetHidden = useSelect( ( select ) =>
		select( CORE_USER ).isKeyMetricsWidgetHidden()
	);

	const keyMetrics = useSelect( ( select ) =>
		select( CORE_WIDGETS ).getKeyMetrics()
	);

	const { setKeyMetricSetting, saveKeyMetricsSettings } =
		useDispatch( CORE_USER );

	const handleKeyMetricsToggle = useCallback( async () => {
		await setKeyMetricSetting( 'isWidgetHidden', ! keyMetricsWidgetHidden );
		await saveKeyMetricsSettings();
	}, [
		keyMetricsWidgetHidden,
		saveKeyMetricsSettings,
		setKeyMetricSetting,
	] );

	if ( ! keyMetricsWidgetHidden === undefined || ! keyMetrics?.length ) {
		return null;
	}

	return (
		<Switch
			label={ __(
				'Display key metrics in dashboard',
				'google-site-kit'
			) }
			checked={ ! keyMetricsWidgetHidden }
			onClick={ handleKeyMetricsToggle }
			hideLabel={ false }
		/>
	);
}
