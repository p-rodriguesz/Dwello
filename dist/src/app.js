"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const usuarios_routes_1 = __importDefault(require("./routes/usuarios.routes"));
const ocorrencias_routes_1 = __importDefault(require("./routes/ocorrencias.routes"));
exports.app = (0, fastify_1.default)({
    logger: true
});
exports.app.register(usuarios_routes_1.default);
exports.app.register(ocorrencias_routes_1.default);
