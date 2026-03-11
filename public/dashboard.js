const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) {
    window.location.href = '/login.html';
}

document.getElementById('userName').textContent = user.name || 'Usuario';

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

async function loadDashboard() {
    await Promise.all([loadAppointments(), loadPets(), loadRecords()]);
    updateStats();
}

async function loadAppointments() {
    try {
        const response = await fetch(`${API_URL}/appointments`, { headers: getHeaders() });
        const result = await response.json();
        
        if (!result.success) {
            console.error('Error al cargar citas');
            return;
        }
        
        const appointments = result.data || [];
        
        const petsResponse = await fetch(`${API_URL}/pets`);
        const petsResult = await petsResponse.json();
        const pets = petsResult.data || [];
        
        const tbody = document.getElementById('appointmentsTable');
        tbody.innerHTML = appointments.map(apt => {
            const pet = pets.find(p => p.id === apt.petId);
            return `
                <tr>
                    <td>${apt.id}</td>
                    <td>${pet ? pet.name : 'N/A'}</td>
                    <td>${apt.date}</td>
                    <td>${apt.time}</td>
                    <td>${apt.reason}</td>
                    <td><span class="status status-${apt.status}">${apt.status}</span></td>
                    <td>
                        <button class="btn btn-success" onclick="updateStatus(${apt.id}, 'confirmed')">Confirmar</button>
                        <button class="btn btn-primary" onclick="viewDetails(${apt.id})">Ver</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadPets() {
    try {
        const response = await fetch(`${API_URL}/pets`);
        const result = await response.json();
        const pets = result.data || [];
        
        const tbody = document.getElementById('petsTable');
        tbody.innerHTML = pets.map(pet => `
            <tr>
                <td>${pet.id}</td>
                <td>${pet.name}</td>
                <td>${pet.species}</td>
                <td>${pet.breed || 'N/A'}</td>
                <td>${pet.owner}</td>
                <td>
                    <button class="btn btn-primary" onclick="viewPetHistory(${pet.id})">Historial</button>
                </td>
            </tr>
        `).join('');
        
        const select = document.getElementById('recordPetId');
        select.innerHTML = '<option value="">Selecciona una mascota</option>' + 
            pets.map(pet => `<option value="${pet.id}">${pet.name} - ${pet.owner}</option>`).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadRecords() {
    try {
        const response = await fetch(`${API_URL}/medical-records`, { headers: getHeaders() });
        const result = await response.json();
        const records = result.data || [];
        
        const petsResponse = await fetch(`${API_URL}/pets`, { headers: getHeaders() });
        const petsResult = await petsResponse.json();
        const pets = petsResult.data || [];
        
        const tbody = document.getElementById('recordsTable');
        tbody.innerHTML = records.map(record => {
            const pet = pets.find(p => p.id === record.petId);
            return `
                <tr>
                    <td>${record.id}</td>
                    <td>${pet ? pet.name : 'N/A'}</td>
                    <td>${record.diagnosis}</td>
                    <td>${record.treatment}</td>
                    <td>${new Date(record.date).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-primary" onclick="viewRecord(${record.id})">Ver</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateStats() {
    fetch(`${API_URL}/appointments`, { headers: getHeaders() })
        .then(r => r.json())
        .then(result => {
            if (result.success) {
                const appointments = result.data || [];
                document.getElementById('totalAppointments').textContent = appointments.length;
                
                const today = new Date().toISOString().split('T')[0];
                const todayAppts = appointments.filter(a => a.date === today);
                document.getElementById('todayAppointments').textContent = todayAppts.length;
                
                const pending = appointments.filter(a => a.status === 'pending');
                document.getElementById('pendingAppointments').textContent = pending.length;
            }
        });
    
    fetch(`${API_URL}/pets`)
        .then(r => r.json())
        .then(result => {
            document.getElementById('totalPets').textContent = (result.data || []).length;
        });
}

function showTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
}

async function updateStatus(id, status) {
    try {
        await fetch(`${API_URL}/appointments/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        loadAppointments();
    } catch (error) {
        alert('Error al actualizar');
    }
}

function openRecordModal() {
    document.getElementById('recordModal').classList.add('active');
}

function closeRecordModal() {
    document.getElementById('recordModal').classList.remove('active');
}

document.getElementById('recordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const record = {
        petId: parseInt(document.getElementById('recordPetId').value),
        veterinarianId: user.id,
        diagnosis: document.getElementById('recordDiagnosis').value,
        treatment: document.getElementById('recordTreatment').value,
        notes: document.getElementById('recordNotes').value
    };
    
    try {
        await fetch(`${API_URL}/medical-records`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(record)
        });
        
        closeRecordModal();
        loadRecords();
        e.target.reset();
    } catch (error) {
        alert('Error al guardar');
    }
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

function viewDetails(id) {
    alert('Ver detalles de cita #' + id);
}

function viewPetHistory(id) {
    alert('Ver historial de mascota #' + id);
}

function viewRecord(id) {
    alert('Ver registro médico #' + id);
}

loadDashboard();
