import { showToast } from './utils/toast.js';

// 회원 등록/수정 폼 JavaScript

// 전역 변수
let isEditMode = false;
let currentMemberId = null;
let profileImageFile = null;

// URL 파라미터에서 회원 ID 확인 (수정 모드인지 확인)
function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const memberId = urlParams.get('id');

    if (memberId) {
        isEditMode = true;
        currentMemberId = parseInt(memberId);
        switchToEditMode();
        loadMemberData(currentMemberId);
    }
}

// 수정 모드로 전환
function switchToEditMode() {
    // 페이지 제목 변경
    document.getElementById('pageTitle').textContent = '회원 정보 수정';
    document.getElementById('formTitle').textContent = '회원 정보 수정';
    document.querySelector('#formTitle').nextElementSibling.textContent = '회원 정보를 수정하세요.';

    // 버튼 텍스트 변경
    document.getElementById('submitBtnText').textContent = '수정하기';

    // 비밀번호 필드 숨기기
    document.getElementById('passwordField').classList.add('hidden');
    document.getElementById('confirmPasswordField').classList.add('hidden');

    // 비밀번호 재설정 버튼 표시
    document.getElementById('resetPasswordBtn').classList.remove('hidden');

    // 비밀번호 필드 required 제거
    document.getElementById('password').removeAttribute('required');
    document.getElementById('confirmPassword').removeAttribute('required');
}

// 회원 데이터 로드 (수정 모드용)
function loadMemberData(memberId) {
    // 실제로는 API에서 데이터를 가져옴
    // 여기서는 샘플 데이터 사용
    const sampleMember = {
        1: {
            name: '김철수',
            email: 'kim@example.com',
            phone: '010-1234-5678',
            birthDate: '1990-01-15',
            gender: 'male',
            zipCode: '12345',
            address: '서울시 강남구 테헤란로 123',
            detailAddress: '456호',
            role: 'user',
            status: 'active',
            emailVerified: true,
            marketingConsent: true,
            smsConsent: false,
            memo: '우수 회원입니다.'
        }
    };

    const memberData = sampleMember[memberId];
    if (memberData) {
        fillFormWithData(memberData);
    }
}

// 폼에 데이터 채우기
function fillFormWithData(data) {
    document.getElementById('name').value = data.name || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('birthDate').value = data.birthDate || '';
    document.getElementById('zipCode').value = data.zipCode || '';
    document.getElementById('address').value = data.address || '';
    document.getElementById('detailAddress').value = data.detailAddress || '';
    document.getElementById('role').value = data.role || '';
    document.getElementById('status').value = data.status || '';
    document.getElementById('memo').value = data.memo || '';

    // 라디오 버튼
    if (data.gender) {
        const genderRadio = document.querySelector(`input[name="gender"][value="${data.gender}"]`);
        if (genderRadio) genderRadio.checked = true;
    }

    // 체크박스
    document.getElementById('emailVerified').checked = data.emailVerified || false;
    document.getElementById('marketingConsent').checked = data.marketingConsent || false;
    document.getElementById('smsConsent').checked = data.smsConsent || false;

    // 프로필 미리보기 업데이트
    updateProfilePreview(data.name);
}

// 프로필 미리보기 업데이트
function updateProfilePreview(name) {
    const preview = document.getElementById('profilePreview');
    if (name) {
        const firstChar = name.charAt(0);
        preview.innerHTML = `<span class="text-2xl font-medium text-white">${firstChar}</span>`;
        preview.className = 'w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg';
    }
}

