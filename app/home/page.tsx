// =============================================================================
// app/home/page.tsx
// Hub pós-login do usuário autenticado (Página Home).
// Exibe conteúdo diferenciado por perfil:
// - Cidadão: solicitações de cadastro (família e dossiê de habitação)
// - Operadores: programas cadastrados, programas disponíveis e notificações
// =============================================================================

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { Header } from "@/components/layout/Header";
import { LandingFooter } from "@/components/layout/LandingFooter";
import {
  Bell,
  Building2,
  ChevronRight,
  Info,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  LogOut,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Users,
  FileText,
  Home,
  ClipboardList,
  Plus,
  Eye,
  Pencil,
  CircleDot,
} from "lucide-react";

// =============================================================================
// Mock Data
// =============================================================================

interface Notification {
  id: string;
  type: "info" | "warning" | "success";
  title: string;
  description: string;
  date: string;
  read: boolean;
}

interface EnrolledProgram {
  slug: string;
  name: string;
  shortName: string;
  primaryColor: string;
  accentColor: string;
  status: string;
  statusType: "pending" | "approved" | "in_review";
  enrolledAt: string;
}

interface AvailableProgram {
  slug: string;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  deadline: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "success",
    title: "Inscrição confirmada",
    description:
      "Sua inscrição no programa MCMV-FAR foi recebida e está em análise pela equipe técnica.",
    date: "Hoje, 10:32",
    read: false,
  },
  {
    id: "n2",
    type: "warning",
    title: "Documentação pendente",
    description:
      "Você possui 2 documentos pendentes de envio para o programa CDRU. Regularize para evitar indeferimento.",
    date: "Ontem, 15:47",
    read: false,
  },
  {
    id: "n3",
    type: "info",
    title: "Novo ciclo aberto",
    description:
      "O programa de Regularização Fundiária Urbana abriu inscrições para o ciclo 2026.2.",
    date: "28 Jun, 09:15",
    read: true,
  },
  {
    id: "n4",
    type: "info",
    title: "Manutenção programada",
    description:
      "O sistema ficará indisponível no dia 05/07 das 02:00 às 06:00 para atualização.",
    date: "27 Jun, 14:00",
    read: true,
  },
];

const MOCK_ENROLLED_PROGRAMS: EnrolledProgram[] = [
  {
    slug: "mcmv-far",
    name: "Minha Casa Minha Vida — FAR",
    shortName: "MCMV-FAR",
    primaryColor: "#003366",
    accentColor: "#eab308",
    status: "Em Análise",
    statusType: "in_review",
    enrolledAt: "15/06/2026",
  },
  {
    slug: "cdru",
    name: "Concessão de Direito Real de Uso",
    shortName: "CDRU",
    primaryColor: "#0d5c3a",
    accentColor: "#84cc16",
    status: "Documentação Pendente",
    statusType: "pending",
    enrolledAt: "02/05/2026",
  },
];

const MOCK_AVAILABLE_PROGRAMS: AvailableProgram[] = [
  {
    slug: "reurb",
    name: "Regularização Fundiária Urbana (REURB)",
    description:
      "Programa destinado à regularização de núcleos urbanos informais, garantindo segurança jurídica da posse e titulação.",
    primaryColor: "#7c3aed",
    accentColor: "#a78bfa",
    deadline: "Até 30/09/2026",
  },
  {
    slug: "cohab-social",
    name: "COHAB Social — Locação Acessível",
    description:
      "Programa de aluguel subsidiado para famílias com renda de até 1 salário mínimo em situação de vulnerabilidade habitacional.",
    primaryColor: "#0369a1",
    accentColor: "#38bdf8",
    deadline: "Até 15/08/2026",
  },
];

// =============================================================================
// Mock Data — Cidadão (Solicitações de Cadastro)
// =============================================================================

interface CadastroFamiliaSolicitacao {
  id: string;
  protocolo: string;
  status: "rascunho" | "enviado" | "em_analise" | "pendente_documentos" | "aprovado" | "reprovado";
  dataCriacao: string;
  dataAtualizacao: string;
  membros: number;
  progresso: number;
}

interface DossieHabitacaoSolicitacao {
  id: string;
  protocolo: string;
  status: "nao_iniciado" | "em_preenchimento" | "enviado" | "em_analise" | "aprovado" | "reprovado";
  dataCriacao: string;
  dataAtualizacao: string;
  programaVinculado: string | null;
}

const MOCK_CADASTRO_FAMILIA: CadastroFamiliaSolicitacao = {
  id: "cf-001",
  protocolo: "CAD-2026-00187",
  status: "em_analise",
  dataCriacao: "15/06/2026",
  dataAtualizacao: "28/06/2026",
  membros: 4,
  progresso: 100,
};

