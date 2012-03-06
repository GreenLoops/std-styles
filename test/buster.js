var config = module.exports;

config["client-side"] = {
    environment: "browser",
    sources: [
        "../js/EventEmitter-3.1.4.js",
        "../js/jquery-1.7.1.js",
        "../js/jquery-f5-0.1.0.js",
        "../js/math-uuid-1.4.0.js",
        "../js/moment-1.2.0.js",
        "../js/underscore-1.3.1.js",
        "../js/jscore.js",
        "../js/jscore/*.js"
    ],
    tests: [
        "**/*Test.js"
    ]
};

