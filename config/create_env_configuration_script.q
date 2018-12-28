cfgFile:`:cfg
apprcLines:{"export ",upper[" app_",x 0],"=",raze[1_x],"\n"} each "="vs/:read0 cfgFile
apprc:`:apprc
if[not()~key apprc;hdel apprc]
h:hopen apprc
h each apprcLines;
hclose h
apprcStr:raze 1_string apprc
-1 "Done.";
-1 "Check ",apprcStr," looks correct,";
-1 "then run `source ",apprcStr,"`, and you should be good to go.";
exit 0
