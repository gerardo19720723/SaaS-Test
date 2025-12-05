"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJWT = signJWT;
exports.verifyJWT = verifyJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || 'supersecret';
function signJWT(payload) {
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '1h' });
}
function verifyJWT(token) {
    return jsonwebtoken_1.default.verify(token, secret);
}
