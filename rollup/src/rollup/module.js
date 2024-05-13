const { parseAst } = require('../../dist/parseAst')

class Module {
    /**
     * 
     * @param {string} code 
     */
    constructor(code) {
        const ast = parseAst(code)
        ast.body.forEach(node => {
            if (node.type === 'ExportNamedDeclaration') ''
        })
    }
}

module.exports = {
    Module,
}