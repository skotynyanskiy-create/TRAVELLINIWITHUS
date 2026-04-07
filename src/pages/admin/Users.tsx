import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebaseDb';
import { Shield, User as UserIcon, Loader2 } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';
import ListSkeleton from '../../components/ListSkeleton';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  photoURL?: string;
}

export default function Users() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const fetchedUsers: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push({ uid: doc.id, ...doc.data() } as UserProfile);
      });
      setUsers(fetchedUsers);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'users');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId: string, currentRole: 'admin' | 'user') => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    // Prevent self-demotion if needed, but for now we'll allow it with a warning
    if (newRole === 'user' && window.confirm("Sei sicuro di voler rimuovere i privilegi di amministratore da questo utente?")) {
      await performUpdate(userId, newRole);
    } else if (newRole === 'admin') {
      await performUpdate(userId, newRole);
    }
  };

  const performUpdate = async (userId: string, newRole: 'admin' | 'user') => {
    setUpdatingId(userId);
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(u => u.uid === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-serif mb-8">Gestione Utenti</h2>
      {loading ? (
        <ListSkeleton />
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">Nessun utente registrato.</div>
      ) : (
        <div className="divide-y divide-zinc-100">
          {users.map(user => (
            <div key={user.uid} className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-4">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-12 h-12 rounded-full border border-zinc-100" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                    <UserIcon size={24} />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-lg">{user.displayName || 'Utente senza nome'}</h3>
                  <p className="text-sm text-zinc-500">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {user.role === 'admin' ? <Shield size={14} /> : <UserIcon size={14} />}
                  {user.role}
                </div>
                
                <button 
                  onClick={() => toggleRole(user.uid, user.role)}
                  disabled={updatingId === user.uid}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    user.role === 'admin' 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-purple-600 hover:bg-purple-50'
                  } disabled:opacity-50`}
                >
                  {updatingId === user.uid ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    user.role === 'admin' ? 'Rimuovi Admin' : 'Rendi Admin'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
