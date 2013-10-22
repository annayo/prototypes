New Relic Setup
================================================

1. Create a New Relic account
-----------------------------
* Visit <http://newrelic.com/joyent> to signup for a free Standard account
* Verify account via Email that is sent to you

2. Find Your License Key
-----------------------------
* Login to New Relic's web UI
* Click Account Settings at the top
* License key is visible in the right sidebar

3. Generate Config File
-----------------------------
* Install the New Relic python package via scripts/setup.sh or pip install newrelic

Generate newrelic.ini and specify your license key:

    cd deploy/newrelic
    newrelic-admin generate-config <LICENSE KEY> newrelic.ini

* Add newrelic.ini to your git repository so it can be deployed to your external servers.

Edit newrelic.ini (optional)
-----------------------------
* See **Configuration Settings** section at <https://newrelic.com/docs/python/python-agent-configuration> for options.

Staging/Development Monitoring (optional)
-----------------------------
* You can monitor your applicaton on a Staging server and have it tracked separately from Production.  By setting/exporting an environment variable called NEW_RELIC_ENVIRONMENT, New Relic will read from the appropriate section in newrelic.ini, and list this as a separate application in the New Relic web UI.

For example, to specify a Staging server:

	# Set value to production, staging, or development
	NEW_RELIC_ENVIRONMENT=staging
	...
	# Export prior to running the app server
    export NEW_RELIC_ENVIRONMENT
    ...
    exec $NEW_RELIC_ADMIN run-program $COMMAND


More Infomration
-----------------------------

* Visit the New Relic Help Center at <https://newrelic.com/docs/help> 
