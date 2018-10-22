export function ObjectBuilder(mapping) {
    if (mapping === undefined) {
        mapping = {}
    }

    function build() {
        return mapping
    }

    function put(key, value) {
        mapping[key] = value
        return ObjectBuilder(mapping)
    }

    return {
        build: build,
        put: put
    }
}