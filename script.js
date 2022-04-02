//If live, change to external api access rather than local
let coo = ["oceania", "north america", "south america", "africa", "asia"]
let legs = [2, 4, 6]
let animal_category = ["bird", "insect", "mammal"]
let topic_domain = ["Javascript", "SQL", "The Web", "CS Thinking"]
let allTogether = [...coo, ...legs, ...animal_category, ...topic_domain]
let arrayOfArrays = [coo, legs, animal_category, topic_domain]
// console.log(arrayOfArrays)
allTogether = allTogether.sort(() => Math.random() - 0.5)
console.log(allTogether)
let linksListLOL = {
    "coo": coo,
    "legs": legs,
    "animal_category": animal_category,
    "topic_domain": topic_domain
}

async function init() {
    let req = await fetch("http://localhost:3000/menagerie")
    let data = await req.json()

    let categoryAndAnimalsObject = await fillObjectArray(data)
    // console.log("Full thing", categoryAndAnimalsObject[1])
    let disordered = ["00", "01", "02", "03", "10", "11", "12", "13", "20", "21", "22", "23", "30", "31", "32", "33"]
    disordered = shuffleArray(disordered)
    disordered = disordered.sort(() => Math.random() - 0.5)

    let grid = {}

    /*Add id to all the div cards*/
    for (let i = 1; i < 5; i++) {
        let parents = document.getElementById(i).getElementsByClassName("card")
        for (let j = 0; j < 4; j++) {
            let idVal = String(i - 1).concat(String(j))
            parents[j].setAttribute("id", idVal)
            grid[idVal] = categoryAndAnimalsObject[i][j]
        }
    }

    // console.log(grid)

    // Add img tag to all the divs//
    for (let d = 0; d < disordered.length; d++) {
        let coordinate = disordered[d]
        parentDiv = document.getElementById(coordinate);
        // console.log(grid[coordinate])
        let img = document.createElement("img")
        img.setAttribute("src", grid[coordinate].cover_src)
        img.setAttribute("alt", grid[coordinate].cover_src)

        img.addEventListener("click", async (e) => {
            let animalName = grid[e.path[1].id].animal
            let req2 = await fetch("https://api.openai.com/v1/engines/text-davinci-002/completions", {
                method: "POST",
                headers: {
                    Authorization: "Bearer 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",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: `Make up a fun-fact about this animal: ${animalName}`,
                    temperature: 0.7,
                    max_tokens: 256,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                })
            });

            let res2 = await req2.json();
            console.log(res2.choices[0].text)
            let textBox = document.createElement("div");
            textBox.innerText = res2.choices[0].text;
            e.path[1].append(textBox);
            return res2;
        })
        parentDiv.append(img)
    }
    return categoryAndAnimalsObject
}

document.addEventListener("DOMContentLoaded", init)

function valueWithinBounds(obj) {
    try {
        if (Array.isArray(obj)) {
            return obj[Math.floor(Math.random() * obj.length)]
        } else if (typeof (obj) === "object") {
            let num = Math.floor(Math.random() * Object.values(obj).length)
            // console.log("Object:",Object.values(obj)[num])
            // console.log("Index:",num)
            return Object.values(obj)[num]
        }
    } catch (err) {
        console.error(err)
    }
}

async function findCategoryAndArrayOfAnimals(jsonData, index) {
    let arrayOfCards = []

    // let links = valueWithinBounds(linksListLOL)
    let link = allTogether[index];
    console.log("The commonality is:", link)
    
    let linkCategoryName = Object.keys(linksListLOL).find((arraysInLLLByName,index) => {
        // console.log("Trying: ",arrayOfArrays[index]);
        return arrayOfArrays[index].includes(link)
    })
    console.log(linkCategoryName)
    
    for (let i in jsonData) {
        if (jsonData[i].chosen === undefined) {
            if (jsonData[i].cat[linkCategoryName] === link) {
                console.log(linkCategoryName)
                arrayOfCards.push(jsonData[i])
                jsonData[i].chosen = true
                if (arrayOfCards.length === 4) {
                    let returnVal = new Object();
                    returnVal[linkCategoryName] = arrayOfCards
                    return returnVal
                }
            }
        }
    }


}

async function fillObjectArray(data) {
    /*This is a function that doesn't take arguments but returns an array of four objects. 
    The Key of those objects is Commonality between the values of the Value. {"Commonality" :[Four Animals] }

    */
    let obj1, obj2, obj3, obj4

    obj1 = await findCategoryAndArrayOfAnimals(data, 0)
    obj2 = await findCategoryAndArrayOfAnimals(data, 1)
    obj3 = await findCategoryAndArrayOfAnimals(data, 2)
    obj4 = await findCategoryAndArrayOfAnimals(data, 3)

    let commonalities = [Object.keys(obj1)[0], Object.keys(obj2)[0], Object.keys(obj3)[0], Object.keys(obj4)[0]]
    let array1 = obj1[Object.keys(obj1)[0]]
    let array2 = obj2[Object.keys(obj2)[0]]
    let array3 = obj3[Object.keys(obj3)[0]]
    let array4 = obj4[Object.keys(obj4)[0]]
    console.log(commonalities)
    // let arrayOfTopicObjects = [obj1.key]

    let arrayOfTopicObjects = [commonalities, array1, array2, array3, array4]
    console.log(arrayOfTopicObjects)
    return arrayOfTopicObjects
}


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {

        // Generate random number
        var j = Math.floor(Math.random() * (i + 1));

        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}




//     //Iterate through elements by their first_letter_grouping 
//     //Remove those elements for which their .animal property is the same
//     //Remove the substring "pair" or ", pair" when not part of the animal's name
//     //Remove prepostitional phrases when not part of the animals name and ", [PP]"
//         //Present name and suggested PATCH alteration
//             //If YES:
//                 //PATCH with alteration
//             //If NO:
//                 //BREAK;



// function fillArray(jsonData) {
//     let categoryAndArrayOfAnimals = findCategoryAndArrayOfAnimals(jsonData);
//     let categoryName = String(categoryAndArrayOfAnimals[0])
//     let arrayOfCategoryElements = categoryAndArrayOfAnimals[1]
//     let returnVal = new Object;
//     returnVal[categoryName] = arrayOfCategoryElements
//     return returnVal;
// }