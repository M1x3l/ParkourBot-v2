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
exports.file = void 0;
var discord_js_1 = require("discord.js");
var Util_1 = require("../../Util");
exports.file = {
    name: 'suggest',
    description: 'Create a suggestion',
    options: [
        {
            name: 'type',
            description: 'The type of suggestion you want to make',
            type: 'STRING',
            choices: [
                { name: 'Discord', value: 'discord' },
                { name: 'Game', value: 'game' },
            ],
            required: true,
        },
        {
            name: 'title',
            description: 'The title for your suggestion, try to keep this as short as possible (still at least 5 characters)',
            type: 'STRING',
            required: true,
        },
        {
            name: 'content',
            description: 'The content for your suggestion, text or valid markdown ({\\n}=new line) (at least 20 characters)',
            type: 'STRING',
            required: true,
        },
    ],
    run: function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, type, title, content, task;
        var _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    _a = interaction.options.data, type = _a[0], title = _a[1], content = _a[2];
                    if (!((_b = title.value) === null || _b === void 0 ? void 0 : _b.toString.length) || ((_c = title.value) === null || _c === void 0 ? void 0 : _c.toString.length) < 5) {
                        interaction.reply({
                            content: 'Title needs to at least be 5 characters long',
                            ephemeral: true,
                        });
                        return [2 /*return*/];
                    }
                    if (!((_d = content.value) === null || _d === void 0 ? void 0 : _d.toString.length) ||
                        ((_e = content.value) === null || _e === void 0 ? void 0 : _e.toString.length) < 20) {
                        interaction.reply({
                            content: 'Content needs to at least be 20 characters long',
                            ephemeral: true,
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Util_1.createTask({
                            name: (_f = title.value) === null || _f === void 0 ? void 0 : _f.toString(),
                            markdown_description: (_g = content.value) === null || _g === void 0 ? void 0 : _g.toString().replace(/{\\n}/g, '\n'),
                            status: 'Open',
                            tags: ['suggestion', (_h = type.value) === null || _h === void 0 ? void 0 : _h.toString()],
                            custom_fields: [
                                {
                                    id: '66087f65-0d16-407f-a64d-6632f05b8e59',
                                    value: interaction.user.tag,
                                },
                                {
                                    id: '19246113-631f-4371-8596-1be06ecc6d9c',
                                    value: Date.now(),
                                },
                            ],
                        })];
                case 1:
                    task = _j.sent();
                    interaction.reply({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setTitle('Created Suggestion')
                                .setDescription('Click the button below to view the suggestion in your browser'),
                        ],
                        components: [
                            {
                                type: 'ACTION_ROW',
                                components: [
                                    {
                                        type: 'BUTTON',
                                        label: 'View Suggestion',
                                        url: "https://app.clickup.com/t/" + task.body.id,
                                        style: 'LINK',
                                    },
                                ],
                            },
                        ],
                        ephemeral: true,
                    });
                    return [2 /*return*/];
            }
        });
    }); },
};
