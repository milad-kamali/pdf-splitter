<template>
  <div class="flex flex-col items-center">
    <div class="mt-5 font-semibold">تعداد بارنامه ها: {{ fileCount }}</div>
    <iframe
      :src="pdfSrc"
      width="90%"
      height="550"
      class="border mx-auto my-5"
    />
    <input
      placeholder="عنوان"
      v-model="fileName"
      class="text-xl border p-1"
      @keydown.right="nextFile"
      @keydown.left="previousFile"
    />
    <div class="items-center mt-3">
      <input type="file" @change="handleFileChange" />
      <label>
        تعداد صفحات
        <input
          v-model="pageSize"
          type="number"
          min="1"
          class="border mx-3"
          @change="split"
        />
      </label>
      <!-- <button
        class="border bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1 transition-colors"
        @click="split"
      >
        جدا سازی
      </button> -->
      <button
        class="border bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1 transition-colors"
        @click="downloadFiles"
      >
        دانلود
      </button>
    </div>
  </div>
</template>

<script>
import { PDFDocument } from 'pdf-lib'

export default {
  data () {
    return {
      selectedFiles: {
        value: []
      },
      generatedFiles: [],
      fileCount: 0,
      pageSize: 1,
      pdfSrc: null,
      fileNames: [''],
      fileName: '',
      currentFileIndex: 0
    }
  },
  methods: {
    handleFileChange (event) {
      this.selectedFiles.value = event.target.files[0];
      this.split()
    },

    async split () {
      const pdfBytes = await this.readPDF(this.selectedFiles.value);
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const pageCount = pdfDoc.getPageCount();
      this.fileCount = Math.ceil(pageCount / this.pageSize);

      this.generatedFiles.value = [];
      this.fileNames = ['']

      for (let i = 0; i < this.fileCount; i++) {
        const startPageIndex = i * this.pageSize;
        const endPageIndex = Math.min((i + 1) * this.pageSize, pageCount);

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, Array.from({ length: endPageIndex - startPageIndex }, (_, j) => startPageIndex + j));
        copiedPages.forEach((page) => newPdf.addPage(page));

        const newPdfBytes = await newPdf.save();

        const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
        const dataUrl = URL.createObjectURL(blob);

        this.generatedFiles.value.push({
          name: '',
          url: dataUrl
        });
      }
      // for (const file of this.generatedFiles.value) {
      //   const LINK = document.createElement('a')
      //   LINK.href = file.url
      //   LINK.download = file.name
      //   LINK.click()
      // }
      this.pdfSrc = this.generatedFiles.value[0].url
    },

    async readPDF (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(new Uint8Array(event.target.result));
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
    },

    nextFile () {
      if (this.currentFileIndex < this.fileCount) {
        this.generatedFiles.value[this.currentFileIndex].name = this.fileName
        this.currentFileIndex++
        this.fileName = this.generatedFiles.value[this.currentFileIndex].name
        // this.fileName = this.fileNames[this.currentFileIndex]
        this.pdfSrc = this.generatedFiles.value[this.currentFileIndex].url
        console.log(this.generatedFiles);
      }
    },
    previousFile () {
      if (this.currentFileIndex > 0) {
        this.generatedFiles.value[this.currentFileIndex].name = this.fileName
        this.currentFileIndex--
        this.fileName = this.generatedFiles.value[this.currentFileIndex].name
        this.pdfSrc = this.generatedFiles.value[this.currentFileIndex].url
      }
    },
    downloadFiles () {
      for (const file of this.generatedFiles.value) {
        const LINK = document.createElement('a')
        LINK.href = file.url
        LINK.download = file.name
        LINK.click()
      }
    }
  }
}
</script>

<style>
  @font-face {
    font-family: "vazirmatn";
    src: url('/Vazirmatn-VariableFont_wght.ttf') format("ttf");
  }
  * {
    font-family: 'vazirmatn';
  }
</style>
