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
            publisher = TB.initPublisher("44903192", 'opentok-publisher', {height: 300, width: 300});
            session = TB.initSession("44903192", "1_MX40NDkwMzE5Mn5-VGh1IEp1bCAxNyAxMDowMjoyNCBQRFQgMjAxNH4wLjEyNDU0NTc1fn4");

            session.on({
                'streamCreated': function (event) {
                    var div = document.getElementsByClassName('opentok-subscriber')[0];
                    div.id = 'stream' + event.stream.streamId;
                    session.subscribe(event.stream, div.id, {subscribeToAudio: true});
                    div.className += ' opentok-subscriber';
                }
            });
            session.connect("T1==cGFydG5lcl9pZD00NDkwMzE5MiZzaWc9NDllY2NhM2EyOThkMmE2MTNkNjA0NmRkMDE5NDZlZWZlZDU0ZjA5Zjpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTFfTVg0ME5Ea3dNekU1TW41LVZHaDFJRXAxYkNBeE55QXhNRG93TWpveU5DQlFSRlFnTWpBeE5INHdMakV5TkRVME5UYzFmbjQmY3JlYXRlX3RpbWU9MTQwNTYxNjU3NCZub25jZT0wLjIxMjgyNTY1NDQ4OTkwODc2JmV4cGlyZV90aW1lPTE0MDgyMDg0NTc=", function () {
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
