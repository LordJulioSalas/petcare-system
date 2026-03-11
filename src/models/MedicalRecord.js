class MedicalRecord {
  constructor(id, petId, appointmentId, veterinarianId, diagnosis, treatment, notes, date) {
    this.id = id;
    this.petId = petId;
    this.appointmentId = appointmentId;
    this.veterinarianId = veterinarianId;
    this.diagnosis = diagnosis;
    this.treatment = treatment;
    this.notes = notes;
    this.date = date;
  }
}

module.exports = MedicalRecord;
