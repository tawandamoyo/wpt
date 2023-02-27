'use strict';

promise_test(async t => {
  const iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  iframe.contentWindow.focus();

  await new Promise(resolve => {
    const observer = new PressureObserver(resolve);
    t.add_cleanup(async () => {
      observer.disconnect();
      iframe.remove();
    });
    observer.observe('cpu');
  });
}, 'Observer in main frame should receive PressureRecord when focused on same-origin iframe');

promise_test(async t => {
  const iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  // Focus on the main frame to make the iframe lose focus, so that
  // PressureObserver in the iframe can't receive PressureRecord by default.
  // However, if the iframe is same-origin with the main frame and the main
  // frame has focus, PressureObserver in iframe can receive PressureRecord.
  window.focus();

  await new Promise(resolve => {
    const observer = new iframe.contentWindow.PressureObserver(resolve);
    t.add_cleanup(() => {
      observer.disconnect();
      iframe.remove();
    });
    observer.observe('cpu');
  });
}, 'Observer in iframe should receive PressureRecord when focused on same-origin main frame');
