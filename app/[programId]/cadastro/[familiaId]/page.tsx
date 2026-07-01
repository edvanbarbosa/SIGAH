// =============================================================================
// app/[programId]/cadastro/[familiaId]/page.tsx
// Tela de detalhes e edição de cadastro familiar (Passo 6.4 / 10.4).
// Exibe o formulário Bento Grid responsivo integrado com o tema do programa ativo
// e com cálculos em tempo real.
// =============================================================================

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { useProgram } from "@/lib/hooks/useProgram";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { DocumentUpload } from "@/components/ui/DocumentUpload";
import { 
  User, 
  Users as UsersIcon, 
  Gavel, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  Trash2, 
  PlusCircle, 
  ExternalLink,
  Home,
  ClipboardList,
  MessageSquare,
  Check,
  Clock
} from "lucide-react";

interface Member {
  nomeCompleto: string;
  parentesco: string;
  rendaMensal: number;
}

interface FormValues {
  nomeCompleto: string;
  cpf: string;
  nis: string;
  telefone: string;
  endereco: string;
  rendaResponsavel: number;
  membros: Member[];
  representanteLegal: string;
  prioridadeViolencia: boolean;
  prioridadeAcessibilidade: boolean;
  detalheAcessibilidade: string;
  aceiteEssencial: boolean;
  aceiteInformativas: boolean;
  aceiteTermos: boolean;
}