// 프로필 이미지 업로드
function initProfileImageUpload() {
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const profileImageInput = document.getElementById('profileImageInput');
    const profilePreview = document.getElementById('profilePreview');

    changePhotoBtn.addEventListener('click', () => {
        profileImageInput.click();
    });

    profileImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // 파일 크기 체크 (5MB 제한)
            if (file.size > 5 * 1024 * 1024) {
                showToast('파일 크기는 5MB를 초과할 수 없습니다.', 'error');
                return;
            }

            // 이미지 파일 체크
            if (!file.type.startsWith('image/')) {
                showToast('이미지 파일만 업로드 가능합니다.', 'error');
                return;
            }

            profileImageFile = file;

            // 미리보기 생성
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePreview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover rounded-full">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

// 전화번호 자동 포맷팅
function initPhoneFormatting() {
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // 숫자만 추출

        if (value.length >= 11) {
            value = value.substring(0, 11); // 최대 11자리
        }

        // 010-0000-0000 형식으로 포맷팅
        if (value.length >= 7) {
            value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d+)/, '$1-$2');
        }

        e.target.value = value;
    });
}

// 비밀번호 표시/숨김 토글
function initPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('passwordToggleIcon');

    if (toggleBtn && passwordInput && toggleIcon) {
        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            if (type === 'text') {
                toggleIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                `;
            } else {
                toggleIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                `;
            }
        });
    }
}

// 주소 검색 (예시)
function initAddressSearch() {
    const searchBtn = document.getElementById('searchAddressBtn');
    searchBtn.addEventListener('click', () => {
        // 실제로는 다음 우편번호 서비스 등을 사용
        showToast('주소 검색 기능은 준비 중입니다.', 'info');

        // 예시 데이터로 채우기
        document.getElementById('zipCode').value = '12345';
        document.getElementById('address').value = '서울시 강남구 테헤란로 123';
        document.getElementById('detailAddress').focus();
    });
}

// 폼 유효성 검사
function validateForm() {
    let isValid = true;

    // 이름 검사
    const name = document.getElementById('name').value.trim();
    const nameError = document.getElementById('nameError');
    if (!name) {
        showFieldError('name', nameError, '이름을 입력해주세요.');
        isValid = false;
    } else {
        hideFieldError('name', nameError);
    }

    // 이메일 검사
    const email = document.getElementById('email').value.trim();
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showFieldError('email', emailError, '이메일을 입력해주세요.');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showFieldError('email', emailError, '올바른 이메일 형식을 입력해주세요.');
        isValid = false;
    } else {
        hideFieldError('email', emailError);
    }

    // 전화번호 검사
    const phone = document.getElementById('phone').value.trim();
    const phoneError = document.getElementById('phoneError');
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phone) {
        showFieldError('phone', phoneError, '전화번호를 입력해주세요.');
        isValid = false;
    } else if (!phoneRegex.test(phone)) {
        showFieldError('phone', phoneError, '올바른 전화번호 형식을 입력해주세요. (010-0000-0000)');
        isValid = false;
    } else {
        hideFieldError('phone', phoneError);
    }

    // 역할 검사
    const role = document.getElementById('role').value;
    const roleError = document.getElementById('roleError');
    if (!role) {
        showFieldError('role', roleError, '역할을 선택해주세요.');
        isValid = false;
    } else {
        hideFieldError('role', roleError);
    }

    // 비밀번호 검사 (신규 등록 시에만)
    if (!isEditMode) {
        const password = document.getElementById('password').value;
        const passwordError = document.getElementById('passwordError');
        if (!password || password.length < 8) {
            showFieldError('password', passwordError, '비밀번호는 8자 이상 입력해주세요.');
            isValid = false;
        } else {
            hideFieldError('password', passwordError);
        }

        // 비밀번호 확인
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        if (password !== confirmPassword) {
            showFieldError('confirmPassword', confirmPasswordError, '비밀번호가 일치하지 않습니다.');
            isValid = false;
        } else {
            hideFieldError('confirmPassword', confirmPasswordError);
        }
    }

    return isValid;
}

