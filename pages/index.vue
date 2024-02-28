<template>
    <div>
    <input type="file" @change="handleFileChange" multiple />
    <button @click="splitAndDownload">Split PDF</button>
  </div>
</template>

<script>
import { PDFDocument } from 'pdf-lib';

export default {
  data () {
    return {
      selectedFiles: {value: []},
      generatedFiles: [],
    }
  },
  methods: {
    handleFileChange (event) {
      this.selectedFiles.value = event.target.files[0];
    },

async splitAndDownload () {
  const pdfBytes = await this.readPDF(this.selectedFiles.value);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const pageSize = 4; // تعداد صفحات در هر فایل جدید
  const pageCount = pdfDoc.getPageCount();
  const fileCount = Math.ceil(pageCount / pageSize);

  this.generatedFiles.value = [];

  for (let i = 0; i < fileCount; i++) {
    const startPageIndex = i * pageSize;
    const endPageIndex = Math.min((i + 1) * pageSize, pageCount);

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdfDoc, Array.from({ length: endPageIndex - startPageIndex }, (_, j) => startPageIndex + j));
    copiedPages.forEach((page) => newPdf.addPage(page));

    const newPdfBytes = await newPdf.save();
    const outputFileName = `file_${i + 1}.pdf`;

    const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
    const dataUrl = URL.createObjectURL(blob);

    this.generatedFiles.value.push({
      name: outputFileName,
      url: dataUrl,
    });
  }
  console.log('this.generatedFiles', this.generatedFiles.value);
},

async readPDF (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(new Uint8Array(event.target.result));
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
  }
}
</script>

<style>

</style>