$(function () {
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