const MOCK_DOSSIE_HABITACAO: DossieHabitacaoSolicitacao = {
  id: "dh-001",
  protocolo: "DOS-2026-00092",
  status: "em_preenchimento",
  dataCriacao: "20/06/2026",
  dataAtualizacao: "29/06/2026",
  programaVinculado: "MCMV-FAR",
};

const cadastroFamiliaStatusMap: Record<CadastroFamiliaSolicitacao["status"], { label: string; color: string; bgColor: string; borderColor: string }> = {
  rascunho: { label: "Rascunho", color: "text-[#737780]", bgColor: "bg-[#737780]/10", borderColor: "border-[#737780]/20" },
  enviado: { label: "Enviado", color: "text-[#0059bb]", bgColor: "bg-[#0059bb]/10", borderColor: "border-[#0059bb]/20" },
  em_analise: { label: "Em Análise", color: "text-[#0059bb]", bgColor: "bg-[#0059bb]/10", borderColor: "border-[#0059bb]/20" },
  pendente_documentos: { label: "Documentação Pendente", color: "text-amber-700", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/20" },
  aprovado: { label: "Aprovado", color: "text-emerald-700", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/20" },
  reprovado: { label: "Reprovado", color: "text-red-700", bgColor: "bg-red-500/10", borderColor: "border-red-500/20" },
};

const dossieStatusMap: Record<DossieHabitacaoSolicitacao["status"], { label: string; color: string; bgColor: string; borderColor: string }> = {
  nao_iniciado: { label: "Não Iniciado", color: "text-[#737780]", bgColor: "bg-[#737780]/10", borderColor: "border-[#737780]/20" },
  em_preenchimento: { label: "Em Preenchimento", color: "text-amber-700", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/20" },
  enviado: { label: "Enviado", color: "text-[#0059bb]", bgColor: "bg-[#0059bb]/10", borderColor: "border-[#0059bb]/20" },
  em_analise: { label: "Em Análise", color: "text-[#0059bb]", bgColor: "bg-[#0059bb]/10", borderColor: "border-[#0059bb]/20" },
  aprovado: { label: "Aprovado", color: "text-emerald-700", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/20" },
  reprovado: { label: "Reprovado", color: "text-red-700", bgColor: "bg-red-500/10", borderColor: "border-red-500/20" },
};

// =============================================================================
// Helper Components
// =============================================================================

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

const notificationIcon = {
  info: <Info className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  success: <CheckCircle2 className="w-5 h-5" />,
};

const notificationColors = {
  info: {
    bg: "bg-[#0059bb]/10",
    text: "text-[#0059bb]",
    dot: "bg-[#0059bb]",
  },
  warning: {
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  success: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
  },
};

const statusColors = {
  pending: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  in_review: "bg-[#0059bb]/10 text-[#0059bb] border-[#0059bb]/20",
};

// =============================================================================
// Painel do Cidadão — Solicitações de Cadastro
// =============================================================================

function getCadastroActionLabel(status: CadastroFamiliaSolicitacao["status"]): { label: string; icon: React.ReactNode } {
  switch (status) {
    case "rascunho":
      return { label: "Continuar Cadastro", icon: <Pencil className="w-4 h-4" /> };
    case "pendente_documentos":
      return { label: "Enviar Documentos", icon: <FileText className="w-4 h-4" /> };
    case "reprovado":
      return { label: "Refazer Cadastro", icon: <Plus className="w-4 h-4" /> };
    default:
      return { label: "Visualizar", icon: <Eye className="w-4 h-4" /> };
  }
}

function getDossieActionLabel(status: DossieHabitacaoSolicitacao["status"]): { label: string; icon: React.ReactNode } {
  switch (status) {
    case "nao_iniciado":
      return { label: "Criar Dossiê", icon: <Plus className="w-4 h-4" /> };
    case "em_preenchimento":
      return { label: "Continuar", icon: <Pencil className="w-4 h-4" /> };
    case "reprovado":
      return { label: "Refazer Dossiê", icon: <Plus className="w-4 h-4" /> };
    default:
      return { label: "Acompanhar", icon: <Eye className="w-4 h-4" /> };
  }
}

interface ProgramAction {
  label: string;
  href: string;
  primary?: boolean;
}

const getProgramActions = (profile: string, slug: string, enrolled?: boolean): ProgramAction[] => {
  switch (profile) {
    case "gestor":
      return [
        { label: "Dashboard", href: `/${slug}/dashboard`, primary: true },
        { label: "Ciclos", href: `/${slug}/ciclos` },
        { label: "Auditoria", href: `/${slug}/auditoria` },
      ];
    case "assistente_social":
      return [
        { label: "Trabalho Social", href: `/${slug}/social`, primary: true },
        { label: "Cadastros", href: `/${slug}/cadastro` },
      ];
    case "agente_financeiro":
      return [
        { label: "Contratos", href: `/${slug}/unidades`, primary: true },
        { label: "Exportação", href: `/${slug}/exportacao` },
      ];
    case "auditor":
      return [
        { label: "Auditoria", href: `/${slug}/auditoria`, primary: true },
        { label: "Relatórios", href: `/${slug}/relatorios` },
      ];
    case "cidadao":
      return [
        { label: "Acessar", href: enrolled ? `/${slug}/minha-classificacao` : `/${slug}/cadastro/ana-silva`, primary: true },
      ];
    default:
      return [];
  }
};

function ProgramCard({ program, profile, enrolled }: { program: EnrolledProgram; profile: string; enrolled?: boolean }) {
  const actions = getProgramActions(profile, program.slug, enrolled);
  return (
    <div
      className="bg-white rounded-2xl border border-[#c3c6d1]/10 overflow-hidden hover:shadow-[0_16px_32px_rgba(0,30,64,0.06)] transition-all duration-300 flex flex-col justify-between group"
    >
      <div>
        {/* Color strip */}
        <div
          className="h-1.5"
          style={{
            background: `linear-gradient(to right, ${program.primaryColor}, ${program.accentColor})`,
          }}
        />

        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span
                className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: `${program.primaryColor}15`,
                  color: program.primaryColor,
                }}
              >
                {program.shortName}
              </span>
              <h3 className="font-heading font-bold text-lg text-[#001e40] leading-snug">
                {program.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#43474f]">
            <Clock className="w-3.5 h-3.5" />
            <span>Inscrito em {program.enrolledAt}</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4 border-t border-[#c3c6d1]/5 flex flex-wrap items-center gap-2">
        <span
          className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusColors[program.statusType as keyof typeof statusColors] || "bg-amber-500/10 text-amber-700 border-amber-500/20"} mr-auto`}
        >
          {program.status}
        </span>
        
        {actions.map((action, idx) => (
          <Link
            key={idx}
            href={action.href}
            className={`inline-flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-300 hover:shadow-sm cursor-pointer ${
              action.primary
                ? "text-white hover:opacity-90"
                : "border border-outline-variant/35 text-on-surface-variant hover:text-primary hover:bg-[#f3f4f5]"
            }`}
            style={action.primary ? {
              backgroundColor: program.primaryColor,
            } : undefined}
          >
            <span>{action.label}</span>
            {action.primary && <ChevronRight className="w-3.5 h-3.5" />}
          </Link>
        ))}
      </div>
    </div>
  );
}

function CidadaoPainel() {
  const { user } = useUser();

  return (
    <div className="flex-1 space-y-10">
      {/* ── Seção: Minhas Inscrições ── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#001e40] rounded-xl flex items-center justify-center text-white">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-[#001e40]">
              Minhas Inscrições
            </h2>
            <p className="text-xs text-[#43474f]">
              Acompanhe seus programas habitacionais ativos e inicie os trâmites
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MOCK_ENROLLED_PROGRAMS.map((program) => (
            <ProgramCard key={program.slug} program={program} profile={user?.profile || ""} enrolled={true} />
          ))}
        </div>
      </section>

      {/* ── Seção: Programas Disponíveis para Concorrer ── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#7c3aed]/10 rounded-xl flex items-center justify-center text-[#7c3aed]">
            <ExternalLink className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-[#001e40]">
              Programas Disponíveis
            </h2>
            <p className="text-xs text-[#43474f]">
              Programas abertos para inscrição ao qual você pode concorrer
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MOCK_AVAILABLE_PROGRAMS.map((program) => (
            <div
              key={program.slug}
              className="bg-white rounded-2xl border border-[#c3c6d1]/10 p-6 hover:shadow-[0_16px_32px_rgba(0,30,64,0.06)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${program.primaryColor}15`,
                      color: program.primaryColor,
                    }}
                  >
                    Inscrições Abertas
                  </span>
                  <span className="text-[10px] font-bold text-[#43474f]">
                    {program.deadline}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-[#001e40] leading-snug">
                  {program.name}
                </h3>

                <p className="text-xs text-[#43474f] leading-relaxed">
                  {program.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#c3c6d1]/5 mt-4">
                <Link
                  href={`/${program.slug}/cadastro/ana-silva`}
                  className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl border-2 transition-all duration-300 hover:shadow-md cursor-pointer"
                  style={{
                    borderColor: `${program.primaryColor}40`,
                    color: program.primaryColor,
                  }}
                >
                  Inscrever-se
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// =============================================================================
// Page Component
// =============================================================================

export default function HomePage() {
  const { user, logout } = useUser();
  const [notificationsExpanded, setNotificationsExpanded] = useState(true);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userName = (mounted && user?.name) || "Usuário";

  const profileLabels: Record<string, string> = {
    gestor: "Gestor Público",
    assistente_social: "Assistente Social",
    agente_financeiro: "Agente Financeiro",
    auditor: "Auditor (Controle)",
    cidadao: "Cidadão"
  };
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] font-sans selection:bg-[#0059bb]/10 selection:text-[#0059bb]">
      {/* ================================================================
          1. Header (Componente Reutilizado)
          ================================================================ */}
      <Header unreadNotificationsCount={unreadCount} />

      {/* ================================================================
          2. Main Content
          ================================================================ */}
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* ── Saudação ── */}
          <div className="mb-10">
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight">
              {getGreeting()},{" "}
              <span className="text-[#0059bb]">{userName}</span>
            </h1>
            <p className="text-[#43474f] text-base mt-2 max-w-2xl">
              Acompanhe seus programas habitacionais, gerencie suas inscrições e
              fique por dentro das novidades do sistema.
            </p>
          </div>

          {/* ── Grid Layout: Content + Notifications ── */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* ─── Left Column: Conteúdo condicional por perfil ─── */}
            {!mounted ? (
              <div className="flex-1 flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#0059bb] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : user?.profile === "cidadao" ? (
              <CidadaoPainel />
            ) : (
              <div className="flex-1 space-y-10">
                {/* ── Meus Programas ── */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#001e40] rounded-xl flex items-center justify-center text-white">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-heading font-bold text-xl text-[#001e40]">
                          Meus Programas
                        </h2>
                        <p className="text-xs text-[#43474f]">
                          Programas vinculados ao seu perfil de atuação
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#43474f] bg-[#e7e8e9] px-3 py-1 rounded-full">
                      {MOCK_ENROLLED_PROGRAMS.length} ativo
                      {MOCK_ENROLLED_PROGRAMS.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {MOCK_ENROLLED_PROGRAMS.map((program) => (
                      <ProgramCard key={program.slug} program={program} profile={user?.profile || ""} />
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* ─── Right Column: Notifications (Sidebar) ─── */}
            <aside className="lg:w-[360px] shrink-0">
              <div className="lg:sticky lg:top-28">
                <div className="bg-white rounded-2xl border border-[#c3c6d1]/10 overflow-hidden">
                  {/* Notifications Header */}
                  <button
                    onClick={() =>
                      setNotificationsExpanded(!notificationsExpanded)
                    }
                    className="w-full flex items-center justify-between p-5 hover:bg-[#f3f4f5]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#001e40] rounded-xl flex items-center justify-center text-white relative">
                        <Bell className="w-4 h-4" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="font-heading font-bold text-sm text-[#001e40]">
                          Notificações
                        </h3>
                        <p className="text-[10px] text-[#43474f]">
                          {unreadCount > 0
                            ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}`
                            : "Tudo em dia"}
                        </p>
                      </div>
                    </div>
                    {notificationsExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#43474f]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#43474f]" />
                    )}
                  </button>

                  {/* Notifications List */}
                  {notificationsExpanded && (
                    <div className="border-t border-[#c3c6d1]/10">
                      {/* Mark all as read */}
                      {unreadCount > 0 && (
                        <div className="px-5 py-2.5 flex justify-end">
                          <button
                            onClick={markAllAsRead}
                            className="text-[10px] font-bold text-[#0059bb] hover:text-[#003366] transition-colors uppercase tracking-wider"
                          >
                            Marcar todas como lidas
                          </button>
                        </div>
                      )}

                      <div className="max-h-[460px] overflow-y-auto">
                        {notifications.map((notification) => {
                          const colors = notificationColors[notification.type];
                          return (
                            <button
                              key={notification.id}
                              onClick={() => markAsRead(notification.id)}
                              className={`w-full text-left px-5 py-4 border-b border-[#c3c6d1]/5 last:border-b-0 transition-colors hover:bg-[#f3f4f5]/50 ${
                                !notification.read ? "bg-[#0059bb]/[0.02]" : ""
                              }`}
                            >
                              <div className="flex gap-3">
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colors.bg} ${colors.text}`}
                                >
                                  {notificationIcon[notification.type]}
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                  <div className="flex items-center gap-2">
                                    {!notification.read && (
                                      <span
                                        className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`}
                                      />
                                    )}
                                    <h4 className="text-sm font-bold text-[#001e40] truncate">
                                      {notification.title}
                                    </h4>
                                  </div>
                                  <p className="text-xs text-[#43474f] leading-relaxed line-clamp-2">
                                    {notification.description}
                                  </p>
                                  <p className="text-[10px] text-[#737780] font-semibold">
                                    {notification.date}
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* ================================================================
          3. Footer
          ================================================================ */}
      <LandingFooter />
    </div>
  );
}
