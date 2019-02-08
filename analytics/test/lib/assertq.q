\d .assert

indentedString:{"\n\t\t\t",ssr[.Q.s x;"\n";"\n\t\t\t"]}

equal:{[expected;actual]
    if[expected~actual; :1b];
    .termcolour.red "\n  Assertion failed: .assert.equal";
    .termcolour.red "\tExpected:   ",indentedString expected;
    .termcolour.red "\tWith type:  ",string type expected;
    .termcolour.red "\tWith count: ",string count expected;
    .termcolour.red "\tActual:     ",indentedString actual;
    .termcolour.red "\tWith type:  ",string type actual;
    .termcolour.red "\tWith count: ",string count actual;
    'notequal}

notEqual:{[expected;actual]
    if[not expected~actual; :1b];
    .termcolour.red "\n  Assertion failed: .assert.notEqual";
    .termcolour.red "\tExpected:   ",indentedString expected;
    .termcolour.red "\tActual:     ",indentedString actual;
    'equal}

.assert.in:{[member;collection]
    if[member in collection; :1b];
    .termcolour.red "\n  Assertion failed: .assert.in";
    .termcolour.red "\tExpected member: ",.Q.s member;
    .termcolour.red "\tIn collection:   ",(indentedString collection);
    .termcolour.red "\tWith count:      ",string count collection;
    'notin}

.assert.notIn:{[member;collection]
    if[not member in collection; :1b];
    .termcolour.red "\n  Assertion failed: .assert.notIn";
    .termcolour.red "\tExpected member:         ",.Q.s member;
    .termcolour.red "\tNot to be in collection: ",(indentedString collection);
    'in}
