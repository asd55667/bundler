/**
 * @typedef {import('../rollup').RollupOptions} RollupOptions
 */

const { normalizeOptions } = require('./utils')
const { Graph } = require('./graph')

/**
 * @param {RollupOptions} options
 */
async function rollup(options) {
    const _options = await normalizeOptions(options)

    const graph = new Graph(_options)

    const bundle = await graph.build()

    return bundle
}

module.exports = {
    rollup
}