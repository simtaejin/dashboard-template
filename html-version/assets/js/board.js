// 게시판 관리 페이지 JavaScript

import { showToast } from './utils/toast.js';

// 샘플 게시글 데이터
const samplePosts = [
    {
        id: 1,
        title: '시스템 점검 안내 (2024.01.20)',
        category: 'notice',
        author: '관리자',
        authorEmail: 'admin@example.com',
        views: 1234,
        date: '2024-01-19',
        status: 'published',
        isNotice: true,
        comments: 0,
        likes: 0,
        content: '점검 시간: 01:00 ~ 06:00'
    },
    {
        id: 2,
        title: '새로운 기능에 대한 제안',
        category: 'free',
        author: '김철수',
        authorEmail: 'kim@example.com',
        views: 328,
        date: '2024-01-18',
        status: 'published',
        isNotice: false,
        comments: 12,
        likes: 45,
        content: ''
    },
    {
        id: 3,
        title: '회원가입 오류 문의 (임시저장)',
        category: 'qna',
        author: '이영희',
        authorEmail: 'lee@example.com',
        views: 0,
        date: '2024-01-17',
        status: 'draft',
        isNotice: false,
        comments: 0,
        likes: 0,
        content: ''
    }
];

// 전역 변수
let currentPosts = [...samplePosts];
let selectedPostIds = [];

// 검색 기능
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterPosts();
        });
    }
}

// 필터링 기능
function initFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterPosts);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', filterPosts);
    }
}

// 게시글 필터링
function filterPosts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    currentPosts = samplePosts.filter(post => {
        // 검색어 필터
        const matchesSearch = !searchTerm ||
            post.title.toLowerCase().includes(searchTerm) ||
            post.author.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm);

        // 카테고리 필터
        const matchesCategory = !categoryFilter || post.category === categoryFilter;

        // 상태 필터
        const matchesStatus = !statusFilter || post.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    renderPostsTable();
    updateTotalCount();
}

