import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import downloadPng from "./utils/downloadPng";

function App() {
    const handleEditorHtmlChange = (value: string | undefined) => {
        setPreviewHtml(value || "");
    };

    const handleEditorCssChange = (value: string | undefined) => {
        setPreviewCss(value || "");
    };

    const [previewHtml, setPreviewHtml] = useState<string>("");
    const [previewCss, setPreviewCss] = useState<string>("");

    useEffect(() => {
        fetch("/templates/example.html")
            .then((res) => res.text())
            .then((text) => {
                setPreviewHtml(text);
            })
            .catch((err) => {
                console.error("Erro ao carregar HTML:", err);
            });
    }, []);

    useEffect(() => {
        fetch("/templates/example.css")
            .then((res) => res.text())
            .then((text) => {
                setPreviewCss(text);
            })
            .catch((err) => {
                console.error("Erro ao carregar CSS:", err);
            });
    }, []);

    const Controls = () => {
        const { zoomIn, zoomOut, resetTransform } = useControls();

        return (
            <div className="tools">
                <button className="btn btn-primary" onClick={() => zoomIn()}>
                    <i className="bi bi-plus"></i>
                </button>
                <button className="btn btn-primary" onClick={() => zoomOut()}>
                    <i className="bi bi-dash"></i>
                </button>
                <button className="btn btn-primary" onClick={() => resetTransform()}>
                    <i className="bi bi-arrow-clockwise"></i>
                </button>
                <button className="btn btn-primary" onClick={async() => await downloadPng("preview-content")}>
                    <i className="bi bi-download"></i>
                </button>
            </div>
        );
    };

    return (
        <>
            <div className="container-fluid">
                <section id="main-section">
                    <h1>HTML Download</h1>
                    <div className="row">
                        <div className="col-md-4" id="editor-section">
                            <ul className="nav nav-tabs">
                                <li className="nav-item">
                                    <button
                                        className="nav-link active"
                                        data-bs-toggle="tab"
                                        data-bs-target="#html-tab-pane"
                                        type="button"
                                    >
                                        HTML
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className="nav-link"
                                        data-bs-toggle="tab"
                                        data-bs-target="#css-tab-pane"
                                        type="button"
                                    >
                                        CSS
                                    </button>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane show active" id="html-tab-pane" role="tabpanel">
                                    <Editor
                                        width="100%"
                                        height="100%"
                                        defaultLanguage="html"
                                        defaultValue={previewHtml}
                                        theme="vs-dark"
                                        options={{
                                            minimap: {
                                                enabled: false,
                                            },
                                        }}
                                        onChange={(value) => handleEditorHtmlChange(value)}
                                    />
                                </div>
                                <div className="tab-pane" id="css-tab-pane" role="tabpanel">
                                    <Editor
                                        width="100%"
                                        height="100%"
                                        defaultLanguage="css"
                                        defaultValue={previewCss}
                                        theme="vs-dark"
                                        options={{
                                            minimap: {
                                                enabled: false,
                                            },
                                        }}
                                        onChange={(value) => handleEditorCssChange(value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8" id="preview-section">
                            <TransformWrapper
                                minScale={0.1}
                                centerOnInit
                                limitToBounds={false}
                                onInit={({ setTransform }) => {
                                    // Espera o HTML/CSS ser renderizado
                                    setTimeout(() => {
                                        const container = document.querySelector("#preview-section") as HTMLDivElement;
                                        const content = container?.querySelector(".preview-content") as HTMLDivElement;

                                        if (container && content) {
                                            const containerWidth = container.clientWidth;
                                            const containerHeight = container.clientHeight;

                                            const margin = 40;

                                            const contentWidth = content.scrollWidth + margin * 2;
                                            const contentHeight = content.scrollHeight + margin * 2;

                                            const scaleX = containerWidth /  (contentWidth + margin * 2);
                                            const scaleY = containerHeight /  (contentHeight + margin * 2);

                                            const scale = Math.min(scaleX, scaleY, 1);

                                            const offsetX = (containerWidth - contentWidth * scale) / 2;
                                            const offsetY = (containerHeight - contentHeight * scale) / 2;

                                            setTransform(offsetX, offsetY, scale);
                                        }
                                    }, 300);
                                }}
                            >
                                {() => (
                                    <>
                                        <Controls />
                                        <TransformComponent>
                                            <style dangerouslySetInnerHTML={{ __html: previewCss }} />
                                            <div
                                                id="preview-content"
                                                className="preview-content"
                                                dangerouslySetInnerHTML={{ __html: previewHtml }}
                                            ></div>
                                        </TransformComponent>
                                    </>
                                )}
                            </TransformWrapper>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default App;
