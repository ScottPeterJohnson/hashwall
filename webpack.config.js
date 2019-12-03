const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const WorkerPlugin = require('worker-plugin');

const dist = path.resolve(__dirname, "dist");
const debug = path.resolve(__dirname, "debug");

module.exports = {
    mode: "production",
    entry: {
        hashwall: "./js/hashwall.ts",
        page: "./js/test/page.ts"
    },
    output: {
        path: dist,
        filename: "[name].js"
    },
    devServer: {
        contentBase: dist,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new CopyPlugin([
            path.resolve(__dirname, "static")
        ]),
        new WasmPackPlugin({
            crateDirectory: __dirname,
            extraArgs: "--out-name index"
        }),
        new WorkerPlugin({
            globalObject: 'self',
            plugins: ['WasmPackPlugin']
        })
    ]
};
