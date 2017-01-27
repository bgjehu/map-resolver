/*!
 * cookie-screener
 * Copyright(c) 2017 Jay Hu
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

const _ = require('lodash');

/**
 * Let you pass a map and return a resolver to resolve for value later
 *
 * @param {object<string, func>} map
 * @return {func(string[, string][, boolean])} A resolver to resolve with flag and id later
 * @public
 */

const mapResolver = (map) => {

    //  check map object
    const fns = _.values(map);
    if (!_.isObject(map)) {
        throw new Error('Map must be an object');
    }
    if (fns.length === 0) {
        throw new Error('Map must be a filled object');
    }
    _.forEach(fns, (to) => {
        if (!_.isFunction(to)) {
            throw new Error('Map must be an instance of Object<string, func>');
        }
    });

    return (flag, id, chain = true) => {

        var f, _id, _flag;
        flag += ''; //  turn to string
        for (f in map) {
            if (flag === f || flag.indexOf(f) === 0) {
                //  resolve flag by itself
                _id = flag === f ? id : flag.replace(f, '');    //  flag === f, use external id, otherwise use embedded
                _flag = f;
                break;
            }
        }

        const fn = map[_flag];
        const src = _.isFunction(fn) ? fn() : {};

        if (_.isObject(src) || _.isArray(src)) {
            if (chain) {
                return _.isString(_id) ? _.reduce(_id.split('.'), (a, b) => {
                        return (a || {})[b];
                    }, src) : undefined;
            } else {
                return src[_id];
            }
        } else {
            //  src is not valid to be resolved
            return undefined;
        }
    };
};

/**
 * Module exports.
 * @public
 */

module.exports = mapResolver;