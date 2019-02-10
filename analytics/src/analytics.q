\d .analytics

recordEvent:{[events;eventName]
    events insert `timestamp`eventName!(.z.P;eventName)}

persistEvents:{[events;csvfilehandle]
    csvfilehandle 0: .h.tx[`csv;value events]}

dateFromUnixTimestamp:{"p"$(10 xexp 9)*(neg 30*31556926)+`long$0.001*"J"$x}

serveWs:{[events;msg]
    expandedMsg:";" vs msg;
    timestamp:dateFromUnixTimestamp  expandedMsg 0;
    record:`timestamp`sessionId`eventName!(timestamp;expandedMsg 1;expandedMsg 2);
    events upsert record;
    neg[.z.w] "success";}