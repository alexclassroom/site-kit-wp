<?php
/**
 * Conversion_TrackingTest
 *
 * @package   Google\Site_Kit
 * @copyright 2024 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Tests\Core\Conversion_Tracking;

use Google\Site_Kit\Context;
use Google\Site_Kit\Core\Conversion_Tracking\Conversion_Events_Provider;
use Google\Site_Kit\Core\Conversion_Tracking\Conversion_Tracking;
use Google\Site_Kit\Tests\Core\Conversion_Tracking\Conversion_Event_Providers\FakeConversionEventProvider;
use Google\Site_Kit\Tests\Core\Conversion_Tracking\Conversion_Event_Providers\FakeConversionEventProvider_Active;
use Google\Site_Kit\Tests\TestCase;

class Conversion_TrackingTest extends TestCase {

	/**
	 * Conversion_Tracking instance.
	 *
	 * @var Conversion_Tracking
	 */
	private $conversion_tracking;

	public function set_up() {
		parent::set_up();

		$this->conversion_tracking = new Conversion_Tracking( new Context( GOOGLESITEKIT_PLUGIN_MAIN_FILE ) );

		Conversion_Tracking::$providers = array(
			FakeConversionEventProvider::CONVERSION_EVENT_PROVIDER_SLUG        => FakeConversionEventProvider::class,
			FakeConversionEventProvider_Active::CONVERSION_EVENT_PROVIDER_SLUG => FakeConversionEventProvider_Active::class,
		);
	}

	public function tear_down() {
		parent::tear_down();

		Conversion_Tracking::$providers = array();
	}

	public function test_register() {
		$this->conversion_tracking->register();

		do_action( 'wp_enqueue_scripts' );

		$this->assertTrue( wp_script_is( 'gsk-cep-' . FakeConversionEventProvider_Active::CONVERSION_EVENT_PROVIDER_SLUG ) );

		$this->assertFalse( wp_script_is( 'gsk-cep-' . FakeConversionEventProvider::CONVERSION_EVENT_PROVIDER_SLUG ) );
	}

	public function test_get_active_conversion_event_providers() {
		$active_providers = $this->conversion_tracking->get_active_providers();

		$this->assertArrayHasKey(
			FakeConversionEventProvider_Active::CONVERSION_EVENT_PROVIDER_SLUG,
			$active_providers
		);

		$this->assertArrayNotHasKey(
			FakeConversionEventProvider::CONVERSION_EVENT_PROVIDER_SLUG,
			$active_providers
		);
	}

	/**
	 * @dataProvider data_register
	 *
	 * @param $classname
	 * @param $expected_exception
	 */
	public function test_get_active_conversion_event_providers__classnames_exceptions( $providers, $expected_exception ) {
		Conversion_Tracking::$providers = $providers;

		try {
			$this->conversion_tracking->get_active_providers();
		} catch ( \Exception $exception ) {
			if ( ! $expected_exception ) {
				$this->fail( 'No exception expected but a ' . get_class( $exception ) . ' was thrown' );
			}
			$this->assertEquals( $expected_exception, $exception->getMessage() );
		}
	}

	public function data_register() {
		$exception_no_classname     = 'A conversion event provider class name is required to instantiate a provider: test-provider';
		$exception_not_extends_base = sprintf( "The '%s' class must extend the base conversion event provider class: %s", __CLASS__, Conversion_Events_Provider::class );

		return array(
			'no class name'                     => array( array( 'test-provider' => '' ), $exception_no_classname ),
			'non-existent class name'           => array( array( 'foo-bar' => '\\Foo\\Bar' ), "The '\\Foo\\Bar' class does not exist" ),
			'existing class not-extending base' => array( array( 'test-provider' => __CLASS__ ), $exception_not_extends_base ),
		);
	}
}
