// =============================================================================
// app/[programId]/excecao/page.tsx
// Validação de Atendimento Excepcional (Passo 22.8).
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
  AlertTriangle,
  MapPin,
  TrendingUp,
  Ban,
  FileWarning,
  History,
  Coins,
  Users,
  Eye,
  Zap,
  Printer,
  Save,
  CheckCircle2,
  X,
  Loader2,
  GitFork,
  User
} from "lucide-react";

interface Atingido {
  nome: string;
  cpf: string;
  situacao: string;
  situacaoColorClass: string;
  observacao: string;
}

export default function AtendimentoExcepcionalPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados
  const [portaria, setPortaria] = useState("Portaria nº 3.421 - RS/2024");
  const [agravamento, setAgravamento] = useState(true);
  const [frustracao, setFrustracao] = useState(false);
  const [excecaoBeneficio, setExcecaoBeneficio] = useState(true);
  
  // Agilidade de Entrega
  const [trabalhoSocial, setTrabalhoSocial] = useState(true);
  const [infraExterna, setInfraExterna] = useState(false);

  // Simulações e Feedbacks
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGeneratingLaudo, setIsGeneratingLaudo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAtingido, setSelectedAtingido] = useState<Atingido | null>(null);

  // Mapeamento de Portaria para Cidade
  const getCidade = (port: string) => {
    switch (port) {
      case "Portaria nº 3.421 - RS/2024":
        return "Canoas - Rio Grande do Sul";
      case "Portaria nº 2.110 - BA/2023":
        return "Ilhéus - Bahia";
      case "Portaria nº 1.005 - MA/2023":
        return "Imperatriz - Maranhão";
      default:
        return "Canoas - Rio Grande do Sul";
    }
  };

  const cidadeImpactada = getCidade(portaria);

  // Famílias Atingidas
  const atingidosList: Atingido[] = [
    {
      nome: "Maria Helena Souza",
      cpf: "000.***.***-00",
      situacao: "PERDA TOTAL",
      situacaoColorClass: "bg-red-50 text-red-750 border border-red-200/50",
      observacao: "Residência completamente destruída por enchente no bairro Mathias Velho. Laudo da Defesa Civil nº 8831/24."
    },
    {
      nome: "João Pedro Almeida",
      cpf: "111.***.***-11",
      situacao: "CONDENADO",
      situacaoColorClass: "bg-amber-55/10 text-amber-800 border border-amber-300/30",
      observacao: "Estrutura do imóvel comprometida com rachaduras graves e risco iminente de desabamento geológico."
    },
    {
      nome: "Catarina Mendes",
      cpf: "222.***.***-22",
      situacao: "ÁREA DE RISCO",
      situacaoColorClass: "bg-red-50 text-red-750 border border-red-200/50",
      observacao: "Imóvel situado em zona de inundação de alta recorrência demarcada pelo mapeamento hidrológico municipal."
    }
  ];

  // Ações
  const handleGenerateLaudo = () => {
    setIsGeneratingLaudo(true);
    setToastMessage("Gerando Laudo de Excepcionalidade técnica...");
    setTimeout(() => {
      setIsGeneratingLaudo(false);
      setToastMessage(`Laudo de Excepcionalidade gerado com sucesso para a localidade de ${cidadeImpactada}!`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 2000);
  };

  const handleSaveConfig = () => {
    setIsSaving(true);
    setToastMessage("Salvando parâmetros de atendimento excepcional...");
    setTimeout(() => {
      setIsSaving(false);
      setToastMessage("Configurações de atendimento excepcional salvas com sucesso!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
  };

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col selection:bg-[#0059bb]/20">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="w-full max-w-6xl mx-auto px-6 pt-24 pb-32 space-y-10">
            
            {/* Toast Notification */}
            {toastMessage && (
              <div className="fixed top-24 right-4 bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-[100] select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho */}
            <div className="space-y-3 select-none">
              <h2 className="font-headline text-3xl font-black text-primary tracking-tight">
                Atendimento Excepcional
              </h2>
              <p className="text-on-surface-variant text-sm sm:text-base max-w-3xl leading-relaxed font-medium">
                Gestão normativa para validação de fluxos habitacionais em casos de calamidade pública, emergência reconhecida e frustração de investimentos (MCMV-FAR). Priorização imediata com afastamento de critérios ordinários.
              </p>
            </div>

            {/* Layout em Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Esquerda: Registro e Agravamento (8 Colunas) */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Registro de Calamidade */}
                <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/60 space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 select-none">
                    <AlertTriangle className="text-amber-600 w-5 h-5 shrink-0" />
                    <h3 className="font-headline font-extrabold text-base text-primary uppercase tracking-wide">
                      Registro de Calamidade / Emergência
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 select-none">
                      <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider">
                        Portaria SEDEC (Secretaria Nacional)
                      </label>
                      <div className="relative">
                        <select 
                          value={portaria}
                          onChange={(e) => setPortaria(e.target.value)}
                          className="w-full bg-[#e1e3e4] border-0 border-b-2 border-primary focus:ring-0 text-xs font-black py-3 pl-4 pr-32 rounded-t-xl text-primary"
                        >
                          <option>Portaria nº 3.421 - RS/2024</option>
                          <option>Portaria nº 2.110 - BA/2023</option>
                          <option>Portaria nº 1.005 - MA/2023</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black tracking-widest bg-secondary-container/20 text-secondary uppercase">
                            RECONHECIDO
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 select-none">
                      <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider">
                        Localidade Impactada
                      </label>
                      <div className="flex items-center gap-2 bg-[#e1e3e4] p-3.5 rounded-xl text-primary">
                        <MapPin className="text-primary w-4.5 h-4.5 shrink-0" />
                        <span className="text-xs font-black">{cidadeImpactada}</span>
                      </div>
                    </div>
                  </div>

                  {/* Agravamento e Frustração */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
                    <div 
                      onClick={() => setAgravamento(!agravamento)}
                      className={`p-4 rounded-xl border transition-all flex items-center gap-4 cursor-pointer ${
                        agravamento 
                          ? "border-secondary bg-secondary/5" 
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="p-2.5 bg-secondary/10 rounded-full text-secondary shrink-0">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-primary">Agravamento de Necessidade</h4>
                        <p className="text-[10px] text-on-surface-variant mt-0.5 font-medium">Validado pelo Ministério das Cidades</p>
                      </div>
                      <input 
                        type="checkbox"
                        checked={agravamento}
                        onChange={() => {}}
                        className="ml-auto rounded border-slate-350 text-secondary focus:ring-secondary h-4.5 w-4.5"
                      />
                    </div>

                    <div 
                      onClick={() => setFrustracao(!frustracao)}
                      className={`p-4 rounded-xl border transition-all flex items-center gap-4 cursor-pointer ${
                        frustracao 
                          ? "border-secondary bg-secondary/5" 
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="p-2.5 bg-amber-600/10 rounded-full text-amber-700 shrink-0">
                        <Ban className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-primary">Frustração de Investimentos</h4>
                        <p className="text-[10px] text-on-surface-variant mt-0.5 font-medium">MCMV-FAR (Municípios elegíveis)</p>
                      </div>
                      <input 
                        type="checkbox"
                        checked={frustracao}
                        onChange={() => {}}
                        className="ml-auto rounded border-slate-350 text-secondary focus:ring-secondary h-4.5 w-4.5"
                      />
                    </div>
                  </div>
                </section>

                {/* Gestão de Famílias Atingidas */}
                <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/60 space-y-6">
                  <div className="flex justify-between items-center select-none">
                    <div className="flex items-center gap-3">
                      <Users className="text-primary w-5 h-5 shrink-0" />
                      <h3 className="font-headline font-extrabold text-base text-primary uppercase tracking-wide">
                        Indicação Direta por Desastre
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => router.push(`/${programId}/excecao/indicacao`)}
                        className="bg-secondary text-white hover:brightness-110 px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-wider cursor-pointer border-none shadow-md"
                      >
                        + Nova Indicação
                      </button>
                      <div className="flex items-center gap-1.5 bg-[#e1e3e4] px-3 py-1 rounded-full text-primary">
                        <span className="text-[8px] font-black uppercase tracking-wider">Pós 01/01/2023</span>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto select-none">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 pb-3">
                          <th className="pb-3 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
                            Família / CPF
                          </th>
                          <th className="pb-3 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
                            Situação do Imóvel
                          </th>
                          <th className="pb-3 text-[9px] font-black text-on-surface-variant uppercase tracking-widest text-right">
                            Ação
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {atingidosList.map((at) => (
                          <tr key={at.nome} className="hover:bg-slate-50/55 transition-colors">
                            <td className="py-3.5">
                              <p className="text-xs font-bold text-primary">{at.nome}</p>
                              <p className="text-[10px] text-on-surface-variant mt-0.5 font-medium">{at.cpf}</p>
                            </td>
                            <td className="py-3.5">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase ${at.situacaoColorClass}`}>
                                {at.situacao}
                              </span>
                            </td>
                            <td className="py-3.5 text-right">
                              <button 
                                onClick={() => setSelectedAtingido(at)}
                                className="text-primary hover:bg-slate-100 p-2 rounded-full transition-colors border-none cursor-pointer bg-transparent"
                              >
                                <Eye className="w-4.5 h-4.5 text-secondary" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

              </div>

              {/* Direita: Exceções e Impedimentos (4 Colunas) */}
              <div className="lg:col-span-4 space-y-8 select-none">
                
                {/* Exceções e Isenções Legais */}
                <div className="space-y-4">
                  <h3 className="font-headline font-black text-xs text-on-surface-variant uppercase tracking-widest px-2">
                    Exceções e Isenções Legais
                  </h3>

                  {/* Dispensa de Déficit */}
                  <div className="bg-white p-5 rounded-2xl border-l-4 border-secondary border-y border-r border-slate-200/60 shadow-sm flex gap-4">
                    <FileWarning className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <div className="space-y-1.5">
                      <p className="text-xs font-black text-primary uppercase">Dispensa de Déficit</p>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed font-semibold">
                        Afasta verificação de déficit habitacional ordinário para famílias atingidas.
                      </p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        <span className="text-[8px] font-black text-secondary uppercase tracking-wider">Ativo via Decreto</span>
                      </div>
                    </div>
                  </div>

                  {/* Exceção de Benefício */}
                  <div className="bg-white p-5 rounded-2xl border-l-4 border-primary border-y border-r border-slate-200/60 shadow-sm flex gap-4">
                    <History className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-2 flex-grow">
                      <div>
                        <p className="text-xs font-black text-primary uppercase">Exceção de Benefício</p>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed font-semibold">
                          Permite quem já teve imóvel MCMV mas foi afetado novamente por desastre.
                        </p>
                      </div>
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setExcecaoBeneficio(!excecaoBeneficio)}
                          className={`w-9 h-5 rounded-full p-[2px] transition-all duration-300 border-none cursor-pointer flex items-center ${
                            excecaoBeneficio ? "bg-[#001e40] justify-end" : "bg-slate-200 justify-start"
                          }`}
                        >
                          <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm"></div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Isenção Financeira Total */}
                  <div className="bg-[#ffdbca] p-5 rounded-2xl border-l-4 border-[#381300] border-y border-r border-[#ffb690]/30 shadow-sm flex gap-4 text-[#381300]">
                    <Coins className="w-5 h-5 text-[#723610] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase">Isenção Financeira Total</p>
                      <p className="text-[11px] opacity-90 leading-relaxed font-bold">
                        Garante isenção total de prestações para famílias de calamidade (Faixa 1).
                      </p>
                      <p className="text-[9px] font-black underline uppercase tracking-wider pt-1.5 text-[#723610]">
                        Portaria 1.248/23
                      </p>
                    </div>
                  </div>
                </div>

                {/* Agilidade de Entrega */}
                <section className="bg-[#e1e3e4]/30 rounded-2xl p-6 border border-dashed border-slate-350 space-y-5">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-5 h-5 text-secondary shrink-0" />
                    <h3 className="font-headline font-black text-sm text-[#001e40] uppercase tracking-wide">
                      Agilidade de Entrega
                    </h3>
                  </div>
                  
                  <p className="text-[10px] text-on-surface-variant leading-relaxed font-semibold">
                    Marque as pendências que podem ser afastadas para garantir o abrigo imediato das famílias em caráter de urgência.
                  </p>

                  <div className="space-y-3">
                    <div 
                      onClick={() => setTrabalhoSocial(!trabalhoSocial)}
                      className="flex items-start gap-3.5 p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50/50"
                    >
                      <input 
                        type="checkbox"
                        checked={trabalhoSocial}
                        onChange={() => {}}
                        className="mt-0.5 rounded border-slate-300 text-secondary focus:ring-secondary h-4.5 w-4.5"
                      />
                      <div>
                        <h4 className="text-[11px] font-bold text-primary leading-tight">Trabalho Social Incompleto</h4>
                        <p className="text-[9px] text-on-surface-variant mt-0.5 leading-relaxed font-medium">Permite entrega antes da conclusão do PTS.</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setInfraExterna(!infraExterna)}
                      className="flex items-start gap-3.5 p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50/50"
                    >
                      <input 
                        type="checkbox"
                        checked={infraExterna}
                        onChange={() => {}}
                        className="mt-0.5 rounded border-slate-300 text-secondary focus:ring-secondary h-4.5 w-4.5"
                      />
                      <div>
                        <h4 className="text-[11px] font-bold text-primary leading-tight">Infraestrutura Externa Pendente</h4>
                        <p className="text-[9px] text-on-surface-variant mt-0.5 leading-relaxed font-medium">Apenas em casos de habitabilidade mínima garantida.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm opacity-55">
                      <input 
                        type="checkbox"
                        disabled
                        checked={false}
                        className="mt-0.5 rounded border-slate-200 text-slate-350 h-4.5 w-4.5 cursor-not-allowed"
                      />
                      <div>
                        <h4 className="text-[11px] font-bold text-primary leading-tight">Habite-se Municipal</h4>
                        <p className="text-[9px] text-on-surface-variant mt-0.5 leading-relaxed font-medium">Requisito legal intransponível (Bloqueado).</p>
                      </div>
                    </div>
                  </div>
                </section>

              </div>

            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-200 select-none">
              <button 
                onClick={handleGenerateLaudo}
                disabled={isGeneratingLaudo}
                className="px-6 py-3.5 rounded-xl font-black text-xs text-primary hover:bg-slate-50 transition-all border border-slate-250 flex items-center justify-center gap-2 cursor-pointer bg-transparent uppercase tracking-wider"
              >
                {isGeneratingLaudo ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gerando Documento...</span>
                  </>
                ) : (
                  <>
                    <Printer className="w-4 h-4" />
                    <span>Emitir Laudo de Excepcionalidade</span>
                  </>
                )}
              </button>

              <button 
                onClick={handleSaveConfig}
                disabled={isSaving}
                className="px-8 py-3.5 rounded-xl font-black text-xs text-white bg-gradient-to-br from-[#001e40] to-[#003366] shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 border-none cursor-pointer uppercase tracking-wider"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Salvar Configurações</span>
                  </>
                )}
              </button>
            </div>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          MODAL DE DETALHES DO CITADINO ATINGIDO
          ========================================== */}
      {selectedAtingido && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-5 border border-outline-variant/10">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 select-none">
              <div>
                <h3 className="text-base font-black text-primary uppercase tracking-wide">Laudo da Defesa Civil</h3>
                <p className="text-[10px] text-on-surface-variant font-bold mt-1 uppercase">
                  Dossiê de Calamidade e Atingimento
                </p>
              </div>
              <button 
                onClick={() => setSelectedAtingido(null)}
                className="text-slate-400 hover:text-primary p-1 rounded-full hover:bg-slate-100 transition-colors border-none cursor-pointer bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs font-semibold text-primary">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase block">Nome</span>
                  <span className="font-bold text-xs">{selectedAtingido.nome}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase block">CPF</span>
                  <span className="font-bold text-xs">{selectedAtingido.cpf}</span>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Situação de Dano</span>
                <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase ${selectedAtingido.situacaoColorClass}`}>
                  {selectedAtingido.situacao}
                </span>
              </div>

              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Parecer Técnico Municipal</span>
                <p className="text-xs text-on-surface-variant leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-150 font-medium">
                  {selectedAtingido.observacao}
                </p>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => setSelectedAtingido(null)}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none shadow-md"
            >
              Fechar Visualização
            </button>

          </div>
        </div>
      )}

      {/* ==========================================
          MOBILE BOTTOM NAV BAR (Simulado do Stitch)
          ========================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pb-4 pt-2 bg-white border-t border-slate-200/50 rounded-t-xl select-none">
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <MapPin className="w-5 h-5 text-[#43474f]" />
          <span className="font-label text-[10px] font-medium tracking-wide">Início</span>
        </button>
        <button className="flex flex-col items-center justify-center text-secondary bg-secondary-fixed/30 rounded-full px-4 py-1 active:scale-90 duration-200 border-none cursor-pointer">
          <GitFork className="w-5 h-5 text-[#0059bb]" />
          <span className="font-label text-[10px] font-medium tracking-wide">Fila</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <Users className="w-5 h-5 text-[#43474f]" />
          <span className="font-label text-[10px] font-medium tracking-wide">Listas</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <User className="w-5 h-5 text-[#43474f]" />
          <span className="font-label text-[10px] font-medium tracking-wide">Perfil</span>
        </button>
      </nav>

    </div>
  );
}
