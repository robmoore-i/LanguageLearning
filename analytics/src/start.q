\l lib/jsonrestapi.q
\l analytics.q

analyticsPort:"J"$getenv `APP_ANALYTICS_PORT

events:delete from flip `timestamp`sessionId`eventName!"pss"$/:();

.z.ws:.analytics.serveWs[`events;]

.get.serve["/events/session/:sessionId";
  .res.ok {[req]
    select from events where sessionId~\:req[`pathparams;`sessionId]}]

.jra.listen analyticsPort