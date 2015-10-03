
var Knowledge = function () { };
Knowledge.prototype.utilize = function () {
    throw new Error('Knowledge:utilize, not implemented');
};

var GuessKnowledge = function (a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
};
GuessKnowledge.prototype = Object.create(Knowledge.prototype);
GuessKnowledge.prototype.utilize = function (user) {
    switch (user) {
        case 'A':
            return new GuessKnowledge(this.b + this.c, this.b, this.c);
        case 'B':
            return new GuessKnowledge(this.a, this.a + this.c, this.c);
        case 'C':
            return new GuessKnowledge(this.a, this.b, this.a + this.b);
        default:
            throw new Error('GuessKnowledge:utilize, unknown user: ' + user);
    }
};

var InitKnowledge = function () { };
InitKnowledge.prototype.utilize = function (user) {
    switch (user) {
        case 'A':
            return new GuessKnowledge(2, 1, 1);
        case 'B':
            return new GuessKnowledge(1, 2, 1);
        case 'C':
            return new GuessKnowledge(1, 1, 2);
        default:
            throw new Error('InitKnowledge:utilize, unknown user: ' + user);
    }
};

var User = function (name) {
    this.name = name;
    this.knowledge = [new InitKnowledge()];
};
User.prototype.guess = function () {
    var name = this.name;
    var ret = this.knowledge.map(function (k) { return k.utilize(name); });
    this.knowledge = [];
    return ret;
};
User.prototype.addKnowledge = function (k) {
    this.knowledge = this.knowledge.concat(k);
};

var consAns = function (k, a, name) {
    switch (name) {
        case 'A':
            var q = a / k.a;
            break;
        case 'B':
            var q = a / k.b;
            break;
        case 'C':
            var q = a / k.c;
            break;
        default:
            throw new Error();
    }
    var nums = [k.a, k.b, k.c].map(function (e) { return e * q; });
    if (nums.every(function (n) { return Math.ceil(n) == n; }))
        return nums;
    else
        return null;
};

var Game = function (round, answer) {
    this.round = round;
    this.answer = answer;
};
Game.prototype.start = function () {
    var users = ['A', 'B', 'C'].map(function (name) { return new User(name); });
    for (var i = 0; i < this.round - 1; ++i) {
        var u = users[i % 3];
        var ous = users.filter(function (q) { return q !== u; });
        var guess = u.guess();
        ous.forEach(function (q) { q.addKnowledge(guess); });
    }
    var fuser = users[(this.round - 1) % 3];
    var g = fuser.guess();
    var ans = this.answer, fname = fuser.name;
    var answers = g.map(function (s) { console.log([s.a, s.b, s.c].join(' ')); return consAns(s, ans, fname); }).filter(function (a) { return a != null; });
    console.log('Answers: ');
    answers.forEach(function (a) { console.log(a.join(' ')); });
};

var round = Number(process.argv[2]), ans = Number(process.argv[3]);
new Game(round, ans).start();
