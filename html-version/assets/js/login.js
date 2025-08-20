// 비밀번호 표시/숨김 토글
function initPasswordToggle() {
  const toggleBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eyeIcon');

  if (toggleBtn && passwordInput && eyeIcon) {
    toggleBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);

      // 아이콘 변경
      if (type === 'text') {
        eyeIcon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
        `;
      } else {
        eyeIcon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        `;
      }
    });
  }
}

// 폼 유효성 검사
function validateForm() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  let isValid = true;

  // 이메일 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailError.classList.remove('hidden');
    document.getElementById('email').classList.add('border-red-500');
    isValid = false;
  } else {
    emailError.classList.add('hidden');
    document.getElementById('email').classList.remove('border-red-500');
  }

  // 비밀번호 검사
  if (password.length < 6) {
    passwordError.classList.remove('hidden');
    document.getElementById('password').classList.add('border-red-500');
    isValid = false;
  } else {
    passwordError.classList.add('hidden');
    document.getElementById('password').classList.remove('border-red-500');
  }

  return isValid;
}

// 알림 모달 표시
function showAlert(title, message, type = 'error') {
  const modal = document.getElementById('alertModal');
  const alertTitle = document.getElementById('alertTitle');
  const alertMessage = document.getElementById('alertMessage');
  const alertIcon = document.getElementById('alertIcon');

  alertTitle.textContent = title;
  alertMessage.textContent = message;

  // 타입에 따라 아이콘 색상 변경
  if (type === 'success') {
    alertIcon.className = 'mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100';
    alertIcon.innerHTML = `
      <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
    `;
  } else {
    alertIcon.className = 'mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100';
    alertIcon.innerHTML = `
      <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    `;
  }

  modal.classList.remove('hidden');
}

// 알림 모달 닫기
function closeAlert() {
  const modal = document.getElementById('alertModal');
  modal.classList.add('hidden');
}

// 로그인 처리 (데모용)
function handleLogin(email, password) {
  // 로딩 상태 표시
  const loginButton = document.getElementById('loginButton');
  const loginButtonText = document.getElementById('loginButtonText');
  const loadingSpinner = document.getElementById('loadingSpinner');

  loginButton.disabled = true;
  loginButtonText.textContent = '로그인 중...';
  loadingSpinner.classList.remove('hidden');

  // 시뮬레이션: 2초 후 로그인 결과
  setTimeout(() => {
    // 데모 계정 확인
    if (email === 'admin@example.com' && password === 'password123') {
      showAlert('로그인 성공', '대시보드로 이동합니다.', 'success');

      // 2초 후 대시보드로 이동
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 2000);
    } else {
      showAlert('로그인 실패', '이메일 또는 비밀번호가 올바르지 않습니다.');

      // 버튼 상태 복원
      loginButton.disabled = false;
      loginButtonText.textContent = '로그인';
      loadingSpinner.classList.add('hidden');
    }
  }, 2000);
}

// 폼 제출 이벤트 처리
function initLoginForm() {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (validateForm()) {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        handleLogin(email, password);
      }
    });
  }
}

// 기타 링크들 처리
function initLinks() {
  // 비밀번호 찾기
  const forgotPassword = document.getElementById('forgotPassword');
  if (forgotPassword) {
    forgotPassword.addEventListener('click', (e) => {
      e.preventDefault();
      showAlert('비밀번호 찾기', '비밀번호 찾기 기능은 준비 중입니다.');
    });
  }

  // 회원가입
  const signupLink = document.getElementById('signupLink');
  if (signupLink) {
    signupLink.addEventListener('click', (e) => {
      e.preventDefault();
      showAlert('회원가입', '회원가입 기능은 준비 중입니다.');
    });
  }

  // 알림 모달 닫기 버튼
  const alertCloseBtn = document.getElementById('alertCloseBtn');
  if (alertCloseBtn) {
    alertCloseBtn.addEventListener('click', closeAlert);
  }
}

// 페이지 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  console.log('로그인 페이지가 로드되었습니다.');
  initPasswordToggle();
  initLoginForm();
  initLinks();
});
