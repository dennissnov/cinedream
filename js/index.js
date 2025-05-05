class Animation {
  static instance = null;

  static Create(option) {
    if (!instance) {
      instance = new Animation(option);
    }
    return instance;
  }

  get defaultOption() {
    return {
      el: null,
      duration: 0,
      delay: 0,
      easing: 'linear',
      direction: 'normal',
      iteration: 1,
      fillMode: 'forwards',
    };
  }

  waitForFonts = async ({
    fonts = ['Urbanist', 'Avenir'],
    timeout = 5000,
    onFontsLoaded = () => {},
  } = {}) => {
    if (!document.fonts) {
      console.warn('Font loading API not supported');
      return;
    }

    try {
      const fontPromises = fonts.map(async (font) => {
        await document.fonts.load(`1em ${font}`);
        return document.fonts.check(`1em ${font}`);
      });

      const results = await Promise.all(fontPromises);

      if (results.every((loaded) => loaded)) {
        console.log('All fonts have loaded');
        document.documentElement.classList.add('fonts-loaded');
        // callback function
        onFontsLoaded();
      } else {
        console.warn('Some fonts may not have loaded completely');
      }
    } catch (error) {
      console.error('Error loading fonts', error);
    }
  };

  init() {
    this.option = Object.assign({}, this.defaultOption, this.option);
    this.el = document.querySelector(this.option.el);
    // this.initLenis();
  }

  constructor(option) {
    gsap.registerPlugin(ScrollTrigger, Flip);
    this.registerBlur();
    this.option = option;
    this.lenis = null;
    this.init();
    this.observerHeightChange();

    setTimeout(() => {}, 0);

    requestAnimationFrame(() => {
      // this.initBannerAnimation();
      // // video scroll section
      this.initVideoScrollSection();
      this.initScrollAutoPlayVideo();

      this.initTextScrollSection();

      this.initMeetCineDream();
      this.initUnlockPower();
      this.initAddFilmEffect();

      this.initReviewAnimation();
      this.initUnlockPowerLut();
      // // section Review
      this.initPremierePro();
      this.initFinalCutPro();
      this.initDavinciResolve();
      this.initCineDreamAction();
    });
  }

  //helper
  progressiveBuild() {
    let data = Array.from(arguments),
      i = 0,
      tl = gsap.timeline({
        onComplete: function () {
          let isNum = typeof data[i] === 'number',
            delay = isNum ? data[i++] : 0,
            func = data[i++];
          typeof func === 'function' && tl.add(func(), '+=' + delay);
        },
      });
    tl.vars.onComplete();
    return tl;
  }

  registerBlur() {
    const blurProperty = gsap.utils.checkPrefix('filter'),
      blurExp = /blur\((.+)?px\)/,
      getBlurMatch = (target) =>
        (gsap.getProperty(target, blurProperty) || '').match(blurExp) || [];

    gsap.registerPlugin({
      name: 'blur',
      get(target) {
        return +getBlurMatch(target)[1] || 0;
      },
      init(target, endValue) {
        let data = this,
          filter = gsap.getProperty(target, blurProperty),
          endBlur = 'blur(' + endValue + 'px)',
          match = getBlurMatch(target)[0],
          index;
        if (filter === 'none') {
          filter = '';
        }
        if (match) {
          index = filter.indexOf(match);
          endValue =
            filter.substr(0, index) +
            endBlur +
            filter.substr(index + match.length);
        } else {
          endValue = filter + endBlur;
          filter += filter ? ' blur(0px)' : 'blur(0px)';
        }
        data.target = target;
        data.interp = gsap.utils.interpolate(filter, endValue);
      },
      render(progress, data) {
        data.target.style[blurProperty] = data.interp(progress);
      },
    });
  }

  initLenis() {
    const lenisOptions = {
      // duration: 1,
      // easing: (x) => 1 - Math.pow(1 - x, 3),
      // direction: 'vertical',
      // gestureDirection: 'vertical',
      // smooth: false,
      // smoothTouch: false,
      // touchMultiplier: 2,
      duration: 1,        // Keep as low as possible
      easing: (t) => t,   // Linear easing — no inertia
      smooth: true,       // Still enables requestAnimationFrame-driven scroll
      smoothTouch: false, // Optional: native touch scroll on mobile
    };
    this.lenis = new Lenis(lenisOptions);

    this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  textSplitter = (nodes, options) => {
    // add class to each node
    // console.log(nodes);
    if (nodes.length > 0) {
      nodes.forEach((node) => {
        node.classList.add('split-type');
      });
    } else {
      nodes.classList.add('split-type');
    }

    const defaults = {
      types: 'lines, words, chars',
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'char',
    };
    const settings = Object.assign({}, defaults, options);

    return new SplitType(nodes, settings);
  };

  videoScroller = (video, section, options, offset = 0) => {
    if (!section || !video) {
      console.error('Section or video element not found.');
      return;
    }

    const defaults = {
      trigger: section,
      start: 'top top',
      // end: '+=200%',
      end: 'bottom top',
      scrub: true,
      pin: false,
      markers: false,
      // pinSpacing: false,
    };

    const settings = Object.assign({}, defaults, options);
    let src = video.currentSrc || video.src;
    /* Make sure the video is 'activated' on iOS */
    function once(el, event, fn, opts) {
      var onceFn = function (e) {
        el.removeEventListener(event, onceFn);
        fn.apply(this, arguments);
      };
      el.addEventListener(event, onceFn, opts);
      return onceFn;
    }

    once(document.documentElement, 'touchstart', function (e) {
      video.play();
      video.pause();
    });

    once(video, 'loadedmetadata', () => {
      setTimeout(() => {
        const targetTime = video.duration - offset - 0.1 || 1;
        console.log(targetTime, video.duration, 'targetTime', offset);
        let tl = gsap.timeline({
          defaults: { duration: 1 },
          scrollTrigger: settings,
        });

        tl.fromTo(
          video,
          {
            currentTime: 0,
          },
          {
            currentTime: targetTime,
          }
        );
        ScrollTrigger.refresh(); // Force refresh
      }, 100);
    });

    setTimeout(function () {
      if (window['fetch']) {
        fetch(src)
          .then((response) => response.blob())
          .then((response) => {
            var blobURL = URL.createObjectURL(response);
            var t = video.currentTime - offset || 1;
            once(document.documentElement, 'touchstart', function (e) {
              video.play();
              video.pause();
            });
            video.setAttribute('src', blobURL);
            video.currentTime = t + 0.01;
          });
      }
    }, 1000);
  };

  // section video scrollPercent
  initVideoScrollSection() {
    const section = document.querySelector('.section-video-scroll');
    // const video = section?.querySelector('video');
    // if (!section || !video) {
    //   return;
    // }
    console.log(section, 'section asu');
    // this.videoScroller(
    //   video,
    //   section,
    //   {
    //     trigger: section,
    //     start: 'top top',
    //     end: `bottom-=${window.innerHeight} top`,
    //     pin: '.section-video-scroll .wrapper-video-editor',
    //     markers: true,
    //     scrub: 1,
    //   },
    //   3
    // );

    this.canvasAnimation({
      element: '#video-scroll-canvas',
      totalFrames: 200,
      fileType: 'jpg',
      imageFolder:
        'https://cinedream.s3.us-west-2.amazonaws.com/videos/demo_4_conv/jpg',
      filenamePrefix: 'demo_4_conv',
      padLength: 8,
      startFrame: 86400,
      trigger: section,
      pin: '.section-video-scroll .wrapper-video-editor',
    });
  }

  // Section Banner
  initBannerAnimation() {
    const banner_section = document.querySelector('.section-banner');
    const h1 = banner_section.querySelectorAll('h1');
    const h4 = banner_section.querySelectorAll('h4');
    const p = banner_section.querySelectorAll('p');
    const icon = banner_section.querySelectorAll('.icon-wrapper img');
    const lightboxWrapper = document.querySelector('.lightbox-wrapper');

    // console.log(h1, h4, p, icon, lightboxWrapper);

    this.lenis.scrollTo(0, {
      duration: 0.01,
    });
    this.lenis.stop();

    const animation = () => {
      const h4Split = this.textSplitter(h4);
      h1.forEach((el, index) => {
        const h1Split = this.textSplitter(el);

        const tl = gsap.timeline({
          duration: 1,
          ease: 'elastic.out(1, 0.3)',
          delay: index * 0.5,

          // ease: 'back.out(1.7)',
        });
        const gradientBg = el.parentNode?.querySelector('.gradient-bg');
        tl.fromTo(
          h1Split.chars,
          {
            rotationY: 90,
          },
          {
            rotationY: 0,
            // yPercent: 0,
            duration: 0.5,
            stagger: 0.05,
          }
        ).fromTo(
          h4Split.chars,
          {
            rotationY: 90,
          },
          {
            rotationY: 0,
            duration: 0.5,
            delay: index * 0.01,
            stagger: 0.01,
            ease: 'back.out(1.7)',
          }
        ); // this one runs twice because of loop of h1 elements
        gsap.set(gradientBg, { transformOrigin: '20% 55%' });

        gsap.from(gradientBg, {
          scaleX: 0,
          duration: 1,
          ease: 'back.out(2.7)',
          // delay: 1.2,
          delay: 1.2 + index * 0.5,
        });
      });

      gsap.from(p, {
        y: 100,
        opacity: 0,
        duration: 0.5,
        stagger: 0.01,
        ease: 'back.out(1.7)',
        delay: 2,
      });

      gsap.from(icon, {
        // rotation: 360,
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 2,
      });

      gsap.fromTo(
        lightboxWrapper,
        {
          yPercent: 1000,
          scale: 10,
          duration: 2,
          ease: 'power4.out',
          transformOrigin: 'center top',
        },
        {
          yPercent: 0,
          scale: 0.7,
          duration: 2,
          delay: 0,
          ease: 'expo.out',
          onComplete: () => {
            this.lenis.start();
          },
        }
      );

      const sectionBannerWrapper = document.querySelector(
        '.section-banner .section'
      );

      const sectionLightbox = document.querySelector('.lightbox-section');

      ScrollTrigger.create({
        trigger: sectionLightbox,
        start: 'clamp(top 10%)',
        end: 'clamp(40%  10%)',
        markers: false,
        immediateRender: false,
        id: 'text-intro',
        pinSpacing: false,
        pin: true,
        markers: false,
        animation: gsap.to(lightboxWrapper, {
          scale: 1,
          yPercent: 0,
          duration: 1,
          ease: 'expo.out',
        }),
        scrub: 1,
      });
    };

    animation();
  }

  destroyBannerAnimation() {
    const banner_section = document.querySelector('.section-banner');
    const h1 = banner_section.querySelectorAll('h1');
    h1.forEach((el, index) => {
      const h1Split = this.textSplitter(el);
      h1Split.revert();
    });
  }

  // Section Two Image Scroller Animation
  canvasAnimation(options) {
    const {
      element,
      totalFrames,
      fileType,
      imageFolder,
      filenamePrefix,
      padLength,
      startFrame = 0,
      trigger,
      pin = false,
    } = options;

    const canvas = document.querySelector(element);

    // console.log(canvas, 'canvas');
    if (!canvas) {
      console.error('Canvas element not found.');
      return;
    }

    const ctx = canvas.getContext('2d');

    const createAndTransformImage = function (frameIndex) {
      const frameNumber = startFrame + frameIndex;
      const img = new Image();
      img.src = `${imageFolder}/${filenamePrefix}_${String(
        frameNumber
      ).padStart(padLength, '0')}.${fileType}`;

      // console.log(img.src, 'img.src');
      return img;
    };

    const drawImageAtFrame = function (imageSequence, frameIndex) {
      // console.log(imageSequence[frameIndex], frameIndex);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const img = imageSequence[frameIndex];

      const aspectRatio = img.width / img.height;

      let width = canvas.width;
      let height = canvas.height;

      if (canvas.width / canvas.height > aspectRatio) {
        width = canvas.height * aspectRatio;
      } else {
        height = canvas.width / aspectRatio;
      }

      const y = 0;
      const x = (canvas.width - width) / 2;
      // change canvas background
      ctx.drawImage(img, x, y, width, height);
    };

    const setupAnimation = function (canvas, ctx, imageSequence) {
      const end = window.innerHeight * 2;
      // const end = 5000;

      gsap.to(canvas, {
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: `bottom bottom`,
          scrub: true,
          pin: pin,
          // pin: '.section-canvas',
          invalidateOnRefresh: true,
          markers: true,
          onUpdate: function (self) {
            if (self) {
              const { progress } = self;
              const frameIndex = Math.floor(
                progress * (imageSequence.length - 1)
              );

              ctx.clearRect(0, 0, canvas.width, canvas.height);
              const img = imageSequence[frameIndex];

              const aspectRatio = img.width / img.height;

              let width = canvas.width;
              let height = canvas.height;

              if (canvas.width / canvas.height > aspectRatio) {
                width = canvas.height * aspectRatio;
              } else {
                height = canvas.width / aspectRatio;
              }

              const y = 0;
              const x = (canvas.width - width) / 2;
              ctx.drawImage(img, x, y, width, height);
            }
          },
        },
      });
    };

    const imageSequence = Array.from({ length: totalFrames }, (_, i) =>
      createAndTransformImage(i)
    );

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Redraw the image at the current frame after resizing
      const frameIndex = Math.floor(
        gsap.getProperty(canvas, 'progress') * (imageSequence.length - 1)
      );
      drawImageAtFrame(imageSequence, frameIndex);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // set first frame
    setTimeout(() => {
      drawImageAtFrame(imageSequence, 0);
    }, 1000);

    setupAnimation(canvas, ctx, imageSequence);
  }

  autoPlayOnScroll(video, trigger, startTime = 0, endTime = 0, loop = false) {
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          video.pause(); // Let ScrollTrigger take control
          initScrollTrigger();
        })
        .catch(() => {
          initScrollTrigger(); // Still init if autoplay fails
        });
    } else {
      initScrollTrigger();
    }

    function initScrollTrigger() {
      // Prevent duplicate timeupdate listeners
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.addEventListener('timeupdate', onTimeUpdate);

      ScrollTrigger.create({
        trigger: trigger,
        start: 'top center',
        end: 'bottom center',
        markers: true,
        id: 'video autoplay',
        onEnter: () => {
          video.currentTime = startTime;
          video.play();
        },
        onEnterBack: () => {
          video.currentTime = startTime;
          video.play();
        },
        onLeave: () => video.pause(),
        onLeaveBack: () => video.pause(),
      });

      setTimeout(() => {
        ScrollTrigger.refresh();
        ScrollTrigger.update();
      }, 0);
    }

    function onTimeUpdate() {
      if (endTime > 0 && video.currentTime >= endTime) {
        if (loop) {
          video.currentTime = startTime;
          video.play();
        } else {
          video.pause();
        }
      }
    }
  }

  initScrollAutoPlayVideo() {
    const sectionLightbox = document.querySelector('.lightbox-section');
    const video = sectionLightbox?.querySelector('video');
    if (!sectionLightbox || !video) {
      return;
    }

    this.autoPlayOnScroll(video, sectionLightbox);
  }

  // Section Text Scroll Animation
  initTextScrollSection() {
    const section = document.querySelector('.section-text-intro');

    const h2 = section?.querySelectorAll('h2');

    if (!section || !h2) {
      return;
    }

    const h2Split = this.textSplitter(h2);
    const q = gsap.utils.selector(section);
    const sectionWrapper = q('.section-text-intro-wrapper')[0];
    const textMiddleWrapper = q('.text-middle-wrapper')[0];
    const textMainTop = q('.text-main-top')[0];
    const textMainBottom = q('.text-main-bottom')[0];
    const textMainMiddle = q('.text-main-middle')[0];
    const textWrapper = textMiddleWrapper.querySelectorAll('.text-wrapper');
    const allBgGradient = section.querySelectorAll('.gradient-bg');

    gsap.set(allBgGradient, {
      transformOrigin: '10% 55%',
    });

    gsap.set(h2Split.chars, { opacity: 0.3 });

    gsap.set(textWrapper, { y: 100, opacity: 0, blur: 10 });
    gsap.set([textMainTop, textMainMiddle, textMainBottom], {
      y: 100,
      opacity: 0,
      blur: 10,
    });

    ScrollTrigger.create({
      trigger: section,
      start: 'top 0%',
      end: 'top 0%',

      id: 'sec',
      onEnter: () => {
        document.querySelector('.section-vignette').classList.add('disabled');
      },
      onLeaveBack: () => {
        document
          .querySelector('.section-vignette')
          .classList.remove('disabled');
      },
    });

    const innerHeight = window.innerHeight;
    const timeline = gsap.timeline({});
    const targetYScrollUp = -150;
    const targetYScrollDown = 0;

    // TEXT IN THE MIDDLE
    timeline
      .to(textWrapper[0], {
        y: 0,
        blur: 0,
        opacity: 1,
        duration: 1,
        ease: 'none',
        overwrite: 'auto',
      })
      .add('scene1')
      .set(
        q('.text-middle-wrapper .text-wrapper')[0].querySelectorAll('.char'),
        {
          opacity: 1,
          stagger: {
            amount: 1,
          },
        },
        'scene1'
      )
      .fromTo(
        allBgGradient[0],
        {
          scaleX: 0,
          opacity: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 2,
        },
        'scene1'
      )
      .to(textWrapper[0], {
        y: targetYScrollUp,
        opacity: 0,
        blur: 10,
        duration: 1,
        overwrite: 'auto',
      });

    timeline
      .to(
        [textWrapper[1], textWrapper[2]],
        {
          y: 0,
          blur: 0,

          opacity: 1,
          duration: 1,
        },
        '-=0.5'
      )
      .add('scene2')
      .set(
        q('.text-middle-wrapper .text-wrapper')[1].querySelectorAll('.char'),
        {
          opacity: 1,
          stagger: {
            amount: 1,
          },
        },
        'scene2'
      )
      .fromTo(
        allBgGradient[1],
        {
          scaleX: 0,
          opacity: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 2,
        },
        'scene2'
      )
      .add('scene3')
      .set(
        q('.text-middle-wrapper .text-wrapper')[2].querySelectorAll('.char'),
        {
          opacity: 1,
          duration: 1,
          stagger: {
            amount: 1,
          },
        },
        'scene3'
      )
      .fromTo(
        allBgGradient[2],
        {
          scaleX: 0,
          opacity: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 2,
        },
        'scene3'
      )

      .to(
        [
          q('.text-middle-wrapper .text-wrapper')[1],
          q('.text-middle-wrapper .text-wrapper')[2],
        ],
        {
          y: targetYScrollUp,
          blur: 10,

          opacity: 0,
          duration: 1,
        }
      );

    // scene 4
    // text main wrapper
    timeline
      .to(textMainTop, {
        y: 0,
        blur: 0,

        opacity: 1,
        duration: 1,
      })
      .add('scene4')
      .set(
        textMainTop
          .querySelectorAll('.text-wrapper')[0]
          .querySelectorAll('.char'),
        {
          opacity: 1,
          stagger: 0.1,
        },
        'scene4'
      )
      .fromTo(
        allBgGradient[3],
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 2,
        },
        'scene4'
      )
      .add('scene4b')
      .set(
        textMainTop
          .querySelectorAll('.text-wrapper')[1]
          .querySelectorAll('.char'),
        {
          opacity: 1,
          stagger: 0.1,
        },
        'scene4b'
      )
      .fromTo(
        allBgGradient[4],
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 2,
        },
        'scene4b'
      )
      .add('scene4c')
      .set(
        textMainTop
          .querySelectorAll('.text-wrapper')[2]
          .querySelectorAll('.char'),
        {
          opacity: 1,
          duration: 1,
          stagger: {
            amount: 1,
          },
        },
        'scene4c'
      )
      .fromTo(
        allBgGradient[5],
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 2,
        },
        'scene4c'
      );

    timeline
      .to(
        textMainMiddle,
        {
          y: 0,
          blur: 0,

          opacity: 1,
          duration: 1,
        },
        '-=2'
      )
      .add('scene5', '-=1')
      .set(
        textMainMiddle
          .querySelectorAll('.text-wrapper')[0]
          .querySelectorAll('.char'),
        {
          opacity: 1,
          stagger: 0.1,
        },
        'scene5'
      )
      .fromTo(
        allBgGradient[6],
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 2,
        },
        'scene5'
      )
      .add('scene5b')
      .set(
        textMainMiddle
          .querySelectorAll('.text-wrapper')[1]
          .querySelectorAll('.char'),
        {
          opacity: 1,
          stagger: 0.1,
        },
        'scene5b'
      )
      .fromTo(
        allBgGradient[7],
        {
          scaleX: 0,
        },
        {
          scaleX: 1,

          opacity: 1,

          duration: 2,
        },
        'scene5b'
      )
      .add('scene5c')
      .set(
        textMainMiddle
          .querySelectorAll('.text-wrapper')[2]
          .querySelectorAll('.char'),
        {
          opacity: 1,
          duration: 1,
          stagger: {
            amount: 1,
          },
        },
        'scene5c'
      )
      .fromTo(
        allBgGradient[8],
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 2,
        },
        'scene5c'
      );

    timeline
      .to(
        textMainBottom,
        {
          y: 0,
          blur: 0,
          opacity: 1,
          duration: 1,
        },
        '-=2'
      )
      .add('scene6', '-=1')
      .set(
        textMainBottom
          .querySelectorAll('.text-wrapper')[0]
          .querySelectorAll('.char'),
        {
          opacity: 1,
          duration: 1,
          stagger: {
            amount: 1,
          },
        },
        'scene6'
      )
      .fromTo(
        allBgGradient[9],
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 2,
        },
        'scene6'
      )
      .add('scene6b')
      .set(
        textMainBottom
          .querySelectorAll('.text-wrapper')[1]
          .querySelectorAll('.char'),
        {
          opacity: 1,
          stagger: 0.1,
        },
        'scene6b'
      )
      .fromTo(
        allBgGradient[10],
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 2,
        },
        'scene6b'
      )
      .add('scene6c')
      .set(
        textMainBottom
          .querySelectorAll('.text-wrapper')[2]
          .querySelectorAll('.char'),
        {
          opacity: 1,
          duration: 1,
          stagger: {
            amount: 1,
          },
        },
        'scene6c'
      )
      .fromTo(
        allBgGradient[11],
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 2,
        },
        'scene6c'
      )
      .to([textMainTop, textMainMiddle, textMainBottom], {
        y: -100,
        blur: 10,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
      });

    ScrollTrigger.create({
      trigger: '.section-text-intro',
      start: 'top top',
      end: `bottom-=${innerHeight} top`,
      // end: `bottom bottom`,
      markers: true,
      id: 'pin',
      pin: true, // use this if want to overlap
      scrub: 1,
      animation: timeline,
      // pinSpacing:false
    });
  }

  //Section Meet CineDream
  initMeetCineDream() {
    const section = document.querySelector('.section-meet-cinedream');
    if (!section) return;
    const q = gsap.utils.selector(section);
    const video = section?.querySelector('video');

    const sectionVignette = document.querySelector('.section-vignette');
    const meetCinedreamSlider = section.querySelector('.meet-cinedream-slider');
    const arrayOfSlides = meetCinedreamSlider.querySelectorAll(
      '.meet-cinedream-slide'
    );

    const lineProgressWrapper = section.querySelector('.line-progress-wrapper');

    gsap.set([lineProgressWrapper], { opacity: 0 });
    // gsap.set([arrayOfSlides, lineProgressWrapper], { opacity: 0 });
    // use this if want to overlap
    const entranceAnimation = gsap.timeline({
      paused: true,
      defaults: {
        duration: 1,
        ease: 'none',
      },
    });

    entranceAnimation
      .from(q('.meet-cinedream-video'), {
        scale: 0.5,
      })
      .to(
        q('.meet-cinedream-video'),
        {
          '--border-radius-cinedream': '0px',
        },
        '<'
      );

    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'top top',
      markers: true,
      id: 'meet-cinedream',
      scrub: 1,
      pin: '.section-text-intro',
      // immediateRender: false,
      pinSpacing: false,
      animation: entranceAnimation,
    });

    let totalDurationVideo = video.duration;
    // const totalDurationVideo = video.duration;
    // console.log(totalDurationVideo, 'totalDurationVideo');

    const container1 = section.querySelector('.source'),
      container2 = section.querySelector('.target'),
      box = section.querySelector('.video-meet');

    const secondState = Flip.getState('.target');

    const flipConfig = {
      // ease: 'none',
      duration: 0.5,
      absolute: true,
      scale: true,
      ease: 'expoScale(0.5,7,none)',
    };

    const animationScroll = gsap.timeline({
      defaults: {
        duration: 0.1,
        ease: 'none',
      },
    });

    animationScroll
      .from(
        q('.meet-cinedream-text-2'),
        {
          opacity: 0,
          duration: 0.05,
          blur: 10,
          ease: 'expo.out',
        },
        0
      )
      // .to(q('.meet-cinedream-text-2'), {
      // 	scale: 1,
      // 	duration: 0.05,
      // })
      .fromTo(
        q('.meet-cinedream-text-2'),
        {
          yPercent: 0,
          opacity: 1,
          blur: 0,
        },
        {
          yPercent: -100,
          opacity: 0,
          duration: 0.05,
          blur: 10,
        }
      );
    animationScroll
      .from(q('.meet-cinedream-text'), {
        opacity: 0,
        duration: 0.05,
        blur: 10,
        ease: 'expo.out',
      })
      .to(q('.meet-cinedream-text'), {
        scale: 1,
        duration: 0.05,
      })
      .fromTo(
        q('.meet-cinedream-text'),
        {
          yPercent: 0,
          opacity: 1,
          blur: 0,
        },
        {
          yPercent: -100,
          opacity: 0,
          blur: 10,
          duration: 0.1,
        }
      );

    const slide1 = section.querySelector('.meet-cinedream-slide-1');
    const slide2 = section.querySelector('.meet-cinedream-slide-2');
    const slide3 = section.querySelector('.meet-cinedream-slide-3');
    const verticalSlides = section.querySelectorAll('.vertical-slide');
    animationScroll.duration(totalDurationVideo - 0.1);

    animationScroll
      .set(lineProgressWrapper, { opacity: 1 })
      .add('flip')
      .add(Flip.fit(container1, secondState, flipConfig), 'flip')
      // to variable border to 90px
      .to(
        q('.meet-cinedream-video'),
        {
          '--border-radius-cinedream': '90px',
          duration: 0.3,
        },
        'flip'
      )
      .add('slide1', '<+=0.2')
      .from(
        slide1,
        {
          xPercent: -100,
          opacity: 0,
          duration: 0.2,
          ease: 'expo.out',
        },
        'slide1'
      )
      .to(slide1, {
        scale: 1,
        duration: 0.5,
      })
      .to(
        lineProgressWrapper.querySelectorAll('.line-progress-active')[0],
        {
          scaleX: 1,
          duration: 0.5,
        },
        '<'
      )
      .add('slide1Out')
      .to(
        slide1,
        {
          xPercent: 100,
          opacity: 0,
          duration: 0.2,
          ease: 'expo.out',
        },
        'slide1Out'
      )

      .add('slide2', '<')

      .from(
        slide2,
        {
          xPercent: -100,
          opacity: 0,
          duration: 0.2,
          ease: 'expo.out',
        },
        'slide2'
      )
      .to(slide2, {
        scale: 1,
        duration: 0.2,
      })
      .to(
        lineProgressWrapper.querySelectorAll('.line-progress-active')[1],
        {
          scaleX: 1,
          duration: 0.2,
        },
        '<'
      )
      .add('slide2Out')
      .to(
        slide2,
        {
          xPercent: 100,
          opacity: 0,
          duration: 0.2,
          ease: 'expo.out',
        },
        'slide2Out'
      )
      .add('slide3', '<')
      .from(
        slide3,
        {
          xPercent: -100,
          opacity: 0,
          duration: 0.2,
          ease: 'expo.out',
        },
        'slide3'
      )
      .to(slide3, {
        scale: 1,
        duration: 0.2,
      })
      .to(
        lineProgressWrapper.querySelectorAll('.line-progress-active')[2],
        {
          scaleX: 1,
          duration: 0.2,
        },
        '<'
      )
      .to(verticalSlides[0], {
        duration: 0.3,
        opacity: 1,
      })
      .add('slide3AOut')

      .to(
        verticalSlides[0],
        {
          yPercent: 100,
          duration: 0.1,
          opacity: 0,
        },
        'slide3AOut'
      )

      .add('slide3BIn', '-=0.05')
      .fromTo(
        verticalSlides[1],
        {
          opacity: 0,
        },
        {
          duration: 0.1,
          opacity: 1,
        },
        'slide3BIn'
      )
      .to(verticalSlides[1], {
        duration: 0.5,
        opacity: 1,
      })
      .to(
        lineProgressWrapper.querySelectorAll('.line-progress-active')[3],
        {
          scaleX: 1,
          duration: 0.5,
        },
        '<'
      )
      .add('slide3BOut', '-=0.05')
      // .to(
      // 	lineProgressWrapper.querySelectorAll('.line-progress')[3],
      // 	{
      // 		opacity: 0.2,
      // 		duration: 0.1,
      // 	},
      // 	'slide3BOut'
      // )
      .to(
        verticalSlides[1],
        {
          yPercent: 100,
          duration: 0.1,
          opacity: 0,
        },
        'slide3BOut'
      )
      .add('slide3CIn', '-=0.05')

      .fromTo(
        verticalSlides[2],
        {
          opacity: 0,
        },
        {
          duration: 0.1,
          opacity: 1,
        },
        'slide3CIn'
      )
      .to(verticalSlides[2], {
        duration: 0.8,
        opacity: 1,
      })
      .to(
        lineProgressWrapper.querySelectorAll('.line-progress-active')[4],
        {
          scaleX: 1,
          duration: 0.8,
        },
        '<'
      );

    // .add(() => {
    // 	flip();
    // }, 1);
    this.videoScroller(video, section, {
      trigger: section,
      start: 'top top',
      end: `bottom-=${innerHeight} top`,
      pin: false,
      markers: {
        startColor: 'yellow',
        endColor: 'white',
        fontSize: '20px',
        indent: 1000,
      },
      id: 'meet-cinedream-video',
      scrub: 1,
    });

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `bottom-=${innerHeight} top`,
      markers: {
        startColor: 'blue',
        endColor: 'white',
        fontSize: '20px',
        indent: 500,
      },
      id: 'meet-cinedream-text',
      pin: '.meet-cinedream-wrapper',
      preventOverlaps: true,
      animation: animationScroll,
      immediateRender: false,
      scrub: 1,
    });
  }

  // Section Review
  initReviewAnimation() {
    const section = document.querySelector('.section-review');
    const h2 = section?.querySelectorAll('h2');
    const wrapper = section?.querySelector('.card-review-wrapper');
    const cardRow = section?.querySelectorAll('.card-review-row');
    const cards = section?.querySelectorAll('.card-review');

    if (!section || !h2 || !cardRow) {
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: '0% 0%',
        end: 'bottom+=200% 0%',
        scrub: 1,
        pin: true,
        markers: true,
      },
    });

    cards.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        containerAnimation: tl,
        start: 'left center',
        end: 'right center',
        toggleActions: 'play none none reset',
        id: '1',
        markers: false,
        onEnter: () => {
          el.classList.add('active');
        },
        onLeaveBack: () => {
          el.classList.remove('active');
        },
        onEnterBack: () => {
          el.classList.add('active');
        },
        onLeave: () => {
          el.classList.remove('active');
        },
      });
    });

    // get width of cardRow
    const cardWidth = cards[0].getBoundingClientRect().width;
    const cardRowWidth = wrapper.getBoundingClientRect().width;

    tl.to(cardRow, {
      x: `-=${cardRowWidth - cardWidth / 2}`,
      duration: 1,
      ease: 'none',
    });
  }

  playVideo(video, starttime = 0, endtime = 0) {
    // var starttime = 2; // start at 2 seconds
    // var endtime = 4; // stop at 4 seconds

    //handler should be bound first
    video.addEventListener(
      'timeupdate',
      function () {
        if (this.currentTime >= video.duration - 0.1 - endtime) {
          this.pause();
        }
      },
      false
    );

    //suppose that video src has been already set properly
    video.load();
    video.play(); //must call this otherwise can't seek on some browsers, e.g. Firefox 4
    try {
      video.currentTime = starttime;
    } catch (ex) {
      //handle exceptions here
    }
  }

  // Premiere Pro Section
  initPremierePro() {
    const section = document.querySelector('.section-premiere-pro');
    const video = section?.querySelector('video');
    if (!section || !video) {
      return;
    }
    this.autoPlayOnScroll(video, section, 7, 15, true);
  }

  // init Final Cut Pro
  initFinalCutPro() {
    const section = document.querySelector('.section-final-cut');
    const video = section?.querySelector('video');
    if (!section || !video) {
      return;
    }
    this.autoPlayOnScroll(video, section, 17, 25, true);
  }

  initDavinciResolve() {
    const section = document.querySelector('.section-davinci-resolve');
    const video = section?.querySelector('video');
    if (!section || !video) {
      return;
    }
    this.autoPlayOnScroll(video, section, 13, 20, true);
  }

  initCineDreamAction() {
    const section = document.querySelector('.section-cinedream-action');
    if (!section) return;

    const cols = section.querySelectorAll('.bg-image-col');
    if (!cols.length) return;

    // Clone all images and append them to their respective columns
    cols.forEach((col, index) => {
      const divs = col.querySelectorAll('div');
      divs.forEach((div) => {
        const clone = div.cloneNode(true);
        col.appendChild(clone);
      });

      // Ensure each column has a sufficient height for animation
      col.style.overflow = 'hidden';
    });

    // GSAP Timeline Animation

    cols.forEach((col, index) => {
      const divs = col.querySelectorAll('div');
      const duration = 1.5;
      const tlAnimation = gsap.timeline({ paused: true });
      tlAnimation.to(divs, {
        yPercent: index % 2 === 0 ? -100 : 100,
        duration: duration,
      });

      // uif col no 3 , middle of divs set opacity 0
      if (index === 2) {
        gsap.set([divs[3], divs[4], divs[7]], {
          opacity: 0,
        });
      }

      if (index === 0 || index === 4) {
        gsap.set([divs[5], divs[6], divs[7]], {
          opacity: 0,
        });
      }

      if (index === 1 || index === 3) {
        gsap.set([divs[4], divs[0], divs[1], divs[6]], {
          opacity: 0,
        });
      }

      ScrollTrigger.create({
        trigger: col,
        start: 'top bottom',
        end: 'bottom top',
        animation: tlAnimation,
        scrub: 1,
        markers: false,
      });
    });

    // Refresh ScrollTrigger after DOM updates
    ScrollTrigger.refresh();
  }

  initCreateSLiderText(section, target) {
    const sliderText = section?.querySelector('[data-text-slide]');
    const sliderTextArray = sliderText
      .getAttribute('data-text-slide')
      .split(',');
    const sliderTextLength = sliderTextArray.length;
    const h4 = sliderText.querySelector(target);
    h4.innerHTML = '';
    // create div wrapper first
    const div = document.createElement('div');

    div.classList.add('text-slide-wrapper');
    h4.appendChild(div);

    sliderTextArray.forEach((text, index) => {
      const span = document.createElement('span');
      span.textContent = text;
      span.classList.add('text-slide');
      // appen span to div
      div.appendChild(span);
    });

    const span = div.querySelectorAll('.text-slide');
    // console.log(span);
    span.forEach((el, index) => {
      gsap.set(el, {
        yPercent: index * 100,
      });
    });

    return div;
  }

  initUnlockPower() {
    const section = document.querySelector('.section-unlock-power');
    const video = section?.querySelector('video');
    if (!section || !video) {
      return;
    }

    const div = this.initCreateSLiderText(section, '.h4');

    const percentageTrigger = [8, 12, 20, 26];
    const percentageTriggerUp = [20, 12, 8, 6];

    // const triggeredPercentages = new Set(); // Track triggered percentages
    this.videoScroller(
      video,
      section,
      {
        trigger: section,
        start: 'top top',
        end: `bottom-=${innerHeight} top`,
        pin: '.section-unlock-power .section-wrapper',
        markers: false,
        preventOverlaps: true,
        scrub: 1,
      },
      14.5
    );

    const videoDuration = video.duration;
    const animation = gsap.timeline({ paused: true });

    animation.duration(videoDuration);
    const lineProgressWrapper = section.querySelector('.line-progress-wrapper');
    const duration = [0.8, 0.4, 0.8, 0.5, 2.5];
    const dataTextSlide = section.querySelector('[data-text-slide]');
    const offset = 20;
    animation
      .to(section?.querySelector('.text-slide-wrapper'), {
        duration: duration[0],
        ease: 'expo.out',
      })
      .to(
        dataTextSlide,
        {
          width:
            dataTextSlide.querySelectorAll('.text-slide')[0].offsetWidth +
            offset,
        },
        '<'
      )
      .to(
        lineProgressWrapper.querySelectorAll('.line-progress-active')[0],
        {
          scaleX: 1,
          duration: duration[0],
        },
        '<'
      )
      // .set({}, {},duration[0])
      .to(section?.querySelector('.text-slide-wrapper'), {
        yPercent: '-=100',
        duration: duration[1],
        ease: 'expo.out',
      })
      .to(
        dataTextSlide,
        {
          width:
            dataTextSlide.querySelectorAll('.text-slide')[1].offsetWidth +
            offset,
        },
        '<'
      )
      .to(
        lineProgressWrapper.querySelectorAll('.line-progress-active')[1],
        {
          scaleX: 1,
          duration: duration[1],
        },
        '<'
      )
      // .set({}, {}, duration[1])

      .to(section?.querySelector('.text-slide-wrapper'), {
        yPercent: '-=100',
        duration: duration[2],
        ease: 'expo.out',
      })
      .to(
        dataTextSlide,
        {
          width:
            dataTextSlide.querySelectorAll('.text-slide')[2].offsetWidth +
            offset,
        },
        '<'
      )
      .to(
        lineProgressWrapper.querySelectorAll('.line-progress-active')[2],
        {
          scaleX: 1,
          duration: duration[2],
        },
        '<'
      )
      .to(section?.querySelector('.text-slide-wrapper'), {
        yPercent: '-=100',
        duration: duration[3],
        ease: 'expo.out',
      })
      .to(
        dataTextSlide,
        {
          width:
            dataTextSlide.querySelectorAll('.text-slide')[3].offsetWidth +
            offset,
        },
        '<'
      )
      .to(lineProgressWrapper.querySelectorAll('.line-progress-active')[3], {
        scaleX: 1,
        duration: duration[3],
      })

      // .set({}, {}, 4)
      .to(lineProgressWrapper.querySelectorAll('.line-progress-active')[4], {
        scaleX: 1,
        duration: duration[4],
      })
      .to(
        section?.querySelector('.text-slide-wrapper'),
        {
          yPercent: '-=100',
          duration: duration[4],
          ease: 'expo.out',
        },
        '<'
      )
      .to(
        dataTextSlide,
        {
          width:
            dataTextSlide.querySelectorAll('.text-slide')[4].offsetWidth +
            offset,
        },
        '<'
      )
      .to(section?.querySelector('.text-slide-wrapper'), {
        duration: duration[4] - 0.1,
        ease: 'expo.out',
      });

    setTimeout(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `bottom-=${innerHeight} top`,
        markers: {
          startColor: 'yellow',
          endColor: 'red',
          fontSize: '20px',
          indent: 2000,
        },
        scrub: 1,
        animation: animation,
        // immediateRender: false,
        id: 'unlock-power',
      });
    }, 0);
  }

  async initAddFilmEffect() {
    const section = document.querySelector('.section-film-effects');
    const video = section?.querySelectorAll('video');

    if (!section || video.length < 1) {
      return;
    }

    console.log(video, 'video');
    this.videoScroller(video[1], section, {
      trigger: section,
      start: 'top top',
      end: `bottom-=${window.innerHeight} top`,
      scrub: 1,
    });

    this.videoScroller(video[0], section, {
      trigger: section,
      start: 'top top',
      end: `bottom-=${window.innerHeight} top`,
      markers: false,
      pin: '.section-film-effects .section-wrapper',
      markers: true,
      scrub: 1,
    });

    const div = this.initCreateSLiderText(section, '.h5');
    const videoDuration = video[0].duration;
    const animation = gsap.timeline({ paused: true });
    const lineProgressWrapper = section.querySelector('.line-progress-wrapper');
    const dataTextSlide = section.querySelector('[data-text-slide]');
    const duration = [1, 0.9, 1, 0.9, 1.2];
    const offset = 20;

    animation.duration(videoDuration);

    animation
      .to(section?.querySelector('.text-slide-wrapper'), {
        duration: duration[0],
        ease: 'expo.out',
      })
      .to(
        lineProgressWrapper.querySelectorAll('.line-progress-active')[0],
        {
          scaleX: 1,
          duration: duration[0],
        },
        '<'
      )
      .to(
        dataTextSlide,
        {
          width:
            dataTextSlide.querySelectorAll('.text-slide')[0].offsetWidth +
            offset,
        },
        '<'
      )
      // .set({}, {},duration[0])
      .to(section?.querySelector('.text-slide-wrapper'), {
        yPercent: '-=100',
        duration: duration[1],
        ease: 'expo.out',
      })
      .to(
        lineProgressWrapper.querySelectorAll('.line-progress-active')[1],
        {
          scaleX: 1,
          duration: duration[1],
        },
        '<'
      )
      .to(
        dataTextSlide,
        {
          width:
            dataTextSlide.querySelectorAll('.text-slide')[1].offsetWidth +
            offset,
        },
        '<'
      )

      .to(section?.querySelector('.text-slide-wrapper'), {
        yPercent: '-=100',
        duration: duration[2],
        ease: 'expo.out',
      })
      .to(
        dataTextSlide,
        {
          width:
            dataTextSlide.querySelectorAll('.text-slide')[2].offsetWidth +
            offset,
        },
        '<'
      )
      .to(
        lineProgressWrapper.querySelectorAll('.line-progress-active')[2],
        {
          scaleX: 1,
          duration: duration[2],
        },
        '<'
      )
      .to(section?.querySelector('.text-slide-wrapper'), {
        yPercent: '-=100',
        duration: duration[3],
        ease: 'expo.out',
      })
      // .set({}, {}, 3)
      .to(
        lineProgressWrapper.querySelectorAll('.line-progress-active')[3],
        {
          scaleX: 1,
          duration: duration[3],
        },
        '<'
      )
      .to(
        dataTextSlide,
        {
          width:
            dataTextSlide.querySelectorAll('.text-slide')[3].offsetWidth +
            offset,
        },
        '<'
      )
      // .set({}, {}, 4)
      .to(lineProgressWrapper.querySelectorAll('.line-progress-active')[4], {
        scaleX: 1,
        duration: duration[4],
      })
      .to(
        section?.querySelector('.text-slide-wrapper'),
        {
          yPercent: '-=100',
          duration: duration[4],
          ease: 'expo.out',
        },
        '<'
      )
      .to(
        dataTextSlide,
        {
          width:
            dataTextSlide.querySelectorAll('.text-slide')[4].offsetWidth +
            offset,
        },
        '<'
      )
      .to(section?.querySelector('.text-slide-wrapper'), {
        duration: duration[4] - 0.1,
        ease: 'expo.out',
      });

    setTimeout(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `bottom-=${innerHeight} top`,
        markers: {
          startColor: '#ff0ff0',
          endColor: 'red',
          fontSize: '20px',
          indent: 2000,
        },
        scrub: 1,
        animation: animation,
        // immediateRender: false,
      });
    }, 10);
  }

  videoLoadedDuration(video) {
    return new Promise((resolve) => {
      if (video.readyState >= 1) {
        // Already loaded
        resolve(video.duration);
      } else {
        video.addEventListener(
          'loadedmetadata',
          () => {
            resolve(video.duration);
          },
          { once: true }
        );
      }
    });
  }

  async createCanvasSequence(options) {
    const {
      element,
      totalFrames,
      fileType,
      imageFolder,
      filenamePrefix,
      padLength,
      startFrame = 0,
      preload = false,
      width = window.innerWidth,
      height = window.innerHeight,
    } = options;

    const canvas = document.querySelector(element);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');

    const createImagePath = (frameIndex) => {
      const frameNumber = startFrame + frameIndex;
      return `${imageFolder}/${filenamePrefix}_${String(frameNumber).padStart(
        padLength,
        '0'
      )}.${fileType}`;
    };

    const drawImageAtFrame = (img) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const aspectRatio = img.width / img.height;

      let width = canvas.width;
      let height = canvas.height;

      if (canvas.width / canvas.height > aspectRatio) {
        width = canvas.height * aspectRatio;
      } else {
        height = canvas.width / aspectRatio;
      }

      const x = (canvas.width - width) / 2;
      const y = 0;
      // console.log(ctx, img, 'img');
      ctx.drawImage(img, x, y, width, height);
    };

    canvas.width = width;
    canvas.height = height;

    if (preload) {
      // Preload all images
      const preloadImages = () =>
        Promise.all(
          Array.from({ length: totalFrames }, (_, i) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = createImagePath(i);
              img.onload = () => resolve(img);
              img.onerror = () =>
                reject(new Error(`Image load failed for ${img.src}`));
            });
          })
        );

      const images = await preloadImages();

      drawImageAtFrame(images[0]);

      window.addEventListener('resize', () => {
        canvas.width = width;
        canvas.height = height;
        drawImageAtFrame(images[0]);
      });

      return (progress) => {
        const frameIndex = Math.floor(progress * (images.length - 1));
        drawImageAtFrame(images[frameIndex]);
      };
    } else {
      // Load frames on demand
      const imageCache = {};

      const loadAndDraw = (frameIndex) => {
        if (imageCache[frameIndex]) {
          drawImageAtFrame(imageCache[frameIndex]);
        } else {
          const img = new Image();
          img.src = createImagePath(frameIndex);
          img.onload = () => {
            imageCache[frameIndex] = img;
            drawImageAtFrame(img);
          };
        }
      };

      window.addEventListener('resize', () => {
        canvas.width = width;
        canvas.height = height;
      });

      return (progress) => {
        const frameIndex = Math.floor(progress * (totalFrames - 1));
        loadAndDraw(frameIndex);
      };
    }
  }

  async initUnlockPowerLut() {
    const section = document.querySelector('.section-unlock-power-lut');
    const video = section?.querySelector('.video-wrapper-right video');
    if (!section || !video) {
      return;
    }

    this.videoScroller(
      video,
      section,
      {
        trigger: section,
        start: 'top top',
        end: `bottom-=${innerHeight} top`,
        pin: '.section-unlock-power-lut .section-wrapper',
        markers: false,
        preventOverlaps: true,
        scrub: 1,
      },
      10
    );

    const sliderParent = section.querySelector('.slider-power');
    const allSlider = sliderParent.querySelectorAll('.slider-power-item');

    const sliderDescription = section.querySelector('.slider-description');
    const allSliderDescription = sliderDescription.querySelectorAll(
      '.slider-description-item'
    );

    gsap.set([allSlider, allSliderDescription], {
      opacity: 0,
      yPercent: 50,
    });
    const tlMaster = gsap.timeline({
      paused: true,
    });

    tlMaster.duration(video.duration);
    const tlSlide1 = gsap.timeline({});
    const tlSlide2 = gsap.timeline({});
    const tlSlide3 = gsap.timeline({});
    const tlSlide4 = gsap.timeline({});
    const tlSlide5 = gsap.timeline({});

    const lineProgressWrapper = section.querySelector('.line-progress-wrapper');
    const duration = [1.5, 2, 3, 4, 6];

    const mainDuration = video.duration;

    tlMaster.duration(mainDuration);

    const dataSrcGradingCanvas = document
      .querySelector('#scopes-grading-canvas')
      .getAttribute('data-src');

    const dataSrcIndependentCanvas = document
      .querySelector('#independent-canvas')
      .getAttribute('data-src');

    const dataSrcPresetCanvas = document
      .querySelector('#preset-canvas')
      .getAttribute('data-src');

    const drawCanvas1 = await this.createCanvasSequence({
      element: '#scopes-grading-canvas',
      totalFrames: 247,
      fileType: 'png',
      imageFolder: dataSrcGradingCanvas, // https://cinedream.s3.us-west-2.amazonaws.com/videos/3_scopes_grading/png
      filenamePrefix: '3_scopes_grading',
      padLength: 8,
      startFrame: 86400,
      preload: false,
      width: 480,
      height: 480,
    });

    const drawCanvasIndependent = await this.createCanvasSequence({
      element: '#independent-canvas',
      totalFrames: 288,
      fileType: 'png',
      imageFolder: dataSrcIndependentCanvas, // https://cinedream.s3.us-west-2.amazonaws.com/videos/1_independent/png"></canvas>
      filenamePrefix: '1_independent',
      padLength: 8,
      startFrame: 86400,
      preload: false,
      width: 480,
      height: 480,
    });

    const drawCanvasPreset = await this.createCanvasSequence({
      element: '#preset-canvas',
      totalFrames: 118,
      fileType: 'png',
      imageFolder: dataSrcPresetCanvas, // https://cinedream.s3.us-west-2.amazonaws.com/videos/4_preset_/png
      filenamePrefix: '4_preset',
      padLength: 8,
      startFrame: 86400,
      preload: false,
      width: 480,
      height: 128,
    });

    const canvasProxy = { progress: 0 };
    const canvasProxyIndependent = { progress: 0 };
    const canvasProxyPreset = { progress: 0 };

    tlSlide1
      .to(allSlider[0], {
        opacity: 1,
        yPercent: 0,
        duration: 0.5,
      })
      .to(
        allSliderDescription[0],
        {
          opacity: 1,
          duration: 0.5,
        },
        '<'
      )
      .from('#independent-canvas', {
        opacity: 0,
        yPercent: 50,
        duration: 1,
      })
      .to(allSliderDescription[0], {
        opacity: 0,
        yPercent: -50,
        duration: 1,
      })
      .to(allSliderDescription[1], {
        opacity: 1,
        yPercent: 0,
        duration: 1,
      })
      .to(allSliderDescription[1], {
        opacity: 0,
        yPercent: -50,
        duration: 1,
      })
      .to(allSliderDescription[2], {
        opacity: 1,
        yPercent: 0,
        duration: 1,
      })

      .to(allSlider[0], {
        xPercent: 50,
        duration: 0.5,
        opacity: 0,
      });

    tlMaster
      .add(tlSlide1, 0)
      .to(
        canvasProxyIndependent,
        {
          progress: 1,
          duration: tlSlide1.duration() - 1,
          ease: 'none',
          onUpdate() {
            drawCanvasIndependent(canvasProxyIndependent.progress);
          },
        },
        1
      )

      .to(
        lineProgressWrapper.querySelectorAll('.line-progress-active')[0],
        {
          scaleX: 1,
          duration: tlSlide1.duration(),
        },
        0
      );

    tlSlide2
      .to(allSlider[1], {
        opacity: 1,
        yPercent: 0,
        duration: 0.5,
      })
      .to(allSlider[1], {
        opacity: 1,
        yPercent: 0,
        duration: duration[1],
      })
      .to(allSlider[1], {
        xPercent: 50,
        duration: 0.5,
        opacity: 0,
      });

    tlMaster.add(tlSlide2, tlSlide1.duration()).to(
      lineProgressWrapper.querySelectorAll('.line-progress-active')[1],
      {
        scaleX: 1,
        duration: tlSlide2.duration(),
      },
      tlSlide1.duration()
    );

    tlSlide3
      .to(allSlider[2], {
        opacity: 1,
        yPercent: 0,
        duration: 0.5,
      })
      .to(allSlider[2], {
        opacity: 1,
        duration: duration[2] * 2,
      })
      .to(allSlider[2], {
        xPercent: 50,
        duration: 0.5,
        opacity: 0,
      });

    tlMaster
      .add(tlSlide3, tlSlide1.duration() + tlSlide2.duration())
      .to(
        canvasProxy,
        {
          progress: 1,
          duration: tlSlide3.duration(),
          ease: 'none',
          onUpdate() {
            drawCanvas1(canvasProxy.progress);
          },
        },
        tlSlide1.duration() + tlSlide2.duration()
      )
      .to(
        lineProgressWrapper.querySelectorAll('.line-progress-active')[2],
        {
          scaleX: 1,
          duration: tlSlide3.duration(),
        },
        tlSlide1.duration() + tlSlide2.duration()
      );

    tlSlide4
      .to(allSlider[3], {
        opacity: 1,
        yPercent: 0,
        duration: 0.5,
      })
      .to(allSlider[3], {
        opacity: 1,
        duration: duration[3] * 2,
      })
      .to(allSlider[3], {
        xPercent: 50,
        duration: 0.5,
        opacity: 0,
      });

    tlMaster
      .add(
        tlSlide4,
        tlSlide1.duration() + tlSlide2.duration() + tlSlide3.duration()
      )
      .to(
        canvasProxyPreset,
        {
          progress: 1,
          duration: tlSlide4.duration() - 1,
          ease: 'none',
          onUpdate() {
            drawCanvasPreset(canvasProxyPreset.progress);
          },
        },
        tlSlide1.duration() + tlSlide2.duration() + tlSlide3.duration()
      )
      .to(
        lineProgressWrapper.querySelectorAll('.line-progress-active')[3],
        {
          scaleX: 1,
          duration: tlSlide4.duration(),
        },
        tlSlide1.duration() + tlSlide2.duration() + tlSlide3.duration()
      );

    tlSlide5
      .to(allSlider[4], {
        opacity: 1,
        yPercent: 0,
        duration: 0.5,
      })
      .to(allSlider[4], {
        opacity: 1,
        duration: duration[4],
      });

    tlMaster
      .add(
        tlSlide5,
        tlSlide1.duration() +
          tlSlide2.duration() +
          tlSlide3.duration() +
          tlSlide4.duration()
      )
      .to(
        lineProgressWrapper.querySelectorAll('.line-progress-active')[4],
        {
          scaleX: 1,
          duration: tlSlide5.duration(),
        },
        tlSlide1.duration() +
          tlSlide2.duration() +
          tlSlide3.duration() +
          tlSlide4.duration()
      );

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `bottom-=${innerHeight} top`,
      markers: {
        startColor: 'purple',
        endColor: 'red',
        fontSize: '60px',
        indent: 10000,
      },
      scrub: 1.2,
      animation: tlMaster,
      // immediateRender: false,
    });
  }

  playCanvasDuringTimeline(timeline, updateFrameFn) {
    timeline.eventCallback('onUpdate', () => {
      const progress = timeline.progress(); // value between 0 and 1
      console.log(progress, 'progress');
      updateFrameFn(progress);
    });
  }
  // Observer Height Change
  observerHeightChange = (el, callback) => {
    // Resize Observer
    new ResizeObserver(() => {
      ScrollTrigger.refresh();
      ScrollTrigger.update();
      console.log('%cRefreshed', 'color: green');
    }).observe(document.documentElement);
  };
}

window.addEventListener('load', () => {
  console.log('load');
  new Animation();
});
