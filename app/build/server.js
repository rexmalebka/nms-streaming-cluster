"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_media_server_1 = __importDefault(require("node-media-server"));
const port = 80;
const host = "0.0.0.0";
console.debug(node_media_server_1.default);
let tasks = [];
const config = {
    logType: 3,
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    relay: {
        ffmpeg: `${process.env.ffmpeg_dir}`,
        tasks: tasks
    }
};
if (process.env.hasOwnProperty('primary')) {
    if (process.env.hasOwnProperty('relay_url')) {
        const relay_url = process.env.hasOwnProperty('relay_url') ? '' + process.env['relay_url'] : "";
        tasks.push({
            app: 'live',
            mode: 'static',
            edge: relay_url,
            name: 'relay'
        });
    }
    if (process.env.hasOwnProperty('push')) {
        const plain_push_urls = process.env.hasOwnProperty('push') ? '' + process.env['push'] : "";
        try {
            const push_urls = JSON.parse(plain_push_urls);
            tasks.push(...push_urls.map(push => {
                return {
                    app: 'live',
                    mode: 'push',
                    edge: `${push.server.replace(/\/$/, '')}/${push.key}`,
                    appendName: push.hasOwnProperty('appendName') ? push.appendName : true
                };
            }));
        }
        catch (_a) {
        }
    }
}
else {
    const primary_url = process.env.hasOwnProperty('primary_url') ? '' + process.env['primary_url'] : '';
    tasks.push({
        app: 'live',
        mode: 'pull',
        edge: primary_url
    });
    config['http'] = {
        port: 80,
        allow_origin: '*'
    };
}
console.debug(JSON.stringify(config));
const nms = new node_media_server_1.default(config);
nms.on('preConnect', (id, args) => {
    console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
    let session = nms.getSession(id);
    console.debug(session.ip);
});
nms.run();
