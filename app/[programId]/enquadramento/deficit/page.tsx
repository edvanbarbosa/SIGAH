// =============================================================================
// app/[programId]/enquadramento/deficit/page.tsx
// Caracterização de Déficit - Padronização Executiva (Passo 22.6).
// Baseada fielmente no Stitch, projeto "DESIGN SIGAH".
// =============================================================================

"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProgram } from "@/lib/hooks/useProgram";
import {
  Menu,
  AlertTriangle,
  User,
  ShieldCheck,
  Home,
  Users,
  Coins,
  FileCheck,
  Upload,
  Paperclip,
  CheckCircle2,
  GitFork,
  CheckCircle,
  Loader2,
  Fingerprint,
  UserCheck
} from "lucide-react";

export default function CaracterizacaoDeficitPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Controles
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplementing, setIsComplementing] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  // Bento States
  const [tipoDomicilio, setTipoDomicilio] = useState("Domicílio Improvisado");
  const [confirmacaoVistoria, setConfirmacaoVistoria] = useState(false);
  
  // Adensamento Excessivo
  const [residentes, setResidentes] = useState(7);
  const [dormitorios, setDormitorios] = useState(2);
  const densidade = (residentes / (dormitorios || 1)).toFixed(1);
  const isDensidadeCritica = parseFloat(densidade) > 3.0;

  // Coabitação
  const [manifestacaoExclusivo, setManifestacaoExclusivo] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Ônus Aluguel
  const [aluguel, setAluguel] = useState(1200);
  const rendaDeclarada = 2400;
  const comprometimento = Math.round((aluguel / rendaDeclarada) * 100);
  const isComprometimentoCritico = comprometimento > 30;

  // Atestados Especiais
  const [situacaoRua, setSituacaoRua] = useState(false);
  const [aluguelSocial, setAluguelSocial] = useState(false);
  const [justificativa, setJustificativa] = useState("");

  // Ações
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file.name);
      setToastMessage(`Arquivo "${file.name}" anexado com sucesso!`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleValidate = () => {
    setIsProcessing(true);
    setToastMessage("Processando regras de enquadramento de déficit habitacional...");
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessModal(true);
    }, 1800);
  };

  const handleRequestComplement = () => {
    setIsComplementing(true);
    setToastMessage("Notificando candidato para complementação cadastral de déficit...");
    setTimeout(() => {
      setIsComplementing(false);
      setToastMessage("Solicitação de complementação enviada!");
      setTimeout(() => setToastMessage(null), 3500);
    }, 1500);
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen pb-24 font-sans flex flex-col selection:bg-[#0059bb]/20">
      
      {/* 1. TopAppBar do Mockup */}
      <header className="w-full top-0 sticky z-40 bg-white flex justify-between items-center px-6 py-4 border-b border-[#c3c6d1]/20 shadow-sm select-none">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#edeeef] transition-colors rounded-full active:scale-95 duration-100 border-none bg-transparent cursor-pointer">
            <Menu className="w-6 h-6 text-[#001e40]" />
          </button>
          <h1 className="font-headline text-xl font-extrabold tracking-tight text-[#001e40]">SIGAH</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 mr-6 text-sm font-semibold">
            <a className="text-[#001e40] font-bold" href="#">Início</a>
            <a className="text-[#43474f] hover:text-[#001e40] transition-colors" href="#">Processos</a>
            <a className="text-[#43474f] hover:text-[#001e40] transition-colors" href="#">Relatórios</a>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#d5e3ff] flex items-center justify-center text-[#001b3c] font-black text-sm">
            MA
          </div>
        </div>
      </header>

      {/* Mensagem Toast */}
      {toastMessage && (
        <div className="fixed top-24 right-4 bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-[100] select-none max-w-md">
          <CheckCircle2 className="w-5 h-5 text-[#0059bb] shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 2. Área do Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full space-y-8">
        
        {/* Emergency Banner */}
        <section className="p-4 bg-[#ffdad6] border-l-4 border-l-[#ba1a1a] rounded-lg flex items-start gap-4 shadow-sm select-none">
          <AlertTriangle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-headline font-black text-sm text-[#ba1a1a] uppercase tracking-wider">
              Critério de Déficit Suspenso: Exceção de Emergência
            </h3>
            <p className="text-xs text-[#ba1a1a] opacity-90 leading-relaxed font-semibold">
              O enquadramento por critérios de déficit habitacional está flexibilizado para este perfil devido ao registro de residência em área de alto risco ou desastre natural homologado.
            </p>
          </div>
        </section>

        {/* Candidate Header Card */}
        <section className="bg-white rounded-xl p-6 border border-[#c3c6d1]/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#003366] flex items-center justify-center select-none text-[#a7c8ff]">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-headline text-2xl font-bold text-[#001e40]">Carlos Alberto dos Santos</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-[#43474f] font-semibold select-none">
                <span className="flex items-center gap-1.5">
                  <Fingerprint className="w-4.5 h-4.5 opacity-60" /> NIS: 123.45678.90-1
                </span>
                <span className="flex items-center gap-1.5 text-[#0059bb] font-bold">
                  <UserCheck className="w-4.5 h-4.5 opacity-80" /> Status: Em Análise de Déficit
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#d8e2ff] text-[#001a41] px-4 py-2 rounded-full border border-[#0059bb]/20 select-none">
            <ShieldCheck className="w-4.5 h-4.5 text-[#0059bb] shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider">Conformidade CadÚnico Atestada</span>
          </div>
        </section>

        {/* Bento Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Habitação Precária (4 Cols) */}
          <section className="md:col-span-4 bg-[#f3f4f5] rounded-xl p-6 border border-[#c3c6d1]/10 flex flex-col justify-between gap-4 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md">
            <div className="space-y-4">
              <div className="flex items-center gap-2 select-none">
                <Home className="w-5 h-5 text-[#001e40] shrink-0" />
                <h3 className="font-headline font-black text-sm text-[#191c1d] uppercase tracking-wide">
                  Habitação Precária
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-[#43474f] uppercase tracking-wider select-none">
                    Tipo de Domicílio
                  </label>
                  <select
                    value={tipoDomicilio}
                    onChange={(e) => setTipoDomicilio(e.target.value)}
                    className="mt-1 block w-full bg-[#e1e3e4] border-0 border-b-2 border-[#001e40] focus:ring-0 text-[#191c1d] text-xs font-bold py-2 rounded-t"
                  >
                    <option>Domicílio Improvisado</option>
                    <option>Paredes de Madeira Aparelhada</option>
                    <option>Paredes de Taipa/Palha</option>
                    <option>Não-alvenaria predominante</option>
                  </select>
                </div>

                <label className="flex items-start gap-3 cursor-pointer pt-2 select-none">
                  <input
                    type="checkbox"
                    checked={confirmacaoVistoria}
                    onChange={(e) => setConfirmacaoVistoria(e.target.checked)}
                    className="mt-1 rounded border-[#737780] text-[#001e40] focus:ring-[#001e40] h-5 w-5"
                  />
                  <span className="text-xs text-[#43474f] leading-relaxed font-semibold italic">
                    Confirmo que a vistoria técnica local validou a natureza precária das paredes/estrutura conforme regulamentação municipal.
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* Adensamento Excessivo (4 Cols) */}
          <section className="md:col-span-4 bg-[#f3f4f5] rounded-xl p-6 border border-[#c3c6d1]/10 flex flex-col justify-between gap-4 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md">
            <div className="space-y-4">
              <div className="flex items-center gap-2 select-none">
                <Users className="w-5 h-5 text-[#001e40] shrink-0" />
                <h3 className="font-headline font-black text-sm text-[#191c1d] uppercase tracking-wide">
                  Adensamento Excessivo
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 select-none">
                <div>
                  <label className="text-[10px] font-black text-[#43474f] uppercase tracking-wider">
                    Total Residentes
                  </label>
                  <input
                    type="number"
                    value={residentes}
                    onChange={(e) => setResidentes(Math.max(1, parseInt(e.target.value) || 0))}
                    className="mt-1 block w-full bg-[#e1e3e4] border-0 border-b-2 border-[#001e40] focus:ring-0 text-[#191c1d] font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-[#43474f] uppercase tracking-wider">
                    Dormitórios
                  </label>
                  <input
                    type="number"
                    value={dormitorios}
                    onChange={(e) => setDormitorios(Math.max(1, parseInt(e.target.value) || 0))}
                    className="mt-1 block w-full bg-[#e1e3e4] border-0 border-b-2 border-[#001e40] focus:ring-0 text-[#191c1d] font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Density Rate Panel */}
            <div className={`p-4 rounded-lg flex flex-col items-center justify-center text-center select-none ${
              isDensidadeCritica 
                ? "bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/10" 
                : "bg-[#e1e3e4] text-[#191c1d]"
            }`}>
              <span className="text-xs font-bold uppercase">Índice de Densidade</span>
              <span className="text-3xl font-extrabold mt-1">{densidade}</span>
              <span className="text-xs mt-1 opacity-90">
                {isDensidadeCritica ? "Crítico (Limite: 3.0)" : "Conforme (< 3.0)"}
              </span>
            </div>
          </section>

          {/* Coabitação Familiar (4 Cols) */}
          <section className="md:col-span-4 bg-[#f3f4f5] rounded-xl p-6 border border-[#c3c6d1]/10 flex flex-col justify-between gap-4 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md">
            <div className="space-y-4">
              <div className="flex items-center gap-2 select-none">
                <Users className="w-5 h-5 text-[#001e40] shrink-0" />
                <h3 className="font-headline font-black text-sm text-[#191c1d] uppercase tracking-wide">
                  Coabitação Familiar
                </h3>
              </div>

              {/* Upload Box */}
              <div className="border-2 border-dashed border-[#c3c6d1] rounded-lg p-6 flex flex-col items-center justify-center text-center relative hover:bg-white/40 transition-colors">
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg" 
                  onChange={handleFileUpload} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
                <Upload className="w-10 h-10 text-[#003366] shrink-0 mb-2" />
                <span className="text-sm font-semibold text-[#001e40] block">
                  {uploadedFile ? "Alterar Autodeclaração" : "Upload de Autodeclaração"}
                </span>
                <span className="text-xs text-[#43474f] mt-1 block">
                  {uploadedFile ? uploadedFile : "PDF, JPG até 5MB"}
                </span>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={manifestacaoExclusivo}
                onChange={(e) => setManifestacaoExclusivo(e.target.checked)}
                className="rounded border-[#737780] text-[#001e40] focus:ring-[#001e40]"
              />
              <span className="text-sm text-[#43474f] font-semibold">
                Manifestou intenção de domicílio exclusivo
              </span>
            </label>
          </section>

          {/* Ônus Excessivo Aluguel (6 Cols) */}
          <section className="md:col-span-6 bg-[#f3f4f5] rounded-xl p-6 border border-[#c3c6d1]/10 flex flex-col justify-between gap-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md">
            <div className="flex items-center gap-2 select-none">
              <Coins className="w-5 h-5 text-[#001e40] shrink-0" />
              <h3 className="font-headline font-black text-sm text-[#191c1d] uppercase tracking-wide">
                Ônus Excessivo com Aluguel
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-[#43474f] uppercase tracking-wider select-none">
                    Valor Mensal do Aluguel
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute left-0 bottom-2 text-sm font-semibold text-[#43474f]">R$</span>
                    <input
                      type="number"
                      value={aluguel}
                      onChange={(e) => setAluguel(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="pl-8 block w-full bg-transparent border-0 border-b-2 border-[#001e40] focus:ring-0 text-[#191c1d] font-bold text-xl py-1"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#e1e3e4] rounded flex justify-between select-none text-xs font-semibold text-[#191c1d]">
                  <span className="text-[#43474f]">Renda Familiar Declarada</span>
                  <span className="font-bold">R$ {rendaDeclarada.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-1 select-none">
                <div className="relative h-4 w-full bg-[#e1e3e4] rounded-full overflow-hidden mb-2">
                  <div 
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${isComprometimentoCritico ? "bg-[#ba1a1a]" : "bg-emerald-600"}`}
                    style={{ width: `${Math.min(100, comprometimento)}%` }}
                  ></div>
                </div>
                <p className={`text-sm font-bold ${isComprometimentoCritico ? "text-[#ba1a1a]" : "text-emerald-700"}`}>
                  Comprometimento: {comprometimento}% da Renda
                </p>
                <p className="text-xs text-[#43474f] mt-1 font-semibold">
                  {isComprometimentoCritico ? "Acima do limite institucional de 30%" : "Dentro do limite institucional (< 30%)"}
                </p>
                
                <button className="mt-4 flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-[#c3c6d1] text-[#001e40] text-sm font-bold rounded shadow-sm hover:bg-slate-50 transition-all border-none cursor-pointer">
                  <Paperclip className="w-4 h-4" />
                  <span>Anexar Recibo/Contrato</span>
                </button>
              </div>
            </div>
          </section>

          {/* Atestados Especiais (6 Cols) */}
          <section className="md:col-span-6 bg-[#f3f4f5] rounded-xl p-6 border border-[#c3c6d1]/10 flex flex-col justify-between gap-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md">
            <div className="flex items-center gap-2 select-none">
              <FileCheck className="w-5 h-5 text-[#001e40] shrink-0" />
              <h3 className="font-headline font-black text-sm text-[#191c1d] uppercase tracking-wide">
                Atestados Especiais & Vulnerabilidade
              </h3>
            </div>

            <div className="space-y-6 select-none">
              {/* Situação de Rua */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#191c1d]">Situação de Rua</span>
                  <span className="text-xs text-[#43474f] font-semibold">Confirmado pelo CREAS/Centro POP</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSituacaoRua(!situacaoRua)}
                  className={`w-11 h-6 rounded-full p-1 transition-all duration-350 border-none cursor-pointer flex items-center ${
                    situacaoRua ? "bg-[#0070ea] justify-end" : "bg-[#e1e3e4] justify-start"
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </button>
              </div>

              {/* Aluguel Social */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#191c1d]">Aluguel Social Provisório</span>
                  <span className="text-xs text-[#43474f] font-semibold">Beneficiário ativo de programa municipal</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAluguelSocial(!aluguelSocial)}
                  className={`w-11 h-6 rounded-full p-1 transition-all duration-350 border-none cursor-pointer flex items-center ${
                    aluguelSocial ? "bg-[#0070ea] justify-end" : "bg-[#e1e3e4] justify-start"
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-1">
                <label className="text-[10px] font-black text-[#43474f] uppercase tracking-wider">
                  Justificativa do Ente Público
                </label>
                <textarea
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  placeholder="Insira o parecer institucional sobre a condição de vulnerabilidade..."
                  className="mt-1 block w-full bg-[#e1e3e4] border-0 border-b-2 border-[#001e40] focus:ring-0 text-[#191c1d] text-sm h-20 rounded-t p-3"
                />
              </div>
            </div>
          </section>

        </div>

        {/* Action Area */}
        <div className="mt-12 flex flex-col sm:flex-row justify-end items-center gap-4 select-none">
          <button
            onClick={handleRequestComplement}
            disabled={isComplementing}
            className="w-full sm:w-auto px-8 py-3 text-[#001e40] font-black text-sm uppercase tracking-wider hover:bg-[#edeeef] rounded transition-all active:scale-95 border-none bg-transparent cursor-pointer"
          >
            {isComplementing ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#001e40]" />
            ) : (
              <span>Solicitar Complementação</span>
            )}
          </button>

          <button
            onClick={handleValidate}
            disabled={isProcessing}
            style={{ background: "linear-gradient(145deg, #001e40, #003366)" }}
            className="w-full sm:w-auto px-10 py-4 text-white font-black text-sm uppercase tracking-wider rounded-lg shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-3 active:scale-95 group border-none cursor-pointer"
          >
            {isProcessing ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin text-white" />
            ) : (
              <>
                <span>Validar Enquadramento</span>
                <CheckCircle className="w-5 h-5 text-white shrink-0 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

      </main>

      {/* 3. BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-6 bg-[#f8f9fa]/90 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,30,64,0.08)] rounded-t-[2rem] border-t border-[#c3c6d1]/20 select-none">
        <a className="flex flex-col items-center justify-center text-[#43474f] opacity-70 hover:text-[#001e40] hover:opacity-100 transition-all active:scale-90 duration-150 no-underline" href="#">
          <Home className="w-5 h-5" />
          <span className="font-sans text-[10px] font-bold mt-1">Início</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#0059bb] bg-[#d8e2ff] rounded-full px-5 py-2 active:scale-90 duration-150 no-underline" href="#">
          <GitFork className="w-5 h-5 text-[#0059bb]" />
          <span className="font-sans text-[10px] font-bold mt-1">Processos</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#43474f] opacity-70 hover:text-[#001e40] hover:opacity-100 transition-all active:scale-90 duration-150 no-underline" href="#">
          <Users className="w-5 h-5" />
          <span className="font-sans text-[10px] font-bold mt-1">Social</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#43474f] opacity-70 hover:text-[#001e40] hover:opacity-100 transition-all active:scale-90 duration-150 no-underline" href="#">
          <User className="w-5 h-5" />
          <span className="font-sans text-[10px] font-bold mt-1">Perfil</span>
        </a>
      </nav>

      {/* ==========================================
          MODAL DE SUCESSO DE ENQUADRAMENTO DE DÉFICIT
          ========================================== */}
      {successModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#001e40]/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center gap-5 border border-[#c3c6d1]/10 select-none">
            
            <div className="w-14 h-14 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-7 h-7 text-emerald-700 shrink-0" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#001e40] leading-tight">Enquadramento Validado!</h3>
              <p className="text-xs text-[#43474f] font-semibold">
                Carlos Alberto dos Santos está enquadrado no grupo de déficit habitacional.
              </p>
            </div>

            <div className="bg-[#f8f9fa] border border-[#c3c6d1]/35 rounded-xl p-4 w-full space-y-1.5 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-[9px] font-black uppercase text-[#737780]">Protocolo</span>
                <span className="font-bold text-[#001e40]">#VD-CARLOS-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] font-black uppercase text-[#737780]">Status Geral</span>
                <span className="font-bold text-emerald-700">HOMOLOGADO</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessModal(false);
                router.push(`/${programId}/enquadramento`);
              }}
              className="w-full py-4 bg-[#001e40] text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:brightness-110 transition-colors active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-md"
            >
              <span>Voltar aos Candidatos</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
