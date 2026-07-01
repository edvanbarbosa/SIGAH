// =============================================================================
// app/[programId]/recursos/page.tsx
// Gestão de Restrições para Liberação de Recursos (Passo 22.10).
// Baseada fielmente no Stitch, projeto "DESIGN SIGAH".
// =============================================================================

"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProgram } from "@/lib/hooks/useProgram";
import { Footer } from "@/components/layout/Footer";
import {
  Menu,
  RefreshCw,
  MapPin,
  AlertOctagon,
  Users,
  Wrench,
  ChevronUp,
  FileText,
  Handshake,
  ShieldAlert,
  TreePine,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Paperclip,
  CheckCircle,
  Loader2,
  Home,
  GitFork,
  User
} from "lucide-react";

interface Restricao {
  id: string;
  title: string;
  description: string;
  status: "PENDENTE" | "ALERTA" | "BLOQUEADO" | "VALIDADO" | "AFASTADO" | "REGULARIZADO";
  statusColorClass: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColorClass: string;
  iconBgClass: string;
}

export default function GestaoRestricoesPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Feedbacks
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Emergency Toggle
  const [emergencyActive, setEmergencyActive] = useState(false);

  // List of Restrictions State
  const [restricoes, setRestricoes] = useState<Restricao[]>([
    {
      id: "trabalho-social",
      title: "Trabalho Social (Empreendimentos 2023+)",
      description: "Requisito: Primeira liberação bloqueada até validação social.",
      status: "PENDENTE",
      statusColorClass: "bg-[#592300]/10 text-[#381300] border border-[#ffb690]/20",
      icon: Users,
      iconColorClass: "text-[#381300]",
      iconBgClass: "bg-[#ffdbca]"
    },
    {
      id: "infraestrutura",
      title: "Infraestrutura Externa",
      description: "Requisito: Entrega bloqueada por pendência em infra externa.",
      status: "ALERTA",
      statusColorClass: "bg-yellow-50 text-yellow-800 border border-yellow-250",
      icon: Wrench,
      iconColorClass: "text-yellow-700",
      iconBgClass: "bg-yellow-100"
    },
    {
      id: "elevadores",
      title: "Aporte Financeiro para Elevadores",
      description: "Requisito: Falta de aporte específico no convênio.",
      status: "BLOQUEADO",
      statusColorClass: "bg-red-50 text-[#ba1a1a] border border-[#ffdad6]",
      icon: ChevronUp,
      iconColorClass: "text-[#ba1a1a]",
      iconBgClass: "bg-[#ffdad6]"
    },
    {
      id: "contrato-manutencao",
      title: "Contrato de Manutenção (60 meses)",
      description: "Requisito: Condicionante para liberações finais.",
      status: "PENDENTE",
      statusColorClass: "bg-slate-100 text-slate-700 border border-slate-200",
      icon: FileText,
      iconColorClass: "text-slate-650",
      iconBgClass: "bg-slate-200/50"
    },
    {
      id: "convenio-despesas",
      title: "Convênio de Cobertura de Despesas",
      description: "Requisito: Celebrado entre EPL e Gestor do Fundo.",
      status: "PENDENTE",
      statusColorClass: "bg-slate-100 text-slate-700 border border-slate-200",
      icon: Handshake,
      iconColorClass: "text-slate-650",
      iconBgClass: "bg-slate-200/50"
    }
  ]);

  // Audit Logs State
  const [logs, setLogs] = useState([
    {
      time: "Hoje, 09:14",
      user: "Carlos Eduardo (Analista)",
      text: "Revisão de documentos iniciada por ",
      colorClass: "bg-secondary"
    },
    {
      time: "14 Out, 16:45",
      user: "Sistema de Georreferenciamento",
      text: "Restrição \"Infra Externa\" sinalizada pelo ",
      colorClass: "bg-amber-600"
    }
  ]);

  // Upload Area
  const [uploadedDeclaration, setUploadedDeclaration] = useState<string | null>(null);

  // Dynamic calculations
  const totalCount = restricoes.length;
  const resolvedCount = restricoes.filter(
    (r) => r.status === "VALIDADO" || r.status === "AFASTADO" || r.status === "REGULARIZADO"
  ).length;
  // If emergency is active, override is 100% or we just calculate base progress
  const progressPercent = emergencyActive ? 100 : Math.round((resolvedCount / totalCount) * 100);

  // Actions
  const handleRefresh = () => {
    setIsRefreshing(true);
    setToastMessage("Sincronizando status das restrições com a Caixa Econômica...");
    setTimeout(() => {
      setIsRefreshing(false);
      setToastMessage("Status das restrições atualizados com sucesso!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1500);
  };

  const handleAction = (id: string, actionType: string) => {
    setRestricoes((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          let nextStatus: Restricao["status"] = "VALIDADO";
          let nextColor = "bg-emerald-50 text-emerald-800 border border-emerald-250";
          if (actionType === "afastar") {
            nextStatus = "AFASTADO";
            nextColor = "bg-blue-50 text-blue-800 border border-blue-250";
          } else if (actionType === "regularizar") {
            nextStatus = "REGULARIZADO";
            nextColor = "bg-teal-50 text-teal-800 border border-teal-250";
          }
          return {
            ...r,
            status: nextStatus,
            statusColorClass: nextColor
          };
        }
        return r;
      })
    );

    // Append Log
    const label = actionType === "afastar" ? "afastada" : actionType === "regularizar" ? "regularizada" : "validada";
    const titleText = restricoes.find((r) => r.id === id)?.title || "";
    setLogs((prev) => [
      {
        time: "Agora mesmo",
        user: "Gestor Central (Operador)",
        text: `Restrição "${titleText}" marcada como ${label} por `,
        colorClass: "bg-emerald-600"
      },
      ...prev
    ]);

    setToastMessage(`Restrição resolvida com sucesso!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleEmergencyToggle = () => {
    const nextVal = !emergencyActive;
    setEmergencyActive(nextVal);
    if (nextVal) {
      alert(
        "ALERTA: O Protocolo de Calamidade foi ativado. Todas as restrições burocráticas foram suspensas temporariamente para este empreendimento."
      );
      setLogs((prev) => [
        {
          time: "Agora mesmo",
          user: "Gestor Central (Operador)",
          text: `Protocolo Emergencial de Calamidade ativado por `,
          colorClass: "bg-red-650"
        },
        ...prev
      ]);
      setToastMessage("Protocolo de Calamidade ativado!");
    } else {
      setLogs((prev) => [
        {
          time: "Agora mesmo",
          user: "Gestor Central (Operador)",
          text: `Protocolo Emergencial de Calamidade desativado por `,
          colorClass: "bg-slate-500"
        },
        ...prev
      ]);
      setToastMessage("Protocolo de Calamidade desativado.");
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeclarationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedDeclaration(file.name);
      setToastMessage(`Declaração "${file.name}" anexada com sucesso!`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen pb-24 md:pb-0 md:pl-80 font-sans flex flex-col selection:bg-[#0059bb]/20">
      
      {/* 1. TopAppBar do Mockup */}
      <header className="w-full top-0 sticky z-40 bg-white flex items-center justify-between px-6 py-4 border-b border-[#c3c6d1]/20 shadow-sm select-none">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#e1e3e4]/50 transition-colors rounded-full border-none bg-transparent cursor-pointer flex items-center">
            <Menu className="w-6 h-6 text-[#001e40]" />
          </button>
          <h1 className="font-headline text-xl font-black tracking-tight text-[#001e40] tracking-tighter">SIGAH</h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden md:block font-headline font-bold text-[#001e40] text-sm">
            Gestão de Restrições
          </span>
          <div className="w-10 h-10 rounded-full bg-[#003366] flex items-center justify-center text-[#a7c8ff] overflow-hidden border-2 border-slate-200 select-none">
            <img 
              alt="Operador" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3La1qEZX1JLUtUa7bvT_ZTTypQVuuO2lBHp3EhZt7sZ4MNbLkYbyd0GjtvT4D0BHyjSNewjHc7Vb5hK7fpyhu8CtRmNTLEyjmZiC2IeUTtfTyzsCrRf8Wu8_iDd-Nx3G75JpBJSfIUWQyt7koqpmqlphtWTCDH1OQrohkfzVXJAXfsVFggZQ-P1EjJcuCrLLrpIDytJW_cTcM8_LAWZtDx_xmBRDVm_Die0ARaD8hHLk1husCVnYXJPFYu6Vd0LW6TPYDEOgtBZ4" 
            />
          </div>
        </div>
      </header>

      {/* 2. Side Navigation (Large screens, Drawer) */}
      <aside className="hidden md:flex h-full w-80 fixed left-0 top-0 bg-[#edeeef] flex-col py-6 px-4 gap-2 z-50 shadow-2xl shadow-primary/10 select-none">
        <div className="px-4 mb-8">
          <h2 className="font-headline font-bold text-[#191c1d] text-lg">SIGAH Habitação</h2>
        </div>
        <nav className="flex flex-col gap-1">
          <button 
            onClick={() => router.push(`/${programId}/dashboard`)}
            className="flex items-center gap-4 px-4 py-3.5 text-[#43474f] hover:bg-[#e1e3e4] rounded-full transition-all border-none bg-transparent cursor-pointer w-full text-left"
          >
            <Home className="w-5 h-5 text-[#43474f]" />
            <span className="font-body text-sm font-semibold">Início</span>
          </button>
          <button 
            onClick={() => router.push(`/${programId}/cadastro`)}
            className="flex items-center gap-4 px-4 py-3.5 bg-[#0070ea] text-white font-bold rounded-full transition-all border-none cursor-pointer w-full text-left shadow-md shadow-[#0070ea]/20"
          >
            <GitFork className="w-5 h-5 text-white" />
            <span className="font-body text-sm font-bold">Fila</span>
          </button>
          <button 
            onClick={() => router.push(`/${programId}/social`)}
            className="flex items-center gap-4 px-4 py-3.5 text-[#43474f] hover:bg-[#e1e3e4] rounded-full transition-all border-none bg-transparent cursor-pointer w-full text-left"
          >
            <Users className="w-5 h-5 text-[#43474f]" />
            <span className="font-body text-sm font-semibold">Social</span>
          </button>
          <button 
            onClick={() => {}}
            className="flex items-center gap-4 px-4 py-3.5 text-[#43474f] hover:bg-[#e1e3e4] rounded-full transition-all border-none bg-transparent cursor-pointer w-full text-left"
          >
            <User className="w-5 h-5 text-[#43474f]" />
            <span className="font-body text-sm font-semibold">Perfil</span>
          </button>
        </nav>
        
        <div className="mt-auto px-4 py-6 border-t border-[#c3c6d1]/10">
          <div className="bg-[#003366]/5 p-4 rounded-2xl border border-[#003366]/10">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1.5">Status do Sistema</p>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-[#43474f] font-bold">Conexão Segura</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-[100] select-none max-w-md">
          <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 3. Main Content Canvas */}
      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 flex-grow w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 select-none">
          <div>
            <h2 className="text-3xl font-headline font-black text-primary tracking-tight">
              Restrições para Liberação de Recursos
            </h2>
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mt-1.5">
              Identificador de Requisito: RF051
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setToastMessage("Relatório de restrições gerado com sucesso!")}
              className="bg-[#e1e3e4] px-4 py-2.5 rounded-lg font-black text-xs text-on-surface-variant border border-[#c3c6d1]/20 hover:bg-slate-200 transition-colors uppercase tracking-wider cursor-pointer"
            >
              GERAR RELATÓRIO
            </button>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-primary-container px-4 py-2.5 rounded-lg font-black text-xs text-white shadow-lg shadow-primary/20 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider border-none"
            >
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <RefreshCw className="w-4 h-4 text-white" />
              )}
              <span>ATUALIZAR STATUS</span>
            </button>
          </div>
        </div>

        {/* Overview Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
          <div className="md:col-span-2 bg-white rounded-xl p-6 flex flex-col justify-between min-h-[160px] border border-[#c3c6d1]/10 shadow-sm">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1.5">
                  Empreendimento Selecionado
                </p>
                <h3 className="text-2xl font-headline font-black text-primary leading-tight">
                  Residencial Solar dos Ipês
                </h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1 font-semibold">
                  <MapPin className="text-[#0059bb] w-4 h-4 shrink-0" />
                  <span>Setor Habitacional Noroeste, Brasília - DF</span>
                </p>
              </div>
              <span className="bg-error-container text-on-error-container px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5 shrink-0 border border-error/10">
                <AlertOctagon className="w-4 h-4 text-error shrink-0" />
                <span>LIBERAÇÃO SUSPENSA</span>
              </span>
            </div>
            
            <div className="mt-6 flex items-center gap-8">
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Data da Última Vistoria</p>
                <p className="font-extrabold text-sm text-primary mt-0.5">14/10/2023</p>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1.5">Progresso Global</p>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-[#e1e3e4] rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${emergencyActive ? "bg-emerald-600 w-full" : "bg-[#0059bb]"}`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <span className="font-black text-sm text-primary">{progressPercent}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#003366] text-white rounded-xl p-6 relative overflow-hidden flex flex-col justify-between border border-[#001e40] shadow-sm">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-[#799dd6] uppercase tracking-widest mb-1">
                Fundo Vinculado
              </p>
              <h3 className="text-lg font-headline font-black text-white leading-tight">
                Fundo de Desenvolvimento Habitacional
              </h3>
            </div>
            <div className="relative z-10 flex flex-col mt-4">
              <span className="text-3xl font-black text-white tracking-tight">R$ 12.4M</span>
              <span className="text-xs text-[#799dd6] font-semibold mt-0.5">Saldo Reservado para Contrato</span>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#799dd6]/10 rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* Critical Restrictions List */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest px-1 select-none">
            Restrições Críticas Identificadas
          </h3>
          <div className="space-y-4">
            {restricoes.map((rest) => {
              const IconComponent = rest.icon;
              const isResolved = rest.status === "VALIDADO" || rest.status === "AFASTADO" || rest.status === "REGULARIZADO";
              
              return (
                <div 
                  key={rest.id}
                  className={`bg-white hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 rounded-xl p-5 border border-[#c3c6d1]/10 grid grid-cols-1 md:grid-cols-12 items-center gap-4 ${
                    rest.status === "BLOQUEADO" ? "border-l-4 border-l-error" : ""
                  }`}
                >
                  <div className="md:col-span-1 flex justify-center select-none">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${rest.iconBgClass} ${rest.iconColorClass}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="md:col-span-4 select-none">
                    <h4 className="font-black text-[#001e40] text-sm leading-tight">{rest.title}</h4>
                    <p className="text-xs text-on-surface-variant mt-1 font-semibold">{rest.description}</p>
                  </div>

                  <div className="md:col-span-2 flex md:justify-center select-none">
                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-wider uppercase text-center block w-full max-w-[120px] ${rest.statusColorClass}`}>
                      {rest.status}
                    </span>
                  </div>

                  <div className="md:col-span-5 flex justify-end gap-2">
                    <button 
                      onClick={() => setToastMessage(`Abrindo documentos relacionados a: ${rest.title}`)}
                      className="text-xs font-black text-[#001e40] px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors uppercase tracking-wider border-none bg-transparent cursor-pointer"
                    >
                      Ver Documentação
                    </button>
                    
                    {!isResolved && (
                      <button 
                        onClick={() => {
                          if (rest.id === "infraestrutura") handleAction(rest.id, "afastar");
                          else if (rest.id === "elevadores") handleAction(rest.id, "regularizar");
                          else handleAction(rest.id, "validar");
                        }}
                        className="bg-secondary text-white text-xs font-black px-6 py-2.5 rounded-lg shadow-md hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider border-none cursor-pointer"
                      >
                        {rest.id === "infraestrutura" ? (
                          <span>Afastar Bloqueio</span>
                        ) : rest.id === "elevadores" ? (
                          <span>Regularizar Aporte</span>
                        ) : rest.id === "contrato-manutencao" || rest.id === "convenio-despesas" ? (
                          <span>Anexar Documento</span>
                        ) : (
                          <span>Validar Realização</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Specialized Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Emergency Override Section */}
          <section className="bg-tertiary-container text-white rounded-2xl p-6 border border-[#592300]/20 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div className="flex items-start gap-4 relative z-10 select-none">
              <div className="bg-[#ffdbca] text-[#381300] p-3 rounded-xl shrink-0 shadow-sm">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-headline font-black text-white">
                  Casos de Calamidade ou Emergência
                </h4>
                <p className="text-xs text-[#d8885c] leading-relaxed font-semibold">
                  Dispensa automática de impedimentos para famílias vítimas de desastres ou situações de risco iminente.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10 relative z-10 select-none">
              <span className="text-[9px] font-black text-[#d8885c] uppercase tracking-widest">Protocolo Emergencial</span>
              <button 
                onClick={handleEmergencyToggle}
                className={`px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-wider transition-all active:scale-95 border-none cursor-pointer shadow-md ${
                  emergencyActive 
                    ? "bg-error text-white" 
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/25"
                }`}
              >
                {emergencyActive ? "DESATIVAR DISPENSA" : "ATIVAR DISPENSA POR CALAMIDADE"}
              </button>
            </div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -rotate-45 translate-x-32 -translate-y-32"></div>
          </section>

          {/* Public Maintenance Section */}
          <section className="bg-[#f3f4f5] rounded-2xl p-6 border border-[#c3c6d1]/20 flex flex-col justify-between min-h-[220px]">
            <div className="select-none space-y-1">
              <h4 className="text-base font-headline font-black text-primary flex items-center gap-2">
                <TreePine className="w-5 h-5 text-secondary shrink-0" />
                <span>Declaração de Manutenção de Áreas Públicas</span>
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed font-semibold pt-1">
                Documento formal onde o ente público assume a responsabilidade pela conservação das áreas comuns externas ao empreendimento.
              </p>
            </div>

            <div className="mt-4">
              <div className="border-2 border-dashed border-[#c3c6d1] rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white transition-colors cursor-pointer group relative">
                <input 
                  type="file" 
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleDeclarationUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-[#737780] group-hover:text-primary transition-colors shrink-0" />
                <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors block text-center">
                  {uploadedDeclaration ? "Alterar Declaração Assinada" : "Anexar Declaração Assinada"}
                </span>
                <span className="text-[9px] text-slate-400 text-center block">
                  {uploadedDeclaration ? uploadedDeclaration : "PDF, JPG ou PNG (Máx 10MB)"}
                </span>
              </div>
            </div>
          </section>

        </div>

        {/* System Logs / Audit */}
        <section className="bg-white rounded-xl p-6 border border-[#c3c6d1]/10 shadow-sm space-y-4">
          <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest select-none">
            Log de Atividades
          </h4>
          <div className="space-y-4 select-none">
            {logs.map((log, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-semibold text-[#191c1d]">
                <div className="flex items-center gap-4 min-w-[120px]">
                  <span className="text-[10px] text-slate-400 tabular-nums font-bold">{log.time}</span>
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${log.colorClass}`}></span>
                </div>
                <span>
                  {log.text}
                  <strong className="text-primary font-bold">{log.user}</strong>
                </span>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 4. Footer Reutilizável */}
      <Footer />

      {/* ==========================================
          MOBILE BOTTOM NAV BAR (Simulado do Stitch)
          ========================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pb-6 pt-3 bg-white border-t border-slate-200/50 rounded-t-xl select-none">
        <button className="flex flex-col items-center justify-center text-on-surface-variant/70 border-none bg-transparent cursor-pointer">
          <Home className="w-5 h-5 text-[#43474f]" />
          <span className="font-label text-[10px] font-bold mt-1">Início</span>
        </button>
        <button className="flex flex-col items-center justify-center text-secondary font-bold border-none bg-transparent cursor-pointer">
          <GitFork className="w-5 h-5 text-[#0059bb]" />
          <span className="font-label text-[10px] font-bold mt-1">Fila</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant/70 border-none bg-transparent cursor-pointer">
          <Users className="w-5 h-5 text-[#43474f]" />
          <span className="font-label text-[10px] font-bold mt-1">Social</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant/70 border-none bg-transparent cursor-pointer">
          <User className="w-5 h-5 text-[#43474f]" />
          <span className="font-label text-[10px] font-bold mt-1">Perfil</span>
        </button>
      </nav>

    </div>
  );
}
