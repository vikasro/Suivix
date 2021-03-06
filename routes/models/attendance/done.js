/*
 * Copyright (c) 2020, MΛX! Inc.  All rights reserved.
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */
const RequestManager = require('../../../classes/managers/RequestManager');

module.exports = async(req, res) => {
    try {
        const manager = new RequestManager();

        if (!req.session.passport.user.identity) { //Check if the user exists or is the right one
            res.redirect(Routes.LOGIN_PAGE);
        } else {
            const request = await manager.getRequestByAuthorID(req.session.passport.user.identity.id);
            if (!request || request.isExpired()) { //Check if there is an attendance request and if it's expired
                res.redirect(Routes.ATTENDANCE_NOREQUEST);
            } else {
                await request.doAttendance(req.query.channels, req.query.roles, req.cookies["timezone"], req.cookies["language"]);
                manager.deleteRequestByID(request.getId());
                res.sendFile(Server.getViewsFile(req, res, Routes.ATTENDANCE_PAGE_DONE, "/", req.query.language ? req.query.language : undefined));
            }
        }

    } catch (err) {
        console.log(err);
        res.sendFile(Server.getApiViewsFile(req, res, Routes.ERROR_500, "/index.html"));
    }
};