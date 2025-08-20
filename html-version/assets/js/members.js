// 회원 관리 페이지 JavaScript

import { showToast } from './utils/toast.js';

// 샘플 회원 데이터
const sampleMembers = [
    {
        id: 1,
        name: '김철수',
        phone: '010-1234-5678',
        email: 'kim@example.com',
        role: '일반회원',
        status: '활성',
        joinDate: '2024-01-15',
        emailVerified: true,
        avatar: '김'
    },
    {
        id: 2,
        name: '이영희',
        phone: '010-9876-5432',
        email: 'lee@example.com',
        role: '관리자',
        status: '활성',
        joinDate: '2024-01-10',
        emailVerified: true,
        avatar: '이'
    },
    {
        id: 3,
        name: '박민수',
        phone: '010-5555-1234',
        email: 'park@example.com',
        role: '일반회원',
        status: '비활성',
        joinDate: '2024-01-05',
        emailVerified: false,
        avatar: '박'
    }
];

// 전역 변수
let currentMembers = [...sampleMembers];
let selectedMemberId = null;

// 검색 기능
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            if (searchTerm === '') {
                currentMembers = [...sampleMembers];
            } else {
                currentMembers = sampleMembers.filter(member =>
                    member.name.toLowerCase().includes(searchTerm) ||
                    member.email.toLowerCase().includes(searchTerm) ||
                    member.phone.includes(searchTerm)
                );
            }

            renderMembersTable();
        });
    }
}

// 체크박스 전체 선택/해제
function initCheckboxes() {
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const memberCheckboxes = document.querySelectorAll('.member-checkbox');
            memberCheckboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
        });
    }
}

