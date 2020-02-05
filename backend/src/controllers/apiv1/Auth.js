"use strict";
// Node imports
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const moment = require('moment');
// Own imports
const { User } = require('../../models');
const { mail } = require('../../utils');

/**
 * Controller object
 */
module.exports = {

    /**
     * Perform application Login trough username/password
     * @param {Request} req Request web
     * @param {Response} res Response web
     * @param {Middleware} next Next middleware
     */
    login: async (req, res, next) => {
        // Find user by email
        const user = await User.findOne({email: req.body.email});
        if (user) {
            // User account inactive
            if (!user.active) {
                return next({
                    status: 401,
                    description: 'Account not active. Check your email to activate the account.'
                }); 
            }
            // Compare hashes (use bcrypt to avoid timing attacks as well)
            if (bcrypt.compareSync(req.body.password, user.password)) {
                // Create the payload and JWT (expiration in 60 minutes after login)
                const payload = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    expires: moment().add(60, 'minutes')
                };
                const jwtoken = jwt.sign({payload}, process.env.SECRET);
                user.jwt = jwtoken;
                user.expire = Date.now() + 3600000;
                // Save JWT in the database
                user.save();
                // Return the JWT and user information
                return res.json({
                    success: true,
                    description: 'Authorization successful',
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        token: user.jwt,
                        likes: user.likes,
                    },
                });
            }
            return next({
                status: 401,
                description: 'Not authorized. Wrong password.'
            });
        }
        // Unauthorized
        return next({
            status: 401,
            description: 'Account does not exist. Go to create an account.'
        });
    },

    /**
     * This dummy controller has the only purpose of check if the JWT a user owns is still valid for it's email address.
     * I use it in the application for the first login, in case use has the credentials in the local storage from previous
     * logins.
     * @param {Request} req Request web
     * @param {Response} res Response web
     * @param {Middleware} next Next middleware
     */
    checkJWT: async (req, res, next) => {
        // In case I am here I am authorized (because this controller is private and the middleware is who checks the JWT)
        const user = await User.findOne({email: req.user.email, active: true});
        // Return the JWT and user information
        return res.json({
            success: true,
            description: 'Authorization successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                token: user.jwt,
                likes: user.likes,                
            },
        });
    },

    /**
     * Perform application logout. JWT is invalidated
     * @param {Request} req Request web
     * @param {Response} res Response web
     * @param {Middleware} next Next middleware
     */
    logout: async (req, res, next) => {
        // Find user by email
        const user = await User.findOne({email: req.user.email});
        if (user) {
            // Invalidate the JWT and save user information
            user.expire = null;
            user.jwt = null;
            const response = await user.save();
            // Return the user information without the JWT
            return res.json({
                success: true,
                description: 'User logged out',
                user: {
                    name: response.name,
                    email: response.email,
                    token: user.jwt
                }
            })
        }
        // Unauthorized
        return next({
            status: 401,
            description: 'User not logged in'
        });
    },

    /**
     * Activate a user account via token
     * @param {Request} req Request web
     * @param {Response} res Response web
     * @param {Middleware} next Next middleware
     */
    activate: async (req, res, next) => {
        // Find user with the specified token
        let user = await User.findOne({
            token: req.params.token, 
            active: false, 
            expire: { $gt: Date.now()}
        });
        if (user) {
            // Activate user and reset token
            user.token = '';
            user.expire = '';
            user.active = true;
            user = await user.save();
            // Ok
            return res.json({
                success: true,
                description: 'Account activated succesfully',
            });
        }
        // No autorizado
        next({
            status: 401, 
            description: 'Token not valid or expired. Reset your password once again.'
        });
    },

    /**
     * Request reset password. Sends an email and set the token
     * @param {Request} req Request web
     * @param {Response} res Response web
     * @param {Middleware} next Siguiente middleware al que llamar
     */
    requestReset: async (req, res, next) => {
        // Find user with that email
        let user = await User.findOne({email: req.body.email });
        if (user) {
            // Set token and save user record
            user.token = crypto.randomBytes(20).toString('hex');
            user.expire = Date.now() + 360000;
            user = await user.save();
            // Send mail
            mail({
                email: user.email, 
                subject: 'Password reset',
                url: `http://localhost:3000/reset/${user.token}`,
                view: 'password_reset'
            });
            // Ok
            return res.json({
                success: true,
                description: 'Check your email to change password.',
            });
        }
        // Unauthorized
        return next({
            status: 401,
            description: 'Account does not exist. Go to create an account.'
        });
    },

    /**
     * Set password in case the token specified is valid
     * @param {Request} req Request web
     * @param {Response} res Response web
     * @param {Middleware} next Siguiente middleware al que llamar
     */
    reset: async (req, res, next) => {
        // Find user with the specified token
        let user = await User.findOne({
            token: req.params.token, 
            expire: { $gt: Date.now()}
        });
        // Si existe actualizo el password y lo guardo
        if (user) {
            user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
            user.token = null;
            user.expire = null;
            user.active = true;
            user = await user.save();
            // Ok
            return res.json({
                success: true,
                description: 'Password updated successfully.',
            });
        }
        // No autorizado
        next({status: 401, error: 'No autorizado'});
    }
}