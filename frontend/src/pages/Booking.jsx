import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import styles from './Booking.module.css';

const SERVICES_DEMO = [
  { _id:'1', name:'Exterior Wash', icon:'🚿', duration:{min:20,max:30}, basePrice:{hatchback:199,sedan:249,suv:299,muv:349,luxury:499} },
  { _id:'2', name:'Interior Detail', icon:'🧴', duration:{min:45,max:60}, basePrice:{hatchback:399,sedan:499,suv:599,muv:649,luxury:999} },
  { _id:'3', name:'Full Detail Package', icon:'✨', duration:{min:90,max:120}, basePrice:{hatchback:699,sedan:849,suv:999,muv:1099,luxury:1799} },
  { _id:'4', name:'Steam Clean', icon:'🌊', duration:{min:60,max:90}, basePrice:{hatchback:799,sedan:899,suv:1099,muv:1199,luxury:1999} },
  { _id:'5', name:'Ceramic Coating', icon:'🛡️', duration:{min:180,max:240}, basePrice:{hatchback:4999,sedan:5999,suv:7499,muv:7999,luxury:12999} },
  { _id:'6', name:'Polish & Buff', icon:'🔆', duration:{min:120,max:180}, basePrice:{hatchback:1999,sedan:2499,suv:2999,muv:3299,luxury:5999} },
];
const VEHICLE_TYPES = ['hatchback','sedan','suv','muv','luxury'];

const DEMO_SLOTS = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

