\d .termcolour

RED:"\033[0;31m"
GREEN:"\033[0;32m"
NOCOLOUR:"\033[0m"

coloured:{[colour;text]$[10h~abs type text;-1 colour,text,NOCOLOUR;-1 colour,(raze string text),NOCOLOUR];}
red:coloured[RED;]
green:coloured[GREEN;]
