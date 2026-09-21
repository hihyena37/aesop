$(function () {

  //////////  헤더 스크롤 //////////
  const header = $('header');
  let lastScroll = Math.max(0, $(window).scrollTop());

  // 새로고침했을 때도 현재 스크롤 위치 반영
  header.toggleClass('scrolled', lastScroll > 130);

  $(window).on('scroll', function () {
    const currentScroll = Math.max(0, $(window).scrollTop());

    if (currentScroll <= 130) {
      // 페이지 위쪽: 원래 두 줄 헤더
      header.removeClass('scrolled hide');
    } else {
      // 본문: 한 줄 헤더
      header.addClass('scrolled');

      if (currentScroll > lastScroll) {
        // 아래로 스크롤하면 숨기기
        header.addClass('hide');
      } else if (currentScroll < lastScroll) {
        // 위로 스크롤하면 보이기
        header.removeClass('hide');
      }
    }

    // 다음 스크롤에서 방향을 비교하기 위해 저장
    lastScroll = currentScroll;
  });






  ////////// 히어로 슬라이드 //////////
  let heroIndex = 0;

  const heroSlides = $('.hero-slide');
  const heroTotal = heroSlides.length;
  const heroVideo = $('.hero-video').get(0);

  function moveHero() {
    // 0번이면 0%, 1번이면 -100% 이동
    $('.hero-track').css(
      'transform',
      `translateX(-${heroIndex * 100}%)`
    );

    // 현재 슬라이드에 해당하는 막대 활성화
    $('.hero-bar').each(function (i) {
      const isActive = i === heroIndex;

      $(this)
        .toggleClass('active', isActive)
        .attr('aria-current', String(isActive));
    });

    // 숨겨진 슬라이드는 키보드로 선택되지 않도록 처리
    heroSlides.each(function (i) {
      const isActive = i === heroIndex;

      $(this).attr('aria-hidden', String(!isActive));
      this.inert = !isActive;
    });

    // 이미지 슬라이드에서는 영상 일시정지
    if (heroVideo) {
      if (heroIndex === 0) {
        heroVideo.play().catch(function () {
          // 브라우저에서 자동 재생을 차단하는 경우
        });
      } else {
        heroVideo.pause();
      }
    }
  }

  // 다음: 마지막 슬라이드에서는 첫 번째로
  $('.hero-next').on('click', function () {
    heroIndex = (heroIndex + 1) % heroTotal;
    moveHero();
  });

  // 이전: 첫 번째 슬라이드에서는 마지막으로
  $('.hero-prev').on('click', function () {
    heroIndex = (heroIndex - 1 + heroTotal) % heroTotal;
    moveHero();
  });

  // 막대를 클릭하면 해당 슬라이드로 이동
  $('.hero-bar').on('click', function () {
    heroIndex = $('.hero-bar').index(this);
    moveHero();
  });


  // 재생 / 일시정지 버튼
  $('.hero-play-btn').click(function () {
    if (heroVideo.paused) {
      // 멈춰 있으면 재생
      heroVideo.play().catch(function () { });
    } else {
      // 재생 중이면 일시정지
      heroVideo.pause();
    }
  });

  // 음소거 버튼
  $('.hero-sound-btn').click(function () {
    // 현재 음소거 상태를 반대로 변경
    heroVideo.muted = !heroVideo.muted;
  });

  // 영상 상태에 맞춰 아이콘 변경
  function updateVideoButtons() {
    // 멈췄으면 재생 아이콘, 재생 중이면 일시정지 아이콘
    if (heroVideo.paused) {
      $('.hero-play-btn i').attr('class', 'bi bi-play-fill');
      $('.hero-play-btn').attr('aria-label', '영상 재생');
    } else {
      $('.hero-play-btn i').attr('class', 'bi bi-pause-fill');
      $('.hero-play-btn').attr('aria-label', '영상 일시정지');
    }

    // 음소거 여부에 따라 스피커 아이콘 변경
    if (heroVideo.muted) {
      $('.hero-sound-btn i').attr('class', 'bi bi-volume-mute-fill');
      $('.hero-sound-btn').attr('aria-label', '음소거 해제');
    } else {
      $('.hero-sound-btn i').attr('class', 'bi bi-volume-up-fill');
      $('.hero-sound-btn').attr('aria-label', '음소거');
    }
  }

  // 재생·일시정지·음량 상태가 바뀔 때 아이콘 갱신
  $(heroVideo).on('play pause volumechange', updateVideoButtons);

  // 처음 로딩했을 때도 현재 상태 반영
  updateVideoButtons();

  moveHero();




  ////////// 카드슬라이드 //////////
  let cardIndex = 0;

  const $view = $('.view');
  const $allcard = $('.allcard');
  const $cards = $('.card');
  const $prev = $('.arrow-left');
  const $next = $('.arrow-right');
  const $bars = $('.card-bar');

  const gap = 20;

  let startX = 0;
  let dragX = 0;
  let isDragging = false;


  /* 현재 반응형인지 확인 */
  function isResponsive() {
    return window.innerWidth <= 1023;
  }


  /* 현재 카드 실제 너비 */
  function getCardWidth() {
    return $cards.eq(0).outerWidth();
  }


  /* 마지막으로 이동 가능한 위치 */
  function getMaxIndex() {
    // 1024 이하: 2개씩 보이므로
    // 1+2 / 2+3 / 3+4 / 4+5 = 4단계
    if (isResponsive()) {
      return 3;
    }

    // PC: 기존처럼 3개씩
    return 2;
  }


  /* 슬라이드 이동 */
  function slideCard() {
    const move = getCardWidth() + gap;
    const maxIndex = getMaxIndex();

    // 화면 크기가 바뀌어서 index가 범위를 벗어난 경우
    if (cardIndex > maxIndex) {
      cardIndex = maxIndex;
    }

    $allcard.css({
      transition: 'transform 0.3s ease',
      transform: `translateX(-${cardIndex * move}px)`
    });

    // 화살표 상태
    $prev.prop('disabled', cardIndex === 0);
    $next.prop('disabled', cardIndex === maxIndex);

    // 1024 이하 막대 상태
    $bars.each(function (i) {
      $(this).toggleClass('active', i === cardIndex);
    });
  }


  /* 다음 버튼 */
  $next.on('click', function () {
    const maxIndex = getMaxIndex();

    if (cardIndex < maxIndex) {
      cardIndex++;
      slideCard();
    }
  });


  /* 이전 버튼 */
  $prev.on('click', function () {
    if (cardIndex > 0) {
      cardIndex--;
      slideCard();
    }
  });


  /* 막대 버튼 */
  $bars.on('click', function () {
    // 막대는 1024 이하에서만 사용
    if (!isResponsive()) return;

    cardIndex = $bars.index(this);
    slideCard();
  });


  /* 드래그 시작 */
  $view.on('mousedown', function (e) {
    isDragging = true;

    startX = e.pageX;
    dragX = 0;

    $allcard.css('transition', 'none');
  });


  /* 드래그 중 */
  $(document).on('mousemove', function (e) {
    if (!isDragging) return;

    dragX = e.pageX - startX;

    const move = getCardWidth() + gap;
    const baseX = -(cardIndex * move);

    $allcard.css(
      'transform',
      `translateX(${baseX + dragX}px)`
    );
  });


  /* 드래그 끝 */
  $(document).on('mouseup', function () {
    if (!isDragging) return;

    const maxIndex = getMaxIndex();

    // 왼쪽으로 드래그 = 다음
    if (dragX < -80 && cardIndex < maxIndex) {
      cardIndex++;
    }

    // 오른쪽으로 드래그 = 이전
    else if (dragX > 80 && cardIndex > 0) {
      cardIndex--;
    }

    isDragging = false;
    dragX = 0;

    // 정확한 카드 위치로 스냅
    slideCard();
  });


  /* 화면 크기가 바뀌었을 때 다시 계산 */
  $(window).on('resize', function () {
    slideCard();
  });


  /* 최초 실행 */
  slideCard();


  ////////// 시그니처 영상 버튼 //////////
  const signatureVideo = $('.signature-video').get(0);

  // 재생 / 일시정지
  $('.signature-play-btn').click(function () {
    if (signatureVideo.paused) {
      signatureVideo.play().catch(function () { });
    } else {
      signatureVideo.pause();
    }
  });

  // 소리 켜기 / 음소거
  $('.signature-sound-btn').click(function () {
    signatureVideo.muted = !signatureVideo.muted;
  });

  // 실제 영상 상태에 맞춰 아이콘 변경
  function updateSignatureButtons() {
    if (signatureVideo.paused) {
      $('.signature-play-btn i').attr('class', 'bi bi-play-fill');
      $('.signature-play-btn').attr('aria-label', '영상 재생');
    } else {
      $('.signature-play-btn i').attr('class', 'bi bi-pause-fill');
      $('.signature-play-btn').attr('aria-label', '영상 일시정지');
    }

    if (signatureVideo.muted) {
      $('.signature-sound-btn i').attr('class', 'bi bi-volume-mute-fill');
      $('.signature-sound-btn').attr('aria-label', '음소거 해제');
    } else {
      $('.signature-sound-btn i').attr('class', 'bi bi-volume-up-fill');
      $('.signature-sound-btn').attr('aria-label', '음소거');
    }
  }

  // 영상 상태가 바뀌면 아이콘도 변경
  $(signatureVideo).on(
    'play pause volumechange',
    updateSignatureButtons
  );

  // 처음 버튼 상태 반영
  updateSignatureButtons();





  // 종료
})