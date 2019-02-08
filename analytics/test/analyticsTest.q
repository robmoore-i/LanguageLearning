\l lib/termcolour.q
\l lib/qtest.q
\l lib/assertq.q

\l ../src/analytics.q

.qtest.test["Saves incoming event to the events table";{
    events::delete from enlist `timestamp`eventName!"zs"$/:();

    .analytics.recordEvent[`events;"Home->Courses"];

    .assert.equal["Home->Courses";events[0;`eventName]];}]

.qtest.testWithCleanup["Write events to disk";
    {
        timestamps:(2019.02.08D09:34:20.175025000;2019.02.08D09:34:21.175025000;2019.02.08D09:34:22.175025000);
        eventNames:("event-1";"event-2";"event-3");
        events::flip `timestamp`eventName!(timestamps;eventNames);

        .analytics.persistEvents[`events;`:testEvents.csv];

        testEventsText:read0 `:testEvents.csv;
        .assert.equal["timestamp,eventName";testEventsText 0];
        .assert.equal["2019-02-08D09:34:20.175025000,event-1";testEventsText 1];
        .assert.equal["2019-02-08D09:34:21.175025000,event-2";testEventsText 2];
        .assert.equal["2019-02-08D09:34:22.175025000,event-3";testEventsText 3];
    };{
        if[`:testEvents.csv~key `:testEvents.csv;hdel `:testEvents.csv];
    }]

exit .qtest.report[]