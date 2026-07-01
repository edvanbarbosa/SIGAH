// =============================================================================
// app/home/page.tsx
// Hub pós-login do usuário autenticado (Página Home).
// Exibe: saudação personalizada, programas cadastrados, programas disponíveis
// e notificações do sistema.
// =============================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
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
// Page Component
// =============================================================================

export default function HomePage() {
  const { user, logout } = useUser();
  const [notificationsExpanded, setNotificationsExpanded] = useState(true);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const userName = user?.name || "Usuário";
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
          1. Header
          ================================================================ */}
      <header className="fixed top-0 w-full z-50 bg-[#f8f9fa]/80 backdrop-blur-xl border-b border-[#c3c6d1]/15 h-18 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="h-9 w-9 bg-gradient-to-br from-[#001e40] to-[#003366] rounded-lg flex items-center justify-center text-white font-heading font-black text-lg shadow-sm">
              S
            </div>
            <span className="font-heading font-black text-2xl tracking-tight text-[#001e40]">
              SIGAH
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button
              className="relative p-2 rounded-xl text-[#43474f] hover:bg-[#0059bb]/5 hover:text-[#0059bb] transition-all"
              title="Notificações"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Info */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-[#001e40] leading-tight">
                  {userName}
                </p>
                <p className="text-[10px] text-[#43474f] uppercase tracking-wider font-semibold">
                  {user?.profile || "Cidadão"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#001e40] to-[#003366] flex items-center justify-center text-white font-heading font-black text-sm shadow-sm">
                {userName.charAt(0)}
              </div>
            </div>

            {/* Logout */}
            <Link
              href="/"
              onClick={() => logout()}
              className="text-sm font-bold text-[#43474f] px-3 py-2 hover:text-red-600 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ================================================================
          2. Main Content
          ================================================================ */}
      <main className="pt-28 pb-20">
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
            {/* ─── Left Column: Programs ─── */}
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
                        Programas em que você está inscrito
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
                    <div
                      key={program.slug}
                      className="bg-white rounded-2xl border border-[#c3c6d1]/10 overflow-hidden hover:shadow-[0_16px_32px_rgba(0,30,64,0.06)] transition-all duration-300 group"
                    >
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

                        <div className="flex items-center justify-between pt-2">
                          <span
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusColors[program.statusType]}`}
                          >
                            {program.status}
                          </span>
                          <Link
                            href={`/${program.slug}/dashboard`}
                            className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all duration-300 hover:shadow-md"
                            style={{
                              backgroundColor: program.primaryColor,
                              color: "white",
                            }}
                          >
                            Acessar
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Programas Disponíveis ── */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0059bb]/10 rounded-xl flex items-center justify-center text-[#0059bb]">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-xl text-[#001e40]">
                        Programas Disponíveis
                      </h2>
                      <p className="text-xs text-[#43474f]">
                        Abertos para novas inscrições
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {MOCK_AVAILABLE_PROGRAMS.map((program) => (
                    <div
                      key={program.slug}
                      className="bg-white rounded-2xl border border-[#c3c6d1]/10 p-6 hover:shadow-[0_16px_32px_rgba(0,30,64,0.06)] transition-all duration-300 group"
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

                        <div className="pt-2">
                          <Link
                            href={`/${program.slug}/cadastro`}
                            className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl border-2 transition-all duration-300 hover:shadow-md"
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
                    </div>
                  ))}
                </div>
              </section>
            </div>

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
