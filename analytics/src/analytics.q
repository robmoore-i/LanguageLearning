system "p ",getenv `APP_ANALYTICS_PORT

// .z.ws:{-1 .Q.s x;neg[.z.w].Q.s x;}

\d .analytics

recordEvent:{[events;eventName]

    events insert `timestamp`eventName!(.z.P;eventName)}