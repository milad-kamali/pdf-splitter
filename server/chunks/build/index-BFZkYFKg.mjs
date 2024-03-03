import { PDFDocument } from 'pdf-lib';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import '../runtime.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const _sfc_main = {
  data() {
    return {
      selectedFiles: {
        value: []
      },
      generatedFiles: [],
      fileCount: 0,
      pageSize: 1,
      pdfSrc: null,
      fileNames: [""],
      fileName: "",
      currentFileIndex: 0
    };
  },
  methods: {
    handleFileChange(event) {
      this.selectedFiles.value = event.target.files[0];
      this.split();
    },
    async split() {
      const pdfBytes = await this.readPDF(this.selectedFiles.value);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pageCount = pdfDoc.getPageCount();
      this.fileCount = Math.ceil(pageCount / this.pageSize);
      this.generatedFiles.value = [];
      this.fileNames = [""];
      for (let i = 0; i < this.fileCount; i++) {
        const startPageIndex = i * this.pageSize;
        const endPageIndex = Math.min((i + 1) * this.pageSize, pageCount);
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, Array.from({ length: endPageIndex - startPageIndex }, (_, j) => startPageIndex + j));
        copiedPages.forEach((page) => newPdf.addPage(page));
        const newPdfBytes = await newPdf.save();
        const blob = new Blob([newPdfBytes], { type: "application/pdf" });
        const dataUrl = URL.createObjectURL(blob);
        this.generatedFiles.value.push({
          name: "",
          url: dataUrl
        });
      }
      this.pdfSrc = this.generatedFiles.value[0].url;
    },
    async readPDF(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(new Uint8Array(event.target.result));
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
    },
    nextFile() {
      if (this.currentFileIndex < this.fileCount) {
        this.generatedFiles.value[this.currentFileIndex].name = this.fileName;
        this.currentFileIndex++;
        this.fileName = this.generatedFiles.value[this.currentFileIndex].name;
        this.pdfSrc = this.generatedFiles.value[this.currentFileIndex].url;
        console.log(this.generatedFiles);
      }
    },
    previousFile() {
      if (this.currentFileIndex > 0) {
        this.generatedFiles.value[this.currentFileIndex].name = this.fileName;
        this.currentFileIndex--;
        this.fileName = this.generatedFiles.value[this.currentFileIndex].name;
        this.pdfSrc = this.generatedFiles.value[this.currentFileIndex].url;
      }
    },
    downloadFiles() {
      for (const file of this.generatedFiles.value) {
        const LINK = (void 0).createElement("a");
        LINK.href = file.url;
        LINK.download = file.name;
        LINK.click();
      }
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col items-center" }, _attrs))}><div class="mt-5 font-semibold">\u062A\u0639\u062F\u0627\u062F \u0628\u0627\u0631\u0646\u0627\u0645\u0647 \u0647\u0627: ${ssrInterpolate($data.fileCount)}</div><iframe${ssrRenderAttr("src", $data.pdfSrc)} width="90%" height="550" class="border mx-auto my-5"></iframe><input placeholder="\u0639\u0646\u0648\u0627\u0646"${ssrRenderAttr("value", $data.fileName)} class="text-xl border p-1"><div class="items-center mt-3"><input type="file"><label> \u062A\u0639\u062F\u0627\u062F \u0635\u0641\u062D\u0627\u062A <input${ssrRenderAttr("value", $data.pageSize)} type="number" min="1" class="border mx-3"></label><button class="border bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1 transition-colors"> \u062F\u0627\u0646\u0644\u0648\u062F </button></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-BFZkYFKg.mjs.map
