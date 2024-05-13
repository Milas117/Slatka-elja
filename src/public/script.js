function updateCakeShape() {
    var shape = document.getElementById('shape').value;
    var OkruglaCake = document.getElementById('OkruglaCake');
    var PravokutnaCake = document.getElementById('PravokutnaCake');

    if (shape === 'Okrugla') {
        OkruglaCake.style.display = 'block';
        PravokutnaCake.style.display = 'none';
    } else {
        OkruglaCake.style.display = 'none';
        PravokutnaCake.style.display = 'block';
    }
}

function updateCakeColor() {
    var color = document.getElementById('color').value;
    var OkruglaCake = document.getElementById('OkruglaCake');
    var PravokutnaCake = document.getElementById('PravokutnaCake');
    
    OkruglaCake.setAttribute('fill', color);
    PravokutnaCake.setAttribute('fill', color);
}

function updateCakeSize() {
    var size = document.getElementById('size').value;
    var OkruglaCake = document.getElementById('OkruglaCake');
    var PravokutnaCake = document.getElementById('PravokutnaCake');

    if (size === 'Mala') {
        OkruglaCake.setAttribute('r', '50'); 
        PravokutnaCake.setAttribute('width', '100'); 
        PravokutnaCake.setAttribute('height', '100'); 
        PravokutnaCake.setAttribute('x', '100'); 
        PravokutnaCake.setAttribute('y', '100');
    } else if (size === 'Srednja') {
        OkruglaCake.setAttribute('r', '75');
        PravokutnaCake.setAttribute('width', '150');
        PravokutnaCake.setAttribute('height', '150');
        PravokutnaCake.setAttribute('x', '75');
        PravokutnaCake.setAttribute('y', '75');
    } else { // large
        OkruglaCake.setAttribute('r', '100');
        PravokutnaCake.setAttribute('width', '200');
        PravokutnaCake.setAttribute('height', '200');
        PravokutnaCake.setAttribute('x', '50');
        PravokutnaCake.setAttribute('y', '50');
    }
}
function submitSelection() {
    var formData = {
        shape: document.getElementById('shape').value,
        size: document.getElementById('size').value,
        color: document.getElementById('color').value,
        biscuit: document.getElementById('biscuit').value,
        cream: document.getElementById('cream').value,
        kat: document.getElementById('kat').value,
        birthday: document.getElementById('birthday').checked,
        age: document.getElementById('age').value || 0,
        pickupDateTime: new Date(document.getElementById('pickupDate').value),
        totalPrice: parseFloat(document.getElementById('totalPrice').textContent.replace('Ukupna cijena: ', '').replace(' EUR', ''))
    };

    fetch('http://localhost:3000/custom-cake/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
         credentials: 'include',
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                if (confirm('Morate biti prijavljeni da biste izvršili ovu akciju. Želite li se prijaviti sada?')) {
                    window.location.href = '/Prijava.html'; 
                }
                return;
            }
            throw new Error('Greška prilikom slanja podataka. Molimo pokušajte ponovno.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        if (data.status) {
            document.getElementById("mojaforma").reset();
            window.onload();
        }
    })
    .catch(error => {
        console.error('Error:', error);

    });
}


window.onload = function() {
    var form = document.getElementById("mojaforma");
    form.reset(); 
    document.getElementById("shape").selectedIndex = 0;
    document.getElementById("size").selectedIndex = 0;
    document.getElementById("color").value = "#ffffff"; 
    document.getElementById("flavor").selectedIndex = 0;
}

document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("mojaforma");
    if (form) {
        form.reset();
    }
});

function toggleBirthdayOptions() {
    var birthdayCheckbox = document.getElementById('birthday');
    var birthdayOptions = document.getElementById('birthdayOptions');
    birthdayOptions.style.display = birthdayCheckbox.checked ? 'block' : 'none';
}

var candleCost = 0; 

function addCandles() {
    var age = Number(document.getElementById('age').value);
    candleCost = age * 0.05; 
    calculateTotalPrice();
}
function calculateTotalPrice() {
    var basePrice = 10;
    var biscuitPrices = { Jaja: 2, Badem: 3, Orah: 4, default: 0 };
    var creamPrices = { nutella: 5, Pehar: 4, Jogurtica: 3, Šlag: 2, default: 0 };
    var sizePrices = { Mala: 1, Srednja: 3, Velika: 5, default: 0 };
    var katPrices = { JedanKat: 3, DvaKata: 7, TriKata: 12, default: 0 };

    var biscuit = document.getElementById('biscuit').value || "default";
    var cream = document.getElementById('cream').value || "default";
    var size = document.getElementById('size').value || "default";
    var kat = document.getElementById('kat').value || "default";

    var total = basePrice + biscuitPrices[biscuit] + creamPrices[cream] + sizePrices[size] + katPrices[kat] + candleCost;;

    document.getElementById('totalPrice').innerText = "Ukupna cijena: " + total + " EUR";
}

document.getElementById('mojaforma').addEventListener('change', calculateTotalPrice);
window.onload = calculateTotalPrice; 

document.getElementById('pickupDate').addEventListener('change', function() {
    const selectedDate = this.value;
    console.log('Selected date:', selectedDate);

    fetch(`http://localhost:3000/check-date-availability?date=${selectedDate}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                alert('Morate biti prijavljeni da biste provjerili dostupnost datuma.');
                if (confirm('Želite li se prijaviti sada?')) {
                    window.location.href = '/Prijava.html'; // Preusmjeravanje na stranicu za prijavu
                }
                return;
            }
            throw new Error('Failed to check date availability');
        }
        return response.json();
    })
    .then(data => {
        if (!data.isAvailable) {
            alert('Odabrani datum je zauzet. Molimo odaberite drugi datum.');
            document.getElementById('pickupDate').value = ''; // Resetiranje datuma
        }
    })
    .catch(err => {
        console.error('Error:', err);
    });
    
});


