
// 사이드바 토글 기능 (모바일)
function initSidebar() {
  const toggleBtn = document.querySelector('[data-sidebar-toggle]');
  const closeBtn = document.querySelector('[data-sidebar-close]');
  const sidebar = document.querySelector('[data-sidebar]');
  const overlay = document.querySelector('[data-sidebar-overlay]');

  // 사이드바 열기
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.remove('-translate-x-full');
      if (overlay) overlay.classList.remove('hidden');
    });
  }

  // 사이드바 닫기
  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
      if (overlay) overlay.classList.add('hidden');
    });
  }

  // 오버레이 클릭시 사이드바 닫기
  if (overlay && sidebar) {
    overlay.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    });
  }
}

// 간단한 테스트 함수
function testJavaScript() {
  console.log('JavaScript가 정상적으로 로드되었습니다!');

  // 클릭 테스트
  document.body.addEventListener('click', (e) => {
    console.log('클릭된 요소:', e.target);
  });
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM이 로드되었습니다.');
  testJavaScript();
  initSidebar();
});

// 추가: 윈도우 로드 완료 시에도 실행
window.addEventListener('load', () => {
  console.log('모든 리소스가 로드되었습니다.');
});
