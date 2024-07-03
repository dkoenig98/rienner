document.addEventListener('DOMContentLoaded', function() {
    const roomTypeSelect = document.getElementById('room-type');
    const guestsInput = document.getElementById('guests');
    const arrivalInput = document.getElementById('arrival');
    const departureInput = document.getElementById('departure');
    const totalPriceInput = document.getElementById('total-price');
    const breakfastCheckbox = document.getElementById('breakfast');
    const accommodationTypes = document.querySelectorAll('.accommodation-type');
    const guestButtons = document.getElementById('guest-buttons');

    // Simulierte Verfügbarkeit (in der Realität würde dies vom Server kommen)
    const availability = {
        einzelzimmer: 5,
        schlaflager: 20
    };

    // Kalenderkonfiguration
    flatpickr("#arrival", {
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: updateAvailability
    });

    flatpickr("#departure", {
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: updateAvailability
    });

    // Erstellen der Gäste-Buttons
    for (let i = 1; i <= 5; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.type = 'button';
        button.classList.add('guest-button');
        button.addEventListener('click', function() {
            guestsInput.value = i;
            updateAvailability();
        });
        guestButtons.appendChild(button);
    }

    function updateAvailability() {
        const roomType = roomTypeSelect.value;
        const guests = parseInt(guestsInput.value) || 0;

        if (roomType && guests) {
            if (roomType === 'einzelzimmer' && guests <= availability.einzelzimmer) {
                enableDateInputs();
            } else if (roomType === 'schlaflager' && guests <= availability.schlaflager) {
                enableDateInputs();
            } else {
                disableDateInputs();
            }
        }

        updateTotalPrice();
    }

    function enableDateInputs() {
        arrivalInput.disabled = false;
        departureInput.disabled = false;
    }

    function disableDateInputs() {
        arrivalInput.disabled = true;
        departureInput.disabled = true;
        arrivalInput.value = '';
        departureInput.value = '';
    }

    function updateTotalPrice() {
        const roomType = roomTypeSelect.value;
        const guests = parseInt(guestsInput.value) || 0;
        const arrival = new Date(arrivalInput.value);
        const departure = new Date(departureInput.value);
        const breakfast = breakfastCheckbox.checked;
    
        let price = 0;
    
        if (roomType && guests && !isNaN(arrival) && !isNaN(departure)) {
            const nights = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24));
    
            if (roomType === 'einzelzimmer') {
                // Berechnung für Einzelzimmer
                const numberOfRooms = Math.ceil(guests);
                price = 20 * numberOfRooms * nights;
            } else if (roomType === 'schlaflager') {
                price = 10 * guests * nights;
            }
    
            if (breakfast) {
                price += 20 * guests * nights;
            }
        }
    
        totalPriceInput.value = `${price.toFixed(2)}€`;
    }

    // Event Listeners
    roomTypeSelect.addEventListener('change', updateAvailability);
    guestsInput.addEventListener('input', updateAvailability);
    arrivalInput.addEventListener('change', updateTotalPrice);
    departureInput.addEventListener('change', updateTotalPrice);
    breakfastCheckbox.addEventListener('change', updateTotalPrice);

    // Klickbare Unterkunftstypen
    accommodationTypes.forEach(type => {
        type.addEventListener('click', function() {
            const selectedType = this.dataset.type;
            roomTypeSelect.value = selectedType;
            roomTypeSelect.dispatchEvent(new Event('change'));
            document.getElementById('booking-form').scrollIntoView({behavior: 'smooth'});
        });
    });

    // Formularverarbeitung
    document.getElementById('booking-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Vielen Dank für Ihre Reservierungsanfrage. Wir werden uns in Kürze bei Ihnen melden, um die Verfügbarkeit zu bestätigen.');
    });

    // Initialisierung
    updateAvailability();
    updateTotalPrice();
    resetNavbarOnLoad();
});