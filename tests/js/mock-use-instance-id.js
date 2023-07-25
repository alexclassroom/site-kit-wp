/**
 * External dependencies
 */
import faker from 'faker';

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';

/**
 * Provides a unique, memoized ID.
 *
 * @since n.e.x.t
 *
 * @param {Object} object Object reference to create an id for. This is unused and only included for compatibility with the original `useInstanceId()`.
 * @param {string} prefix Prefix for the unique id.
 * @return {string} The unique id.
 */
function useMemoizedID( object, prefix ) {
	return useMemo( () => {
		const id = faker.datatype.uuid();
		return prefix ? `${ prefix }-${ id }` : id;
	}, [ prefix ] );
}

/**
 * Mocks the `useInstanceId()` hook.
 *
 * This is necessary to ensure that the instance IDs generated by the hook are predictable during tests.
 *
 * @since n.e.x.t
 */
export function mockUseInstanceID() {
	beforeAll( () => {
		// Note that `useInstanceId()` is a Jest spy, having been spied on in the global `@wordpress/compose` mock.
		useInstanceId.mockImplementation( useMemoizedID );
	} );

	afterAll( () => {
		useInstanceId.mockRestore();
	} );
}
