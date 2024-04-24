/**
 * @typedef {import('./rollup').RollupLog} RollupLog
 */

/**
 * 
 * @param {string[]} filters 
 * @returns {(log: RollupLog) => boolean}
 */
function getLogFilter(filters) {

    /**
     * 
     * @param {RollupLog} log 
     * @returns {boolean}
     */
    const fn = function (log) {
        if (!Array.isArray(filters) || !filters.length) return true

        for (const filter of filters) {
            if (filter.includes('&')) {
                const items = filter.split('&').filter(Boolean)
                const passed = items.map(item => check(item, log)).filter(Boolean)
                if (passed.length === items.length) return true
            } else if (check(filter, log)) return true
        }

        return false
    }
    return fn
}

/**
 * 
 * @param {string} filter 
 * @param {RollupLog} log 
 * @returns {boolean}
 */
function check(filter, log) {
    let [key, rule] = splitRule(filter)

    const inverted = key[0] === '!'
    if (inverted) key = key.slice(1)

    if (!(key in log)) return false

    let actual = log[/** @type {keyof RollupLog} */ (key)]
    if (typeof actual === 'number' || actual === null || actual === undefined) {
        actual = String(actual)
    }

    let matched = false
    if (typeof rule === 'string') matched = isStringMatched(rule, actual)
    else if (typeof rule === 'object') matched = isObjectMatched(rule, actual)

    if (inverted && !matched) return true
    if (!inverted && matched) return true

    return false
}

/**
 * 
 * @param {string} filter 
 * @returns {[string, string | Record<string, any>]}
 */
function splitRule(filter) {
    let key = ''

    let i = 0
    while (filter[i] !== ':') key += filter[i++]
    /** @type {string | Record<string, any>} */
    let rule = filter.slice(i + 1).trim()
    if (rule[0] === '{') rule = parseObjectRule(rule)

    return [key.trim(), rule]
}

/**
 * 
 * @param {string} rule 
 * @returns {Record<string, any>}
 */
function parseObjectRule(rule) {
    
    return {}
}

/**
 * 
 * @param {Record<string, any>} rule 
 * @param {Record<string, any>} obj 
 * @returns {boolean}
 */
function isObjectMatched(rule, obj) {
    const keys = Object.keys(rule)
    const passed = keys.map(key => obj[key] === rule[key])
    if (keys.length === passed.length) return true

    return false
}

/**
 * 
 * @param {string} rule regexp rule
 * @param {string} s  target string
 * @returns {boolean}
 */
function isStringMatched(rule, s) {
    let i = 0
    let j = 0

    while (i < rule.length && j < s.length) {
        const ch = rule[i]

        if (ch === '*') {
            if (i === rule.length - 1) return true

            if (rule[i + 1] === s[j]) i++
            else j++
            continue
        }

        if (ch !== s[j]) return false

        i++;
        j++
    }

    if (rule[i] === '*') i++
    if (s[j] === '*') j++

    return i === rule.length && j === s.length
}

module.exports = {
    getLogFilter
}