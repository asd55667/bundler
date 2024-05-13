/**
 * @typedef {import('../rollup').RollupOptions} RollupOptions
 * @typedef {import('../rollup').Plugin} Plugin
 */

/**
 * 
 * @param {RollupOptions['input']} input 
 */
function normalizeEntry(input) {
    /** @type {import('../rollup').Entry=} */
    let entries
    if (Array.isArray(input)) {
        entries = input.reduce((prev, key) => {
            (prev[key] = key); return prev;
        }, /** @type {Record<string, string>} */({}))
    } else if (typeof input === 'string') entries = { [input]: input }
    else entries = input

    if (!entries) throw new Error('No input entry');

    return entries
}

/**
 * 
 * @param {RollupOptions['external']} external 
 */
function normalizeExternal(external) {
    /** @type {import('../rollup').External} */
    let _external = () => false
    if (Array.isArray(external))
        _external = (id) => external.every(v => typeof v === 'string' ? id === v : v.test(id))

    if (typeof external === 'string') _external = (id) => id === external

    if (external instanceof RegExp) _external = (id) => external.test(id)

    if (typeof external === 'function') _external = external

    return _external
}

/**
 * 
 * @param {RollupOptions['plugins']} plugins 
 * @returns {Promise<Plugin[]>}
 */
async function normalizePlugins(plugins) {
    plugins = await plugins
    if (!plugins) return []
    if (!Array.isArray(plugins)) return [plugins]
    const res = await Promise.all(plugins.flatMap(p => normalizePlugins(p)))
    return res.flat(1)
}

/**
 * 
 * @param {RollupOptions} options 
 */
async function normalizeOptions(options) {
    return {
        input: normalizeEntry(options.input),
        external: normalizeExternal(options.external),
        plugins: await normalizePlugins(options.plugins)
    }
}

module.exports = {
    normalizeOptions
}