// 게시글 테이블 렌더링
function renderPostsTable() {
    const tbody = document.getElementById('postsTableBody');
    if (!tbody) return;

    if (currentPosts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="px-6 py-8 text-center text-gray-500">
                    검색 결과가 없습니다.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = currentPosts.map(post => `
        <tr class="hover:bg-gray-50/50 transition-colors ${post.isNotice ? 'bg-blue-50/30' : ''} ${post.status === 'draft' ? 'opacity-60' : ''}">
            <td class="px-6 py-4">
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 post-checkbox" value="${post.id}">
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center">
                    ${post.isNotice ? `
                        <svg class="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                        </svg>
                    ` : ''}
                    <span class="text-sm font-medium text-gray-900">${post.id}</span>
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClass(post.category)}">
                    ${getCategoryName(post.category)}
                </span>
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <a href="board-view.html?id=${post.id}" class="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                        ${post.title}
                    </a>
                    ${post.status === 'published' && isNewPost(post.date) ? `
                        <span class="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-600">
                            NEW
                        </span>
                    ` : ''}
                </div>
                ${post.content ? `<div class="text-xs text-gray-500 mt-1">${post.content}</div>` : ''}
                ${post.comments > 0 || post.likes > 0 ? `
                    <div class="flex items-center mt-1 space-x-3 text-xs text-gray-500">
                        <span>댓글 ${post.comments}</span>
                        <span>좋아요 ${post.likes}</span>
                    </div>
                ` : ''}
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div class="w-8 h-8 ${getAuthorAvatarColor(post.author)} rounded-full flex items-center justify-center">
                        <span class="text-xs font-medium text-white">${post.author.charAt(0)}</span>
                    </div>
                    <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">${post.author}</div>
                        <div class="text-xs text-gray-500">${post.authorEmail}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">${post.views.toLocaleString()}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${post.date}</td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(post.status)}">
                    ${getStatusName(post.status)}
                </span>
            </td>
            <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-2">
                    <button class="text-blue-600 hover:text-blue-800 transition-colors" title="상세보기" data-post-view="${post.id}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 616 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                    </button>
                    <button class="text-green-600 hover:text-green-800 transition-colors" title="수정" data-post-edit="${post.id}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="text-red-600 hover:text-red-800 transition-colors" title="삭제" data-post-delete="${post.id}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    // 액션 버튼 이벤트 바인딩
    bindActionButtons();
}

// 카테고리 이름 반환
function getCategoryName(category) {
    const categories = {
        'notice': '공지사항',
        'free': '자유게시판',
        'qna': '질문과답변',
        'event': '이벤트'
    };
    return categories[category] || category;
}

// 카테고리 배지 클래스 반환
function getCategoryBadgeClass(category) {
    switch (category) {
        case 'notice':
            return 'bg-red-100 text-red-800';
        case 'free':
            return 'bg-blue-100 text-blue-800';
        case 'qna':
            return 'bg-green-100 text-green-800';
        case 'event':
            return 'bg-purple-100 text-purple-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

// 상태 이름 반환
function getStatusName(status) {
    const statuses = {
        'published': '게시중',
        'draft': '임시저장',
        'hidden': '숨김',
        'deleted': '삭제'
    };
    return statuses[status] || status;
}

// 상태 배지 클래스 반환
function getStatusBadgeClass(status) {
    switch (status) {
        case 'published':
            return 'bg-green-100 text-green-800';
        case 'draft':
            return 'bg-yellow-100 text-yellow-800';
        case 'hidden':
            return 'bg-gray-100 text-gray-800';
        case 'deleted':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

// 작성자 아바타 색상 반환
function getAuthorAvatarColor(author) {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500', 'bg-yellow-500', 'bg-indigo-500'];
    const index = author.charCodeAt(0) % colors.length;
    return colors[index];
}

// 새 게시글 확인 (3일 이내)
function isNewPost(date) {
    const postDate = new Date(date);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return postDate > threeDaysAgo;
}

// 총 개수 업데이트
function updateTotalCount() {
    const totalCount = document.getElementById('totalCount');
    if (totalCount) {
        totalCount.textContent = currentPosts.length;
    }
}

// 체크박스 전체 선택/해제
function initCheckboxes() {
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const postCheckboxes = document.querySelectorAll('.post-checkbox');
            postCheckboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
            updateSelectedPosts();
        });
    }
}

// 선택된 게시글 업데이트
function updateSelectedPosts() {
    const checkboxes = document.querySelectorAll('.post-checkbox:checked');
    selectedPostIds = Array.from(checkboxes).map(cb => parseInt(cb.value));

    // 선택 삭제 버튼 상태 업데이트
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    if (bulkDeleteBtn) {
        bulkDeleteBtn.disabled = selectedPostIds.length === 0;
        bulkDeleteBtn.textContent = selectedPostIds.length > 0 ?
            `선택 삭제 (${selectedPostIds.length})` : '선택 삭제';
    }
}

// 액션 버튼 이벤트 바인딩
function bindActionButtons() {
    // 상세보기 버튼
    document.querySelectorAll('[data-post-view]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const postId = parseInt(e.currentTarget.getAttribute('data-post-view'));
            window.location.href = `board-view.html?id=${postId}`;
        });
    });

    // 수정 버튼
    document.querySelectorAll('[data-post-edit]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const postId = parseInt(e.currentTarget.getAttribute('data-post-edit'));
            window.location.href = `board-form.html?id=${postId}`;
        });
    });

    // 삭제 버튼
    document.querySelectorAll('[data-post-delete]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const postId = parseInt(e.currentTarget.getAttribute('data-post-delete'));
            showDeleteConfirm([postId]);
        });
    });

    // 개별 체크박스
    document.querySelectorAll('.post-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedPosts);
    });
}

// 삭제 확인 모달 표시
function showDeleteConfirm(postIds) {
    selectedPostIds = postIds;
    const modal = document.getElementById('confirmModal');
    const title = document.getElementById('confirmTitle');
    const message = document.getElementById('confirmMessage');

    if (postIds.length === 1) {
        const post = samplePosts.find(p => p.id === postIds[0]);
        title.textContent = '게시글 삭제';
        message.textContent = `"${post.title}" 게시글을 삭제하시겠습니까?`;
    } else {
        title.textContent = '게시글 삭제';
        message.textContent = `선택한 ${postIds.length}개의 게시글을 삭제하시겠습니까?`;
    }

    modal.classList.remove('hidden');
}

// 게시글 삭제 실행
function deletePosts() {
    selectedPostIds.forEach(id => {
        const index = samplePosts.findIndex(p => p.id === id);
        if (index > -1) {
            samplePosts.splice(index, 1);
        }
    });

    filterPosts();
    document.getElementById('confirmModal').classList.add('hidden');
    selectedPostIds = [];

    // 체크박스 상태 초기화
    document.getElementById('selectAll').checked = false;
    updateSelectedPosts();

    showToast('선택한 게시글이 삭제되었습니다.', 'success');
}

// 새 게시글 추가
function initAddPostButton() {
    const addPostBtn = document.getElementById('addPostBtn');
    if (addPostBtn) {
        addPostBtn.addEventListener('click', () => {
            window.location.href = 'board-form.html';
        });
    }
}

// 내보내기 기능
function initExportButton() {
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            showToast('엑셀 파일로 내보내기 기능은 준비 중입니다.', 'info');
        });
    }
}

// 대량 삭제
function initBulkDeleteButton() {
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    if (bulkDeleteBtn) {
        bulkDeleteBtn.addEventListener('click', () => {
            if (selectedPostIds.length > 0) {
                showDeleteConfirm(selectedPostIds);
            }
        });
    }
}

// 모달 이벤트 초기화
function initModals() {
    const confirmBtn = document.getElementById('confirmBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', deletePosts);
    }

    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('confirmModal').classList.add('hidden');
            selectedPostIds = [];
        });
    }

    // 모달 외부 클릭시 닫기
    document.getElementById('confirmModal')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            e.currentTarget.classList.add('hidden');
        }
    });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('게시판 관리 페이지가 로드되었습니다.');

    initSearch();
    initFilters();
    initCheckboxes();
    initAddPostButton();
    initExportButton();
    initBulkDeleteButton();
    initModals();

    // 초기 렌더링
    renderPostsTable();
    updateTotalCount();
});
