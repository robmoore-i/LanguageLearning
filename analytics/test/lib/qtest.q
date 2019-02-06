\d .qtest

.qtest.failures::()
.qtest.passes::()

getTestResult:{[testfunc]
    err:@[testfunc;`;{x}];
    result:not 10h~type err;
    $[result;.termcolour.green "\tPass";.termcolour.red "\n\tFailed with signal: ",err];
    result}

test:{[description;testfunc]
    -1 "- ",description;
    result:getTestResult[testfunc];
    $[result;
        passes::passes,enlist description;
        failures::failures,enlist description];}

report:{
    nFails:count .qtest.failures;
    if[0~nFails;.termcolour.green "\n",(string count .qtest.passes), " tests passed"; :0];
    -1 "\nFailed tests:";
    .termcolour.red each "- ",/:.qtest.failures;
    .termcolour.red "\n",(string nFails)," tests failed";
    .termcolour.green (string count .qtest.passes), " tests passed";
    nFails}

testWithCleanup:{[description;testfunc;cleanupfunc]
    -1 "- ",description;
    result:getTestResult[testfunc];
    cleanupfunc[];
    $[result;
        passes::passes,enlist description;
        failures::failures,enlist description];}

testWithSetupAndCleanup:{[description;setupfunc;testfunc;cleanupfunc]
    -1 "- ",description;
    setupfunc[];
    result:getTestResult[testfunc];
    cleanupfunc[];
    $[result;
        passes::passes,enlist description;
        failures::failures,enlist description];}
