/**
 * PreviewGraph component.
 *
 * Site Kit by Google, Copyright 2022 Google LLC
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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import UpArrow from '../../../../../../svg/icons/cta-graph-arrow-up.svg';

export default function PreviewGraph( { title, GraphSVG } ) {
	return (
		<div className="googlesitekit-analytics-cta__preview-graph">
			<h3 className="googlesitekit-analytics-cta__preview-graph--title">
				{ title }
			</h3>
			<div>
				<GraphSVG />
			</div>
			<div className="googlesitekit-analytics-cta__preview-graph--icons">
				<UpArrow className="googlesitekit-analytics-cta__preview-graph--up-arrow" />
				<span className="googlesitekit-analytics-cta__preview-graph--bar" />
			</div>
		</div>
	);
}

PreviewGraph.propTypes = {
	title: PropTypes.string.isRequired,
	GraphSVG: PropTypes.elementType.isRequired,
};