// 필드 에러 표시
function showFieldError(fieldId, errorElement, message) {
    document.getElementById(fieldId).classList.add('border-red-500');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

// 필드 에러 숨김
function hideFieldError(fieldId, errorElement) {
    document.getElementById(fieldId).classList.remove('border-red-500');
    errorElement.classList.add('hidden');
}

// 폼 제출
function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    // 로딩 상태 표시
    const submitBtn = document.getElementById('submitBtn');
    const originalText = document.getElementById('submitBtnText').textContent;

    submitBtn.disabled = true;
    document.getElementById('submitBtnText').textContent = '처리 중...';

    // 폼 데이터 수집
    const formData = collectFormData();

    // 시뮬레이션: 2초 후 성공
    setTimeout(() => {
        submitBtn.disabled = false;
        document.getElementById('submitBtnText').textContent = originalText;

        // 성공 모달 표시
        showSuccessModal(isEditMode ? '수정' : '등록');
    }, 2000);
}

// 폼 데이터 수집
function collectFormData() {
    const formData = new FormData();

    // 기본 정보
    formData.append('name', document.getElementById('name').value.trim());
    formData.append('email', document.getElementById('email').value.trim());
    formData.append('phone', document.getElementById('phone').value.trim());
    formData.append('birthDate', document.getElementById('birthDate').value);
    formData.append('zipCode', document.getElementById('zipCode').value);
    formData.append('address', document.getElementById('address').value);
    formData.append('detailAddress', document.getElementById('detailAddress').value.trim());

    // 성별
    const gender = document.querySelector('input[name="gender"]:checked');
    if (gender) formData.append('gender', gender.value);

    // 계정 정보
    formData.append('role', document.getElementById('role').value);
    formData.append('status', document.getElementById('status').value);

    // 비밀번호 (신규 등록 시에만)
    if (!isEditMode) {
        formData.append('password', document.getElementById('password').value);
    }

    // 체크박스
    formData.append('emailVerified', document.getElementById('emailVerified').checked);
    formData.append('marketingConsent', document.getElementById('marketingConsent').checked);
    formData.append('smsConsent', document.getElementById('smsConsent').checked);

    // 메모
    formData.append('memo', document.getElementById('memo').value.trim());

    // 프로필 이미지
    if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
    }

    return formData;
}

// 성공 모달 표시
function showSuccessModal(action) {
    const modal = document.getElementById('successModal');
    const title = document.getElementById('successTitle');
    const message = document.getElementById('successMessage');

    title.textContent = `${action} 완료`;
    message.textContent = `회원이 성공적으로 ${action}되었습니다.`;

    modal.classList.remove('hidden');
}

// 이메일 인증 발송
function initEmailVerification() {
    const sendBtn = document.getElementById('sendVerificationBtn');
    sendBtn.addEventListener('click', () => {
        const email = document.getElementById('email').value.trim();
        if (!email) {
            showToast('먼저 이메일을 입력해주세요.', 'error');
            return;
        }

        showToast('인증 이메일을 발송했습니다.', 'success');
    });
}

// 비밀번호 재설정
function initPasswordReset() {
    const resetBtn = document.getElementById('resetPasswordBtn');
    resetBtn.addEventListener('click', () => {
        if (confirm('비밀번호 재설정 이메일을 발송하시겠습니까?')) {
            showToast('비밀번호 재설정 이메일을 발송했습니다.', 'success');
        }
    });
}

// 이름 입력 시 프로필 미리보기 업데이트
function initNamePreview() {
    const nameInput = document.getElementById('name');
    nameInput.addEventListener('input', (e) => {
        updateProfilePreview(e.target.value);
    });
}

// 모달 이벤트 초기화
function initModals() {
    const successOkBtn = document.getElementById('successOkBtn');
    successOkBtn.addEventListener('click', () => {
        document.getElementById('successModal').classList.add('hidden');
        // 회원 목록으로 이동
        window.location.href = 'members-list.html';
    });

    // 모달 외부 클릭 시 닫기
    document.getElementById('successModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            e.currentTarget.classList.add('hidden');
        }
    });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('회원 폼 페이지가 로드되었습니다.');

    checkEditMode();
    initProfileImageUpload();
    initPhoneFormatting();
    initPasswordToggle();
    initAddressSearch();
    initEmailVerification();
    initPasswordReset();
    initNamePreview();
    initModals();

    // 폼 제출 이벤트
    document.getElementById('memberForm').addEventListener('submit', handleFormSubmit);
});
