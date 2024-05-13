/**
 * @typedef {import('../rollup').SourceMap} SourceMap
 */

class PreRenderedChunk {
    type = "chunk";

    /** @type {string[]} */
    exports = []

    /** @type {string[]} */
    moduleIds = []

    /** @type {string | null} */
    facadeModuleId = null

    /** @type {boolean} */
    isDynamicEntry = false

    /** @type {boolean} */
    isEntry = false

    /** @type {boolean} */
    isImplicitEntry = false

    /**
     * 
     * @param {string} name 
     */
    constructor(name) {
        /** @type {string} */
        this.name = name
    }
}

class RenderedChunk extends PreRenderedChunk {
    /** @type {string} */
    fileName = ''

    /** @type {string[]} */
    dynamicImports = []

    /** @type {string[]} */
    imports = []

    /** @type {string[]} */
    referencedFiles = []

    /** @type {string[]} */
    implicitlyLoadedBefore = []

    /** @type {{[imported: string]: string[];}} */
    importedBindings = {}

    /** @type {{[id: string]: RenderedModule;}} */
    modules = {}

    constructor() {
        super('')
    }
}

class RenderedModule {
    /** @type {string[]} */
    removedExports = []

    /** @type {string[]} */
    renderedExports = []

    /** @type {number} */
    renderedLength = 0

    /**
     * Description
     * @param {string} code
     */
    constructor(code) {
        /** @type {string|null} */
        this._code = code
    }

    get code() {
        return this._code
    }

    get originalLength() {
        return this._code?.length || 0
    }
}

class OutputChunk extends RenderedChunk {
    /** @type {string} */
    code = ''

    /** @type {SourceMap|null} */
    sourcemap = null

    /** @type {string|null} */
    sourcemapFileName = null

    /** @type {string} */
    preliminaryFileName = ''

    constructor() {
        super()
    }
}

module.exports = {
    PreRenderedChunk,
    RenderedChunk,
    OutputChunk,
    RenderedModule
}