const cakeDetails = {
    'mađarica': { price: 0.50, calories: 250 },
    'ruskakapa': { price: 0.60, calories: 300 },
    'bijelapita': { price: 0.50, calories: 180 },
    'lidija': { price: 0.50, calories: 220 },
    'monte': { price: 0.30, calories: 210 },
    'breskvice': { price: 1.00, calories: 260 },
    'čupavci': { price: 0.50, calories: 190 }
};
document.addEventListener('DOMContentLoaded', function() {
 
    
    const tray = document.getElementById('tray');
    const multiSelectModeCheckbox = document.getElementById('multi-select-mode');
    const deleteButton = document.getElementById('delete-button');

    for (let i = 0; i < 24; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.id = `slot-${i + 1}`;
        tray.appendChild(slot);

        slot.addEventListener('click', function() {
            if (multiSelectModeCheckbox.checked) {
                this.classList.toggle('selected');
            } else {
                document.querySelectorAll('.slot.selected').forEach(s => s.classList.remove('selected'));
                this.classList.add('selected');
            }
            document.getElementById('popup').style.display = 'block';
            document.getElementById('current-slot').value = this.id;
            updateCaloriesInfo();
            deleteButton.style.display = this.dataset.cake ? 'block' : 'none';
        });
    }

    document.getElementById('cakeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitCakeForm();
    });

    multiSelectModeCheckbox.addEventListener('change', toggleMultiSelectMode);

    function submitCakeForm() {
        const cakeType = document.getElementById('cakeType').value;
        const selectedSlots = document.querySelectorAll('.slot.selected');
        

        selectedSlots.forEach(function(slot) {
            slot.textContent = cakeType;
            slot.dataset.cake = cakeType;
            slot.classList.remove('selected');
        });

        updateTotalPrice();
        updateTotalCalories();
        document.getElementById('popup').style.display = 'none';
    }

    function toggleMultiSelectMode() {
        const isChecked = multiSelectModeCheckbox.checked;
        document.querySelectorAll('.slot').forEach(slot => slot.classList.remove('selected'));
        document.getElementById('popup').style.display = isChecked ? 'block' : 'none';
    }

    function updateTotalPrice() {
        const slots = document.querySelectorAll('.slot[data-cake]');
        let totalPrice = 0;
        slots.forEach(slot => {
            const cakeType = slot.dataset.cake;
            totalPrice += cakeDetails[cakeType].price;
        });
        document.getElementById('total-price').textContent = `${totalPrice.toFixed(2)} €`;
    }

    function updateCaloriesInfo() {
        const cakeType = document.getElementById('cakeType').value;
        const calories = cakeDetails[cakeType].calories;
        document.getElementById('calories-info').textContent = ` ${calories}`;
        updateTotalCalories();
    }

    function updateTotalCalories() {
        const slots = document.querySelectorAll('.slot[data-cake]');
        let totalCalories = 0;
        slots.forEach(slot => {
            const cakeType = slot.dataset.cake;
            totalCalories += cakeDetails[cakeType].calories;
        });
        document.getElementById('total-calories-info').textContent = ` ${totalCalories}`;
    }

    document.getElementById('delete-button').addEventListener('click', function() {
        const currentSlot = document.getElementById('current-slot').value;
        const slot = document.getElementById(currentSlot);
        if (slot.dataset.cake) {
            slot.textContent = '';
            slot.classList.remove('selected');
            delete slot.dataset.cake;

            updateTotalPrice();
            updateTotalCalories();

            document.getElementById('popup').style.display = 'none';
            deleteButton.style.display = 'none';
        }
    });
});


    document.getElementById('delete-button').addEventListener('click', function() {
    const currentSlot = document.getElementById('current-slot').value;
    const slot = document.getElementById(currentSlot);
    if (slot.dataset.cake) {

        slot.textContent = '';

        slot.classList.remove('selected');

        delete slot.dataset.cake;

        updateTotalPrice();
        updateTotalCalories();

        document.getElementById('popup').style.display = 'none';
        document.getElementById('delete-button').style.display = 'none';
    }
    });

    document.getElementById('order-button').addEventListener('click', function() {
        document.getElementById('trayModal').style.display = 'block';
    });
    
    document.addEventListener('DOMContentLoaded', function() {
        const closeButton = document.querySelector('.close'); 
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                const modal = document.getElementById('orderModal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        }
    
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('orderModal');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    
    function confirmOrder() {
        const trayCount = document.getElementById('tray-count').value;
        const pickupDate = document.getElementById('pickupDate').value; 
        const slots = document.querySelectorAll('.slot[data-cake]');
        const trayData = {
            studentId: window.studentId,
            trayCount: trayCount,
            cakes: [],
            totalPrice: 0,
            pickupDate: pickupDate  
        };
    
        slots.forEach(slot => {
            if (slot.dataset.cake) {
                const cakeType = slot.dataset.cake;
                let cake = trayData.cakes.find(c => c.cakeType === cakeType);
                if (cake) {
                    cake.count += 1;
                } else {
                    trayData.cakes.push({
                        cakeType: cakeType,
                        count: 1,
                        pricePerPiece: cakeDetails[cakeType].price
                    });
                }
            }
        });
    
        trayData.cakes.forEach(cake => {
            trayData.totalPrice += (cake.count * cake.pricePerPiece);
        });
    
        fetch('/save-tray', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trayData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Morate biti prijavljeni da biste izvršili ovu akciju.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Tray saved:', data);
            document.getElementById('trayModal').style.display = 'none';
            alert('Hvala na narudžbi ' + trayCount + ' tacni!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Došlo je do greške: ' + error.message);
            if (confirm(error.message + ' Želite li se prijaviti sada?')) {
                window.location.href = '/Prijava.html'; 
            }
        });
    }
    

