const API_URL = '/api';
let currentStep = 1;
let petData = {};
let ownerData = {};

function openAppointmentModal() {
    document.getElementById('appointmentModal').classList.add('active');
    currentStep = 1;
    showStep(1);
}

function closeModal() {
    document.getElementById('appointmentModal').classList.remove('active');
    resetForms();
}

function showStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step-dot').forEach(dot => dot.classList.remove('active'));
    
    document.getElementById(`step${step}`).classList.add('active');
    document.querySelectorAll('.step-dot').forEach((dot, index) => {
        if (index < step) dot.classList.add('active');
    });
}

function resetForms() {
    document.getElementById('petForm').reset();
    document.getElementById('ownerForm').reset();
    document.getElementById('appointmentForm').reset();
    petData = {};
    ownerData = {};
    currentStep = 1;
}

// Paso 1: Información de la mascota
document.getElementById('petForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    petData = {
        name: document.getElementById('petName').value,
        species: document.getElementById('petSpecies').value,
        breed: document.getElementById('petBreed').value
    };
    
    currentStep = 2;
    showStep(2);
});

// Paso 2: Información del dueño
document.getElementById('ownerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    ownerData = {
        name: document.getElementById('petOwner').value,
        email: document.getElementById('ownerEmail').value,
        phone: document.getElementById('ownerPhone').value
    };
    
    currentStep = 3;
    showStep(3);
    setMinDate();
});

// Paso 3: Agendar cita
document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        // Crear mascota
        const petResponse = await fetch(`${API_URL}/pets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: petData.name,
                species: petData.species,
                breed: petData.breed,
                owner: ownerData.name
            })
        });
        
        const petResult = await petResponse.json();
        const petId = petResult.data.id;
        
        // Crear cita
        const appointmentResponse = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                petId: petId,
                date: document.getElementById('appointmentDate').value,
                time: document.getElementById('appointmentTime').value,
                reason: document.getElementById('appointmentReason').value
            })
        });
        
        if (appointmentResponse.ok) {
            document.getElementById('step3').classList.remove('active');
            document.getElementById('successStep').classList.add('active');
        }
    } catch (error) {
        alert('Error al agendar la cita. Por favor intenta nuevamente.');
    }
});

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').setAttribute('min', today);
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('appointmentModal');
    if (event.target === modal) {
        closeModal();
    }
}
