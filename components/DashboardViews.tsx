
import React, { useState, useEffect } from 'react';
import { DashboardTab, Patient, Transaction, Appointment, AppSettings, User, UserRole, AnamnesisForm } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Users, CreditCard, Calendar, Plus, MoreHorizontal, 
  Download, Sparkles, FileCheck, X, FileText, 
  MessageCircle, Clock, CheckCircle2, AlertCircle, Send,
  ChevronLeft, ChevronRight, Upload, Save, FolderOpen, Stethoscope, Pill,
  User as UserIcon, Filter, Image as ImageIcon, Link, AlertTriangle, Heart, Activity, CheckSquare, Square,
  DollarSign, Settings
} from 'lucide-react';
import { summarizeAnamnesis, generateReceiptText } from '../services/geminiService';
import { openDirectWhatsapp, triggerWhatsappAutomation, processAnamnesisWithN8N } from '../services/n8nService';

// --- MOCK DATA ---
const mockDoctors: User[] = [
  { id: 'u1', name: 'Dr. Roberto', role: UserRole.DENTIST, specialty: 'Implantodontia' },
  { id: 'u2', name: 'Dra. Ana', role: UserRole.DENTIST, specialty: 'Ortodontia' },
  { id: 'u4', name: 'Dr. Carlos', role: UserRole.DENTIST, specialty: 'Geral' }
];

const mockAppointments: Appointment[] = [
  { id: '1', patientId: '1', patientName: 'Ana Silva', patientPhone: '5511999999999', dentistId: 'u2', date: '2023-10-25', time: '09:00', procedure: 'Manutenção Aparelho', status: 'Confirmed' },
  { id: '2', patientId: '2', patientName: 'Carlos Santos', patientPhone: '5511888888888', dentistId: 'u4', date: '2023-10-25', time: '10:30', procedure: 'Limpeza (Profilaxia)', status: 'Scheduled' },
  { id: '3', patientId: '4', patientName: 'Roberto Firmino', patientPhone: '5511666666666', dentistId: 'u1', date: '2023-10-25', time: '14:00', procedure: 'Cirurgia Implante', status: 'Scheduled' },
  { id: '4', patientId: '1', patientName: 'Ana Silva', patientPhone: '5511999999999', dentistId: 'u2', date: '2023-10-26', time: '11:00', procedure: 'Retorno', status: 'Scheduled' },
  { id: '5', patientId: '5', patientName: 'Julia Roberts', patientPhone: '5511555555555', dentistId: 'u1', date: '2023-10-25', time: '16:00', procedure: 'Avaliação', status: 'Confirmed' },
];

const mockFinancialData = [
  { name: 'Jan', receita: 12000, despesa: 4000 },
  { name: 'Fev', receita: 15000, despesa: 5000 },
  { name: 'Mar', receita: 18000, despesa: 6000 },
  { name: 'Abr', receita: 14000, despesa: 4500 },
  { name: 'Mai', receita: 22000, despesa: 7000 },
];

const mockPatients: Patient[] = [
  { id: '1', name: 'Ana Silva', email: 'ana@email.com', phone: '5511999999999', lastVisit: '2023-10-10', status: 'Active' },
  { id: '2', name: 'Carlos Santos', email: 'carlos@email.com', phone: '5511888888888', lastVisit: '2023-10-12', status: 'Active' },
  { id: '3', name: 'Mariana Lima', email: 'mari@email.com', phone: '5511777777777', lastVisit: '2023-09-20', status: 'Inactive' },
  { id: '4', name: 'Roberto Firmino', email: 'beto@email.com', phone: '5511666666666', lastVisit: '2023-10-01', status: 'Active' },
];

const mockTransactions: Transaction[] = [
  { id: '1', description: 'Tratamento Canal - Ana Silva', amount: 850.00, type: 'Income', date: '2023-10-24', category: 'Serviços' },
  { id: '2', description: 'Compra Materiais Descartáveis', amount: 320.50, type: 'Expense', date: '2023-10-23', category: 'Materiais' },
  { id: '3', description: 'Limpeza - Carlos Santos', amount: 250.00, type: 'Income', date: '2023-10-22', category: 'Serviços' },
];

