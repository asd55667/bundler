/**
 * @typedef {import('./rollup').RollupOptions} RollupOptions
 */

/**
 * 
 * @param {string} path 
 * @param {any} config 
 * @param {boolean=} _watchMode 
 * @returns 
 */
async function loadConfigFile(path, config, _watchMode) {
    let options
    let option = (await importWithConfig(path, config))?.default

    if (typeof option === 'function') option = option(process.argv)

    options = Array.isArray(option) ? option.map(normalizeOption) : [normalizeOption(option)]

    const warnings = {
        count: 0
    }

    return {
        warnings,
        options
    }
}

/**
 * 
 * @param {string} path 
 * @param {any} config 
 * @returns 
 */
async function importWithConfig(path, config) {
    let option
    if (config?.configPlugin) {
        const plugin = eval(config.configPlugin)
        try {
            option = (await import(path)).default
            option = { default: plugin.transform(option) }
        } catch (err) {
            if (!(err instanceof Error)) throw err
            const message = 'module is not defined in ES module scope'
            const msg = err.message
            if (msg.startsWith(message)) {
                throw {
                    cause: { message },
                    code: 'INVALID_CONFIG_MODULE_FORMAT',
                    message: `Rollup transpiled your configuration to an  ES module even though it appears to contain CommonJS elements. To resolve this, you can pass the "--bundleConfigAsCjs" flag to Rollup or change your configuration to only contain valid ESM code.\n\nOriginal error: ${message}`,
                    url: 'https://rollupjs.org/command-line-interface/#bundleconfigascjs'
                }
            }
            throw err
        }
    } else {
        try {
            option = (await import(path))
        } catch (err) {
            if (!(err instanceof Error)) throw err

            const message = err.message
            if (message.startsWith(`Unexpected token 'export'`)) {
                throw {
                    cause: { message },
                    code: 'INVALID_CONFIG_MODULE_FORMAT',
                    message: `Node tried to load your configuration file as CommonJS even though it is likely an ES module. To resolve this, change the extension of your configuration to ".mjs", set "type": "module" in your package.json file or pass the "--bundleConfigAsCjs" flag.\n\nOriginal error: ${message}`,
                    url: 'https://rollupjs.org/command-line-interface/#bundleconfigascjs'
                }
            }
            if (message.startsWith('module is not defined in ES module scope')) {
                throw { message: `Node tried to load your configuration as an ES module even though it is likely CommonJS. To resolve this, change the extension of your configuration to ".cjs" or pass the "--bundleConfigAsCjs" flag.\n\nOriginal error: ${message}` }
            }
            throw err
        }
    }
    return option
}

/**
 * 
 * @param {RollupOptions} option 
 * @returns {RollupOptions}
 */
function normalizeOption(option) {
    if (!option?.external) option.external = []
    if (!option.plugins || !option.plugins?.length) option.plugins = [{ name: 'stdin' }]

    const { output } = option
    console.assert(output)

    option.output = Array.isArray(output) ? output.map(normalizeOutput) : [normalizeOutput(output)]
    return option
}

/**
 * 
 * @param {RollupOptions['output']} output 
 * @returns {RollupOptions['output']}
 */
function normalizeOutput(output) {
    if (!output.plugins) output.plugins = []
    return output
}

module.exports = {
    loadConfigFile
}