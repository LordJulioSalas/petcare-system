class Appointment {
  constructor(id, petId, date, time, reason, status = 'pending') {
    this.id = id;
    this.petId = petId;
    this.date = date;
    this.time = time;
    this.reason = reason;
    this.status = status;
  }
}

module.exports = Appointment;
