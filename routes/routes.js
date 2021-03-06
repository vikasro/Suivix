/*
 * Copyright (c) 2020, MΛX! Inc.  All rights reserved.
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */
const routes = require('express').Router();

//Global imports
const home = require("./models/home"),
    login = require("./models/login");

//Errors
const error404 = require('./models/error/404');

//Authentification imports
const authLogin = require("./models/auth/login"),
    authLogout = require("./models/auth/logout"),
    callback = require("./models/auth/callback");

//Attendance
const welcome = require('./models/attendance/welcome'),
    servers = require('./models/attendance/servers'),
    done = require('./models/attendance/done'),
    noRequest = require('./models/attendance/noRequest'),
    newRequest = require('./models/attendance/newRequest');

//Api imports
const getUser = require('./models/api/user'),
    getUserGuilds = require('./models/api/guilds'),
    getUrl = require('./models/api/url'),
    getChannels = require('./models/api/channels'),
    getCategories = require('./models/api/categories'),
    getRoles = require('./models/api/roles'),
    getStats = require('./models/api/stats'),
    getChangelog = require('./models/api/changelog'),
    getInviteLink = require('./models/api/invite'),
    getSupportLink = require('./models/api/support');

class RoutesList {

    static getRoutes(passport) {

        //Global
        routes.get(Routes.HOME_PAGE, (req, res) => {
            home(req, res, undefined)
        });
        routes.get(Routes.HOME_PAGE + "fr", (req, res) => {
            home(req, res, "fr")
        });
        routes.get(Routes.HOME_PAGE + "en", (req, res) => {
            home(req, res, "en")
        });

        //Login
        routes.get(Routes.LOGIN_PAGE, login);

        //Error
        routes.get(Routes.ERROR_404, error404);

        //Authentification
        routes.get(Routes.LOGIN_REDIRECT, passport.authenticate('oauth'));
        routes.get(Routes.LOGOUT_REDIRECT, authLogout);
        routes.get(Routes.DISCORD_OAUTH_CALLBACK_URL, passport.authenticate('oauth'), callback);

        //Attendance
        routes.get(Routes.ATTENDANCE_PAGE, passport.authenticate('main', ), welcome);
        routes.get(Routes.ATTENDANCE_SERVERS, passport.authenticate('main'), servers);
        routes.get(Routes.ATTENDANCE_PAGE_DONE, passport.authenticate('main'), done);
        routes.get(Routes.ATTENDANCE_NOREQUEST, noRequest);
        routes.get(Routes.ATTENDANCE_NEWREQUEST, newRequest);

        //Api
        routes.get(Routes.API_USER_URL, passport.authenticate('main', {
            noredirect: true
        }), getUser);
        routes.get(Routes.API_GUILDS_URL, passport.authenticate('main', {
            noredirect: true
        }), getUserGuilds);
        routes.get(Routes.API_URL_FETCHER_URL, getUrl);
        routes.get(Routes.API_CHANNELS_URL, getChannels);
        routes.get(Routes.API_CATEGORIES_URL, getCategories);
        routes.get(Routes.API_ROLES_URL, getRoles);
        routes.get(Routes.API_STATS_URL, getStats);
        routes.get(Routes.API_CHANGELOG_URL, getChangelog);
        routes.get(Routes.API_INVITE_URL, getInviteLink);
        routes.get(Routes.API_SUPPORT_URL, getSupportLink);

        //Handle 404 error
        routes.get('*', (req, res) => {
            console.log(req.url.includes('.map') || req.url.includes('socket.io') ? "" : "⚠   Error 404 on ".brightRed.bold + "\"" + req.url + "\"" + " (IP: " + req.connection.remoteAddress.split(`:`).pop() + ")" + separator);
            res.status(404).redirect(Routes.ERROR_404);
        });

        return routes;
    }
}

module.exports = {
    getRoutes: RoutesList.getRoutes
};