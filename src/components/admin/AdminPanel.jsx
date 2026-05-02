import React, { useState, useEffect, useCallback } from 'react'
import { collection, getDocs, doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { initializeApp, deleteApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { db, app } from '../../firebase/config'

const cellStyle = { padding: '12px 16px', fontSize: 13, color: '#CBD5E1', borderBottom: '1px solid rgba(51,65,85,0.2)' }
const thStyle = { ...cellStyle, color: '#94A3B8', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }

export function AdminPanel({ onBack }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [creating, setCreating] = useState(false)
  const [actionError, setActionError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'users'))
      const list = []
      for (const d of snap.docs) {
        const data = d.data()
        // Count sessions
        let sessionCount = 0
        try {
          const sessSnap = await getDocs(collection(db, 'users', d.id, 'sessions'))
          sessionCount = sessSnap.size
        } catch { /* ignore */ }
        list.push({ uid: d.id, ...data, sessionCount })
      }
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      setUsers(list)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setActionError('')
    setActionSuccess('')
    if (!newEmail.trim() || !newPassword.trim()) { setActionError('Fill in all fields.'); return }
    if (newPassword.length < 6) { setActionError('Password must be at least 6 characters.'); return }

    setCreating(true)
    try {
      // Use a secondary Firebase app to avoid logging out the admin
      const secondaryConfig = app.options
      const secondaryApp = initializeApp(secondaryConfig, 'secondary_create')
      const secondaryAuth = getAuth(secondaryApp)
      const cred = await createUserWithEmailAndPassword(secondaryAuth, newEmail, newPassword)

      await setDoc(doc(db, 'users', cred.user.uid), {
        email: newEmail,
        displayName: '',
        isAdmin: false,
        disabled: false,
        createdAt: serverTimestamp(),
      })

      await deleteApp(secondaryApp)
      setNewEmail('')
      setNewPassword('')
      setShowCreate(false)
      setActionSuccess(`User ${newEmail} created successfully.`)
      fetchUsers()
    } catch (err) {
      setActionError(err.message || 'Failed to create user.')
    } finally {
      setCreating(false)
    }
  }

  const toggleDisable = async (uid, currentDisabled) => {
    setActionError('')
    setActionSuccess('')
    try {
      await updateDoc(doc(db, 'users', uid), { disabled: !currentDisabled })
      setActionSuccess(currentDisabled ? 'User enabled.' : 'User disabled.')
      fetchUsers()
    } catch (err) {
      setActionError(err.message || 'Failed to update user.')
    }
  }

  const toggleAdmin = async (uid, currentAdmin) => {
    setActionError('')
    setActionSuccess('')
    try {
      await updateDoc(doc(db, 'users', uid), { isAdmin: !currentAdmin })
      setActionSuccess(currentAdmin ? 'Admin rights removed.' : 'Admin rights granted.')
      fetchUsers()
    } catch (err) {
      setActionError(err.message || 'Failed to update user.')
    }
  }

  const inputStyle = {
    padding: '10px 14px', fontSize: 13, color: '#E2E8F0', background: 'rgba(30,41,59,0.6)',
    border: '1px solid rgba(51,65,85,0.4)', borderRadius: 8, outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060A14', color: '#E2E8F0', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="admin-header" style={{ padding: '16px 28px', borderBottom: '1px solid rgba(51,65,85,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(10,15,28,0.85)', backdropFilter: 'blur(16px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 14px', color: '#CBD5E1', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#F1F5F9', margin: 0 }}>Admin Panel</h1>
          <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 999, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5', fontWeight: 700, letterSpacing: '0.04em' }}>ADMIN</span>
        </div>
        <button onClick={() => { setShowCreate(!showCreate); setActionError(''); setActionSuccess('') }} style={{
          padding: '8px 18px', fontSize: 13, fontWeight: 700, color: '#FFF',
          background: 'linear-gradient(135deg, #0EA5E9, #8B5CF6)', border: 'none', borderRadius: 8, cursor: 'pointer',
          boxShadow: '0 2px 12px rgba(14,165,233,0.2)',
        }}>
          + Create User
        </button>
      </div>

      <div className="admin-content" style={{ maxWidth: 960, margin: '0 auto', padding: '28px 24px' }}>
        {/* Alerts */}
        {actionError && <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5', fontSize: 13 }}>{actionError}</div>}
        {actionSuccess && <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#6EE7B7', fontSize: 13 }}>{actionSuccess}</div>}

        {/* Create form */}
        {showCreate && (
          <div style={{ marginBottom: 24, padding: 24, borderRadius: 12, background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.3)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#CBD5E1' }}>Create New User</h3>
            <form onSubmit={handleCreateUser} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</label>
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="user@example.com" style={inputStyle} />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Temporary Password</label>
                <input type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="min 6 characters" style={inputStyle} />
              </div>
              <button type="submit" disabled={creating} style={{ padding: '10px 24px', fontSize: 13, fontWeight: 700, color: '#FFF', background: creating ? 'rgba(51,65,85,0.4)' : '#10B981', border: 'none', borderRadius: 8, cursor: creating ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                {creating ? 'Creating...' : 'Create'}
              </button>
            </form>
          </div>
        )}

        {/* Users table */}
        <div className="admin-table-wrapper" style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(51,65,85,0.25)', background: 'rgba(15,23,42,0.5)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(30,41,59,0.5)' }}>
                <th style={thStyle}>Email</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Sessions</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Role</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Created</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ ...cellStyle, textAlign: 'center', color: '#64748B', padding: 40 }}>Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} style={{ ...cellStyle, textAlign: 'center', color: '#64748B', padding: 40 }}>No users found.</td></tr>
              ) : users.map(u => (
                <tr key={u.uid} style={{ transition: 'background 0.15s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={cellStyle}>
                    <div style={{ fontWeight: 600 }}>{u.email}</div>
                    <div style={{ fontSize: 10, color: '#475569', marginTop: 2, fontFamily: 'monospace' }}>{u.uid.slice(0, 12)}...</div>
                  </td>
                  <td style={{ ...cellStyle, textAlign: 'center' }}>{u.sessionCount}</td>
                  <td style={{ ...cellStyle, textAlign: 'center' }}>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, background: u.isAdmin ? 'rgba(239,68,68,0.1)' : 'rgba(51,65,85,0.3)', color: u.isAdmin ? '#FCA5A5' : '#94A3B8', fontWeight: 600 }}>
                      {u.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, textAlign: 'center' }}>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, background: u.disabled ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: u.disabled ? '#FCA5A5' : '#6EE7B7', fontWeight: 600 }}>
                      {u.disabled ? 'Disabled' : 'Active'}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, textAlign: 'center', fontSize: 12 }}>
                    {u.createdAt?.seconds ? new Date(u.createdAt.seconds * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </td>
                  <td style={{ ...cellStyle, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button onClick={() => toggleAdmin(u.uid, u.isAdmin)} style={{ padding: '5px 10px', fontSize: 11, fontWeight: 600, color: '#CBD5E1', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, cursor: 'pointer' }}>
                        {u.isAdmin ? 'Demote' : 'Promote'}
                      </button>
                      <button onClick={() => toggleDisable(u.uid, u.disabled)} style={{ padding: '5px 10px', fontSize: 11, fontWeight: 600, color: u.disabled ? '#6EE7B7' : '#FCA5A5', background: u.disabled ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${u.disabled ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 6, cursor: 'pointer' }}>
                        {u.disabled ? 'Enable' : 'Disable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
