
let tColorA = document.getElementById('tColorA'),
	tColorB = document.getElementById('tColorB'),
	tColorC = document.getElementById('tColorC'),
	iconA = document.querySelector('#tColorA i'),
	iconB = document.querySelector('#tColorB i'),
	iconC = document.querySelector('#tColorC i');

let sectionCard = document.getElementById('section-card');
let sectionBank = document.getElementById('section-bank');
let sectionGcash = document.getElementById('section-gcash');

// switch functions
function doFun(){
	tColorA.style.color = "#0077b6";
	tColorB.style.color = "#00b4d8";
	tColorC.style.color = "#00b4d8";

	iconA.style.color = "#0077b6";
	iconB.style.color = "#90e0ef";
	iconC.style.color = "#90e0ef";

	sectionCard.style.display = "block";
	sectionBank.style.display = "none";
	sectionGcash.style.display = "none";
}

function doFunA(){
	tColorA.style.color = "#00b4d8";
	tColorB.style.color = "#0077b6";
	tColorC.style.color = "#00b4d8";

	iconA.style.color = "#90e0ef";
	iconB.style.color = "#0077b6";
	iconC.style.color = "#90e0ef";

	sectionCard.style.display = "none";
	sectionBank.style.display = "block";
	sectionGcash.style.display = "none";
}

function doFunB(){
	tColorA.style.color = "#00b4d8";
	tColorB.style.color = "#00b4d8";
	tColorC.style.color = "#0077b6";

	iconA.style.color = "#90e0ef";
	iconB.style.color = "#90e0ef";
	iconC.style.color = "#0077b6";

	sectionCard.style.display = "none";
	sectionBank.style.display = "none";
	sectionGcash.style.display = "block";
}




 document.addEventListener('DOMContentLoaded', function() {
  doFun();
});




//FOR PAYMENTS JAVASCRIPT
//======PAYPAL BUTTON======>
let currentPhpAmount = 0;

function updatePaypalButton() {
  const usdAmount = parseFloat(document.getElementById('usdAmount').value);
  if (isNaN(usdAmount) || usdAmount < 0) {
    alert('Please enter a valid amount.');
    return;
  }

  fetch('https://api.exchangerate-api.com/v4/latest/USD')
    .then(response => response.json())
    .then(data => {
      const exchangeRate = data.rates.PHP;
      currentPhpAmount = (usdAmount * exchangeRate).toFixed(2);
      document.getElementById('convertedAmount').innerText = 'Converted Amount: ₱' + currentPhpAmount;
      renderPayPalButton(currentPhpAmount);
    })
    .catch(error => {
      console.error('Error fetching exchange rate:', error);
      alert('Failed to fetch exchange rate. Please try again.');
    });
}

function renderPayPalButton(amount) {
  document.getElementById('paypal-button-container').innerHTML = '';
  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{ amount: { currency_code: 'PHP', value: amount } }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('Transaction completed by ' + details.payer.name.given_name);
      });
    },
    onError: function(err) {
      console.error('PayPal error:', err);
      alert('An error occurred during the transaction.');
    }
  }).render('#paypal-button-container');
}

document.getElementById('updateButton').addEventListener('click', updatePaypalButton);
window.onload = updatePaypalButton;


// ===== BOOKING INFO PANEL =====>
function renderBookingDetails() {
  const bookingDetailsDiv = document.querySelector('.right .details');
  bookingDetailsDiv.innerHTML = ''; // clear first

  const hotelBooking = JSON.parse(sessionStorage.getItem('hotelBooking') || '{}');
  const flightBooking = JSON.parse(sessionStorage.getItem('flightBooking') || '{}');

  let html = '';

  if (Object.keys(hotelBooking).length > 0) {
    html += '<div style="font-weight:bold; padding:3px 0;">Hotel Booking</div><ul style="list-style:none; padding:0; margin:0;">';
    for (const key in hotelBooking) {
      html += `<li style="padding:3px 0;"><strong>${key.replace('_',' ')}:</strong> ${hotelBooking[key]}</li>`;
    }
    html += '</ul><hr>';
  }

  if (Object.keys(flightBooking).length > 0) {
    html += '<div style="font-weight:bold; padding:3px 0;">Flight Booking</div><ul style="list-style:none; padding:0; margin:0;">';
    for (const key in flightBooking) {
      html += `<li style="padding:3px 0;"><strong>${key.replace('_',' ')}:</strong> ${flightBooking[key]}</li>`;
    }
    html += '</ul><hr>';
  }

  bookingDetailsDiv.innerHTML = html;
}
//INITIALIZE PANEL OF PAGE LOAD
renderBookingDetails();



