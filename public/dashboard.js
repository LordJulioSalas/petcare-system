const API_URL = '/api';
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
            const pet = pets.find(p => p._id === apt.petId || p._id === apt.petId?._id);
            const petName = apt.petId?.name || pet?.name || 'N/A';
            const notes = apt.notes ? `<br><small style="color: #666;">💬 ${apt.notes}</small>` : '';
            return `
                <tr>
                    <td>${apt._id}</td>
                    <td>${petName}</td>
                    <td>${apt.date}</td>
                    <td>${apt.time}</td>
                    <td>${apt.reason}${notes}</td>
                    <td><span class="status status-${apt.status}">${apt.status}</span></td>
                    <td>
                        <button class="btn btn-success" onclick="updateStatus('${apt._id}', 'confirmed')">Confirmar</button>
                        <button class="btn btn-primary" onclick="viewDetails('${apt._id}')">Ver</button>
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
                <td>${pet._id}</td>
                <td>${pet.name}</td>
                <td>${pet.species}</td>
                <td>${pet.breed || 'N/A'}</td>
                <td>${pet.owner}</td>
                <td>
                    <button class="btn btn-primary" onclick="viewPetHistory('${pet._id}')">Historial</button>
                </td>
            </tr>
        `).join('');
        
        const select = document.getElementById('recordPetId');
        select.innerHTML = '<option value="">Selecciona una mascota</option>' + 
            pets.map(pet => `<option value="${pet._id}">${pet.name} - ${pet.owner}</option>`).join('');
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
            const pet = pets.find(p => p._id === record.petId || p._id === record.petId?._id);
            const petName = record.petId?.name || pet?.name || 'N/A';
            return `
                <tr>
                    <td>${record._id}</td>
                    <td>${petName}</td>
                    <td>${record.diagnosis}</td>
                    <td>${record.treatment || 'N/A'}</td>
                    <td>${new Date(record.date).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-primary" onclick="viewRecord('${record._id}')">Ver</button>
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
        petId: document.getElementById('recordPetId').value,
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
    fetch(`${API_URL}/appointments/${id}`, { headers: getHeaders() })
        .then(r => r.json())
        .then(result => {
            if (result.success) {
                const apt = result.data;
                const pet = apt.petId;
                
                const content = `
                    <div style="display: grid; gap: 20px;">
                        <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
                            <h3 style="color: #2C5F7C; margin-bottom: 15px;">🐾 Información del Paciente</h3>
                            <p><strong>Nombre:</strong> ${pet?.name || 'N/A'}</p>
                            <p><strong>Especie:</strong> ${pet?.species || 'N/A'}</p>
                            <p><strong>Raza:</strong> ${pet?.breed || 'No especificada'}</p>
                            <p><strong>Dueño:</strong> ${pet?.owner || 'N/A'}</p>
                        </div>
                        
                        <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
                            <h3 style="color: #2C5F7C; margin-bottom: 15px;">📅 Detalles de la Cita</h3>
                            <p><strong>ID Cita:</strong> #${apt._id}</p>
                            <p><strong>Fecha:</strong> ${apt.date}</p>
                            <p><strong>Hora:</strong> ${apt.time}</p>
                            <p><strong>Motivo:</strong> ${apt.reason}</p>
                            ${apt.notes ? `<p><strong>Comentarios:</strong> ${apt.notes}</p>` : ''}
                            <p><strong>Estado:</strong> <span class="status status-${apt.status}">${apt.status}</span></p>
                        </div>
                        
                        <div style="display: flex; gap: 10px; justify-content: flex-end;">
                            <button class="btn btn-success" onclick="updateStatus('${apt._id}', 'confirmed'); closeDetailsModal();">Confirmar</button>
                            <button class="btn btn-primary" onclick="updateStatus('${apt._id}', 'completed'); closeDetailsModal();">Completar</button>
                            <button class="btn btn-danger" onclick="updateStatus('${apt._id}', 'cancelled'); closeDetailsModal();">Cancelar</button>
                        </div>
                    </div>
                `;
                
                document.getElementById('appointmentDetailsContent').innerHTML = content;
                document.getElementById('appointmentDetailsModal').classList.add('active');
            }
        });
}

function closeDetailsModal() {
    document.getElementById('appointmentDetailsModal').classList.remove('active');
}

function closePetHistoryModal() {
    document.getElementById('petHistoryModal').classList.remove('active');
}

function viewPetHistory(id) {
    Promise.all([
        fetch(`${API_URL}/pets/${id}`, { headers: getHeaders() }).then(r => r.json()),
        fetch(`${API_URL}/medical-records`, { headers: getHeaders() }).then(r => r.json()),
        fetch(`${API_URL}/appointments`, { headers: getHeaders() }).then(r => r.json())
    ]).then(([petResult, recordsResult, appointmentsResult]) => {
        if (petResult.success) {
            const pet = petResult.data;
            const allRecords = recordsResult.data || [];
            const allAppointments = appointmentsResult.data || [];
            
            // Filtrar registros y citas de esta mascota
            const petRecords = allRecords.filter(r => 
                (r.petId === id || r.petId?._id === id)
            );
            const petAppointments = allAppointments.filter(a => 
                (a.petId === id || a.petId?._id === id)
            );
            
            const recordsHTML = petRecords.length > 0 ? petRecords.map(record => `
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #2C5F7C;">
                    <p><strong>📅 Fecha:</strong> ${new Date(record.date).toLocaleDateString()}</p>
                    <p><strong>🩺 Diagnóstico:</strong> ${record.diagnosis}</p>
                    <p><strong>💊 Tratamiento:</strong> ${record.treatment || 'N/A'}</p>
                    ${record.notes ? `<p><strong>📝 Notas:</strong> ${record.notes}</p>` : ''}
                </div>
            `).join('') : '<p style="color: #999; text-align: center; padding: 20px;">No hay registros médicos</p>';
            
            const appointmentsHTML = petAppointments.length > 0 ? petAppointments.map(apt => `
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #3A7CA5;">
                    <p><strong>📅 Fecha:</strong> ${apt.date} a las ${apt.time}</p>
                    <p><strong>📋 Motivo:</strong> ${apt.reason}</p>
                    ${apt.notes ? `<p><strong>💬 Comentarios:</strong> ${apt.notes}</p>` : ''}
                    <p><strong>Estado:</strong> <span class="status status-${apt.status}">${apt.status}</span></p>
                </div>
            `).join('') : '<p style="color: #999; text-align: center; padding: 20px;">No hay citas registradas</p>';
            
            const content = `
                <div style="display: grid; gap: 25px;">
                    <div style="background: linear-gradient(135deg, #2C5F7C 0%, #3A7CA5 100%); padding: 25px; border-radius: 10px; color: white;">
                        <h3 style="font-size: 24px; margin-bottom: 15px;">🐾 ${pet.name}</h3>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 14px;">
                            <p><strong>Especie:</strong> ${pet.species}</p>
                            <p><strong>Raza:</strong> ${pet.breed || 'No especificada'}</p>
                            <p><strong>Dueño:</strong> ${pet.owner}</p>
                            <p><strong>ID:</strong> ${pet._id}</p>
                        </div>
                    </div>
                    
                    <div>
                        <h3 style="color: #2C5F7C; margin-bottom: 15px; font-size: 18px;">📋 Historial Médico</h3>
                        ${recordsHTML}
                    </div>
                    
                    <div>
                        <h3 style="color: #3A7CA5; margin-bottom: 15px; font-size: 18px;">📅 Historial de Citas</h3>
                        ${appointmentsHTML}
                    </div>
                </div>
            `;
            
            document.getElementById('petHistoryContent').innerHTML = content;
            document.getElementById('petHistoryModal').classList.add('active');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('Error al cargar el historial');
    });
}

function viewRecord(id) {
    fetch(`${API_URL}/medical-records/${id}`, { headers: getHeaders() })
        .then(r => r.json())
        .then(result => {
            if (result.success) {
                const record = result.data;
                
                // Obtener información de la mascota
                const petId = record.petId?._id || record.petId;
                return fetch(`${API_URL}/pets/${petId}`, { headers: getHeaders() })
                    .then(r => r.json())
                    .then(petResult => {
                        const pet = petResult.data || record.petId;
                        
                        const content = `
                            <div style="display: grid; gap: 20px;">
                                <div style="background: linear-gradient(135deg, #2C5F7C 0%, #3A7CA5 100%); padding: 25px; border-radius: 10px; color: white;">
                                    <h3 style="font-size: 20px; margin-bottom: 15px;">🐾 Información del Paciente</h3>
                                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 14px;">
                                        <p><strong>Nombre:</strong> ${pet?.name || 'N/A'}</p>
                                        <p><strong>Especie:</strong> ${pet?.species || 'N/A'}</p>
                                        <p><strong>Raza:</strong> ${pet?.breed || 'No especificada'}</p>
                                        <p><strong>Dueño:</strong> ${pet?.owner || 'N/A'}</p>
                                    </div>
                                </div>
                                
                                <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
                                    <h3 style="color: #2C5F7C; margin-bottom: 15px; font-size: 18px;">📋 Registro Médico</h3>
                                    <div style="display: grid; gap: 15px;">
                                        <div>
                                            <p style="color: #666; font-size: 13px; margin-bottom: 5px;"><strong>ID del Registro:</strong></p>
                                            <p style="font-size: 14px;">${record._id}</p>
                                        </div>
                                        <div>
                                            <p style="color: #666; font-size: 13px; margin-bottom: 5px;"><strong>📅 Fecha:</strong></p>
                                            <p style="font-size: 14px;">${new Date(record.date).toLocaleDateString('es-ES', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}</p>
                                        </div>
                                        <div>
                                            <p style="color: #666; font-size: 13px; margin-bottom: 5px;"><strong>🩺 Diagnóstico:</strong></p>
                                            <p style="font-size: 14px; line-height: 1.6;">${record.diagnosis}</p>
                                        </div>
                                        <div>
                                            <p style="color: #666; font-size: 13px; margin-bottom: 5px;"><strong>💊 Tratamiento:</strong></p>
                                            <p style="font-size: 14px; line-height: 1.6;">${record.treatment || 'No especificado'}</p>
                                        </div>
                                        ${record.notes ? `
                                        <div>
                                            <p style="color: #666; font-size: 13px; margin-bottom: 5px;"><strong>📝 Notas Adicionales:</strong></p>
                                            <p style="font-size: 14px; line-height: 1.6;">${record.notes}</p>
                                        </div>
                                        ` : ''}
                                        ${record.veterinarianId ? `
                                        <div>
                                            <p style="color: #666; font-size: 13px; margin-bottom: 5px;"><strong>👨‍⚕️ Veterinario:</strong></p>
                                            <p style="font-size: 14px;">${record.veterinarianId.name || record.veterinarianId}</p>
                                        </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        document.getElementById('recordDetailsContent').innerHTML = content;
                        document.getElementById('recordDetailsModal').classList.add('active');
                    });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cargar el registro médico');
        });
}

function closeRecordDetailsModal() {
    document.getElementById('recordDetailsModal').classList.remove('active');
}

loadDashboard();
