const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const PORT = 8080;
const APP_ID = process.env.APP_ID;

const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
const app = express();

const nocache = (req, resp, next) => {
    resp.header('Cache-Control', 'private', 'no-cache', 'no-store', 'must-revalidate');
    resp.header('Expires', -1);
    resp.header('Pragma', 'no-cache');
    next();
};

const generateAccessToken = (req, resp) => {

    resp.header('Acccess-Control-Allow-Origin', '*');

    const channelName = req.query.channelName;

    if (!channelName) {

        return resp.status(500).json(
            {
                'error': "channel name is required"
            }
        );
    }

    let uid = req.query.uid;

    if (!uid || uid == '') {
        uid = 0;
    }

    let role = RtcRole.SUBSCRIBER;

    if (req.query.role == 'publisher') {
        role = RtcRole.PUBLISHER;
    }
    let expireTime = req.query.expireTime;

    if (!expireTime || expireTime == '') {

        expireTime = 3600;
    }

    else {
        expireTime = parseInt(expireTime, 10);
    }

    const currentTime = Math.floor(Date.now() / 1000);

    const priviledgeExpireTime = currentTime + expireTime;

    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, priviledgeExpireTime);


    return resp.json({ "token": token });





};

app.get('/access_token', nocache, generateAccessToken);


app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
