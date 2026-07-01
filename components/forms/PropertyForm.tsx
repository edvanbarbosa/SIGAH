// =============================================================================
// components/forms/PropertyForm.tsx
// Formulário modular para cadastro orientado ao imóvel/lote (Passo 7.1).
// Utilizado em programas como CDRU (Concessão de Direito Real de Uso).
// =============================================================================

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useProgram } from "@/lib/hooks/useProgram";
import { ShieldCheck, Save, Home } from "lucide-react";

interface PropertyFormData {
  inscricaoImovel: string;
  matriculaCartorio: string;
  areaTerrenoM2: number;
  areaConstruidaM2: number;
  situacaoFisica: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  aceitoTermo: boolean;
}

interface PropertyFormProps {
  initialData?: Partial<PropertyFormData>;
  onSubmit: (data: PropertyFormData) => void;
}

export function PropertyForm({ initialData, onSubmit }: PropertyFormProps) {
  const config = useProgram();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PropertyFormData>({
    defaultValues: {
      inscricaoImovel: "",
      matriculaCartorio: "",
      areaTerrenoM2: 0,
      areaConstruidaM2: 0,
      situacaoFisica: "lote_vazio",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      cep: "",
      aceitoTermo: false,
      ...initialData,
    },
  });

  // Se o programa habitacional ativo não for orientado a imóvel, avisa que está desabilitado
  if (config.formType !== "property") {
    return (
      <div className="p-6 border border-amber-200 bg-amber-50 text-amber-800 rounded-lg text-center font-sans">
        <h4 className="font-bold">Formulário Indisponível</h4>
        <p className="text-xs mt-1">
          O programa habitacional {config.theme.shortName} está configurado para cadastro orientado à família (formulário familiar).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto font-sans p-6 bg-white rounded-xl shadow-md border border-slate-100">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">
          Formulário de Cadastro de {config.labels.unidade}
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          Preencha os dados abaixo para o loteamento ou imóvel do programa {config.theme.shortName}.
        </p>
      </div>

      {/* DADOS DO IMÓVEL */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 border-l-4 border-primary pl-2">
          1. Identificação Técnica do {config.labels.unidade}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600">Código de Inscrição Municipal</label>
            <input
              type="text"
              required
              {...register("inscricaoImovel")}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Nº de Matrícula (CRI)</label>
            <input
              type="text"
              required
              {...register("matriculaCartorio")}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Área do Terreno (m²)</label>
            <input
              type="number"
              required
              {...register("areaTerrenoM2", { valueAsNumber: true })}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Situação Física</label>
            <select
              {...register("situacaoFisica")}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="lote_vazio">Lote Vazio</option>
              <option value="construcao_iniciada">Construção Iniciada</option>
              <option value="construcao_concluida">Construção Concluída</option>
              <option value="requalificacao">Necessita Requalificação</option>
            </select>
          </div>
        </div>
      </div>

      {/* ENDEREÇO DO IMÓVEL */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 border-l-4 border-primary pl-2">
          2. Localização Geográfica
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600">Logradouro / Logradouro de Acesso</label>
            <input
              type="text"
              required
              {...register("logradouro")}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Número/Lote</label>
            <input
              type="text"
              required
              {...register("numero")}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Bairro</label>
            <input
              type="text"
              required
              {...register("bairro")}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Cidade</label>
            <input
              type="text"
              required
              {...register("cidade")}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">CEP</label>
            <input
              type="text"
              required
              {...register("cep")}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* ACEITE DE DADOS */}
      <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
        <div className="flex items-start space-x-3">
          <input
            id="termo"
            type="checkbox"
            required
            {...register("aceitoTermo")}
            className="rounded text-primary focus:ring-primary h-4.5 w-4.5 mt-0.5 shrink-0"
          />
          <div className="flex-1">
            <label htmlFor="termo" className="text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>Aceito os termos da concessão do {config.labels.unidade}</span>
            </label>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Declaro sob as penas da lei que as informações descritas para esta unidade são verídicas e condizem com a realidade do levantamento fundiário realizado.
            </p>
          </div>
        </div>
      </div>

      {/* SUBMISSÃO */}
      <div className="flex items-center justify-end border-t border-slate-100 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-6 py-3 bg-primary hover:opacity-90 text-white font-bold rounded-lg text-sm transition shadow disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Gravando Cadastro..." : `Salvar ${config.labels.unidade}`}</span>
        </button>
      </div>
    </form>
  );
}

export default PropertyForm;
