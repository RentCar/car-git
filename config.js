exports.appPort = parseInt(process.argv.slice(2)) || 3000;
exports.domain = process.argv.slice(3) || "http://destination.in.ua";