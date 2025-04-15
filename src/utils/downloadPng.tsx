import html2canvas from "html2canvas";
import downloadjs from "downloadjs";

const downloadPng = async (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Clona para evitar modificar o original
    const clone = element.cloneNode(true) as HTMLElement;

    // Remove zoom/transform e define um estilo isolado
    clone.style.transform = "none";
    clone.style.position = "fixed";
    clone.style.top = "0";
    clone.style.left = "0";
    clone.style.zIndex = "-1";
    clone.style.boxSizing = "border-box";

    document.body.appendChild(clone);

    try {
        const canvas = await html2canvas(clone, {
            useCORS: true, // se usares fontes ou imagens externas
            backgroundColor: null, // transparente ou usa "white"
        });

        const dataURL = canvas.toDataURL("image/png");
        downloadjs(dataURL, "download.png", "image/png");
    } catch (err) {
        console.error("Erro ao gerar imagem:", err);
    } finally {
        document.body.removeChild(clone);
    }
};

export default downloadPng;
