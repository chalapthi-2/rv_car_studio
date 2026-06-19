import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import styles from './Dashboard.module.css';

const STATUS_OPTIONS = ['pending','confirmed','in-progress','completed','cancelled','no-show'];
const STATUS_COLORS  = { pending:'badge-amber', confirmed:'badge-blue', 'in-progress':'badge-amber', completed:'badge-green', cancelled:'badge-red', 'no-show':'badge-red' };

const DEMO_STATS = { totalBookings:128, todayBookings:14, pendingBookings:5, totalCustomers:94, completedToday:8, totalRevenue:284500 };
const DEMO_BOOKINGS = [
  { _id:'1', bookingId:'SPX-20260507-1001', status:'confirmed',    appointmentDate:'2026-05-07T00:00:00Z', timeSlot:{start:'09:00'}, serviceSnapshot:{name:'Full Detail Package',icon:'✨'}, customerSnapshot:{name:'Ravi Kumar',phone:'9876543210'}, vehicle:{type:'sedan',make:'Honda',model:'City'}, amount:{total:849},  bay:2 },
  { _id:'2', bookingId:'SPX-20260507-1002', status:'in-progress',  appointmentDate:'2026-05-07T00:00:00Z', timeSlot:{start:'10:00'}, serviceSnapshot:{name:'Ceramic Coating',icon:'🛡️'},    customerSnapshot:{name:'Priya M.',phone:'9123456789'},    vehicle:{type:'suv',make:'Hyundai',model:'Creta'}, amount:{total:7499}, bay:5 },
  { _id:'3', bookingId:'SPX-20260507-1003', status:'pending',      appointmentDate:'2026-05-07T00:00:00Z', timeSlot:{start:'11:00'}, serviceSnapshot:{name:'Exterior Wash',icon:'🚿'},       customerSnapshot:{name:'Arun S.',phone:'9988776655'},     vehicle:{type:'hatchback',make:'Maruti',model:'Swift'}, amount:{total:199}, bay:null },
  { _id:'4', bookingId:'SPX-20260507-1004', status:'completed',    appointmentDate:'2026-05-07T00:00:00Z', timeSlot:{start:'08:00'}, serviceSnapshot:{name:'Steam Clean',icon:'🌊'},          customerSnapshot:{name:'Deepa R.',phone:'9090909090'},   vehicle:{type:'muv',make:'Toyota',model:'Innova'}, amount:{total:1199}, bay:3 },
];

