import React, { useState } from 'react';
import { useDashboard, Statement, TransactionType, TransactionStatus } from '@/context/DashboardContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Save, X, Plus, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatementTable() {
  const { data, editMode, updateStatement, deleteStatement, addStatement } = useDashboard();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Statement>>({});
  const [isAdding, setIsAdding] = useState(false);

  const handleEditClick = (stmt: Statement) => {
    setEditingId(stmt.id);
    setEditForm(stmt);
  };

  const handleSaveEdit = () => {
    if (editingId && editForm) {
      updateStatement(editingId, editForm);
    }
    setEditingId(null);
  };

  const handleSaveNew = () => {
    if (editForm.date && editForm.description && editForm.amount) {
      addStatement({
        date: editForm.date,
        description: editForm.description,
        fan: editForm.fan || 'Unknown',
        type: (editForm.type as TransactionType) || 'Subscription',
        amount: Number(editForm.amount),
        status: (editForm.status as TransactionStatus) || 'Completed'
      });
      setIsAdding(false);
      setEditForm({});
    }
  };

  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case 'Subscription': return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case 'Tip': return "bg-green-500/20 text-green-400 border border-green-500/30";
      case 'PPV': return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      case 'Refund': return "bg-red-500/20 text-red-400 border border-red-500/30";
      default: return "bg-white/10 text-[#b3b3b3] border border-white/20";
    }
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'Completed': return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case 'Pending': return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case 'Refunded': return "bg-red-500/20 text-red-400 border border-red-500/30";
      default: return "bg-white/10 text-[#b3b3b3] border border-white/20";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-3 w-full sm:w-auto">
          <Input 
            placeholder="Search statements..." 
            className="w-full sm:w-72 bg-[#1a1a1a] border-white/10 focus-visible:ring-primary focus-visible:border-primary text-white placeholder:text-[#666666]" 
          />
          <select className="bg-[#1a1a1a] border border-white/10 text-white rounded-md px-3 text-sm focus:ring-1 focus:ring-primary outline-none">
            <option value="">All Types</option>
            <option value="Subscription">Subscription</option>
            <option value="Tip">Tip</option>
            <option value="PPV">PPV</option>
          </select>
          <select className="bg-[#1a1a1a] border border-white/10 text-white rounded-md px-3 text-sm focus:ring-1 focus:ring-primary outline-none">
            <option value="">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        
        {editMode && (
          <Button 
            onClick={() => { setIsAdding(true); setEditForm({}); }}
            className="bg-[#00AFF0] text-black hover:bg-[#00AFF0]/90 shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Transaction
          </Button>
        )}
      </div>

      <div className="bg-[#1a1a1a] border border-white/[0.08] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0a0a0a] text-[#b3b3b3] border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wide text-xs uppercase">Date</th>
                <th className="px-6 py-4 font-medium tracking-wide text-xs uppercase">Description</th>
                <th className="px-6 py-4 font-medium tracking-wide text-xs uppercase">Type</th>
                <th className="px-6 py-4 font-medium tracking-wide text-xs uppercase text-right">Amount</th>
                <th className="px-6 py-4 font-medium tracking-wide text-xs uppercase">Status</th>
                {editMode && <th className="px-6 py-4 font-medium tracking-wide text-xs uppercase text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {isAdding && (
                <tr className="bg-primary/5">
                  <td className="px-6 py-3"><Input type="date" value={editForm.date || ''} onChange={e => setEditForm({...editForm, date: e.target.value})} className="h-9 bg-[#252525] border-white/20 text-white" /></td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1">
                      <Input placeholder="Description" value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} className="h-8 bg-[#252525] border-white/20 text-white" />
                      <Input placeholder="@fan" value={editForm.fan || ''} onChange={e => setEditForm({...editForm, fan: e.target.value})} className="h-8 bg-[#252525] border-white/20 text-white text-xs" />
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <select className="h-9 w-full rounded-md border border-white/20 bg-[#252525] text-white px-3" value={editForm.type || 'Subscription'} onChange={e => setEditForm({...editForm, type: e.target.value as any})}>
                      <option>Subscription</option><option>Tip</option><option>PPV</option><option>Refund</option>
                    </select>
                  </td>
                  <td className="px-6 py-3"><Input type="number" placeholder="0.00" value={editForm.amount || ''} onChange={e => setEditForm({...editForm, amount: Number(e.target.value)})} className="h-9 w-24 ml-auto bg-[#252525] border-white/20 text-white text-right" /></td>
                  <td className="px-6 py-3">
                    <select className="h-9 w-full rounded-md border border-white/20 bg-[#252525] text-white px-3" value={editForm.status || 'Completed'} onChange={e => setEditForm({...editForm, status: e.target.value as any})}>
                      <option>Completed</option><option>Pending</option><option>Refunded</option>
                    </select>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-400/10" onClick={handleSaveNew}><Save className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-[#b3b3b3] hover:text-white hover:bg-white/10" onClick={() => setIsAdding(false)}><X className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              )}

              {data.statements.map((stmt) => {
                const isEditing = editingId === stmt.id;
                
                return (
                  <tr key={stmt.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 text-[#b3b3b3]">
                      {isEditing ? <Input type="date" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} className="h-9 bg-[#252525] border-white/20 text-white" /> : formatDate(stmt.date)}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex flex-col gap-1">
                          <Input value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="h-8 bg-[#252525] border-white/20 text-white" />
                          <Input value={editForm.fan} onChange={e => setEditForm({...editForm, fan: e.target.value})} className="h-8 bg-[#252525] border-white/20 text-white text-xs" />
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-white">{stmt.description}</div>
                          <div className="text-sm text-primary">{stmt.fan}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <select className="h-9 w-full rounded-md border border-white/20 bg-[#252525] text-white px-3" value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value as any})}>
                          <option>Subscription</option><option>Tip</option><option>PPV</option><option>Refund</option>
                        </select>
                      ) : (
                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getTypeBadgeStyles(stmt.type))}>
                          {stmt.type}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <Input type="number" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: Number(e.target.value)})} className="h-9 w-24 ml-auto bg-[#252525] border-white/20 text-white text-right" />
                      ) : (
                        <span className={cn("font-medium tabular-nums", stmt.amount < 0 ? "text-[#FF4D4D]" : "text-white")}>
                          {stmt.amount < 0 ? "-" : "+"}{formatCurrency(Math.abs(stmt.amount))}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <select className="h-9 w-full rounded-md border border-white/20 bg-[#252525] text-white px-3" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value as any})}>
                          <option>Completed</option><option>Pending</option><option>Refunded</option>
                        </select>
                      ) : (
                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getStatusBadgeStyles(stmt.status))}>
                          {stmt.status}
                        </span>
                      )}
                    </td>
                    {editMode && (
                      <td className="px-6 py-4 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-400/10" onClick={handleSaveEdit}><Save className="w-4 h-4" /></Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-[#b3b3b3] hover:text-white hover:bg-white/10" onClick={() => setEditingId(null)}><X className="w-4 h-4" /></Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-[#b3b3b3] hover:text-white hover:bg-white/10" onClick={() => handleEditClick(stmt)}><Edit3 className="w-4 h-4" /></Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-[#FF4D4D] hover:text-[#FF4D4D] hover:bg-[#FF4D4D]/10" onClick={() => deleteStatement(stmt.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-white/10 flex justify-between items-center text-sm text-[#b3b3b3] bg-[#0a0a0a]">
          <span>Showing 1 to {Math.min(data.statements.length, 20)} of {data.statements.length} entries</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="bg-[#1a1a1a] border-white/10 text-[#666666]">Previous</Button>
            <Button variant="outline" size="sm" className="bg-[#1a1a1a] border-white/10 text-white hover:bg-[#252525]">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
