
function ready() {
    let domInNumber = document.querySelector('.js-in-number');

    domInNumber.addEventListener('input', function (e) {
        let current = e.currentTarget;
        let val = current.value.replace(/[^0-9\.]/g, '');

        if (+val <=60) {
            current.value = val;
        } else {
            current.value = val.slice(0, -1);
        }
    });
}

document / addEventListener("DOMContentLoaded", ready)