export default function AdminDashboard() {
  const qc = useQueryClient();
  const [tab, setTab] = useState('today');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('');

  const { data: statsData } = useQuery({ queryKey:['admin-stats'], queryFn:()=>api.get('/admin/dashboard').then(r=>r.data).catch(()=>({stats:DEMO_STATS})) });
  const stats = statsData?.stats || DEMO_STATS;

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['admin-bookings', dateFilter, statusFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (tab==='today') params.set('date', dateFilter);
      if (statusFilter)  params.set('status', statusFilter);
      return api.get(`/admin/bookings?${params}`).then(r=>r.data).catch(()=>({bookings:DEMO_BOOKINGS}));
    },
  });
  const bookings = bookingsData?.bookings || DEMO_BOOKINGS;

  const { data: reviewsData } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => api.get('/admin/reviews').then(r=>r.data).catch(()=>null),
    enabled: tab==='reviews',
  });

  const { data: customersData } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: () => api.get('/admin/customers').then(r=>r.data).catch(()=>null),
    enabled: tab==='customers',
  });

  const updateBooking = useMutation({
    mutationFn: ({ id, updates }) => api.put(`/admin/bookings/${id}`, updates),
    onSuccess: () => { toast.success('Updated!'); qc.invalidateQueries(['admin-bookings']); },
    onError: () => toast.error('Update failed.'),
  });

  const approveReview = useMutation({
    mutationFn: ({ id, val }) => api.put(`/reviews/${id}`, { isApproved: val }),
    onSuccess: () => { toast.success('Review updated!'); qc.invalidateQueries(['admin-reviews']); },
  });

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <p className="section-label">Admin Panel</p>
          <h1 className={styles.title}>Dashboard</h1>
        </div>
      </div>

      <div className="container">
        {/* Stats grid */}
        <div className={styles.statsGrid}>
          {[
            { icon:'📅', label:"Today's Bookings", value: stats.todayBookings, color:'#1a6bff' },
            { icon:'⏳', label:'Pending',           value: stats.pendingBookings, color:'#e6a817' },
            { icon:'✅', label:'Completed Today',   value: stats.completedToday, color:'#16a34a' },
            { icon:'👥', label:'Total Customers',   value: stats.totalCustomers, color:'#ff4e1a' },
            { icon:'📋', label:'All Bookings',      value: stats.totalBookings,  color:'#1a6bff' },
            { icon:'💰', label:'Total Revenue',     value: `₹${(stats.totalRevenue||0).toLocaleString('en-IN')}`, color:'#16a34a' },
          ].map(s => (
            <motion.div key={s.label} className={`card ${styles.statCard}`}
              initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
              <div className={styles.statIcon}>{s.icon}</div>
              <div className={styles.statVal} style={{color:s.color}}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[['today','Today\'s Bookings'],['all','All Bookings'],['customers','Customers'],['reviews','Reviews']].map(([k,l])=>(
            <button key={k} className={`${styles.tab} ${tab===k?styles.active:''}`} onClick={()=>setTab(k)}>{l}</button>
          ))}
        </div>

        {/* Bookings Table */}
        {(tab==='today' || tab==='all') && (
          <div>
            <div className={styles.tableControls}>
              {tab==='all' && (
                <input type="date" value={dateFilter} onChange={e=>setDateFilter(e.target.value)}
                  style={{width:'auto',padding:'7px 12px'}} />
              )}
              <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{width:'auto',padding:'7px 12px'}}>
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <span className={styles.count}>{bookings.length} bookings</span>
            </div>

            {isLoading ? <div className={styles.loading}>Loading...</div> : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Vehicle</th>
                      <th>Time</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Bay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id}>
                        <td><span className={styles.bookingId}>{b.bookingId}</span></td>
                        <td>
                          <div className={styles.customerCell}>
                            <strong>{b.customerSnapshot?.name || b.customer?.name}</strong>
                            <span>{b.customerSnapshot?.phone || b.customer?.phone}</span>
                          </div>
                        </td>
                        <td>{b.serviceSnapshot?.icon} {b.serviceSnapshot?.name}</td>
                        <td style={{textTransform:'capitalize'}}>{b.vehicle?.make} {b.vehicle?.model}<br/><small style={{color:'var(--mute)'}}>{b.vehicle?.type}</small></td>
                        <td>{b.timeSlot?.start}</td>
                        <td style={{fontWeight:600}}>₹{b.amount?.total}</td>
                        <td>
                          <select
                            className={`badge ${STATUS_COLORS[b.status]}`}
                            value={b.status}
                            onChange={e => updateBooking.mutate({ id: b._id, updates: { status: e.target.value } })}
                            style={{border:'none',cursor:'pointer',fontFamily:'var(--font-body)',fontWeight:500}}>
                            {STATUS_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td>
                          <input type="number" min={1} max={12} placeholder="—"
                            defaultValue={b.bay || ''}
                            onBlur={e => updateBooking.mutate({ id: b._id, updates: { bay: +e.target.value } })}
                            style={{width:52,padding:'4px 8px',textAlign:'center'}} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Customers tab */}
        {tab === 'customers' && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Bookings</th><th>Points</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {(customersData?.customers || []).map(c => (
                  <tr key={c._id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.totalBookings}</td>
                    <td><span className="badge badge-blue">{c.loyaltyPoints} pts</span></td>
                    <td>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
                {(!customersData?.customers?.length) && <tr><td colSpan={6} style={{textAlign:'center',padding:40,color:'var(--mute)'}}>No customers yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* Reviews tab */}
        {tab === 'reviews' && (
          <div className={styles.reviewsGrid}>
            {(reviewsData?.reviews || []).map(r => (
              <div key={r._id} className={`card ${styles.reviewCard}`}>
                <div className={styles.reviewTop}>
                  <div>
                    <strong>{r.customerName}</strong>
                    <span className={styles.vehicleTag}>{r.vehicleModel}</span>
                  </div>
                  <span style={{color:'var(--gold)',fontSize:14}}>{'★'.repeat(r.rating)}</span>
                </div>
                <p className={styles.reviewText}>{r.comment}</p>
                <div className={styles.reviewActions}>
                  <span className={`badge ${r.isApproved?'badge-green':'badge-amber'}`}>
                    {r.isApproved ? 'Approved' : 'Pending'}
                  </span>
                  <button className={`btn ${r.isApproved?'btn-outline':'btn-dark'}`}
                    style={{padding:'5px 12px',fontSize:11}}
                    onClick={() => approveReview.mutate({ id: r._id, val: !r.isApproved })}>
                    {r.isApproved ? 'Unapprove' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
            {(!reviewsData?.reviews?.length) && <p style={{color:'var(--mute)',padding:'40px 0'}}>No reviews to moderate.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
