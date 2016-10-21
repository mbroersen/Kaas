class UtilObject
{
    static Merge(obj, target2)
    {
        if (typeof Object.assign != 'function') {
            Object.assign = function(target) {
                'use strict';
                if (target == null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                target = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var source = arguments[index];
                    if (source != null) {
                        for (var key in source) {
                            if (Object.prototype.hasOwnProperty.call(source, key)) {
                                target[key] = source[key];
                            }
                        }
                    }
                } 
                return target;
            };
        }

        return Object.assign(obj, target2);
    }


    static DomReady(callback) {
        if (document.readyState != 'loading'){
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

}

module.exports = UtilObject;