//=====HELPER TO SAVE BOOKINGS DYNAMICALLY FROM flights.html or hotels.html
function saveBooking(type, details) {
  if (type === 'hotel') sessionStorage.setItem('hotelBooking', JSON.stringify(details));
  if (type === 'flight') sessionStorage.setItem('flightBooking', JSON.stringify(details));
  renderBookingDetails();
}
//LISTEN FOR STORAGE CHANGES IN CASE USER SUBMITS IN ANOTHER TAB
window.addEventListener('storage', () => {
  renderBookingDetails();
});



//=====FLIGHT FORM BEHAVIOR=====>
document.addEventListener('DOMContentLoaded', () => {
  const tripTypeRadios = document.querySelectorAll('input[name="trip_type"]');
  const dateFields = document.getElementById('date-fields');

  function toggleDateFields() {
    const selectedValue = document.querySelector('input[name="trip_type"]:checked').value;
    if (selectedValue === 'roundtrip') {
      dateFields.style.display = 'flex'; // Show date fields
    } else {
      dateFields.style.display = 'none'; // Hide date fields
    }
  }
  // INITIALIZE ON PAGE LOAD
  toggleDateFields();

  // ADD EVENT LISTENERS
  tripTypeRadios.forEach(radio => {
    radio.addEventListener('change', toggleDateFields);
  });
});



//======UPLOADING RECEIPT PAYMENTS ===== -->
document.querySelectorAll('.uploadForm').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    // Optional: you can add additional data here if needed

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(data => alert('Upload successful!'))
    .catch(error => alert('Error uploading files.'));
  });
});

// OPTIONAL: CHANGE BUTTON TEXT ON HOVER 
  const button = document.getElementById('uploadButton');

  button.addEventListener('mouseenter', () => {
    button.textContent = 'Click to Upload!';
  });

  button.addEventListener('mouseleave', () => {
    button.textContent = 'Upload';
  });



//======FUNCTION TO DISPLAY BOOKING DETAILS FROM sessionStorage======>
function displayBookingInfo() {
  const detailsDiv = document.querySelector('.right .details');
  detailsDiv.innerHTML = ''; // Clear existing content

  const hotelBooking = JSON.parse(sessionStorage.getItem('hotelBooking') || '{}');
  const flightBooking = JSON.parse(sessionStorage.getItem('flightBooking') || '{}');

  let html = '';

  if (Object.keys(hotelBooking).length > 0) {
    html += '<div style="font-weight:bold; padding:3px 0;">Hotel Booking</div><ul style="list-style:none; padding:0; margin:0;">';
    for (const key in hotelBooking) {
      html += `<li style="padding:3px 0;"><strong>${key.replace('_',' ')}:</strong> ${hotelBooking[key]}</li>`;
    }
    html += '</ul><hr>';
  }

  if (Object.keys(flightBooking).length > 0) {
    html += '<div style="font-weight:bold; padding:3px 0;">Flight Booking</div><ul style="list-style:none; padding:0; margin:0;">';
    for (const key in flightBooking) {
      html += `<li style="padding:3px 0;"><strong>${key.replace('_',' ')}:</strong> ${flightBooking[key]}</li>`;
    }
    html += '</ul><hr>';
  }

  detailsDiv.innerHTML = html;
}

//CALL THIS FUNCTION WHEN PAGE LOADS
window.addEventListener('DOMContentLoaded', () => {
  displayBookingInfo();
});


//FOR VISA BOOKING PROCESS
  function loadVisaBooking() {
    const bookingStr = sessionStorage.getItem('visaBooking');
    if (bookingStr) {
      const booking = JSON.parse(bookingStr);
      if (booking && booking.data) {
        const container = document.querySelector('.right .details');
        let html = '';

        html += `<div style="font-weight:bold; padding:3px 0;">Visa Booking Details</div>`;
        html += `<ul style="list-style:none; padding:0; margin:0;">`;
        for (const key in booking.data) {
          html += `<li style="padding:3px 0;"><strong>${key.replace('_',' ')}:</strong> ${booking.data[key]}</li>`;
        }
        if (booking.visaDetails) {
          html += `<li style="padding:3px 0;"><strong>Visa Type:</strong> ${booking.visaDetails.visa_type}</li>`;
          html += `<li style="padding:3px 0;"><strong>Process:</strong> ${booking.visaDetails.process}</li>`;
        }
        html += `</ul>`;
        if (container) container.innerHTML = html;
      }
    }
  }

  // Call this function along with displayBookingInfo() on page load
  document.addEventListener('DOMContentLoaded', () => {
    displayBookingInfo();
    loadVisaBooking();
  });

