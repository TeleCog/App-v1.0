angular.module('opentok', [])

.directive('opentokContainer', function ($rootScope) {
    var updateViews = function () {
        var publisherDiv, subscriberDiv;

        publisherDiv = document.getElementById('opentok-publisher');
        publisherDiv.style.width = Math.floor(Math.min(document.height, document.width) * 0.30) + 'px';
        publisherDiv.style.height = publisherDiv.style.width;

        subscriberDiv = document.getElementsByClassName('opentok-subscriber')[0];
        if (subscriberDiv.style) {
            subscriberDiv.style.width = document.width + 'px';
            subscriberDiv.style.height = document.height + 'px';
        }

        TB.updateViews();
    },

    link = function (scope, element, attrs) {
        var publisher, session;

        $rootScope.$broadcast('opentokLoading');

        scope.$evalAsync(function () {
            publisher = TB.initPublisher("44851592", 'opentok-publisher', {height: 300, width: 300});
            session = TB.initSession("44851592", "2_MX40NDg1MTU5Mn5-V2VkIEp1biAxOCAxODoyNDoxMSBQRFQgMjAxNH4wLjQ0NzQ2MzYzfn4");

            session.on({
                'streamCreated': function (event) {
                    var div = document.getElementsByClassName('opentok-subscriber')[0];
                    div.id = 'stream' + event.stream.streamId;
                    session.subscribe(event.stream, div.id, {subscribeToAudio: true});
                    div.className += ' opentok-subscriber';
                }
            });
            session.connect("T1==cGFydG5lcl9pZD00NDg1MTU5MiZzaWc9MzFjNjk4NDExNDgyYjY2YzQ1N2IyNzliNWQ5MDk5MWM1MGEyOGJhNzpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTJfTVg0ME5EZzFNVFU1TW41LVYyVmtJRXAxYmlBeE9DQXhPRG95TkRveE1TQlFSRlFnTWpBeE5INHdMalEwTnpRMk16WXpmbjQmY3JlYXRlX3RpbWU9MTQwMzE0MTA1NyZub25jZT0wLjc3ODY1NzMyNzUxMDQ5MiZleHBpcmVfdGltZT0xNDA1NzMzMDQz", function () {
                session.publish(publisher);
            });

            updateViews();

            $rootScope.$broadcast('opentokLoaded');
            document.addEventListener("orientationchange", updateViews);
        });
    };

    return {
        restrict: 'E',
        template: '<div id="opentok-publisher"></div><div class="opentok-subscribers"><div class="opentok-subscriber"></div></div>',
        link: link
    };
});
