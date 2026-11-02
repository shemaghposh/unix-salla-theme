const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ThemeWatcher = require('@salla.sa/twilight/watcher.js');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const asset = file => path.resolve('src/assets', file || '');
const public = file => path.resolve("public", file || '');

module.exports = {
    entry  : {
        app     : [asset('styles/app.scss'), asset('js/wishlist.js'), asset('js/app.js'), asset('js/blog.js')],
        home    : asset('js/home.js'),
        'product-card' : asset('js/partials/product-card.js'),
        'main-menu' : asset('js/partials/main-menu.js'),
        'wishlist-card': asset('js/partials/wishlist-card.js'),
        'add-product-toast': asset('js/partials/add-product-toast.js'),
        'digital-files': asset('js/partials/digital-files.js'),
        checkout: [asset('js/cart.js')],
        pages   : [asset('js/loyalty.js'), asset('js/brands.js'),],
        product : [asset('js/product.js'), asset('js/products.js')],
        order   : asset('js/order.js'),
        account : asset('js/account.js'), // ROADMAP 5.1: account shell (layouts/customer.twig)
        testimonials   : asset('js/testimonials.js')
    },
    output : {
        path: public(),
        clean: true,
        // ROADMAP 6.2: on-demand chunks (sweetalert2 from app.js, fslightbox from product.js) land next to
        // the entries in public/. publicPath stays 'auto', so they load from the same CDN folder as the
        // script that asked for them (docs/PERFORMANCE.md §4).
        chunkFilename: "[name].[contenthash].js"
    },
    stats  : {modules: false, assetsSort: "size", assetsSpace: 50},
    module : {
        rules: [
            {
                test   : /\.js$/,
                exclude: [
                    /(node_modules)/,
                    asset('js/twilight.js')
                ],
                use    : {
                    loader : 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                          "@babel/plugin-transform-runtime"
                        ],
                    }
                }
            },
            {
                test: /\.(s(a|c)ss)$/,
                use : [
                    MiniCssExtractPlugin.loader,
                    {loader: "css-loader", options: {url: false}},
                    "postcss-loader",
                    "sass-loader",
                ]
            },
        ],
    },
    plugins: [
        new ThemeWatcher(),
        new MiniCssExtractPlugin(),
        new CopyPlugin({patterns: [
            {from: asset('images'), to: public('images')},
            {from: asset('fonts'), to: public('fonts'), noErrorOnMissing: true},
        ]}),
    ],
    optimization: {
        minimizer: [
            `...`,
            new CssMinimizerPlugin(),
        ],
    },
}
;
