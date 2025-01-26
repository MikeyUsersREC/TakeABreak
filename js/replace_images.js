HOSTURL = "https://takeabreak.sector9.lol/"; // replace this if self-hosting - code for this server is in ./backend
if (HOSTURL.substr(HOSTURL.length - 1) !== "/") {
    HOSTURL = HOSTURL + "/"; // testing if the url you provided has a trailing slash (it needs one)
}

// these 5 lines... honestly make no sense but they work.
// basically, because we execute this script N number of times if you press the badge
// the data would be reset if the script is reran. so we need to keep track of the data
testfile = typeof testfile !== "undefined" ? testfile : null;
already_changed_elems = typeof already_changed_elems !== "undefined" ? already_changed_elems : [];
urls = typeof urls !== "undefined" ? urls : [];
oldurls = typeof oldurls !== "undefined" ? oldurls : [];
scrollEventListenerAdded = typeof scrollEventListenerAdded !== "undefined" ? scrollEventListenerAdded : false;

scroll_callback = (event) => {
    _internalLoad();
}

async function checkForScroll() {
    settings = await loadSettings();
    if (scrollEventListenerAdded === false && settings[3] === true) {
        document.addEventListener("scroll", scroll_callback)
        scrollEventListenerAdded = true;
    }
}


async function _onMessage(message) {
    if (message === "sendSignalON") {
        _internalLoad();
        await checkForScroll();
    } else if (message  === "sendSignalOFF") {
        for (let idx = 0; idx < already_changed_elems.length; idx++) {
            let element = already_changed_elems[idx];
            let doc_element = document.getElementById(element.id);
            let chosen_element = doc_element;
            if (!doc_element) {
                let elements = document.getElementsByClassName(element.className);
                for (let elem of elements) {
                    if (elem === element) {
                        chosen_element = elem;
                    }
                }
            }
            if (chosen_element) {
                chosen_element.src = oldurls[idx];
                if (chosen_element.srcset) {
                    chosen_element.srcset = oldurls[idx] + " 1x";
                }
            }
        }
    }
}

if (window.__SIGNAL !== undefined) {
    _onMessage(window.__SIGNAL, already_changed_elems);
}
// utility function
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let rint = Math.floor(Math.random() * (max - min + 1)) + min;
    return rint
}

function _internalLoad() {
    if (window.__DO_NOT_RUN_INTERNAL_LOAD === true) { // chrome's interscript messaging is terrible
        return;
    }
    const images = document.querySelectorAll('img');
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
        if (already_changed_elems.includes(image)) {
            let idx = already_changed_elems.findIndex(x => x === image);
            let url = urls[idx]
            if (url !== image.src) {
                oldurls[idx] = image.src // in the case of reversible listeners!
                image.src = url;
            }

            // console.log("No new elements found.")
        } else {
            // fetch natural image width.. please
            image.width = image.clientWidth || image.naturalWidth;
            image.height = image.clientHeight || image.naturalHeight;
            // to prevent image stretch
            image.style.objectFit = "cover";
            oldurls.push(image.src)
            image.src = image_url;
            if (image.srcset) {
                image.srcset = image.src + " 1x"
            }
            already_changed_elems.push(image);
            urls.push(image.src);
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
    }, 4500)
}


// oh please... why do i have to do this?
function getStatefulSettings() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(
            ['autoChangeOnLoad', 'autoChangeOnClick', 'autoChangeOnBadgeClick', 'autoChangeOnScroll'],
            (items) => {
                resolve([
                    items.autoChangeOnLoad,
                    items.autoChangeOnClick,
                    items.autoChangeOnBadgeClick,
                    items.autoChangeOnScroll
                ]);
            }
        );
    });
}

async function loadSettings() {
    return await getStatefulSettings();
}


async function main() {
    const settings = await loadSettings();

    if (![false, undefined].includes(settings[0])) {
        // initial load script
        window.onload = function() {
            load();
        };
        document.addEventListener('DOMContentLoaded', () => {
            _internalLoad();
        });
    }

    if (![false, undefined].includes(settings[1])) {
        document.addEventListener("click", (event) => {
            _internalLoad(); // god i feel bad doing this but i need to because else it wont replace all images ...
        })
    }


    // if we enable this for settings[2], then on scroll, the image checker will activate, which defeats the purpose of [2]
    if (![false, undefined].includes(settings[3]) && scrollEventListenerAdded === false && (settings[0] || settings[1])) {
         document.addEventListener("scroll", scroll_callback)
        scrollEventListenerAdded = true;
    }
}


main();
