class VitalSigns {
  constructor(id, petId, appointmentId, assistantId, weight, temperature, heartRate, respiratoryRate, notes, date) {
    this.id = id;
    this.petId = petId;
    this.appointmentId = appointmentId;
    this.assistantId = assistantId;
    this.weight = weight; // kg
    this.temperature = temperature; // °C
    this.heartRate = heartRate; // bpm
    this.respiratoryRate = respiratoryRate; // rpm
    this.notes = notes;
    this.date = date;
  }
}

module.exports = VitalSigns;
