import { useState } from "react";

export const useFileExport = (resource: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const triggerExport = async (type: "pdf" | "excel", id: string) => {
    setIsLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL; // Obtiene la URL base desde el archivo .env
      const response = await fetch(`${baseUrl}/api/${resource}/${id}/${type}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Error al generar el archivo");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resource}-${id}.${type === "pdf" ? "pdf" : "xlsx"}`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar archivo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, triggerExport };
};