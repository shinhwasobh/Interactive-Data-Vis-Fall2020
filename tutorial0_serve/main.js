const data = ['duck', 'duck', 'goose']

const testMap = data[0].map(d => d + "!")
console.log(testMap)

const gooseCheck = false
console.log(gooseCheck ? 'Its a goose' : "Don't worry, it's a duck")

console.log('this is the data: ${data}')

const info = data.map(
    (d,i) => "the ${i}th element is ${d === 'goose'? 'A GOOSE!!' : 'just a duck...'}"
)

console.log(info)