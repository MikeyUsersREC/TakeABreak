
let HOSTURL = "https://takeabreak.sector9.lol/"; // replace this if self-hosting - code for this server is in ./backend
if (HOSTURL.substr(HOSTURL.length - 1) !== "/") {
    HOSTURL = HOSTURL + "/"; // testing if the url you provided has a trailing slash (it needs one)
}
let testfile = null;

// utility function
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let rint = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(rint)
    return rint
}

function _internalLoad() {
    const images = document.querySelectorAll('img');
    console.log("elements")
    console.log(images)
    images.forEach(image => {
        // set source to a random local file in /images
        let local_image;
        let image_url;
        if (!testfile) {
            let number = getRandomInt(1, 12);
            local_image = `images/${number.toString()}.png`;
            image_url = HOSTURL + local_image
        } else {
            local_image = testfile;
            image_url = local_image;
        }
        console.log(image_url);
        image.src = image_url;
        if (image.srcset) {
            image.srcset = image.src
        }
        // image.srcset = image.src;
        // element.src = test_url;
    });
}

// load function
function load() {
    // get all images, replace them by a local image
    setTimeout(function () {
        _internalLoad()
    }, 2500)
}

// initial load script
window.onload = function() {
    load();
};

document.addEventListener("click", (event) => {
    _internalLoad(); // god i feel bad doing this but i need to because else it wont replace all images ...
})