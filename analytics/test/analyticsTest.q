\l lib/termcolour.q
\l lib/qtest.q
\l lib/assertq.q

\l ../src/analytics.q

.qtest.test["Saves incoming event to the events table";{
    events::delete from enlist `timestamp`eventName!"zs"$/:();

    .analytics.recordEvent[`events;"Home->Courses"];

    .assert.equal["Home->Courses";events[0;`eventName]];}]

exit .qtest.report[]