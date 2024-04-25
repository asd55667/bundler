/**
 * @typedef {import('./rollup').RollupLog} RollupLog
 * @typedef {import('./rollup').ObjectRule} ObjectRule
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
                const items = filter.split('&')
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

    const keyNested = key.includes('.')
    if (!keyNested && !(key in log)) return false

    let actual = log[/** @type {keyof RollupLog} */ (key)]
    if (keyNested) {
        try {
            actual = key.split('.').reduce((prev, k) => prev[/** @type {keyof RollupLog} */(k)], log)
        } catch (err) {
            // nested key access failed
            return false
        }
    }

    if (typeof actual === 'number' || actual === null || actual === undefined) {
        actual = String(actual)
    }

    const matched = isMatched(rule, actual)

    if (inverted && !matched) return true
    if (!inverted && matched) return true

    return false
}

/**
 * 
 * @param {string | ObjectRule} rule 
 * @param {*} actual 
 */
function isMatched(rule, actual) {
    let matched = false
    if (typeof rule === 'string') matched = isStringMatched(rule, actual)
    else if (typeof rule === 'object') matched = isObjectMatched(rule, actual)
    return matched
}

/**
 * 
 * @param {string} filter 
 * @returns {[string, string | ObjectRule]}
 */
function splitRule(filter) {
    if (filter === '') return ['', '']

    let key = ''

    let i = 0
    while (filter[i] !== ':') key += filter[i++]
    /** @type {string | ObjectRule} */
    let rule = filter.slice(i + 1).trim()

    if (rule[0] === '{') {
        rule = parseObjectRule(rule)
    }

    return [key.trim(), rule]
}

/**
 * 
 * @param {string} rule 
 * @param {ObjectRule} result
 * @returns {ObjectRule}
 */
function parseObjectRule(rule, result = []) {
    let i = 1

    let key = null
    let value = null
    while (i < rule.length && rule[i] !== '}') {
        const ch = rule[i]

        if (ch === '{') {
            // TODO: nested object rule
        }

        if (ch === ',') {
            if (key && value) {
                result.push(normalizeObjectRule(key, value))
            }
            else if (key?.trim() === '*' && !value) result.push('*')
            else throw new Error('parse error with object rule.')
            key = null
            value = null
            i++
            continue
        }

        if (key === null) key = ''

        if (ch === ':') {
            value = ''
            i++
            continue
        }

        if (value === null && typeof key === 'string') key += ch

        if (typeof value === 'string') value += ch

        i++
    }
    if (key && value) result.push(normalizeObjectRule(key, value))
    else if (key?.trim() === '*') result.push('*')

    return result
}

/**
 * 
 * @param {string} key 
 * @param {string} value 
 * @returns {[string, unknown]}
 */
function normalizeObjectRule(key, value) {
    key = key.trim()
    key = key[0] === '"' || key[0] === "'" ? JSON.parse(key) : key
    return [key, JSON.parse(value.trim())]
}
/**
 * 
 * @param {ObjectRule} rule 
 * @param {Record<string, any>} obj 
 * @returns {boolean}
 */
function isObjectMatched(rule, obj) {
    let i = 0
    let j = 0

    const s = Object.keys(obj)

    while (i < rule.length && j < s.length) {
        const ch = rule[i]

        if (ch === '*') {
            if (i === rule.length - 1) return true
            if (rule[i + 1]?.[0] === s[j] && rule[i + 1]?.[1] === obj[s[j]]) i++
            else j++
            continue
        }

        if (ch?.[0] !== s[j] || ch?.[1] !== obj[s[j]]) return false

        i++;
        j++
    }

    if (rule[i] === '*') i++

    return i === rule.length && j === s.length

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

    return i === rule.length && j === s.length
}

module.exports = {
    getLogFilter
}