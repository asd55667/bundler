/**
 * @typedef {import('../rollup').OutputOptions} OutputOptions
 * @typedef {import('../rollup').RollupOutput} RollupOutput
 * @typedef {import('../rollup').OutputChunk} OutputChunk
 */

class Bundle {
    /**
     * 
     * @param {string} code 
     * @param {any} options 
     */
    constructor(code, options = {}) {
        this.code = code
        this.options = options
    }

    /**
     * 
     * @param {OutputOptions} outputOptions 
     * @returns {Promise<RollupOutput>}
     */
    async generate(outputOptions) {
        /** @type {OutputChunk} */
        const chunk = {
            code: '',
            map: null,
            sourcemapFileName: null,
            facadeModuleId: null,
            isDynamicEntry: false,
            isEntry: false,
            isImplicitEntry: false,
            preliminaryFileName: '',
            fileName: '',
            name: '',
            type: 'chunk',
            importedBindings: {},
            modules: {},
            imports: [],
            moduleIds: [],
            referencedFiles: [],
            implicitlyLoadedBefore: [],
            exports: [],
            dynamicImports: []
        }
        /** @type {RollupOutput} */
        const output = { output: [chunk, chunk] }
        if (outputOptions?.format === 'iife') {
            chunk.code = `(function () { 
                            'use strict';
                            ${this.code}
                        })();`
        }

        return output
    }
}

module.exports = {
    Bundle
}