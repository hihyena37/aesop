$(function () {
  // 헤더 스크롤
  const $header = $('header');
  let lastScroll = Math.max(0, $(window).scrollTop());

  // 새로고침했을 때도 현재 스크롤 위치 반영
  $header.toggleClass('scrolled', lastScroll > 130);

  $(window).on('scroll', function () {
    const currentScroll = Math.max(0, $(window).scrollTop());

    if (currentScroll <= 130) {
      // 페이지 위쪽: 원래 두 줄 헤더
      $header.removeClass('scrolled hide');
    } else {
      // 본문: 한 줄 헤더
      $header.addClass('scrolled');

      if (currentScroll > lastScroll) {
        // 아래로 스크롤하면 숨기기
        $header.addClass('hide');
      } else if (currentScroll < lastScroll) {
        // 위로 스크롤하면 보이기
        $header.removeClass('hide');
      }
    }

    // 다음 스크롤에서 방향을 비교하기 위해 저장
    lastScroll = currentScroll;





    // 카드슬라이드
    let index = 0;

    const cardWidth = 376;
    const gap = 20;
    const move = cardWidth + gap;

    const maxIndex = 2;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    function slide() {
      $('.allcard').css({
        transition: 'transform 0.3s ease',
        transform: `translateX(-${index * move}px)`
      });

      $('.arrow-left').prop('disabled', index === 0);
      $('.arrow-right').prop('disabled', index === maxIndex);
    }

    /* 오른쪽 버튼 */
    $('.arrow-right').click(function () {
      if (index < maxIndex) {
        index++;
        slide();
      }
    });

    /* 왼쪽 버튼 */
    $('.arrow-left').click(function () {
      if (index > 0) {
        index--;
        slide();
      }
    });

    /* 드래그 시작 */
    $('.view').on('mousedown', function (e) {
      isDragging = true;
      startX = e.pageX;

      $('.allcard').css('transition', 'none');
    });

    /* 드래그 중 */
    $(document).on('mousemove', function (e) {
      if (!isDragging) return;

      currentX = e.pageX - startX;

      const baseX = -(index * move);

      $('.allcard').css(
        'transform',
        `translateX(${baseX + currentX}px)`
      );
    });

    /* 드래그 끝 */
    $(document).on('mouseup', function () {
      if (!isDragging) return;

      if (currentX < -80 && index < maxIndex) {
        index++;
      }

      if (currentX > 80 && index > 0) {
        index--;
      }

      isDragging = false;
      currentX = 0;

      slide();
    });

    slide();




    // 종료
  })