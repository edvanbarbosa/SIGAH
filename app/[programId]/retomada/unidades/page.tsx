// =============================================================================
// app/[programId]/retomada/unidades/page.tsx
// Gestão de Unidades Retomadas (Passo 28.4 / Etapa 63).
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
  Building,
  Wrench,
  Users,
  Plus,
  ArrowRight,
  Gavel,
  ChevronRight,
  CheckCircle,
  X,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Loader2,
  Trash2,
  Calendar,
  AlertTriangle,
  History
} from "lucide-react";

interface RepossessedUnit {
  id: string;
  title: string;
  location: string;
  tagText: string;
  tagColorClass: string;
  status: "pronta" | "reforma" | "litigio";
  details: string;
  imageUrl?: string;
}

interface TimelineLog {
  id: string;
  title: string;
  time: string;
  desc: string;
  colorClass: string;
}

export default function GestaoUnidadesRetomadasPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados principais reativos
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Unidades Retomadas
  const [units, setUnits] = useState<RepossessedUnit[]>([
    {
      id: "UH-402-C",
      title: "Unidade 402 - Bloco C",
      location: "Conjunto Habitacional Primavera • São Paulo, SP",
      tagText: "Pronta para Reocupação",
      tagColorClass: "bg-[#ffdbca] text-[#381300] border border-[#ffb690]/30",
      status: "pronta",
      details: "Liberada após inspeção técnica de desocupação e regularidade.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBwxbp5Ugo_fzvQPhqYdI7iYmSCCU0l56bK60NpEuXVPsbpmQgn8pmIEYl96NsQdLJKS1iUdmH4Gsz0oOI7BLMC0jOZ88_syPLRxOd6HKSckPF8na_2RPh_2X6pZdChD6uf4hfTPWW6iVFn1APVYQ3UrIcKbSAWwRZDql1vpcJ9nWTuG84GRAgSVLDJjs-i2WZP8Z3fRWlTHq8ddMWfymdTsYy5HkTdCPl9f_lD1NQaP2gb1DGyQoRvDx1Ro_yzx8vPbHoAJQudyM"
    },
    {
      id: "UH-12-A",
      title: "Unidade 12 - Bloco A",
      location: "Residencial Aurora • Curitiba, PR",
      tagText: "Em Reforma",
      tagColorClass: "bg-[#d8e2ff] text-[#001a41] border border-[#adc7ff]/30",
      status: "reforma",
      details: "Previsão de término: 15/11/2023. Manutenção estrutural em andamento.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzmtyJcmo9Ukw0DEN8PVN5wJ8Aa0NmSmjK5-QnCOv4QUAU3xICRIaQiPvDi1mMAB_GsOQ3suI3ZftZjdaAkyB1wnh4cDDYhyJlhbfO4j23qV613tmcrD05KIKA7cRXu_70f2YhmwQvLATitTXhs8Sjs62iInDGTfXaFjvAL_eZrUfUV8MKM4Fd0IYTQvitZbgblCvH_aac_e7O8S2nTy6DOLsGB9-z3hUGZeyq4OP4VXfvZy1tNtjoOgTBuwKlNcQOc6io6uryxQc"
    },
    {
      id: "UH-108-F",
      title: "Unidade 108 - Bloco F",
      location: "Vila Esperança • Porto Alegre, RS",
      tagText: "Litígio Judicial",
      tagColorClass: "bg-red-50 text-red-800 border border-red-200",
      status: "litigio",
      details: "Processo judicial em trâmite: 500241-20.2023. Aguardando posse definitiva."
    }
  ]);

  // Logs do Histórico
  const [logs, setLogs] = useState<TimelineLog[]>([
    {
      id: "log-1",
      title: "Vistoria Concluída",
      time: "Hoje, 09:45",
      desc: "Unidade 402 liberada para reocupação após inspeção final de engenharia.",
      colorClass: "bg-secondary-container text-white"
    },
    {
      id: "log-2",
      title: "Nova Retomada",
      time: "Ontem, 16:20",
      desc: "Processo de retomada da Unidade 12 iniciado por descumprimento contratual.",
      colorClass: "bg-[#001e40] text-white"
    },
    {
      id: "log-3",
      title: "Liminar Deferida",
      time: "24 Out, 11:30",
      desc: "Bloqueio de posse judicial para Unidade 108 solicitado pela procuradoria.",
      colorClass: "bg-tertiary-container text-white"
    }
  ]);

  // Modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDesignateModal, setShowDesignateModal] = useState(false);
  const [activeUnitForDesignation, setActiveUnitForDesignation] = useState<RepossessedUnit | null>(null);

  // Formulário de Nova Retomada
  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formStatus, setFormStatus] = useState<"pronta" | "reforma" | "litigio">("reforma");
  const [formDetails, setFormDetails] = useState("");

  // Famílias elegíveis simuladas
  const mockFamilies = [
    { rank: 1, name: "Ana Maria de Sousa", score: 980, members: 4 },
    { rank: 2, name: "Roberto Ferreira Neto", score: 954, members: 3 },
    { rank: 3, name: "Juliana Mendes Silva", score: 920, members: 5 }
  ];

  // Adicionar Nova Retomada
  const handleCreateRetomada = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formLocation) return;

    const newId = `UH-${Math.floor(100 + Math.random() * 900)}-${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`;
    
    let tag = "Em Reforma";
    let tagBg = "bg-[#d8e2ff] text-[#001a41] border border-[#adc7ff]/30";
    if (formStatus === "pronta") {
      tag = "Pronta para Reocupação";
      tagBg = "bg-[#ffdbca] text-[#381300] border border-[#ffb690]/30";
    } else if (formStatus === "litigio") {
      tag = "Litígio Judicial";
      tagBg = "bg-red-50 text-red-800 border border-red-200";
    }

    const newUnit: RepossessedUnit = {
      id: newId,
      title: formName,
      location: formLocation,
      tagText: tag,
      tagColorClass: tagBg,
      status: formStatus,
      details: formDetails || "Nenhum detalhe adicional inserido."
    };

    setUnits(prev => [newUnit, ...prev]);

    // Inserir no log de processos
    const newLog: TimelineLog = {
      id: `log-${Date.now()}`,
      title: "Nova Retomada Cadastrada",
      time: "Agora mesmo",
      desc: `Unidade ${formName} integrada ao painel sob o status de ${tag}.`,
      colorClass: formStatus === "pronta" ? "bg-secondary-container text-white" : "bg-[#001e40] text-white"
    };
    setLogs(prev => [newLog, ...prev]);

    // Fechar e resetar
    setShowCreateModal(false);
    setFormName("");
    setFormLocation("");
    setFormStatus("reforma");
    setFormDetails("");

    setToastMessage(`Unidade ${newId} cadastrada com sucesso!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Designar Família
  const handleConfirmDesignation = (familyName: string) => {
    if (!activeUnitForDesignation) return;

    // Atualiza a unidade para designada (remove ou atualiza o status)
    setUnits(prev => prev.filter(u => u.id !== activeUnitForDesignation.id));

    // Adiciona log de designação
    const newLog: TimelineLog = {
      id: `log-${Date.now()}`,
      title: "Família Designada",
      time: "Agora mesmo",
      desc: `Unidade ${activeUnitForDesignation.title} designada oficialmente para a família de ${familyName}.`,
      colorClass: "bg-emerald-600 text-white"
    };
    setLogs(prev => [newLog, ...prev]);

    setShowDesignateModal(false);
    setActiveUnitForDesignation(null);

    setToastMessage(`Unidade designada para ${familyName} com sucesso!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen pb-24 md:pb-0 flex flex-col selection:bg-[#0059bb]/20">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="w-full max-w-6xl mx-auto px-6 pt-24 pb-32 space-y-8">
            
            {/* Toast Notification */}
            {toastMessage && (
              <div className="fixed top-24 right-4 bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md z-[100] select-none max-w-md animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Abas Superiores do Módulo de Retomada */}
            <div className="border-b border-slate-200 select-none">
              <nav className="flex gap-6 -mb-px">
                <button 
                  onClick={() => router.push(`/${programId}/retomada`)}
                  className="pb-4 px-1 border-b-2 border-transparent text-slate-400 hover:text-primary text-xs font-black uppercase tracking-wider cursor-pointer bg-transparent"
                >
                  Execução Extrajudicial
                </button>
                <button 
                  className="pb-4 px-1 border-b-2 border-secondary text-[#001e40] text-xs font-black uppercase tracking-wider cursor-pointer bg-transparent"
                >
                  Gestão de Unidades Retomadas
                </button>
              </nav>
            </div>

            {/* Cabeçalho e Ação */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 select-none">
              <div>
                <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Gestão</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                  <span>Retomada de Imóveis</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                  <span className="text-secondary font-black">Unidades Retomadas</span>
                </nav>
                <h2 className="font-headline font-black text-3xl text-primary tracking-tight mt-2">
                  Gestão de Unidades Retomadas
                </h2>
                <p className="text-slate-500 text-xs mt-1 font-semibold">
                  Controle, reforma e readequação de habitações recuperadas para recolocação no programa.
                </p>
              </div>

              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-primary hover:bg-[#003366] text-white px-5 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-none cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Nova Retomada</span>
              </button>
            </div>

            {/* Bento Grid Summary Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
              
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between group hover:bg-[#001e40] hover:text-white transition-all duration-300 cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🏢</span>
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-[#adc7ff] uppercase tracking-widest">Total Geral</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-5xl font-black text-primary group-hover:text-white transition-colors">1.248</span>
                  <span className="text-slate-450 group-hover:text-[#adc7ff] text-xs font-bold uppercase">unidades</span>
                </div>
                <p className="text-[10px] mt-4 text-slate-450 group-hover:text-[#adc7ff] font-black uppercase tracking-wider">+12% este mês</p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between group hover:bg-[#001e40] hover:text-white transition-all duration-300 cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🔨</span>
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-[#adc7ff] uppercase tracking-widest">Em Reforma</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-5xl font-black text-primary group-hover:text-white transition-colors">86</span>
                  <span className="text-slate-450 group-hover:text-[#adc7ff] text-xs font-bold uppercase">em andamento</span>
                </div>
                <div className="w-full bg-[#f3f4f5] group-hover:bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-secondary group-hover:bg-white h-full w-[65%] transition-all"></div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between group hover:bg-[#001e40] hover:text-white transition-all duration-300 cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🏡</span>
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-[#adc7ff] uppercase tracking-widest">Disponíveis</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-5xl font-black text-primary group-hover:text-white transition-colors">42</span>
                  <span className="text-slate-450 group-hover:text-[#adc7ff] text-xs font-bold uppercase">prontas</span>
                </div>
                <p className="text-[10px] mt-4 text-slate-450 group-hover:text-[#adc7ff] font-black uppercase tracking-wider">Aguardando designação</p>
              </div>

            </section>

            {/* Asymmetric Layout: List & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Seção Esquerda: Unidades Recentes (8 Colunas) */}
              <section className="lg:col-span-8 space-y-6">
                
                <div className="flex items-center justify-between px-2 select-none">
                  <h3 className="font-headline font-black text-lg text-primary uppercase tracking-wide">Unidades Recentes</h3>
                  <div className="flex items-center gap-1.5 text-slate-455 text-xs font-bold uppercase tracking-wider cursor-pointer hover:text-primary transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filtrar</span>
                  </div>
                </div>

                {/* Cards List */}
                <div className="space-y-4">
                  {units.map((unit) => (
                    <div 
                      key={unit.id}
                      className={`bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all border-l-4 ${
                        unit.status === "pronta" 
                          ? "border-l-tertiary" 
                          : unit.status === "reforma" 
                          ? "border-l-secondary" 
                          : "border-l-error"
                      }`}
                    >
                      {/* Left: Info */}
                      <div className="flex items-center gap-4 flex-grow w-full md:w-auto">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/40 select-none">
                          {unit.imageUrl ? (
                            <img 
                              className="w-full h-full object-cover" 
                              alt={unit.title} 
                              src={unit.imageUrl} 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                              <Building className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-primary text-sm flex items-center gap-2">
                            <span>{unit.title}</span>
                            <span className="text-[9px] bg-slate-100 text-slate-455 px-2 py-0.5 rounded font-black tracking-wider uppercase">
                              {unit.id}
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-455 font-bold select-none">{unit.location}</p>
                          <p className="text-[10px] text-slate-400 italic">{unit.details}</p>
                        </div>
                      </div>

                      {/* Right: Status and Actions */}
                      <div className="flex flex-col items-end gap-3 shrink-0 w-full md:w-auto select-none">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${unit.tagColorClass}`}>
                          {unit.tagText}
                        </span>

                        {unit.status === "pronta" && (
                          <button 
                            onClick={() => {
                              setActiveUnitForDesignation(unit);
                              setShowDesignateModal(true);
                            }}
                            className="bg-secondary-container hover:brightness-110 text-white text-[10px] px-4 py-2 rounded-lg font-black uppercase tracking-wider flex items-center gap-1.5 border-none cursor-pointer shadow-sm active:scale-95 transition-all w-full md:w-auto justify-center"
                          >
                            <span>Designar Família</span>
                            <ArrowRight className="w-3.5 h-3.5 text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {units.length === 0 && (
                    <div className="bg-white p-12 rounded-2xl border border-slate-200/60 text-center select-none space-y-2">
                      <span className="text-4xl">🏢</span>
                      <p className="text-xs font-bold text-slate-400">Nenhuma unidade retomada em exibição.</p>
                    </div>
                  )}
                </div>

                <div className="text-center select-none">
                  <button 
                    onClick={() => setToastMessage("Abrindo painel geral de controle matricial...")}
                    className="text-secondary hover:text-primary font-black text-xs uppercase tracking-wider border-none bg-transparent cursor-pointer"
                  >
                    Ver todas as 1.248 unidades
                  </button>
                </div>
              </section>

              {/* Seção Direita: Log de Processos (4 Colunas) */}
              <section className="lg:col-span-4 bg-[#f3f4f5]/60 rounded-2xl p-6 md:p-8 border border-slate-200/40">
                <h3 className="font-headline font-black text-sm text-primary uppercase tracking-wider mb-8 select-none">
                  Log de Processos
                </h3>
                
                <div className="space-y-8 relative select-none">
                  {/* Timeline Line */}
                  <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-200"></div>

                  {logs.map((log) => (
                    <div key={log.id} className="relative pl-10 group">
                      {/* Bullet */}
                      <div className={`absolute left-0 top-0.5 w-6 h-6 rounded-full border-4 border-[#f3f4f5] z-10 flex items-center justify-center text-[10px] shrink-0 font-extrabold ${log.colorClass}`}>
                        •
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-[#001e40]">{log.title}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider">{log.time}</p>
                        <div className="bg-white p-3.5 rounded-xl text-[10px] font-bold text-slate-500 border border-slate-200/30 leading-relaxed shadow-sm">
                          {log.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setToastMessage("Gerando log completo de auditoria matricial...")}
                  className="w-full mt-10 py-3.5 rounded-xl border border-secondary hover:bg-secondary hover:text-white text-secondary text-xs font-black uppercase tracking-wider transition-all cursor-pointer bg-transparent"
                >
                  Ver Relatório Completo
                </button>
              </section>

            </div>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          MODAL: CADASTRAR NOVA RETOMADA
          ========================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-5 border border-outline-variant/10">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 select-none">
              <div>
                <h3 className="text-base font-black text-primary uppercase tracking-wide">Cadastrar Unidade Retomada</h3>
                <p className="text-[10px] text-on-surface-variant font-bold mt-1 uppercase">
                  Insira os dados do imóvel retomado
                </p>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-primary p-1 rounded-full hover:bg-slate-100 transition-colors border-none cursor-pointer bg-transparent flex items-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateRetomada} className="space-y-4 text-xs font-semibold text-primary">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Identificação do Imóvel</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Unidade 204 - Bloco B"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl border border-slate-250 bg-slate-50 px-3.5 py-3 text-primary font-bold focus:ring-0 focus:border-secondary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Empreendimento e Localização</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Condomínio Planalto • São Paulo, SP"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-250 bg-slate-50 px-3.5 py-3 text-primary font-bold focus:ring-0 focus:border-secondary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Status da Recuperação</label>
                <select 
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-250 bg-slate-50 px-3.5 py-3 text-primary font-bold focus:ring-0 focus:border-secondary"
                >
                  <option value="reforma">Em Reforma / Reparos</option>
                  <option value="pronta">Pronta para Reocupação</option>
                  <option value="litigio">Litígio Judicial / Insegura</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Observações Técnicas</label>
                <textarea 
                  rows={3}
                  placeholder="Histórico ou detalhes sobre a desocupação..."
                  value={formDetails}
                  onChange={(e) => setFormDetails(e.target.value)}
                  className="w-full rounded-xl border border-slate-250 bg-slate-50 px-3.5 py-3 text-primary font-bold focus:ring-0 focus:border-secondary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-white font-black rounded-xl text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none shadow-md"
              >
                Cadastrar Unidade
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: DESIGNAR FAMÍLIA ELEGÍVEL
          ========================================== */}
      {showDesignateModal && activeUnitForDesignation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-5 border border-outline-variant/10">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 select-none">
              <div>
                <h3 className="text-base font-black text-primary uppercase tracking-wide">Designar Unidade Retomada</h3>
                <p className="text-[10px] text-on-surface-variant font-bold mt-1 uppercase">
                  Imóvel: {activeUnitForDesignation.title}
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowDesignateModal(false);
                  setActiveUnitForDesignation(null);
                }}
                className="text-slate-400 hover:text-primary p-1 rounded-full hover:bg-slate-100 transition-colors border-none cursor-pointer bg-transparent flex items-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Famílias elegíveis */}
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-semibold select-none leading-relaxed">
                Selecione uma das famílias com maior classificação na fila de espera para receber a posse definitiva deste imóvel:
              </p>

              <div className="space-y-3">
                {mockFamilies.map((fam) => (
                  <div 
                    key={fam.rank}
                    onClick={() => handleConfirmDesignation(fam.name)}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200/50 hover:bg-secondary-container/10 hover:border-secondary cursor-pointer transition-all flex justify-between items-center group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-[#001e40] text-white w-5 h-5 rounded-full flex items-center justify-center select-none">
                          {fam.rank}º
                        </span>
                        <span className="text-xs font-black text-[#001e40]">{fam.name}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wider select-none">
                        {fam.members} dependentes • Pontuação: {fam.score}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-350 group-hover:text-secondary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setShowDesignateModal(false);
                setActiveUnitForDesignation(null);
              }}
              className="w-full py-3.5 bg-transparent border border-slate-250 text-primary font-black rounded-xl text-xs uppercase tracking-wider hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancelar
            </button>

          </div>
        </div>
      )}

      {/* ==========================================
          MOBILE BOTTOM NAV BAR (Simulado do Stitch)
          ========================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-45 bg-white/95 backdrop-blur-md border-t border-slate-200/50 rounded-t-xl select-none flex justify-around items-center px-4 pb-4 pt-2 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-bold tracking-wide">Início</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <span className="text-xl">📢</span>
          <span className="text-[10px] font-bold tracking-wide">Denúncias</span>
        </button>
        <button className="flex flex-col items-center justify-center text-secondary bg-secondary-fixed/30 rounded-full px-4 py-1 active:scale-90 duration-200 border-none cursor-pointer">
          <span className="text-xl">🔄</span>
          <span className="text-[10px] font-bold tracking-wide">Retomadas</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-bold tracking-wide">Perfil</span>
        </button>
      </nav>

    </div>
  );
}
