// From: https://stackoverflow.com/questions/16648076/sort-array-on-key-value
export function keySort(key) {
    return function(a, b){
        if (a[key] > b[key]) return 1
        if (a[key] < b[key]) return -1
        return 0
    }
}