export default function FamiliaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;
  const familiaId = params.familiaId as string;

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Inicializa o react-hook-form com valores mockados (Ana Silva ou novo)
  const isAnaSilva = familiaId === "ana-silva";
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      nomeCompleto: isAnaSilva ? "Ana Silva" : "",
      cpf: isAnaSilva ? "123.456.789-00" : "",
      nis: isAnaSilva ? "123.45678.90-1" : "",
      telefone: isAnaSilva ? "(79) 99999-9999" : "",
      endereco: isAnaSilva ? "Rua das Flores, 123, Centro, Aracaju - SE" : "",
      rendaResponsavel: isAnaSilva ? 2500 : 0,
      membros: isAnaSilva 
        ? [
            { nomeCompleto: "Maria Oliveira Silva", parentesco: "conjuge", rendaMensal: 0 },
            { nomeCompleto: "Pedro Silva", parentesco: "filho", rendaMensal: 0 }
          ]
        : [],
      representanteLegal: "",
      prioridadeViolencia: false,
      prioridadeAcessibilidade: false,
      detalheAcessibilidade: "",
      aceiteEssencial: true,
      aceiteInformativas: false,
      aceiteTermos: isAnaSilva,
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "membros"
  });

  // Novos campos locais para adição rápida de dependentes
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberParentesco, setNewMemberParentesco] = useState("filho");
  const [newMemberRenda, setNewMemberRenda] = useState<number>(0);
  const [showAddForm, setShowAddForm] = useState(false);

  // Observadores para calcular resumo financeiro em tempo real
  const watchRendaResponsavel = watch("rendaResponsavel") || 0;
  const watchMembros = watch("membros") || [];

  const totalMembros = 1 + watchMembros.length;
  const totalRenda = Number(watchRendaResponsavel) + 
    watchMembros.reduce((sum, m) => sum + Number(m.rendaMensal || 0), 0);
  const rendaPerCapita = totalRenda / totalMembros;

  // Trata a adição de um novo membro
  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    append({
      nomeCompleto: newMemberName,
      parentesco: newMemberParentesco,
      rendaMensal: newMemberRenda
    });
    setNewMemberName("");
    setNewMemberRenda(0);
    setShowAddForm(false);
  };

  // Trata submissão do formulário
  const onSubmitForm = (data: FormValues) => {
    setSaveSuccess(true);
  };

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col selection:bg-secondary/10 selection:text-secondary">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável (Desktop) */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="w-full max-w-5xl mx-auto px-6 py-10 mb-20 md:mb-8 space-y-8">
            


            {/* Cabeçalho da Seção */}
            <div className="space-y-1">
              <h2 className="text-3xl font-heading font-bold text-primary">
                Cadastro de {config.labels.beneficiario}
              </h2>
              <p className="text-on-surface-variant text-sm sm:text-base">
                Preencha as informações do núcleo familiar para acesso aos programas habitacionais de {config.theme.shortName}.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
              
              {/* SEÇÃO 1: Responsável Familiar & Resumo Financeiro (Bento Grid) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Bloco Responsável Familiar */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/15 space-y-6">
                  <div className="flex items-center gap-2">
                    <User className="text-primary w-5 h-5" />
                    <h3 className="font-heading font-bold text-lg text-primary">Responsável Familiar</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-on-surface-variant">Nome Completo</label>
                      <input 
                        type="text" 
                        required
                        {...register("nomeCompleto")}
                        className="rounded-lg border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-on-surface-variant">CPF</label>
                      <input 
                        type="text" 
                        required
                        {...register("cpf")}
                        placeholder="000.000.000-00"
                        className="rounded-lg border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-on-surface-variant">NIS (CadÚnico)</label>
                      <input 
                        type="text"
                        {...register("nis")}
                        placeholder="000.00000.00-0"
                        className="rounded-lg border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-on-surface-variant">Telefone de Contato</label>
                      <input 
                        type="tel" 
                        required
                        {...register("telefone")}
                        placeholder="(00) 00000-0000"
                        className="rounded-lg border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm bg-white"
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-1">
                      <label className="text-xs font-semibold text-on-surface-variant">Endereço Completo</label>
                      <input 
                        type="text" 
                        required
                        {...register("endereco")}
                        placeholder="Rua, Número, Bairro, Cidade - UF"
                        className="rounded-lg border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Bloco Resumo Financeiro */}
                <div className="bg-primary-container/20 p-6 rounded-2xl border border-primary/10 flex flex-col justify-between shadow-sm">
                  <div className="space-y-6">
                    <h3 className="font-heading font-bold text-lg text-primary">Resumo Financeiro</h3>
                    
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-primary">Renda do Responsável (R$)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs text-on-surface-variant font-bold">R$</span>
                          <input 
                            type="number"
                            required
                            {...register("rendaResponsavel", { valueAsNumber: true })}
                            className="w-full rounded-lg border border-outline-variant/50 bg-white pl-9 py-2 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-white/60 p-3 rounded-lg border border-outline-variant/15 text-center">
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Membros</span>
                          <span className="text-2xl font-black text-primary mt-1 block">{totalMembros}</span>
                        </div>
                        <div className="bg-white/60 p-3 rounded-lg border border-outline-variant/15 text-center">
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Renda Total</span>
                          <span className="text-lg font-black text-primary mt-1 block">R$ {totalRenda.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>

                      <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex justify-between items-center text-xs">
                        <span className="font-bold text-primary">Renda Per Capita:</span>
                        <span className="font-extrabold text-primary text-sm">
                          R$ {rendaPerCapita.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Confirmação CadÚnico */}
                  <div className="mt-8 pt-6 border-t border-primary/10">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mt-1 rounded text-primary focus:ring-primary h-4.5 w-4.5 border-outline-variant/50"
                      />
                      <span className="text-xs leading-tight text-on-primary-container font-semibold select-none">
                        Confirmo que minha família está inscrita no Cadastro Único (CadÚnico)
                      </span>
                    </label>
                  </div>
                </div>

              </div>

              {/* SEÇÃO 2: Membros da Família & Capacidade Civil (Grid 2 colunas) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Membros da Família */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/15 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UsersIcon className="text-primary w-5 h-5" />
                      <h3 className="font-heading font-bold text-lg text-primary">Membros da Família</h3>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="text-xs font-bold text-secondary flex items-center gap-1.5 hover:underline transition-all cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Adicionar Dependente</span>
                    </button>
                  </div>

                  {/* Formulário Inline de Adição de Membros */}
                  {showAddForm && (
                    <div className="p-4 rounded-xl border-2 border-dashed border-secondary/20 bg-secondary/5 space-y-4 animate-fade-in">
                      <h4 className="text-xs font-bold text-secondary uppercase">Novo Dependente</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-on-surface-variant">Nome Completo</label>
                          <input 
                            type="text" 
                            value={newMemberName} 
                            onChange={(e) => setNewMemberName(e.target.value)}
                            className="rounded-md border border-outline-variant/50 bg-white py-1 px-2.5 text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-on-surface-variant">Parentesco</label>
                          <select 
                            value={newMemberParentesco} 
                            onChange={(e) => setNewMemberParentesco(e.target.value)}
                            className="rounded-md border border-outline-variant/50 bg-white py-1 px-2 text-xs"
                          >
                            <option value="conjuge">Cônjuge</option>
                            <option value="filho">Filho(a)</option>
                            <option value="pai">Pai/Mãe</option>
                            <option value="outro">Outro</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-on-surface-variant">Renda Mensal (R$)</label>
                          <input 
                            type="number" 
                            value={newMemberRenda || ""} 
                            onChange={(e) => setNewMemberRenda(Number(e.target.value))}
                            className="rounded-md border border-outline-variant/50 bg-white py-1 px-2.5 text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button 
                          type="button" 
                          onClick={() => setShowAddForm(false)}
                          className="px-3 py-1.5 rounded-lg border border-outline-variant text-xs hover:bg-slate-100 font-semibold"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="button" 
                          onClick={handleAddMember}
                          className="px-4 py-1.5 rounded-lg bg-secondary text-white text-xs hover:opacity-90 font-semibold"
                        >
                          Confirmar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lista de Membros */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {watchMembros.length === 0 ? (
                      <p className="text-xs text-on-surface-variant/60 italic text-center py-6 bg-surface-container-low rounded-xl">
                        Nenhum membro dependente registrado.
                      </p>
                    ) : (
                      watchMembros.map((membro, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20 hover:border-outline-variant/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/5 text-primary p-2 rounded-lg">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-primary">{membro.nomeCompleto}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] font-extrabold uppercase bg-white px-2 py-0.5 rounded border border-outline-variant/25 text-on-surface-variant">
                                  {membro.parentesco === "conjuge" ? "Cônjuge" : membro.parentesco === "filho" ? "Filho(a)" : membro.parentesco === "pai" ? "Pai/Mãe" : "Outro"}
                                </span>
                                {membro.rendaMensal > 0 && (
                                  <span className="text-[10px] text-secondary font-semibold">
                                    R$ {membro.rendaMensal.toLocaleString("pt-BR")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => remove(idx)}
                            className="text-on-surface-variant hover:text-error hover:bg-red-50 p-1.5 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Representante Legal e Upload de Documento */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/15 space-y-6 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Gavel className="text-primary w-5 h-5" />
                      <h3 className="font-heading font-bold text-lg text-primary">Representante Legal</h3>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-on-surface-variant">Nome do Representante Legal (se houver)</label>
                      <input 
                        type="text" 
                        {...register("representanteLegal")}
                        placeholder="Nome completo do procurador ou tutor"
                        className="rounded-lg border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm bg-white"
                      />
                    </div>
                  </div>

                  {/* Componente DocumentUpload Reutilizado */}
                  <div className="pt-4">
                    <DocumentUpload 
                      label="Procuração / Documento de Tutela Legal" 
                      accept="application/pdf,image/*" 
                      maxSizeMB={5} 
                    />
                  </div>
                </div>

              </div>

              {/* SEÇÃO 3: Situações de Prioridade */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/15 space-y-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-primary w-5 h-5" />
                  <h3 className="font-heading font-bold text-lg text-primary">Situações de Prioridade</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Violência Doméstica */}
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 p-4 border border-outline-variant/30 rounded-2xl cursor-pointer hover:bg-surface-container-low transition-colors">
                      <input 
                        type="checkbox" 
                        {...register("prioridadeViolencia")}
                        className="mt-1 rounded text-primary focus:ring-primary h-4.5 w-4.5 border-outline-variant/50"
                      />
                      <div>
                        <span className="block font-bold text-on-surface text-sm sm:text-base">Violência Doméstica</span>
                        <span className="text-xs text-on-surface-variant leading-tight block mt-0.5">
                          Marque se algum membro da família é vítima de violência doméstica (exige atestado/medida protetiva).
                        </span>
                      </div>
                    </label>
                    
                    <div className="p-3.5 bg-secondary-container/20 rounded-xl flex items-start gap-2.5 border border-secondary/10 text-xs">
                      <Info className="w-4.5 h-4.5 text-secondary shrink-0 mt-0.5" />
                      <p className="text-on-secondary-container leading-relaxed">
                        O atestado legal ou medida protetiva deve ser anexado posteriormente na etapa de documentos para validação legal.
                      </p>
                    </div>
                  </div>

                  {/* Necessidade de Acessibilidade */}
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 p-4 border border-outline-variant/30 rounded-2xl cursor-pointer hover:bg-surface-container-low transition-colors">
                      <input 
                        type="checkbox" 
                        {...register("prioridadeAcessibilidade")}
                        className="mt-1 rounded text-primary focus:ring-primary h-4.5 w-4.5 border-outline-variant/50"
                      />
                      <div>
                        <span className="block font-bold text-on-surface text-sm sm:text-base">Necessidade de Acessibilidade</span>
                        <span className="text-xs text-on-surface-variant leading-tight block mt-0.5">
                          Marque se houver necessidade de adaptações especiais para PCD, idosos ou pessoas com restrição motora.
                        </span>
                      </div>
                    </label>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Descreva a necessidade específica:</label>
                      <textarea 
                        rows={2}
                        {...register("detalheAcessibilidade")}
                        placeholder="Ex: cadeirante (necessita rampa), barras de apoio no banheiro, apartamento térreo..."
                        className="rounded-lg border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-xs bg-white resize-none"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* SEÇÃO 4: Proteção de Dados (LGPD) */}
              <div className="bg-primary-container/10 p-6 md:p-8 rounded-3xl border border-primary/10 space-y-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-primary w-6 h-6" />
                  <h3 className="font-heading font-bold text-lg text-primary">Proteção de Dados (LGPD)</h3>
                </div>

                <div className="space-y-6">
                  {/* Resumo LGPD */}
                  <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl text-xs sm:text-sm text-on-surface-variant border border-white/50 space-y-3">
                    <p className="leading-relaxed">
                      <strong>Resumo do Uso de Dados:</strong> O SIGAH utiliza seus dados pessoais e de sua família exclusivamente para fins de verificação de elegibilidade em programas habitacionais. Seus dados são protegidos por criptografia e acessíveis apenas por assistentes sociais e técnicos autorizados.
                    </p>
                    <a className="text-secondary font-bold hover:underline inline-flex items-center gap-1.5 text-xs" href="#">
                      <span>Visualizar Termo Completo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    
                    {/* Toggles (Switches) */}
                    <div className="space-y-4">
                      {/* Toggle 1: Essencial */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface text-sm sm:text-base">Tratamento de dados essenciais</span>
                          <span className="text-xs text-on-surface-variant">Necessário para o funcionamento do cadastro</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            disabled 
                            checked={true}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-primary rounded-full peer-focus:ring-4 peer-focus:ring-primary/20 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>

                      {/* Toggle 2: Comunicação */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface text-sm sm:text-base">Comunicações informativas</span>
                          <span className="text-xs text-on-surface-variant">Receber atualizações por SMS e E-mail</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            {...register("aceiteInformativas")}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-outline-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>

                    {/* Checkbox Termos de Uso */}
                    <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-primary/10 pt-4 md:pt-0 pl-0 md:pl-8">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          required
                          {...register("aceiteTermos")}
                          className="mt-1 rounded text-primary focus:ring-primary h-4.5 w-4.5 border-outline-variant/50"
                        />
                        <span className="text-xs sm:text-sm font-semibold text-on-surface select-none">
                          Li e concordo integralmente com os <strong>Termos de Uso e Política de Privacidade</strong> do Portal SIGAH.
                        </span>
                      </label>
                    </div>

                  </div>
                </div>
              </div>

              {/* Botões de Ação Final */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-6 border-t border-outline-variant/15">
                <button 
                  type="button" 
                  onClick={() => router.push(`/${programId}/cadastro`)}
                  className="w-full sm:w-auto px-8 py-3 rounded-full border-2 border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-all cursor-pointer text-center select-none bg-transparent"
                >
                  Voltar para Lista
                </button>
                <Link
                  href={`/${programId}/cadastro/${familiaId}/moradia`}
                  className="w-full sm:w-auto px-8 py-3 rounded-full border-2 border-secondary text-secondary font-bold text-sm hover:bg-secondary/5 transition-all text-center select-none no-underline flex items-center justify-center gap-1.5 font-sans"
                >
                  <span>Condições de Moradia</span>
                </Link>
                <Link
                  href={`/${programId}/verificacao/${familiaId}`}
                  className="w-full sm:w-auto px-8 py-3 rounded-full border-2 border-secondary text-secondary font-bold text-sm hover:bg-secondary/5 transition-all text-center select-none no-underline flex items-center justify-center gap-1.5 font-sans"
                >
                  <span>Verificação Documental</span>
                </Link>
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-10 py-3 rounded-full bg-primary text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95 transition-all cursor-pointer text-center select-none border-none"
                >
                  Salvar Cadastro
                </button>
              </div>

            </form>
          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          MOBILE BOTTOM NAV BAR (Simulado do Stitch)
          ========================================== */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center h-16 px-4 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-outline-variant/15 md:hidden">
        <Link 
          href={`/${programId}/dashboard`}
          className="flex flex-col items-center justify-center text-on-surface-variant font-medium px-4 py-1"
        >
          <Home className="w-5 h-5" />
          <span className="font-sans text-[10px] mt-0.5">Início</span>
        </Link>
        <Link 
          href={`/${programId}/cadastro`}
          className="flex flex-col items-center justify-center bg-secondary-container/30 text-secondary rounded-full px-5 py-1.5"
        >
          <ClipboardList className="w-5 h-5" />
          <span className="font-sans text-[10px] mt-0.5 font-bold">Cadastro</span>
        </Link>
        <Link 
          href="#"
          className="flex flex-col items-center justify-center text-on-surface-variant font-medium px-4 py-1"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-sans text-[10px] mt-0.5">Mensagens</span>
        </Link>
        <Link 
          href="#"
          className="flex flex-col items-center justify-center text-on-surface-variant font-medium px-4 py-1"
        >
          <User className="w-5 h-5" />
          <span className="font-sans text-[10px] mt-0.5">Perfil</span>
        </Link>
      </nav>
      {saveSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/45 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl border border-outline-variant/10">
            <div className="p-8 flex flex-col items-center text-center">
              
              {/* Success Icon */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-amber-50 border border-amber-200">
                <Clock className="w-8 h-8 text-amber-600 shrink-0" />
              </div>
              
              {/* Content */}
              <h3 className="font-headline text-2xl font-black text-primary leading-tight mb-3">
                Cadastro Pessoal Realizado com Sucesso!
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6 px-2 font-medium">
                O cadastro pessoal foi realizado com sucesso. Para seu cadastro ser completamente concluído, responda ao questionário de moradia.
              </p>
              
              {/* Protocol Card */}
              <div className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 mb-8">
                <p className="text-[10px] font-black text-outline uppercase tracking-wider mb-1">
                  Número de Protocolo
                </p>
                <p className="font-headline text-lg font-bold text-secondary tracking-tight">
                  #2024-SIGAH-{familiaId === "ana-silva" ? "8892" : Math.floor(1000 + Math.random() * 9000)}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col w-full gap-3">
                <Link
                  href={`/${programId}/cadastro/${familiaId === "new" ? "ana-silva" : familiaId}/moradia`}
                  className="w-full py-4 bg-secondary text-white rounded-xl font-bold text-xs hover:brightness-110 active:scale-95 transition-all text-center uppercase tracking-wider no-underline shadow-lg shadow-secondary/15 font-sans"
                >
                  Responder Questionário de Moradia
                </Link>
                <button 
                  onClick={() => setSaveSuccess(false)}
                  className="w-full py-4 border-2 border-outline/20 text-primary hover:bg-surface-container-high rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer uppercase tracking-wider bg-transparent font-sans"
                >
                  Voltar ao Formulário
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
