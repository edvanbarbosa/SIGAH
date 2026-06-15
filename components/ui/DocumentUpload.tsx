// =============================================================================
// components/ui/DocumentUpload.tsx
// Componente de upload de arquivos com área de drag and drop e preview de arquivo.
// =============================================================================

"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle, AlertCircle, X } from "lucide-react";

interface DocumentUploadProps {
  /** Rótulo do documento (ex: "RG do Titular") */
  label: string;
  /** Tipos de arquivos aceitos (ex: "image/*,application/pdf") */
  accept?: string;
  /** Tamanho máximo permitido em MB (padrão: 5MB) */
  maxSizeMB?: number;
  /** Callback executado ao selecionar o arquivo */
  onFileSelect?: (file: File) => void;
  /** Status atual de análise do documento */
  status?: "pendente" | "enviado" | "aprovado" | "rejeitado";
  /** Observações ou erros de análise */
  feedback?: string | null;
}

export function DocumentUpload({
  label,
  accept = "image/*,application/pdf",
  maxSizeMB = 5,
  onFileSelect,
  status = "pendente",
  feedback,
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile: File) => {
    setError("");

    // Validação de tamanho
    const sizeInMB = selectedFile.size / 1024 / 1024;
    if (sizeInMB > maxSizeMB) {
      setError(`O arquivo excede o limite máximo de ${maxSizeMB}MB.`);
      return;
    }

    setFile(selectedFile);
    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setFile(null);
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const getStatusBadge = () => {
    const badges = {
      pendente: { bg: "bg-slate-100", text: "text-slate-600", label: "Pendente" },
      enviado: { bg: "bg-blue-100", text: "text-blue-700", label: "Enviado" },
      aprovado: { bg: "bg-green-100", text: "text-green-700", label: "Aprovado" },
      rejeitado: { bg: "bg-red-100", text: "text-red-700", label: "Rejeitado" },
    };
    const current = badges[status];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${current.bg} ${current.text}`}>
        {current.label}
      </span>
    );
  };

  return (
    <div className="font-sans border border-slate-100 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        {getStatusBadge()}
      </div>

      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition ${
            dragActive
              ? "border-blue-500 bg-blue-50/20"
              : "border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
          <p className="text-xs text-slate-600 text-center font-medium">
            Arraste e solte o arquivo aqui ou <span className="text-blue-600">clique para buscar</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Formatos aceitos: PDF, JPEG, PNG (Máx {maxSizeMB}MB)
          </p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <FileText className="w-6 h-6 text-blue-500 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-700 truncate">{file.name}</p>
              <p className="text-[10px] text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-1.5 text-red-500 text-xs mt-2 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {feedback && (
        <div className={`flex items-start space-x-1.5 text-xs mt-2 p-2 rounded ${
          status === "rejeitado" ? "bg-red-50 text-red-800" : "bg-slate-50 text-slate-600"
        }`}>
          {status === "aprovado" ? (
            <CheckCircle className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${status === "rejeitado" ? "text-red-500" : "text-slate-400"}`} />
          )}
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;
