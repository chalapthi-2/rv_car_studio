import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../utils/api';
import styles from './Services.module.css';

const CATEGORIES = [
  { key: 'all',        label: 'All Services' },
  { key: 'exterior',   label: 'Exterior'     },
  { key: 'interior',   label: 'Interior'     },
  { key: 'full',       label: 'Full Detail'  },
  { key: 'protection', label: 'Protection'   },
  { key: 'specialty',  label: 'Specialty'    },
];

const VEHICLE_TYPES = ['hatchback', 'sedan', 'suv', 'muv', 'luxury'];

const DEMO = [
  { _id:'1', name:'Exterior Wash',       icon:'🚿', category:'exterior',   shortDesc:'High-pressure foam wash with wax coat and tyre cleaning', description:'Full foam wash using pH-balanced soap, tyre and rim scrub, window squeegee, and finishing wax for a shiny coat.', duration:{min:20,max:30},  basePrice:{hatchback:199,sedan:249,suv:299,muv:349,luxury:499},  features:['High-pressure foam wash','Tyre & rim cleaning','Window wipe','Wax coat','Air freshener'], isFeatured:true },
  { _id:'2', name:'Interior Detail',     icon:'🧴', category:'interior',   shortDesc:'Deep vacuum, dashboard wipe-down, and glass cleaning',      description:'Full vacuum of all carpets and seats, dashboard and door-panel wipe, glass cleaning, and floor-mat wash.',           duration:{min:45,max:60},  basePrice:{hatchback:399,sedan:499,suv:599,muv:649,luxury:999},  features:['Full vacuum','Dashboard wipe','Glass & mirror clean','Door panel clean','Seat wipe','Floor mat wash'] },
  { _id:'3', name:'Full Detail Package', icon:'✨', category:'full',       shortDesc:'Complete interior and exterior detailing',                   description:'Our signature combo — everything in Exterior Wash plus full interior vacuum, seat shampoo, and dashboard polish.',  duration:{min:90,max:120}, basePrice:{hatchback:699,sedan:849,suv:999,muv:1099,luxury:1799}, features:['Full exterior wash','Wax coat','Interior vacuum','Seat shampoo','Dashboard polish','Glass treatment'], isFeatured:true },
  { _id:'4', name:'Steam Clean',         icon:'🌊', category:'specialty',  shortDesc:'High-temperature steam for engine bay and upholstery',       description:'Industrial steam cleaner targets bacteria, odours, and deep grime in the engine bay, seats, and carpet fibres.',    duration:{min:60,max:90},  basePrice:{hatchback:799,sedan:899,suv:1099,muv:1199,luxury:1999}, features:['Engine bay steam','Seat & upholstery steam','Bacteria & odour removal','Floor mat steam','Vent cleaning'] },
  { _id:'5', name:'Ceramic Coating',     icon:'🛡️', category:'protection', shortDesc:'2-year paint protection ceramic coat',                       description:'Professional 9H ceramic coat applied after decontamination and clay-bar treatment for up to 2 years of hydrophobic protection.', duration:{min:180,max:240}, basePrice:{hatchback:4999,sedan:5999,suv:7499,muv:7999,luxury:12999}, features:['Paint decontamination','Clay bar treatment','Single-stage polish','9H ceramic coat','2-year warranty','Hydrophobic finish'], isFeatured:true },
  { _id:'6', name:'Polish & Buff',       icon:'🔆', category:'protection', shortDesc:'Swirl removal & paint restoration',                          description:'Machine polishing removes swirl marks, light scratches, and oxidation to restore a mirror-like gloss finish.',       duration:{min:120,max:180}, basePrice:{hatchback:1999,sedan:2499,suv:2999,muv:3299,luxury:5999}, features:['Machine polish','Swirl mark removal','Scratch correction','Paint enhancement','Carnauba wax finish'] },
];

const fadeUp = (d=0) => ({ initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, transition:{duration:0.5,delay:d,ease:[0.22,1,0.36,1]} });

export default function Services() {
  const [category, setCategory] = useState('all');
  const [vehicle,  setVehicle]  = useState('hatchback');
  const [expanded, setExpanded] = useState(null);

  const { data } = useQuery({ queryKey:['services'], queryFn:()=>api.get('/services').then(r=>r.data) });
  const all = data?.services || DEMO;
  const filtered = category === 'all' ? all : all.filter(s => s.category === category);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <motion.div {...fadeUp(0)}>
            <p className="section-label">What We Offer</p>
            <h1 className={styles.title}>Our Services</h1>
            <p className={styles.sub}>Professional car care for every need and budget.</p>
          </motion.div>
        </div>
      </div>

      <div className="container">
        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.tabs}>
            {CATEGORIES.map(c => (
              <button key={c.key} className={`${styles.tab} ${category===c.key?styles.active:''}`}
                onClick={() => setCategory(c.key)}>{c.label}</button>
            ))}
          </div>
          <div className={styles.vehicleSelect}>
            <label>Price for:</label>
            <select value={vehicle} onChange={e => setVehicle(e.target.value)}
              style={{width:'auto',padding:'6px 12px'}}>
              {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {/* Service Cards */}
        <div className={styles.grid}>
          {filtered.map((s,i) => (
            <motion.div key={s._id} className={`card ${styles.card} ${s.isFeatured?styles.featured:''}`} {...fadeUp(i*0.05)}>
              {s.isFeatured && <span className={styles.badge}>Popular</span>}
              <div className={styles.cardTop}>
                <span className={styles.icon}>{s.icon}</span>
                <div>
                  <h3 className={styles.name}>{s.name}</h3>
                  <p className={styles.desc}>{s.shortDesc}</p>
                </div>
              </div>

              <div className={styles.meta}>
                <span>⏱ {s.duration.min}–{s.duration.max} min</span>
                <span className={styles.price}>₹{s.basePrice[vehicle] || s.basePrice.hatchback}</span>
              </div>

              <div className={`${styles.features} ${expanded===s._id?styles.open:''}`}>
                <ul>
                  {s.features.map(f => <li key={f}>✓ {f}</li>)}
                </ul>
              </div>

              <div className={styles.cardActions}>
                <button className={styles.toggleBtn} onClick={() => setExpanded(expanded===s._id?null:s._id)}>
                  {expanded===s._id?'Less ↑':'Details ↓'}
                </button>
                <Link to={`/book?service=${s._id}`} className="btn btn-primary" style={{padding:'8px 18px',fontSize:12}}>
                  Book This
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <h3>Not sure which service?</h3>
          <p>Call us and our team will recommend the best package for your car.</p>
          <a href="tel:+919876543210" className="btn btn-primary">📞 Call Studio</a>
        </div>
      </div>
    </div>
  );
}
