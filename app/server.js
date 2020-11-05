const NodeMediaServer = require('node-media-server');

const config = {
	logType: 3,

	rtmp: {
		port: 1935,
		chunk_size: 60000,
		gop_cache: true,
		ping: 30,
		ping_timeout: 60
	},
};
if(process.env.hasOwnProperty('secondary')){
	let primary_addr = process.env.primary_addr
	
	config.relay = {
	  ffmpeg: `${process.env.ffmpeg_dir}`,
	  tasks: [
	    {
	      app: 'live',
	      mode: 'pull',
	      edge: `rtmp://${primary_addr}`,
	    }
	  ]
	}
}

var nms = new NodeMediaServer(config)
nms.run();
