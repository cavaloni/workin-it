exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/workout';
exports.PORT = process.env.PORT || 8081;
exports.SECRET1 = 'kitty bear';
exports.SECRET2 = 'bear kit kat';
