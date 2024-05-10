/**
 * @template T
 */
class GraphNode {
    /**
     * 
     * @param {string} id 
     * @param {T} data 
     */
    constructor(id, data) {
        /** @type {string} */
        this.id = id

        /** @type {T} */
        this.data = data

        /** @type {Map<string, GraphNode<T>>} */
        this.incoming = new Map()

        /** @type {Map<string, GraphNode<T>>} */
        this.outgoing = new Map()
    }
}

/**
 * @template T
 * @typedef {(el:T) => string} HasFn
 */


const _findCycle = Symbol('findCycle')
/**
 * @template T
 */
class BaseGraph {
    /**
     * 
     * @param {HasFn<T>=} _hasFn 
     */
    constructor(_hasFn) {
        this._hasFn = _hasFn ?? ((/** @type {*} */ el) => el.id)
        /** @type {Map<string, GraphNode<T>>} */
        this._nodes = new Map()
    }

    roots() {
        /** @type {GraphNode<T>[]} */
        const roots = []
        for (const node of this._nodes.values()) {
            if (node.outgoing.size === 0) {
                roots.push(node);
            }
        }
        return roots
    }

    /**
     * @param {T} from 
     * @param {T} to 
     */
    insertEdge(from, to) {
        const fromNode = this.lookupOrInsertNode(from)
        const toNode = this.lookupOrInsertNode(to)

        fromNode.outgoing.set(toNode.id, toNode)
        toNode.incoming.set(fromNode.id, fromNode)
    }

    /**
     * 
     * @param {T} data 
     */
    removeNode(data) {
        const key = this._hasFn(data)
        this._nodes.delete(key)

        for (const node of this._nodes.values()) {
            node.outgoing.delete(key);
            node.incoming.delete(key);
        }
    }

    /**
     * @param {T} data
     */
    lookupOrInsertNode(data) {
        const id = this._hasFn(data)
        let node = this._nodes.get(id)

        if (!node) {
            node = new GraphNode(id, data)
            this._nodes.set(id, node)
        }

        return node
    }

    /**
     * 
     * @param {T} data 
     */
    lookup(data) {
        return this._nodes.get(this._hasFn(data))
    }

    isEmpty() {
        return this._nodes.size === 0
    }

    findCycle() {
        for (const [id, node] of this._nodes.entries()) {
            const seen = new Set([id])
            const hasCycle = this[_findCycle](node, seen)
            if (hasCycle) return true
        }
        return false
    }

    /**
     * 
     * @param {GraphNode<T>} node 
     * @param {Set<string>} seen 
     * @returns {boolean}
     */
    [_findCycle](node, seen) {
        for (const [id, outgoing] of node.outgoing) {
            if (seen.has(id)) {
                console.log([...seen, id].join(' -> '))
                return true
            }

            seen.add(id)

            if (this[_findCycle](outgoing, seen)) return true

            seen.delete(id)
        }

        return false
    }
}

/**
 * @template T
 * @extends BaseGraph<T>
 */
class Graph extends BaseGraph {

    /**
     * 
     * @param {HasFn<T>=} _hasFn 
     */
    constructor(_hasFn) {
        super(_hasFn)
    }

}

module.exports = {
    Graph,
    GraphNode
}

