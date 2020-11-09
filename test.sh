
#ffplay rtmp://192.168.64.2:30356/live/hola
for a in $(seq 1 20)
do
	ffplay rtmp://192.168.64.2:30083/live/hola -autoexit -nodisp  &
done