// 회원 테이블 렌더링
function renderMembersTable() {
    const tbody = document.getElementById('membersTableBody');
    if (!tbody) return;

    if (currentMembers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                    검색 결과가 없습니다.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = currentMembers.map(member => `
        <tr class="hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4">
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 member-checkbox" value="${member.id}">
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div class="w-10 h-10 ${getAvatarColor(member.avatar)} rounded-full flex items-center justify-center">
                        <span class="text-sm font-medium text-white">${member.avatar}</span>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${member.name}</div>
                        <div class="text-sm text-gray-500">${member.phone}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-900">${member.email}</div>
                <div class="text-sm ${member.emailVerified ? 'text-gray-500' : 'text-gray-400'}">
                    ${member.emailVerified ? '이메일 인증됨' : '이메일 미인증'}
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(member.role)}">
                    ${member.role}
                </span>
            </td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(member.status)}">
                    ${member.status}
                </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
                ${member.joinDate}
            </td>
            <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-2">
                    <button class="text-blue-600 hover:text-blue-800 transition-colors" title="상세보기" data-member-view="${member.id}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                    </button>
                    <button class="text-green-600 hover:text-green-800 transition-colors" title="수정" data-member-edit="${member.id}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="text-red-600 hover:text-red-800 transition-colors" title="삭제" data-member-delete="${member.id}">
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

// 아바타 색상 클래스 반환
function getAvatarColor(avatar) {
    const colors = {
        '김': 'bg-blue-500',
        '이': 'bg-green-500',
        '박': 'bg-gray-400',
        '최': 'bg-purple-500',
        '정': 'bg-red-500',
        '강': 'bg-yellow-500'
    };
    return colors[avatar] || 'bg-gray-500';
}

// 역할 배지 클래스 반환
function getRoleBadgeClass(role) {
    switch (role) {
        case '관리자':
            return 'bg-purple-100 text-purple-800';
        case '일반회원':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

// 상태 배지 클래스 반환
function getStatusBadgeClass(status) {
    switch (status) {
        case '활성':
            return 'bg-green-100 text-green-800';
        case '비활성':
            return 'bg-red-100 text-red-800';
        case '정지':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

// 액션 버튼 이벤트 바인딩
function bindActionButtons() {
    // 상세보기 버튼
    document.querySelectorAll('[data-member-view]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const memberId = parseInt(e.currentTarget.getAttribute('data-member-view'));
            showMemberDetail(memberId);
        });
    });

    // 수정 버튼
    document.querySelectorAll('[data-member-edit]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const memberId = parseInt(e.currentTarget.getAttribute('data-member-edit'));
            editMember(memberId);
        });
    });

    // 삭제 버튼
    document.querySelectorAll('[data-member-delete]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const memberId = parseInt(e.currentTarget.getAttribute('data-member-delete'));
            showDeleteConfirm(memberId);
        });
    });
}

// 회원 상세보기
function showMemberDetail(memberId) {
    const member = sampleMembers.find(m => m.id === memberId);
    if (!member) return;

    const modal = document.getElementById('memberViewModal');
    const content = document.getElementById('memberViewContent');

    content.innerHTML = `
        <div class="space-y-4">
            <div class="flex items-center space-x-4">
                <div class="w-16 h-16 ${getAvatarColor(member.avatar)} rounded-full flex items-center justify-center">
                    <span class="text-xl font-medium text-white">${member.avatar}</span>
                </div>
                <div>
                    <h4 class="text-xl font-semibold text-gray-900">${member.name}</h4>
                    <p class="text-gray-600">${member.email}</p>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="font-medium text-gray-500">전화번호:</span>
                    <p class="text-gray-900">${member.phone}</p>
                </div>
                <div>
                    <span class="font-medium text-gray-500">역할:</span>
                    <p class="text-gray-900">${member.role}</p>
                </div>
                <div>
                    <span class="font-medium text-gray-500">상태:</span>
                    <p class="text-gray-900">${member.status}</p>
                </div>
                <div>
                    <span class="font-medium text-gray-500">가입일:</span>
                    <p class="text-gray-900">${member.joinDate}</p>
                </div>
                <div>
                    <span class="font-medium text-gray-500">이메일 인증:</span>
                    <p class="text-gray-900">${member.emailVerified ? '인증됨' : '미인증'}</p>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

// 회원 수정 (예시)
function editMember(memberId) {
    alert(`회원 수정 기능 - ID: ${memberId}\n(실제로는 수정 폼 페이지로 이동)`);
}

// 삭제 확인 모달
function showDeleteConfirm(memberId) {
    selectedMemberId = memberId;
    const member = sampleMembers.find(m => m.id === memberId);

    const modal = document.getElementById('confirmModal');
    const title = document.getElementById('confirmTitle');
    const message = document.getElementById('confirmMessage');

    title.textContent = '회원 삭제';
    message.textContent = `정말로 "${member.name}" 회원을 삭제하시겠습니까?`;

    modal.classList.remove('hidden');
}

// 회원 삭제 실행
function deleteMember() {
    if (selectedMemberId) {
        // 실제로는 서버 API 호출
        const index = sampleMembers.findIndex(m => m.id === selectedMemberId);
        if (index > -1) {
            sampleMembers.splice(index, 1);
            currentMembers = [...sampleMembers];
            renderMembersTable();
        }

        document.getElementById('confirmModal').classList.add('hidden');
        selectedMemberId = null;

        // 성공 메시지 표시 (간단한 알림)
        showToast('회원이 성공적으로 삭제되었습니다.', 'success');
    }
}

// 모달 닫기 이벤트
function initModals() {
    // 상세보기 모달 닫기
    const closeViewModal = document.getElementById('closeViewModal');
    if (closeViewModal) {
        closeViewModal.addEventListener('click', () => {
            document.getElementById('memberViewModal').classList.add('hidden');
        });
    }

    // 확인 모달 버튼들
    const confirmBtn = document.getElementById('confirmBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', deleteMember);
    }

    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('confirmModal').classList.add('hidden');
            selectedMemberId = null;
        });
    }

    // 모달 외부 클릭시 닫기
    document.getElementById('memberViewModal')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            e.currentTarget.classList.add('hidden');
        }
    });

    document.getElementById('confirmModal')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            e.currentTarget.classList.add('hidden');
        }
    });
}

// 새 회원 추가 버튼
function initAddMemberButton() {
    const addMemberBtn = document.getElementById('addMemberBtn');
    if (addMemberBtn) {
        addMemberBtn.addEventListener('click', () => {
            alert('새 회원 추가 기능\n(실제로는 회원 등록 폼 페이지로 이동)');
        });
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('회원 관리 페이지가 로드되었습니다.');

    initSearch();
    initCheckboxes();
    initModals();
    initAddMemberButton();
    renderMembersTable();
});
