const createBundler = require("@airtable/blocks-webpack-bundler").default;
function createConfig(baseConfig) {

    baseConfig.module.rules.push({
        resolve: {
            fallback: {
                buffer: require.resolve('buffer/'),
            }
        }
    })
  return baseConfig;
}

exports.default = () => {
  return createBundler(createConfig);
};


