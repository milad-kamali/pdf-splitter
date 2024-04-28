<template>
  <div class="relative flex flex-col items-center">
    <div class="font-semibold text-center ml-auto mr-20 mt-2">
      تعداد فایل ها: {{ fileCount }}
    </div>
    <div id="pdfContainer" class="grid grid-cols-12 w-full mt-1 mb-5 gap-x-2">
      <iframe
        :src="pdfSrc"
        width="100%"
        height="100%"
        class="col-span-10 border border-gray-300 rounded"
      />
      <div class="col-span-2" style="height: 550px">
        <div class="grid gap-y-2 h-full overflow-y-auto">
          <div
            v-for="(file, i) in generatedFiles?.value"
            :key="i"
            class="flex flex-col h-fit border border-gray-300 text-center text-gray-400 rounded cursor-pointer"
            :class="i === currentFileIndex ? 'border-2 border-gray-700' : null"
            @click="changeCurrentFile(i)"
          >
            <i class='bx bxs-file-pdf text-6xl' />
            <div>
              {{ file.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <input
      v-model="fileName"
      placeholder="عنوان"
      class="col-span-3 text-xl border p-1 rounded"
      @keydown.right="nextFile"
      @keydown.left="previousFile"
      @keydown.enter="nextFile"
    />
    <div
      class="fixed bottom-0 grid grid-cols-12 w-full rounded-t-2xl px-5 py-2 shadow-lg"
      style="box-shadow: 0px -2px 12px 0px #0000002e;"
    >
        <input
          ref="inputFile"
          type="file"
          accept=".pdf"
          class="col-span-4 my-auto"
          title="انتخاب فایل"
          @change="handleFileChange"
        />
        <!-- <div
          class="col-span-4 flex items-center text-gray-500 rounded cursor-pointer"
          @click="selectFile"
        >
          <i class="bx bx-file-blank text-lg mr-2" />
          {{ selectedFiles?.value?.name || "انتخاب فایل" }}
        </div> -->
        <div class="col-span-4 flex items-center justify-center">
          <label
            class="flex"
            title="تعداد صفحه در فایل"
          >
            <i class="bx bx-cut text-2xl" />
            <input
              v-model="pageSize"
              type="number"
              min="1"
              class="w-20 border ml-2 p-1 rounded"
              @change="split"
            />
          </label>
        </div>
        <div class="col-span-4 flex justify-end">
        <button
          class="flex items-center justify-center w-12 h-12 border bg-red-500 hover:bg-red-600 text-xl text-white rounded-full transition-colors"
          title="دانلود"
          @click="downloadFiles"
        >
          <i class="bx bxs-download" />
        </button>
      </div>
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
      pageSize: 3,
      pdfSrc: null,
      fileNames: [''],
      fileName: '',
      currentFileIndex: 0
    }
  },
  beforeMount () {
    document.getElementById('pdfContainer').style.height = (window.innerHeight * 0.75) + 'px'
  },
  methods: {
    selectFile () {
      this.$refs.inputFile.click()
    },
    handleFileChange (event) {
      this.selectedFiles.value = event.target.files[0];
      this.split()
    },
    async split () {
      const pdfBytes = await this.readPDF(this.selectedFiles.value);
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const pageCount = pdfDoc.getPageCount();
      this.fileCount = Math.ceil(pageCount / this.pageSize);

      this.fileNames = ['']
      this.fileName = ''
      this.currentFileIndex = 0
      this.generatedFiles.value = [];

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
      if (this.currentFileIndex < this.fileCount-1) {
        this.generatedFiles.value[this.currentFileIndex].name = this.fileName
        this.currentFileIndex++
        this.fileName = this.generatedFiles.value[this.currentFileIndex].name
        this.pdfSrc = this.generatedFiles.value[this.currentFileIndex].url
      } else {
        this.generatedFiles.value[this.currentFileIndex].name = this.fileName
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
    },
    changeCurrentFile (i) {
      this.generatedFiles.value[this.currentFileIndex].name = this.fileName
      this.currentFileIndex = i
      this.fileName = this.generatedFiles.value[this.currentFileIndex].name
      this.pdfSrc = this.generatedFiles.value[this.currentFileIndex].url
    }
  }
}
</script>

<style>
  @font-face {
    font-family: "vazirmatn";
    src: url('./Vazirmatn-VariableFont_wght.ttf') format("ttf");
  }
  * {
    font-family: 'vazirmatn';
  }
</style>
