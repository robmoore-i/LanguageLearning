\d .analytics

recordEvent:{[events;eventName]
    events insert `timestamp`eventName!(.z.P;eventName)}

persistEvents:{[events;csvfilehandle]
    csvfilehandle 0: .h.tx[`csv;value events]}
