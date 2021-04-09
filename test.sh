
#ffplay rtmp://192.168.64.2:30356/live/hola
url="rtmp://192.168.64.2:30779/live/test"
for a in $(seq 1 20)
do
	ffplay $url -autoexit -nodisp  &
done


