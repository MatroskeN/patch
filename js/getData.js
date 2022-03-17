Number.prototype.between = function(a, b, inclusive) {
    var min = Math.min.apply(Math, [a, b]),
        max = Math.max.apply(Math, [a, b]);
    return inclusive ? this >= min && this <= max : this > min && this < max;
}

async function getAroma(gender, score){
    let data = window.INITIAL_STATE;
    let newArr = data.filter((item) => item.gender === gender)
    let result;
    newArr.forEach((item) => {
        if (score.between(item.scoreMin, item.scoreMax, true)){
            result = item
        }
    })
    return result
}


// test
getAroma('IT MATTERS NOT', 19).then((res) => {
    console.log(res)
})