const STEPS = ['Service','Vehicle','Date & Time','Confirm'];

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    serviceId:   params.get('service') || '',
    vehicleType: 'hatchback',
    vehicleMake: '',
    vehicleModel: '',
    vehicleReg: '',
    date: todayStr(),
    slotStart: '',
    slotEnd: '',
    notes: '',
  });

  const { data: servData } = useQuery({ queryKey:['services'], queryFn:()=>api.get('/services').then(r=>r.data) });
  const services = servData?.services || SERVICES_DEMO;
  const selectedService = services.find(s => s._id === form.serviceId);

  const { data: slotData } = useQuery({
    queryKey: ['slots', form.date],
    queryFn: () => api.get(`/slots/${form.date}`).then(r=>r.data).catch(()=>null),
    enabled: !!form.date,
  });
  const availableSlots = slotData?.availableSlots?.map(s=>s.start) || DEMO_SLOTS;

  const totalAmount = selectedService
    ? (selectedService.basePrice[form.vehicleType] || selectedService.basePrice.hatchback)
    : 0;

  const bookMutation = useMutation({
    mutationFn: () => api.post('/bookings', {
      serviceId: form.serviceId,
      vehicleType: form.vehicleType,
      vehicleMake: form.vehicleMake,
      vehicleModel: form.vehicleModel,
      vehicleReg: form.vehicleReg,
      appointmentDate: form.date,
      timeSlot: { start: form.slotStart, end: form.slotEnd },
      notes: form.notes,
      amount: { base: totalAmount, discount: 0, tax: 0, total: totalAmount },
    }),
    onSuccess: (res) => {
      toast.success(`Booking confirmed! ID: ${res.data.booking.bookingId}`);
      navigate('/my-bookings');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    },
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const next = () => {
    if (step === 0 && !form.serviceId) { toast.error('Please select a service'); return; }
    if (step === 1 && !form.vehicleType) { toast.error('Please select vehicle type'); return; }
    if (step === 2 && (!form.date || !form.slotStart)) { toast.error('Please pick a date and time slot'); return; }
    setStep(s => s + 1);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <p className="section-label">Reservation</p>
          <h1 className={styles.title}>Book Your Slot</h1>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Steps sidebar */}
          <aside className={styles.sidebar}>
            {STEPS.map((s, i) => (
              <div key={s} className={`${styles.stepItem} ${i===step?styles.current:''} ${i<step?styles.done:''}`}>
                <div className={styles.stepNum}>{i < step ? '✓' : i + 1}</div>
                <span>{s}</span>
              </div>
            ))}
            {selectedService && (
              <div className={styles.summary}>
                <h4>Summary</h4>
                <div className={styles.summaryRow}><span>Service</span><strong>{selectedService.icon} {selectedService.name}</strong></div>
                {form.vehicleType && <div className={styles.summaryRow}><span>Vehicle</span><strong>{form.vehicleType}</strong></div>}
                {form.slotStart && <div className={styles.summaryRow}><span>Slot</span><strong>{form.slotStart}</strong></div>}
                {form.date && <div className={styles.summaryRow}><span>Date</span><strong>{new Date(form.date+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</strong></div>}
                <div className={styles.summaryTotal}><span>Total</span><strong>₹{totalAmount}</strong></div>
              </div>
            )}
          </aside>

          {/* Main form */}
          <div className={styles.formBox}>
            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                transition={{duration:0.25}}>

                {/* STEP 0: Service */}
                {step === 0 && (
                  <div>
                    <h2 className={styles.stepTitle}>Choose a Service</h2>
                    <div className={styles.serviceGrid}>
                      {services.map(s => (
                        <button key={s._id}
                          className={`${styles.serviceOption} ${form.serviceId===s._id?styles.selected:''}`}
                          onClick={() => set('serviceId', s._id)}>
                          <span className={styles.svcIcon}>{s.icon}</span>
                          <span className={styles.svcName}>{s.name}</span>
                          <span className={styles.svcPrice}>from ₹{s.basePrice.hatchback}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 1: Vehicle */}
                {step === 1 && (
                  <div>
                    <h2 className={styles.stepTitle}>Vehicle Details</h2>
                    <div className={styles.fieldGroup}>
                      <label>Vehicle Type *</label>
                      <div className={styles.vehicleTypes}>
                        {VEHICLE_TYPES.map(v => (
                          <button key={v}
                            className={`${styles.vehicleBtn} ${form.vehicleType===v?styles.selected:''}`}
                            onClick={() => set('vehicleType', v)}>
                            {v.charAt(0).toUpperCase()+v.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className={styles.fieldRow}>
                      <div className={styles.field}>
                        <label>Make (Brand)</label>
                        <input placeholder="e.g. Honda" value={form.vehicleMake} onChange={e=>set('vehicleMake',e.target.value)} />
                      </div>
                      <div className={styles.field}>
                        <label>Model</label>
                        <input placeholder="e.g. City" value={form.vehicleModel} onChange={e=>set('vehicleModel',e.target.value)} />
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label>Registration Number</label>
                      <input placeholder="e.g. AP28 AB 1234" value={form.vehicleReg} onChange={e=>set('vehicleReg',e.target.value)} />
                    </div>
                  </div>
                )}

                {/* STEP 2: Date & Time */}
                {step === 2 && (
                  <div>
                    <h2 className={styles.stepTitle}>Pick a Date & Slot</h2>
                    <div className={styles.field}>
                      <label>Appointment Date *</label>
                      <input type="date" value={form.date} min={todayStr()}
                        onChange={e=>{ set('date',e.target.value); set('slotStart',''); set('slotEnd',''); }} />
                    </div>
                    <div className={styles.slotsWrap}>
                      <label>Available Time Slots *</label>
                      <div className={styles.slotsGrid}>
                        {availableSlots.map(slot => {
                          const [h] = slot.split(':').map(Number);
                          const endH = String(h+1).padStart(2,'0');
                          const endSlot = `${endH}:00`;
                          const isPeak = (h>=10&&h<=13)||(h>=16&&h<=19);
                          return (
                            <button key={slot}
                              className={`${styles.slotBtn} ${form.slotStart===slot?styles.selected:''} ${isPeak?styles.peak:''}`}
                              onClick={() => { set('slotStart', slot); set('slotEnd', endSlot); }}>
                              {slot}
                              {isPeak && <span className={styles.peakTag}>Busy</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className={styles.field} style={{marginTop:16}}>
                      <label>Special Requests (optional)</label>
                      <textarea rows={3} placeholder="Any specific requests or instructions..."
                        value={form.notes} onChange={e=>set('notes',e.target.value)} />
                    </div>
                  </div>
                )}

                {/* STEP 3: Confirm */}
                {step === 3 && (
                  <div>
                    <h2 className={styles.stepTitle}>Confirm Booking</h2>
                    <div className={styles.confirmCard}>
                      <div className={styles.confirmRow}><span>Customer</span><strong>{user?.name}</strong></div>
                      <div className={styles.confirmRow}><span>Phone</span><strong>{user?.phone}</strong></div>
                      <div className={styles.confirmRow}><span>Service</span><strong>{selectedService?.icon} {selectedService?.name}</strong></div>
                      <div className={styles.confirmRow}><span>Vehicle</span><strong>{form.vehicleMake} {form.vehicleModel} ({form.vehicleType})</strong></div>
                      <div className={styles.confirmRow}><span>Date</span><strong>{new Date(form.date+'T00:00:00').toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</strong></div>
                      <div className={styles.confirmRow}><span>Time</span><strong>{form.slotStart} – {form.slotEnd}</strong></div>
                      {form.notes && <div className={styles.confirmRow}><span>Notes</span><strong>{form.notes}</strong></div>}
                      <div className={styles.confirmTotal}><span>Total Amount</span><strong>₹{totalAmount}</strong></div>
                    </div>
                    <p className={styles.confirmNote}>💡 Payment collected at studio. A confirmation will be sent to {user?.email}.</p>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className={styles.navBtns}>
              {step > 0 && (
                <button className="btn btn-outline" onClick={() => setStep(s=>s-1)}>← Back</button>
              )}
              {step < 3 ? (
                <button className="btn btn-primary" style={{marginLeft:'auto'}} onClick={next}>
                  Continue →
                </button>
              ) : (
                <button className="btn btn-primary" style={{marginLeft:'auto'}}
                  disabled={bookMutation.isPending}
                  onClick={() => bookMutation.mutate()}>
                  {bookMutation.isPending ? 'Confirming...' : 'Confirm Booking ✓'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
