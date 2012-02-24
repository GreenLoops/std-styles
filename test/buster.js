var config = module.exports;

config["client-side"] = {
    environment: "browser",
    sources: [
        "../js/jquery-1.7.1.js",
        "../js/underscore-1.3.1.js",
        "../js/EventEmitter-3.1.4.js",
        "../js/jscore.js",
        "../js/jscore/Router.js",
        "../js/jscore/FormBinding.js"
    ],
    tests: [
        "**/RouterTest.js",
        "**/FormBindingTest.js"
    ]
};

