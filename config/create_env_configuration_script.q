cfgFile:`:cfg
melangercLines:{"export ",upper[" melange_",x 0],"=",raze[1_x],"\n"} each "="vs/:read0 cfgFile
melangerc:`:melangerc
if[not()~key melangerc;hdel melangerc]
h:hopen melangerc
h each melangercLines;
hclose h
melangercStr:raze 1_string melangerc
-1 "Done.";
-1 "Check ",melangercStr," looks correct,";
-1 "then run `source ",melangercStr,"`, and you should be good to go.";
exit 0
