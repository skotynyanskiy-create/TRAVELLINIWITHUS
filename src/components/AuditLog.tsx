import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebaseDb';
import { History, User, Clock, Info, Loader2 } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';

interface Log {
  id: string;
  action: string;
  userEmail: string;
  timestamp: { toDate: () => Date };
  details?: string;
}

export default function AuditLog() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(50));
      const querySnapshot = await getDocs(q);
      const fetched: Log[] = [];
      querySnapshot.forEach(doc => fetched.push({ id: doc.id, ...doc.data() } as Log));
      setLogs(fetched);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-serif flex items-center gap-2">
          <History size={24} className="text-[var(--color-accent)]" /> Registro Attività
        </h3>
        <button 
          onClick={fetchLogs}
          className="text-sm text-zinc-500 hover:text-[var(--color-accent)] transition-colors"
        >
          Aggiorna
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-zinc-300" size={32} /></div>
        ) : logs.length === 0 ? (
          <p className="text-zinc-500 text-center py-12">Nessuna attività registrata.</p>
        ) : (
          logs.map(log => (
            <div key={log.id} className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:bg-white transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white text-zinc-400 rounded-xl border border-zinc-100">
                  <Info size={20} />
                </div>
                <div>
                  <p className="font-bold text-lg">{log.action}</p>
                  <p className="text-sm text-zinc-600">{log.details || 'Nessun dettaglio aggiuntivo'}</p>
                </div>
              </div>
              <div className="flex flex-col md:items-end gap-1">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <User size={14} /> {log.userEmail}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Clock size={14} /> {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : 'Recent'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