// --- COMPONENTS ---

const Overview: React.FC<{ onViewChange: (view: DashboardTab) => void, currentUser: User }> = ({ onViewChange, currentUser }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
        Olá, {currentUser.name.split(' ')[0]} <span className="text-2xl">👋</span>
      </h2>
      <p className="text-slate-500 font-medium bg-white px-4 py-1 rounded-full shadow-sm border border-slate-100">
        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>
    </div>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Revenue Card - Only Admin */}
      {currentUser.role === UserRole.ADMIN && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-brand-100"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Receita Mensal</h3>
             <div className="p-2 bg-brand-50 rounded-lg text-brand-600"><CreditCard className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900 relative z-10">R$ 22.450</p>
          <p className="text-xs text-green-600 mt-1 flex items-center font-medium relative z-10">↑ 12% vs mês anterior</p>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{currentUser.role === UserRole.DENTIST ? 'Meus Pacientes' : 'Pacientes'}</h3>
           <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Users className="w-5 h-5" /></div>
        </div>
        <p className="text-3xl font-bold text-slate-900">148</p>
        <p className="text-xs text-brand-600 mt-1 flex items-center font-medium">+5 novos essa semana</p>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Hoje</h3>
           <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Calendar className="w-5 h-5" /></div>
        </div>
        <p className="text-3xl font-bold text-slate-900">
           {currentUser.role === UserRole.DENTIST 
             ? mockAppointments.filter(a => a.date === '2023-10-25' && a.dentistId === currentUser.id).length
             : mockAppointments.filter(a => a.date === '2023-10-25').length}
        </p>
        <p className="text-xs text-slate-500 mt-1 font-medium">Consultas agendadas</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Retorno</h3>
           <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Sparkles className="w-5 h-5" /></div>
        </div>
        <p className="text-3xl font-bold text-slate-900">85%</p>
        <p className="text-xs text-green-600 mt-1 font-medium">Excelente fidelização</p>
      </div>
    </div>

    {/* Chart - Only Admin sees global finances */}
    <div className="grid lg:grid-cols-3 gap-6">
       {currentUser.role === UserRole.ADMIN && (
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Fluxo Financeiro</h3>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockFinancialData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                     <Tooltip 
                        cursor={{fill: '#f8fafc'}} 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                     />
                     <Bar dataKey="receita" fill="#d4af37" radius={[4, 4, 0, 0]} />
                     <Bar dataKey="despesa" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
       )}

       <div className={`${currentUser.role !== UserRole.ADMIN ? 'lg:col-span-3' : 'bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col'}`}>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Agenda Rápida (Hoje)</h3>
            <div className="space-y-4 flex-1 overflow-y-auto">
               {mockAppointments
                 .filter(app => app.date === '2023-10-25')
                 .filter(app => currentUser.role === UserRole.DENTIST ? app.dentistId === currentUser.id : true)
                 .map((app) => (
                  <div key={app.id} className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition border border-slate-100 group">
                     <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm border border-slate-200 group-hover:border-brand-300 group-hover:bg-brand-50 group-hover:text-brand-700 transition-colors">
                        {app.time}
                     </div>
                     <div className="ml-3 flex-1">
                        <p className="text-sm font-bold text-slate-900">{app.patientName}</p>
                        <p className="text-xs text-slate-500 font-medium">{app.procedure} • {mockDoctors.find(d => d.id === app.dentistId)?.name}</p>
                     </div>
                     <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                       app.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                     }`}>
                        {app.status === 'Confirmed' ? 'Confirmado' : 'Aguardando'}
                     </div>
                  </div>
               ))}
               {mockAppointments.filter(app => app.date === '2023-10-25' && (currentUser.role === UserRole.DENTIST ? app.dentistId === currentUser.id : true)).length === 0 && (
                 <p className="text-sm text-slate-400 text-center py-8">Nenhum agendamento para hoje.</p>
               )}
            </div>
            <button 
              onClick={() => onViewChange(DashboardTab.SCHEDULE)}
              className="w-full mt-6 py-3 text-sm font-bold text-brand-700 hover:bg-brand-50 bg-white border border-brand-200 rounded-xl transition flex items-center justify-center"
            >
               Ver agenda completa <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
       </div>
    </div>
  </div>
);

const ScheduleView: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 23)); 
  const [selectedDentist, setSelectedDentist] = useState<string>(currentUser.role === UserRole.DENTIST ? currentUser.id : 'ALL');

  const timeSlots = Array.from({ length: 11 }, (_, i) => `${i + 8}:00`); 
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
  
  const weekDates = days.map((day, i) => {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() + i);
    return { name: day, date: d.toISOString().split('T')[0], display: `${d.getDate()}` };
  });

  const getAppointment = (date: string, time: string) => {
    return mockAppointments.find(a => 
      a.date === date && 
      a.time.startsWith(time.split(':')[0]) && 
      (selectedDentist === 'ALL' || a.dentistId === selectedDentist)
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
         <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-brand-600" /> Agenda Semanal
            </h2>
            <div className="flex bg-white rounded-lg border border-slate-200 shadow-sm">
              <button className="p-2 hover:bg-slate-50 rounded-l-lg border-r border-slate-100"><ChevronLeft className="w-4 h-4 text-slate-500" /></button>
              <button className="p-2 hover:bg-slate-50 rounded-r-lg"><ChevronRight className="w-4 h-4 text-slate-500" /></button>
            </div>
            <span className="text-sm text-slate-500 font-bold uppercase tracking-wide">Outubro 2023</span>
         </div>
         
         <div className="flex items-center space-x-3">
           {/* Dentist Filter - Only for Admin/Secretary */}
           {currentUser.role !== UserRole.DENTIST && (
             <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                <Filter className="w-4 h-4 text-slate-400" />
                <select 
                  className="bg-transparent text-sm text-slate-700 outline-none border-none font-medium"
                  value={selectedDentist}
                  onChange={(e) => setSelectedDentist(e.target.value)}
                >
                  <option value="ALL">Todos os Dentistas</option>
                  {mockDoctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialty})</option>
                  ))}
                </select>
             </div>
           )}

           <button className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center shadow-lg shadow-brand-200 transition transform hover:-translate-y-0.5">
              <Plus className="w-4 h-4 mr-2" /> Novo Agendamento
           </button>
         </div>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-white">
        <div className="grid grid-cols-6 min-w-[800px] border border-slate-100 rounded-xl overflow-hidden">
          {/* Header Row */}
          <div className="p-4 bg-slate-50/80 border-b border-r border-slate-200"></div>
          {weekDates.map((d, i) => (
            <div key={i} className={`p-4 bg-slate-50/80 text-center border-b border-slate-200 ${i !== 4 ? 'border-r' : ''}`}>
              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">{d.name}</div>
              <div className="text-xl font-bold text-slate-800">{d.display}</div>
            </div>
          ))}

          {/* Time Slots */}
          {timeSlots.map((time, index) => (
            <React.Fragment key={time}>
              <div className={`p-4 border-r border-slate-100 text-xs text-slate-500 font-bold text-center bg-slate-50/30 flex items-center justify-center ${index !== timeSlots.length -1 ? 'border-b' : ''}`}>
                {time}
              </div>
              {weekDates.map((day, dIndex) => {
                const app = getAppointment(day.date, time);
                const isLastRow = index === timeSlots.length - 1;
                const isLastCol = dIndex === weekDates.length - 1;
                
                return (
                  <div key={`${day.date}-${time}`} className={`relative p-1 group transition-colors hover:bg-slate-50 ${!isLastRow ? 'border-b border-slate-100' : ''} ${!isLastCol ? 'border-r border-slate-100' : ''} min-h-[100px]`}>
                    {app ? (
                      <div className={`w-full h-full rounded-lg p-3 text-xs border-l-4 shadow-sm cursor-pointer transition transform hover:scale-[1.02] flex flex-col justify-between ${
                        app.status === 'Confirmed' 
                          ? 'bg-green-50/50 border-green-500 text-green-900' 
                          : 'bg-amber-50/50 border-amber-500 text-amber-900'
                      }`}>
                         <div>
                            <div className="font-bold truncate text-sm">{app.patientName}</div>
                            <div className="truncate opacity-80 mt-1">{app.procedure}</div>
                         </div>
                         <div className="flex justify-between items-end mt-2">
                           <div className="text-[10px] opacity-70 font-semibold uppercase tracking-wide">
                             {currentUser.role !== UserRole.DENTIST && mockDoctors.find(d => d.id === app.dentistId)?.name.split(' ')[1]}
                           </div>
                            {app.status !== 'Confirmed' && (
                              <button onClick={() => openDirectWhatsapp(app.patientPhone, 'Confirmar?')} className="text-amber-700 hover:text-amber-900 bg-amber-100 p-1.5 rounded-md hover:bg-amber-200 transition">
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                         </div>
                      </div>
                    ) : (
                      <div className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center">
                        <button className="bg-brand-50 text-brand-600 rounded-full p-2 hover:bg-brand-600 hover:text-white transition shadow-sm">
                           <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const FinancialView: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [receiptText, setReceiptText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  const handleGenerateReceipt = async (t: Transaction) => {
    setLoading(true);
    const text = await generateReceiptText(t.description.split('-')[1]?.trim() || 'Paciente', t.amount, t.description);
    setReceiptText(text);
    setLoading(false);
  };

  const handleGeneratePaymentLink = async () => {
    if (!paymentAmount) return;
    alert(`Link de pagamento de R$ ${paymentAmount} gerado e enviado ao WhatsApp do paciente via n8n!`);
    // Mock call
    triggerWhatsappAutomation({
        phone: '5511999999999',
        patientName: 'Paciente Teste',
        type: 'PAYMENT_LINK',
        data: { amount: paymentAmount }
    });
    setPaymentAmount('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Role Access Check: Only Admin sees global Charts */}
       {currentUser.role === UserRole.ADMIN ? (
           <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Saldo Total</h3>
                    <p className="text-3xl font-bold text-slate-800 mt-2">R$ 45.280,00</p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 text-slate-800 -mb-4 -mr-4">
                    <DollarSign className="w-32 h-32" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Entradas (Mês)</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">+ R$ 12.400,00</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Saídas (Mês)</h3>
                <p className="text-3xl font-bold text-red-600 mt-2">- R$ 3.150,00</p>
              </div>
           </div>
       ) : (
            // Secretary View for Finance (Limited)
           <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 flex justify-between items-center">
               <div>
                   <h3 className="text-lg font-bold text-brand-800">Área de Cobrança</h3>
                   <p className="text-brand-600 text-sm">Gere links de pagamento e emita recibos para os pacientes.</p>
               </div>
               <div className="bg-white p-2 rounded-xl shadow-sm">
                   <DollarSign className="w-8 h-8 text-brand-600" />
               </div>
           </div>
       )}

       <div className="grid md:grid-cols-3 gap-6">
           {/* Transaction Table */}
           <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">Transações Recentes</h2>
                {currentUser.role === UserRole.ADMIN && (
                    <button className="bg-brand-600 text-white hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-brand-200 transition">
                        + Lançamento
                    </button>
                )}
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm text-slate-600">
                   <thead className="bg-slate-50 text-slate-900 font-bold uppercase text-xs tracking-wider">
                     <tr>
                       <th className="px-6 py-4">Descrição</th>
                       <th className="px-6 py-4">Data</th>
                       <th className="px-6 py-4">Valor</th>
                       <th className="px-6 py-4 text-right">Recibo</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {mockTransactions.map((t) => (
                       <tr key={t.id} className="hover:bg-slate-50 transition">
                         <td className="px-6 py-4 font-medium text-slate-900">
                             {t.description}
                             <div className="text-xs text-slate-400 font-normal">{t.category}</div>
                         </td>
                         <td className="px-6 py-4">{t.date}</td>
                         <td className={`px-6 py-4 font-bold ${t.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                            {t.type === 'Income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                         </td>
                         <td className="px-6 py-4 text-right">
                           {t.type === 'Income' && (
                             <button 
                               onClick={() => handleGenerateReceipt(t)}
                               className="text-brand-600 hover:text-brand-800 inline-flex items-center justify-end px-3 py-1 rounded hover:bg-brand-50 transition"
                             >
                               <FileCheck className="w-4 h-4 mr-1" /> Gerar
                             </button>
                           )}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
              </div>
           </div>

           {/* Quick Payment Generator (Available for Admin and Secretary) */}
           <div className="bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800 p-6 flex flex-col justify-center">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                    <Link className="w-5 h-5 mr-2 text-brand-400" /> Cobrança Rápida
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                    Envie um link de pagamento direto para o WhatsApp do paciente.
                </p>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Valor (R$)</label>
                        <input 
                            type="number" 
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 mt-1 focus:ring-2 focus:ring-brand-500 outline-none text-lg font-mono" 
                            placeholder="0,00"
                        />
                    </div>
                    <button 
                        onClick={handleGeneratePaymentLink}
                        disabled={!paymentAmount}
                        className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-900/50 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Gerar Link Pix/Cartão
                    </button>
                </div>
           </div>
       </div>

       {/* Modal Logic for Receipts */}
       {receiptText && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fade-in border border-slate-200">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center">
                    <Sparkles className="w-4 h-4 text-brand-600 mr-2" />
                    Recibo Gerado por IA
                  </h3>
                  <button onClick={() => setReceiptText(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
               </div>
               <div className="bg-slate-50 p-6 rounded-xl text-sm text-slate-700 whitespace-pre-wrap font-mono mb-6 border border-slate-200 shadow-inner">
                  {receiptText}
               </div>
               <div className="flex space-x-3">
                  <button className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold transition flex items-center justify-center shadow-lg shadow-brand-200">
                    <Download className="w-4 h-4 mr-2" /> Copiar / Baixar
                  </button>
                  <button onClick={() => setReceiptText(null)} className="px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium text-slate-600 transition">Fechar</button>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

const AnamnesisView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'anamnesis' | 'medical_record' | 'odontogram' | 'files' | 'history'>('anamnesis');
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [n8nStatus, setN8nStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Structured Anamnesis State
  const [anamnesisForm, setAnamnesisForm] = useState<AnamnesisForm>({
    allergies: '',
    medications: '',
    isSmoker: false,
    hasDiabetes: false,
    hasHeartCondition: false,
    isPregnant: false,
    hasBleedingProblem: false,
    hasGastricProblems: false,
    otherComorbidities: '',
    lastUpdate: new Date().toLocaleDateString()
  });

  const handleSummarize = async () => {
    if(!notes) return;
    setIsProcessing(true);
    const result = await summarizeAnamnesis(notes);
    setSummary(result);
    // Simulate saving structured data too
    const sentToN8n = await processAnamnesisWithN8N({ patientId: 'mock-id', rawNotes: notes });
    setN8nStatus(sentToN8n ? 'success' : 'error');
    setIsProcessing(false);
    setTimeout(() => setN8nStatus('idle'), 3000);
  };

  const handleSaveStructured = () => {
      alert("Ficha Clínica salva com sucesso!");
      // Logic to save to Supabase would go here
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-140px)] animate-fade-in">
      {/* Patient Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
         <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-brand-600" />
                Ana Silva
                <span className="ml-3 text-xs font-normal bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">Paciente Ativo</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">Última visita: 10/10/2023 • Plano: Particular</p>
         </div>
         <div className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto max-w-full">
            {[
                {id: 'anamnesis', label: 'IA Resumo'},
                {id: 'medical_record', label: 'Ficha Clínica'},
                {id: 'odontogram', label: 'Odontograma'},
                {id: 'files', label: 'Arquivos'},
                {id: 'history', label: 'Histórico'}
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-white">
        
        {/* TAB: MEDICAL RECORD (Structured) */}
        {activeTab === 'medical_record' && (
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Anamnese Médica Objetiva</h3>
                        <p className="text-slate-500 text-sm">Preencha os dados de saúde sistêmica do paciente.</p>
                    </div>
                    <button onClick={handleSaveStructured} className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-brand-200 hover:bg-brand-700 transition flex items-center">
                        <Save className="w-4 h-4 mr-2" /> Salvar Ficha
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Medical Conditions Toggles */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h4 className="font-bold text-slate-700 mb-4 flex items-center"><Activity className="w-5 h-5 mr-2 text-brand-600"/> Condições Sistêmicas</h4>
                        <div className="space-y-4">
                            {[
                                { key: 'hasHeartCondition', label: 'Problemas Cardíacos' },
                                { key: 'hasDiabetes', label: 'Diabetes' },
                                { key: 'hasBleedingProblem', label: 'Problemas de Coagulação / Sangramento' },
                                { key: 'hasGastricProblems', label: 'Problemas Gástricos' },
                                { key: 'isSmoker', label: 'Fumante' },
                                { key: 'isPregnant', label: 'Gestante' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                    <span className="text-slate-700 font-medium text-sm">{item.label}</span>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => setAnamnesisForm({...anamnesisForm, [item.key]: true})}
                                            className={`px-3 py-1 rounded text-xs font-bold transition ${
                                                // @ts-ignore
                                                anamnesisForm[item.key] ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-400'
                                            }`}
                                        >
                                            SIM
                                        </button>
                                        <button 
                                            onClick={() => setAnamnesisForm({...anamnesisForm, [item.key]: false})}
                                            className={`px-3 py-1 rounded text-xs font-bold transition ${
                                                // @ts-ignore
                                                !anamnesisForm[item.key] ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-400'
                                            }`}
                                        >
                                            NÃO
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Text Fields */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-1 text-amber-500" /> Alergias
                            </label>
                            <textarea 
                                value={anamnesisForm.allergies} 
                                onChange={(e) => setAnamnesisForm({...anamnesisForm, allergies: e.target.value})}
                                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm min-h-[100px]"
                                placeholder="Liste alergias a medicamentos, látex, alimentos..."
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                                <Pill className="w-4 h-4 mr-1 text-blue-500" /> Medicamentos em Uso
                            </label>
                            <textarea 
                                value={anamnesisForm.medications} 
                                onChange={(e) => setAnamnesisForm({...anamnesisForm, medications: e.target.value})}
                                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm min-h-[100px]"
                                placeholder="Liste medicamentos contínuos e dosagens..."
                            ></textarea>
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Outras Observações</label>
                            <input 
                                type="text"
                                value={anamnesisForm.otherComorbidities} 
                                onChange={(e) => setAnamnesisForm({...anamnesisForm, otherComorbidities: e.target.value})}
                                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                placeholder="Cirurgias recentes, hospitalizações, etc."
                            />
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* TAB: ANAMNESIS (AI) */}
        {activeTab === 'anamnesis' && (
          <div className="grid lg:grid-cols-2 gap-6 h-full">
            <div className="flex flex-col h-full">
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-brand-600" />
                  Notas Evolutivas (Assistido por IA)
               </h3>
               <div className="bg-brand-50/50 p-4 rounded-xl border border-brand-100 mb-4 text-xs text-brand-800">
                  <p className="font-bold mb-1">Dica:</p> 
                  Descreva o procedimento e a queixa do paciente livremente. A IA irá formatar e resumir para o histórico oficial.
               </div>
               <textarea 
                  className="flex-1 w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none text-slate-700 leading-relaxed text-base shadow-inner"
                  placeholder="Ex: Paciente relatou dor no dente 36 ao mastigar. Realizado teste de vitalidade positivo. Inciado tratamento endodôntico..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
               ></textarea>
               <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                     <span className="w-2 h-2 rounded-full bg-green-500"></span>
                     <p className="text-xs text-slate-400">Gemini 2.5 Flash Online</p>
                  </div>
                  <button 
                     onClick={handleSummarize}
                     disabled={isProcessing || !notes}
                     className="bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white px-6 py-3 rounded-xl font-bold flex items-center transition shadow-lg shadow-brand-200 transform hover:-translate-y-0.5"
                  >
                     {isProcessing ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div> : <Sparkles className="w-4 h-4 mr-2" />}
                     Processar e Salvar
                  </button>
               </div>
               {n8nStatus !== 'idle' && (
                  <div className={`mt-2 text-sm font-medium ${n8nStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                     {n8nStatus === 'success' ? '✓ Salvo e sincronizado com n8n.' : '✕ Erro na conexão.'}
                  </div>
               )}
            </div>

            <div className="flex flex-col h-full">
               <h3 className="text-lg font-bold text-slate-800 mb-4">Prévia do Prontuário</h3>
               {summary ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-8 flex-1 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                     <div className="flex items-start mb-4">
                        <FileCheck className="w-6 h-6 text-brand-600 mr-2" />
                        <div>
                            <h4 className="font-bold text-slate-800">Resumo Gerado</h4>
                            <p className="text-xs text-slate-400">{new Date().toLocaleString()}</p>
                        </div>
                     </div>
                     <p className="text-slate-700 leading-relaxed text-lg font-serif">{summary}</p>
                     <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end space-x-3">
                        <button className="text-sm text-slate-500 font-medium hover:text-slate-800 px-4 py-2">Editar</button>
                        <button className="text-sm bg-slate-900 text-white font-bold hover:bg-slate-800 px-6 py-2 rounded-lg shadow-lg">Confirmar Inserção</button>
                     </div>
                  </div>
               ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <Sparkles className="w-8 h-8 text-slate-300" />
                     </div>
                     <p className="text-sm font-medium">Aguardando análise da IA...</p>
                  </div>
               )}
            </div>
          </div>
        )}

        {/* Other Tabs (Visual Only for this demo) */}
        {activeTab === 'odontogram' && (
           <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="bg-slate-50 p-10 rounded-full border border-slate-100 shadow-inner">
                 <Stethoscope className="w-20 h-20 text-brand-200" />
              </div>
              <div>
                 <h3 className="text-2xl font-bold text-slate-800">Odontograma Digital</h3>
                 <p className="text-slate-500">Mapeamento visual da arcada dentária em desenvolvimento.</p>
              </div>
           </div>
        )}

        {activeTab === 'files' && (
           <div className="space-y-6">
              <div className="flex items-center justify-center border-2 border-dashed border-brand-200 rounded-2xl p-12 bg-brand-50/30 hover:bg-brand-50 transition cursor-pointer group">
                 <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition">
                        <Upload className="w-8 h-8 text-brand-500" />
                    </div>
                    <p className="text-slate-800 font-bold text-lg">Clique para enviar exames</p>
                    <p className="text-sm text-slate-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                 </div>
              </div>
              <h3 className="font-bold text-slate-800 mt-6 border-b border-slate-100 pb-2">Arquivos do Paciente</h3>
              <div className="grid md:grid-cols-3 gap-4">
                 <div className="flex items-center p-4 border border-slate-200 rounded-xl hover:shadow-md transition bg-white group cursor-pointer">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-100 transition"><FileText className="w-6 h-6"/></div>
                    <div>
                       <p className="font-bold text-slate-800 text-sm">Raio-X Panorâmico.pdf</p>
                       <p className="text-xs text-slate-500 mt-1">10 Out 2023 • 2.4 MB</p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'history' && (
           <div className="space-y-8 pl-6 border-l-2 border-slate-200 relative ml-4">
              {[1, 2].map((i) => (
                 <div key={i} className="relative">
                    <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-brand-500 border-4 border-white shadow-md"></div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 hover:shadow-md transition">
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-800 text-lg">Tratamento de Canal (Dente 46)</h4>
                          <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-600 uppercase tracking-wide">10 Out 2023</span>
                       </div>
                       <p className="text-slate-600 leading-relaxed">Procedimento realizado sem intercorrências. Paciente medicado com analgésico.</p>
                       <div className="mt-4 flex items-center space-x-2">
                           <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" className="w-6 h-6 rounded-full" />
                           <span className="text-xs font-bold text-slate-500">Dr. Roberto</span>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};

// ... SettingsView remains similar but uses AppSettings ...
const SettingsView: React.FC<{ settings: AppSettings, onSave: (s: AppSettings) => void }> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  // Expanded color palette - Adding Gold/Dark options
  const brandColors = [
    '#d4af37', // Gold (Standard)
    '#0d9488', // Teal
    '#2563eb', // Blue
    '#1e293b', // Dark Slate
    '#7c3aed', // Violet
    '#be123c', // Rose
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setLocalSettings({ ...localSettings, logoUrl: objectUrl });
    }
  };

  const handleSave = () => {
    onSave(localSettings);
    alert('Tema atualizado com sucesso!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
       <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
             Configurações da Clínica
          </h2>
          
          <div className="space-y-8">
             {/* Identity Section */}
             <div className="pb-8 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Identidade Visual</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nome da Clínica</label>
                    <input 
                      type="text" 
                      value={localSettings.clinicName}
                      onChange={(e) => setLocalSettings({...localSettings, clinicName: e.target.value})}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Logo</label>
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                          {localSettings.logoUrl ? (
                            <img src={localSettings.logoUrl} className="w-full h-full object-contain p-2" alt="Preview" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-slate-600" />
                          )}
                      </div>
                      <div className="flex-1">
                        <label className="cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center transition">
                          <Upload className="w-4 h-4 mr-2" />
                          Carregar Logo
                          <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        </label>
                        <p className="text-xs text-slate-500 mt-2">Recomendado: Logo Branco/Dourado em fundo transparente.</p>
                      </div>
                    </div>
                  </div>
                </div>
             </div>

             {/* Theme Section */}
             <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Cor Principal</h3>
                <div className="flex gap-4">
                   {brandColors.map((color) => (
                      <button 
                         key={color}
                         onClick={() => setLocalSettings({...localSettings, primaryColor: color})}
                         className={`w-12 h-12 rounded-full cursor-pointer transition transform hover:scale-110 flex items-center justify-center relative shadow-sm border-2 ${localSettings.primaryColor === color ? 'border-slate-800' : 'border-transparent'}`}
                         style={{backgroundColor: color}}
                      >
                        {localSettings.primaryColor === color && <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md" />}
                      </button>
                   ))}
                </div>
             </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
             <button 
                onClick={handleSave}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold flex items-center transition shadow-lg"
             >
                <Save className="w-5 h-5 mr-2" />
                Salvar Tema
             </button>
          </div>
       </div>
    </div>
  );
};

// ... PatientsView ...
const PatientsView: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
      <h2 className="text-lg font-bold text-slate-800">Base de Pacientes</h2>
      <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition shadow-md shadow-brand-200">
        <Plus className="w-4 h-4 mr-2" /> Novo Paciente
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-slate-900 font-bold uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-4">Nome</th>
            <th className="px-6 py-4">Contato</th>
            <th className="px-6 py-4">Última Visita</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {mockPatients.map((patient) => (
            <tr key={patient.id} className="hover:bg-slate-50 transition">
              <td className="px-6 py-4 font-bold text-slate-900">{patient.name}</td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span>{patient.email}</span>
                  <span className="text-slate-400 text-xs">{patient.phone}</span>
                </div>
              </td>
              <td className="px-6 py-4">{patient.lastVisit}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  {patient.status === 'Active' ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                   <button 
                      onClick={() => openDirectWhatsapp(patient.phone, `Olá ${patient.name}, tudo bem?`)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Abrir WhatsApp"
                   >
                      <MessageCircle className="w-5 h-5" />
                   </button>
                   <button className="text-slate-400 hover:text-brand-600 p-2 hover:bg-slate-100 rounded-lg transition">
                      <FileText className="w-5 h-5" />
                   </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Helper Icon
const SettingsIcon: React.FC<{className?:string}> = ({className}) => (
   <Settings className={className} />
);

// Main Export
const DashboardViews: React.FC<{ 
  activeTab: DashboardTab, 
  appSettings: AppSettings, 
  setAppSettings: (s: AppSettings) => void,
  currentUser: User
}> = ({ activeTab, appSettings, setAppSettings, currentUser }) => {
  const [view, setView] = React.useState(activeTab);

  useEffect(() => {
    setView(activeTab);
  }, [activeTab]);

  switch (view) {
    case DashboardTab.OVERVIEW: return <Overview onViewChange={setView} currentUser={currentUser} />;
    case DashboardTab.PATIENTS: return <PatientsView />;
    case DashboardTab.FINANCIAL: return <FinancialView currentUser={currentUser} />;
    case DashboardTab.ANAMNESIS: return <AnamnesisView />;
    case DashboardTab.SCHEDULE: return <ScheduleView currentUser={currentUser} />;
    case DashboardTab.SETTINGS: return <SettingsView settings={appSettings} onSave={setAppSettings} />;
    default: return null;
  }
};

export default DashboardViews;
