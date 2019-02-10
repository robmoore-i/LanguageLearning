\l lib/termcolour.q
\l lib/qtest.q
\l lib/assertq.q

\l ../src/analytics.q

.qtest.testWithCleanup["Write events to disk";
    {
        timestamps:(2019.02.08D09:34:20.175025000;2019.02.08D09:34:21.175025000;2019.02.08D09:34:22.175025000);
        sessionIds:("sid-1";"sid-2";"sid-3");
        eventNames:("event-1";"event-2";"event-3");
        events::flip `timestamp`sessionId`eventName!(timestamps;sessionIds;eventNames);

        .analytics.persistEvents[`events;`:testEvents.csv];

        testEventsText:read0 `:testEvents.csv;
        .assert.equal["timestamp,sessionId,eventName";testEventsText 0];
        .assert.equal["2019-02-08D09:34:20.175025000,sid-1,event-1";testEventsText 1];
        .assert.equal["2019-02-08D09:34:21.175025000,sid-2,event-2";testEventsText 2];
        .assert.equal["2019-02-08D09:34:22.175025000,sid-3,event-3";testEventsText 3];
    };{
        if[`:testEvents.csv~key `:testEvents.csv;hdel `:testEvents.csv];
    }]

.qtest.test["Upserts event to its events table.";{
    events::delete from enlist `timestamp`sessionId`eventName!"zss"$/:();
    
    .analytics.handleEventMessage[{};`events;"1549828795738;sid;event"];

    .assert.equal[2019.02.10D13:36:56.000001664;events[0;`timestamp]];
    .assert.equal["sid";events[0;`sessionId]];
    .assert.equal["event";events[0;`eventName]];
    .assert.equal[1;count events];}]

exit .qtest.report[]