// =============================================================================
// app/[programId]/social/oficinas/page.tsx
// Gestão de Oficinas - PTS (Passo 29.1).
// Baseada fielmente no Stitch, projeto "DESIGN SIGAH".
// =============================================================================

"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProgram } from "@/lib/hooks/useProgram";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import {
  ChevronRight,
  PlusCircle,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Clock,
  Home,
  MessageSquare,
  Users,
  Settings,
  X,
  Loader2,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Plus,
  Compass,
  ArrowUpRight,
  FileText,
  DollarSign,
  Leaf,
  Monitor,
  Hammer,
  HelpCircle
} from "lucide-react";

interface WorkshopItem {
  id: string;
  title: string;
  module: string;
  status: "ativa" | "pendente" | "concluida";
  statusText: string;
  statusBg: string;
  nextDate: string;
  nextTime: string;
  currentAttendees: number;
  maxAttendees: number;
  icon: React.ComponentType<any>;
  iconBg: string;
  iconColor: string;
}

export default function GestaoOficinasPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Controles
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Lista de Oficinas
  const [workshops, setWorkshops] = useState<WorkshopItem[]>([
    {
      id: "w-financas",
      title: "Educação Financeira",
      module: "Gestão Familiar",
      status: "ativa",
      statusText: "Ativa",
      statusBg: "bg-emerald-50 text-emerald-800 border-emerald-100",
      nextDate: "15 Out, 2024",
      nextTime: "14:00 - 16:00",
      currentAttendees: 22,
      maxAttendees: 25,
      icon: DollarSign,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      id: "w-horta",
      title: "Horta Comunitária",
      module: "Sustentabilidade",
      status: "ativa",
      statusText: "Ativa",
      statusBg: "bg-emerald-50 text-emerald-800 border-emerald-100",
      nextDate: "18 Out, 2024",
      nextTime: "08:30 - 11:30",
      currentAttendees: 12,
      maxAttendees: 15,
      icon: Leaf,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-700"
    },
    {
      id: "w-digital",
      title: "Inclusão Digital Sênior",
      module: "Navegação Segura",
      status: "pendente",
      statusText: "Pendente",
      statusBg: "bg-amber-50 text-amber-800 border-amber-200",
      nextDate: "22 Out, 2024",
      nextTime: "15:00 - 17:00",
      currentAttendees: 8,
      maxAttendees: 20,
      icon: Monitor,
      iconBg: "bg-blue-50",
      iconColor: "text-[#0059bb]"
    },
    {
      id: "w-marcenaria",
      title: "Oficina de Marcenaria",
      module: "Pequenos Reparos",
      status: "ativa",
      statusText: "Ativa",
      statusBg: "bg-emerald-50 text-emerald-800 border-emerald-100",
      nextDate: "25 Out, 2024",
      nextTime: "19:00 - 21:00",
      currentAttendees: 10,
      maxAttendees: 10,
      icon: Hammer,
      iconBg: "bg-slate-50",
      iconColor: "text-slate-650"
    }
  ]);

  // Nova oficina inputs
  const [newTitle, setNewTitle] = useState("");
  const [newModule, setNewModule] = useState("");
  const [newMax, setNewMax] = useState(20);

  // Cadastrar nova oficina
  const handleCreateWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newModule) return;

    setIsProcessing(true);
    setToastMessage("Registrando nova oficina no PTS...");
    setTimeout(() => {
      setIsProcessing(false);
      setShowAddModal(false);

      const newItem: WorkshopItem = {
        id: `w-${Date.now()}`,
        title: newTitle,
        module: newModule,
        status: "pendente",
        statusText: "Pendente",
        statusBg: "bg-amber-50 text-amber-800 border-amber-200",
        nextDate: "A definir",
        nextTime: "--:-- - --:--",
        currentAttendees: 0,
        maxAttendees: Number(newMax),
        icon: Plus,
        iconBg: "bg-slate-100",
        iconColor: "text-slate-550"
      };

      setWorkshops(prev => [newItem, ...prev]);
      setNewTitle("");
      setNewModule("");
      setToastMessage(`Oficina "${newTitle}" criada com sucesso!`);
      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
  };

  return (
    <div className="bg-surface text-primary min-h-screen pb-24 md:pb-0 flex flex-col font-sans">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="pt-24 px-4 md:p-10 max-w-7xl mx-auto w-full space-y-12">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho da Rota */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-8">
                <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">
                  <span>Trabalho Social</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                  <span className="text-secondary font-black">Gestão de Oficinas</span>
                </nav>
                <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight mt-2 select-none">
                  Gestão de Oficinas <br />
                  <span className="text-secondary">Plano de Trabalho Social</span>
                </h1>
              </div>

              <div className="md:col-span-4 flex justify-start md:justify-end select-none">
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary hover:bg-[#003366] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all border-none"
                >
                  <PlusCircle className="w-5 h-5 text-white" />
                  Cadastrar Nova Oficina
                </button>
              </div>
            </div>

            {/* Grid Bento Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Tabela de Oficinas (Col 3) */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                  
                  <div className="flex justify-between items-center mb-8 select-none">
                    <h2 className="text-lg font-black text-primary uppercase tracking-wide">Oficinas em Andamento</h2>
                    <span className="bg-slate-100 px-4 py-2 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      Total: {workshops.length.toString().padStart(2, "0")}
                    </span>
                  </div>

                  {/* Headers da Tabela */}
                  <div className="grid grid-cols-12 gap-4 pb-4 border-b-2 border-slate-100 text-slate-400 font-black text-[9px] tracking-wider uppercase select-none">
                    <div className="col-span-5">Título da Oficina</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-3">Próxima Data</div>
                    <div className="col-span-2 text-right">Ocupação</div>
                  </div>

                  {/* Linhas da Tabela */}
                  <div className="divide-y divide-slate-100/80">
                    {workshops.map(work => {
                      const IconComponent = work.icon;
                      const isFull = work.currentAttendees >= work.maxAttendees;
                      const pct = (work.currentAttendees / work.maxAttendees) * 100;
                      
                      return (
                        <div 
                          key={work.id}
                          className="grid grid-cols-12 gap-4 py-6 items-center hover:bg-slate-50 transition-colors group"
                        >
                          <div className="col-span-5 flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg ${work.iconBg} ${work.iconColor} flex items-center justify-center shrink-0 select-none`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-black text-sm text-primary group-hover:text-secondary transition-colors">
                                {work.title}
                              </p>
                              <p className="text-[10px] text-slate-400 font-semibold select-none">
                                Módulo: {work.module}
                              </p>
                            </div>
                          </div>

                          <div className="col-span-2 flex justify-center select-none">
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider border ${work.statusBg}`}>
                              {work.statusText}
                            </span>
                          </div>

                          <div className="col-span-3">
                            <p className="text-xs font-black text-slate-700">{work.nextDate}</p>
                            <p className="text-[10px] text-slate-400 font-semibold select-none">{work.nextTime}</p>
                          </div>

                          <div className="col-span-2 text-right select-none">
                            <div className="flex flex-col items-end">
                              <span className="text-xs font-black text-primary">
                                {work.currentAttendees}/{work.maxAttendees}
                              </span>
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                <div 
                                  className={`h-full ${isFull ? "bg-red-500" : "bg-secondary"}`} 
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* Sidebar Lateral (Col 1) */}
              <div className="lg:col-span-1 flex flex-col gap-6 select-none">
                
                {/* Impact Stat Card */}
                <div className="bg-primary-container text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <span className="text-[9px] font-black uppercase tracking-wider opacity-85">Engajamento Total</span>
                    <div className="text-4xl font-black tracking-tight mt-2">142</div>
                    <p className="text-xs text-slate-350 font-semibold leading-relaxed">
                      Beneficiários ativos participando das atividades sociais neste mês.
                    </p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-10">
                    <Users className="w-[120px] h-[120px]" />
                  </div>
                </div>

                {/* Alertas PTS */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/50 space-y-6">
                  <h3 className="font-black text-xs text-primary uppercase tracking-wide flex items-center gap-2">
                    <AlertCircle className="w-4.5 h-4.5 text-secondary shrink-0" />
                    Alertas PTS
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl flex gap-3 items-start border-l-4 border-l-amber-600 border border-slate-100 shadow-sm">
                      <AlertTriangle className="w-4.5 h-4.5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-black text-primary leading-tight">Lista de espera crítica</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-relaxed">
                          Horta Comunitária: 12 beneficiários aguardando vaga.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl flex gap-3 items-start border-l-4 border-l-secondary border border-slate-100 shadow-sm">
                      <Calendar className="w-4.5 h-4.5 text-secondary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-black text-primary leading-tight">Relatório Semestral</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-relaxed">
                          Data limite para envio consolidado ao Ministério: 30/10.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setToastMessage("Abrindo painel geral de notificações PTS...");
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="w-full py-3 hover:bg-slate-200/40 text-secondary hover:text-secondary-container transition-all rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer border-none bg-transparent"
                  >
                    <span>Ver Todos os Alertas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          MODAL DE CADASTRO DE OFICINA
          ========================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowAddModal(false)}></div>
          <form 
            onSubmit={handleCreateWorkshop}
            className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
          >
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Cadastrar Nova Oficina</h3>
              <button 
                type="button"
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest select-none">
                  Título da Oficina
                </label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  placeholder="Ex: Educação Financeira"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest select-none">
                  Módulo / Eixo
                </label>
                <input 
                  type="text" 
                  required
                  value={newModule}
                  onChange={(e) => setNewModule(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  placeholder="Ex: Gestão Familiar"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest select-none">
                  Capacidade Máxima
                </label>
                <input 
                  type="number" 
                  required
                  min={1}
                  value={newMax}
                  onChange={(e) => setNewMax(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3 select-none">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-650 font-black text-xs uppercase tracking-widest rounded-xl transition-all border-none cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-secondary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all border-none cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Cadastrando...</span>
                    </>
                  ) : (
                    <span>Confirmar</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
