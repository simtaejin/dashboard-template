// This File 페이지 관련 JavaScript

class ThisFileManager {
    constructor() {
        this.selectedFiles = [];
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDeleteButton();
    }

    setupEventListeners() {
        // 드래그 앤 드롭 기능
        this.setupDropzone();

        // 파일 입력 이벤트
        this.setupFileInput();

        // 업로드 버튼
        this.setupUploadButton();

        // 체크박스 기능
        this.setupCheckboxes();

        // 파일 작업 버튼들
        this.setupFileActions();
    }

    setupDropzone() {
        const dropzone = document.getElementById('dropzone');
        const fileInput = document.getElementById('fileInput');

        if (!dropzone || !fileInput) return;

        // 클릭으로 파일 선택
        dropzone.addEventListener('click', () => {
            fileInput.click();
        });

        // 드래그 오버
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('border-blue-400', 'bg-blue-50');
        });

        // 드래그 리브
        dropzone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            if (!dropzone.contains(e.relatedTarget)) {
                dropzone.classList.remove('border-blue-400', 'bg-blue-50');
            }
        });

        // 파일 드롭
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('border-blue-400', 'bg-blue-50');

            const files = Array.from(e.dataTransfer.files);
            this.handleFiles(files);
        });
    }

    setupFileInput() {
        const fileInput = document.getElementById('fileInput');
        if (!fileInput) return;

        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleFiles(files);
        });
    }

    handleFiles(files) {
        const validFiles = files.filter(file => {
            if (file.size > this.maxFileSize) {
                alert(`파일 "${file.name}"이 너무 큽니다. (최대 10MB)`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            this.selectedFiles = validFiles;
            this.updateDropzoneText(`${validFiles.length}개 파일이 선택되었습니다.`);
            this.updateUploadButton(true);
        }
    }

    updateDropzoneText(text) {
        const dropzone = document.getElementById('dropzone');
        const textElement = dropzone.querySelector('p');
        if (textElement) {
            textElement.textContent = text;
        }
    }

    updateUploadButton(enabled) {
        const uploadBtn = document.getElementById('uploadBtn');
        if (uploadBtn) {
            uploadBtn.disabled = !enabled;
        }
    }

    setupUploadButton() {
        const uploadBtn = document.getElementById('uploadBtn');
        if (!uploadBtn) return;

        uploadBtn.addEventListener('click', () => {
            this.uploadFiles();
        });
    }

    async uploadFiles() {
        if (this.selectedFiles.length === 0) {
            alert('선택된 파일이 없습니다.');
            return;
        }

        const uploadBtn = document.getElementById('uploadBtn');
        const originalText = uploadBtn.innerHTML;

        // 업로드 중 상태 표시
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>업로드 중...';
        uploadBtn.disabled = true;

        try {
            // 실제 업로드 로직은 여기에 구현
            // 예시: FormData를 사용한 파일 업로드
            /*
            const formData = new FormData();
            this.selectedFiles.forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('업로드 실패');
            }
            */

            // 시뮬레이션용 지연
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert(`${this.selectedFiles.length}개 파일이 업로드되었습니다.`);
            this.resetUploadForm();

            // 파일 목록 새로고침 (실제로는 서버에서 데이터 가져오기)
            this.refreshFileList();

        } catch (error) {
            console.error('Upload error:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
        } finally {
            uploadBtn.innerHTML = originalText;
            uploadBtn.disabled = false;
        }
    }

    resetUploadForm() {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.value = '';
        }

        this.selectedFiles = [];
        this.updateDropzoneText('파일을 드래그 앤 드롭하거나 클릭하여 선택하세요');
        this.updateUploadButton(false);
    }

    setupCheckboxes() {
        const selectAllCheckbox = document.getElementById('selectAll');
        const selectAllBtn = document.getElementById('selectAllBtn');
        const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', () => {
                const fileCheckboxes = document.querySelectorAll('.file-checkbox');
                fileCheckboxes.forEach(checkbox => {
                    checkbox.checked = selectAllCheckbox.checked;
                });
                this.updateDeleteButton();
            });
        }

        // 개별 체크박스 이벤트
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('file-checkbox')) {
                this.updateDeleteButton();
                this.updateSelectAllCheckbox();
            }
        });

        // 전체 선택 버튼
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                if (selectAllCheckbox) {
                    selectAllCheckbox.checked = true;
                    selectAllCheckbox.dispatchEvent(new Event('change'));
                }
            });
        }

        // 선택 삭제 버튼
        if (deleteSelectedBtn) {
            deleteSelectedBtn.addEventListener('click', () => {
                this.deleteSelectedFiles();
            });
        }
    }

    updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('selectAll');
        const fileCheckboxes = document.querySelectorAll('.file-checkbox');
        const checkedCount = document.querySelectorAll('.file-checkbox:checked').length;

        if (selectAllCheckbox) {
            selectAllCheckbox.checked = checkedCount === fileCheckboxes.length;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < fileCheckboxes.length;
        }
    }

    updateDeleteButton() {
        const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
        const checkedCount = document.querySelectorAll('.file-checkbox:checked').length;

        if (deleteSelectedBtn) {
            deleteSelectedBtn.disabled = checkedCount === 0;
        }
    }

    async deleteSelectedFiles() {
        const checkedCheckboxes = document.querySelectorAll('.file-checkbox:checked');
        const fileNames = Array.from(checkedCheckboxes).map(checkbox => {
            return checkbox.closest('tr').querySelector('span').textContent;
        });

        if (fileNames.length === 0) {
            alert('삭제할 파일을 선택해주세요.');
            return;
        }

        if (!confirm(`선택한 ${fileNames.length}개 파일을 삭제하시겠습니까?`)) {
            return;
        }

        try {
            // 실제 삭제 API 호출
            /*
            const response = await fetch('/api/files/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ files: fileNames })
            });

            if (!response.ok) {
                throw new Error('삭제 실패');
            }
            */

            // 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 500));

            alert(`${fileNames.length}개 파일이 삭제되었습니다.`);

            // 선택된 행들을 DOM에서 제거
            checkedCheckboxes.forEach(checkbox => {
                checkbox.closest('tr').remove();
            });

            this.updateDeleteButton();
            this.updateSelectAllCheckbox();

        } catch (error) {
            console.error('Delete error:', error);
            alert('파일 삭제 중 오류가 발생했습니다.');
        }
    }

    setupFileActions() {
        // 다운로드 버튼들
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('fa-download') || e.target.closest('.fa-download')) {
                e.preventDefault();
                const filename = e.target.closest('tr').querySelector('span').textContent;
                this.downloadFile(filename);
            }
        });

        // 미리보기 버튼들
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('fa-eye') || e.target.closest('.fa-eye')) {
                e.preventDefault();
                const filename = e.target.closest('tr').querySelector('span').textContent;
                this.previewFile(filename);
            }
        });

        // 개별 삭제 버튼들
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('fa-trash') || e.target.closest('.fa-trash')) {
                e.preventDefault();
                const filename = e.target.closest('tr').querySelector('span').textContent;
                this.deleteFile(filename, e.target.closest('tr'));
            }
        });
    }

    async downloadFile(filename) {
        try {
            // 실제 다운로드 로직
            /*
            const response = await fetch(`/api/files/download/${encodeURIComponent(filename)}`);
            if (!response.ok) {
                throw new Error('다운로드 실패');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            */

            // 시뮬레이션
            alert(`${filename} 다운로드를 시작합니다.`);

        } catch (error) {
            console.error('Download error:', error);
            alert('파일 다운로드 중 오류가 발생했습니다.');
        }
    }

    previewFile(filename) {
        // 파일 확장자에 따른 미리보기
        const ext = filename.split('.').pop().toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) {
            this.showImagePreview(filename);
        } else if (['pdf'].includes(ext)) {
            this.showPdfPreview(filename);
        } else if (['txt', 'md'].includes(ext)) {
            this.showTextPreview(filename);
        } else {
            alert(`${filename} 파일 타입은 미리보기를 지원하지 않습니다.`);
        }
    }

    showImagePreview(filename) {
        // 이미지 미리보기 모달 창 (실제로는 서버에서 이미지 URL 가져오기)
        const modal = this.createModal(`
            <div class="text-center">
                <h3 class="text-lg font-medium mb-4">${filename}</h3>
                <img src="/api/files/preview/${encodeURIComponent(filename)}" alt="${filename}" class="max-w-full max-h-96 mx-auto">
            </div>
        `);
        document.body.appendChild(modal);
    }

    showPdfPreview(filename) {
        alert(`${filename} PDF 미리보기를 엽니다. (실제로는 PDF 뷰어로 연결)`);
    }

    showTextPreview(filename) {
        alert(`${filename} 텍스트 미리보기를 엽니다.`);
    }

    createModal(content) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-2xl max-h-full overflow-auto">
                ${content}
                <div class="mt-4 text-center">
                    <button class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onclick="this.closest('.fixed').remove()">
                        닫기
                    </button>
                </div>
            </div>
        `;
        return modal;
    }

    async deleteFile(filename, row) {
        if (!confirm(`${filename}을(를) 삭제하시겠습니까?`)) {
            return;
        }

        try {
            // 실제 삭제 API 호출
            /*
            const response = await fetch(`/api/files/${encodeURIComponent(filename)}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('삭제 실패');
            }
            */

            // 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 300));

            alert(`${filename}이(가) 삭제되었습니다.`);
            row.remove();

        } catch (error) {
            console.error('Delete error:', error);
            alert('파일 삭제 중 오류가 발생했습니다.');
        }
    }

    async refreshFileList() {
        // 실제로는 서버에서 파일 목록을 가져와서 테이블을 업데이트
        console.log('파일 목록을 새로고침합니다.');

        // 예시: 새로운 파일 행 추가
        const tableBody = document.getElementById('fileTableBody');
        if (tableBody && this.selectedFiles.length > 0) {
            this.selectedFiles.forEach(file => {
                const row = this.createFileRow(file);
                tableBody.appendChild(row);
            });
        }
    }

    createFileRow(file) {
        const row = document.createElement('tr');
        const fileType = file.name.split('.').pop().toUpperCase();
        const fileSize = this.formatFileSize(file.size);
        const currentDate = new Date().toISOString().split('T')[0];

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <input type="checkbox" class="file-checkbox rounded">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <i class="fas ${this.getFileIcon(fileType)} mr-3"></i>
                    <span class="text-sm text-gray-900">${file.name}</span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fileSize}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fileType}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${currentDate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-download"></i>
                </button>
                <button class="text-green-600 hover:text-green-900 mr-3">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        return row;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getFileIcon(fileType) {
        const iconMap = {
            'PDF': 'fa-file-pdf text-red-500',
            'DOC': 'fa-file-word text-blue-500',
            'DOCX': 'fa-file-word text-blue-500',
            'XLS': 'fa-file-excel text-green-500',
            'XLSX': 'fa-file-excel text-green-500',
            'PPT': 'fa-file-powerpoint text-orange-500',
            'PPTX': 'fa-file-powerpoint text-orange-500',
            'JPG': 'fa-file-image text-green-500',
            'JPEG': 'fa-file-image text-green-500',
            'PNG': 'fa-file-image text-green-500',
            'GIF': 'fa-file-image text-green-500',
            'TXT': 'fa-file-alt text-gray-500',
            'MD': 'fa-file-alt text-gray-500',
            'ZIP': 'fa-file-archive text-yellow-500',
            'RAR': 'fa-file-archive text-yellow-500'
        };

        return iconMap[fileType] || 'fa-file text-gray-500';
    }
}

// DOM이 로드되면 ThisFileManager 초기화
document.addEventListener('DOMContentLoaded', () => {
    new ThisFileManager();
});
