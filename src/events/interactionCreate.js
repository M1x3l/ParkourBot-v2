"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
var botconfig_1 = require("../botconfig");
var Util_1 = require("../Util");
function run(interaction) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function () {
        var _f, err_1, err_2;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.type) == 'DM')
                        return [2 /*return*/];
                    if (!interaction.isCommand()) return [3 /*break*/, 6];
                    _f = botconfig_1.allowedChatInputChannelNames.includes(((_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.name) || '');
                    if (_f) return [3 /*break*/, 2];
                    return [4 /*yield*/, ((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.members.fetch(interaction.user.id))];
                case 1:
                    _f = (_g.sent()).permissions.any(botconfig_1.bypassCommandWhitelistPermissions);
                    _g.label = 2;
                case 2:
                    if (!(_f)) {
                        interaction.reply({
                            content: 'Sorry, you are not allowed to use slash commands in this channel, if there is a context-menu command with a similar behaviour, please use that one',
                            ephemeral: true,
                        });
                        return [2 /*return*/];
                    }
                    if (!Util_1.chatInputCommands.has(interaction.commandName))
                        return [2 /*return*/];
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, ((_d = Util_1.chatInputCommands.get(interaction.commandName)) === null || _d === void 0 ? void 0 : _d.run(interaction))];
                case 4:
                    _g.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _g.sent();
                    console.error(err_1);
                    interaction.reply({
                        content: 'An error occurred while processing the command',
                        ephemeral: true,
                    });
                    return [3 /*break*/, 6];
                case 6:
                    if (!interaction.isContextMenu()) return [3 /*break*/, 10];
                    if (!(interaction.targetType == 'USER')) return [3 /*break*/, 10];
                    if (!Util_1.userCommands.has(interaction.commandName))
                        return [2 /*return*/];
                    _g.label = 7;
                case 7:
                    _g.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, ((_e = Util_1.userCommands.get(interaction.commandName)) === null || _e === void 0 ? void 0 : _e.run(interaction))];
                case 8:
                    _g.sent();
                    return [3 /*break*/, 10];
                case 9:
                    err_2 = _g.sent();
                    console.error(err_2);
                    interaction.reply({
                        content: 'An error occurred while processing the command',
                        ephemeral: true,
                    });
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.run = run;
