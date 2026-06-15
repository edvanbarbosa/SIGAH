// =============================================================================
// components/forms/FamilyForm.tsx
// Formulário modular para cadastro e inscrição familiar (Passo 7.1).
// Utiliza react-hook-form para evitar re-renderizações desnecessárias (Risco 3)
// e exibe seções condicionalmente via feature flags do useProgram().
// =============================================================================

"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useProgram } from "@/lib/hooks/useProgram";
import { FamilyRegistration } from "@/types/family";
import { ShieldCheck, Plus, Trash2, Save } from "lucide-react";

interface FamilyFormProps {
  /** Cadastro pré-existente para edição (opcional) */
  initialData?: Partial<FamilyRegistration>;
  /** Callback executado ao submeter o formulário */
  onSubmit: (data: FamilyRegistration) => void;
}

export function FamilyForm({ initialData, onSubmit }: FamilyFormProps) {
  const config = useProgram();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FamilyRegistration>({
    defaultValues: {
      programId: config.id,
      status: "rascunho",
      responsavel: {
        nomeCompleto: "",
        cpf: "",
        dataNascimento: "",
        genero: "nao_informado",
        parentesco: "responsavel",
        estadoCivil: "solteiro",
        escolaridade: "sem_escolaridade",
        deficiencia: "nenhuma",
        rendaMensal: 0,
        nis: "",
        isResponsavel: true,
        ...initialData?.responsavel,
      },
      membros: initialData?.membros || [],
      endereco: {
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "SE", // Sergipe default
        cep: "",
        ...initialData?.endereco,
      },
      dadosSocioeconomicos: {
        rendaFamiliarTotal: 0,
        quantidadeMembros: 1,
        rendaPerCapita: 0,
        situacaoMoradia: "outro",
        valorAluguel: 0,
        tempoResidenciaMunicipio: 0,
        isBeneficiarioProgramaSocial: false,
        isInscritoCadUnico: false,
        isBeneficiadoAnterior: false,
        ...initialData?.dadosSocioeconomicos,
      },
      consentimento: {
        aceito: false,
        dataAceite: null,
        ipOrigem: null,
        versaoTermo: "1.0.0",
        ...initialData?.consentimento,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "membros",
  });

  // Observa a renda do responsável e dos membros para calcular a renda familiar total
  const responsavelRenda = watch("responsavel.rendaMensal") || 0;
  const membros = watch("membros") || [];

  React.useEffect(() => {
    const totalMembros = 1 + membros.length;
    const totalRenda = 
      Number(responsavelRenda) +
      membros.reduce((sum, member) => sum + Number(member?.rendaMensal || 0), 0);

    setValue("dadosSocioeconomicos.quantidadeMembros", totalMembros);
    setValue("dadosSocioeconomicos.rendaFamiliarTotal", totalRenda);
    setValue("dadosSocioeconomicos.rendaPerCapita", Math.round(totalRenda / totalMembros));
  }, [responsavelRenda, membros, setValue]);

  const totalRendaFamiliar = watch("dadosSocioeconomicos.rendaFamiliarTotal");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto font-sans p-6 bg-white rounded-xl shadow-md border border-slate-100">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">
          Formulário de {config.labels.cadastro}
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          Preencha os dados abaixo do {config.labels.beneficiario} e sua composição familiar.
        </p>
      </div>

      {/* SEÇÃO 1: Responsável Familiar */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 border-l-4 border-blue-600 pl-2">
          1. Responsável Familiar ({config.labels.beneficiario})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600">Nome Completo</label>
            <input
              type="text"
              required
              {...register("responsavel.nomeCompleto")}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">CPF</label>
            <input
              type="text"
              required
              {...register("responsavel.cpf")}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Data de Nascimento</label>
            <input
              type="date"
              required
              {...register("responsavel.dataNascimento")}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Renda Mensal (em centavos de Real)</label>
            <input
              type="number"
              required
              {...register("responsavel.rendaMensal", { valueAsNumber: true })}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: Endereço */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 border-l-4 border-blue-600 pl-2">
          2. Endereço Residencial
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600">Logradouro</label>
            <input
              type="text"
              required
              {...register("endereco.logradouro")}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Número</label>
            <input
              type="text"
              required
              {...register("endereco.numero")}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Bairro</label>
            <input
              type="text"
              required
              {...register("endereco.bairro")}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Cidade</label>
            <input
              type="text"
              required
              {...register("endereco.cidade")}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">CEP</label>
            <input
              type="text"
              required
              {...register("endereco.cep")}
              className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: Membros da Família (Composição Familiar) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-l-4 border-blue-600 pl-2">
          <h3 className="text-sm font-bold text-slate-700">
            3. Composição Familiar (Membros Dependentes)
          </h3>
          <button
            type="button"
            onClick={() =>
              append({
                id: "",
                nomeCompleto: "",
                cpf: "",
                dataNascimento: "",
                genero: "nao_informado",
                parentesco: "filho",
                estadoCivil: "solteiro",
                escolaridade: "sem_escolaridade",
                deficiencia: "nenhuma",
                rendaMensal: 0,
                nis: null,
                isResponsavel: false,
              })
            }
            className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-500"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Dependente</span>
          </button>
        </div>

        {fields.length === 0 ? (
          <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-lg text-center">
            Nenhum membro dependente cadastrado até o momento.
          </p>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col md:flex-row md:items-end gap-3">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500">Nome do Dependente</label>
                    <input
                      type="text"
                      required
                      {...register(`membros.${index}.nomeCompleto` as const)}
                      className="mt-1 block w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500">Parentesco</label>
                    <select
                      {...register(`membros.${index}.parentesco` as const)}
                      className="mt-1 block w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                    >
                      <option value="conjuge">Cônjuge</option>
                      <option value="filho">Filho(a)</option>
                      <option value="pai">Pai/Mãe</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500">Renda (em centavos)</label>
                    <input
                      type="number"
                      required
                      {...register(`membros.${index}.rendaMensal` as const, { valueAsNumber: true })}
                      className="mt-1 block w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-1.5 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEÇÃO CONDICIONAL: Integração CadÚnico */}
      {config.enabledSections.integracaoCadUnico && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 border-l-4 border-blue-600 pl-2">
            4. Informações do Cadastro Único (CadÚnico)
          </h3>
          <div className="p-4 border border-slate-100 rounded-lg bg-slate-50 flex items-center space-x-4">
            <div className="flex-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("dadosSocioeconomicos.isInscritoCadUnico")}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs font-semibold text-slate-700">A família encontra-se inscrita no Cadastro Único (CadÚnico)</span>
              </label>
              <p className="text-[10px] text-slate-400 mt-1 pl-6">
                Marcar esta opção se o responsável já possuir NIS ativo e cadastro atualizado no CRAS.
              </p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500">NIS do Responsável (se houver)</label>
              <input
                type="text"
                {...register("responsavel.nis")}
                className="mt-1 block w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                placeholder="000.00000.00-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* SEÇÃO 5: Renda Familiar Consolidada */}
      <div className="p-4 border border-blue-100 rounded-lg bg-blue-50/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Resumo de Renda Consolidado</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">Calculado automaticamente com base na renda dos membros.</p>
        </div>
        <div className="flex space-x-6 text-center md:text-right">
          <div>
            <span className="block text-[10px] font-bold text-slate-500">Membros</span>
            <span className="text-sm font-extrabold text-slate-800">
              {watch("dadosSocioeconomicos.quantidadeMembros")}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500">Renda Total</span>
            <span className="text-sm font-extrabold text-slate-800">
              R$ {(totalRendaFamiliar / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500">Renda Per Capita</span>
            <span className="text-sm font-extrabold text-slate-800">
              R$ {(watch("dadosSocioeconomicos.rendaPerCapita") / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* SEÇÃO: Aceite de Consentimento LGPD (RF040) */}
      <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
        <div className="flex items-start space-x-3">
          <input
            id="lgpd"
            type="checkbox"
            required
            {...register("consentimento.aceito")}
            className="rounded text-blue-600 focus:ring-blue-500 h-4.5 w-4.5 mt-0.5 shrink-0"
          />
          <div className="flex-1">
            <label htmlFor="lgpd" className="text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Aceito os Termos de Tratamento de Dados (LGPD)</span>
            </label>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Declaro que dou consentimento para a coleta, armazenamento e compartilhamento de meus dados e de minha composição familiar exclusivamente para fins de auditoria, triagem e enquadramento nos programas habitacionais estaduais do SIGAH.
            </p>
          </div>
        </div>
      </div>

      {/* SUBMISSÃO */}
      <div className="flex items-center justify-end border-t border-slate-100 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm transition shadow disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Gravando Inscrição..." : "Salvar Inscrição"}</span>
        </button>
      </div>
    </form>
  );
}

export default FamilyForm;
