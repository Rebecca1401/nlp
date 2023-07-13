function handleSubmit(event) {
    event.preventDefault()

    let formText = document.getElementById('url').value

    if (!formText || formText.length <=0) {
        return;
    }

    let invalid = document.getElementById('invalid')
    let form_result = document.getElementById('form_result')
    let result = document.getElementById('results')
    let url_pattern = new RegExp("(www.|http://|https://|ftp://)\w*");
    const isURL = url_pattern.test(formText)
    invalid.style.display = "none"
    form_result.style.display = "block"

    const option = {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({
            formText: formText
        })
    }

    let urlPath = '/aylien'
    if (isURL) {
        urlPath = '/text'
    }

    fetch(urlPath, option).then(res => {
        return res.json()

    })
        .then(function(data) {
            console.log(data)
            //make user see the  data
            for (let i in data.items) {
                const item = data.items[i];
                result.innerHTML += `<div class="article"><span class="title">${item.title}</span> <span class="source">${item.source} <br><span class="sentiment">(${item.polarity} / ${item.polarityScore}) </span><br> <div class="abody">${item.body}</div></div`
            }
            //empty data array  after send to user to ready for new data
            data = []

        })
    console.log("::: Form Submitted :::")

    const showURLError = false // not needed anymore cause we have two ways to retrieve data
    if (showURLError) {
        // when url construction is not valid
        console.log("no")
        invalid.style.cssText = "display:block ; color:#e60000 ; font-size: 20px  ; text-shadow: 0.5px 0.5px 1px black; "
        invalid.textContent = "*  write valid url"
        form_result.style.display = "none"
    }

}
//export function to import it in src/client/index.js to make webpack deal with it
export {
    handleSubmit
}
